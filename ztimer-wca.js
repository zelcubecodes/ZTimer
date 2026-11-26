/* ZTimer Web: the WCA page, laid out like the app's.
   Top bar: Results | Live, then two buttons: world records and rankings.
   Data comes from the WCA website API, WCA Live and the unofficial WCA static API (same as the app). */
(function () {
  'use strict';
  var WCA = 'https://www.worldcubeassociation.org/api/v0', LIVE = 'https://live.worldcubeassociation.org/api',
    RAW = 'https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/refs/heads/v1';
  var EVENTS = [['333', '3x3x3'], ['222', '2x2x2'], ['444', '4x4x4'], ['555', '5x5x5'], ['666', '6x6x6'], ['777', '7x7x7'], ['333bf', '3x3x3 Blindfolded'], ['333fm', '3x3x3 Fewest Moves'],
    ['333oh', '3x3x3 One-Handed'], ['clock', 'Clock'], ['minx', 'Megaminx'], ['pyram', 'Pyraminx'], ['skewb', 'Skewb'], ['sq1', 'Square-1'], ['444bf', '4x4x4 Blindfolded'], ['555bf', '5x5x5 Blindfolded'], ['333mbf', '3x3x3 Multi-Blind']];
  var EVN = {}; EVENTS.forEach(function (e) { EVN[e[0]] = e[1]; });
  var CONTINENTS = [['world', 'World'], ['africa', 'Africa'], ['asia', 'Asia'], ['europe', 'Europe'], ['north-america', 'North America'], ['oceania', 'Oceania'], ['south-america', 'South America']];
  var ROUNDS = { '1': 'First round', '2': 'Second round', '3': 'Semi final', '4': 'Final' };
  var $ = window.jQuery;

  function ls(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function flag(iso) { iso = (iso || '').toUpperCase(); return /^[A-Z]{2}$/.test(iso) ? String.fromCodePoint(127397 + iso.charCodeAt(0), 127397 + iso.charCodeAt(1)) : ''; }
  function esc(s) { return String(s == null ? '' : s); }
  function get(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }); }
  function post(body) { return fetch(LIVE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }); }
  function offline(e) { return !navigator.onLine ? 'No internet connection.' : 'Could not load this from the WCA (' + (e && e.message || 'error') + ').'; }

  /* a time like the WCA writes it: centiseconds, -1 DNF, -2 DNS */
  function fmt(v, ev, avg) {
    v = +v; if (v === -1) return 'DNF'; if (v === -2) return 'DNS'; if (!v || v < 0) return '-';
    if (ev === '333fm') return avg ? (v / 100).toFixed(2) : String(v);
    if (ev === '333mbf') { var s = String(v); if (s.length < 9) return s; var dd = +s.slice(0, 2), t = +s.slice(2, 7), miss = +s.slice(7), solved = 99 - dd + miss; var sec = t === 99999 ? 0 : t, m = Math.floor(sec / 60);
      return solved + '/' + (solved + miss) + ' ' + m + ':' + ('0' + (sec % 60)).slice(-2); }
    var cs = v % 100, sec2 = Math.floor(v / 100), mm = Math.floor(sec2 / 60), hh = Math.floor(mm / 60);
    if (hh) return hh + ':' + ('0' + (mm % 60)).slice(-2) + ':' + ('0' + (sec2 % 60)).slice(-2) + '.' + ('0' + cs).slice(-2);
    if (mm) return mm + ':' + ('0' + (sec2 % 60)).slice(-2) + '.' + ('0' + cs).slice(-2);
    return sec2 + '.' + ('0' + cs).slice(-2);
  }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dates(a, b) {
    if (!a) return ''; var A = new Date(a + 'T12:00:00'), B = new Date((b || a) + 'T12:00:00'), mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (a === b || !b) return mo[A.getMonth()] + ' ' + A.getDate() + ', ' + A.getFullYear();
    if (A.getMonth() === B.getMonth() && A.getFullYear() === B.getFullYear()) return mo[A.getMonth()] + ' ' + A.getDate() + '\u2013' + B.getDate() + ', ' + A.getFullYear();
    return mo[A.getMonth()] + ' ' + A.getDate() + ' \u2013 ' + mo[B.getMonth()] + ' ' + B.getDate() + ', ' + B.getFullYear();
  }

  /* ---- skeletons: boxes shaped like the page, pulsing while data loads ---- */
  function sk(kind) {
    var w = $('<div class="zw-sk"></div>');
    function bar(wd, h) { return $('<i class="zw-skb"></i>').css({ width: wd, height: h }); }
    function card() { return $('<div class="zw-skc"></div>'); }
    if (kind === 'comps' || kind === 'list') for (var i = 0; i < 6; i++) w.append(card().css('animation-delay', i * 90 + 'ms').append($('<div class="zw-skr"></div>').append($('<i class="zw-skb zw-skdot"></i>'), $('<div style="flex:1"></div>').append(bar(150 - (i % 3) * 20, 15).css('margin-bottom', 8), bar(96, 11)), bar(40, 16))));
    else if (kind === 'profile') {
      w.append(card().append($('<div class="zw-skr"></div>').append($('<i class="zw-skb zw-skdot" style="width:60px;height:60px"></i>'), $('<div></div>').append(bar(170, 20).css('margin-bottom', 8), bar(110, 12)))));
      for (var j = 0; j < 7; j++) w.append(card().css('animation-delay', j * 80 + 'ms').append($('<div class="zw-skr"></div>').append(bar(26, 26), bar(110, 14), $('<div style="flex:1"></div>'), bar(54, 14), bar(54, 14))));
    } else if (kind === 'round') {
      w.append(card().append($('<div class="zw-skr"></div>').append(bar(30, 30), bar(30, 30), bar(30, 30), bar(30, 30), bar(30, 30), bar(30, 30))));
      for (var k = 0; k < 8; k++) w.append(card().css({ 'animation-delay': k * 70 + 'ms', padding: '10px 14px' }).append($('<div class="zw-skr"></div>').append(bar(22, 14), $('<div style="flex:1"></div>').append(bar(150 - (k % 3) * 20, 14)), bar(48, 14), bar(48, 14))));
    } else for (var q = 0; q < 6; q++) w.append(card().css('animation-delay', q * 90 + 'ms').append($('<div class="zw-skr"></div>').append(bar(22, 14), bar(140, 14), $('<div style="flex:1"></div>'), bar(56, 14))));
    return w;
  }
  function err(box, msg, retry) {
    box.empty().append($('<div class="zw-msg"></div>').append($('<p></p>').text(msg), retry ? $('<button class="zw-btn"></button>').text('Try again').on('click', retry) : ''));
  }

  window.zWcaApp = function (body, ctx) {
    var zs = ctx.zs, icon = ctx.icon, view = 'results', sub = null;
    var root = $('<div class="zw"></div>').appendTo(body);
    var bar = $('<div class="zw-bar"></div>').appendTo(root), main = $('<div class="zw-main"></div>').appendTo(root);
    var timer = null;
    function stopTimer() { clearInterval(timer); timer = null; }

    /* top bar: Results | Live, then records and rankings */
    var tabs = $('<div class="zw-tabs"></div>').appendTo(bar);
    var tR = $('<button class="zw-tab"></button>').text('Results').appendTo(tabs), tL = $('<button class="zw-tab"></button>').text('Live').appendTo(tabs);
    var bRec = $('<button class="zw-ib" title="World records" aria-label="World records"></button>').append(icon('records')).appendTo(bar);
    var bRank = $('<button class="zw-ib" title="Rankings" aria-label="Rankings"></button>').append(icon('rankings')).appendTo(bar);
    function setView(v, s) {
      stopTimer(); view = v; sub = s || null;
      tR.toggleClass('on', v === 'results'); tL.toggleClass('on', v === 'live'); bRec.toggleClass('on', v === 'records'); bRank.toggleClass('on', v === 'rankings');
      main.empty();
      ({ results: results, live: live, records: records, rankings: rankings })[v]();
    }
    tR.on('click', function () { setView('results'); }); tL.on('click', function () { setView('live'); });
    bRec.on('click', function () { setView('records'); }); bRank.on('click', function () { setView('rankings'); });
    function back(label, fn) { return $('<button class="zw-back"></button>').append(icon('back'), $('<span></span>').text(label)).on('click', fn); }

    /* ---------------- Results: find a competitor, open their profile ---------------- */
    var lastQ = '';
    function saved() { return ls('ztWcaSaved', []); }
    function results() {
      var box = $('<div></div>').appendTo(main), inp = $('<input class="zw-search" type="search" placeholder="WCA ID or name" autocomplete="off" autocapitalize="off">').val(lastQ).appendTo(box),
        list = $('<div class="zw-list"></div>').appendTo(box), t = null, tok = 0;
      function showSaved() {
        list.empty(); var s = saved();
        if (!s.length) { list.append($('<p class="zw-note"></p>').text('Search for a competitor by name or WCA ID. People you open are saved here.')); return; }
        list.append($('<h4 class="zw-h"></h4>').text('Saved'));
        s.forEach(function (p) { list.append(personRow(p.id, p.name, p.iso, '')); });
      }
      function personRow(id, name, isoc, extra) {
        return $('<div class="zw-card zw-row"></div>').append($('<span class="zw-fl"></span>').text(flag(isoc) || '\uD83C\uDF10'),
          $('<div class="zw-grow"></div>').append($('<b></b>').text(name), $('<span class="zw-sm"></span>').text(id + (extra ? '  \u00B7  ' + extra : ''))), $('<i class="zw-chev"></i>'))
          .on('click', function () { profile(id); });
      }
      function search(q) {
        var my = ++tok; list.empty().append(sk('list'));
        get(WCA + '/search/users?persons_table=true&q=' + encodeURIComponent(q)).then(function (d) {
          if (my !== tok) return; list.empty(); var res = (d.result || []).slice(0, 25);
          if (!res.length) { list.append($('<p class="zw-note"></p>').text('No competitors found.')); return; }
          res.forEach(function (p) { list.append(personRow(p.wca_id, p.name, p.country_iso2, p.country_iso2)); });
        }).catch(function (e) { if (my === tok) err(list, offline(e), function () { search(q); }); });
      }
      inp.on('input', function () {
        lastQ = inp.val().trim(); clearTimeout(t);
        if (lastQ.length < 2) { tok++; showSaved(); return; }
        t = setTimeout(function () { if (/^\d{4}[A-Za-z]{4}\d{2}$/.test(lastQ)) profile(lastQ.toUpperCase()); else search(lastQ); }, 350);
      });
      if (lastQ.length >= 2) inp.trigger('input'); else showSaved();
    }
    function profile(id) {
      stopTimer(); main.empty().append(back('Results', function () { setView('results'); }));
      var box = $('<div></div>').appendTo(main).append(sk('profile'));
      Promise.all([get(WCA + '/persons/' + id), get(WCA + '/persons/' + id + '/results')]).then(function (r) {
        var P = r[0], R = r[1], person = P.person || {}, s = saved().filter(function (x) { return x.id !== id; });
        s.unshift({ id: id, name: person.name, iso: person.country_iso2 }); lsSet('ztWcaSaved', s.slice(0, 20));
        box.empty();
        var med = P.medals || {}, rec = P.records || {};
        box.append($('<div class="zw-card zw-prof"></div>').append($('<span class="zw-flb"></span>').text(flag(person.country_iso2) || '\uD83C\uDF10'),
          $('<div></div>').append($('<h3></h3>').text(person.name), $('<span class="zw-sm"></span>').text(id + '  \u00B7  ' + (person.country_iso2 || '')),
            $('<span class="zw-sm"></span>').text((P.competition_count || 0) + ' competitions  \u00B7  ' + (med.gold || 0) + ' gold, ' + (med.silver || 0) + ' silver, ' + (med.bronze || 0) + ' bronze'),
            (rec.world_record_count ? $('<span class="zw-sm"></span>').text(rec.world_record_count + ' world records') : ''))));
        /* personal records */
        var pr = P.personal_records || {}, tbl = $('<div class="zw-card zw-pr"></div>').append($('<h4 class="zw-h"></h4>').text('Personal records'));
        tbl.append($('<div class="zw-prr zw-prh"></div>').append('<span></span>', $('<span></span>').text('Single'), $('<span></span>').text('Average')));
        EVENTS.forEach(function (e) {
          var x = pr[e[0]]; if (!x) return;
          function cell(o, avg) { return o ? $('<span></span>').append($('<b></b>').text(fmt(o.best, e[0], avg)), $('<em></em>').text(rankTxt(o))) : $('<span>-</span>'); }
          tbl.append($('<div class="zw-prr"></div>').append($('<span class="zw-pe"></span>').append($('<span class="zpi zpi-ev-' + e[0] + ' zev"></span>'), document.createTextNode(' ' + e[1])), cell(x.single, false), cell(x.average, true)));
        });
        box.append(tbl);
        /* previous results, newest competition first */
        var by = {}, order = [];
        R.forEach(function (x) { if (!by[x.competition_id]) { by[x.competition_id] = []; order.push(x.competition_id); } by[x.competition_id].push(x); });
        var hist = $('<div></div>').appendTo(box), shown = 8;
        function drawHist() {
          hist.empty().append($('<h4 class="zw-h"></h4>').text('Previous results'));
          order.slice(0, shown).forEach(function (cid) {
            var c = $('<div class="zw-card"></div>').append($('<b class="zw-cn"></b>').text(cid.replace(/(\d{4})$/, ' $1')));
            by[cid].forEach(function (x) {
              c.append($('<div class="zw-hr"></div>').append($('<span class="zw-pe"></span>').append($('<span class="zpi zpi-ev-' + x.event_id + ' zev"></span>'), document.createTextNode(' ' + (EVN[x.event_id] || x.event_id))),
                $('<span class="zw-sm"></span>').text((x.pos > 0 ? '#' + x.pos : '') + (x.round_type_id === 'f' || x.round_type_id === 'c' ? '' : ' ' + x.round_type_id)),
                $('<span class="zw-grow"></span>'), $('<b></b>').text(fmt(x.best, x.event_id, false)), $('<b></b>').text(x.average > 0 || x.average < 0 ? fmt(x.average, x.event_id, true) : '')));
              if (x.attempts && x.attempts.length) c.append($('<div class="zw-att"></div>').text(x.attempts.map(function (a) { return fmt(a, x.event_id, false); }).join('  ')));
            });
            hist.append(c);
          });
          if (order.length > shown) hist.append($('<button class="zw-btn"></button>').text('Show more').on('click', function () { shown += 8; drawHist(); }));
        }
        drawHist();
      }).catch(function (e) { box.empty(); err(box, offline(e), function () { profile(id); }); });
    }
    function rankTxt(o) { return 'WR ' + (o.world_rank || '-') + (o.continent_rank ? '  CR ' + o.continent_rank : '') + (o.country_rank ? '  NR ' + o.country_rank : ''); }

    /* ---------------- Live: competitions, then one competition's rounds ---------------- */
    var liveTab = 0, comps = null, liveQ = '';
    function stars() { return ls('ztWcaStars', []); }
    function live() {
      if (sub) return openComp(sub);
      var head = $('<div></div>').appendTo(main), inp = $('<input class="zw-search" type="search" placeholder="Search competitions" autocomplete="off">').val(liveQ).appendTo(head),
        pills = $('<div class="zw-pills"></div>').appendTo(head), list = $('<div class="zw-list"></div>').appendTo(main), t = null;
      ['Right now', 'Upcoming', 'Past', 'Starred'].forEach(function (n, i) { $('<button class="zw-pill"></button>').text(n).toggleClass('on', i === liveTab).on('click', function () { liveTab = i; pills.children().removeClass('on').eq(i).addClass('on'); draw(); }).appendTo(pills); });
      function status(c) { var today = iso(new Date()); return c.endDate < today ? 'Finished' : c.startDate > today ? 'Upcoming' : 'Live'; }
      function card(c) {
        var st = stars().indexOf(c.id) >= 0, s = status(c);
        return $('<div class="zw-card zw-row"></div>').append($('<div class="zw-grow"></div>').append($('<b></b>').text(c.name), $('<span class="zw-sm"></span>').text(dates(c.startDate, c.endDate))),
          $('<span class="zw-badge"></span>').addClass('s' + s.charAt(0)).text(s),
          $('<button class="zw-star" aria-label="Star"></button>').toggleClass('on', st).text(st ? '\u2605' : '\u2606').on('click', function (e) { e.stopPropagation(); var a = stars(), k = a.indexOf(c.id); if (k >= 0) a.splice(k, 1); else a.push(c.id); lsSet('ztWcaStars', a); draw(); }))
          .on('click', function () { sub = c; setView('live', c); });
      }
      function draw() {
        list.empty(); if (comps === null) { list.append(sk('comps')); return; }
        var q = liveQ.toLowerCase(), today = iso(new Date()), out = comps.filter(function (c) { return !q || c.name.toLowerCase().indexOf(q) >= 0; });
        if (!q) {
          if (liveTab === 0) out = out.filter(function (c) { return c.startDate <= today && c.endDate >= today; });
          else if (liveTab === 1) out = out.filter(function (c) { return c.startDate > today; }).sort(function (a, b) { return a.startDate < b.startDate ? -1 : 1; });
          else if (liveTab === 2) out = out.filter(function (c) { return c.endDate < today; }).sort(function (a, b) { return a.startDate < b.startDate ? 1 : -1; });
          else out = out.filter(function (c) { return stars().indexOf(c.id) >= 0; });
        }
        if (!out.length) list.append($('<p class="zw-note"></p>').text(liveTab === 3 && !q ? 'No favourites yet. Tap a star.' : 'No competitions found.'));
        out.forEach(function (c) { list.append(card(c)); });
      }
      function load(filter) {
        var from = new Date(); if (filter) from.setFullYear(from.getFullYear() - 20); else from.setDate(from.getDate() - 31);
        if (filter) list.empty().append(sk('comps'));
        post({ query: 'query($from: Date, $filter: String, $limit: Int) { competitions(from: $from, filter: $filter, limit: $limit) { id wcaId name shortName startDate endDate } }', variables: { from: iso(from), limit: filter ? 12 : 250, filter: filter || null } })
          .then(function (d) { comps = (d.data.competitions || []); draw(); }).catch(function (e) { err(list, offline(e), function () { comps = null; draw(); load(filter); }); });
      }
      inp.on('input', function () { liveQ = inp.val().trim(); clearTimeout(t); t = setTimeout(function () { if (liveQ.length >= 3) load(liveQ); else if (!liveQ) { comps = null; draw(); load(null); } else draw(); }, 400); });
      if (comps === null) { draw(); load(liveQ.length >= 3 ? liveQ : null); } else draw();
    }
    function openComp(c) {
      main.empty().append(back('Live', function () { sub = null; setView('live'); }));
      main.append($('<div class="zw-card"></div>').append($('<b></b>').text(c.name), $('<span class="zw-sm"></span>').text(dates(c.startDate, c.endDate))));
      var box = $('<div></div>').appendTo(main).append(sk('round')), evId = null, rd = 0, data = null;
      function load(quiet) {
        get(LIVE + '/competitions/' + encodeURIComponent(c.wcaId || c.id) + '/results').then(function (d) {
          data = d; var ppl = {}; (d.persons || []).forEach(function (p) { ppl[p.id] = p; }); data.ppl = ppl;
          if (!evId || !(d.events || []).some(function (e) { return e.eventId === evId; })) { evId = d.events && d.events[0] && d.events[0].eventId; rd = 0; }
          draw();
        }).catch(function (e) { if (!quiet) err(box, offline(e), function () { box.empty().append(sk('round')); load(); }); });
      }
      function draw() {
        box.empty(); var evs = data.events || [];
        if (!evs.length) { box.append($('<p class="zw-note"></p>').text('This competition has no results on WCA Live yet.')); return; }
        var pills = $('<div class="zw-pills zw-evs"></div>').appendTo(box);
        evs.forEach(function (e) { $('<button class="zw-ev"></button>').append($('<span class="zpi zpi-ev-' + e.eventId + ' zev"></span>')).toggleClass('on', e.eventId === evId).attr('title', EVN[e.eventId] || e.eventId).on('click', function () { evId = e.eventId; rd = 0; draw(); }).appendTo(pills); });
        var ev = evs.filter(function (e) { return e.eventId === evId; })[0], rounds = (ev.rounds || []).slice().sort(function (a, b) { return a.number - b.number; });
        if (!rounds.length) { box.append($('<p class="zw-note"></p>').text('No rounds yet.')); return; }
        if (rd >= rounds.length || !rd && rounds.length) rd = rd || rounds.length - 1;
        var rp = $('<div class="zw-pills"></div>').appendTo(box);
        rounds.forEach(function (r, i) { $('<button class="zw-pill"></button>').text(rounds.length > 1 && i === rounds.length - 1 ? 'Final' : 'Round ' + r.number).toggleClass('on', i === rd).on('click', function () { rd = i; draw(); }).appendTo(rp); });
        var r = rounds[rd], rows = (r.results || []).slice().sort(function (a, b) { return (a.ranking || 9999) - (b.ranking || 9999); }), card = $('<div class="zw-card zw-tbl"></div>').appendTo(box);
        card.append($('<div class="zw-tr zw-th"></div>').append('<span class="zw-c1">#</span>', '<span class="zw-grow">Name</span>', '<span class="zw-c3">Best</span>', '<span class="zw-c3">Avg</span>'));
        if (!rows.length) card.append($('<p class="zw-note"></p>').text('No results in this round yet.'));
        var att = zs('wcaAttempts');
        rows.forEach(function (x) {
          var p = data.ppl[x.personId] || {}, co = p.country || {}, tr = $('<div class="zw-tr"></div>').toggleClass('adv', !!x.advancing);
          var tag = function (t) { return t ? $('<sup class="zw-rec"></sup>').text(t) : ''; };
          tr.append($('<span class="zw-c1"></span>').text(x.ranking || '-'), $('<span class="zw-grow"></span>').append($('<span></span>').text(flag(co.iso2 || p.countryIso2) + ' ' + (p.name || '')), p.wcaId ? $('<em class="zw-sm"></em>').text(p.wcaId) : ''),
            $('<span class="zw-c3"></span>').append($('<b></b>').text(fmt(x.best, evId, false)), tag(x.singleRecordTag)), $('<span class="zw-c3"></span>').append($('<b></b>').text(x.average ? fmt(x.average, evId, true) : '-'), tag(x.averageRecordTag)));
          card.append(tr);
          if (att && x.attempts && x.attempts.length) card.append($('<div class="zw-att"></div>').text(x.attempts.map(function (a) { return fmt(a, evId, false); }).join('   ')));
        });
        box.append($('<p class="zw-note"></p>').text('Results from WCA Live' + (zs('wcaAuto') ? ', refreshed every 30 seconds.' : '.')));
      }
      load();
      timer = setInterval(function () { if (zs('wcaAuto') && data) load(true); }, 30000);
    }

    /* ---------------- World records ---------------- */
    function records() {
      var box = $('<div></div>').appendTo(main).append(sk('list'));
      main.prepend($('<h3 class="zw-title"></h3>').text('World records'));
      get(WCA + '/records').then(function (d) {
        box.empty(); var w = d.world_records || {};
        EVENTS.forEach(function (e) {
          var x = w[e[0]]; if (!x) return;
          box.append($('<div class="zw-card zw-rc"></div>').append($('<div class="zw-pe"></div>').append($('<span class="zpi zpi-ev-' + e[0] + ' zev"></span>'), $('<b></b>').text(' ' + e[1])),
            $('<div class="zw-rv"></div>').append($('<span></span>').append($('<small>Single</small>'), $('<b></b>').text(x.single ? fmt(x.single, e[0], false) : '-')),
              $('<span></span>').append($('<small>Average</small>'), $('<b></b>').text(x.average ? fmt(x.average, e[0], true) : '-')))));
        });
        box.append($('<p class="zw-note"></p>').text('Data: World Cube Association.'));
      }).catch(function (e) { err(box, offline(e), records_retry); });
      function records_retry() { setView('records'); }
    }

    /* ---------------- Rankings ---------------- */
    var rk = { region: 'world', avg: false, ev: '333' };
    function rankings() {
      var ctl = $('<div></div>').appendTo(main), list = $('<div class="zw-list"></div>').appendTo(main), my = 0;
      var reg = $('<select class="zw-sel"></select>').appendTo(ctl), evs = $('<div class="zw-pills zw-evs"></div>').appendTo(ctl), tg = $('<div class="zw-pills"></div>').appendTo(ctl);
      CONTINENTS.forEach(function (c) { $('<option></option>').val(c[0]).text(c[1]).appendTo(reg); }); reg.val(rk.region);
      reg.on('change', function () { rk.region = this.value; go(); });
      EVENTS.forEach(function (e) { $('<button class="zw-ev"></button>').append($('<span class="zpi zpi-ev-' + e[0] + ' zev"></span>')).toggleClass('on', e[0] === rk.ev).attr('title', e[1]).on('click', function () { rk.ev = e[0]; evs.children().removeClass('on'); $(this).addClass('on'); go(); }).appendTo(evs); });
      ['Single', 'Average'].forEach(function (n, i) { $('<button class="zw-pill"></button>').text(n).toggleClass('on', (i === 1) === rk.avg).on('click', function () { rk.avg = i === 1; tg.children().removeClass('on'); $(this).addClass('on'); go(); }).appendTo(tg); });
      function go() {
        var t = ++my; list.empty().append(sk('list'));
        var base = RAW + '/rank/' + rk.region + '/' + (rk.avg ? 'average' : 'single') + '/' + rk.ev;
        get(base + '.json').catch(function () { return get(base + '-page-1.json'); }).then(function (d) {
          if (t !== my) return; list.empty(); var items = (d.items || d || []).slice(0, 100);
          if (!items.length) { list.append($('<p class="zw-note"></p>').text('No ranking found for this event and region.')); return; }
          var names = ls('ztWcaNames', {}), pending = [];
          items.forEach(function (it, i) {
            var key = rk.region === 'world' ? 'world' : 'continent', rank = (it.rank && (it.rank[key] || it.rank.world)) || i + 1, nm = names[it.personId] || it.personName || '';
            var row = $('<div class="zw-card zw-row"></div>').append($('<span class="zw-c1"></span>').text(rank), $('<div class="zw-grow"></div>').append($('<b class="zw-nm"></b>').text(nm || it.personId), nm ? $('<span class="zw-sm"></span>').text(it.personId) : ''),
              $('<b></b>').text(fmt(it.best, rk.ev, rk.avg))).on('click', function () { setView('results'); profile(it.personId); });
            list.append(row); if (!nm && i < 50) pending.push([it.personId, row]);
          });
          (function next() {
            if (t !== my || !pending.length) { lsSet('ztWcaNames', names); return; }
            var batch = pending.splice(0, 8);
            Promise.all(batch.map(function (b) { return get(WCA + '/persons/' + b[0]).then(function (p) { names[b[0]] = p.person.name; b[1].find('.zw-nm').text(p.person.name); b[1].find('.zw-grow').append($('<span class="zw-sm"></span>').text(b[0])); }).catch(function () {}); })).then(next);
          })();
          list.append($('<p class="zw-note"></p>').text('Data: unofficial WCA public API, updated once a day.'));
        }).catch(function (e) { if (t === my) err(list, offline(e), go); });
      }
      go();
    }
    setView('results');
    return { stop: stopTimer };
  };
})();
