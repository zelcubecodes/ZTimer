/* ZTimer Web: sync with the ZTimer app through Supabase.
   The data that travels is the APP's format (puzzle type, category, time in ms, penalty 0/1/2, date in ms),
   not csTimer's. This file turns csTimer sessions into that format and back.
   Setup: put your Supabase URL and anon key in ztimer-sync-config.js (see supabase/README.md). */
(function () {
  'use strict';
  var CFG = window.ZT_SYNC_CONFIG || { url: '', key: '' };
  /* csTimer scramble type  <->  the app's puzzle type */
  var MAP = [['333', '333'], ['222so', '222'], ['444wca', '444'], ['555wca', '555'], ['666wca', '666'], ['777wca', '777'], ['skbso', 'skewb'], ['mgmp', 'mega'], ['pyrso', 'pyra'],
    ['sqrs', 'sq1'], ['clkwca', 'clock'], ['333oh', '333oh'], ['333ni', '333bld'], ['444bld', '444bld'], ['555bld', '555bld'], ['333fm', '333fmc'], ['ftoso', 'fto']];
  var SKIP = { '333mbld': 1, 'r3ni': 1 };   /* multi-blind results are points, not times: left out so nothing gets mangled */
  function toApp(t) { for (var i = 0; i < MAP.length; i++) if (MAP[i][0] === t) return MAP[i][1]; return t; }
  function toWebType(a) { for (var i = 0; i < MAP.length; i++) if (MAP[i][1] === a) return MAP[i][0]; return a; }

  function fnv(s) { var h = 0x811c9dc5; s = String(s || ''); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); }
  function uidOf(date, time, scr) { return date + '-' + time + '-' + fnv(scr); }
  function pen2app(p) { return p === -1 ? 2 : p === 2000 ? 1 : 0; }
  function pen2web(p) { p = p % 100; return p === 2 ? -1 : p === 1 ? 2000 : 0; }

  function load() { try { return JSON.parse(localStorage.ztSync || '{}'); } catch (e) { return {}; } }
  function save(s) { try { localStorage.ztSync = JSON.stringify(s); } catch (e) {} }
  var st = load(); st.map = st.map || {}; st.hashes = st.hashes || {};
  function persist() { save(st); }
  function configured() { return !!(CFG.url && CFG.key); }

  function rpc(body) {
    return fetch(CFG.url.replace(/\/$/, '') + '/rest/v1/rpc/zt_sync', {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.key, Authorization: 'Bearer ' + CFG.key }, body: JSON.stringify(body)
    }).then(function (r) { if (!r.ok) throw new Error('Server answered ' + r.status); return r.json(); });
  }

  /* ---- read everything the website has, in the app's format ---- */
  function sessionMeta() { try { return JSON.parse(kernel.getProp('sessionData')) || {}; } catch (e) { return {}; } }
  function collect(B) {
    var meta = sessionMeta(), list = B.sessionsList().filter(function (s) { return /^\d+$/.test(s.v); });
    return Promise.all(list.map(function (s) {
      var idx = parseInt(s.v, 10), m = meta[idx] || {}, scr = (m.opt && m.opt.scrType) || '333', pp = B.parseSess(s.name), cat = pp[1] || 'Normal';
      if (/^\d+$/.test(s.name)) cat = 'Normal';
      return Promise.resolve(storage.get(idx)).then(function (times) {
        return { v: s.v, name: s.name, scr: scr, cat: cat, times: times || [] };
      });
    })).then(function (sess) {
      var rows = [];
      sess.forEach(function (S) {
        if (SKIP[S.scr] || SKIP[toApp(S.scr)]) return;
        S.times.forEach(function (e, i) {
          var pen = e[0][0], tm = e[0][1], scrm = e[1] || '', com = e[2] || '', ts = e[3] || 0, date = ts * 1000;
          var key = S.scr + '|' + S.cat + '|' + ts + '|' + tm + '|' + fnv(scrm);
          var row = { key: key, sess: S, i: i, puzzle: toApp(S.scr), category: S.cat, time: tm, penalty: pen2app(pen), date: date, scramble: scrm, comment: com, history: false };
          row.uid = st.map[key] || uidOf(date, tm, scrm);
          row.hash = fnv([row.puzzle, row.category, row.time, row.penalty, row.date, row.scramble, row.comment].join('\u0001'));
          rows.push(row);
        });
      });
      return { rows: rows, sessions: sess };
    });
  }
  function wire(r) { return { uid: r.uid, puzzle: r.puzzle, category: r.category, time: r.time, penalty: r.penalty, date: r.date, scramble: r.scramble, comment: r.comment, history: false }; }

  /* ---- put solves from other devices into the website's sessions ---- */
  function applyPulled(B, pulled, snap) {
    if (!pulled.length) return Promise.resolve(0);
    var byKey = {}, bySess = {};
    snap.rows.forEach(function (r) { byKey[r.uid] = r; });
    var groups = {};   /* target session name -> {scr, cat, adds:[], dels:{}, edits:{}} */
    pulled.forEach(function (p) {
      if (SKIP[p.puzzle]) return;
      var scr = toWebType(p.puzzle), cat = p.category || 'Normal', pname = B.puzzleName(scr), name = pname + ' / ' + cat;
      /* the website's first 3x3x3 category is the session simply called "1" */
      if (scr === '333' && cat === 'Normal' && !B.findSess(name)) { var legacy = B.sessionsList().filter(function (s) { return s.name === '1'; })[0]; if (legacy) name = '1'; }
      var g = groups[name] || (groups[name] = { name: name, scr: scr, cat: cat, adds: [], dels: {}, edits: {} });
      if (p.history) return;
      if (p.deleted) g.dels[p.uid] = 1;
      else if (byKey[p.uid]) { var same = fnv([p.puzzle, p.category || 'Normal', p.time, p.penalty, Math.floor(p.date / 1000) * 1000, p.scramble || '', p.comment || ''].join('\u0001')) === byKey[p.uid].hash; if (!same) g.edits[p.uid] = p; }
      else g.adds.push(p);
    });
    var names = Object.keys(groups), changed = 0, chain = Promise.resolve();
    var cur = B.sessSel().find('option:selected').text();
    names.forEach(function (name) {
      chain = chain.then(function () {
        var g = groups[name], s = B.findSess(name), old = [];
        var get = s ? Promise.resolve(storage.get(parseInt(s.v, 10))).then(function (t) { old = t || []; }) : Promise.resolve();
        return get.then(function () {
          var out = [], did = false;
          old.forEach(function (e) {
            var key = g.scr + '|' + g.cat + '|' + (e[3] || 0) + '|' + e[0][1] + '|' + fnv(e[1] || ''), uid = st.map[key] || uidOf((e[3] || 0) * 1000, e[0][1], e[1] || '');
            if (g.dels[uid]) { did = true; changed++; return; }
            var ed = g.edits[uid];
            if (ed) { e = [[pen2web(ed.penalty), ed.time], ed.scramble || '', ed.comment || '', e[3]]; did = true; changed++; }
            out.push(e);
          });
          g.adds.forEach(function (p) {
            out.push([[pen2web(p.penalty), p.time], p.scramble || '', p.comment || '', Math.floor(p.date / 1000)]); did = true; changed++;
          });
          if (!did) return;
          out.sort(function (a, b) { return (a[3] || 0) - (b[3] || 0); });
          return new Promise(function (res) { B.replaceSession(s ? s.v : null, name === '1' ? '1' : name, g.scr, out, res); });
        });
      });
    });
    return chain.then(function () {
      var back = B.findSess(cur); if (back) B.goSession(back.v);
      return changed;
    });
  }

  /* ---- one full round: send what changed here, fetch what changed elsewhere ---- */
  var busy = false;
  function sync(B, opts) {
    opts = opts || {};
    if (!configured()) return Promise.reject(new Error('Sync server not set up yet. See supabase/README.md.'));
    if (!st.code) return Promise.reject(new Error('Create or enter a sync code first.'));
    if (busy) return Promise.resolve({ busy: true });
    busy = true;
    var pulled = [], sent = 0;
    return collect(B).then(function (snap) {
      var present = {}; snap.rows.forEach(function (r) { present[r.uid] = 1; });
      var push = [];
      snap.rows.forEach(function (r) { if (st.hashes[r.uid] !== r.hash) push.push(r); });
      var gone = Object.keys(st.hashes).filter(function (u) { return !present[u]; });
      var items = push.map(wire).concat(gone.map(function (u) { return { uid: u, deleted: true, puzzle: 'other', time: 0, date: 0 }; }));
      var since = st.since || null, nick = opts.nick !== undefined ? opts.nick : st.nick || null, i = 0, nickSaved = null;
      function step() {
        var batch = items.slice(i, i + 500); i += 500;
        return rpc({ p_code: st.code, p_nick: nick, p_since: since, p_solves: batch }).then(function (r) {
          if (r.error) { var e = new Error(r.error === 'nick_taken' ? 'That nickname is already taken.' : r.error === 'bad_nick' ? 'Nicknames are 3 to 20 letters, numbers or _.' : 'The server refused the sync code.'); e.code = r.error; throw e; }
          nick = null; nickSaved = r.nick; sent += batch.length; since = r.server_time || since;
          (r.solves || []).forEach(function (s) { pulled.push(s); });
          if (r.more) return step();
          if (i < items.length) return step();
        });
      }
      return step().then(function () {
        push.forEach(function (r) { st.hashes[r.uid] = r.hash; st.map[r.key] = r.uid; });
        gone.forEach(function (u) { delete st.hashes[u]; });
        if (nickSaved !== null) st.nick = nickSaved;
        var fresh = pulled; /* applyPulled skips anything identical to what is already here */
        return applyPulled(B, fresh, snap).then(function (n) { return { snap: snap, since: since, pulled: pulled, fresh: fresh, applied: n }; });
      });
    }).then(function (res) {
      /* remember what each pulled solve looks like on this website, so it never bounces back to the server */
      res.pulled.forEach(function (p) {
        if (p.deleted) { delete st.hashes[p.uid]; return; }
        var scr = toWebType(p.puzzle), cat = p.category || 'Normal', ts = Math.floor(p.date / 1000);
        st.map[scr + '|' + cat + '|' + ts + '|' + p.time + '|' + fnv(p.scramble || '')] = p.uid;
        st.hashes[p.uid] = fnv([p.puzzle, cat, p.time, pen2app(pen2web(p.penalty)), ts * 1000, p.scramble || '', p.comment || ''].join('\u0001'));
      });
      st.since = res.since; st.last = Date.now(); persist(); busy = false;
      return { sent: sent, got: res.pulled.length, applied: res.applied };
    }).catch(function (e) { busy = false; persist(); throw e; });
  }

  function makeCode() {
    var a = new Uint8Array(20); crypto.getRandomValues(a);
    var ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    for (var i = 0; i < a.length; i++) { out += ch[a[i] % ch.length]; if (i % 5 === 4 && i < a.length - 1) out += '-'; }
    return out;
  }
  window.ZTSync = {
    configured: configured, state: function () { return st; }, makeCode: makeCode, sync: sync,
    setCode: function (c) { c = String(c || '').trim().toUpperCase(); if (c.length < 16) return false; st.code = c; st.since = null; st.hashes = {}; st.map = {}; persist(); return true; },
    signOut: function () { st = { map: {}, hashes: {} }; persist(); },
    setNick: function (n) { st.nick = n; persist(); }, setAuto: function (v) { st.auto = !!v; persist(); }
  };
})();
