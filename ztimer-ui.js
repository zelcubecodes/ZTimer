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
    ['Hazy Blues', '1959ff', '3b12ff', '0045f6', '2900ef', 'ffd740', 0], ['What... Green?', '6cf63e', '15ff8e', '78f74e', '00f27d', 'ff3415', 1],
    ['Spotty Guy', '0d0d0d', '0d0d0d', '171717', '171717', '1db954', 0], ['Simply Black', '000000', '000000', '000000', '000000', 'ffd740', 0],
    ['Simply White', 'ffffff', 'ffffff', 'fffeff', 'ffffff', 'ff5252', 1], ['Notably Yellow', 'ffeb7e', 'fffd69', 'ffee8f', 'fffd7a', 'ff80ab', 1],
    ['Bluy Gray', '607d8b', '455a64', '678695', '3e515a', 'ffd740', 0], ['Turtly Sea', 'b2f9ff', 'efebbe', 'd4fcff', 'e8e3a3', 'ff5252', 1],
    ['Pixie Falls', 'fcd6e3', 'aaf0ed', 'fde6ee', '8debe7', 'ff5252', 1], ['Oof Hot', 'fbb74c', 'ff5656', 'fcc46d', 'ff5656', '56ff56', 1],
    ['Wandy Dusk', '8e78ff', 'fc7d7b', '8067ff', 'fb5c5a', '7bfc83', 0], ['Relaxing Dawn', 'fccb90', 'd57eeb', 'fddab1', 'd06fe9', 'ebe07e', 1],
    ['Quite Purply', 'ed1e79', '662d8c', 'd81169', '5d297f', 'ffc400', 0], ['Even Purplier', '920ee6', '6304e9', '9b14f1', '5503c8', 'ffc107', 0],
    ['Definitely Purple', '673ab7', '512da8', '6e40c2', '4b299b', 'ffc400', 0], ['Tantalizing Torange', 'ed1c24', 'ff6219', 'd61119', 'e54900', '19c2ff', 0],
    ['Pinky Promises', 'ff577e', 'fd61c0', 'ff678a', 'fd50b9', 'c1fd61', 0], ['Delicious Brownie', '5c3c30', '422a24', '724b3c', '37231e', 'ffd740', 0],
    ['Earthy Teal', '18ff97', '24f594', '29ff9f', '0bec84', 'f53f24', 1], ['Greeny Gorilla', 'a8ff78', '78ffd6', 'bbff96', '93ffb9', 'ff8f78', 1],
    ['Lightly Skyish', '3afafa', '42f7cd', '5bfbfb', '31f7c9', 'f76642', 1], ['Cyanic Teal', '00ffa1', '00ffff', '55ffc0', '66ffff', 'ff4000', 1],
    ['Icy Hills', 'fffeff', 'd7fffe', 'fffeff', 'e8fffe', 'ff5252', 1], ['Greeny Everest', 'c6ffbd', 'ffffff', 'd5ffce', 'f2fff0', 'ff5252', 1]
  ];
  /* the app's text styles: they change the colour of the text (timer, bars, labels) */
  var TEXT_STYLES = [['Default', null], ['Pessoa', '#FF1744'], ['Lou', '#FF2A9F'], ['Burgess', '#FF4500'], ['Bowie', '#E86E60'], ['Brie', '#FFD4F9'], ['Matsson', '#651FFF'],
    ['Isakov', '#2962FF'], ['Adams', '#54FFFF'], ['Irwin', '#006B21'], ['Tarkovsky', '#00E676'], ['Ebert', '#82FFB3'], ['Tolkien', '#FFFF4C'], ['Asimov', '#FFFDBB'], ['Kubrick', '#BDBDBD']];
  var textStyle = 'Default', DEFAULT_THEME = 'Pixie Falls';
  function themeVars(t) {
    var light = !!t[6];
    return { light: light, bar: '#' + t[3], vars: {
      '--zt-a': '#' + t[1], '--zt-b': '#' + t[2], '--zt-bar': '#' + t[3], '--zt-tab': '#' + t[4], '--zt-amber': '#' + t[5],
      '--zt-fg': textColor(t, light), '--zt-onlink': '#ffffff', '--zt-link': '#2962ff',
      '--zt-glass': light ? 'rgba(0,0,0,.07)' : (t[0] === 'Simply Black' || t[0] === 'Spotty Guy' ? 'rgba(255,255,255,.08)' : 'rgba(10,12,90,.30)'),
      '--zt-shadow': light ? 'none' : '0 4px 24px rgba(0,0,40,.35)', '--zt-shadow2': light ? 'none' : '0 1px 6px rgba(0,0,40,.35)' } };
  }
  function textColor(t, light) {
    for (var k = 0; k < TEXT_STYLES.length; k++) if (TEXT_STYLES[k][0] === textStyle && TEXT_STYLES[k][1]) return TEXT_STYLES[k][1];
    return light ? '#161616' : '#ffffff';
  }
  function applyTheme(i, save) {
    var t = THEMES[i] || THEMES[0], v = themeVars(t), root = document.documentElement;
    for (var k in v.vars) root.style.setProperty(k, v.vars[k]);
    $('html').toggleClass('zt-light', v.light).toggleClass('zt-dark', t[0] === 'Simply Black' || t[0] === 'Spotty Guy');
    $('meta[name=theme-color]').attr('content', v.bar);
    if (save) { try { document.cookie = 'ztimerTheme=' + encodeURIComponent(JSON.stringify({ i: i, n: t[0], tx: textStyle, light: v.light, vars: v.vars })) + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {} }
    lastSig = '';
  }
  /* themes used to be saved by position with the old short names; this maps them to the app's names */
  var OLD_THEME_NAMES = ['Hazy Blues', 'Pinky Promises', 'Definitely Purple', 'Even Purplier', 'Quite Purply', 'Tantalizing Torange', 'Delicious Brownie', 'Simply Black', 'Lightly Skyish', 'Greeny Gorilla', 'Cyanic Teal', 'Earthy Teal', 'What... Green?', 'Oof Hot', 'Notably Yellow', 'Relaxing Dawn', 'Greeny Everest', 'Icy Hills', 'Simply White'];
  function savedTheme() {
    try {
      var m = /(?:^|; )ztimerTheme=([^;]*)/.exec(document.cookie), c = m ? JSON.parse(decodeURIComponent(m[1])) : null, nm = c ? (c.n || OLD_THEME_NAMES[c.i]) : DEFAULT_THEME;
      if (c && c.tx) textStyle = c.tx;
      for (var k = 0; k < THEMES.length; k++) if (THEMES[k][0] === nm) return k;
    } catch (e) {}
    for (var d = 0; d < THEMES.length; d++) if (THEMES[d][0] === DEFAULT_THEME) return d;
    return 0;
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
  /* ---- speed: every list of solves gets one cheap fingerprint, so heavy maths is done once and reused ---- */
  var MEMO = {}, memoN = 0;
  function sigOf(a) {
    if (a._sig) return a._sig;
    var s = 0, d = 0, p = 0, n = a.length;
    for (var i = 0; i < n; i++) {
      var x = a[i], w = i % 97 + 1;
      if (x.t === Infinity) d += w; else s += x.t * w;
      p += (x.pen > 0 ? 1 : x.pen < 0 ? 2 : 0) * (i % 13 + 1);
    }
    return (a._sig = n + ':' + s + ':' + d + ':' + p);
  }
  function memo(a, key, fn) {
    var k = key + '|' + sigOf(a);
    if (MEMO.hasOwnProperty(k)) return MEMO[k];
    if (++memoN > 60) { MEMO = {}; memoN = 0; }
    return (MEMO[k] = fn());
  }
  /* every running average of n in one pass: a sorted window slides along instead of being sorted again for each solve */
  function avgSeries(a, n) {
    return memo(a, 'avg' + n, function () {
      var out = new Array(a.length), trim = Math.ceil(n * 0.05), win = [], dnf = 0, sum = 0, keep = n - 2 * trim;
      function lower(v) { var lo = 0, hi = win.length; while (lo < hi) { var m = (lo + hi) >> 1; if (win[m] < v) lo = m + 1; else hi = m; } return lo; }
      for (var i = 0; i < a.length; i++) {
        var t = a[i].t;
        if (t === Infinity) dnf++; else { win.splice(lower(t), 0, t); sum += t; }
        if (i >= n) { var o = a[i - n].t; if (o === Infinity) dnf--; else { win.splice(lower(o), 1); sum -= o; } }
        if (i + 1 < n) { out[i] = null; continue; }
        if (dnf > trim || keep <= 0) { out[i] = Infinity; continue; }
        var f = win.length, hiDrop = trim - dnf, tot = sum, k;
        for (k = 0; k < trim; k++) tot -= win[k];
        for (k = 0; k < hiDrop; k++) tot -= win[f - 1 - k];
        out[i] = tot / keep;
      }
      return out;
    });
  }
  function mo3Series(a) {
    return memo(a, 'mo3', function () {
      var out = new Array(a.length);
      for (var i = 0; i < a.length; i++) out[i] = i < 2 ? null : (a[i].t === Infinity || a[i - 1].t === Infinity || a[i - 2].t === Infinity ? Infinity : (a[i].t + a[i - 1].t + a[i - 2].t) / 3);
      return out;
    });
  }
  function compute(a) {
    return memo(a, 'compute', function () {
      var r = { n: a.length, dnf: 0, best: null, worst: null, mean: null }, sum = 0, cnt = 0;
      for (var i = 0; i < a.length; i++) {
        var t = a[i].t;
        if (t === Infinity) { r.dnf++; continue; }
        cnt++; sum += t;
        if (r.best == null || t < r.best) r.best = t;
        if (r.worst == null || t > r.worst) r.worst = t;
      }
      r.mean = cnt ? sum / cnt : null;
      [5, 12, 100].forEach(function (n) {
        var series = avgSeries(a, n);
        r['ao' + n] = series[series.length - 1];
        r['bao' + n] = best(series);
        r['s' + n] = series;
      });
      return r;
    });
  }

  /* ---- page scaffolding ---- */
  function makePage(id, title, ic) {
    var p = $('<div class="zpage" id="zp-' + id + '"></div>');
    var head = $('<div class="zp-head"></div>').append(icon(ic), $('<b class="zp-title"></b>').text(title),
      $('<span class="zp-sub"></span>'),
      $('<button class="zp-gear" title="Options" aria-label="Options"></button>').append(icon('settings')).on('click', function () { show('options'); }));
    if (id === 'options' || id === 'themes' || id === 'scheme' || id === 'backup' || id === 'sessions' || id === 'sync')
      head.prepend($('<button class="zp-back" title="Back" aria-label="Back"></button>').append(icon('back')).on('click', function () { navBack(false); }));
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
    var body = p.find('.zp-body').empty(), a = showArch ? archSolves() : solves(), src = $('#stats select').first();
    subtitle(p);
    var tools = $('<div class="zsbar"></div>').appendTo(body);
    $('<button class="zbtn" title="Add time" aria-label="Add time"></button>').append(icon('alarmadd')).on('click', function () { addTimeDialog(function () { renderSolves(p); }); }).appendTo(tools);
    $('<span class="zsb-sep"></span>').appendTo(tools);
    var searchBox = $('<input type="search" class="zsearch" placeholder="Search comments" aria-label="Search solves">').val(solveQuery).appendTo(tools), searchT = null;
    var moreB = $('<button class="zbtn" title="More" aria-label="More"></button>').append(icon('more')).on('click', function (e) {
      e.stopPropagation();
      popMenu($(this), [['Sort by time, fastest first', function () { sortMode = 'best'; renderSolves(p); }], ['Sort by time, slowest first', function () { sortMode = 'worst'; renderSolves(p); }],
        ['Sort by date, newest first', function () { sortMode = 'new'; renderSolves(p); }], ['Sort by date, oldest first', function () { sortMode = 'old'; renderSolves(p); }],
        ['Share session...', function () { shareSessionMenu(moreB, a); }],
        zs('clearBtn') ? ['Delete all solves', function () {
          if (!a.length) return;
          if (confirm('Delete all ' + a.length + ' solves in this session?')) { for (var k = 0; k < a.length; k++) kernel.pushSignal('ctrl', ['stats', 'undo']); setTimeout(function () { renderSolves(p); }, 300); }
        }] : null, ['Category', function () { show('sessions'); }], ['Export or import', function () { show('backup'); }]].filter(Boolean));
    }).appendTo(tools);
    if (!a.length) { body.append($('<p class="zp-note"></p>').text(showArch ? 'Nothing archived here yet. Use the three dots on a solve to archive it.' : 'No solves in this session yet. Go to the Timer tab and do a solve.')); return; }
    var list = $('<div class="zlist zgrid"></div>').appendTo(body), listEl = list[0], moreBtn = $('<button class="zshare zmore"></button>').hide().appendTo(body), order = [], shown = 0, hay = null;
    var CHUNK = 120, DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function p2(n) { return n < 10 ? '0' + n : '' + n; }
    function rowEl(i) {
      var x = a[i], r = document.createElement('div'), sp;
      r.className = 'zrow'; r.setAttribute('data-i', i);
      sp = document.createElement('span'); sp.className = 'zr-d';
      if (x.ts) { var d = new Date(x.ts * 1000); sp.textContent = p2(d.getDate()) + '/' + p2(d.getMonth() + 1); }
      r.appendChild(sp);
      if (x.cmt) { sp = document.createElement('span'); sp.className = 'zr-c zi zi-comment'; r.appendChild(sp); }
      sp = document.createElement('span'); sp.className = 'zr-t' + (x.t === Infinity ? ' dnf' : ''); sp.textContent = pretty(x.t) + (x.pen > 0 ? '+' : ''); r.appendChild(sp);
      return r;
    }
    function more() {
      var end = Math.min(order.length, shown + CHUNK), frag = document.createDocumentFragment();
      for (; shown < end; shown++) frag.appendChild(rowEl(order[shown]));
      listEl.appendChild(frag);
      if (shown < order.length) moreBtn.empty().append($('<span></span>').text('Show more (' + (order.length - shown).toLocaleString('en-US') + ' left)')).show(); else moreBtn.hide();
    }
    function hayOf(i) {
      if (!hay) hay = [];
      if (hay[i] == null) { var x = a[i], d = x.ts ? new Date(x.ts * 1000) : null; hay[i] = (pretty(x.t) + ' ' + (x.cmt || '') + ' ' + (d ? DAY[d.getDay()] + ' ' + d.getDate() + ' ' + MON3[d.getMonth()] : '') + ' ' + (x.pen < 0 ? 'dnf' : (x.pen > 0 ? '+2' : ''))).toLowerCase(); }
      return hay[i];
    }
    function fillList() {
      order = a.map(function (_, i) { return i; });
      var q = solveQuery.trim().toLowerCase();
      if (q) order = order.filter(function (i) { return hayOf(i).indexOf(q) >= 0; });
      if (sortMode === 'new') order.reverse();
      else if (sortMode === 'best') order.sort(function (u, v) { return a[u].t - a[v].t || u - v; });
      else if (sortMode === 'worst') order.sort(function (u, v) { return (a[v].t === a[u].t ? 0 : a[v].t - a[u].t) || v - u; });
      listEl.innerHTML = ''; shown = 0; more();
      if (!order.length) $(listEl).append($('<p class="zp-note"></p>').text('No solves match that search.'));
    }
    list.on('click', '.zrow', function () { solveDialog(+this.getAttribute('data-i'), p, showArch); });
    moreBtn.on('click', more);
    body.off('scroll.zmore').on('scroll.zmore', function () { if (shown < order.length && this.scrollTop + this.clientHeight > this.scrollHeight - 700) more(); });
    searchBox.on('input', function () {
      solveQuery = this.value; clearTimeout(searchT); searchT = setTimeout(fillList, 160);
    });
    fillList();
  }

  /* ---- solve pop-up like the app's: time and date, comment, scramble, then penalty / comment / more ---- */
  /* csTimer keeps the real edit functions private, so actions borrow its own (invisible) solve dialog */
  function bridge(i, fn) {
    $('html').addClass('zt-bridge');
    try { $('#stats tr[data="' + i + '"]').children().eq(1).click(); fn(); } catch (e) {}
    try { kernel.hideDialog(); } catch (e) {}
    $('html').removeClass('zt-bridge');
  }
  /* ---- archive (the app's "history"): archived solves leave the session and are kept in this browser ---- */
  var showArch = false;
  function archKey() { return (sessSel().find('option:selected').text() || '') + '|' + kernel.getProp('scrType'); }
  function archList() { try { return (JSON.parse(localStorage.ztArchive || '{}')[archKey()]) || []; } catch (e) { return []; } }
  function archSave(list) { try { var all = JSON.parse(localStorage.ztArchive || '{}'); all[archKey()] = list; localStorage.ztArchive = JSON.stringify(all); } catch (e) { toast('Could not save the archive here.'); } }
  function archSolves() { return archList().map(function (r) { return { t: r.pen < 0 ? Infinity : r.ms + (r.pen > 0 ? r.pen : 0), pen: r.pen, raw: r.ms, scr: r.scr, cmt: r.cmt, ts: r.ts }; }); }
  function rawOf(i) { try { var q = stats.timesAt(i); return q[0][1]; } catch (e) { return 0; } }
  function saveIdx(i) { bridge(i, function () { var ta = $('.dialogcfm textarea').first(); ta.val(ta.val()).trigger('input').trigger('change').trigger('blur'); }); }
  function retrySolve(x) {
    show('timer');
    setTimeout(function () { try { kernel.pushSignal('scrfix', x.scr); toast('Scramble loaded in the timer'); } catch (e) {} }, 250);
  }
  /* ---- one outline icon set, the same shapes as the app (24 x 24, round ends) ---- */
  var ICONS = {
    save: '<path d="M12 4v11M7.5 11.5L12 16l4.5-4.5M5 20h14"/>',
    send: '<path d="M12 15V4M8 7.5L12 4l4 3.5M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    sync: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4.5h-4.5"/>',
    instagram: '<path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M17.4 6.6h.01" stroke-width="2.6"/>',
    facebook: '<path d="M14.5 21v-8h2.7l.5-3.3h-3.2V7.9c0-.9.4-1.6 1.7-1.6h1.6V3.4c-.3 0-1.3-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3v2.2H8.3V13h2.9v8"/>',
    messenger: '<path d="M12 3C7 3 3 6.7 3 11.4c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.8.2 1.7.3 2.7.3 5 0 9-3.7 9-8.2S17 3 12 3z"/><path d="M7 13.5l3.6-3.8 2.8 2.4 3.6-3.4"/>',
    whatsapp: '<path d="M3.2 20.8l1.4-4.6A8.6 8.6 0 1 1 8 19.5z"/><path d="M9.4 8.7c-.3.6-.1 1.5.9 2.9 1 1.4 2 2.1 3 2.5.7.3 1.3.1 1.6-.3l.3-.7-1.7-.9-.7.6c-.9-.4-1.6-1.1-2-2l.6-.7-.8-1.7z"/>',
    telegram: '<path d="M20.5 4L3.5 10.8l5.3 2 1.6 5.2 2.6-3.3 4.6 3.3z"/><path d="M8.8 12.8L20.5 4"/>',
    x: '<path d="M5 4.5l14 15M19 4.5l-14 15"/>'
  };
  function ic(name, size) { return '<svg class="zic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>'; }
  function ibtn(icn, label, cls) { var b = $('<button class="zsh-btn"></button>').addClass(cls || ''); b.html(ic(icn, 18) + '<span></span>'); b.find('span').text(label); return b; }
  /* short animations that confirm what happened: pop = done, shake = did not work */
  function anim(el, cls) { el.removeClass('zbump zshake'); void el[0].offsetWidth; el.addClass(cls); }
  function flashBtn(b, icn, label, backIcn, backLabel) {
    b.addClass('ok').html(ic(icn, 18) + '<span></span>'); b.find('span').text(label); anim(b, 'zbump');
    setTimeout(function () { b.removeClass('ok').html(ic(backIcn, 18) + '<span></span>'); b.find('span').text(backLabel); }, 1800);
  }

  /* ---- Solve cards: pictures that can be saved or sent to other apps. One look for all of them:
     the time in a box at the top left, date and event beside it, the content in the middle, logo and name bottom right ---- */
  var CARD_FONT = 'Quicksand, "Segoe UI", Arial, sans-serif', MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(ts) { var d = new Date(ts * 1000); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
  function eventName() { var pz = currentPuzzle(); return pz.name + (pz.cat && pz.cat !== 'Normal' ? '  \u00B7  ' + pz.cat : ''); }
  function timeText(t) { return t === Infinity ? 'DNF' : pretty(t); }
  var logoImg = null;
  function withLogo(cb) {
    if (logoImg) return cb(logoImg.naturalWidth ? logoImg : null);
    var im = new Image(); im.onload = function () { logoImg = im; cb(im); }; im.onerror = function () { logoImg = new Image(); cb(null); }; im.src = 'icon-192.png';
  }
  function fitSize(c, text, weight, size, maxW) { c.font = weight + ' ' + size + 'px ' + CARD_FONT; var w = c.measureText(text).width; return w > maxW ? Math.max(18, Math.floor(size * maxW / w)) : size; }
  function wrapText(c, text, maxW) {
    var words = String(text || '').split(/\s+/).filter(Boolean), lines = [], cur = '';
    words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); return lines;
  }
  function pillRow(c, items, cx, cy) {
    c.font = '700 34px ' + CARD_FONT; c.textAlign = 'center';
    var ws = items.map(function (t) { return c.measureText(t).width + 56; }), tot = ws.reduce(function (x, y) { return x + y; }, 0) + 16 * (items.length - 1), x = cx - tot / 2;
    items.forEach(function (t, k) { c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, x, cy - 30, ws[k], 60, 30); c.fill(); c.fillStyle = '#1b1b2b'; c.fillText(t, x + ws[k] / 2, cy + 12); x += ws[k] + 16; });
  }
  /* spec: { big: 'the time', side: [[text, weight, size, alpha], ...], body: function (c, area) } */
  function cardCanvas(spec, logo) {
    var W = 1080, H = spec.h || 1350, M = 64, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var c = cv.getContext('2d'), cs = getComputedStyle(document.documentElement), A = cs.getPropertyValue('--zt-a').trim() || '#1959ff', B = cs.getPropertyValue('--zt-b').trim() || '#3b12ff', fgc = cs.getPropertyValue('--zt-fg').trim() || '#fff';
    var g = c.createLinearGradient(0, 0, W * 0.6, H); g.addColorStop(0, A); g.addColorStop(1, B); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.textBaseline = 'alphabetic';
    /* the time, in a box */
    var big = String(spec.big), ts = fitSize(c, big, '700', 210, 520), bh = 250, bx = M, by = 64;
    c.font = '700 ' + ts + 'px ' + CARD_FONT; var bw = Math.round(c.measureText(big).width + 90);
    c.globalAlpha = 0.18; c.fillStyle = fgc; rr(c, bx, by, bw, bh, 40); c.fill(); c.globalAlpha = 1;
    c.strokeStyle = fgc; c.lineWidth = 8; rr(c, bx, by, bw, bh, 40); c.stroke();
    c.fillStyle = fgc; c.textAlign = 'center'; c.fillText(big, bx + bw / 2, by + bh / 2 + ts * 0.35);
    /* date and event beside it */
    var sx = bx + bw + 40, sw = W - M - sx, side = spec.side || [], sizes = side.map(function (l) { return fitSize(c, l[0], l[1], l[2], sw); }), tot = 0;
    sizes.forEach(function (z) { tot += z * 1.35; });
    var y = by + bh / 2 - tot / 2; c.textAlign = 'left';
    side.forEach(function (l, k) { y += sizes[k] * 1.05; c.globalAlpha = l[3]; c.font = l[1] + ' ' + sizes[k] + 'px ' + CARD_FONT; c.fillText(l[0], sx, y); y += sizes[k] * 0.3; });
    c.globalAlpha = 1;
    /* the middle */
    c.textAlign = 'center'; c.fillStyle = fgc;
    if (spec.body) spec.body(c, { x: M, y: 372, w: W - 2 * M, h: H - 372 - 150, fg: fgc });
    /* logo and name, bottom right */
    c.textAlign = 'right'; c.fillStyle = fgc; c.globalAlpha = 0.9; c.font = '700 46px ' + CARD_FONT;
    var nameW = c.measureText('ZTimer').width, fy = H - 62; c.fillText('ZTimer', W - M, fy);
    if (logo) { var ls = 68, lx = W - M - nameW - 18 - ls; c.save(); rr(c, lx, fy - 50, ls, ls, 16); c.clip(); c.drawImage(logo, lx, fy - 50, ls, ls); c.restore(); }
    c.globalAlpha = 1;
    return cv;
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  /* the bodies */
  function bodySolve(x, img, badges) {
    return function (c, A) {
      var y = A.y;
      if (badges.length) { pillRow(c, badges, A.x + A.w / 2, y + 30); y += 92; }
      c.font = '600 38px ' + CARD_FONT;
      var lines = wrapText(c, x.scr || '-', A.w - 90), ml = 5, lh = 52; if (lines.length > ml) { lines = lines.slice(0, ml); lines[ml - 1] += ' ...'; }
      var ph = lines.length * lh + 50;
      c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, A.x, y, A.w, ph, 36); c.fill();
      c.fillStyle = '#1b1b2b'; c.textAlign = 'center';
      lines.forEach(function (l, k) { c.fillText(l, A.x + A.w / 2, y + 25 + lh * (k + 0.78)); });
      y += ph + 28;
      if (x.cmt) { c.font = 'italic 600 34px ' + CARD_FONT; c.fillStyle = A.fg; c.globalAlpha = 0.9; var cm = String(x.cmt); if (cm.length > 60) cm = cm.slice(0, 58) + '...'; c.fillText('\u201C' + cm + '\u201D', A.x + A.w / 2, y + 30); c.globalAlpha = 1; y += 60; }
      if (img) drawImageFit(c, img, A.x, y, A.w, A.y + A.h - y);
    };
  }
  /* draws the scramble picture as large as it fits and really centred: the picture is drawn once at the final size,
     its empty margins are measured and left out. The app does exactly the same. */
  function drawImageFit(c, img, ax, ay, aw, ah) {
    if (ah < 40 || aw < 40) return;
    var iw = img.naturalWidth || img.width || 300, ih = img.naturalHeight || img.height || 300, s = Math.min(aw / iw, ah / ih),
        bw = Math.max(1, Math.round(iw * s)), bh = Math.max(1, Math.round(ih * s)), off = document.createElement('canvas');
    off.width = bw; off.height = bh;
    var o = off.getContext('2d'); o.drawImage(img, 0, 0, bw, bh);
    var sx = 0, sy = 0, sw = bw, sh = bh;
    try {
      var d = o.getImageData(0, 0, bw, bh).data, x0 = bw, y0 = bh, x1 = -1, y1 = -1;
      for (var yy = 0; yy < bh; yy++) for (var xx = 0; xx < bw; xx++) if (d[(yy * bw + xx) * 4 + 3] > 10) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      if (x1 >= x0 && y1 >= y0 && x1 - x0 + 1 >= bw * 0.4 && y1 - y0 + 1 >= bh * 0.4) { sx = x0; sy = y0; sw = x1 - x0 + 1; sh = y1 - y0 + 1; }
    } catch (e) {}
    c.drawImage(off, sx, sy, sw, sh, ax + aw / 2 - sw / 2, ay + ah / 2 - sh / 2, sw, sh);
  }
  /* one row per solve: its number in a chip, its time and, beside the time, the scramble of that solve */
  function bodyList(items) {
    return function (c, A) {
      var rows = items.length, gap = rows > 6 ? 10 : 16, ch = Math.min(150, (A.h - gap * (rows - 1)) / rows), th = rows * ch + (rows - 1) * gap, y0 = A.y + Math.max(0, (A.h - th) / 2),
          rowR = 28, pad = 16, chip = Math.min(56, ch - 2 * pad), chipR = Math.max(rowR - pad, 2), tsz = Math.min(56, Math.round(ch * 0.5)), timeX = pad + chip + 24, timeW = 0;
      c.font = '700 ' + tsz + 'px ' + CARD_FONT;
      items.forEach(function (it) { timeW = Math.max(timeW, c.measureText(it.mark ? '(' + it.t + ')' : it.t).width); });
      items.forEach(function (it, k) {
        var x = A.x, y = y0 + k * (ch + gap), cy = y + ch / 2, nsz = Math.round(chip * 0.54);
        c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, x, y, A.w, ch, rowR); c.fill();
        c.fillStyle = '#e9ecf8'; rr(c, x + pad, cy - chip / 2, chip, chip, chipR); c.fill();
        c.textAlign = 'center'; c.fillStyle = '#5a5f82'; c.font = '700 ' + nsz + 'px ' + CARD_FONT; c.fillText(String(k + 1), x + pad + chip / 2, cy + nsz * 0.35);
        c.textAlign = 'left'; c.fillStyle = '#1b1b2b'; c.font = '700 ' + tsz + 'px ' + CARD_FONT; c.fillText(it.mark ? '(' + it.t + ')' : it.t, x + timeX, cy + tsz * 0.35);
        if (it.scr) {
          var sx = x + timeX + timeW + 32, sw = A.x + A.w - 28 - sx, size, lines, lh;
          for (size = 30; size >= 14; size--) { c.font = '600 ' + size + 'px ' + CARD_FONT; lines = wrapText(c, it.scr, sw); lh = size * 1.25; if (lines.length * lh <= ch - 16) break; }
          var maxL = Math.max(1, Math.floor((ch - 16) / lh));
          if (lines.length > maxL) { lines = lines.slice(0, maxL); lines[maxL - 1] = lines[maxL - 1].replace(/\s*\S*$/, '') + ' ...'; }
          c.fillStyle = '#22253a';
          lines.forEach(function (l, j) { c.fillText(l, sx, y + (ch - lines.length * lh) / 2 + lh * (j + 0.8)); });
        }
      });
    };
  }
  function bodyTiles(items) {
    return function (c, A) {
      var cols = 2, rows = Math.ceil(items.length / cols), gap = 18, cw = (A.w - gap) / 2, ch = Math.min(150, (A.h - gap * (rows - 1)) / rows), y0 = A.y + Math.max(0, (A.h - (rows * ch + (rows - 1) * gap)) / 2);
      items.forEach(function (it, k) {
        var x = A.x + (k % 2) * (cw + gap), y = y0 + Math.floor(k / 2) * (ch + gap);
        c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, x, y, cw, ch, 28); c.fill();
        c.fillStyle = '#7b7f9e'; c.textAlign = 'center'; c.font = '700 30px ' + CARD_FONT; c.fillText(it[0], x + cw / 2, y + ch * 0.36);
        c.fillStyle = '#1b1b2b'; c.font = '700 ' + fitSize(c, it[1], '700', 56, cw - 40) + 'px ' + CARD_FONT; c.fillText(it[1], x + cw / 2, y + ch * 0.78);
      });
    };
  }
  function bodyDist(vals) {
    return function (c, A) {
      var py = A.y + 10, ph = A.h - 20;
      c.fillStyle = 'rgba(255,255,255,.92)'; rr(c, A.x, py, A.w, ph, 36); c.fill();
      c.textAlign = 'center';
      if (vals.length < 3) { c.fillStyle = '#1b1b2b'; c.font = '700 40px ' + CARD_FONT; c.fillText('Needs at least 3 results', A.x + A.w / 2, py + ph / 2); return; }
      var lo = Infinity, hi = 0; vals.forEach(function (v) { if (v < lo) lo = v; if (v > hi) hi = v; });
      var steps = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 60000], bw = 60000;
      for (var i = 0; i < steps.length; i++) if (Math.ceil((hi - lo + 1) / steps[i]) <= 10) { bw = steps[i]; break; }
      var start = Math.floor(lo / bw) * bw, n = Math.max(1, Math.ceil((hi - start + 1) / bw)), bins = [], mx = 0, b;
      for (b = 0; b < n; b++) bins.push(0);
      vals.forEach(function (t) { var k = Math.min(n - 1, Math.floor((t - start) / bw)); bins[k]++; if (bins[k] > mx) mx = bins[k]; });
      var L = A.x + 36, T = py + 70, w = (A.w - 72) / n, h = ph - 70 - 70;
      bins.forEach(function (k, j) {
        var bh = h * k / mx, x = L + j * w;
        c.fillStyle = '#2962ff'; rr(c, x + 6, T + h - bh, Math.max(4, w - 12), Math.max(4, bh), 10); c.fill();
        c.fillStyle = '#1b1b2b'; c.font = '700 34px ' + CARD_FONT; if (k) c.fillText(String(k), x + w / 2, T + h - bh - 12);
        c.fillStyle = '#7b7f9e'; c.font = '700 30px ' + CARD_FONT; c.fillText(((start + j * bw) / 1000).toFixed(bw < 1000 ? 1 : 0), x + w / 2, T + h + 48);
      });
    };
  }

  /* the cards */
  function solveSpec(x, d, a, i, img) {
    var badges = [], ex = a && i != null ? i : null;
    if (ex != null) {
      var pb = x.t !== Infinity && ex > 0; for (var k = 0; k < ex && pb; k++) if (a[k].t <= x.t) pb = false;
      if (pb) badges.unshift('PB');
    }
    if (x.pen > 0 && x.t !== Infinity) badges.push('+2');
    return { big: timeText(x.t), side: [[eventName(), '700', 50, 1], [d ? fmtDate(x.ts) : '', '600', 42, 0.9]].concat(ex != null ? [['Solve #' + (ex + 1), '600', 36, 0.9]] : []), body: bodySolve(x, img, badges.slice(0, 4)) };
  }
  function avgSpec(a, n) {
    var last = a.slice(-n), trim = Math.ceil(n * 0.05), idx = last.map(function (_, k) { return k; }).sort(function (u, v) { return (last[u].t === last[v].t ? 0 : last[u].t < last[v].t ? -1 : 1) || u - v; }), mark = {};
    if (n >= 5) { for (var k = 0; k < trim; k++) { mark[idx[k]] = 1; mark[idx[n - 1 - k]] = 1; } }
    var items = last.map(function (x, k) { return { t: timeText(x.t) + (x.pen > 0 ? '+' : ''), mark: !!mark[k], scr: x.scr || '' }; }), d0 = last[0].ts, d1 = last[n - 1].ts;
    return { big: timeText(avgOf(a, a.length - 1, n)), side: [[eventName(), '700', 50, 1], ['Average of ' + n, '700', 44, 0.95], [d1 ? (d0 && fmtDate(d0) !== fmtDate(d1) ? fmtDate(d0) + ' - ' + fmtDate(d1) : fmtDate(d1)) : '', '600', 38, 0.85]], body: bodyList(items), h: n > 6 ? 372 + 150 + n * 112 + (n - 1) * 10 : 0 };
  }
  function distSpec(a) {
    var vals = a.filter(function (x) { return x.t !== Infinity; }).map(function (x) { return x.t; }), r = compute(a), ts = a.length ? a[a.length - 1].ts : 0;
    return { big: r.mean == null ? '--' : pretty(r.mean), side: [[eventName(), '700', 50, 1], ['Time distribution', '700', 44, 0.95], [a.length + ' solves' + (ts ? '  \u00B7  ' + fmtDate(ts) : ''), '600', 38, 0.85]], body: bodyDist(vals) };
  }
  function sessionSpec(a) {
    var r = compute(a), f = function (v) { return v == null ? '--' : pretty(v); }, ts = a.length ? a[a.length - 1].ts : 0, o = [];
    a.forEach(function (x) { if (x.t !== Infinity) o.push(x.t); });
    var sd = null; if (o.length > 1) { var m = r.mean; sd = Math.sqrt(o.reduce(function (q, v) { return q + (v - m) * (v - m); }, 0) / o.length); }
    return { big: f(r.best), side: [[eventName(), '700', 50, 1], ['Session best', '700', 44, 0.95], [a.length + ' solves' + (ts ? '  \u00B7  ' + fmtDate(ts) : ''), '600', 38, 0.85]],
      body: bodyTiles([['Mean', f(r.mean)], ['Worst', f(r.worst)], ['Best Ao5', f(r.bao5)], ['Best Ao12', f(r.bao12)], ['Current Ao5', f(r.ao5)], ['Current Ao12', f(r.ao12)], ['Best Ao100', f(r.bao100)], ['Deviation', f(sd)]]) };
  }

  /* ---- the pop-up that shows a card with its buttons ---- */
  function openCard(spec, name, text, title) {
    var ov = $('<div class="zmodal zsh-ov"></div>'), card = $('<div class="zsh"></div>').appendTo(ov);
    card.append($('<div class="zsh-title"></div>').text(title || 'Solve card'));
    var holder = $('<div class="zsh-pic"></div>').appendTo(card), cv = null, blob = null;
    withLogo(function (logo) { cv = cardCanvas(spec, logo); holder.empty().append($(cv)); cv.toBlob(function (b) { blob = b; }, 'image/png'); });
    function save() { if (!cv) return false; var a = document.createElement('a'); a.download = name; a.href = cv.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); return true; }
    function shareImg() {
      if (!blob) return false; var f = new File([blob], name, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: title || 'My solve', text: text }).catch(function () {}); return true; }
      save(); toast('Your browser cannot send pictures to apps, so the card was saved. Post it from your gallery.'); return false;
    }
    var txt = encodeURIComponent(text), site = encodeURIComponent(location.origin + location.pathname);
    var row = $('<div class="zsh-row"></div>').appendTo(card);
    var saveB = ibtn('save', 'Save', 'pri').appendTo(row).on('click', function () { if (save()) flashBtn(saveB, 'check', 'Saved', 'save', 'Save'); else anim(saveB, 'zshake'); });
    var sendB = ibtn('send', 'Share...', 'pri').appendTo(row).on('click', function () { if (!shareImg()) anim(sendB, 'zshake'); });
    card.append($('<div class="zsh-lab">Send to</div>'));
    var apps = $('<div class="zsh-apps"></div>').appendTo(card);
    [['instagram', 'Instagram', shareImg], ['facebook', 'Facebook', shareImg], ['messenger', 'Messenger', shareImg],
      ['whatsapp', 'WhatsApp', function () { window.open('https://wa.me/?text=' + txt, '_blank'); return true; }],
      ['telegram', 'Telegram', function () { window.open('https://t.me/share/url?url=' + site + '&text=' + txt, '_blank'); return true; }],
      ['x', 'X', function () { window.open('https://twitter.com/intent/tweet?text=' + txt, '_blank'); return true; }]]
      .forEach(function (a) {
        var b = $('<button class="zsh-app"></button>').append($('<span class="zsh-disc"></span>').html(ic(a[0], 24)), $('<span class="zsh-name"></span>').text(a[1])).appendTo(apps);
        b.on('click', function () { var d = b.find('.zsh-disc'); if (a[2]()) anim(d, 'zbump'); else anim(d, 'zshake'); });
      });
    card.append($('<p class="zsh-note"></p>').text('Instagram, Facebook and Messenger take the picture through your phone\u2019s share sheet. WhatsApp, Telegram and X send the text.'));
    card.append($('<button class="zsh-done">Done</button>').on('click', function () { ov.remove(); }));
    ov.on('click', function (e) { if (e.target === ov[0]) ov.remove(); }).appendTo('body');
  }
  function slug(s) { return String(s).replace(/[^0-9a-z]+/gi, '-').replace(/^-|-$/g, '') || 'card'; }
  function shareSolve(x, d, a, i) {
    var src = scrImgSrc(x.scr), go = function (img) { openCard(solveSpec(x, d, a, i, img), 'ztimer-' + slug(timeText(x.t)) + '.png', timeText(x.t) + ' ' + currentPuzzle().name + (x.scr ? '\n' + x.scr : ''), 'Solve card'); };
    if (src) { var im = new Image(); im.onload = function () { go(im); }; im.onerror = function () { go(null); }; im.src = src; } else go(null);
  }
  function shareAvgCard(a, n) {
    if (a.length < n) { toast('You need at least ' + n + ' solves.'); return; }
    var last = a.slice(-n);
    openCard(avgSpec(a, n), 'ztimer-ao' + n + '.png', currentPuzzle().name + ' ao' + n + ': ' + pretty(avgOf(a, a.length - 1, n)) + '\n' + last.map(function (x, k) { return (k + 1) + '. ' + pretty(x.t); }).join('\n'), 'Average of ' + n);
  }
  function shareDistCard(a) {
    if (!a.length) { toast('No solves to share yet.'); return; }
    openCard(distSpec(a), 'ztimer-distribution.png', currentPuzzle().name + ' time distribution (' + a.length + ' solves)', 'Time distribution');
  }
  function shareSessionCard(a) {
    if (!a.length) { toast('No solves to share yet.'); return; }
    var r = compute(a);
    openCard(sessionSpec(a), 'ztimer-session.png', currentPuzzle().name + ': ' + a.length + ' solves, best ' + pretty(r.best) + ', mean ' + pretty(r.mean), 'Session card');
  }
  /* the "Share session..." list */
  function shareSessionMenu(anchor, a, extra) {
    popMenu(anchor, [['Session card', function () { shareSessionCard(a); }], ['Ao5 card', function () { shareAvgCard(a, 5); }], ['Ao12 card', function () { shareAvgCard(a, 12); }], ['Distribution card', function () { shareDistCard(a); }]].concat(extra || []));
  }
  function scrImgSrc(scr) {
    try { var svg = image.draw([kernel.getProp('scrType'), scr]); return svg ? 'data:image/svg+xml;base64,' + btoa(svg.render()) : null; } catch (e) { return null; }
  }
  function editTimeDialog(i, p) {
    var q = stats.timesAt(i), pen = q[0][0] < 0 ? -1 : (q[0][0] > 0 ? 2000 : 0);
    var ov = $('<div class="zmodal" style="z-index:90"></div>'), card = $('<div class="zm-card"></div>').appendTo(ov);
    var inp = $('<input type="text" inputmode="decimal" autocomplete="off">').val(kernel.pretty(q[0][1]));
    var chips = $('<div class="zm-chips"></div>'), hint = $('<p class="zm-hint">Type seconds like 12.34, or 1:05.20 for minutes.</p>');
    [['None', 0], ['+2', 2000], ['DNF', -1]].forEach(function (c) {
      $('<button class="zm-chip"></button>').text(c[0]).toggleClass('on', c[1] === pen).on('click', function () { pen = c[1]; chips.find('.zm-chip').removeClass('on'); $(this).addClass('on'); }).appendTo(chips);
    });
    function close() { ov.remove(); }
    function save() {
      var ms = parseTime(inp.val());
      if (!ms) { hint.text('Type a time first, like 1234 for 12.34').css('color', '#d32f2f'); return; }
      try { q[0][0] = pen; q[0][1] = ms; } catch (e) {}
      saveIdx(i); close(); lastSig = ''; renderSolves(p); solveDialog(i, p);
    }
    card.append($('<h3>Edit time</h3>'), inp, chips, hint, $('<div class="zm-btns"></div>').append($('<button class="zm-btn">Cancel</button>').on('click', close), $('<button class="zm-btn pri">Save</button>').on('click', save)));
    inp.on('keydown', function (e) { if (e.which === 13) save(); if (e.which === 27) close(); });
    ov.on('click', function (e) { if (e.target === ov[0]) close(); }).appendTo('body');
    setTimeout(function () { inp.focus().select(); }, 50);
  }
  function solveDialog(i, p, arch) {
    var a = arch ? archSolves() : solves(), x = a[i]; if (!x) return;
    $('.zsd-ov').remove();
    var ov = $('<div class="zmodal zsd-ov"></div>'), card = $('<div class="zsd"></div>').appendTo(ov);
    function close() { ov.remove(); }
    function refresh() { lastSig = ''; renderSolves(p); solveDialog(i, p, arch); }
    var d = x.ts ? new Date(x.ts * 1000) : null, t = pretty(x.t), mm = /^(.*?)(\.\d+)$/.exec(t);
    var time = $('<div class="zsd-time"></div>');
    if (mm) time.append(document.createTextNode(mm[1]), $('<small></small>').text(mm[2] + (x.pen > 0 ? '+' : ''))); else time.text(t);
    card.append($('<div class="zsd-top"></div>').append(time, d ? $('<div class="zsd-date"></div>').append(icon('date'),
      $('<div></div>').append($('<div></div>').text(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })), $('<div></div>').text(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })))) : ''));
    if (x.cmt) card.append($('<div class="zsd-row"></div>').append(icon('comment'), $('<span></span>').text(x.cmt)));
    var img = $('<div class="zsd-img"></div>').hide();
    card.append($('<div class="zsd-row zsd-scr"></div>').append(icon('casino'), $('<span class="zsd-st"></span>').text(x.scr || '-'), icon('dropdown')).on('click', function () {
      $(this).toggleClass('open');
      if (!img.children().length) { var src = scrImgSrc(x.scr); img.append(src ? $('<img alt="Scramble">').attr('src', src) : $('<span class="zsd-noimg">No picture for this scramble type.</span>')); }
      img.slideToggle(150);
    }), img);
    var pen = $('<div class="zsd-pen"></div>').hide();
    [['OK', 0, ' OK '], ['+2', 2000, ' +2 '], ['DNF', -1, ' DNF ']].forEach(function (c) {
      $('<button class="zm-chip"></button>').text(c[0]).toggleClass('on', (x.pen > 0 ? 2000 : x.pen < 0 ? -1 : 0) === c[1]).on('click', function () {
        if (arch) { var L = archList(); L[i].pen = c[1]; archSave(L); }
        else bridge(i, function () { $('.dialogcfm [data="p"]').filter(function () { return $(this).html() === c[2]; }).click(); });
        refresh();
      }).appendTo(pen);
    });
    function ib(ic, title, fn) { return $('<button class="zsd-ib"></button>').attr({ title: title, 'aria-label': title }).append(icon(ic)).on('click', fn); }
    var menu = $('<div class="zsd-menu"></div>').hide();
    function mi(ic, label, fn) { $('<button class="zsd-mi"></button>').append(icon(ic), $('<span></span>').text(label)).on('click', fn).appendTo(menu); }
    if (!arch) mi('archive', 'Archive', function () {
      var L = archList(); L.push({ pen: x.pen < 0 ? -1 : (x.pen > 0 ? 2000 : 0), ms: rawOf(i), scr: x.scr, cmt: x.cmt, ts: x.ts }); archSave(L);
      bridge(i, function () { $('.dialogcfm [data="d"]').click(); });
      close(); lastSig = ''; toast('Sent to archive'); setTimeout(function () { renderSolves(p); }, 150);
    });
    else mi('archive', 'Unarchive', function () {
      var r = archList()[i], n = solves().length;
      kernel.pushSignal('time', [r.pen, r.ms]);
      setTimeout(function () {
        try { var q = stats.timesAt(n); if (q) { q[1] = r.scr; q[2] = r.cmt || ''; q[3] = r.ts; saveIdx(n); } } catch (e) {}
        var L = archList(); L.splice(i, 1); archSave(L); close(); lastSig = ''; toast('Back in the session'); renderSolves(p);
      }, 300);
    });
    mi('retry', 'Retry', function () { close(); retrySolve(x); });
    mi('share', 'Share', function () { shareSolve(x, d, a, i); });
    mi('delete', 'Remove', function () {
      if (!confirm('Delete this solve?')) return;
      if (arch) { var L = archList(); L.splice(i, 1); archSave(L); }
      else bridge(i, function () { $('.dialogcfm [data="d"]').click(); });
      close(); lastSig = ''; setTimeout(function () { renderSolves(p); }, 150);
    });
    card.append(pen, $('<div class="zsd-foot"></div>').append(
      ib('more', 'More', function () { menu.toggle(); }), $('<span class="zsd-sp"></span>'),
      arch ? '' : ib('edit', 'Edit time', function () { close(); editTimeDialog(i, p); }),
      arch ? '' : ib('comment', 'Comment', function () { commentDialog(x.cmt || '', function (txt) {
        bridge(i, function () { $('.dialogcfm textarea').first().val(txt).trigger('input').trigger('change').trigger('blur'); });
        refresh();
      }); }),
      ib('flag', 'Penalty', function () { pen.toggle(); })));
    ov.append(menu);
    ov.on('click', function (e) { if (e.target === ov[0]) close(); }).appendTo('body');
  }
  function commentDialog(val, done, title) {
    var ov = $('<div class="zmodal" style="z-index:90"></div>'), card = $('<div class="zm-card"></div>').appendTo(ov);
    var ta = $('<textarea rows="3" class="zsd-ta" placeholder="Comment"></textarea>').val(val);
    function close() { ov.remove(); }
    card.append($('<h3></h3>').text(title || 'Comment'), ta, $('<div class="zm-btns"></div>').append($('<button class="zm-btn">Cancel</button>').on('click', close),
      $('<button class="zm-btn pri">Save</button>').on('click', function () { var v = ta.val(); close(); done(v); })));
    ov.on('click', function (e) { if (e.target === ov[0]) close(); }).appendTo('body');
    setTimeout(function () { ta.focus(); }, 50);
  }

  /* ---- Stats page: cards and a graph like the app ---- */
  function card(label, val, sub) {
    return $('<div class="zcard"></div>').append($('<div class="zc-l"></div>').text(label), $('<div class="zc-v"></div>').text(val),
      sub ? $('<div class="zc-s"></div>').text(sub) : '');
  }
  function drawChart(cv, r, a) {
    var W = cv.parentNode.clientWidth || 320, H = 300, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    var c = cv.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, W, H);
    var vals = a.map(function (x) { return x.t; }).filter(function (x) { return x !== Infinity; });
    if (a.length < 2 || !vals.length) {
      c.fillStyle = fg(); c.font = '600 14px Quicksand,sans-serif'; c.textAlign = 'center';
      c.fillText('Do a couple of solves to see your graph', W / 2, H / 2); return;
    }
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), pad = (hi - lo) * 0.08 || 500;
    lo = Math.max(0, lo - pad); hi += pad;
    var L = 8, R = 44, T = 12, B = 26, w = W - L - R, h = H - T - B, n = a.length;
    function X(i) { return L + (n === 1 ? w / 2 : w * i / (n - 1)); }
    function Y(v) { return T + h - h * (v - lo) / (hi - lo); }
    c.font = '600 12px Quicksand,sans-serif'; c.textAlign = 'left'; c.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var v = lo + (hi - lo) * g / 4, y = Y(v);
      c.strokeStyle = '#4caf50'; c.globalAlpha = .75; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(L, y); c.lineTo(W - R + 4, y); c.stroke(); c.setLineDash([]);
      c.globalAlpha = 1; c.fillStyle = fg(); c.fillText(v >= 10000 ? String(Math.round(v / 1000)) : (v / 1000).toFixed(1), W - R + 8, y + 4);
    }
    function line(series, color, width) {
      c.strokeStyle = color; c.lineWidth = width; c.lineJoin = 'round'; c.beginPath(); var on = false;
      series.forEach(function (v, i) {
        if (v == null || v === Infinity) { on = false; return; }
        if (!on) { c.moveTo(X(i), Y(v)); on = true; } else c.lineTo(X(i), Y(v));
      });
      c.stroke();
    }
    line(a.map(function (x) { return x.t; }), '#ffffff', n > 300 ? 1 : 2);
    var run = null; line(a.map(function (x) { if (x.t !== Infinity && (run == null || x.t < run)) run = x.t; return run; }), '#ffd740', 2);
    line(r.s5, '#f44336', 2); line(r.s12, '#8bc34a', 2.5);
    if (r.best != null) {
      var bi = a.findIndex(function (x) { return x.t === r.best; });
      c.fillStyle = '#ffd740'; c.beginPath(); c.arc(X(bi), Y(r.best), 5, 0, 7); c.fill();
    }
    c.fillStyle = fg(); c.textAlign = 'center'; c.fillText('1', L + 6, H - 8); c.fillText(String(n), W - R - 10, H - 8);
  }
  function drawHistogram(cv, a, vals) {
    var W = cv.parentNode.clientWidth || 320, H = 170, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    var c = cv.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, W, H); c.textAlign = 'center';
    var v = (vals || a.map(function (x) { return x.t; })).filter(function (x) { return x != null && x !== Infinity; });
    if (v.length < 3) { c.fillStyle = fg(); c.font = '600 14px Quicksand,sans-serif'; c.fillText('Needs at least 3 results', W / 2, H / 2); return; }
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
  var statTab = 0, globalCache = { key: '', data: null };
  /* "Global" = every category of this puzzle (csTimer keeps each as its own session); loaded in the background */
  function loadGlobal(a, done) {
    var puz = parseSess(sessSel().find('option:selected').text())[0], cur = sessSel().val(), key = puz + '|' + a.length + '|' + mode;
    if (globalCache.key === key && globalCache.data) { return globalCache.data; }
    try {
      var list = sessionsList().filter(function (q) { return parseSess(q.name)[0] === puz; }), out = [], k = 0;
      (function next() {
        if (k >= list.length) { globalCache = { key: key, data: out }; done(); return; }
        var q = list[k++];
        if (q.v === cur) { out = out.concat(a); next(); return; }
        Promise.resolve(storage.get(parseInt(q.v, 10))).then(function (times) {
          (times || []).forEach(function (r) { try { var pen = r[0][0], ms = r[0][1]; out.push({ t: pen < 0 ? Infinity : ms + (pen > 0 ? pen : 0), pen: pen, scr: r[1], cmt: r[2], ts: r[3] }); } catch (e) {} });
          next();
        }, next);
      })();
    } catch (e) {}
    return null;
  }
  function statCard(a, rerender) {
    var todayK = dayKey(Date.now() / 1000), td = a.filter(function (x) { return x.ts && dayKey(x.ts) === todayK; });
    var gl = loadGlobal(a, function () { if (rerender) rerender(); });
    function bestAvg(arr, n) { return memo(arr, 'bestavg' + n, function () { return best(n === 3 ? mo3Series(arr) : avgSeries(arr, n)); }); }
    function oks(arr) { return arr.filter(function (x) { return x.t !== Infinity; }).map(function (x) { return x.t; }); }
    function dev(arr) { var o = oks(arr); if (o.length < 2) return null; var m = o.reduce(function (s, v) { return s + v; }, 0) / o.length; return Math.sqrt(o.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / o.length); }
    function mean(arr) { var o = oks(arr); return o.length ? o.reduce(function (s, v) { return s + v; }, 0) / o.length : null; }
    function mn(arr) { var b = null; for (var i = 0; i < arr.length; i++) { var t = arr[i].t; if (t !== Infinity && (b == null || t < b)) b = t; } return b; }
    function mx(arr) { var b = null; for (var i = 0; i < arr.length; i++) { var t = arr[i].t; if (t !== Infinity && (b == null || t > b)) b = t; } return b; }
    function total(arr) { return arr.length ? arr.reduce(function (s, x) { return s + (x.t === Infinity ? 0 : x.t); }, 0) : null; }
    function f(v) { return v == null ? '--' : pretty(v); }
    var cols = [['Global', gl], ['Session', zs('stSession') ? a : undefined], ['Today', zs('stToday') ? td : undefined]].filter(function (c) { return c[1] !== undefined; }), sets = cols.map(function (c) { return c[1]; });
    function row(label, fn) { return { l: label, f: fn }; }   /* worked out only when its tab is opened */
    var T = [
      ['Improvement', [row('Deviation', function (x) { return f(dev(x)); }), row('Ao12', function (x) { return f(bestAvg(x, 12)); }), row('Ao50', function (x) { return f(bestAvg(x, 50)); }),
        row('Ao100', function (x) { return f(bestAvg(x, 100)); }), row('Best', function (x) { return f(mn(x)); }), row('Count', function (x) { return x.length.toLocaleString('en-US'); })]],
      ['Average', [3, 5, 12, 50, 100, 1000].map(function (n) { return row((n === 3 ? 'Mo' : 'Ao') + n, function (x) { return f(bestAvg(x, n)); }); })],
      ['Other', [row('Best', function (x) { return f(mn(x)); }), row('Worst', function (x) { return f(mx(x)); }), row('Deviation', function (x) { return f(dev(x)); }), row('Mean', function (x) { return f(mean(x)); }),
        row('Total time', function (x) { return f(total(x)); }), row('Count', function (x) { return x.length.toLocaleString('en-US'); })]]
    ];
    var card = $('<div class="zstat"></div>'), tabs = $('<div class="zst-tabs"></div>').appendTo(card), grid = $('<div class="zst-grid"></div>').appendTo(card);
    function fill(k) {
      statTab = k; tabs.children().removeClass('on').eq(k).addClass('on'); grid.empty();
      grid.css('grid-template-columns', '0.9fr' + ' 1fr'.repeat(cols.length));
      grid.append($('<span class="zst-h zst-sig"></span>').append(icon('sigma')));
      cols.forEach(function (c) { grid.append($('<span class="zst-h"></span>').text(c[0])); });
      T[k][1].forEach(function (rw) { grid.append($('<span class="zst-l"></span>').text(rw.l)); sets.forEach(function (arr) { grid.append($('<span class="zst-v"></span>').text(arr ? rw.f(arr) : '...')); }); });
    }
    T.forEach(function (t, k) { $('<button></button>').text(t[0]).on('click', function () { fill(k); }).appendTo(tabs); });
    fill(statTab);
    return card;
  }
  var statsSig = '';
  function statsKey(a) { return sigOf(a) + '|' + kernel.getProp('scrType') + '|' + (showArch ? 1 : 0); }
  function statsTick(p) { if (current !== 'stats') return; var a = showArch ? archSolves() : solves(); if (statsKey(a) !== statsSig) renderStats(p); }
  function renderStats(p) {
    var a = showArch ? archSolves() : solves(), r = compute(a), body = p.find('.zp-body'), keepScroll = body.scrollTop();
    body.empty(); statsSig = statsKey(a);
    subtitle(p);
    var cv = document.createElement('canvas');
    body.append($('<div class="zgraph"></div>').append(cv));
    body.append($('<div class="zlegend"></div>').html('<span style="--c:#ffffff">Everything</span><span style="--c:#ffd740">Best</span><span style="--c:#f44336">Ao5</span><span style="--c:#8bc34a">Ao12</span>'));
    body.append(statCard(a, function () { if (current === 'stats') renderStats(p); }));
    var hv = document.createElement('canvas'), distBox = $('<div></div>').appendTo(body), pbBox = $('<div></div>').appendTo(body);
    function drawDist() {
      var n = PB_NS[distType]; distBox.empty().append($('<h3 class="zp-h">Time distribution</h3>'), typeChips(distType, function (i) { distType = i; drawDist(); }));
      var wrap = $('<div class="zgraph"></div>').append(hv).appendTo(distBox);
      drawHistogram(hv, a, seriesOf(a, n));
    }
    function drawPb() { pbBox.empty(); renderPbHistory(pbBox, a, function () { drawPb(); }); }
    drawPb();
    var shB = $('<button class="zshare"></button>').append(icon('share'), $('<span>Share session...</span>')).on('click', function (e) { e.stopPropagation(); shareSessionMenu(shB, a, [['Copy as text', function () { copySummary(a, r); }]]); });
    body.append(shB);
    drawChart(cv, r, a); drawDist();
    body.scrollTop(keepScroll);
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
  /* Case probability like the app: Actual (csTimer's own odds), Equal (every selected case equally likely), Random order (each case once, shuffled) */
  var probOrder = [];
  function zFull() { try { return JSON.parse(localStorage.ztFull || 'null'); } catch (e) { return null; } }
  function applyProb() {
    var full = zFull(), mode = zs('caseProb');
    if (!full || kernel.getProp('scrType') !== full.id) return;
    var idxs = []; full.sel.forEach(function (v, i) { if (v) idxs.push(i); });
    if (!idxs.length) return;
    var cur = null; try { cur = JSON.parse(kernel.getProp('scrFlt')); } catch (e) {}
    var fullStr = JSON.stringify([full.id, full.sel.map(Number)]);
    if (mode === 'actual') { if (kernel.getProp('scrFlt') !== fullStr) kernel.setProp('scrFlt', fullStr); return; }
    var pick;
    if (mode === 'equal') pick = idxs[Math.floor(Math.random() * idxs.length)];
    else { if (!probOrder.length) { probOrder = idxs.slice(); for (var k = probOrder.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = probOrder[k]; probOrder[k] = probOrder[j]; probOrder[j] = t; } } pick = probOrder.pop(); }
    kernel.setProp('scrFlt', JSON.stringify([full.id, full.sel.map(function (v, i) { return i === pick ? 1 : 0; })]));
  }
  function renderCases(p, body) {
    var id = trSet[1], d = caseData(id), n = d.n.length;
    p.find('.zp-sub').text(trSet[0]);
    if (!trSel) {
      trSel = [];
      var cur = null; try { cur = JSON.parse(kernel.getProp('scrFlt')); } catch (e) {}
      var zf = zFull(); if (zf && zf.id === id && zf.sel.length === n) cur = [id, zf.sel];
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
      try { localStorage.ztFull = JSON.stringify({ id: id, sel: trSel.map(function (v) { return v ? 1 : 0; }) }); } catch (e) {}
      probOrder = []; applyProb();
      show('trainer');
    }).appendTo(body);
  }

  /* ---- WCA page ---- */
  var wcaHandle = null;
  function renderWca(p) {
    var body = p.find('.zp-body').empty();
    p.find('.zp-sub').text('Results and live');
    if (wcaHandle) wcaHandle.stop();
    if (window.zWcaApp) wcaHandle = window.zWcaApp(body, { icon: icon, zs: zs, toast: toast }); else body.text('WCA data is not available.');
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
    actionbar.find('.za-name').text(mode === 'trainer' ? 'Training ' + c.name : c.name); actionbar.find('.za-cat').text(c.cat);
    var cs = findSet(kernel.getProp('scrType')); actionbar.find('.za-cases').toggleClass('on', !!(cs && caseData(cs[1])));
    actionbar.find('.za-scope .zi').removeClass('zi-trainer zi-timer').addClass(mode === 'trainer' ? 'zi-timer' : 'zi-trainer');
  }
  function closeDrawer() { drawer.removeClass('open'); }
  function openDrawer() { drawer.find('.zd-item[data-page]').each(function () { $(this).toggleClass('on', $(this).attr('data-page') === current); }); drawer.addClass('open'); }
  function buildDrawer() {
    var items = [['timer', 'Timer', function () { show('timer'); }, 'timer'],
      ['trainer', 'Trainer', function () { show('trainer'); }, 'trainer', true],
      ['div'],
      ['sec', 'Other'],
      ['share', 'Export/Import', function () { show('backup'); }],
      ['palette', 'App theme', function () { show('themes'); }],
      ['imgpref', 'Color scheme', function () { show('scheme'); }],
      ['sync', 'Sync with the app', function () { show('sync'); }],
      ['div'],
      ['settings', 'Settings', function () { show('options'); }],
      ['help', 'About and feedback', function () { $('#leftbar .c5').click(); }]];
    var panel = $('<div class="zd-panel"></div>').append(
      $('<div class="zd-head"></div>').append($('<b></b>').text('ZTimer'), $('<span></span>').text('Web timer for speedcubers')));
    items.forEach(function (it) {
      if (it[0] === 'sec') { $('<div class="zd-sec"></div>').text(it[1]).appendTo(panel); return; }
      if (it[0] === 'div') { $('<div class="zd-div"></div>').appendTo(panel); return; }
      $('<div class="zd-item" role="button" tabindex="0"></div>').attr('data-page', it[3] || '').append(icon(it[0]), $('<span></span>').text(it[1]), it[4] ? icon('dropdown').addClass('zd-chev') : null)
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
      $('<button class="zsb" title="Add time" aria-label="Add time"></button>').append(icon('alarmadd')).on('click', function () { addTimeDialog(function () { updateCorners(); }); }).appendTo(box);
      $('<button class="zsb" title="Edit scramble" aria-label="Edit scramble"></button>').append(icon('edit')).on('click', function () {
        commentDialog($('#scrambleTxt').text().trim(), function (txt) { txt = txt.trim(); if (txt) { try { kernel.pushSignal('scrfix', txt); } catch (e) {} } }, 'Edit scramble');
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
    var sum = 0, cnt = 0, q, s0;
    try { while ((q = stats.timesAt(cnt))) { s0 = q[0]; sum += (s0[0] < 0 ? 7 : s0[1]) + (s0[0] > 0 ? s0[0] : 0) + (q[2] ? 1 : 0); cnt++; } } catch (e) {}
    var sig = cnt + ':' + sum + ':' + kernel.getProp('scrType');
    if (sig === lastSig) return;
    lastSig = sig;
    var a = solves(), r = compute(a), st = kernel.getProp('scrType');
    var okT = a.filter(function (x) { return x.t !== Infinity; }).map(function (x) { return x.t; }), worst = okT.length ? Math.max.apply(null, okT) : null;
    if (prev && prev.st === st && a.length === prev.n + 1 && prev.n >= 4 && prev.best != null && r.best != null && r.best < prev.best && a[a.length - 1].t === r.best) {
      if (zs('bestSingle')) pbBurst('Congratulations!<br>You\u2019ve just beaten your previous personal best by ' + pretty(prev.best - r.best));
    } else if (prev && prev.st === st && a.length === prev.n + 1 && prev.ao5 != null && r.ao5 != null && r.ao5 !== Infinity && r.ao5 === r.bao5 && r.ao5 < prev.bao5) {
      if (zs('bestAvg')) pbBurst('<b>New average best!</b><br>ao5 ' + pretty(r.ao5));
    } else if (zs('worstSingle') && prev && prev.st === st && a.length === prev.n + 1 && prev.n >= 4 && prev.worst != null && worst != null && worst > prev.worst && a[a.length - 1].t === worst)
      pbBurst('<b>New worst time</b><br>' + pretty(worst));
    prev = { st: st, n: a.length, best: r.best, ao5: r.ao5, bao5: r.bao5, worst: worst };
    var ok = a.filter(function (x) { return x.t !== Infinity; }).map(function (x) { return x.t; }), sd = null;
    if (ok.length > 1) { var mu = r.mean; sd = Math.sqrt(ok.reduce(function (q, x) { return q + (x - mu) * (x - mu); }, 0) / ok.length); }
    var mo3 = null;
    if (a.length >= 3) { var l3 = a.slice(-3).map(function (x) { return x.t; }); mo3 = l3.indexOf(Infinity) >= 0 ? Infinity : (l3[0] + l3[1] + l3[2]) / 3; }
    var ao50 = avgOf(a, a.length - 1, 50), ao1000 = avgOf(a, a.length - 1, 1000);
    function line(k, v) { return k + ': <b>' + (v == null ? '--' : pretty(v)) + '</b>'; }
    function bpa(n) {
      if (a.length < n - 1) return null;
      var w = a.slice(-(n - 1)).map(function (x) { return x.t; }), fin = w.filter(function (x) { return x !== Infinity; }), inf = w.length - fin.length, sum = fin.reduce(function (q, x) { return q + x; }, 0);
      if (inf >= 2) return Infinity; if (inf === 1) return sum / (n - 2);
      return (sum - Math.max.apply(null, w)) / (n - 2);
    }
    var rec = a.slice(-5).reverse().map(function (x) { return pretty(x.t); }); while (rec.length < 5) rec.push('--');
    cornerL.html([line('Deviation', sd), line('Mean', r.mean), line('Best', r.best), 'Count: <b>' + r.n + '</b>', zs('cBpa5') ? line('BPA Ao5', bpa(5)) : '', zs('cBpa12') ? line('BPA Ao12', bpa(12)) : ''].filter(Boolean).join('<br>'));
    cornerR.html((zs('cRecent') ? '<span class="zc-recent">Recent results:<br>' + rec.map(function (x) { return '<b>' + x + '</b>'; }).join('<br>') + '</span><br>' : '') +
      [zs('cMo3') ? line('Mo3', mo3) : '', line('Ao5', r.ao5), line('Ao12', r.ao12), line('Ao50', ao50), line('Ao100', r.ao100), zs('cAo1000') ? line('Ao1000', ao1000) : ''].filter(Boolean).join('<br>'));
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
    var inp = $('<input type="text" inputmode="numeric" placeholder="0.00" autocomplete="off">');
    var chips = $('<div class="zm-chips"></div>');
    [['None', 0], ['+2', 2000], ['DNF', -1]].forEach(function (c) {
      $('<button class="zm-chip"></button>').text(c[0]).toggleClass('on', c[1] === 0).on('click', function () {
        pen = c[1]; chips.find('.zm-chip').removeClass('on'); $(this).addClass('on');
      }).appendTo(chips);
    });
    var hint = $('<p class="zm-hint">Just type the digits. 1234 becomes 12.34 and 10520 becomes 1:05.20.</p>');
    /* the : and . are added for you, digits slide in from the right like the app */
    inp.on('input', function () {
      var d = this.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 6), out = '';
      if (d) {
        while (d.length < 3) d = '0' + d;
        var cs = d.slice(-2), sec = d.slice(0, -2);
        out = sec.length > 2 ? sec.slice(0, -2) + ':' + sec.slice(-2) + '.' + cs : sec + '.' + cs;
      }
      this.value = out; hint.css('color', '');
    });
    function close() { ov.remove(); }
    function add() {
      var ms = parseTime(inp.val());
      if (!ms) { hint.text('Type a time first, like 1234 for 12.34').css('color', '#d32f2f'); return; }
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
        .on('click', function () { textStyle = 'Default'; applyTheme(i, true); renderThemes(p); }).appendTo(grid);
    });
    /* text styles, like the second row of the app's theme pop-up */
    body.append($('<h3 class="zp-h">Text style</h3>'));
    var tg = $('<div class="ztextgrid"></div>').appendTo(body);
    TEXT_STYLES.forEach(function (ts) {
      var on = ts[0] === textStyle, col = ts[1] || (THEMES[cur][6] ? '#161616' : '#ffffff');
      $('<button class="ztext"></button>').toggleClass('on', on).append($('<span class="ztx-a"></span>').text('Aa').css('color', col), $('<span class="ztx-n"></span>').text(ts[0]))
        .on('click', function () { textStyle = ts[0]; applyTheme(cur, true); renderThemes(p); }).appendTo(tg);
    });
  }

  /* ---- Colour scheme page: the cube's colours (the app's "Color scheme") ---- */
  var SCHEME_FACES = [['Up', 0], ['Right', 1], ['Front', 2], ['Down', 3], ['Left', 4], ['Back', 5]];
  var SCHEME_PAL = ['#fff', '#ff0', '#fa0', '#f00', '#0d0', '#00f', '#f0f', '#0ff', '#f8a', '#8f0', '#a0f', '#888', '#000'];
  var SCHEME_DEFAULT = '#ff0#fa0#00f#fff#f00#0d0';
  function renderScheme(p) {
    var body = p.find('.zp-body').empty(), cols = (kernel.getProp('colcube') || SCHEME_DEFAULT).match(/#[0-9a-fA-F]{3}/g) || SCHEME_DEFAULT.match(/#[0-9a-fA-F]{3}/g);
    p.find('.zp-sub').text('Colours of the cube');
    var net = $('<div class="zscheme-net"></div>').appendTo(body);
    cols.slice(0, 6).forEach(function (c, i) { $('<i></i>').css('background', c).attr('title', SCHEME_FACES[i][0]).appendTo(net); });
    SCHEME_FACES.forEach(function (f) {
      var row = $('<div class="zscheme-row"></div>').append($('<b></b>').text(f[0])), pal = $('<div class="zscheme-pal"></div>').appendTo(row);
      SCHEME_PAL.forEach(function (c) {
        $('<button class="zsw-c"></button>').css('background', c).toggleClass('on', cols[f[1]].toLowerCase() === c).attr('aria-label', c)
          .on('click', function () { var n = cols.slice(); n[f[1]] = c; kernel.setProp('colcube', n.join('')); renderScheme(p); }).appendTo(pal);
      });
      body.append(row);
    });
    body.append($('<button class="zshare"></button>').append(icon('retry'), $('<span>Reset to the default colours</span>')).on('click', function () { kernel.setProp('colcube', SCHEME_DEFAULT); renderScheme(p); }));
  }


  /* ---- Options page: the app's settings as grouped cards. Each row reads and writes csTimer's real settings. ----
     Row types: ['sw', key, title, summary] switch, ['sel', key, title, summary, [[value,label],...]] choice,
     ['num', key, title, summary, min, max] number, ['go', title, summary, fn] link to another screen. */
  /* ZTimer's own settings (the ones csTimer has no setting for) live in this browser's storage */
  var ZS_DEF = { bestSingle: true, bestAvg: true, worstSingle: false, cMo3: true, cAo1000: true, cBpa5: true, cBpa12: true, cRecent: true, cStats: true, bigQuick: false, swipe: true,
    noMenuBg: false, noTabBg: false, caseProb: 'actual', bgOn: false, bgOpacity: 60, stSession: true, stToday: true, clearBtn: true, wcaAuto: true, wcaAttempts: false, showImg: true };
  function zs(k) { try { var o = JSON.parse(localStorage.ztSet || '{}'); return k in o ? o[k] : ZS_DEF[k]; } catch (e) { return ZS_DEF[k]; } }
  function zsSet(k, v) { try { var o = JSON.parse(localStorage.ztSet || '{}'); o[k] = v; localStorage.ztSet = JSON.stringify(o); } catch (e) {} applyZs(); }
  function applyZs() {
    $('html').toggleClass('zt-bigq', !!zs('bigQuick')).toggleClass('zt-nomenubg', !!zs('noMenuBg')).toggleClass('zt-notabbg', !!zs('noTabBg'))
      .toggleClass('zt-nocorners', !zs('cStats')).toggleClass('zt-noimg', !zs('showImg'));
    var st = $('#zt-bgstyle'); if (!st.length) st = $('<style id="zt-bgstyle"></style>').appendTo('head');
    var img = ''; try { img = localStorage.ztBgImg || ''; } catch (e) {}
    if (zs('bgOn') && img) { var a = Math.max(0, Math.min(100, +zs('bgOpacity'))) / 100;
      st.text('html,body{background-image:linear-gradient(160deg,color-mix(in srgb,var(--zt-a) ' + Math.round(a * 100) + '%,transparent),color-mix(in srgb,var(--zt-b) ' + Math.round(a * 100) + '%,transparent)),url(' + img + ')!important;background-size:cover!important;background-position:center!important;background-attachment:fixed!important}'); }
    else st.text('');
    lastSig = '';
  }
  /* row builders for the app-style settings: every row has a title, a summary and a getter / setter */
  function kSw(key, title, sum) { return { t: 'sw', title: title, sum: sum, get: function () { return !!kernel.getProp(key); }, set: function (v) { kernel.setProp(key, v); }, has: function () { return kernel.getProp(key) !== undefined; } }; }
  function zSw(key, title, sum) { return { t: 'sw', title: title, sum: sum, get: function () { return !!zs(key); }, set: function (v) { zsSet(key, v); } }; }
  function cSw(title, sum, get, set) { return { t: 'sw', title: title, sum: sum, get: get, set: set }; }
  function kNum(key, title, sum, min, max) { return { t: 'num', title: title, sum: sum, min: min, max: max, get: function () { return +kernel.getProp(key); }, set: function (v) { kernel.setProp(key, v); }, has: function () { return kernel.getProp(key) !== undefined; } }; }
  function kSel(key, title, sum, opts) { return { t: 'sel', title: title, sum: sum, opts: opts, get: function () { return kernel.getProp(key); }, set: function (v) { kernel.setProp(key, v); }, has: function () { return kernel.getProp(key) !== undefined; } }; }
  function goRow(title, sum, fn) { return { t: 'go', title: title, sum: sum, fn: fn }; }
  function pickBgImage() {
    var f = $('<input type="file" accept="image/*" style="display:none">').appendTo('body');
    f.on('change', function () {
      var file = this.files[0]; f.remove(); if (!file) return;
      var r = new FileReader(); r.onload = function () {
        var im = new Image(); im.onload = function () {
          var k = Math.min(1, 1600 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = im.width * k; cv.height = im.height * k;
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          try { localStorage.ztBgImg = cv.toDataURL('image/jpeg', 0.82); zsSet('bgOn', true); toast('Background image saved'); renderOptions(pages.options); } catch (e) { toast('That picture is too big to keep here.'); }
        }; im.src = r.result;
      }; r.readAsDataURL(file);
    });
    f[0].click();
  }
  /* the app's settings screen: three sections of links, then WCA settings; every link opens its own page */
  var APP_SETTINGS = [
    ['Trainer', [{ t: 'sel', title: 'Case probability', sum: 'Actual / Equal / Random order', opts: [['actual', 'Actual'], ['equal', 'Equal'], ['order', 'Random order']], get: function () { return zs('caseProb'); }, set: function (v) { zsSet('caseProb', v); probOrder = []; applyProb(); } }]],
    ['Timer', [goRow('Inspection behavior', '', 'inspection'), goRow('Timer behavior', '', 'behavior'), goRow('Timer appearance', '', 'appearance')]],
    ['WCA settings', [zSw('wcaAuto', 'Auto-refresh WCA Live', 'Refresh results every 30 seconds while viewing a round'), zSw('wcaAttempts', 'Show attempts in WCA Live results', 'Show every solve under each competitor in a round')]],
    ['Other', [goRow('General', '', 'general'), goRow('Background image settings', '', 'bgimage'), goRow('Statistics', '', 'stats'), goRow('List', '', 'list')]]
  ];
  var APP_SUB = {
    inspection: ['Inspection behavior', [['Inspection', [
      cSw('Inspection', 'Count down 15 seconds before the solve starts', function () { return kernel.getProp('useIns') !== 'n'; }, function (v) { kernel.setProp('useIns', v ? 'a' : 'n'); }),
      kSw('showIns', 'Inspection icon', 'Show an icon when inspection is switched on')]],
      ['Alerts', [cSw('Alert time left', 'Says 8 seconds and 12 seconds during inspection', function () { return kernel.getProp('voiceIns') !== 'n'; }, function (v) { kernel.setProp('voiceIns', v ? '1' : 'n'); }),
        kNum('voiceVol', 'Alert volume', 'Volume of the spoken alerts', 1, 100)]]]],
    behavior: ['Timer behavior', [['General', [kSw('useMilli', 'Use three decimal places', 'Calculate and display times to the thousandth of a second')]],
      ['Control', [cSw('Manual mode', 'Adds a button on the timer screen for easier manual time entry', function () { return kernel.getProp('input') === 'i'; }, function (v) { kernel.setProp('input', v ? 'i' : 't'); }),
        cSw('Hold to start', 'Hold the timer for 0.5 seconds to start', function () { return +kernel.getProp('preTime') > 0; }, function (v) { kernel.setProp('preTime', v ? 550 : 0); }),
        kSw('useMouse', 'Touch timer', 'Tap the timer to start and stop')]],
      ['Multi Phase', [cSw('Multi-Phase', 'Enable multi-phase for measuring lap times', function () { return +kernel.getProp('phases') > 1; }, function (v) { kernel.setProp('phases', v ? 2 : 1); }),
        kNum('phases', 'Number of phases', 'The number of phases (2 - 10)', 2, 10), kSw('phaseBeep', 'Phase beep', 'Beep when a phase time is recorded')]],
      ['Alerts', [zSw('bestSingle', 'Best time alert', 'Alert when you get a personal best'), zSw('bestAvg', 'Best average alert', 'Alert and highlight stats when you get a new best average'),
        zSw('worstSingle', 'Worst time alert', 'Alert when you get a personal worst')]]]],
    appearance: ['Timer appearance', [['Features', [zSw('showImg', 'Scramble image', 'Show an image of the scramble on the timer'), zSw('cStats', 'Session stats', 'Show current session statistics on the timer'),
        zSw('cMo3', 'Session stats : Mo3', 'Show Mo3 on current session statistics'), zSw('cAo1000', 'Session stats : Ao1000', 'Show Ao1000 on current session statistics'),
        zSw('cBpa5', 'BPA Ao5', 'Show the best possible Ao5 on the timer'), zSw('cBpa12', 'BPA Ao12', 'Show the best possible Ao12 on the timer'),
        zSw('cRecent', 'Recent results', 'Show current session recent results on the timer'), kSw('zQuick', 'Quick action buttons', 'Show the buttons that appear under the timer after a solve'),
        zSw('bigQuick', 'Enlarge quick action buttons', 'Enlarge the buttons under the timer after a solve')]],
      ['Other', [cSw('Hide time while solving', 'The timer will display your time when you finish', function () { return kernel.getProp('timeU') === 'n'; }, function (v) { kernel.setProp('timeU', v ? 'n' : 'u'); }),
        kNum('scrSize', 'Scramble text size', 'Controls the size of the scramble sequence text shown in the timer', 5, 50)]],
      ['Advanced', [kNum('timerSize', 'Timer text size', 'Controls the size of the timer text', 1, 100), kNum('imgSize', 'Scramble image size', 'Controls the size of the scramble image', 5, 50)]]]],
    general: ['General', [['General', [zSw('swipe', 'Allow swiping between tabs', 'If this setting is disabled, you\u2019ll have to tap the tabs to switch between them.'),
      zSw('noMenuBg', 'Disable menu background', 'Disables the tinted background behind the top menu bar'), zSw('noTabBg', 'Disable tab bar background', 'Disables the tinted background behind the bottom tab bar')]]]],
    bgimage: ['Background image settings', [['Background image settings', [zSw('bgOn', 'Show background image', 'Display the selected image as the background'),
      goRow('Choose background image', 'Choose a background image from your device', pickBgImage),
      { t: 'num', title: 'Theme color overlay opacity', sum: 'Set the opacity of the theme color overlay above the background image (0% = fully transparent)', min: 0, max: 100, get: function () { return +zs('bgOpacity'); }, set: function (v) { zsSet('bgOpacity', v); } }]]]],
    stats: ['Statistics', [['Statistics', [kSel('trim', 'Average trim', 'Controls the number of best and worst solves excluded from the averages', [['0', 'None'], ['1', 'One each side'], ['p1', '1%'], ['p5', '5%'], ['p10', '10%'], ['p20', '20%'], ['m', 'Median']])]],
      ['Tables', [zSw('stSession', 'Session stats', 'Show current session stats on the statistics table'), zSw('stToday', 'Today\u2019s stats', 'Show today\u2019s stats on the statistics table. The date is switched on at 5:00am')]]]],
    list: ['List', [['List', [zSw('clearBtn', 'Show "Clear" button', 'The "Clear" button is shown in the time list, and lets you remove all solves from the current session')]]]]
  };
  var optPath = [], navStack = [], skipPop = 0;
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
      ['go', 'Side menu', 'Or swipe in from the left edge', function () { show(mode); openDrawer(); }]
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
  /* Bluetooth: ZTimer's own pop-up on top of csTimer's drivers (GAN, Moyu, QiYi, GoCube, Giiker ... and smart timers) */
  function openBluetooth() {
    var d = appDialog('Bluetooth'), box = $('<div class="zbt"></div>').appendTo(d.card), poll = null, sup = !!navigator.bluetooth;
    var status = $('<div class="zbt-st"></div>'), btnCube = $('<button class="zbt-btn"></button>'), btnTimer = $('<button class="zbt-btn alt"></button>'),
      btnOff = $('<button class="zbt-btn off"></button>').text('Disconnect'), btnSolved = $('<button class="zbt-btn alt"></button>').text('Mark cube as solved'),
      note = $('<p class="zbt-note"></p>');
    function connected() { try { return !!(window.GiikerCube && GiikerCube.isConnected()); } catch (e) { return false; } }
    function refresh() {
      var on = connected(); box.toggleClass('on', on);
      status.empty().append($('<i class="zbt-dot"></i>'), $('<span></span>').text(on ? 'Connected' : (sup ? 'Not connected' : 'Not available here')));
      btnCube.text(on ? 'Connect another cube' : 'Connect smart cube'); btnTimer.text('Connect smart timer');
      btnOff.toggle(on); btnSolved.toggle(on);
      if (on) { try { GiikerCube.getCube().getBatteryLevel().then(function (v) { if (v != null) status.find('span').text('Connected  \u00B7  battery ' + v + '%'); }, function () {}); } catch (e) {} }
    }
    function run(fn, name) {
      if (!sup) { toast('Web Bluetooth is not available in this browser.'); return; }
      status.find('span').text('Looking for your ' + name + '...');
      Promise.resolve().then(fn).then(function () { refresh(); if (connected() || name === 'timer') toast('<b>Bluetooth</b><br>Connected'); }, function (e) {
        var m = String(e && e.message || e || ''); refresh(); if (!/cancel|chosen|NotFound/i.test(m)) toast('Could not connect: ' + m.slice(0, 80));
      });
    }
    btnCube.on('click', function () { run(function () { kernel.setProp('input', 'g'); return giikerutil.init(); }, 'cube'); });
    btnTimer.on('click', function () { run(function () { kernel.setProp('input', 'b'); return window.BluetoothTimer.init(); }, 'timer'); });
    btnOff.on('click', function () { try { GiikerCube.stop(); } catch (e) {} try { giikerutil.stop(); } catch (e) {} setTimeout(refresh, 300); });
    btnSolved.on('click', function () { try { giikerutil.markSolved(); toast('Cube marked as solved'); } catch (e) {} });
    note.html(sup ? 'Turn your cube or timer on, then tap Connect and pick it from the list. Works with GAN, Moyu, QiYi, GoCube, Giiker and more.' : 'This browser cannot use Bluetooth. Open ZTimer in Chrome or Edge (Android, Windows, Mac, Linux), or in Bluefy on iPhone.');
    box.append(status, btnCube, btnTimer, btnOff, btnSolved, note, $('<div class="zm-btns"></div>').append($('<button class="zm-btn">Close</button>').on('click', function () { clearInterval(poll); d.close(); })));
    d.ov.on('remove', function () { clearInterval(poll); });
    refresh(); poll = setInterval(function () { if (!document.body.contains(d.ov[0])) { clearInterval(poll); return; } var was = box.hasClass('on'); if (was !== connected()) refresh(); }, 1200);
  }
  function appRow(r, p) {
    var row = $('<div class="zopt"></div>'), text = $('<div class="zo-t"></div>').append($('<b></b>').text(r.title));
    if (r.sum) text.append($('<span></span>').text(r.sum));
    row.append(text);
    if (r.t === 'go') { row.addClass('go').on('click', function () { if (typeof r.fn === 'string') optGo(r.fn); else r.fn(); }).append('<i class="zchev"></i>'); return row; }
    if (r.t === 'sw') {
      var on = !!r.get(), sw = $('<button class="zsw" role="switch"></button>').toggleClass('on', on).attr('aria-checked', on).append('<i></i>');
      row.addClass('tap').on('click', function () { var v = !r.get(); r.set(v); sw.toggleClass('on', v).attr('aria-checked', v); lastSig = ''; renderOptionsKeep(p); }); row.append(sw);
    } else if (r.t === 'sel') {
      var s2 = $('<select class="zosel"></select>'), idx = 0, cur = r.get();
      r.opts.forEach(function (c, k) { $('<option></option>').val(k).text(c[1]).appendTo(s2); if (String(c[0]) === String(cur)) idx = k; });
      s2.val(idx).on('change', function () { r.set(r.opts[+this.value][0]); lastSig = ''; }); row.append(s2);
    } else if (r.t === 'num') {
      var out = $('<span class="zo-n"></span>').text(r.get()), rg = $('<input type="range" class="zorange">').attr({ min: r.min, max: r.max }).val(r.get());
      rg.on('input', function () { out.text(this.value); }).on('change', function () { r.set(+this.value); lastSig = ''; }); row.addClass('num').append(out, rg);
    }
    return row;
  }
  function renderOptionsKeep(p) { var y = p.find('.zp-body').scrollTop(); renderOptions(p); p.find('.zp-body').scrollTop(y); }
  /* going into a settings page and back: the arrow at the top left, or the phone's back button (phones only) */
  function isMobile() { try { return window.matchMedia('(max-width:899px)').matches || $('html').hasClass('m'); } catch (e) { return false; } }
  function navPush(e) { if (!isMobile()) return; navStack.push(e); try { history.pushState({ zt: 1 }, ''); } catch (x) { navStack.pop(); } }
  function navBack(viaPop) {
    var e = navStack.pop();
    if (!e) { if (SETTINGS_PAGES[current]) show('timer', true); return; }
    if (!viaPop) { skipPop++; try { history.back(); } catch (x) {} }
    if (e.type === 'sub') { optPath.pop(); renderOptions(pages.options); pages.options.find('.zp-body').scrollTop(0); } else show(e.id, true);
  }
  function optGo(sub) { optPath.push(sub); navPush({ type: 'sub' }); renderOptions(pages.options); pages.options.find('.zp-body').scrollTop(0); }
  var SETTINGS_PAGES = { options: 1, themes: 1, scheme: 1, backup: 1, sessions: 1, sync: 1 };
  window.addEventListener('popstate', function () {
    if (skipPop > 0) { skipPop--; return; }
    if (navStack.length) navBack(true);
  });
  function renderOptions(p) {
    var body = p.find('.zp-body').empty(), sub = optPath.length ? APP_SUB[optPath[optPath.length - 1]] : null;
    p.find('.zp-title').text(sub ? sub[0] : 'Settings');
    p.find('.zp-sub').text(sub ? '' : 'Changes save as you make them');
    function addGroup(title, rows, fn) {
      var card = $('<div class="zocard"></div>').append($('<h3></h3>').text(title)), any = false;
      rows.forEach(function (r) { if (r.has && !r.has()) return; card.append(fn ? fn(r) : appRow(r, p)); any = true; });
      if (any) body.append(card);
    }
    if (sub) { sub[1].forEach(function (g) { addGroup(g[0], g[1]); }); return; }
    APP_SETTINGS.forEach(function (g) { addGroup(g[0], g[1]); });
    /* things only the website has go at the bottom */
    var used = {}; Object.keys(APP_SUB).forEach(function () {});
    ['useIns', 'showIns', 'voiceIns', 'voiceVol', 'useMilli', 'preTime', 'useMouse', 'phases', 'phaseBeep', 'ahide', 'scrSize', 'timerSize', 'imgSize', 'zQuick', 'trim', 'zBar'].forEach(function (k) { used[k] = 1; });
    body.append($('<h3 class="zp-h zp-web">Website settings</h3>'));
    OPTIONS.forEach(function (g) {
      var card = $('<div class="zocard"></div>').append($('<h3></h3>').text(g[0])), any = false;
      g[1].forEach(function (o) {
        if (o[0] === 'go' && /theme|Side menu|Colour theme/i.test(o[1])) return;
        if (o[0] !== 'go' && (used[o[1]] || kernel.getProp(o[1]) === undefined)) return;
        card.append(optRow(o, p)); any = true;
      });
      if (any) body.append(card);
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
  /* Personal best history and time distribution: one kind of result at a time (single, Ao5, Ao12, Ao100, Ao1000) */
  var PB_NS = [1, 5, 12, 100, 1000], pbType = 0, distType = 0, pbShown = 15;
  function typeChips(sel, fn) {
    var row = $('<div class="zw-pills"></div>');
    PB_NS.forEach(function (n, i) { $('<button class="zw-pill"></button>').text(n === 1 ? 'Single' : 'Ao' + n).toggleClass('on', i === sel).on('click', function () { fn(i); }).appendTo(row); });
    return row;
  }
  function seriesOf(a, n) { if (n === 1) return a.map(function (x) { return x.t; }); return avgSeries(a, n); }
  function renderPbHistory(body, a, again) {
    var n = PB_NS[pbType], ser = seriesOf(a, n), recs = [], best = Infinity, prevBest = null;
    ser.forEach(function (v, i) { if (v != null && v !== Infinity && v > 0 && v < best) { recs.push({ v: v, ts: a[i].ts, prev: prevBest }); best = v; prevBest = v; } });
    body.append($('<h3 class="zp-h">Personal best history</h3>'), typeChips(pbType, function (i) { pbType = i; pbShown = 15; again(); }));
    if (!recs.length) { body.append($('<p class="zp-note"></p>').text(n > 1 && a.length < n ? 'You need ' + n + ' solves for Ao' + n + ' (you have ' + a.length + ').' : 'Your records will appear here as you improve.')); return; }
    var list = $('<div class="zlist zpbl"></div>').appendTo(body), shown = recs.slice().reverse().slice(0, pbShown);
    shown.forEach(function (x) {
      $('<div class="zrow zpb"></div>').append($('<span class="zpb-k"></span>').text(x.prev != null ? '-' + pretty(x.prev - x.v) : ''),
        $('<span class="zpb-d"></span>').text(x.ts ? new Date(x.ts * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''),
        $('<span class="zr-t"></span>').text(pretty(x.v))).appendTo(list);
    });
    if (recs.length > pbShown) body.append($('<button class="zshare"></button>').append($('<span></span>').text('Show more (' + (recs.length - pbShown) + ' left)')).on('click', function () { pbShown += 15; again(); }));
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


  /* ---- Pop-ups that look like the app's: Select a category, Select a trainer ---- */
  function appDialog(title, extraBtn) {
    var ov = $('<div class="zmodal zapp"></div>'), card = $('<div class="zm-card zapp-card"></div>').appendTo(ov);
    var head = $('<div class="zapp-head"></div>').append($('<b></b>').text(title)).appendTo(card);
    if (extraBtn) head.append(extraBtn);
    ov.on('click', function (e) { if (e.target === ov[0]) ov.remove(); }).appendTo('body');
    return { ov: ov, card: card, close: function () { ov.remove(); } };
  }
  function longPress(el, fn, tap) {
    var t = null, fired = false;
    function start() { fired = false; clearTimeout(t); t = setTimeout(function () { fired = true; fn(); }, 520); }
    function stop() { clearTimeout(t); }
    el.on('touchstart mousedown', start).on('touchend touchmove touchcancel mouseup mouseleave', stop)
      .on('contextmenu', function (e) { e.preventDefault(); }).on('click', function (e) { if (fired) { fired = false; e.preventDefault(); return; } tap(e); });
  }
  function askText(title, initial, cb) {
    var d = appDialog(title), inp = $('<input type="text" maxlength="32" style="font-size:16px">').val(initial || '').appendTo(d.card);
    function ok() { var v = inp.val().trim().replace(/\s*\/\s*/g, '-'); if (v.length < 2) { inp.css('border-color', '#d32f2f'); return; } d.close(); cb(v); }
    d.card.append($('<div class="zm-btns"></div>').append($('<button class="zm-btn">Cancel</button>').on('click', d.close), $('<button class="zm-btn pri">Done</button>').on('click', ok)));
    inp.on('keydown', function (e) { if (e.which === 13) ok(); }); setTimeout(function () { inp.focus(); }, 60);
  }
  function withConfirmYes(fn) { var oc = $.confirm; $.confirm = function () { return true; }; try { fn(); } finally { $.confirm = oc; } }
  function removeSession(v, done) {
    withConfirmYes(function () { sessSel().val(v).trigger('change'); sessSel().val('del').trigger('change'); });
    setTimeout(function () { lastSig = ''; if (done) done(); }, 250);
  }
  function renameSession(v, id, pname, newLabel, done) {
    var name = pname + ' / ' + newLabel;
    Promise.resolve(storage.get(parseInt(v, 10))).then(function (times) {
      var n = stats.getSessionManager().importSessions([{ name: name, opt: { scrType: id }, times: times || [] }]);
      if (!n) { toast('Could not rename that category.'); return; }
      setTimeout(function () { removeSession(v, function () { var s2 = findSess(name); if (s2) goSession(s2.v); setLast(id, newLabel); if (done) done(); }); }, 200);
    });
  }
  function openCategoryDialog() {
    var c = currentPuzzle(), id = kernel.getProp('scrType'), curV = sessSel().val();
    var add = $('<button class="zapp-new"></button>').append($('<span>+</span>'), document.createTextNode(' New'));
    var d = appDialog('Select a category', add), list = $('<div class="zapp-list"></div>').appendTo(d.card);
    function fill() {
      list.empty(); curV = sessSel().val(); var any = false;
      sessionsList().forEach(function (s) {
        var pp = parseSess(s.name), mine = pp[1] ? pp[0] === c.name : (s.v === curV || (c.name === '3x3x3' && s.name === '1'));
        if (!mine) return; any = true;
        var label = pp[1] || (/^\d+$/.test(s.name) ? 'Normal' : s.name), row = $('<div class="zapp-row"></div>').toggleClass('cur', s.v === curV).text(label).appendTo(list);
        longPress(row, function () {
          popMenu(row, [['Rename', function () { askText('Enter a new name', label, function (nn) { renameSession(s.v, id, c.name, nn, function () { fill(); updateBar(); }); }); }],
            ['Remove', function () { if (confirm('Remove "' + label + '"? Its solves are deleted too.')) removeSession(s.v, function () { fill(); updateBar(); }); }]]);
        }, function () { goSession(s.v); setLast(id, label); d.close(); setTimeout(updateBar, 150); });
      });
      if (!any) list.append($('<p class="zp-note"></p>').text('No categories yet.'));
    }
    add.on('click', function () { askText('Enter a category name', '', function (n) { d.close(); usePuzzle(id, c.name, n, function () { setTimeout(updateBar, 150); }); }); });
    fill();
  }
  function openTrainerDialog() {
    var cur = kernel.getProp('scrType'), d = appDialog('Select a trainer'), tabs = $('<div class="ztabs2 zscroll zapp-tabs"></div>').appendTo(d.card), grid = $('<div class="ztiles zpuz zapp-grid"></div>').appendTo(d.card);
    var stars = getStars(), fams = T_FAM.slice(), st = [];
    T_FAM.forEach(function (f) { f[1].forEach(function (x) { if (stars.indexOf(x[1]) >= 0) st.push(x); }); });
    fams.unshift(['Starred', st]);
    var fi = 1; T_FAM.forEach(function (f, i) { f[1].forEach(function (x) { if (x[1] === cur) fi = i + 1; }); }); if (fi === 1 && st.length && !findSet(cur)) fi = 0;
    function fill(i) {
      tabs.children().removeClass('on').eq(i).addClass('on'); grid.empty();
      fams[i][1].forEach(function (x) {
        var star = getStars().indexOf(x[1]) >= 0;
        var t = $('<div class="ztile zpt zset" role="button" tabindex="0"></div>').toggleClass('on', cur === x[1])
          .append($('<span class="zpl"></span>').text(x[0].length > 5 ? x[0].slice(0, 4) : x[0]).css({ background: '#AACCFF', color: '#5599FF' }), $('<b></b>').text((star ? '\u2605 ' : '') + x[0])).appendTo(grid);
        longPress(t, function () {
          var a = getStars(), k = a.indexOf(x[1]); if (k >= 0) a.splice(k, 1); else a.push(x[1]); setStars(a);
          toast(k >= 0 ? 'Removed from starred' : '<b>Starred</b><br>' + x[0]); fams[0][1] = []; T_FAM.forEach(function (f) { f[1].forEach(function (y) { if (a.indexOf(y[1]) >= 0) fams[0][1].push(y); }); });
          fill(i);
        }, function () {
          d.close();
          usePuzzle(x[1], x[2] || x[0], null, function (ok) {
            if (!ok || kernel.getProp('scrType') !== x[1]) { toast('That set is not available.'); return; }
            show('trainer'); setTimeout(updateBar, 150);
          });
        });
      });
      if (!fams[i][1].length) grid.append($('<p class="zp-note"></p>').text('Press and hold a set to star it.'));
    }
    fams.forEach(function (f, i) { $('<button class="zt2"></button>').text(f[0]).on('click', function () { fill(i); }).appendTo(tabs); });
    fill(fi);
  }


  /* ---- Sync with the app ---- */
  function replaceSession(v, name, id, times, done) {
    $('html').addClass('zt-quiet');
    try { stats.getSessionManager().importSessions([{ name: name, opt: { scrType: id }, times: times }]); } catch (e) {}
    try { kernel.hideDialog(); } catch (e) {}
    function end() { setTimeout(function () { hideStaleMgr(); $('html').removeClass('zt-quiet'); lastSig = ''; done(); }, 250); }
    setTimeout(function () { if (v != null) removeSession(v, end); else end(); }, 220);
  }
  function puzzleName(scr) {
    var n = null; PUZZLES.forEach(function (g) { g[1].forEach(function (q) { if (q[1] === scr) n = q[0]; }); });
    var fs = findSet(scr); if (fs) n = fs[2] || fs[0];
    return n || scr;
  }
  window.ZT_BRIDGE = { sessionsList: sessionsList, sessSel: sessSel, findSess: findSess, goSession: goSession, parseSess: parseSess, puzzleName: puzzleName, replaceSession: replaceSession };
  function ago(t) { if (!t) return 'never'; var m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' days ago'; }
  /* turns pasted or loaded text from other timers into solves: one time per line, like 12.34, 1:02.45, DNF or 9.87+ */
  function parseTimeList(text) {
    var out = [], now = Math.floor(Date.now() / 1000), n = 0;
    String(text).split(/\r?\n/).forEach(function (line) {
      var m = /(?:^|[\s,;\t])(DNF|(\d+):(\d{1,2}):(\d{1,2})(?:[.,](\d{1,3}))?|(\d+):(\d{1,2})(?:[.,](\d{1,3}))?|(\d+)[.,](\d{1,3})|(\d+))(\+?)(?=$|[\s,;\t])/i.exec(line);
      if (!m) return;
      var ms, pen = 0;
      function frac(f) { return f ? Math.round(parseFloat('0.' + f) * 1000) : 0; }
      if (/^dnf$/i.test(m[1])) { ms = 0; pen = -1; }
      else if (m[2] != null) ms = ((+m[2]) * 3600 + (+m[3]) * 60 + (+m[4])) * 1000 + frac(m[5]);
      else if (m[6] != null) ms = ((+m[6]) * 60 + (+m[7])) * 1000 + frac(m[8]);
      else if (m[9] != null) ms = (+m[9]) * 1000 + frac(m[10]);
      else ms = (+m[11]) * 1000;
      if (m[12] === '+' && pen === 0) pen = 2000;
      out.push([[pen, ms], '', '', now - (n++) ]);
    });
    return out.reverse();
  }
  function renderSync(p) {
    var body = p.find('.zp-body').empty(), S = window.ZTSync, st = S ? S.state() : {};
    p.find('.zp-sub').text('The same solves on your phone and in the browser');
    function card(title) { return $('<div class="zocard zsy"></div>').append($('<h3></h3>').text(title)); }
    if (!S || !S.configured()) {
      body.append(card('Server not set up').append($('<p class="zp-note"></p>').text('Open ztimer-sync-config.js, paste your Supabase project URL and anon key, and upload it. The steps are in supabase/README.md.')));
    } else if (!st.code) {
      var c1 = card('Link this browser and your app').appendTo(body);
      c1.append($('<p class="zp-note"></p>').text('A sync code links them. No email or password. Keep the code private: anyone with it can see your solves.'));
      ibtn('sync', 'Create a new sync code', 'pri').appendTo(c1).on('click', function () { S.setCode(S.makeCode()); renderSync(p); });
      var c2 = card('Already have a code?').appendTo(body);
      var inp = $('<input type="text" class="zsync-in" placeholder="Enter the code from your app" autocapitalize="characters">').appendTo(c2);
      var useB = ibtn('check', 'Use this code').appendTo(c2).on('click', function () { if (S.setCode(inp.val())) renderSync(p); else { anim(inp, 'zshake'); anim(useB, 'zshake'); toast('That code looks too short.'); } });
    } else {
      var c = card('Your sync code').appendTo(body);
      var codeB = $('<button class="zsync-code" title="Tap to copy"></button>').text(st.code).appendTo(c), hint = $('<p class="zsync-hint">Tap the code to copy it</p>').appendTo(c);
      codeB.on('click', function () {
        try { navigator.clipboard.writeText(st.code); hint.text('Copied').addClass('ok'); anim(codeB, 'zbump'); setTimeout(function () { hint.text('Tap the code to copy it').removeClass('ok'); }, 1600); } catch (e) { toast('Copy it by hand.'); }
      });
      var n = card('Nickname').appendTo(body), nin = $('<input type="text" class="zsync-in" maxlength="20" placeholder="Pick a nickname (optional)">').val(st.nick || '').appendTo(n);
      n.append($('<p class="zp-note"></p>').text('3 to 20 letters, numbers or _. Nicknames are unique and will be used for friends and racing.'));
      var nickB = ibtn('check', 'Save nickname').appendTo(n).on('click', function () { S.sync(window.ZT_BRIDGE, { nick: nin.val().trim() }).then(function () { flashBtn(nickB, 'check', 'Saved', 'check', 'Save nickname'); }, function (e) { anim(nickB, 'zshake'); anim(nin, 'zshake'); toast(e.message); }); });
      var s = card('Sync').appendTo(body), syncB = ibtn('sync', 'Sync now', 'pri').appendTo(s), status = $('<p class="zsync-stat"></p>').text('Last synced: ' + ago(st.last)).appendTo(s);
      function rest() { syncB.removeClass('ok').html(ic('sync', 18) + '<span></span>'); syncB.find('span').text('Sync now'); }
      syncB.on('click', function () {
        syncB.find('svg').addClass('zspin'); syncB.find('span').text('Syncing...'); status.removeClass('ok err').text('Talking to the server...');
        S.sync(window.ZT_BRIDGE).then(function (r) {
          if (r.busy) { rest(); status.text('Already syncing...'); return; }
          status.addClass('ok').text('Done. Sent ' + r.sent + ', received ' + r.got + '.'); flashBtn(syncB, 'check', 'Synced', 'sync', 'Sync now');
          if (r.applied) toast('Added ' + r.applied + ' solves from your other devices');
        }, function (e) { rest(); syncB.find('span').text('Try again'); anim(syncB, 'zshake'); status.addClass('err').text(e.message || 'Could not sync.'); });
      });
      s.append(appRow({ t: 'sw', title: 'Sync automatically', sum: 'When the site opens, after each solve, and when you come back to it', get: function () { return st.auto !== false; }, set: function (v) { S.setAuto(v); } }, p));
      ibtn('x', 'Stop syncing on this browser', 'zsync-off').appendTo(s).on('click', function () { if (confirm('Stop syncing here? Your solves stay on this device and on the server.')) { S.signOut(); renderSync(p); } });
    }
    var imp = $('<div class="zocard"></div>').append($('<h3>Import from other timers</h3>')).appendTo(body);
    imp.append($('<p class="zp-note"></p>').text('csTimer exports work from Export or import. For other timers, load a text or CSV file with one time per line (12.34, 1:02.45, DNF, 9.87+). The times go into the current category.'));
    imp.append($('<button class="zshare"></button>').append($('<span>Choose a file</span>')).on('click', function () {
      var f = $('<input type="file" accept=".txt,.csv,.tsv,text/plain" style="display:none">').appendTo('body');
      f.on('change', function () { var file = this.files[0]; f.remove(); if (!file) return; var r = new FileReader(); r.onload = function () {
        var add = parseTimeList(r.result); if (!add.length) { toast('No times found in that file.'); return; }
        var id = kernel.getProp('scrType'), cur = sessSel().find('option:selected'), v = cur.val(), name = cur.text();
        Promise.resolve(storage.get(parseInt(v, 10))).then(function (old) { replaceSession(v, name, id, (old || []).concat(add).sort(function (a, b) { return (a[3] || 0) - (b[3] || 0); }), function () { var s2 = findSess(name); if (s2) goSession(s2.v); toast('Imported ' + add.length + ' times'); }); });
      }; r.readAsText(file); });
      f[0].click();
    }));
  }
  /* automatic sync: when the site opens, a few seconds after the solves change, when you come back to the tab,
     when the network returns, and every 2 minutes while the tab is open. A failed sync tries again, a little later each time. */
  var autoT = null, autoRetry = 0, lastAuto = 0;
  function autoOn() { var S = window.ZTSync; return !!(S && S.configured() && S.state().code && S.state().auto !== false); }
  function runAuto() {
    if (!autoOn()) return;
    lastAuto = Date.now();
    window.ZTSync.sync(window.ZT_BRIDGE).then(function (r) {
      if (r && r.busy) { autoSoon(3000); return; }
      autoRetry = 0;
      if (r && r.applied) { lastSig = ''; if (current === 'solves' || current === 'stats') rerenderPage(); }
    }, function (e) {
      if (e && /code|set up/i.test(e.message || '')) return;
      autoRetry = Math.min(autoRetry + 1, 5); autoSoon(Math.min(300000, 10000 * Math.pow(2, autoRetry)));
    });
  }
  function autoSoon(ms) { if (!autoOn()) return; clearTimeout(autoT); autoT = setTimeout(runAuto, ms); }
  function autoSync() { autoSoon(6000); }
  function autoWatch() {
    document.addEventListener('visibilitychange', function () { if (!document.hidden && Date.now() - lastAuto > 30000) autoSoon(800); });
    window.addEventListener('online', function () { autoSoon(1500); });
    setInterval(function () { if (!document.hidden && navigator.onLine !== false && Date.now() - lastAuto > 110000) autoSoon(100); }, 30000);
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
  /* the four-arrow button flips the Solves and Stats pages between Timer and Trainer solves; the hourglass shows archived solves */
  function rerenderPage() { if (current === 'solves') renderSolves(pages.solves); else if (current === 'stats') renderStats(pages.stats); }
  function toggleScope() { enterMode(mode === 'trainer' ? 'timer' : 'trainer', function () { rerenderPage(); }); setTimeout(rerenderPage, 600); }
  function toggleArch() { showArch = !showArch; actionbar.find('.za-hist').toggleClass('on', showArch); rerenderPage(); toast(showArch ? 'Showing archived solves' : 'Showing current solves'); }
  function enterMode(m, cb) {
    var id = kernel.getProp('scrType'), c = currentPuzzle(), cm = isTrainerId(id) ? 'trainer' : 'timer';
    modeState[cm] = { id: id, name: c.name }; saveModes();
    mode = m;
    if (cm === m) return;
    var st = modeState[m] || (m === 'trainer' ? { id: 'oll', name: 'OLL' } : { id: '333', name: '3x3x3' });
    usePuzzle(st.id, st.name, null, function () { lastSig = ''; updateBar(); updateCorners(); if (cb) cb(); });
  }
  function show(id, noHist) {
    var old = current;
    if (!noHist && id !== old) {
      var inS = SETTINGS_PAGES[id], wasS = SETTINGS_PAGES[old];
      if (inS) { if (id === 'options') optPath = []; navPush({ type: 'page', id: old }); }
      else if (wasS && navStack.length) { var n = navStack.length; navStack = []; skipPop++; try { history.go(-n); } catch (x) {} }
    }
    if (current === 'wca' && id !== 'wca' && wcaHandle) { wcaHandle.stop(); wcaHandle = null; }
    current = id;
    var screen = id === 'timer' || id === 'trainer';
    if (screen) enterMode(id);
    bar.find('.ztab').each(function () { $(this).toggleClass('on', $(this).data('p') === (id === 'trainerpick' ? 'trainer' : id)); });
    clearInterval(timerId); timerId = null;
    $('html').toggleClass('zpage-open', !screen).toggleClass('zp-bar', id === 'solves' || id === 'stats');
    if (id === 'solves' || id === 'stats') updateBar();
    closeDrawer();
    if (screen) { root.hide(); lastSig = ''; updateBar(); updateCorners(); prevId = id; return; }
    kernel.hideDialog();
    var order = TABS.map(function (t) { return t[0]; }), dir = order.indexOf(id) > order.indexOf(prevId) ? 'zin-r' : 'zin-l';
    root.show(); $.each(pages, function (k, p) { p.toggle(k === id); });
    var p = pages[id];
    if (prevId !== id) p.removeClass('zin-r zin-l').width(), p.addClass(dir);
    if (id === 'solves') renderSolves(p);
    if (id === 'stats') { renderStats(p); timerId = setInterval(function () { statsTick(p); }, 3000); }
    if (id === 'trainerpick') renderTrainer(p);
    if (id === 'puzzles') renderPuzzles(p);
    if (id === 'themes') renderThemes(p);
    if (id === 'scheme') renderScheme(p);
    if (id === 'sync') renderSync(p);
    if (id === 'options') renderOptions(p);
    if (id === 'sessions') renderSessions(p);
    if (id === 'backup') renderBackup(p);
    if (id === 'wca') renderWca(p);
    p.find('.zp-body').scrollTop(0);
    prevId = id;
  }

  function init() {
    applyTheme(savedTheme(), false); applyZs(); autoWatch(); autoSoon(2500);
    var z = $('#zbar');
    if (!z.length) return;
    bar = z.empty();
    TABS.forEach(function (t) {
      $('<div class="ztab" role="button" tabindex="0"></div>').data('p', t[0]).attr({ title: t[1], 'aria-label': t[1] })
        .append(icon(t[2])).on('click', function () { show(t[0]); }).appendTo(bar);
    });
    root = $('<div id="zpages"></div>').hide().appendTo('body');
    makePage('solves', 'Solves', 'list'); makePage('stats', 'Stats', 'graph');
    makePage('trainerpick', 'Trainer', 'trainer'); makePage('wca', 'WCA', 'wca'); makePage('puzzles', 'Puzzle', 'category'); makePage('themes', 'Theme', 'palette'); makePage('scheme', 'Color scheme', 'imgpref'); makePage('sync', 'Sync', 'sync'); makePage('options', 'Options', 'settings'); makePage('sessions', 'Category', 'books'); makePage('backup', 'Export/Import', 'share');
    actionbar = $('<div id="zactionbar"></div>').append(
      barBtn('settings', 'Menu', function () { openDrawer(); }),
      barBtn('bluetooth', 'Bluetooth cube', openBluetooth).addClass('za-bt'),
      barBtn('trainer', 'Timer or trainer solves', toggleScope).addClass('za-scope'),
      $('<div class="za-title" role="button" tabindex="0"></div>').append($('<b class="za-name"></b>'), $('<span class="za-cat"></span>'))
        .on('click', function () { if (mode === 'trainer') openTrainerDialog(); else show('puzzles'); }),
      barBtn('checklist', 'Choose cases', function () { var s = findSet(kernel.getProp('scrType')); if (s && caseData(s[1])) { trSet = s; trSel = null; show('trainerpick'); } }).addClass('za-cases'),
      barBtn('hourglass', 'Archived solves', toggleArch).addClass('za-hist'),
      barBtn('category', 'Category', function () { openCategoryDialog(); })).appendTo('body');
    /* the app opens its side menu with a swipe from the left edge */
    (function () {
      var x0, y0, edge = false;
      function begin(x, y, tg) { x0 = x; y0 = y; edge = x < 40 || $(tg).closest('#zactionbar,#zbar').length > 0; }
      function end(x, y) { if (!edge) return; edge = false; if (x - x0 > 70 && Math.abs(y - y0) < 60) openDrawer(); }
      $(document).on('touchstart', function (e) { var t = e.originalEvent.touches[0]; begin(t.clientX, t.clientY, e.target); })
        .on('touchend', function (e) { var t = e.originalEvent.changedTouches[0]; end(t.clientX, t.clientY); })
        .on('mousedown', function (e) { begin(e.clientX, e.clientY, e.target); })
        .on('mouseup', function (e) { end(e.clientX, e.clientY); });
    })();
    buildDrawer();
    loadModes(); mode = isTrainerId(kernel.getProp('scrType')) ? 'trainer' : 'timer';
    /* csTimer's hold-to-open circle menu is switched off */
    try { if (kernel.getProp('useGES')) kernel.setProp('useGES', false); } catch (e) {}
    (function () {
      var tries = 0;
      function imgOk() { return $('#toolsDiv').find('img,canvas,svg').length > 0; }
      function ensureTools() {
        var b = $('#leftbar .c6'); tries++;
        if (!b.length || imgOk() || tries > 10) return;
        if (!b.hasClass('enable')) b.click(); else if (tries > 2) { b.click(); setTimeout(function () { b.click(); }, 80); }
        setTimeout(ensureTools, 1200);
      }
      /* the little box on the timer page always shows the scramble picture; every other tool lives under Settings > Tools */
      function imageFirst() {
        try {
          var f = JSON.parse(kernel.getProp('toolsfunc') || '[]');
          if (f[0] !== 'image') { f = ['image'].concat(f.filter(function (x) { return x !== 'image'; })); kernel.setProp('toolsfunc', JSON.stringify(f)); setTimeout(function () { location.reload(); }, 300); }
        } catch (e) {}
        $('html').removeClass('zt-toolsfull');
      }
      setTimeout(imageFirst, 500);
      setTimeout(ensureTools, 900);
    })();
    /* swipe left or right to move between the tabs (not on the timer, charts or sliders) */
    (function () {
      var x0, y0, ok = false, order = TABS.map(function (t) { return t[0]; });
      root.on('touchstart', function (e) {
        var t = e.originalEvent.touches[0]; x0 = t.clientX; y0 = t.clientY;
        ok = zs('swipe') && !$(e.target).closest('canvas,input,select,textarea,.zimp,.zcal').length && order.indexOf(current) > 0;
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
    /* timer digits change colour while holding / ready, like the app (csTimer sets an inline colour, the theme turns it into --zt-lcd) */
    function lcdHold() {
      var el = document.getElementById('lcd'); if (!el) return;
      var c = el.style.color || '', col = '', m = /(\d+)\D+(\d+)\D+(\d+)/.exec(c);
      if (m) { var r = +m[1], g = +m[2]; col = (r > 180 && g < 90) ? '#ff5c5c' : (g > 150 && r < 120) ? '#52ff85' : (r > 180 && g > 180) ? '#ffe34d' : c; }
      if (el.style.getPropertyValue('--zt-lcd') === col) return;
      if (col) el.style.setProperty('--zt-lcd', col); else el.style.removeProperty('--zt-lcd');
    }
    try { var lcdEl = document.getElementById('lcd'); if (lcdEl) new MutationObserver(lcdHold).observe(lcdEl, { attributes: true, attributeFilter: ['style'] }); } catch (e) {}
    cornerL = $('<div id="zcorner-l" class="zcorner"></div>').appendTo('body');
    cornerR = $('<div id="zcorner-r" class="zcorner"></div>').appendTo('body');
    setInterval(function () { if (current === 'timer' || current === 'trainer') { updateBar(); updateCorners(); placeCorners(); scrambleButtons(); } }, 500);
    /* quick buttons sit in the free space beside "Recent results", under the +/- difference line, at a fixed spot so they never jump */
    function placeQuick() {
      var c = cornerR && cornerR[0]; if (!c) return;
      var r = c.getBoundingClientRect(); if (!r.height) return;
      document.documentElement.style.setProperty('--zq-top', Math.round(r.top) + 'px');
    }
    placeQuick(); setInterval(placeQuick, 1000);
    $(window).on('resize', function () { placeCorners(); placeQuick(); });
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
      kernel.regListener('ztquick2', 'time', function () { setUndo(false); autoSync(); setTimeout(applyProb, 60); });
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
    var rsT = null; $(window).on('resize', function () { clearTimeout(rsT); rsT = setTimeout(function () { if (current === 'stats') renderStats(pages.stats); }, 250); });
  }
  $(function () { setTimeout(init, 0); });
})();
