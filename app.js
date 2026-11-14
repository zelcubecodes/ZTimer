(function () {
  const $ = s => document.querySelector(s);
  const PUZ = [['3x3','333'],['2x2','222so'],['4x4','444wca'],['5x5','555wca'],['6x6','666wca'],['7x7','777wca'],
    ['Clock','clkwca'],['Megaminx','mgmp'],['Pyraminx','pyrso'],['Skewb','skbso'],['Square-1','sqrs'],
    ['3x3 BLD','333ni'],['3x3 FMC','333fm']];
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  let solves = load('ztimer.solves', []);
  let puzzle = localStorage.getItem('ztimer.puzzle') || '333';
  let scramble = '', state = 'idle', t0 = 0, raf = 0, holdTimer = 0;
  const save = () => localStorage.setItem('ztimer.solves', JSON.stringify(solves));

  const val = s => s.pen === 2 ? Infinity : s.ms + (s.pen === 1 ? 2000 : 0);
  const fmt = v => {
    if (v === Infinity) return 'DNF';
    const s = v / 1000;
    if (s >= 60) { const m = Math.floor(s / 60); return m + ':' + (s - m * 60).toFixed(2).padStart(5, '0'); }
    return s.toFixed(2);
  };
  const fmtSolve = s => s.pen === 2 ? 'DNF' : fmt(s.ms + (s.pen === 1 ? 2000 : 0)) + (s.pen === 1 ? '+' : '');
  const mine = () => solves.filter(s => s.puzzle === puzzle);

  function avg(list, n) {
    if (list.length < n) return null;
    const v = list.slice(-n).map(val).sort((a, b) => a - b);
    const trim = Math.ceil(n * 0.05);
    const mid = v.slice(trim, n - trim);
    if (mid.includes(Infinity)) return Infinity;
    return mid.reduce((a, b) => a + b, 0) / mid.length;
  }

  function renderStats() {
    const l = mine(), ok = l.map(val).filter(isFinite);
    const best = ok.length ? Math.min(...ok) : null;
    const mean = ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null;
    const cell = (name, v) => '<div><b>' + (v === null ? '-' : fmt(v)) + '</b><span>' + name + '</span></div>';
    $('#stats').innerHTML = cell('Best', best) + cell('Ao5', avg(l, 5)) + cell('Ao12', avg(l, 12)) +
      cell('Ao100', avg(l, 100)) + cell('Mean', mean) + '<div><b>' + l.length + '</b><span>Solves</span></div>';
    $('#list').innerHTML = l.slice(-50).reverse().map((s, i) =>
      '<div><span>' + (l.length - i) + '.</span><span>' + fmtSolve(s) + '</span></div>').join('');
  }

  function newScramble() {
    try {
      scramble = cstimerModule.getScramble(puzzle, 0);
    } catch (e) { scramble = 'Could not generate a scramble for this puzzle.'; }
    $('#scramble').textContent = scramble;
    $('#img').innerHTML = '';
    setTimeout(() => {
      try {
        const svg = cstimerModule.getImage(scramble, puzzle);
        if (typeof svg === 'string' && svg.indexOf('<svg') >= 0) $('#img').innerHTML = svg;
      } catch (e) {}
    }, 0);
  }

  function tick() {
    $('#time').textContent = fmt(performance.now() - t0);
    raf = requestAnimationFrame(tick);
  }
  function start() { state = 'running'; t0 = performance.now(); $('#time').className = ''; $('#hint').style.visibility = 'hidden'; tick(); }
  function stop() {
    cancelAnimationFrame(raf);
    const ms = performance.now() - t0;
    state = 'idle';
    solves.push({ ms: Math.round(ms), pen: 0, puzzle, scr: scramble, ts: Date.now() });
    save();
    $('#time').textContent = fmt(ms);
    $('#hint').style.visibility = 'visible';
    renderStats();
    newScramble();
  }
  function press() {
    if (state === 'running') { stop(); return; }
    if (state !== 'idle') return;
    state = 'hold';
    $('#time').className = 'hold';
    holdTimer = setTimeout(() => { if (state === 'hold') { state = 'ready'; $('#time').className = 'ready'; } }, 300);
  }
  function release() {
    clearTimeout(holdTimer);
    if (state === 'ready') start();
    else if (state === 'hold') { state = 'idle'; $('#time').className = ''; }
  }

  const typing = e => /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target.tagName) && e.code === 'Space';
  addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) press(); }
    else if (state === 'running') stop();
  });
  addEventListener('keyup', e => { if (e.code === 'Space' && !typing(e)) release(); });
  $('#timer').addEventListener('pointerdown', e => { e.preventDefault(); press(); });
  addEventListener('pointerup', () => { if (state === 'hold' || state === 'ready') release(); });

  function lastOfPuzzle() { const l = mine(); return l[l.length - 1]; }
  $('#plus2').onclick = () => { const s = lastOfPuzzle(); if (s) { s.pen = s.pen === 1 ? 0 : 1; save(); renderStats(); } };
  $('#dnf').onclick = () => { const s = lastOfPuzzle(); if (s) { s.pen = s.pen === 2 ? 0 : 2; save(); renderStats(); } };
  $('#del').onclick = () => { const s = lastOfPuzzle(); if (s) { solves.splice(solves.lastIndexOf(s), 1); save(); renderStats(); } };
  $('#clr').onclick = () => { if (confirm('Delete all solves for this puzzle?')) { solves = solves.filter(s => s.puzzle !== puzzle); save(); renderStats(); } };
  $('#newScr').onclick = newScramble;

  $('#exp').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(solves)], { type: 'application/json' }));
    a.download = 'ztimer-solves.json';
    a.click();
  };
  $('#imp').onclick = () => $('#file').click();
  $('#file').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then(t => {
      const data = JSON.parse(t);
      if (Array.isArray(data)) { solves = solves.concat(data.filter(s => s && typeof s.ms === 'number' && s.puzzle)); save(); renderStats(); }
    }).catch(() => alert('That file could not be imported.'));
    e.target.value = '';
  };

  const sel = $('#puzzle');
  let known = [];
  try { known = cstimerModule.getScrambleTypes ? cstimerModule.getScrambleTypes() : []; } catch (e) {}
  PUZ.filter(p => !known.length || known.indexOf(p[1]) >= 0).forEach(p => {
    const o = document.createElement('option'); o.value = p[1]; o.textContent = p[0]; sel.appendChild(o);
  });
  if (![...sel.options].some(o => o.value === puzzle) && sel.options.length) puzzle = sel.options[0].value;
  sel.value = puzzle;
  sel.onchange = () => { puzzle = sel.value; localStorage.setItem('ztimer.puzzle', puzzle); renderStats(); newScramble(); };

  renderStats();
  newScramble();
})();
