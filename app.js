/*
 * ZTimer Web. Copyright (C) 2026 Zel (ZelCubes). GNU General Public License v3.0.
 * Source: https://github.com/zelcubecodes/ZTimer   No warranty.
 * Original code, written from scratch. The layout, the session and statistics model and the
 * import format are inspired by csTimer (Chen Shuang, GPL-3.0). Scrambles and scramble images come
 * from csTimer's own code in cstimer_bundle.js. See the Credits dialog for details.
 */
(() => {
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LS = localStorage;
const jl = (k, d) => { try { return JSON.parse(LS.getItem(k)) || d; } catch (e) { return d; } };
const uid = () => Math.random().toString(36).slice(2, 9);

// Puzzle list and the WCA / Non-WCA split follow the ZTimer Android app.
const WCA = [['2x2','222so'],['3x3','333'],['4x4','444wca'],['5x5','555wca'],['6x6','666wca'],['7x7','777wca'],['3x3 BLD','333ni'],['3x3 FMC','333fm'],['3x3 OH','333oh'],['Clock','clkwca'],['Megaminx','mgmp'],['Pyraminx','pyrso'],['Skewb','skbso'],['Square-1','sqrs'],['4x4 BLD','444bld'],['5x5 BLD','555bld']];
const OTH = [['3x3 Feet','333ft'],['Mirror Blocks','mrbl'],['2x2x3 Tower','223'],['2x3x3 Domino','233'],['Floppy Cube','133'],['3x3x4','334'],['8x8','888'],['9x9','999'],['10x10','101010'],['11x11','111111'],['Gigaminx','giga'],['Kilominx','klmp'],['Master Pyraminx','mpyr'],['Square-2','sq2'],['15 Puzzle','15p'],['8 Puzzle','8prp'],['Gear Cube','gearso'],['Helicopter Cube','heli'],['Curvy Copter','helicv'],['Redi Cube','rediso'],['Dino Cube','dinoso'],['Crazy 3x3','crz3a'],['Ivy Cube','ivyso'],['FTO','ftoso'],['Relay 234','r234'],['Relay 2345','r2345'],['Relay 23456','r23456'],['Relay 234567','r234567'],['Mini Guildford','rmngf']];
let types = [];
try { types = cstimerModule.getScrambleTypes(); } catch (e) {}
const known = p => !types.length || types.includes(p[1]);
const label = t => (WCA.concat(OTH).find(p => p[1] === t) || [t])[0];

// ---- data ----
let S = jl('ztimer.v2', null);
const O = Object.assign({ wait: 300, insp: false, upd: 'real', theme: 'auto' }, jl('ztimer.opt', {}));
const newSess = (name, puzzle) => { const s = { id: uid(), name, puzzle, solves: [] }; S.sessions.push(s); return s; };
const bucket = (v, make) => { let s = S.sessions.find(x => x._m === v.puzzle); if (!s) { s = make(); s._m = v.puzzle; } return s; };
if (!S) {
  S = { z: 2, cur: '', sessions: [] };
  jl('ztimer.solves', []).forEach(v => { // solves saved by the first ZTimer Web version
    bucket(v, () => newSess(label(v.puzzle), v.puzzle)).solves.push({ ms: v.ms, pen: v.pen || 0, scr: v.scr || '', ts: v.ts || 0, note: '' });
  });
  if (!S.sessions.length) newSess('Session 1', '333');
}
S.sessions.forEach(s => delete s._m);
const cur = () => S.sessions.find(s => s.id === S.cur) || (S.cur = S.sessions[0].id, S.sessions[0]);
cur();
const save = () => { LS.setItem('ztimer.v2', JSON.stringify(S)); };
const saveO = () => { LS.setItem('ztimer.opt', JSON.stringify(O)); document.documentElement.dataset.theme = O.theme; };
saveO();

// ---- formatting and statistics ----
const val = s => s.pen === 2 ? Infinity : s.ms + (s.pen === 1 ? 2000 : 0);
const fmt = v => {
  if (v === Infinity) return 'DNF';
  const s = v / 1000;
  if (s >= 60) { const m = Math.floor(s / 60); return m + ':' + (s - m * 60).toFixed(2).padStart(5, '0'); }
  return s.toFixed(2);
};
const fs = s => s.pen === 2 ? 'DNF' : fmt(s.ms + (s.pen === 1 ? 2000 : 0)) + (s.pen === 1 ? '+' : '');
function series(v, n) { // n = 1 single, 3 mean of 3, 5+ trimmed average
  if (v.length < n) return null;
  const t = n >= 5 ? Math.ceil(n * 0.05) : 0;
  let best = 0, be = -1, c;
  for (let i = n; i <= v.length; i++) {
    const w = v.slice(i - n, i).sort((a, b) => a - b).slice(t, n - t);
    c = w.includes(Infinity) ? Infinity : w.reduce((a, b) => a + b, 0) / w.length;
    if (be < 0 || c < best) { best = c; be = i; }
  }
  return { cur: c, best, ce: v.length, be };
}
const NS = [[1, 'single'], [3, 'mo3'], [5, 'ao5'], [12, 'ao12'], [100, 'ao100']];

function renderStats() {
  const s = cur(), v = s.solves.map(val);
  let h = '<tr><th></th><th>current</th><th>best</th></tr>';
  NS.forEach(([n, l]) => {
    const r = series(v, n), c = (w, x) => `<td${r ? ` data-a="det" data-n="${n}" data-w="${w}"` : ''}>${r ? fmt(x) : '-'}</td>`;
    h += `<tr><td>${l}</td>${c('c', r && r.cur)}${c('b', r && r.best)}</tr>`;
  });
  $('#st').innerHTML = h;
  const ok = v.filter(isFinite);
  $('#sum').textContent = `Solved ${ok.length}/${v.length} · mean ${ok.length ? fmt(ok.reduce((a, b) => a + b, 0) / ok.length) : '-'}`;
  const first = Math.max(0, s.solves.length - 500);
  $('#times').innerHTML = s.solves.slice(first).map((x, i) => `<div class="t" data-a="sv" data-i="${first + i}" title="#${first + i + 1}">${fs(x)}</div>`).join('');
  $('#times').scrollTop = 1e9;
  const last = s.solves[s.solves.length - 1];
  if (state === 'idle' && !insp) $('#time').textContent = last ? fs(last) : '0.00';
}
function renderHead() {
  const s = cur();
  $('#bSess').textContent = s.name + ' ▾';
  $('#bPuz').textContent = label(s.puzzle) + ' ▾';
}

// ---- scrambles (history like csTimer's previous / next arrows) ----
let hist = [], hi = -1;
const gen = () => { try { return cstimerModule.getScramble(cur().puzzle, 0).trim(); } catch (e) { return 'Could not generate a scramble for this puzzle.'; } };
function showScr() {
  $('#scr').textContent = hist[hi];
  $('#img').innerHTML = '';
  const mine = hist[hi];
  setTimeout(() => {
    if (mine !== hist[hi]) return;
    try { const svg = cstimerModule.getImage(mine, cur().puzzle); if (typeof svg === 'string' && svg.includes('<svg')) $('#img').innerHTML = svg; } catch (e) {}
  }, 0);
}
function nextScr() {
  if (hi < hist.length - 1) hi++;
  else { hist.push(gen()); if (hist.length > 50) hist.shift(); hi = hist.length - 1; }
  showScr();
}
const resetScr = () => { hist = []; hi = -1; nextScr(); };

// ---- timer ----
let state = 'idle', insp = false, t0 = 0, ti = 0, ipen = 0, raf = 0, ht = 0;
function frame() {
  const n = performance.now(), el = $('#time');
  if (state === 'run') el.textContent = O.upd === 'hide' ? '...' : O.upd === 'sec' ? String(Math.floor((n - t0) / 1000)) : fmt(n - t0);
  else if (insp) { const e = (n - ti) / 1000; el.textContent = e >= 17 ? 'DNF' : e >= 15 ? '+2' : String(Math.ceil(15 - e)); }
  else return;
  raf = requestAnimationFrame(frame);
}
function press() {
  if (state === 'run') return stop();
  if (state !== 'idle') return;
  state = 'hold'; $('#time').className = 'hold';
  clearTimeout(ht);
  ht = setTimeout(() => { if (state === 'hold') { state = 'ready'; $('#time').className = 'ready'; } }, O.wait);
}
function release() {
  clearTimeout(ht);
  if (state === 'ready') {
    if (O.insp && !insp) { insp = true; ti = performance.now(); state = 'idle'; $('#time').className = 'insp'; cancelAnimationFrame(raf); frame(); }
    else start();
  } else if (state === 'hold') { state = 'idle'; $('#time').className = insp ? 'insp' : ''; }
}
function start() {
  ipen = 0;
  if (insp) { const e = (performance.now() - ti) / 1000; ipen = e >= 17 ? 2 : e >= 15 ? 1 : 0; insp = false; }
  state = 'run'; t0 = performance.now(); $('#time').className = ''; $('#hint').style.visibility = 'hidden';
  cancelAnimationFrame(raf); frame();
}
function stop() {
  cancelAnimationFrame(raf);
  const ms = Math.round(performance.now() - t0);
  state = 'idle';
  cur().solves.push({ ms, pen: ipen, scr: hist[hi] || '', ts: Date.now(), note: '' });
  save();
  $('#hint').style.visibility = 'visible';
  hi = hist.length - 1; nextScr();
  renderStats();
}
const dlgOpen = () => $('#dlg').open;
addEventListener('keydown', e => {
  if (dlgOpen() || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) press(); }
  else if (e.code === 'Escape' && insp && state === 'idle') { insp = false; $('#time').className = ''; cancelAnimationFrame(raf); renderStats(); }
  else if (state === 'run') stop();
});
addEventListener('keyup', e => { if (e.code === 'Space' && !dlgOpen() && !/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) { e.preventDefault(); release(); } });
$('#mid').addEventListener('pointerdown', e => { if (e.target.closest('button')) return; e.preventDefault(); press(); });
addEventListener('pointerup', () => { if (state === 'hold' || state === 'ready') release(); });

// ---- dialogs ----
const open = h => { $('#db').innerHTML = h; if (!dlgOpen()) $('#dlg').showModal(); };
const last = () => { const s = cur(); return s.solves.length - 1; };
const txt = (list, title) => `${title}\n` + list.map((s, i) => `${i + 1}. ${fs(s)}${s.scr ? '  ' + s.scr : ''}`).join('\n');
const copy = t => { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).catch(() => prompt('Copy this text:', t)); };

