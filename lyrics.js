(function () {
  const $ = s => document.querySelector(s);
  const LS = localStorage;
  const REDIRECT = location.origin + location.pathname;
  const SCOPE = 'user-read-currently-playing user-read-playback-state';
  let lines = [], cur = -2, trackId = null, prog = 0, at = 0, playing = false;
  let offset = parseInt(LS.getItem('ztimer.lyricOffset') || '0', 10);
  const status = t => { $('#lstatus').textContent = t || ''; };
  const show = (a, b, c, d) => { $('#l0').textContent = a || ''; $('#l1').textContent = b || ''; $('#l2').textContent = c || ''; $('#l3').textContent = d || ''; };

  const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const clientId = () => LS.getItem('ztimer.spotifyId');
  const stored = () => { try { return JSON.parse(LS.getItem('ztimer.sp')); } catch (e) { return null; } };

  async function login() {
    if (!clientId()) { $('#redir').textContent = REDIRECT; $('#cid').value = ''; $('#spDialog').showModal(); return; }
    const verifier = b64(crypto.getRandomValues(new Uint8Array(48)));
    LS.setItem('ztimer.verifier', verifier);
    const challenge = b64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    location.href = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
      client_id: clientId(), response_type: 'code', redirect_uri: REDIRECT, scope: SCOPE,
      code_challenge_method: 'S256', code_challenge: challenge
    });
  }

  async function token(params) {
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(Object.assign({ client_id: clientId() }, params))
    });
    if (!r.ok) throw new Error('token');
    const j = await r.json();
    const old = stored() || {};
    LS.setItem('ztimer.sp', JSON.stringify({ a: j.access_token, r: j.refresh_token || old.r, exp: Date.now() + j.expires_in * 1000 - 30000 }));
  }

  async function access() {
    let s = stored();
    if (!s) return null;
    if (Date.now() > s.exp) {
      try { await token({ grant_type: 'refresh_token', refresh_token: s.r }); s = stored(); }
      catch (e) { LS.removeItem('ztimer.sp'); return null; }
    }
    return s.a;
  }

  function parseLrc(text) {
    const out = [];
    text.split('\n').forEach(row => {
      const stamps = [...row.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
      const words = row.replace(/\[[^\]]*\]/g, '').trim();
      stamps.forEach(m => out.push({ t: (parseInt(m[1], 10) * 60 + parseFloat(m[2])) * 1000, s: words }));
    });
    return out.sort((a, b) => a.t - b.t);
  }

  async function getLyrics(item) {
    const q = { track_name: item.name, artist_name: item.artists[0].name, album_name: item.album.name, duration: Math.round(item.duration_ms / 1000) };
    try {
      let r = await fetch('https://lrclib.net/api/get?' + new URLSearchParams(q));
      if (r.ok) { const j = await r.json(); if (j.syncedLyrics) return parseLrc(j.syncedLyrics); }
      r = await fetch('https://lrclib.net/api/search?' + new URLSearchParams({ track_name: q.track_name, artist_name: q.artist_name }));
      if (r.ok) { const list = await r.json(); const hit = list.find(x => x.syncedLyrics); if (hit) return parseLrc(hit.syncedLyrics); }
    } catch (e) {}
    return [];
  }

  async function poll() {
    const tok = await access();
    if (!tok) { $('#spBtn').textContent = 'Connect Spotify'; return; }
    $('#spBtn').textContent = 'Spotify connected (disconnect)';
    try {
      const r = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: 'Bearer ' + tok } });
      if (r.status === 204) { playing = false; trackId = null; lines = []; show('', 'Nothing playing on Spotify', ''); return; }
      if (r.status === 401) { LS.removeItem('ztimer.sp'); return; }
      if (!r.ok) return;
      const j = await r.json();
      if (!j.item || j.item.type !== 'track') { show('', 'Not a music track', ''); return; }
      prog = j.progress_ms; at = performance.now(); playing = j.is_playing;
      if (j.item.id !== trackId) {
        trackId = j.item.id; lines = []; cur = -2;
        show('', j.item.name + ' - ' + j.item.artists[0].name, '');
        status('Finding synced lyrics…');
        const id = trackId, found = await getLyrics(j.item);
        if (id === trackId) { lines = found; status(found.length ? '' : 'No synced lyrics found for this song.'); }
      }
    } catch (e) {}
  }

  function render() {
    if (lines.length) {
      const pos = prog + (playing ? performance.now() - at : 0) + offset;
      let i = -1;
      while (i + 1 < lines.length && lines[i + 1].t <= pos) i++;
      if (i !== cur) {
        cur = i;
        const g = k => (lines[k] ? lines[k].s : '');
        show(g(i - 1), i < 0 ? '…' : g(i) || '♪', g(i + 1), g(i + 2));
      }
    }
    requestAnimationFrame(render);
  }

  $('#spBtn').onclick = () => {
    if (stored()) { LS.removeItem('ztimer.sp'); trackId = null; lines = []; show('', 'Lyrics from Spotify will show here', ''); status(''); $('#spBtn').textContent = 'Connect Spotify'; }
    else login();
  };
  $('#spDialog').addEventListener('close', () => {
    const d = $('#spDialog');
    if (d.returnValue === 'ok' && $('#cid').value.trim()) { LS.setItem('ztimer.spotifyId', $('#cid').value.trim()); login(); }
  });
  $('#offM').onclick = () => { offset += 250; LS.setItem('ztimer.lyricOffset', offset); status('Lyric offset: ' + offset + ' ms'); };
  $('#offP').onclick = () => { offset -= 250; LS.setItem('ztimer.lyricOffset', offset); status('Lyric offset: ' + offset + ' ms'); };

  async function boot() {
    const code = new URLSearchParams(location.search).get('code');
    if (code && clientId()) {
      try { await token({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT, code_verifier: LS.getItem('ztimer.verifier') }); }
      catch (e) { status('Spotify login failed. Check the Client ID and Redirect URI.'); }
      history.replaceState(null, '', location.pathname);
    }
    poll();
    setInterval(poll, 5000);
    render();
  }
  boot();
})();
