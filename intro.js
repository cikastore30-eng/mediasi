/* Intro Dragon - Mediaas: sinkron animasi (CSS) + suara (intro.mp3) + partikel (canvas) */
(function () {
  var root = document.getElementById('introFx');
  var de = document.documentElement;
  if (!root || !de.classList.contains('fx-on')) return;

  var TOTAL = 6000, IMPACT = 2889;
  var t0 = performance.now(), done = false, rafId = 0;
  var au = null, soundStarted = false;

  function now() { return performance.now() - t0; }

  /* ---------- selesai ---------- */
  function finish(fast) {
    if (done) return; done = true;
    cancelAnimationFrame(rafId);
    try { sessionStorage.setItem('fxSeen', '1'); } catch (e) {}
    if (fast) {
      root.classList.add('fx-gone');
      fadeAudio();
      setTimeout(cleanup, 480);
    } else {
      cleanup();
    }
  }
  function cleanup() {
    de.classList.remove('fx-on');
    if (root.parentNode) root.parentNode.removeChild(root);
    if (au) { try { au.pause(); } catch (e) {} au = null; }
    EVS.forEach(function (ev) { document.removeEventListener(ev, unlock, true); });
  }
  function fadeAudio() {
    if (!au) return;
    var a = au, v = a.volume, iv = setInterval(function () {
      v -= .12; if (v <= 0) { clearInterval(iv); try { a.pause(); } catch (e) {} } else { a.volume = v; }
    }, 40);
  }

  /* ---------- suara (otomatis, tanpa tombol) ---------- */
  function startAudio() {
    if (!au || soundStarted || done) return;
    var p;
    try { p = au.play(); } catch (e) { return; }
    var ok = function () {
      soundStarted = true;
      var el = now() / 1000;
      if (el > .35 && el < 5.9) { try { au.currentTime = el; } catch (e) {} }
    };
    if (p && p.then) p.then(ok, function () { soundStarted = false; }); else ok();
  }
  var EVS = ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown'];
  function unlock() { startAudio(); }
  try {
    au = new Audio('intro.mp3'); au.preload = 'auto'; au.volume = .9;
    startAudio();
    au.addEventListener('canplaythrough', startAudio);
    /* kalau browser memblokir, sentuhan/klik pertama di mana saja langsung menyalakan suara */
    EVS.forEach(function (ev) { document.addEventListener(ev, unlock, true); });
    var retry = setInterval(function () { if (soundStarted || done) clearInterval(retry); else startAudio(); }, 250);
  } catch (e) { au = null; }

  /* ---------- partikel ---------- */
  var cv = root.querySelector('canvas'), cx = cv.getContext('2d');
  var cols = ['#ffffff', '#bff0ff', '#9fe6ff', '#6ec6ff', '#3aaeff', '#e8fbff'];
  var W = 0, H = 0, dpr = 1, P = [], burst = false;
  var small = Math.min(window.innerWidth, window.innerHeight) < 600;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    W = root.clientWidth; H = root.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function spawnAmbient() {
    return { x: rnd(0, W), y: H + rnd(0, 40), vx: rnd(-.2, .2), vy: -rnd(.35, 1.3), s: rnd(1.5, 3.6), c: cols[(Math.random() * cols.length) | 0], a: rnd(.25, .7), life: 1, burst: false };
  }
  function doBurst() {
    var n = small ? 70 : 130, cxp = W / 2, cyp = H / 2;
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * 6.2832, sp = rnd(2, small ? 8 : 12);
      P.push({ x: cxp, y: cyp, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, s: rnd(2, 5), c: cols[(Math.random() * cols.length) | 0], a: 1, life: 1, burst: true });
    }
  }
  resize(); window.addEventListener('resize', resize);
  var amb = small ? 38 : 70;
  for (var i = 0; i < amb; i++) { var q = spawnAmbient(); q.y = rnd(0, H); P.push(q); }

  function frame() {
    var t = now();
    if (t >= TOTAL) { finish(false); return; }
    if (!burst && t >= IMPACT) { burst = true; doBurst(); }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    var boost = t > IMPACT ? 1.5 : 1;
    for (var k = P.length - 1; k >= 0; k--) {
      var p = P[k];
      p.x += p.vx * boost * (p.burst ? 1 : 1); p.y += p.vy * boost;
      if (p.burst) { p.vx *= .955; p.vy *= .955; p.life -= .016; p.a = Math.max(p.life, 0); if (p.life <= 0) { P.splice(k, 1); continue; } }
      else if (p.y < -10) { P[k] = spawnAmbient(); continue; }
      cx.globalAlpha = p.a; cx.fillStyle = p.c;
      cx.fillRect(p.x, p.y, p.s, p.s);
    }
    cx.globalAlpha = 1;
    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);

  /* jaga-jaga: pastikan overlay selalu hilang */
  setTimeout(function () { finish(false); }, TOTAL + 1500);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && au && soundStarted) { try { au.pause(); } catch (e) {} }
    else if (!document.hidden && au && soundStarted && !done) { try { au.currentTime = Math.min(now() / 1000, 5.9); au.play(); } catch (e) {} }
  });
})();