function showSolve(i) {
  const x = cur().solves[i]; if (!x) return;
  open(`<h3>Solve #${i + 1}: ${fs(x)}</h3><div style="color:var(--dim)">${x.ts ? new Date(x.ts).toLocaleString() : 'No date'}</div>
  <p><pre>${esc(x.scr || 'No scramble saved')}</pre></p>
  <textarea rows="2" data-note="${i}" placeholder="Comment">${esc(x.note || '')}</textarea>
  <div class="g"><button data-a="pen" data-i="${i}" data-p="1">+2</button><button data-a="pen" data-i="${i}" data-p="2">DNF</button><button data-a="rm" data-i="${i}">Delete</button></div>`);
}
const sessionsDlg = () => open(`<h3>Sessions</h3><div class="g">${S.sessions.map(s => `<button data-a="sw" data-id="${s.id}"${s.id === S.cur ? ' style="border-color:var(--acc)"' : ''}>${esc(s.name)} · ${esc(label(s.puzzle))} · ${s.solves.length}</button>`).join('')}</div>
  <div class="g"><button data-a="newS">New session</button><button data-a="renS">Rename</button><button data-a="delS">Delete this session</button></div>`);
let tab = 0;
const puzzlesDlg = () => open(`<h3>Select a puzzle</h3><div class="g"><button data-a="tab" data-t="0"${tab ? '' : ' style="border-color:var(--acc)"'}>WCA</button><button data-a="tab" data-t="1"${tab ? ' style="border-color:var(--acc)"' : ''}>Non-WCA</button></div>
  <div class="g">${(tab ? OTH : WCA).filter(known).map(p => `<button data-a="pick" data-p="${p[1]}">${p[0]}</button>`).join('')}</div>`);
