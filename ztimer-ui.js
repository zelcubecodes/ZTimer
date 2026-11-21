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
  /* Puzzles as in the app's picker: WCA events, then the others. Entry: [name, csTimer id, icon, label, colour group] */
  var PUZZLES = [
    ['WCA', [['3x3x3', '333', '3x3'], ['2x2x2', '222so', '2x2'], ['4x4x4', '444wca', '4x4'], ['5x5x5', '555wca', '5x5'], ['6x6x6', '666wca', '6x6'], ['7x7x7', '777wca', '7x7'],
      ['Skewb', 'skbso', 'skewb'], ['Megaminx', 'mgmp', 'mega'], ['Pyraminx', 'pyrso', 'pyra'], ['Square-1', 'sqrs', 'sq1'], ['Clock', 'clkwca', 'clock'],
      ['3x3x3 one-handed', '333oh', '3x3-oh'], ['3x3x3 blindfolded', '333ni', '3x3-bld'], ['4x4x4 blindfolded', '444bld', '4x4-bld'], ['5x5x5 blindfolded', '555bld', '5x5-bld'],
      ['3x3x3 multi-blind', 'r3ni', '3x3-mbld'], ['3x3x3 fewest moves', '333fm', '3x3-fmc'], ['FTO', 'ftoso', 'fto']]],
    ['Non-WCA', [['3x3 Feet', '333ft', 'feet'], ['Mirror Blocks', 'mrbl', 'mirror'], ['2x2x3 Tower', '223', 'tower'], ['2x3x3 Domino', '233', 'domino'], ['Floppy Cube', '133', 'floppy'],
      ['3x3x4', '334', '334'], ['8x8 Cube', '888', null, '8', 0], ['9x9 Cube', '999', null, '9', 0], ['10x10 Cube', '101010', null, '10', 0], ['11x11 Cube', '111111', null, '11', 0],
      ['Gigaminx', 'giga', 'giga'], ['Kilominx', 'klmp', 'kilo'], ['Master Pyraminx', 'mpyr', 'master'], ['Square-2', 'sq2', 'sq2'], ['15 Puzzle', '15prp', '15'], ['8 Puzzle', '8prp', '8'],
      ['Gear Cube', 'gear', 'gear'], ['Helicopter Cube', 'heli', 'heli'], ['Redi Cube', 'redi', 'redi'], ['Dino Cube', 'dinoo', 'dino'], ['Crazy 3x3', 'crz3a', 'crazy'], ['Ivy Cube', 'ivy', 'ivy'],
      ['Curvy Copter', 'helicv', 'curvy'], ['Lots of 3x3s', 'r3', 'r3'], ['234 relay', 'r234', 'r234'], ['2345 relay', 'r2345', 'r2345'], ['23456 relay', 'r23456', 'r23456'],
      ['234567 relay', 'r234567', 'r234567'], ['Mini Guildford', 'rmngf', 'miniguild']]]
  ];
  var GROUP_FILL = ['#AACCFF', '#C9B8F2', '#FFE680', '#B8E8B8', '#FFCFA3', '#F2B8D8'], GROUP_TEXT = ['#5599FF', '#7A52C7', '#B38F00', '#3C9A3C', '#D9731A', '#C2509A'];
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

  var solveQuery = '';
  function popMenu(anchor, items) {
    $('.zpop').remove();
    var m = $('<div class="zpop"></div>').appendTo('body'), r = anchor[0].getBoundingClientRect();
    items.forEach(function (it) { $('<button></button>').text(it[0]).on('click', function () { m.remove(); it[1](); }).appendTo(m); });
    m.css({ top: Math.min(r.bottom + 6, window.innerHeight - m.outerHeight() - 8) + 'px', right: Math.max(8, window.innerWidth - r.right) + 'px' });
    setTimeout(function () { $(document).one('click', function () { m.remove(); }); }, 0);
  }

  /* ---- Solves page: a list like the app's, tapping a solve opens csTimer's solve dialog ---- */
  function renderSolves(p) {
    var body = p.find('.zp-body').empty(), a = solves(), src = $('#stats select').first();
    subtitle(p);
    var cur = currentPuzzle().cat;
    var tools = $('<div class="ztools"></div>').appendTo(body);
    $('<button class="zbtn zbtn-s" title="Category"></button>').text(cur).on('click', function () { show('sessions'); }).appendTo(tools);
    $('<button class="zbtn" title="Add time" aria-label="Add time"></button>').append(icon('alarm')).on('click', function () { addTimeDialog(function () { renderSolves(p); }); }).appendTo(tools);
    $('<input type="search" class="zsearch" placeholder="Search" aria-label="Search solves">').val(solveQuery).on('input', function () {
      solveQuery = this.value; var pos = this.selectionStart; renderSolves(p); var n = p.find('.zsearch')[0]; n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {}
    }).appendTo(tools);
    $('<button class="zbtn" title="Delete all solves in this session" aria-label="Delete all solves"></button>').append(icon('sweep')).on('click', function () {
      if (!a.length) return;
      if (confirm('Delete all ' + a.length + ' solves in this session?')) { for (var k = 0; k < a.length; k++) kernel.pushSignal('ctrl', ['stats', 'undo']); setTimeout(function () { renderSolves(p); }, 300); }
    }).appendTo(tools);
    $('<button class="zbtn" title="More" aria-label="More"></button>').append(icon('more')).on('click', function (e) {
      e.stopPropagation();
      function shareAvg(n) {
        if (a.length < n) { toast('You need at least ' + n + ' solves.'); return; }
        var last = a.slice(-n), txt = 'ao' + n + ': ' + pretty(avgOf(a, a.length - 1, n)) + '\n' + last.map(function (x, k) { return (k + 1) + '. ' + pretty(x.t); }).join('\n');
        try { if (navigator.share) { navigator.share({ text: txt }); return; } navigator.clipboard.writeText(txt); toast('Copied ao' + n); } catch (er) { toast('Could not share here.'); }
      }
      popMenu($(this), [['Sort by time, fastest first', function () { sortMode = 'best'; renderSolves(p); }], ['Sort by time, slowest first', function () { sortMode = 'worst'; renderSolves(p); }],
        ['Sort by date, newest first', function () { sortMode = 'new'; renderSolves(p); }], ['Sort by date, oldest first', function () { sortMode = 'old'; renderSolves(p); }],
        ['Share ao5', function () { shareAvg(5); }], ['Share ao12', function () { shareAvg(12); }], ['Category', function () { show('sessions'); }], ['Export or import', function () { show('backup'); }]]);
    }).appendTo(tools);
    body.append($('<div class="zcount2"></div>').text(a.length + (a.length === 1 ? ' solve' : ' solves')));
    if (!a.length) { body.append($('<p class="zp-note"></p>').text('No solves in this session yet. Go to the Timer tab and do a solve.')); return; }
    var list = $('<div class="zlist zgrid"></div>').appendTo(body);
    var order = a.map(function (_, i) { return i; });
    var q = solveQuery.trim().toLowerCase();
    if (q) order = order.filter(function (i) { var x = a[i]; return (pretty(x.t) + ' ' + (x.cmt || '') + ' ' + (x.ts ? new Date(x.ts * 1000).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : '') + ' ' + (x.pen < 0 ? 'dnf' : (x.pen > 0 ? '+2' : ''))).toLowerCase().indexOf(q) >= 0; });
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
  /* the app's statistics card: Improvement, Average and Other tabs */
  var statTab = 0;
  function statCard(a, rerender) {
    var todayK = dayKey(Date.now() / 1000), td = a.filter(function (x) { return x.ts && dayKey(x.ts) === todayK; });
    function avg(arr, end, n) {
      if (end + 1 < n) return null;
      if (n === 3) { var w = arr.slice(end - 2, end + 1).map(function (x) { return x.t; }); return w.indexOf(Infinity) >= 0 ? Infinity : (w[0] + w[1] + w[2]) / 3; }
      return avgOf(arr, end, n);
    }
    function bestAvg(arr, n) { var b = null; for (var i = n - 1; i < arr.length; i++) { var v = avg(arr, i, n); if (v != null && v !== Infinity && (b == null || v < b)) b = v; } return b; }
    function cur(arr, n) { return arr.length >= n ? avg(arr, arr.length - 1, n) : null; }
    function oks(arr) { return arr.filter(function (x) { return x.t !== Infinity; }).map(function (x) { return x.t; }); }
    function dev(arr) { var o = oks(arr); if (o.length < 2) return null; var m = o.reduce(function (s, v) { return s + v; }, 0) / o.length; return Math.sqrt(o.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / o.length); }
    function mean(arr) { var o = oks(arr); return o.length ? o.reduce(function (s, v) { return s + v; }, 0) / o.length : null; }
    function mn(arr) { var o = oks(arr); return o.length ? Math.min.apply(null, o) : null; }
    function mx(arr) { var o = oks(arr); return o.length ? Math.max.apply(null, o) : null; }
    function total(arr) { return arr.length ? arr.reduce(function (s, x) { return s + (x.t === Infinity ? 0 : x.t); }, 0) : null; }
    function f(v) { return v == null ? '-' : pretty(v); }
    var last = a.length ? a[a.length - 1] : null;
    var T = [
      ['Improvement', ['Session best', 'Today', 'Current'], [
        ['Deviation', f(dev(a)), f(dev(td)), '-'], ['Ao12', f(bestAvg(a, 12)), f(bestAvg(td, 12)), f(cur(a, 12))], ['Ao50', f(bestAvg(a, 50)), f(bestAvg(td, 50)), f(cur(a, 50))],
        ['Ao100', f(bestAvg(a, 100)), f(bestAvg(td, 100)), f(cur(a, 100))], ['Best', f(mn(a)), f(mn(td)), last ? f(last.t) : '-'], ['Count', a.length, td.length, '-']]],
      ['Average', ['Session best', 'Today', 'Current'], [3, 5, 12, 50, 100, 1000].map(function (n) { return ['Ao' + n, f(bestAvg(a, n)), f(bestAvg(td, n)), f(cur(a, n))]; })],
      ['Other', ['Session', 'Today'], [['Best', f(mn(a)), f(mn(td))], ['Worst', f(mx(a)), f(mx(td))], ['Deviation', f(dev(a)), f(dev(td))], ['Mean', f(mean(a)), f(mean(td))],
        ['Total time', f(total(a)), f(total(td))], ['Count', a.length, td.length]]]
    ];
    var card = $('<div class="zstat"></div>'), tabs = $('<div class="zst-tabs"></div>').appendTo(card), grid = $('<div class="zst-grid"></div>').appendTo(card);
    function fill(k) {
      statTab = k; tabs.children().removeClass('on').eq(k).addClass('on'); grid.empty();
      var t = T[k], cols = t[1].length + 1;
      grid.css('grid-template-columns', 'minmax(70px,1fr) ' + new Array(cols).join('minmax(70px,1.2fr) '));
      grid.append('<span></span>'); t[1].forEach(function (h) { grid.append($('<span class="zst-h"></span>').text(h)); });
      t[2].forEach(function (row) { row.forEach(function (c, i) { grid.append($('<span></span>').addClass(i ? 'zst-v' : 'zst-l').text(c)); }); });
    }
    T.forEach(function (t, k) { $('<button></button>').text(t[0]).on('click', function () { fill(k); }).appendTo(tabs); });
    fill(statTab);
    return card;
  }
  function renderStats(p) {
    var a = solves(), r = compute(a), body = p.find('.zp-body').empty();
    subtitle(p);
    var cv = document.createElement('canvas');
    body.append($('<div class="zgraph"></div>').append(cv));
    body.append($('<div class="zlegend"></div>').html('<span style="--c:var(--zt-fg)">time</span><span style="--c:#ff5252">ao5</span><span style="--c:#69f0ae">ao12</span><span style="--c:#18ffff">ao100</span>'));
    body.append(statCard(a));
    var hv = document.createElement('canvas');
    body.append($('<h3 class="zp-h">Time distribution</h3>'), $('<div class="zgraph"></div>').append(hv));
    renderPbHistory(body, a);
    body.append($('<button class="zshare"></button>').append(icon('share'), $('<span>Copy summary</span>')).on('click', function () { copySummary(a, r); }));
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
  /* ---- Trainer: sets in families with stars, then single cases with pictures, like the app ---- */
  var T_FAM = [
    ['CFOP', [['PLL', 'pll'], ['OLL', 'oll'], ['LSLL', 'lsll2'], ['LL', 'll'], ['ZBLL', 'zbll'], ['COLL', 'coll'], ['ZBLS', 'zbls'], ['WVLS', 'wvls'], ['VLS', 'vls'], ['F2L', 'f2l'],
      ['Easy cross', 'easyc'], ['Easy XCross', 'easyxc'], ['2-gen R,U', '2gen'], ['2-gen L,U', '2genl'], ['3-gen F', '3gen_F'], ['3-gen L', '3gen_L'], ['RrU', 'RrU']]],
    ['Roux', [['2nd block', 'sbrx'], ['CMLL', 'cmll'], ['LSE', 'lse'], ['LSE M,U', 'lsemu']]],
    ['Big cubes', [['4x4 edges', '4edge'], ['4x4 UD centres', '444ctud'], ['4x4 UD 3 centres', '444ud3c'], ['4x4 last 8 edges', '444l8e'], ['4x4 OLL parity', '444poll'], ['4x4 PLL parity', '444ppll'],
      ['4x4 CTO', '444cto'], ['5x5 edges', '5edge'], ['6x6 edges', '6edge'], ['7x7 edges', '7edge']]],
    ['Megaminx', [['2-gen', 'minx2g', 'Megaminx 2-gen'], ['Last slot + LL', 'mlsll', 'Megaminx LSLL'], ['PLL', 'mgmpll', 'Megaminx PLL'], ['LL', 'mgmll', 'Megaminx LL'], ['Second layer', 'mgms2l', 'Megaminx S2L']]],
    ['Pyraminx', [['L4E', 'pyrl4e', 'Pyraminx L4E'], ['4 corners', 'pyr4c', 'Pyraminx 4 corners'], ['No bar', 'pyrnb', 'Pyraminx no bar']]],
    ['Skewb', [['No bar', 'skbnb', 'Skewb no bar'], ['Last layer', 'skbll', 'Skewb LL']]],
    ['2x2x2', [['EG', '222eg', '2x2 EG'], ['CLL', '222eg0', '2x2 CLL'], ['EG1', '222eg1', '2x2 EG1'], ['EG2', '222eg2', '2x2 EG2'], ['Last slot', '222lsall', '2x2 last slot'], ['No bar', '222nb', '2x2 no bar']]],
    ['Square-1', [['CSP', 'sqrcsp', 'Square-1 CSP'], ['PLL', 'sq1pll', 'Square-1 PLL']]],
    ['FTO', [['TCP', 'ftotcp', 'FTO TCP'], ['L3T', 'ftol3t', 'FTO L3T'], ['L4T', 'ftol4t', 'FTO L4T']]]
  ];
  function findSet(id) { var r = null; T_FAM.forEach(function (f) { f[1].forEach(function (s) { if (s[1] === id) r = s; }); }); return r; }
  var trFam = -1, trSet = null, trSel = null;
  function getStars() { try { var m = /(?:^|; )ztimerStars=([^;]*)/.exec(document.cookie); return m ? JSON.parse(decodeURIComponent(m[1])) : []; } catch (e) { return []; } }
  function setStars(a) { try { document.cookie = 'ztimerStars=' + encodeURIComponent(JSON.stringify(a)) + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {} }
  function caseData(id) { return window.ZT_CASES && window.ZT_CASES[id]; }
  function renderTrainer(p) {
    var body = p.find('.zp-body').empty(), cur = kernel.getProp('scrType');
    if (trSet) return renderCases(p, body);
    p.find('.zp-sub').text('Practice sets');
    var stars = getStars(), fams = T_FAM.slice(), st = [];
    T_FAM.forEach(function (f) { f[1].forEach(function (s) { if (stars.indexOf(s[1]) >= 0) st.push(s); }); });
    fams.unshift(['Starred', st]);
    if (trFam < 0 || trFam >= fams.length) trFam = st.length ? 0 : 1;
    var tabs = $('<div class="ztabs2 zscroll"></div>').appendTo(body), grid = $('<div class="ztiles zpuz"></div>').appendTo(body);
    function fill(i) {
      trFam = i; tabs.children().removeClass('on').eq(i).addClass('on'); grid.empty();
      fams[i][1].forEach(function (s) {
        var d = caseData(s[1]), star = stars.indexOf(s[1]) >= 0;
        var t = $('<div class="ztile zpt zset" role="button" tabindex="0"></div>').toggleClass('on', cur === s[1])
          .append($('<span class="zpl"></span>').text(s[0].length > 5 ? s[0].slice(0, 4) : s[0]).css({ background: '#AACCFF', color: '#5599FF' }), $('<b></b>').text(s[0]),
            d ? $('<span class="zsub"></span>').text(d.n.length + ' cases') : '',
            $('<button class="zstar" aria-label="Star"></button>').toggleClass('on', star).text(star ? '\u2605' : '\u2606').on('click', function (e) {
              e.stopPropagation(); var a = getStars(), k = a.indexOf(s[1]); if (k >= 0) a.splice(k, 1); else a.push(s[1]); setStars(a); renderTrainer(p);
            }))
          .on('click', function () {
            usePuzzle(s[1], s[2] || s[0], null, function (ok) {
              if (!ok || kernel.getProp('scrType') !== s[1]) { toast('That set is not available.'); return; }
              if (d) { trSet = s; trSel = null; renderTrainer(p); } else { show('trainer'); }
            });
          });
        grid.append(t);
      });
      if (!fams[i][1].length) grid.append($('<p class="zp-note"></p>').text('Tap the star on a set to keep it here.'));
    }
    fams.forEach(function (f, i) { $('<button class="zt2"></button>').text(f[0]).on('click', function () { fill(i); }).appendTo(tabs); });
    fill(trFam);
  }
  function renderCases(p, body) {
    var id = trSet[1], d = caseData(id), n = d.n.length;
    p.find('.zp-sub').text(trSet[0]);
    if (!trSel) {
      trSel = [];
      var cur = null; try { cur = JSON.parse(kernel.getProp('scrFlt')); } catch (e) {}
      for (var i = 0; i < n; i++) trSel[i] = (cur && cur[0] === id && cur[1] && cur[1].length === n) ? cur[1][i] > 0 : true;
    }
    var bar = $('<div class="zcbar"></div>').appendTo(body), cnt = $('<span class="zcc"></span>');
    function upd() { cnt.text(trSel.filter(Boolean).length + ' of ' + n + ' selected'); }
    bar.append($('<button class="zm-btn">\u2039 Sets</button>').on('click', function () { trSet = null; renderTrainer(p); }), cnt,
      $('<button class="zm-btn">All</button>').on('click', function () { trSel = trSel.map(function () { return true; }); renderCases(p, body.empty()); }),
      $('<button class="zm-btn">None</button>').on('click', function () { trSel = trSel.map(function () { return false; }); renderCases(p, body.empty()); }));
    var grid = $('<div class="ztiles zcases"></div>').appendTo(body);
    d.n.forEach(function (nm, i) {
      var t = $('<button class="zcase"></button>').toggleClass('on', !!trSel[i]);
      if (d.p[i]) { var img = $('<img class="zci" alt="">'); try { image.llImage.drawImage(d.p[i], [], img); } catch (e) {} t.append(img); }
      t.append($('<b></b>').text(nm)).on('click', function () { trSel[i] = !trSel[i]; t.toggleClass('on', trSel[i]); upd(); }).appendTo(grid);
    });
    upd();
    $('<button class="zshare zstart"></button>').append($('<span>Start practising</span>')).on('click', function () {
      if (!trSel.some(Boolean)) { toast('Select at least one case.'); return; }
      kernel.setProp('scrType', id);
      kernel.setProp('scrFlt', JSON.stringify([id, trSel.map(function (v) { return v ? 1 : 0; })]));
      show('trainer');
    }).appendTo(body);
  }

  /* ---- WCA page ---- */
  function renderWca(p) {
    var body = p.find('.zp-body').empty(), box = $('<div class="zwca"></div>').appendTo(body);
    p.find('.zp-sub').text('World Cube Association data');
    if (window.zWcaRender) window.zWcaRender(box); else box.text('WCA data is not available.');
    var EV = { '3x3': '333', '2x2': '222', '4x4': '444', '5x5': '555', '6x6': '666', '7x7': '777', '3x3 Blindfolded': '333bf', '3x3 Fewest Moves': '333fm', '3x3 One-Handed': '333oh', 'Clock': 'clock',
      'Megaminx': 'minx', 'Pyraminx': 'pyram', 'Skewb': 'skewb', 'Square-1': 'sq1', '4x4 Blindfolded': '444bf', '5x5 Blindfolded': '555bf', '3x3 Multi-Blind': '333mbf' };
    function decorate() {
      box.find('table td:first-child:not([data-ev])').each(function () {
        var k = EV[$(this).text().trim()]; $(this).attr('data-ev', 1);
        if (k) $(this).prepend($('<span class="zpi zpi-ev-' + k + ' zev"></span>'));
      });
    }
    try { new MutationObserver(decorate).observe(box[0], { childList: true, subtree: true }); } catch (e) {}
    decorate();
  }

  /* ---- Puzzle chooser page (like the app's puzzle dialog) ---- */

  /* ---- Puzzles and categories, like the app: each puzzle and category is its own csTimer session, named "Puzzle / Category" ---- */
  function sessSel() { return $('#stats select').first(); }
  function parseSess(n) { var i = n.indexOf(' / '); return i < 0 ? [n, ''] : [n.slice(0, i), n.slice(i + 3)]; }
  function sessionsList() { var out = []; sessSel().find('option').each(function () { out.push({ v: $(this).val(), name: $(this).text() }); }); return out; }
  function getLast() { try { var m = /(?:^|; )ztimerLast=([^;]*)/.exec(document.cookie); return m ? JSON.parse(decodeURIComponent(m[1])) : {}; } catch (e) { return {}; } }
  function setLast(id, cat) { var l = getLast(); l[id] = cat; try { document.cookie = 'ztimerLast=' + encodeURIComponent(JSON.stringify(l)) + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {} }
  function findSess(name) { var r = null; sessionsList().forEach(function (s) { if (s.name === name) r = s; }); return r; }
  function goSession(v) { sessSel().val(v).trigger('change'); }
  /* switch to the session of this puzzle and category, creating it the first time; done(ok) runs afterwards */
  var mgrWanted = false, mgrWantedAt = 0;
  function hideStaleMgr() {
    if (mgrWanted) {
      if (Date.now() - mgrWantedAt > 1500 && !$('.dialogssmgr:visible').length) mgrWanted = false; else return;
    }
    $('div,span,input,button,td,th,b').filter(function () {
      if ($(this).children().length) return false;
      var t = $(this).text(), v = $(this).val();
      return t === STATS_SSMGR_ORDER || v === STATS_SSMGR_ORDER || t === STATS_SSMGR_TITLE;
    }).each(function () {
      var el = $(this), top = el.parents().filter(function () { return this.parentNode === document.body; }).first();
      if (top.length && !top.find('#lcd, #scrambleDiv').length) { top.addClass('zt-stale'); return; }
      var dlg = el.closest('.dialog'); (dlg.length ? dlg : el).addClass('zt-stale');
    });
  }
  /* the Session Manager sometimes leaves its text behind in the top-left corner; clean it up whenever something is added to the page */
  $(function () {
    try { new MutationObserver(function () { clearTimeout(hideStaleMgr.t); hideStaleMgr.t = setTimeout(hideStaleMgr, 60); }).observe(document.body, { childList: true }); } catch (e) {}
    setTimeout(hideStaleMgr, 800);
  });
  function usePuzzle(id, pname, cat, done) {
    var cp = currentPuzzle(), curName = sessSel().find('option:selected').text(), pp = parseSess(curName);
    if (!cat && kernel.getProp('scrType') === id && (!pp[1] || pp[0] === pname)) { if (done) done(true); return; }
    cat = cat || getLast()[id] || 'Normal';
    var name = pname + ' / ' + cat, s = findSess(name);
    function finish() {
      var t = findSess(name);
      if (!t) { toast('Could not open that category.'); if (done) done(false); return; }
      goSession(t.v); setLast(id, cat);
      setTimeout(function () { if (kernel.getProp('scrType') !== id) kernel.setProp('scrType', id); if (done) done(true); }, 80);
    }
    if (s) { finish(); return; }
    $('html').addClass('zt-quiet');
    try { stats.getSessionManager().importSessions([{ name: name, opt: { scrType: id }, times: [] }]); } catch (e) {}
    try { kernel.hideDialog(); } catch (e) {}
    setTimeout(function () { finish(); try { kernel.hideDialog(); } catch (e) {} hideStaleMgr(); setTimeout(function () { hideStaleMgr(); $('html').removeClass('zt-quiet'); }, 250); }, 120);
  }
  function currentPuzzle() {
    var t = kernel.getProp('scrType'), name = null;
    PUZZLES.forEach(function (g) { g[1].forEach(function (q) { if (q[1] === t) name = q[0]; }); });
    var fs = findSet(t); if (fs) name = fs[2] || fs[0];
    var sels = $('#scrambleDiv select');
    if (!name) name = sels.eq(1).find('option:selected').text() || 'Puzzle';
    var sn = sessSel().find('option:selected').text() || '', cat = parseSess(sn)[1] || sn;
    if (!cat || /^\d+$/.test(cat)) cat = 'Normal';
    return { name: name, cat: cat };
  }
  var puzTab = null;
  function puzIcon(q) {
    return q[2] ? $('<span class="zpi zpi-' + q[2] + '"></span>') : $('<span class="zpl"></span>').text(q[3]).css({ background: GROUP_FILL[q[4]], color: GROUP_TEXT[q[4]] });
  }
  function renderPuzzles(p) {
    var body = p.find('.zp-body').empty(), cur = kernel.getProp('scrType'), idx = puzTab;
    p.find('.zp-sub').text('Choose a puzzle');
    if (idx == null) { idx = 0; PUZZLES.forEach(function (g, gi) { g[1].forEach(function (q) { if (q[1] === cur) idx = gi; }); }); }
    var tabs = $('<div class="ztabs2"></div>').appendTo(body), grid = $('<div class="ztiles zpuz"></div>');
    function fill(gi) {
      puzTab = gi; tabs.children().removeClass('on').eq(gi).addClass('on'); grid.empty();
      PUZZLES[gi][1].forEach(function (q) {
        $('<button class="ztile zpt"></button>').toggleClass('on', cur === q[1]).append(puzIcon(q), $('<b></b>').text(q[0])).on('click', function () {
          usePuzzle(q[1], q[0], null, function (ok) { if (ok && kernel.getProp('scrType') !== q[1]) toast('That scramble type is not available.'); show(mode); });
        }).appendTo(grid);
      });
    }
    PUZZLES.forEach(function (g, gi) { $('<button class="zt2"></button>').text(g[0]).on('click', function () { fill(gi); }).appendTo(tabs); });
    body.append(grid); fill(idx);
  }

  /* ---- App-style top bar ---- */
  function barBtn(ic, title, fn) {
    return $('<button class="za-btn"></button>').attr({ title: title, 'aria-label': title }).append(icon(ic)).on('click', fn);
  }
  function updateBar() {
    var c = currentPuzzle();
    actionbar.find('.za-name').text(c.name + (mode === 'trainer' ? ' trainer' : '')); actionbar.find('.za-cat').text(c.cat);
    var cs = findSet(kernel.getProp('scrType')); actionbar.find('.za-cases').toggleClass('on', !!(cs && caseData(cs[1])));
  }
  function closeDrawer() { drawer.removeClass('open'); }
  function buildDrawer() {
    var items = [['timer', 'Timer', function () { show('timer'); }],
      ['sec', 'Other'],
      ['share', 'Export/Import', function () { show('backup'); }],
      ['palette', 'App theme', function () { show('themes'); }],
      ['div'],
      ['settings', 'Settings', function () { show('options'); }],
      ['help', 'About and feedback', function () { $('#leftbar .c5').click(); }]];
    var panel = $('<div class="zd-panel"></div>').append(
      $('<div class="zd-head"></div>').append($('<b></b>').text('ZTimer'), $('<span></span>').text('Web timer for speedcubers')));
    items.forEach(function (it) {
      if (it[0] === 'sec') { $('<div class="zd-sec"></div>').text(it[1]).appendTo(panel); return; }
      if (it[0] === 'div') { $('<div class="zd-div"></div>').appendTo(panel); return; }
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
      $('<button class="zsb" title="New scramble" aria-label="New scramble"></button>').append(icon('cached')).on('click', function () {
        card.find('.title > nobr').eq(1).children('span').eq(1).click();
      }).appendTo(box);
    }
    card.find('.zsb-last').toggleClass('off', !spans.eq(0).hasClass('click'));
  }
  function placeCorners() { if (cornerR) cornerR.css('right', ''); }

  /* ---- Corner stats on the timer screen, like the app ---- */
  function updateCorners() {
    if (current !== 'timer' && current !== 'trainer') return;
    var a = solves(), sum = 0;
    a.forEach(function (x) { sum += (x.t === Infinity ? 7 : x.t) + x.pen; });
    var sig = a.length + ':' + sum + ':' + kernel.getProp('scrType');
    if (sig === lastSig) return;
    lastSig = sig;
    var r = compute(a), st = kernel.getProp('scrType');
    if (prev && prev.st === st && a.length === prev.n + 1 && prev.n >= 4 && prev.best != null && r.best != null && r.best < prev.best && a[a.length - 1].t === r.best)
      pbBurst('Congratulations!<br>You\u2019ve just beaten your previous personal best by ' + pretty(prev.best - r.best));
    else if (prev && prev.st === st && a.length === prev.n + 1 && prev.ao5 != null && r.ao5 != null && r.ao5 !== Infinity && r.ao5 === r.bao5 && r.ao5 < prev.bao5)
      pbBurst('<b>New average best!</b><br>ao5 ' + pretty(r.ao5));
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
  var burstT = null;
  /* PB message like the app: ripple behind the timer, then a bold centred message under the scramble box until the next solve starts */
  function hideCongrats() { $('#zcongrats').removeClass('show'); }
  function pbBurst(html) {
    var lcd = $('#lcd'), r = lcd.length ? lcd[0].getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    if (!r.width) r = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    var box = $('#zburst');
    if (!box.length) box = $('<div id="zburst"><i></i><i></i><i></i></div>').appendTo('body');
    box.css({ left: r.left + r.width / 2, top: r.top + r.height / 2 });
    box.removeClass('go'); void box[0].offsetWidth; box.addClass('go');
    clearTimeout(burstT); burstT = setTimeout(function () { box.removeClass('go'); }, 2900);
    var msg = $('#zcongrats');
    if (!msg.length) msg = $('<div id="zcongrats"></div>').appendTo('body');
    var sc = $('#scrambleDiv'), sb = sc.length ? sc[0].getBoundingClientRect().bottom : 150;
    msg.html(html).css('top', (sb + 16) + 'px').addClass('show');
  }
  $(document).on('keydown touchstart mousedown', function (e) { if ($('#zcongrats').hasClass('show') && !$(e.target).closest('#zcongrats').length) hideCongrats(); });
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
      ['sw', 'scrKeyM', 'Mark key moves', 'Label key moves in the scramble'],
      ['go', 'Scramble types and filters', 'Choose scramble types, lengths and cases', function () { $('#leftbar .c3').click(); }]
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
    ['App', [
      ['go', 'Export and import', 'Save or load your solves', function () { show('backup'); }],
      ['go', 'App theme', 'Pick one of the app\u2019s colour themes', function () { show('themes'); }],
      ['go', 'About and feedback', 'Credits, licence and links', function () { $('#leftbar .c5').click(); }],
      ['go', 'Side menu', 'Or swipe in from the left edge', function () { show(mode); drawer.addClass('open'); }]
    ]],
    ['Other', [
      ['sw', 'useKSC', 'Keyboard shortcuts', 'Use keyboard shortcuts on a computer'],
      ['num', 'NTools', 'Number of tools', 'How many tools the Tools window shows', 1, 4],
      ['go', 'Tools', 'Scramble tools, cross solver, distribution and more', function () { openTools(); }],
      ['go', 'Export or import every session', 'csTimer\u2019s full backup', function () { $('#leftbar .c2').click(); }],
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
  /* the scramble picture lives at the bottom middle, like the app; the full Tools window opens from Settings */
  function openTools() {
    show(mode); $('html').addClass('zt-toolsfull');
    if (!$('#toolsDiv').is(':visible')) $('#leftbar .c6').click();
    if (!$('#ztools-done').length) $('<button id="ztools-done">Done</button>').on('click', function () { $('html').removeClass('zt-toolsfull'); }).appendTo('body');
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
    var body = p.find('.zp-body').empty(), c = currentPuzzle(), curV = sessSel().val(), id = kernel.getProp('scrType');
    p.find('.zp-sub').text(c.name);
    body.append($('<h3 class="zp-h">Categories</h3>'));
    var any = false;
    sessionsList().forEach(function (s) {
      var pp = parseSess(s.name), mine = pp[1] ? pp[0] === c.name : s.v === curV;
      if (!mine) return; any = true;
      var label = pp[1] || (/^\d+$/.test(s.name) ? 'Normal' : s.name);
      $('<div class="zrow zsessrow2"></div>').toggleClass('cur', s.v === curV).append($('<span class="zs-n"></span>').text(label), s.v === curV ? $('<span class="zs-c">current</span>') : '')
        .on('click', function () { goSession(s.v); setLast(id, label); setTimeout(function () { show(mode); }, 120); }).appendTo(body);
    });
    if (!any) body.append($('<p class="zp-note"></p>').text('No categories yet.'));
    body.append($('<button class="zshare"></button>').append(icon('edit'), $('<span>New category</span>')).on('click', function () {
      var n = (prompt('Category name (for example Normal, One-handed, Practice)') || '').trim().replace(/\s*\/\s*/g, '-');
      if (!n) return;
      usePuzzle(id, c.name, n, function () { show(mode); });
    }));
    body.append($('<button class="zshare"></button>').append(icon('settings'), $('<span>Rename, merge or delete</span>')).css('margin-top', '10px').on('click', function () {
      mgrWanted = true; mgrWantedAt = Date.now(); $('.zt-stale').removeClass('zt-stale');
      try { stats.getSessionManager().showMgrTable(); } catch (e) { toast('Could not open the session manager.'); }
    }));
    body.append($('<p class="zp-note"></p>').text('Every puzzle and category keeps its own solves, like in the app.'));
  }

  /* ---- Goals page: daily goal, streak, practice calendar ---- */
  function renderGoals(body, a, again) {
    var g = getGoals(), days = {}, today = dayKey(Date.now() / 1000);
    a.forEach(function (x) { if (x.ts) days[dayKey(x.ts)] = (days[dayKey(x.ts)] || 0) + 1; });
    var n = days[today] || 0, streak = 0, d = new Date();
    if (!days[dayKey(d.getTime() / 1000)]) d.setDate(d.getDate() - 1);
    while (days[dayKey(d.getTime() / 1000)]) { streak++; d.setDate(d.getDate() - 1); }
    var under = g.target ? a.filter(function (x) { return x.ts && dayKey(x.ts) === today && x.t < g.target * 1000; }).length : 0;
    body.append($('<h3 class="zp-h">Goals and streaks</h3>'));
    var cards = $('<div class="zcards"></div>').appendTo(body);
    cards.append(card('Today', n + ' / ' + g.daily, n >= g.daily ? 'Goal reached!' : (g.daily - n) + ' to go'),
      card('Streak', streak + (streak === 1 ? ' day' : ' days'), 'in a row'),
      card('Practice days', Object.keys(days).length, 'in this session'));
    if (g.target) cards.append(card('Sub-' + g.target, under, 'solves under ' + g.target + ' s today'));
    var bar = $('<div class="zgbar"></div>').append($('<i></i>').css('width', Math.min(100, 100 * n / g.daily) + '%'));
    body.append(bar);
    function stepper(label, key, step, min, max) {
      var out = $('<b></b>').text(g[key] || 'off');
      return $('<div class="zopt zstep"></div>').append($('<div class="zo-t"></div>').append($('<b></b>').text(label)),
        $('<button class="zchip">\u2212</button>').on('click', function () { g[key] = Math.max(min, (g[key] || 0) - step); setGoals(g); again(); }), out,
        $('<button class="zchip">+</button>').on('click', function () { g[key] = Math.min(max, (g[key] || 0) + step); setGoals(g); again(); }));
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
    body.append($('<div class="zocard"></div>').append(go('Every session', 'csTimer\u2019s full export and import window', function () { $('#leftbar .c2').click(); })));
  }

  /* ---- switching ---- */
  function keyBlock(e) {
    if (current === 'timer' || current === 'trainer') return;
    var t = e.target && e.target.tagName;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(t) || (e.target && e.target.isContentEditable)) return;
    e.stopPropagation();
  }
  var prevId = 'timer', installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; $(window).trigger('ztinstall'); });
  /* The Timer tab and the Trainer tab are two separate timers, as in the app: each keeps its own puzzle or set (and so its own solves) */
  var mode = 'timer', modeState = {};
  function isTrainerId(id) { return !!findSet(id); }
  function loadModes() { try { var m = /(?:^|; )ztimerModes=([^;]*)/.exec(document.cookie); if (m) modeState = JSON.parse(decodeURIComponent(m[1])) || {}; } catch (e) {} }
  function saveModes() { try { document.cookie = 'ztimerModes=' + encodeURIComponent(JSON.stringify(modeState)) + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {} }
  function enterMode(m) {
    var id = kernel.getProp('scrType'), c = currentPuzzle(), cm = isTrainerId(id) ? 'trainer' : 'timer';
    modeState[cm] = { id: id, name: c.name }; saveModes();
    mode = m;
    if (cm === m) return;
    var st = modeState[m] || (m === 'trainer' ? { id: 'oll', name: 'OLL' } : { id: '333', name: '3x3x3' });
    usePuzzle(st.id, st.name, null, function () { lastSig = ''; updateBar(); updateCorners(); });
  }
  function show(id) {
    var old = current; current = id;
    var screen = id === 'timer' || id === 'trainer';
    if (screen) enterMode(id);
    bar.find('.ztab').each(function () { $(this).toggleClass('on', $(this).data('p') === (id === 'trainerpick' ? 'trainer' : id)); });
    clearInterval(timerId); timerId = null;
    $('html').toggleClass('zpage-open', !screen);
    closeDrawer();
    if (screen) { root.hide(); lastSig = ''; updateBar(); updateCorners(); prevId = id; return; }
    kernel.hideDialog();
    var order = TABS.map(function (t) { return t[0]; }), dir = order.indexOf(id) > order.indexOf(prevId) ? 'zin-r' : 'zin-l';
    root.show(); $.each(pages, function (k, p) { p.toggle(k === id); });
    var p = pages[id];
    if (prevId !== id) p.removeClass('zin-r zin-l').width(), p.addClass(dir);
    if (id === 'solves') renderSolves(p);
    if (id === 'stats') { renderStats(p); timerId = setInterval(function () { renderStats(p); }, 4000); }
    if (id === 'trainerpick') renderTrainer(p);
    if (id === 'puzzles') renderPuzzles(p);
    if (id === 'themes') renderThemes(p);
    if (id === 'options') renderOptions(p);
    if (id === 'sessions') renderSessions(p);
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
    makePage('trainerpick', 'Trainer', 'trainer'); makePage('wca', 'WCA', 'wca'); makePage('puzzles', 'Puzzle', 'category'); makePage('themes', 'Theme', 'palette'); makePage('options', 'Options', 'settings'); makePage('sessions', 'Category', 'books'); makePage('backup', 'Export/Import', 'share');
    actionbar = $('<div id="zactionbar"></div>').append(
      barBtn('settings', 'Settings', function () { show('options'); }),
      $('<div class="za-title" role="button" tabindex="0"></div>').append($('<b class="za-name"></b>'), $('<span class="za-cat"></span>'))
        .on('click', function () { show(mode === 'trainer' ? 'trainerpick' : 'puzzles'); }),
      barBtn('checklist', 'Choose cases', function () { var s = findSet(kernel.getProp('scrType')); if (s && caseData(s[1])) { trSet = s; trSel = null; show('trainerpick'); } }).addClass('za-cases'),
      barBtn('category', 'Category', function () { show('sessions'); })).appendTo('body');
    /* the app opens its side menu with a swipe from the left edge */
    (function () {
      var x0, y0, edge = false;
      $(document).on('touchstart', function (e) { var t = e.originalEvent.touches[0]; x0 = t.clientX; y0 = t.clientY; edge = x0 < 24; })
        .on('touchend', function (e) { if (!edge) return; edge = false; var t = e.originalEvent.changedTouches[0]; if (t.clientX - x0 > 70 && Math.abs(t.clientY - y0) < 60) drawer.addClass('open'); });
    })();
    buildDrawer();
    loadModes(); mode = isTrainerId(kernel.getProp('scrType')) ? 'trainer' : 'timer';
    /* csTimer's hold-to-open circle menu is switched off */
    try { if (kernel.getProp('useGES')) kernel.setProp('useGES', false); } catch (e) {}
    setTimeout(function () { if (!$('#leftbar .c6').hasClass('enable')) $('#leftbar .c6').click(); }, 700);
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
    setInterval(function () { if (current === 'timer' || current === 'trainer') { updateBar(); updateCorners(); placeCorners(); scrambleButtons(); } }, 500);
    $(window).on('resize', placeCorners);
    [['Delete', 'remove'], ['Retry', 'retry'], ['DNF', 'dnf'], ['Add 2', 'plus2'], ['Comment', 'comment']].forEach(function (m) {
      $('#zquick input').filter(function () { return (this.title || '').indexOf(m[0]) === 0; }).addClass('zq zi-' + m[1]).val('');
    });
    /* quick buttons like the app: DNF and +2 update the time on screen, then an Undo button takes their place */
    (function () {
      var qb = $('#zquick');
      function qbtn(t) { return qb.find('input').filter(function () { return (this.title || '').indexOf(t) === 0; }); }
      function lastSolve() { var i = 0, s, l = null; try { while ((s = stats.timesAt(i)) && i < 200000) { l = s; i++; } } catch (e) {} return l; }
      function showLast() {
        var s = lastSolve(); if (!s) return;
        try {
          if (s[0][0] < 0) { $('#lcd').text('DNF'); }
          else { timer.lcd.val(s[0][1] + (s[0][0] > 0 ? s[0][0] : 0)); if (s[0][0] > 0) $('#lcd .insplabel').before('+'); }
        } catch (e) {}
      }
      function setUndo(on) { qb.toggleClass('zundo', !!on); }
      var undo = $('<input type="button" id="zq-undo" class="zq zi-undo" title="Undo" aria-label="Undo">').css({ margin: '0 6px', padding: 0, width: '48px', height: '42px', minWidth: 0, cursor: 'pointer' }).appendTo(qb);
      function setPen(sig) { return function () { kernel.pushSignal('ctrl', ['stats', sig]); setTimeout(function () { showLast(); setUndo(true); }, 80); this.blur(); }; }
      qbtn('DNF').off('click').on('click', setPen('DNF'));
      qbtn('Add 2').off('click').on('click', setPen('+2'));
      undo.on('click', function () { kernel.pushSignal('ctrl', ['stats', 'OK']); setTimeout(function () { showLast(); setUndo(false); }, 80); this.blur(); });
      kernel.regListener('ztquick2', 'time', function () { setUndo(false); });
    })();
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
    show(mode);
    $(window).on('resize', function () { if (current === 'stats') renderStats(pages.stats); });
  }
  $(function () { setTimeout(init, 0); });
})();
