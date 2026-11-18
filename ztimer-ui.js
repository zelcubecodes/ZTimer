/* ZTimer Web UI layer: the bottom tabs of the ZTimer Android app (Timer, Solves, Stats, Trainer, WCA),
   each one switching the main area to its own page instead of opening a pop-up.
   Copyright (C) 2026 Zel (ZelCubes), GPL-3.0. Written for ZTimer Web; works on top of csTimer's modules. */
(function () {
  'use strict';
  var TABS = [
    ['timer', 'Timer', 'timer'],
    ['solves', 'Solves', 'list'],
    ['stats', 'Stats', 'graph'],
    ['trainer', 'Trainer', 'trainer'],
    ['wca', 'WCA', 'wca']
  ];
  var SETS = [
    ['3x3x3', 'Normal', '333'], ['PLL', 'Permute last layer', 'pll'], ['OLL', 'Orient last layer', 'oll'],
    ['COLL', 'Corners of last layer', 'coll'], ['ZBLL', 'Zborowski-Bruchem LL', 'zbll'], ['CMLL', 'Roux corners', 'cmll'],
    ['ZBLS', 'ZB last slot', 'zbls'], ['ZZLL', 'ZZ last layer', 'zzll'], ['2GLL', 'Two-generator LL', '2gll'],
    ['EOLine', 'Edge orientation + line', 'eoline'], ['F2L', 'First two layers', 'f2l'], ['LL', 'Last layer', 'll'],
    ['LSLL', 'Last slot + last layer', 'lsll2'], ['VLS', 'Valk last slot', 'vls'], ['WVLS', 'Winter variation', 'wvls'],
    ['EOLS', 'EO last slot', 'eols'], ['TTLL', 'Twisty-Twisty LL', 'ttll'], ['2nd block', 'Roux second block', 'sbrx']
  ];
  var PUZZLES = [
    ['WCA puzzles', [['3x3x3', '333'], ['2x2x2', '222so'], ['4x4x4', '444wca'], ['5x5x5', '555wca'], ['6x6x6', '666wca'], ['7x7x7', '777wca'],
      ['Clock', 'clkwca'], ['Megaminx', 'mgmp'], ['Pyraminx', 'pyrso'], ['Skewb', 'skbso'], ['Square-1', 'sqrs'], ['FTO', 'ftoso']]],
    ['Blindfolded and others', [['3x3x3 BLD', '333ni'], ['3x3x3 FMC', '333fm'], ['3x3x3 one-handed', '333oh'], ['4x4x4 BLD', '444bld'],
      ['5x5x5 BLD', '555bld'], ['3x3x3 multi-BLD', 'r3ni']]]
  ];
  var current = 'timer', pages = {}, root, bar, timerId = null, actionbar, drawer, cornerL, cornerR, lastSig = '';

  function icon(n) { return $('<span class="zi zi-' + n + '"></span>'); }
  function pretty(ms) { return ms === Infinity ? 'DNF' : (ms == null ? '-' : kernel.pretty(ms)); }

  /* ---- reading solves from csTimer's stats module ---- */
  function solves() {
    var out = [], i = 0, s;
    try {
      while ((s = stats.timesAt(i)) && i < 100000) {
        var pen = s[0][0], ms = s[0][1];
        out.push({ t: pen < 0 ? Infinity : ms + (pen > 0 ? pen : 0), pen: pen, scr: s[1], cmt: s[2], ts: s[3] });
        i++;
      }
    } catch (e) {}
    return out;
  }
  function avgOf(a, end, n) {
    if (end + 1 < n) return null;
    var w = a.slice(end + 1 - n, end + 1).map(function (x) { return x.t; });
    var trim = Math.ceil(n * 0.05), d = w.filter(function (x) { return x === Infinity; }).length;
    if (d > trim) return Infinity;
    w.sort(function (x, y) { return x - y; });
    w = w.slice(trim, n - trim);
    return w.reduce(function (x, y) { return x + y; }, 0) / w.length;
  }
  function best(vals) {
    var b = null;
    vals.forEach(function (v) { if (v != null && v !== Infinity && (b == null || v < b)) b = v; });
    return b;
  }
  function compute(a) {
    var ok = a.filter(function (x) { return x.t !== Infinity; }).map(function (x) { return x.t; });
    var r = { n: a.length, dnf: a.length - ok.length };
    r.best = ok.length ? Math.min.apply(null, ok) : null;
    r.worst = ok.length ? Math.max.apply(null, ok) : null;
    r.mean = ok.length ? ok.reduce(function (x, y) { return x + y; }, 0) / ok.length : null;
    [5, 12, 100].forEach(function (n) {
      var series = a.map(function (_, i) { return avgOf(a, i, n); });
      r['ao' + n] = series[series.length - 1];
      r['bao' + n] = best(series);
      r['s' + n] = series;
    });
    return r;
  }

  /* ---- page scaffolding ---- */
  function makePage(id, title, ic) {
    var p = $('<div class="zpage" id="zp-' + id + '"></div>');
    var head = $('<div class="zp-head"></div>').append(icon(ic), $('<b class="zp-title"></b>').text(title),
      $('<span class="zp-sub"></span>'),
      $('<button class="zp-gear" title="Options" aria-label="Options"></button>').append(icon('settings')).on('click', function () { $('#leftbar .c1').click(); }));
    p.append(head, $('<div class="zp-body"></div>'));
    p.hide().appendTo(root);
    pages[id] = p;
    return p;
  }
  function subtitle(p) {
    var t = '';
    try { t = $('#scrambleDiv select').first().find('option:selected').text() + ' · session ' + $('#stats select').first().find('option:selected').text(); } catch (e) {}
    p.find('.zp-sub').text(t);
  }

  /* ---- Solves page: a list like the app's, tapping a solve opens csTimer's solve dialog ---- */
  function renderSolves(p) {
    var body = p.find('.zp-body').empty(), a = solves(), src = $('#stats select').first();
    subtitle(p);
    var sel = $('<select class="zsess"></select>').html(src.html()).val(src.val()).on('change', function () {
      src.val($(this).val()).trigger('change'); setTimeout(function () { renderSolves(p); }, 250);
    });
    body.append($('<div class="zsessrow"></div>').append($('<span>Session</span>'), sel,
      $('<span class="zcount"></span>').text(a.length + (a.length === 1 ? ' solve' : ' solves'))));
    if (!a.length) { body.append($('<p class="zp-note"></p>').text('No solves in this session yet. Go to the Timer tab and do a solve.')); return; }
    var list = $('<div class="zlist"></div>').appendTo(body);
    for (var i = a.length - 1; i >= 0; i--) (function (i) {
      var x = a[i], d = x.ts ? new Date(x.ts * 1000) : null;
      var row = $('<div class="zrow"></div>').append(
        $('<span class="zr-d"></span>').text(d ? d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : ''),
        x.cmt ? $('<span class="zr-c zi zi-comment"></span>') : '',
        $('<span class="zr-p"></span>').text(x.pen < 0 ? 'DNF' : (x.pen > 0 ? '+2' : '')),
        $('<span class="zr-t"></span>').text(pretty(x.t)).toggleClass('dnf', x.t === Infinity));
      row.on('click', function () {
        $('#stats tr[data="' + i + '"]').children().eq(1).click();
      }).appendTo(list);
    })(i);
  }

  /* ---- Stats page: cards and a graph like the app ---- */
  function card(label, val, sub) {
    return $('<div class="zcard"></div>').append($('<div class="zc-l"></div>').text(label), $('<div class="zc-v"></div>').text(val),
      sub ? $('<div class="zc-s"></div>').text(sub) : '');
  }
  function drawChart(cv, r, a) {
    var W = cv.parentNode.clientWidth || 320, H = 220, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    var c = cv.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, W, H);
    var vals = a.map(function (x) { return x.t; }).filter(function (x) { return x !== Infinity; });
    if (a.length < 2 || !vals.length) {
      c.fillStyle = 'rgba(255,255,255,.8)'; c.font = '600 14px Quicksand,sans-serif'; c.textAlign = 'center';
      c.fillText('Do a couple of solves to see your graph', W / 2, H / 2); return;
    }
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), pad = (hi - lo) * 0.1 || 500;
    lo = Math.max(0, lo - pad); hi += pad;
    var L = 40, R = 10, T = 10, B = 22, w = W - L - R, h = H - T - B, n = a.length;
    function X(i) { return L + (n === 1 ? w / 2 : w * i / (n - 1)); }
    function Y(v) { return T + h - h * (v - lo) / (hi - lo); }
    c.font = '600 11px Quicksand,sans-serif'; c.textAlign = 'right'; c.fillStyle = 'rgba(255,255,255,.8)'; c.strokeStyle = 'rgba(255,255,255,.15)'; c.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var v = lo + (hi - lo) * g / 4, y = Y(v);
      c.beginPath(); c.moveTo(L, y); c.lineTo(W - R, y); c.stroke(); c.fillText((v / 1000).toFixed(1), L - 6, y + 4);
    }
    function line(series, color, width) {
      c.strokeStyle = color; c.lineWidth = width; c.beginPath(); var on = false;
      series.forEach(function (v, i) {
        if (v == null || v === Infinity) { on = false; return; }
        if (!on) { c.moveTo(X(i), Y(v)); on = true; } else c.lineTo(X(i), Y(v));
      });
      c.stroke();
    }
    line(a.map(function (x) { return x.t; }), '#ffffff', 2.5);
    line(r.s5, '#ff5252', 2); line(r.s12, '#69f0ae', 2); if (n >= 100) line(r.s100, '#18ffff', 2);
    if (r.best != null) {
      var bi = a.findIndex(function (x) { return x.t === r.best; });
      c.fillStyle = '#ffd740'; c.beginPath(); c.arc(X(bi), Y(r.best), 5, 0, 7); c.fill();
    }
    c.fillStyle = 'rgba(255,255,255,.8)'; c.textAlign = 'center'; c.fillText('1', L, H - 6); c.fillText(String(n), W - R, H - 6);
  }
  function renderStats(p) {
    var a = solves(), r = compute(a), body = p.find('.zp-body').empty();
    subtitle(p);
    var cv = document.createElement('canvas');
    body.append($('<div class="zgraph"></div>').append(cv));
    var cards = $('<div class="zcards"></div>').appendTo(body);
    cards.append(card('Solves', r.n, r.dnf ? r.dnf + ' DNF' : ''), card('Best', pretty(r.best)), card('Mean', pretty(r.mean)), card('Worst', pretty(r.worst)));
    [5, 12, 100].forEach(function (n) {
      cards.append(card('ao' + n, r['ao' + n] == null ? '-' : pretty(r['ao' + n]), 'best ' + pretty(r['bao' + n])));
    });
    body.append($('<div class="zlegend"></div>').html('<span style="--c:#fff">time</span><span style="--c:#ff5252">ao5</span><span style="--c:#69f0ae">ao12</span><span style="--c:#18ffff">ao100</span>'));
    drawChart(cv, r, a);
  }

  /* ---- Trainer page: pick a training set ---- */
  function renderTrainer(p) {
    var body = p.find('.zp-body').empty(), cur = kernel.getProp('scrType');
    subtitle(p);
    body.append($('<p class="zp-note"></p>').text('Pick a set. You will get scrambles for that set on the timer. Choose single cases with the filter in the scramble window, as in csTimer.'));
    var grid = $('<div class="ztiles"></div>').appendTo(body);
    SETS.forEach(function (s) {
      $('<button class="ztile"></button>').toggleClass('on', cur === s[2]).append($('<b></b>').text(s[0]), $('<span></span>').text(s[1]))
        .on('click', function () { kernel.setProp('scrType', s[2]); show('timer'); }).appendTo(grid);
    });
  }

  /* ---- WCA page ---- */
  function renderWca(p) {
    var body = p.find('.zp-body').empty(), box = $('<div class="zwca"></div>').appendTo(body);
    p.find('.zp-sub').text('World Cube Association data');
    if (window.zWcaRender) window.zWcaRender(box); else box.text('WCA data is not available.');
  }

  /* ---- Puzzle chooser page (like the app's puzzle dialog) ---- */
  function currentPuzzle() {
    var t = kernel.getProp('scrType'), name = null;
    PUZZLES.forEach(function (g) { g[1].forEach(function (q) { if (q[1] === t) name = q[0]; }); });
    var sels = $('#scrambleDiv select');
    if (!name) name = sels.eq(1).find('option:selected').text() || 'Puzzle';
    return { name: name, cat: sels.eq(0).find('option:selected').text() || '' };
  }
  function renderPuzzles(p) {
    var body = p.find('.zp-body').empty(), cur = kernel.getProp('scrType');
    p.find('.zp-sub').text('Choose what you are solving');
    PUZZLES.forEach(function (g) {
      body.append($('<h3 class="zp-h"></h3>').text(g[0]));
      var grid = $('<div class="ztiles"></div>').appendTo(body);
      g[1].forEach(function (q) {
        $('<button class="ztile"></button>').toggleClass('on', cur === q[1]).append($('<b></b>').text(q[0]))
          .on('click', function () { kernel.setProp('scrType', q[1]); show('timer'); }).appendTo(grid);
      });
    });
    body.append($('<p class="zp-note"></p>').text('More scramble types are in the selectors on the scramble card.'));
  }

  /* ---- App-style top bar ---- */
  function barBtn(ic, title, fn) {
    return $('<button class="za-btn"></button>').attr({ title: title, 'aria-label': title }).append(icon(ic)).on('click', fn);
  }
  function updateBar() {
    var c = currentPuzzle();
    actionbar.find('.za-name').text(c.name); actionbar.find('.za-cat').text(c.cat);
  }
  function closeDrawer() { drawer.removeClass('open'); }
  function buildDrawer() {
    var items = [['settings', 'Options', function () { $('#leftbar .c1').click(); }],
      ['share', 'Export / import', function () { $('#leftbar .c2').click(); }],
      ['category', 'Scramble options', function () { $('#leftbar .c3').click(); }],
      ['build', 'Tools', function () { $('#leftbar .c6').click(); }],
      ['help', 'About and support', function () { $('#leftbar .c5').click(); }]];
    var panel = $('<div class="zd-panel"></div>').append(
      $('<div class="zd-head"></div>').append($('<b></b>').text('ZTimer'), $('<span></span>').text('Web timer for speedcubers')));
    items.forEach(function (it) {
      $('<div class="zd-item" role="button" tabindex="0"></div>').append(icon(it[0]), $('<span></span>').text(it[1]))
        .on('click', function () { closeDrawer(); setTimeout(it[2], 120); }).appendTo(panel);
    });
    panel.append($('<div class="zd-foot"></div>').html('Free software, GPL-3.0<br>Based on csTimer by Shuang Chen<br><a href="https://github.com/zelcubecodes/ZTimer" target="_blank" rel="noopener">github.com/zelcubecodes/ZTimer</a>'));
    drawer = $('<div id="zdrawer"></div>').append($('<div class="zd-dim"></div>').on('click', closeDrawer), panel).appendTo('body');
  }

  /* ---- Corner stats on the timer screen, like the app ---- */
  function updateCorners() {
    if (current !== 'timer') return;
    var a = solves(), sum = 0;
    a.forEach(function (x) { sum += (x.t === Infinity ? 7 : x.t) + x.pen; });
    var sig = a.length + ':' + sum + ':' + kernel.getProp('scrType');
    if (sig === lastSig) return;
    lastSig = sig;
    var r = compute(a);
    cornerL.html(a.length ? 'solves <b>' + r.n + '</b><br>best <b>' + pretty(r.best) + '</b><br>worst <b>' + pretty(r.worst) + '</b>' : '');
    cornerR.html(a.length ? 'ao5 <b>' + (r.ao5 == null ? '-' : pretty(r.ao5)) + '</b><br>ao12 <b>' + (r.ao12 == null ? '-' : pretty(r.ao12)) + '</b><br>mean <b>' + pretty(r.mean) + '</b>' : '');
  }

  /* ---- switching ---- */
  function keyBlock(e) {
    if (current === 'timer') return;
    var t = e.target && e.target.tagName;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(t) || (e.target && e.target.isContentEditable)) return;
    e.stopPropagation();
  }
  function show(id) {
    current = id;
    bar.find('.ztab').each(function () { $(this).toggleClass('on', $(this).data('p') === id); });
    clearInterval(timerId); timerId = null;
    $('html').toggleClass('zpage-open', id !== 'timer');
    closeDrawer();
    if (id === 'timer') { root.hide(); lastSig = ''; updateBar(); updateCorners(); return; }
    kernel.hideDialog();
    root.show(); $.each(pages, function (k, p) { p.toggle(k === id); });
    var p = pages[id];
    if (id === 'solves') renderSolves(p);
    if (id === 'stats') { renderStats(p); timerId = setInterval(function () { renderStats(p); }, 4000); }
    if (id === 'trainer') renderTrainer(p);
    if (id === 'puzzles') renderPuzzles(p);
    if (id === 'wca') renderWca(p);
    p.find('.zp-body').scrollTop(0);
  }

  function init() {
    var z = $('#zbar');
    if (!z.length) return;
    bar = z.empty();
    TABS.forEach(function (t) {
      $('<div class="ztab" role="button" tabindex="0"></div>').data('p', t[0]).attr({ title: t[1], 'aria-label': t[1] })
        .append(icon(t[2])).on('click', function () { show(t[0]); }).appendTo(bar);
    });
    root = $('<div id="zpages"></div>').hide().appendTo('body');
    makePage('solves', 'Solves', 'list'); makePage('stats', 'Stats', 'graph');
    makePage('trainer', 'Trainer', 'trainer'); makePage('wca', 'WCA', 'wca'); makePage('puzzles', 'Puzzle', 'category');
    actionbar = $('<div id="zactionbar"></div>').append(
      barBtn('menu', 'Menu', function () { drawer.addClass('open'); }),
      $('<div class="za-title" role="button" tabindex="0"></div>').append($('<b class="za-name"></b>'), $('<span class="za-cat"></span>'))
        .on('click', function () { show('puzzles'); }),
      barBtn('settings', 'Options', function () { $('#leftbar .c1').click(); })).appendTo('body');
    buildDrawer();
    cornerL = $('<div id="zcorner-l" class="zcorner"></div>').appendTo('body');
    cornerR = $('<div id="zcorner-r" class="zcorner"></div>').appendTo('body');
    setInterval(function () { if (current === 'timer') { updateBar(); updateCorners(); } }, 700);
    [['Delete', 'remove'], ['Retry', 'retry'], ['DNF', 'dnf'], ['Add 2', 'plus2'], ['Comment', 'comment']].forEach(function (m) {
      $('#zquick input').filter(function () { return (this.title || '').indexOf(m[0]) === 0; }).addClass('zq zi-' + m[1]).val('');
    });
    document.addEventListener('keydown', keyBlock, true);
    document.addEventListener('keyup', keyBlock, true);
    show('timer');
    $(window).on('resize', function () { if (current === 'stats') renderStats(pages.stats); });
  }
  $(function () { setTimeout(init, 0); });
})();