const optionsDlg = () => open(`<h3>Options</h3>
  <label>Hold time before the timer is ready <select data-o="wait">${[0, 150, 300, 500, 1000].map(v => `<option value="${v}"${O.wait === v ? ' selected' : ''}>${v ? v + ' ms' : 'none'}</option>`).join('')}</select></label>
  <label>WCA inspection (15 s, +2 and DNF) <input type="checkbox" data-o="insp"${O.insp ? ' checked' : ''}></label>
  <label>Timer while solving <select data-o="upd">${[['real', 'Show time'], ['sec', 'Seconds only'], ['hide', 'Hide']].map(a => `<option value="${a[0]}"${O.upd === a[0] ? ' selected' : ''}>${a[1]}</option>`).join('')}</select></label>
  <label>Theme <select data-o="theme">${['auto', 'light', 'dark'].map(v => `<option${O.theme === v ? ' selected' : ''}>${v}</option>`).join('')}</select></label>`);
const exportDlg = () => open(`<h3>Export / Import</h3><div class="g"><button data-a="save">Save all sessions (.json)</button><button data-a="copyS">Copy this session as text</button><button data-a="imp">Import file</button><button data-a="clr">Clear this session</button></div>
  <p style="color:var(--dim);font-size:13px">Import understands ZTimer Web backups, csTimer exports (.txt or .json), and solve lists from ZTimer, Cubic Timer and Twisty Timer ("time";"scramble";"date" lines). Imports are added, nothing is overwritten.</p>`);
