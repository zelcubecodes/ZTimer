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
  /* The app's colour themes: name, gradient start, gradient end, action bar, tab bar, accent, dark text? */
  var THEMES = [
    ['ZTimer', '1959ff', '3b12ff', '0045f6', '2900ef', 'ffd740', 0], ['Pink', 'ff577e', 'fd61c0', 'ff678a', 'fd50b9', 'c1fd61', 0],
    ['Purple', '673ab7', '512da8', '6e40c2', '4b299b', 'ffc400', 0], ['Violet', '920ee6', '6304e9', '9b14f1', '5503c8', 'ffc107', 0],
    ['Deep purple', 'ed1e79', '662d8c', 'd81169', '5d297f', 'ffc400', 0], ['Orange', 'ed1c24', 'ff6219', 'd61119', 'e54900', '19c2ff', 0],
    ['Brown', '5c3c30', '422a24', '724b3c', '37231e', 'ffd740', 0], ['Black', '000000', '000000', '000000', '000000', 'ffd740', 0],
    ['Light blue', '3afafa', '42f7cd', '5bfbfb', '31f7c9', 'f76642', 1], ['Light green', 'a8ff78', '78ffd6', 'bbff96', '93ffb9', 'ff8f78', 1],
    ['Cyan', '00ffa1', '00ffff', '55ffc0', '66ffff', 'ff4000', 1], ['Teal', '18ff97', '24f594', '29ff9f', '0bec84', 'f53f24', 1],
    ['Green', '6cf63e', '15ff8e', '78f74e', '00f27d', 'ff3415', 1], ['Red', 'fbb74c', 'ff5656', 'fcc46d', 'ff5656', '56ff56', 1],
    ['Yellow', 'ffeb7e', 'fffd69', 'ffee8f', 'fffd7a', 'ff80ab', 1], ['Dawn', 'fccb90', 'd57eeb', 'fddab1', 'd06fe9', 'ebe07e', 1],
    ['Mint', 'c6ffbd', 'ffffff', 'd5ffce', 'f2fff0', 'ff5252', 1], ['Ice', 'fffeff', 'd7fffe', 'fffeff', 'e8fffe', 'ff5252', 1],
    ['White', 'ffffff', 'ffffff', 'fffeff', 'ffffff', 'ff5252', 1]
  ];
  function themeVars(t) {
    var light = !!t[6];
    return { light: light, bar: '#' + t[3], vars: {
      '--zt-a': '#' + t[1], '--zt-b': '#' + t[2], '--zt-bar': '#' + t[3], '--zt-tab': '#' + t[4], '--zt-amber': '#' + t[5],
      '--zt-fg': light ? '#161616' : '#ffffff', '--zt-onlink': '#ffffff', '--zt-link': '#2962ff',
      '--zt-glass': light ? 'rgba(0,0,0,.07)' : (t[0] === 'Black' ? 'rgba(255,255,255,.08)' : 'rgba(10,12,90,.30)'),
      '--zt-shadow': light ? 'none' : '0 4px 24px rgba(0,0,40,.35)', '--zt-shadow2': light ? 'none' : '0 1px 6px rgba(0,0,40,.35)' } };
  }
  function applyTheme(i, save) {
    var t = THEMES[i] || THEMES[0], v = themeVars(t), root = document.documentElement;
    for (var k in v.vars) root.style.setProperty(k, v.vars[k]);
    $('html').toggleClass('zt-light', v.light);
    $('meta[name=theme-color]').attr('content', v.bar);
    if (save) { try { document.cookie = 'ztimerTheme=' + encodeURIComponent(JSON.stringify({ i: i, light: v.light, vars: v.vars })) + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {} }
    lastSig = '';
  }
  function savedTheme() {
    try {
      var m = /(?:^|; )ztimerTheme=([^;]*)/.exec(document.cookie), n = m ? JSON.parse(decodeURIComponent(m[1])).i : 0;
      return n >= 0 && n < THEMES.length ? n : 0;
    } catch (e) { return 0; }
  }
  function fg() { return (getComputedStyle(document.documentElement).getPropertyValue('--zt-fg') || '#fff').trim(); }

  var current = 'timer', pages = {}, root, bar, timerId = null, actionbar, drawer, cornerL, cornerR, lastSig = '', sortMode = 'new', prev = null, toastTimer = null;

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
      $('<button class="zp-gear" title="Options" aria-label="Options"></button>').append(icon('settings')).on('click', function () { show('options'); }));
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
      $('<span class="zcount"></span>').text(a.length + (a.length === 1 ? ' solve' : ' solves')),
      $('<button class="zadd">+ Add time</button>').on('click', function () { addTimeDialog(function () { renderSolves(p); }); })));
    var chips = $('<div class="zchips"></div>').appendTo(body);
    [['new', 'Newest'], ['old', 'Oldest'], ['best', 'Fastest'], ['worst', 'Slowest']].forEach(function (m) {
      $('<button class="zchip"></button>').text(m[1]).toggleClass('on', sortMode === m[0]).on('click', function () { sortMode = m[0]; renderSolves(p); }).appendTo(chips);
    });
    if (!a.length) { body.append($('<p class="zp-note"></p>').text('No solves in this session yet. Go to the Timer tab and do a solve.')); return; }
    var list = $('<div class="zlist"></div>').appendTo(body);
    var order = a.map(function (_, i) { return i; });
    if (sortMode === 'new') order.reverse();
    else if (sortMode === 'best') order.sort(function (u, v) { return a[u].t - a[v].t || u - v; });
    else if (sortMode === 'worst') order.sort(function (u, v) { return (a[v].t === a[u].t ? 0 : a[v].t - a[u].t) || v - u; });
    order.forEach(function (i) {
      var x = a[i], d = x.ts ? new Date(x.ts * 1000) : null;
      var row = $('<div class="zrow"></div>').append(
        $('<span class="zr-d"></span>').text(d ? d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : ''),
        x.cmt ? $('<span class="zr-c zi zi-comment"></span>') : '',
        $('<span class="zr-p"></span>').text(x.pen < 0 ? 'DNF' : (x.pen > 0 ? '+2' : '')),
        $('<span class="zr-t"></span>').text(pretty(x.t)).toggleClass('dnf', x.t === Infinity));
      row.on('click', function () {
        $('#stats tr[data="' + i + '"]').children().eq(1).click();
      }).appendTo(list);
    });
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
      c.fillStyle = fg(); c.font = '600 14px Quicksand,sans-serif'; c.textAlign = 'center';
      c.fillText('Do a couple of solves to see your graph', W / 2, H / 2); return;
    }
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), pad = (hi - lo) * 0.1 || 500;
    lo = Math.max(0, lo - pad); hi += pad;
    var L = 40, R = 10, T = 10, B = 22, w = W - L - R, h = H - T - B, n = a.length;
    function X(i) { return L + (n === 1 ? w / 2 : w * i / (n - 1)); }
    function Y(v) { return T + h - h * (v - lo) / (hi - lo); }
    c.font = '600 11px Quicksand,sans-serif'; c.textAlign = 'right'; c.fillStyle = fg(); c.strokeStyle = fg(); c.globalAlpha = 1; c.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var v = lo + (hi - lo) * g / 4, y = Y(v);
      c.globalAlpha = .18; c.beginPath(); c.moveTo(L, y); c.lineTo(W - R, y); c.stroke(); c.globalAlpha = .85; c.fillText((v / 1000).toFixed(1), L - 6, y + 4); c.globalAlpha = 1;
    }
    function line(series, color, width) {
      c.strokeStyle = color; c.lineWidth = width; c.beginPath(); var on = false;
      series.forEach(function (v, i) {
        if (v == null || v === Infinity) { on = false; return; }
        if (!on) { c.moveTo(X(i), Y(v)); on = true; } else c.lineTo(X(i), Y(v));
      });
      c.stroke();
    }
    line(a.map(function (x) { return x.t; }), fg(), 2.5);
    line(r.s5, '#ff5252', 2); line(r.s12, '#69f0ae', 2); if (n >= 100) line(r.s100, '#18ffff', 2);
    if (r.best != null) {
      var bi = a.findIndex(function (x) { return x.t === r.best; });
      c.fillStyle = '#ffd740'; c.beginPath(); c.arc(X(bi), Y(r.best), 5, 0, 7); c.fill();
    }
    c.fillStyle = fg(); c.textAlign = 'center'; c.fillText('1', L, H - 6); c.fillText(String(n), W - R, H - 6);
  }
  function drawHistogram(cv, a) {
    var W = cv.parentNode.clientWidth || 320, H = 170, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    var c = cv.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, W, H); c.textAlign = 'center';
    var v = a.map(function (x) { return x.t; }).filter(function (x) { return x !== Infinity; });
    if (v.length < 3) { c.fillStyle = fg(); c.font = '600 14px Quicksand,sans-serif'; c.fillText('Needs at least 3 solves', W / 2, H / 2); return; }
    var lo = Math.min.apply(null, v), hi = Math.max.apply(null, v), steps = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 60000], bw = 60000;
    for (var i = 0; i < steps.length; i++) if (Math.ceil((hi - lo + 1) / steps[i]) <= 10) { bw = steps[i]; break; }
    var start = Math.floor(lo / bw) * bw, n = Math.max(1, Math.ceil((hi - start + 1) / bw)), bins = [], mx = 0;
    for (var b = 0; b < n; b++) bins.push(0);
    v.forEach(function (t) { var k = Math.min(n - 1, Math.floor((t - start) / bw)); bins[k]++; if (bins[k] > mx) mx = bins[k]; });
    var L = 8, R = 8, T = 18, B = 22, w = (W - L - R) / n, h = H - T - B;
    c.font = '700 11px Quicksand,sans-serif';
    bins.forEach(function (k, j) {
      var bh = h * k / mx, x = L + j * w;
      c.globalAlpha = .9; c.fillStyle = fg(); c.fillRect(x + 3, T + h - bh, w - 6, bh);
      c.globalAlpha = 1; if (k) c.fillText(String(k), x + w / 2, T + h - bh - 4);
      c.globalAlpha = .85; c.fillText(((start + j * bw) / 1000).toFixed(bw < 1000 ? 1 : 0), x + w / 2, H - 6); c.globalAlpha = 1;
    });
  }
  function renderStats(p) {
    var a = solves(), r = compute(a), body = p.find('.zp-body').empty();
    subtitle(p);
    var cv = document.createElement('canvas');
    body.append($('<div class="zgraph"></div>').append(cv));
    var hv = document.createElement('canvas');
    body.append($('<h3 class="zp-h">Time distribution</h3>'), $('<div class="zgraph"></div>').append(hv));
    var cards = $('<div class="zcards"></div>').appendTo(body);
    cards.append(card('Solves', r.n, r.dnf ? r.dnf + ' DNF' : ''), card('Best', pretty(r.best)), card('Mean', pretty(r.mean)), card('Worst', pretty(r.worst)));
    [5, 12, 100].forEach(function (n) {
      cards.append(card('ao' + n, r['ao' + n] == null ? '-' : pretty(r['ao' + n]), 'best ' + pretty(r['bao' + n])));
    });
    body.append($('<div class="zlegend"></div>').html('<span style="--c:var(--zt-fg)">time</span><span style="--c:#ff5252">ao5</span><span style="--c:#69f0ae">ao12</span><span style="--c:#18ffff">ao100</span>'));
    body.append($('<button class="zshare"></button>').append(icon('share'), $('<span>Copy summary</span>')).on('click', function () { copySummary(a, r); }));
    renderPbHistory(body, a);
    drawChart(cv, r, a); drawHistogram(hv, a);
  }
  function copySummary(a, r) {
    var c = currentPuzzle(), f = function (v) { return v == null ? '-' : pretty(v); };
    var txt = 'ZTimer Web session summary\n' + c.name + (c.cat ? ' (' + c.cat + ')' : '') + '\n' +
      'Solves: ' + r.n + (r.dnf ? ' (' + r.dnf + ' DNF)' : '') + '\nBest: ' + f(r.best) + '\nMean: ' + f(r.mean) + '\nWorst: ' + f(r.worst) + '\n' +
      'Current ao5: ' + f(r.ao5) + ' (best ' + f(r.bao5) + ')\nCurrent ao12: ' + f(r.ao12) + ' (best ' + f(r.bao12) + ')\n' +
      'Current ao100: ' + f(r.ao100) + ' (best ' + f(r.bao100) + ')\n\nTimes: ' + a.map(function (x) { return pretty(x.t) + (x.pen > 0 ? '+' : ''); }).join(', ');
    function ok() { toast('<b>Copied!</b><br>Session summary is on your clipboard'); }
    function fallback() {
      var t = $('<textarea style="position:fixed;opacity:0"></textarea>').val(txt).appendTo('body'); t[0].select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast('Could not copy'); } t.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
  }

  /* ---- Trainer page: pick a training set ---- */
  function renderTrainer(p) {
    var body = p.find('.zp-body').empty(), cur = kernel.getProp('scrType');
    subtitle(p);
    body.append($('<p class="zp-note"></p>').text('Pick a set. You will get scrambles for that set on the timer. Choose single cases with the filter in the scramble window, as in csTimer.'));
    var gear = $('#scrambleDiv input.icon');
    $('<button class="zshare"></button>').append(icon('settings'), $('<span>Choose cases for the current set</span>')).prop('disabled', gear.prop('disabled'))
      .on('click', function () { show('timer'); setTimeout(function () { $('#scrambleDiv input.icon').click(); }, 250); }).css('margin', '0 4px 14px').appendTo(body);
    var grid = $('<div class="ztiles"></div>').appendTo(body);
    SETS.forEach(function (s) {
      $('<button class="ztile"></button>').toggleClass('on', cur === s[2]).append($('<b></b>').text(s[0]), $('<span></span>').text(s[1]))
        .on('click', function () { kernel.setProp('scrType', s[2]); show('timer'); if (s[2] !== '333') toast('<b>' + s[0] + '</b> scrambles are on.<br>Use the scramble card to choose cases.'); }).appendTo(grid);
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
    var items = [['settings', 'Options', function () { show('options'); }],
      ['edit', 'Add time', function () { addTimeDialog(function () { if (current !== 'timer') show(current); }); }],
      ['books', 'Sessions', function () { show('sessions'); }],
      ['checklist', 'Goals and streaks', function () { show('goals'); }],
      ['palette', 'Theme', function () { show('themes'); }],
      ['archive', 'Backup and import', function () { show('backup'); }],
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

  function scrambleButtons() {
    var card = $('#scrambleDiv');
    if (!card.length) return;
    var nb = card.find('.title > nobr').eq(1), spans = nb.children('span');
    if (!card.children('.zscrb').length) {
      var box = $('<div class="zscrb"></div>').appendTo(card);
      $('<button class="zsb zsb-last" title="Previous scramble" aria-label="Previous scramble"></button>').append(icon('undo')).on('click', function () {
        card.find('.title > nobr').eq(1).children('span').eq(0).click();
      }).appendTo(box);
      $('<button class="zsb" title="New scramble" aria-label="New scramble"></button>').append(icon('retry')).on('click', function () {
        card.find('.title > nobr').eq(1).children('span').eq(1).click();
      }).appendTo(box);
    }
    card.find('.zsb-last').toggleClass('off', !spans.eq(0).hasClass('click'));
  }
  function placeCorners() {
    if (!cornerR) return;
    var tw = $('#toolsDiv'), r = tw.length && tw.is(':visible') ? tw[0].getBoundingClientRect() : null;
    cornerR.css('right', r && r.width ? Math.max(16, window.innerWidth - r.left + 12) + 'px' : '');
  }

  /* ---- Corner stats on the timer screen, like the app ---- */
  function updateCorners() {
    if (current !== 'timer') return;
    var a = solves(), sum = 0;
    a.forEach(function (x) { sum += (x.t === Infinity ? 7 : x.t) + x.pen; });
    var sig = a.length + ':' + sum + ':' + kernel.getProp('scrType');
    if (sig === lastSig) return;
    lastSig = sig;
    var r = compute(a), st = kernel.getProp('scrType');
    if (prev && prev.st === st && a.length === prev.n + 1 && prev.best != null && r.best != null && r.best < prev.best && a[a.length - 1].t === r.best)
      toast('Congratulations!<br>You just beat your personal best by <b>' + pretty(prev.best - r.best) + '</b>');
    else if (prev && prev.st === st && a.length === prev.n + 1 && prev.ao5 != null && r.ao5 != null && r.ao5 !== Infinity && r.ao5 === r.bao5 && r.ao5 < prev.bao5)
      toast('<b>New average best!</b><br>ao5 ' + pretty(r.ao5));
    prev = { st: st, n: a.length, best: r.best, ao5: r.ao5, bao5: r.bao5 };
    cornerL.html(a.length ? 'solves <b>' + r.n + '</b><br>best <b>' + pretty(r.best) + '</b><br>worst <b>' + pretty(r.worst) + '</b>' : '');
    cornerR.html(a.length ? 'ao5 <b>' + (r.ao5 == null ? '-' : pretty(r.ao5)) + '</b><br>ao12 <b>' + (r.ao12 == null ? '-' : pretty(r.ao12)) + '</b><br>mean <b>' + pretty(r.mean) + '</b>' : '');
  }

  /* ---- Add a time by hand (like the app's Add time dialog) ---- */
  function parseTime(str) {
    str = String(str).trim().replace(',', '.');
    var m = /^(?:(\d+):)?(\d+)(?:\.(\d{1,3}))?$/.exec(str);
    if (!m) return null;
    var ms = (parseInt(m[1] || '0', 10) * 60 + parseInt(m[2], 10)) * 1000 + (m[3] ? Math.round(parseFloat('0.' + m[3]) * 1000) : 0);
    return ms > 0 ? ms : null;
  }
  function addTimeDialog(done) {
    var pen = 0, ov = $('<div class="zmodal"></div>'), card = $('<div class="zm-card"></div>').appendTo(ov);
    var inp = $('<input type="text" inputmode="decimal" placeholder="12.34" autocomplete="off">');
    var chips = $('<div class="zm-chips"></div>');
    [['None', 0], ['+2', 2000], ['DNF', -1]].forEach(function (c) {
      $('<button class="zm-chip"></button>').text(c[0]).toggleClass('on', c[1] === 0).on('click', function () {
        pen = c[1]; chips.find('.zm-chip').removeClass('on'); $(this).addClass('on');
      }).appendTo(chips);
    });
    var hint = $('<p class="zm-hint">Type seconds like 12.34, or 1:05.20 for minutes.</p>');
    function close() { ov.remove(); }
    function add() {
      var ms = parseTime(inp.val());
      if (!ms) { hint.text('That is not a time. Try 12.34 or 1:05.20').css('color', '#d32f2f'); return; }
      kernel.pushSignal('time', [pen, ms]);
      close(); lastSig = ''; setTimeout(function () { if (done) done(); toast('Time added: <b>' + pretty(pen < 0 ? Infinity : ms + (pen > 0 ? pen : 0)) + '</b>'); }, 150);
    }
    card.append($('<h3>Add time</h3>'), inp, chips, hint,
      $('<div class="zm-btns"></div>').append($('<button class="zm-btn">Cancel</button>').on('click', close), $('<button class="zm-btn pri">Add</button>').on('click', add)));
    inp.on('keydown', function (e) { if (e.which === 13) add(); if (e.which === 27) close(); });
    ov.on('click', function (e) { if (e.target === ov[0]) close(); }).appendTo('body');
    setTimeout(function () { inp.focus(); }, 50);
  }
  function toast(html) {
    var t = $('#ztoast');
    if (!t.length) t = $('<div id="ztoast"></div>').appendTo('body');
    t.html(html).addClass('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.removeClass('show'); }, 3800);
  }

  /* ---- Theme page: the app's colour themes ---- */
  function renderThemes(p) {
    var body = p.find('.zp-body').empty(), cur = savedTheme();
    p.find('.zp-sub').text('Colours from the ZTimer app');
    var grid = $('<div class="zthemes"></div>').appendTo(body);
    THEMES.forEach(function (t, i) {
      var v = themeVars(t), c = v.light ? '#161616' : '#ffffff';
      $('<button class="ztheme"></button>').css({ background: 'linear-gradient(160deg,#' + t[1] + ',#' + t[2] + ')', color: c }).toggleClass('on', i === cur)
        .append(i === cur ? icon('settings').removeClass('zi-settings').addClass('zi-check') : '', $('<span></span>').text(t[0]), $('<i></i>').css('background', '#' + t[3]))
        .on('click', function () { applyTheme(i, true); renderThemes(p); }).appendTo(grid);
    });
  }


  /* ---- Options page: the app's settings as grouped cards. Each row reads and writes csTimer's real settings. ----
     Row types: ['sw', key, title, summary] switch, ['sel', key, title, summary, [[value,label],...]] choice,
     ['num', key, title, summary, min, max] number, ['go', title, summary, fn] link to another screen. */
  var OPTIONS = [
    ['Inspection', [
      ['sel', 'useIns', 'WCA inspection', 'Count down 15 seconds before the solve starts', [['a', 'Always (hold to start)'], ['ap', 'Always (release to start)'], ['b', 'Except blindfolded (hold)'], ['bp', 'Except blindfolded (release)'], ['n', 'Never']]],
      ['sw', 'showIns', 'Inspection icon', 'Show an icon when inspection is switched on'],
      ['sel', 'voiceIns', 'Spoken alerts', 'Says 8 seconds and 12 seconds during inspection', [['n', 'Off'], ['1', 'Male voice'], ['2', 'Female voice']]],
      ['num', 'voiceVol', 'Alert volume', 'Volume of the spoken alerts', 1, 100]
    ]],
    ['Timer behaviour', [
      ['sw', 'useMilli', 'Thousandths', 'Show the time to three decimals instead of two'],
      ['sel', 'preTime', 'Hold to start', 'How long to hold before the timer is ready (seconds)', [[0, 'No wait'], [300, '0.3'], [550, '0.55'], [1000, '1']]],
      ['sel', 'stopKey', 'Stop the timer with', 'Which keys stop a running solve', [['a', 'Any key'], ['l', 'Space or letters'], ['s', 'Space only']]],
      ['sw', 'useMouse', 'Mouse or touch timer', 'Tap the timer to start and stop'],
      ['sel', 'timeU', 'Timer update', 'How the time is shown while solving', [['u', 'Every frame'], ['c', 'Every 0.1 s'], ['s', 'Seconds only'], ['i', 'Inspection only'], ['n', 'Hidden']]],
      ['sel', 'input', 'Input method', 'How times are entered', [['t', 'Timer'], ['i', 'Typing'], ['s', 'Stackmat'], ['m', 'MoYu timer'], ['v', 'Virtual cube'], ['g', 'Bluetooth cube'], ['q', 'qCube'], ['b', 'Bluetooth timer'], ['l', 'Last layer training']]],
      ['num', 'phases', 'Multi-phase', 'Number of phases to record in one solve', 1, 10],
      ['sw', 'phaseBeep', 'Phase beep', 'Beep when a phase time is recorded']
    ]],
    ['Scramble', [
      ['num', 'scrSize', 'Scramble text size', 'Size of the scramble text', 5, 50],
      ['sw', 'scrMono', 'Monospaced scramble', 'Use a fixed-width font for the scramble'],
      ['sel', 'scrAlign', 'Scramble alignment', '', [['c', 'Centre'], ['l', 'Left'], ['r', 'Right']]],
      ['sel', 'scrNeut', 'Colour neutral', 'Scrambles that suit your chosen cross faces', [['n', 'None'], ['1', 'Single face'], ['2', 'Two faces'], ['6', 'Six faces']]],
      ['sel', 'scrClk', 'Tap the scramble', 'What happens when you tap the scramble text', [['n', 'Nothing'], ['c', 'Copy it'], ['+', 'Next scramble']]],
      ['sw', 'scrFast', 'Fast 4x4x4 scrambles', 'Quicker, but not official random-state'],
      ['sw', 'scrKeyM', 'Mark key moves', 'Label key moves in the scramble']
    ]],
    ['Timer appearance', [
      ['sw', 'ahide', 'Hide while solving', 'Hide everything except the time during a solve'],
      ['num', 'timerSize', 'Timer size', 'Size of the digits', 1, 100],
      ['sw', 'smallADP', 'Small decimals', 'Show the digits after the point smaller'],
      ['sel', 'font', 'Timer font', '', [['r', 'Random digital'], ['Arial', 'Normal'], ['lcd', 'Digital 1'], ['lcd2', 'Digital 2'], ['lcd3', 'Digital 3'], ['lcd4', 'Digital 4'], ['lcd5', 'Digital 5'], ['Roboto', 'Roboto']]],
      ['num', 'imgSize', 'Scramble image size', 'Size of the scramble picture', 5, 50],
      ['sw', 'zQuick', 'Quick buttons', 'Delete, Retry, DNF, +2 and Comment under the timer'],
      ['sw', 'zBar', 'Bottom tabs', 'Show the Timer, Solves, Stats, Trainer and WCA tabs'],
      ['go', 'Colour theme', 'Pick one of the app\u2019s themes', function () { show('themes'); }]
    ]],
    ['Statistics', [
      ['sel', 'trim', 'Trim for averages', 'How many best and worst solves an average ignores', [['0', 'None'], ['1', 'One each side'], ['p1', '1%'], ['p5', '5%'], ['p10', '10%'], ['p20', '20%'], ['m', 'Median']]],
      ['sw', 'statsum', 'Summary', 'Show a summary before the solve list'],
      ['sw', 'statthres', 'Target time', 'Show the time needed to beat your session best'],
      ['sw', 'statbpa', 'Best possible average', 'Show BPA in the statistics'],
      ['sw', 'statwpa', 'Worst possible average', 'Show WPA in the statistics'],
      ['sw', 'printScr', 'Scrambles in the list', 'Print scrambles when exporting or sharing'],
      ['sw', 'printDate', 'Dates in the list', 'Print the date of each solve'],
      ['sw', 'delmul', 'Delete several solves', 'Allow multi-select deletion']
    ]],
    ['Other', [
      ['sw', 'useKSC', 'Keyboard shortcuts', 'Use keyboard shortcuts on a computer'],
      ['sw', 'useGES', 'Gestures', 'Use swipe gestures on a touch screen'],
      ['go', 'All csTimer settings', 'Open the full settings window for anything not listed here', function () { $('#leftbar .c1').click(); }]
    ]]
  ];
  function optRow(o, p) {
    var row = $('<div class="zopt"></div>'), text = $('<div class="zo-t"></div>').append($('<b></b>').text(o[0] === 'go' ? o[1] : o[2]));
    var sum = o[0] === 'go' ? o[2] : o[3];
    if (sum) text.append($('<span></span>').text(sum));
    row.append(text);
    if (o[0] === 'go') { row.addClass('go').on('click', o[3]).append('<i class="zchev"></i>'); return row; }
    var key = o[1], cur = kernel.getProp(key);
    if (o[0] === 'sw') {
      var sw = $('<button class="zsw" role="switch"></button>').toggleClass('on', !!cur).attr('aria-checked', !!cur).append('<i></i>');
      row.addClass('tap').on('click', function () { var v = !kernel.getProp(key); kernel.setProp(key, v); sw.toggleClass('on', v).attr('aria-checked', v); lastSig = ''; });
      row.append(sw);
    } else if (o[0] === 'sel') {
      var s = $('<select class="zosel"></select>'), idx = 0;
      o[4].forEach(function (c, i) { $('<option></option>').val(i).text(c[1]).appendTo(s); if (String(c[0]) === String(cur)) idx = i; });
      s.val(idx).on('change', function () { kernel.setProp(key, o[4][+this.value][0]); lastSig = ''; });
      row.append(s);
    } else if (o[0] === 'num') {
      var out = $('<span class="zo-n"></span>').text(cur), r = $('<input type="range" class="zorange">').attr({ min: o[4], max: o[5] }).val(cur);
      r.on('input', function () { out.text(this.value); }).on('change', function () { kernel.setProp(key, +this.value); lastSig = ''; });
      row.addClass('num').append(out, r);
    }
    return row;
  }
  function renderOptions(p) {
    var body = p.find('.zp-body').empty();
    p.find('.zp-sub').text('Changes save as you make them');
    OPTIONS.forEach(function (g) {
      var card = $('<div class="zocard"></div>').append($('<h3></h3>').text(g[0]));
      g[1].forEach(function (o) {
        var known = o[0] === 'go' || kernel.getProp(o[1]) !== undefined;
        if (known) card.append(optRow(o, p));
      });
      body.append(card);
    });
    body.append($('<p class="zp-note"></p>').text('ZTimer Web is free software (GPL-3.0), based on csTimer.'));
  }


  /* ---- small cookie store for goals ---- */
  function getGoals() {
    var g = { daily: 25, target: 0 };
    try { var m = /(?:^|; )ztimerGoals=([^;]*)/.exec(document.cookie); if (m) { var o = JSON.parse(decodeURIComponent(m[1])); g.daily = +o.daily || 25; g.target = +o.target || 0; } } catch (e) {}
    return g;
  }
  function setGoals(g) { try { document.cookie = 'ztimerGoals=' + encodeURIComponent(JSON.stringify(g)) + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {} }
  function dayKey(ts) { var d = new Date(ts * 1000); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  /* ---- Stats: personal best history (single, ao5, ao12) with dates ---- */
  function pbHistory(a) {
    var out = [], bs = null, b5 = null, b12 = null;
    a.forEach(function (x, i) {
      if (x.t !== Infinity && (bs == null || x.t < bs)) { bs = x.t; out.push(['Single', x.t, x.ts]); }
      var v5 = avgOf(a, i, 5), v12 = avgOf(a, i, 12);
      if (v5 != null && v5 !== Infinity && (b5 == null || v5 < b5)) { b5 = v5; out.push(['ao5', v5, x.ts]); }
      if (v12 != null && v12 !== Infinity && (b12 == null || v12 < b12)) { b12 = v12; out.push(['ao12', v12, x.ts]); }
    });
    return out.reverse().slice(0, 30);
  }
  function renderPbHistory(body, a) {
    var h = pbHistory(a);
    body.append($('<h3 class="zp-h">Personal best history</h3>'));
    if (!h.length) { body.append($('<p class="zp-note"></p>').text('Your records will appear here as you improve.')); return; }
    var list = $('<div class="zlist zpbl"></div>').appendTo(body);
    h.forEach(function (x) {
      $('<div class="zrow zpb"></div>').append($('<span class="zpb-k"></span>').text(x[0]),
        $('<span class="zpb-d"></span>').text(x[2] ? new Date(x[2] * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''),
        $('<span class="zr-t"></span>').text(pretty(x[1]))).appendTo(list);
    });
  }

  /* ---- Sessions page: switch sessions with the app's cards ---- */
  function renderSessions(p) {
    var body = p.find('.zp-body').empty(), src = $('#stats select').first();
    p.find('.zp-sub').text('Tap a session to switch to it');
    var cur = src.val();
    src.find('option').each(function () {
      var v = $(this).val(), row = $('<div class="zrow zsessrow2"></div>').toggleClass('cur', v === cur)
        .append($('<span class="zs-n"></span>').text($(this).text()), v === cur ? $('<span class="zs-c">current</span>') : '');
      row.on('click', function () { src.val(v).trigger('change'); setTimeout(function () { renderSessions(p); }, 250); }).appendTo(body);
    });
    body.append($('<button class="zshare"></button>').append(icon('settings'), $('<span>New, rename, merge or delete</span>')).on('click', function () {
      try { stats.getSessionManager().getButton().click(); } catch (e) { $('#stats input.icon').first().click(); }
    }));
  }

  /* ---- Goals page: daily goal, streak, practice calendar ---- */
  function renderGoals(p) {
    var body = p.find('.zp-body').empty(), a = solves(), g = getGoals(), days = {}, today = dayKey(Date.now() / 1000);
    p.find('.zp-sub').text('This session\u2019s solves');
    a.forEach(function (x) { if (x.ts) days[dayKey(x.ts)] = (days[dayKey(x.ts)] || 0) + 1; });
    var n = days[today] || 0, streak = 0, d = new Date();
    if (!days[dayKey(d.getTime() / 1000)]) d.setDate(d.getDate() - 1);
    while (days[dayKey(d.getTime() / 1000)]) { streak++; d.setDate(d.getDate() - 1); }
    var under = g.target ? a.filter(function (x) { return x.ts && dayKey(x.ts) === today && x.t < g.target * 1000; }).length : 0;
    var cards = $('<div class="zcards"></div>').appendTo(body);
    cards.append(card('Today', n + ' / ' + g.daily, n >= g.daily ? 'Goal reached!' : (g.daily - n) + ' to go'),
      card('Streak', streak + (streak === 1 ? ' day' : ' days'), 'in a row'),
      card('Practice days', Object.keys(days).length, 'in this session'));
    if (g.target) cards.append(card('Sub-' + g.target, under, 'solves under ' + g.target + ' s today'));
    var bar = $('<div class="zgbar"></div>').append($('<i></i>').css('width', Math.min(100, 100 * n / g.daily) + '%'));
    body.append($('<h3 class="zp-h">Daily goal</h3>'), bar);
    function stepper(label, key, step, min, max) {
      var out = $('<b></b>').text(g[key] || 'off');
      return $('<div class="zopt zstep"></div>').append($('<div class="zo-t"></div>').append($('<b></b>').text(label)),
        $('<button class="zchip">\u2212</button>').on('click', function () { g[key] = Math.max(min, (g[key] || 0) - step); setGoals(g); renderGoals(p); }), out,
        $('<button class="zchip">+</button>').on('click', function () { g[key] = Math.min(max, (g[key] || 0) + step); setGoals(g); renderGoals(p); }));
    }
    body.append($('<div class="zocard"></div>').append(stepper('Solves per day', 'daily', 5, 5, 500), stepper('Sub-X target (seconds, 0 = off)', 'target', 1, 0, 600)));
    body.append($('<h3 class="zp-h">Last 5 weeks</h3>'));
    var cal = $('<div class="zcal"></div>').appendTo(body), c = new Date();
    c.setDate(c.getDate() - 34);
    for (var i = 0; i < 35; i++) {
      var k = dayKey(c.getTime() / 1000), v = days[k] || 0, lvl = !v ? 0 : (v >= g.daily ? 3 : (v >= g.daily / 2 ? 2 : 1));
      $('<div class="zcell"></div>').addClass('l' + lvl).attr('title', c.toLocaleDateString() + ': ' + v + ' solves').text(c.getDate()).appendTo(cal);
      c.setDate(c.getDate() + 1);
    }
  }

  /* ---- Backup page: CSV / JSON export and import ---- */
  function csvQ(s) { return '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"'; }
  function exportRows() {
    var out = [], i = 0, s;
    try { while ((s = stats.timesAt(i)) && i < 100000) { out.push(s); i++; } } catch (e) {}
    return out;
  }
  function download(name, text, type) {
    try {
      var u = URL.createObjectURL(new Blob([text], { type: type })), a = $('<a></a>').attr({ href: u, download: name }).appendTo('body');
      a[0].click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(u); }, 500);
      toast('Saved <b>' + name + '</b>');
    } catch (e) { toast('Could not save the file here. Use Copy instead.'); }
  }
  function backupName(ext) { var c = currentPuzzle(); return 'ZTimer-' + (c.name || 'solves').replace(/[^A-Za-z0-9]+/g, '_') + '.' + ext; }
  function csvText() {
    var rows = ['Time,Penalty,Scramble,Comment,Date,Raw ms'];
    exportRows().forEach(function (s) {
      var pen = s[0][0], ms = s[0][1], t = pen < 0 ? Infinity : ms + (pen > 0 ? pen : 0);
      rows.push([csvQ(pretty(t)), csvQ(pen < 0 ? 'DNF' : (pen > 0 ? '+2' : '')), csvQ(s[1]), csvQ(s[2]), csvQ(s[3] ? new Date(s[3] * 1000).toISOString() : ''), ms].join(','));
    });
    return rows.join('\n');
  }
  function splitCsv(line) {
    var out = [], cur = '', q = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ',' || ch === ';' || ch === '\t') { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur); return out;
  }
  function parseTime(s) {
    s = (s || '').trim(); if (!s) return null;
    if (/^dnf/i.test(s)) return { pen: -1, ms: 0 };
    var plus = /\+$/.test(s); s = s.replace(/\+$/, '').replace(',', '.');
    var m = /^(?:(\d+):)?(?:(\d+):)?(\d+(?:\.\d+)?)$/.exec(s); if (!m) return null;
    var ms = Math.round(((+(m[1] && m[2] ? m[1] : 0)) * 3600 + (+(m[2] || m[1] || 0)) * 60 + parseFloat(m[3])) * 1000);
    return plus ? { pen: 2000, ms: Math.max(0, ms - 2000) } : { pen: 0, ms: ms };
  }
  function importText(txt) {
    var lines = txt.split(/\r?\n/).slice(0, 5000), n = 0;
    lines.forEach(function (ln) {
      var f = splitCsv(ln), t = parseTime(f[0]); if (!t) return;
      var p2 = (f[1] || '').trim().toUpperCase(), raw = /^\d+$/.test((f[5] || '').trim()) ? +f[5] : null;
      if (p2 === 'DNF') t = { pen: -1, ms: raw != null ? raw : t.ms };
      else if (p2 === '+2') t = { pen: 2000, ms: raw != null ? raw : Math.max(0, t.ms - 2000) };
      else if (raw != null) t = { pen: 0, ms: raw };
      kernel.pushSignal('time', [t.pen, t.ms]); n++;
    });
    return n;
  }
  function renderBackup(p) {
    var body = p.find('.zp-body').empty(), n = exportRows().length;
    p.find('.zp-sub').text(n + (n === 1 ? ' solve' : ' solves') + ' in this session');
    var ex = $('<div class="zocard"></div>').append($('<h3>Export this session</h3>'));
    function go(title, sum, fn) { return $('<div class="zopt go"></div>').append($('<div class="zo-t"></div>').append($('<b></b>').text(title), $('<span></span>').text(sum))).on('click', fn).append('<i class="zchev"></i>'); }
    ex.append(go('Save as CSV', 'Opens in Excel, Sheets and other timers', function () { download(backupName('csv'), csvText(), 'text/csv'); }),
      go('Save as JSON', 'Every field, good for backups', function () {
        download(backupName('json'), JSON.stringify(exportRows().map(function (s) { return { penalty: s[0][0], ms: s[0][1], scramble: s[1], comment: s[2], timestamp: s[3] }; }), null, 1), 'application/json');
      }),
      go('Copy CSV', 'Copy the table to the clipboard', function () { try { navigator.clipboard.writeText(csvText()); toast('CSV copied'); } catch (e) { toast('Copying is not allowed here'); } }));
    body.append(ex);
    var ta = $('<textarea class="zimp" rows="6" placeholder="12.34&#10;1:05.2&#10;DNF&#10;9.87+"></textarea>');
    var file = $('<input type="file" accept=".csv,.txt,text/csv,text/plain" style="display:none">').on('change', function () {
      var f = this.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { ta.val(r.result); }; r.readAsText(f);
    });
    var im = $('<div class="zocard zimpcard"></div>').append($('<h3>Import times</h3>'),
      $('<p class="zp-note zdark"></p>').text('Add times to the current session. One time per line, or a CSV with the time in the first column. Times are added to the end of the session.'),
      ta, $('<div class="zm-btns"></div>').append($('<button class="zm-btn">Choose file</button>').on('click', function () { file.click(); }),
        $('<button class="zm-btn pri">Import</button>').on('click', function () {
          var c = importText(ta.val()); ta.val(''); toast(c ? 'Added <b>' + c + '</b> times' : 'No times found'); setTimeout(function () { renderBackup(p); }, 300);
        })), file);
    body.append(im);
    body.append($('<p class="zp-note"></p>').text('Need a full backup with every session? Use Export / import in the side menu.'));
  }

  /* ---- switching ---- */
  function keyBlock(e) {
    if (current === 'timer') return;
    var t = e.target && e.target.tagName;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(t) || (e.target && e.target.isContentEditable)) return;
    e.stopPropagation();
  }
  var prevId = 'timer', installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; $(window).trigger('ztinstall'); });
  function show(id) {
    var old = current; current = id;
    bar.find('.ztab').each(function () { $(this).toggleClass('on', $(this).data('p') === id); });
    clearInterval(timerId); timerId = null;
    $('html').toggleClass('zpage-open', id !== 'timer');
    closeDrawer();
    if (id === 'timer') { root.hide(); lastSig = ''; updateBar(); updateCorners(); prevId = 'timer'; return; }
    kernel.hideDialog();
    var order = TABS.map(function (t) { return t[0]; }), dir = order.indexOf(id) > order.indexOf(prevId) ? 'zin-r' : 'zin-l';
    root.show(); $.each(pages, function (k, p) { p.toggle(k === id); });
    var p = pages[id];
    if (prevId !== id) p.removeClass('zin-r zin-l').width(), p.addClass(dir);
    if (id === 'solves') renderSolves(p);
    if (id === 'stats') { renderStats(p); timerId = setInterval(function () { renderStats(p); }, 4000); }
    if (id === 'trainer') renderTrainer(p);
    if (id === 'puzzles') renderPuzzles(p);
    if (id === 'themes') renderThemes(p);
    if (id === 'options') renderOptions(p);
    if (id === 'sessions') renderSessions(p);
    if (id === 'goals') renderGoals(p);
    if (id === 'backup') renderBackup(p);
    if (id === 'wca') renderWca(p);
    p.find('.zp-body').scrollTop(0);
    prevId = id;
  }

  function init() {
    applyTheme(savedTheme(), false);
    var z = $('#zbar');
    if (!z.length) return;
    bar = z.empty();
    TABS.forEach(function (t) {
      $('<div class="ztab" role="button" tabindex="0"></div>').data('p', t[0]).attr({ title: t[1], 'aria-label': t[1] })
        .append(icon(t[2])).on('click', function () { show(t[0]); }).appendTo(bar);
    });
    root = $('<div id="zpages"></div>').hide().appendTo('body');
    makePage('solves', 'Solves', 'list'); makePage('stats', 'Stats', 'graph');
    makePage('trainer', 'Trainer', 'trainer'); makePage('wca', 'WCA', 'wca'); makePage('puzzles', 'Puzzle', 'category'); makePage('themes', 'Theme', 'palette'); makePage('options', 'Options', 'settings'); makePage('sessions', 'Sessions', 'books'); makePage('goals', 'Goals and streaks', 'checklist'); makePage('backup', 'Backup and import', 'archive');
    actionbar = $('<div id="zactionbar"></div>').append(
      barBtn('menu', 'Menu', function () { drawer.addClass('open'); }),
      $('<div class="za-title" role="button" tabindex="0"></div>').append($('<b class="za-name"></b>'), $('<span class="za-cat"></span>'))
        .on('click', function () { show('puzzles'); }),
      barBtn('settings', 'Options', function () { show('options'); })).appendTo('body');
    buildDrawer();
    /* swipe left or right to move between the tabs (not on the timer, charts or sliders) */
    (function () {
      var x0, y0, ok = false, order = TABS.map(function (t) { return t[0]; });
      root.on('touchstart', function (e) {
        var t = e.originalEvent.touches[0]; x0 = t.clientX; y0 = t.clientY;
        ok = !$(e.target).closest('canvas,input,select,textarea,.zimp,.zcal').length && order.indexOf(current) > 0;
      }).on('touchend', function (e) {
        if (!ok) return; ok = false;
        var t = e.originalEvent.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0, i = order.indexOf(current);
        if (Math.abs(dx) < 80 || Math.abs(dy) > 60 || Math.abs(dx) < 1.8 * Math.abs(dy)) return;
        var j = dx < 0 ? i + 1 : i - 1;
        if (j >= 0 && j < order.length) show(order[j]);
      });
    })();
    /* install button, shown only when the browser offers installing the site */
    function addInstall() {
      if (!installEvt || $('#zinstall').length) return;
      var it = $('<div class="zd-item" id="zinstall" role="button" tabindex="0"></div>').append(icon('archive'), $('<span>Install app</span>'))
        .on('click', function () { closeDrawer(); try { installEvt.prompt(); } catch (e) {} });
      drawer.find('.zd-foot').before(it);
    }
    addInstall(); $(window).on('ztinstall', addInstall);
    cornerL = $('<div id="zcorner-l" class="zcorner"></div>').appendTo('body');
    cornerR = $('<div id="zcorner-r" class="zcorner"></div>').appendTo('body');
    setInterval(function () { if (current === 'timer') { updateBar(); updateCorners(); placeCorners(); scrambleButtons(); } }, 500);
    $(window).on('resize', placeCorners);
    [['Delete', 'remove'], ['Retry', 'retry'], ['DNF', 'dnf'], ['Add 2', 'plus2'], ['Comment', 'comment']].forEach(function (m) {
      $('#zquick input').filter(function () { return (this.title || '').indexOf(m[0]) === 0; }).addClass('zq zi-' + m[1]).val('');
    });
    var GLYPH = { e8ce: 'settings', e60d: 'imgpref', eae9: 'palette', e6b6: 'timer', e900: 'category', e9bb: 'help', e993: 'build', e69d: 'edit' };
    function iconify() {
      $('.dialog span.icon:not([data-zi])').each(function () {
        var code = (this.textContent.charCodeAt(0) || 0).toString(16), n = GLYPH[code];
        if (code === 'e9bb' && $(this).parent().hasClass('tab')) n = 'graph';
        $(this).attr('data-zi', 1); if (n) $(this).addClass('zi zi-' + n);
      });
    }
    new MutationObserver(function () {
      iconify();
      $('.dialog tr').filter(function () { return /^\s*Show advertisements/i.test($(this).text()); }).hide();
    }).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', keyBlock, true);
    document.addEventListener('keyup', keyBlock, true);
    show('timer');
    $(window).on('resize', function () { if (current === 'stats') renderStats(pages.stats); });
  }
  $(function () { setTimeout(init, 0); });
})();