const creditsDlg = () => open(`<h3>Credits and licences</h3>
  <p>ZTimer Web is an unofficial, free fan project. It is licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener">GNU GPL v3.0</a>, and its complete, unminified source is at <a href="https://github.com/zelcubecodes/ZTimer" target="_blank" rel="noopener">github.com/zelcubecodes/ZTimer</a>. New code: Copyright (C) 2026 Zel (ZelCubes). It comes with no warranty.</p>
  <table><tr><th>Project</th><th>What this site takes from it</th></tr>
  <tr><td><b>csTimer</b><br>Chen Shuang (cs0x7f), GPL-3.0<br><a href="https://cstimer.net" target="_blank" rel="noopener">cstimer.net</a><br><a href="https://github.com/cs0x7f/cstimer" target="_blank" rel="noopener">source</a></td>
  <td><b>Code:</b> all scramble generators and scramble pictures (cstimer_bundle.js, csTimer's scramble code).<br><b>Inspired by (written from scratch, no csTimer UI code copied):</b> the screen layout, sessions with their own puzzle, the current / best statistics table with click-through details, solve details and comments, scramble history arrows, inspection, and reading csTimer export files.</td></tr>
  <tr><td><b>ZTimer</b> (Android app)<br>Zel (ZelCubes), GPL-3.0<br><a href="https://github.com/zelcubecodes/ZTimer" target="_blank" rel="noopener">source</a></td>
  <td>The puzzle list with WCA and Non-WCA tabs, the quick actions (+2, DNF, Delete, Details), and importing ZTimer solve lists.</td></tr>
  <tr><td><b>Cubic Timer</b> (hato-ya) and <b>Twisty Timer</b> (Ari Neto), GPL-3.0<br><a href="https://github.com/hato-ya/CubicTimer" target="_blank" rel="noopener">Cubic Timer</a> · <a href="https://github.com/aricneto/TwistyTimer" target="_blank" rel="noopener">Twisty Timer</a></td>
  <td>The ancestors of the ZTimer app. Only their solve-list text format is read here.</td></tr>
  <tr><td><b>This website</b></td><td>The page, styling and glue code (index.html, app.js) are original work by Zel.</td></tr></table>
  <p style="color:var(--dim);font-size:13px">Not made, endorsed or sponsored by csTimer, the World Cube Association or anyone else listed. "WCA" belongs to the World Cube Association. csTimer's name and logo are not used.</p>`);

function importText(t) {
  let n = 0;
  const grab = (v, make) => bucket(v, make);
  try {
    const j = JSON.parse(t);
    if (j && j.z === 2) j.sessions.forEach(s => { s.id = uid(); S.sessions.push(s); n += s.solves.length; });
    else if (Array.isArray(j)) j.forEach(v => { if (v && typeof v.ms === 'number' && v.puzzle) { grab(v, () => newSess(label(v.puzzle), v.puzzle)).solves.push({ ms: v.ms, pen: v.pen || 0, scr: v.scr || '', ts: v.ts || 0, note: '' }); n++; } });
    else { // csTimer export
      let meta = {}; try { meta = JSON.parse(j.properties.sessionData); } catch (e) {}
      Object.keys(j).filter(k => /^session\d+$/.test(k)).forEach(k => {
        const id = k.slice(7), m = meta[id] || {}, ty = (m.opt && m.opt.scrType) || '333';
        const s = newSess(m.name !== undefined ? String(m.name) : 'csTimer ' + id, !types.length || types.includes(ty) ? ty : '333');
        j[k].forEach(r => { const a = r[0]; s.solves.push({ ms: a[1], pen: a[0] < 0 ? 2 : a[0] > 0 ? 1 : 0, scr: r[1] || '', note: r[2] || '', ts: (r[3] || 0) * 1000 }); n++; });
      });
    }
  } catch (e) { // "time";"scramble";"date" lines
    const s = newSess('Imported', '333');
    t.split(/\r?\n/).forEach(l => {
      const m = l.match(/^"([^"]*)";"([^"]*)";"([^"]*)"/); if (!m) return;
      const str = m[1].trim(), plus = str.endsWith('+'), p = str.replace('+', '').split(':').map(Number);
      const ms = Math.round((p.length > 1 ? p[0] * 60 + p[1] : p[0]) * 1000);
      if (/^DNF/i.test(str)) s.solves.push({ ms: 0, pen: 2, scr: m[2], ts: Date.parse(m[3]) || 0, note: '' });
      else if (isFinite(ms)) s.solves.push({ ms: plus ? ms - 2000 : ms, pen: plus ? 1 : 0, scr: m[2], ts: Date.parse(m[3]) || 0, note: '' });
      else return;
      n++;
    });
    if (!s.solves.length) S.sessions.splice(S.sessions.indexOf(s), 1);
  }
  S.sessions.forEach(s => delete s._m);
  if (!S.sessions.length) newSess('Session 1', '333');
  save(); renderHead(); renderStats();
  alert(n ? `Imported ${n} solves.` : 'No solves were found in that file.');
}

// ---- actions ----
const touch = () => { save(); renderStats(); };
const quick = f => { const i = last(); if (i >= 0) f(cur().solves[i], i); };
const ACT = {
  prev: () => { if (hi > 0) { hi--; showScr(); } },
  next: nextScr,
  sessions: sessionsDlg, puzzles: puzzlesDlg, options: optionsDlg, export: exportDlg, credits: creditsDlg,
  q2: () => quick(s => { s.pen = s.pen === 1 ? 0 : 1; touch(); }),
  qd: () => quick(s => { s.pen = s.pen === 2 ? 0 : 2; touch(); }),
  qx: () => quick((s, i) => { cur().solves.splice(i, 1); touch(); }),
  qn: () => quick((s, i) => showSolve(i)),
  sv: d => showSolve(+d.i),
  pen: d => { const s = cur().solves[+d.i]; s.pen = s.pen === +d.p ? 0 : +d.p; touch(); showSolve(+d.i); },
  rm: d => { cur().solves.splice(+d.i, 1); touch(); $('#dlg').close(); },
  sw: d => { S.cur = d.id; save(); $('#dlg').close(); renderHead(); renderStats(); resetScr(); },
  newS: () => { const nm = prompt('Session name', 'Session ' + (S.sessions.length + 1)); if (nm) { S.cur = newSess(nm, cur().puzzle).id; save(); $('#dlg').close(); renderHead(); renderStats(); } },
  renS: () => { const nm = prompt('Rename session', cur().name); if (nm) { cur().name = nm; save(); renderHead(); sessionsDlg(); } },
  delS: () => {
    if (!confirm('Delete this session and all of its solves?')) return;
    S.sessions.splice(S.sessions.indexOf(cur()), 1);
    if (!S.sessions.length) newSess('Session 1', '333');
    S.cur = S.sessions[0].id; save(); $('#dlg').close(); renderHead(); renderStats(); resetScr();
  },
  tab: d => { tab = +d.t; puzzlesDlg(); },
  pick: d => { cur().puzzle = d.p; save(); $('#dlg').close(); renderHead(); resetScr(); },
  det: d => {
    const n = +d.n, r = series(cur().solves.map(val), n); if (!r) return;
    const end = d.w === 'c' ? r.ce : r.be, v = d.w === 'c' ? r.cur : r.best;
    if (n === 1) return showSolve(end - 1);
    const list = cur().solves.slice(end - n, end), name = NS.find(a => a[0] === n)[1], title = `${label(cur().puzzle)} ${name} (${d.w === 'c' ? 'current' : 'best'}): ${fmt(v)}`;
    window._copy = txt(list, title);
    open(`<h3>${title}</h3><pre>${esc(txt(list, ''))}</pre><div class="g"><button data-a="cp">Copy</button></div>`);
  },
  cp: () => copy(window._copy),
  save: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'ztimer-web-backup.json'; a.click(); },
  copyS: () => copy(txt(cur().solves, `Generated by ZTimer Web - ${cur().name} (${label(cur().puzzle)})`)),
  imp: () => $('#file').click(),
  clr: () => { if (confirm('Delete all solves in this session?')) { cur().solves = []; touch(); $('#dlg').close(); } }
};
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (el && ACT[el.dataset.a]) ACT[el.dataset.a](el.dataset); });
$('#dlg').addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.o) { O[t.dataset.o] = t.type === 'checkbox' ? t.checked : t.dataset.o === 'wait' ? +t.value : t.value; saveO(); }
  else if (t.dataset.note !== undefined) { cur().solves[+t.dataset.note].note = t.value; save(); }
});
$('#file').addEventListener('change', e => {
  const f = e.target.files[0]; e.target.value = '';
  if (f) f.text().then(importText).catch(() => alert('That file could not be read.'));
});

renderHead(); renderStats(); resetScr();
})();
