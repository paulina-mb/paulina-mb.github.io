(function () {
  // ---- rotating highlights ----
  var hl = document.getElementById('hl');
  if (hl) {
    var ps = hl.querySelectorAll('.tx p');
    var cnt = hl.querySelector('.cnt');
    var bar = hl.querySelector('.bar i');
    var i = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // reading time: 3s to find the text + about 0.33s per word (a calm pace), between 7 and 14 seconds
    var dur = function (el) { var w = el.textContent.trim().split(/\s+/).length; return Math.max(7000, Math.min(14000, 3000 + w * 330)); };
    var resetBar = function () {
      if (!bar) return;
      bar.style.transition = 'none'; bar.style.width = '0';
      void bar.offsetWidth;
    };
    var runBar = function (ms) {
      if (!bar) return;
      resetBar();
      bar.style.transition = 'width ' + ms + 'ms linear'; bar.style.width = '100%';
    };
    var show = function (n) {
      ps[i].classList.remove('on');
      i = (n + ps.length) % ps.length;
      ps[i].classList.add('on');
      if (cnt) cnt.textContent = (i + 1) + ' / ' + ps.length;
    };
    var stop = function () { if (timer) clearTimeout(timer); timer = null; resetBar(); };
    var start = function () {
      stop();
      if (reduce || document.hidden) return;
      var ms = dur(ps[i]);
      runBar(ms);
      timer = setTimeout(function () { show(i + 1); start(); }, ms);
    };
    var go = function (n) { show(n); start(); };
    hl.querySelector('.nx').addEventListener('click', function (e) { e.stopPropagation(); go(i + 1); });
    hl.querySelector('.pv').addEventListener('click', function (e) { e.stopPropagation(); go(i - 1); });
    hl.addEventListener('click', function () { go(i + 1); });
    hl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    });
    document.addEventListener('visibilitychange', start);
    start();
  }


  // ---- welcome line for people who scanned the card (QR adds ?c), then clean the address ----
  try {
    if (/[?&]c\b/.test(location.search)) {
      var wl = document.getElementById('welcome'); if (wl) wl.hidden = false;
      history.replaceState(null, '', location.pathname);
    }
  } catch (e) {}

  // ---- share ("escalate to your manager" from the card) ----
  var sh = document.querySelector('[data-share]');
  if (sh) {
    sh.addEventListener('click', async function () {
      var url = 'https://paulina-mb.github.io/';
      var data = { title: 'Paulina Madrigal Baeza | IT Service Delivery & Operations', text: 'Worth a look: Paulina Madrigal Baeza, IT Service Delivery & Operations in Toronto.', url: url };
      try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      try { await navigator.clipboard.writeText(url); sh.querySelector('span').textContent = 'Link copied'; setTimeout(function () { sh.querySelector('span').textContent = 'Share this page'; }, 2000); }
      catch (e) { window.prompt('Copy this link:', url); }
    });
  }

  // ---- message after CV download ----
  var modal = document.getElementById('cvmsg');
  var cv = document.querySelector('[data-cv]');
  if (modal && cv) {
    cv.addEventListener('click', function () {
      setTimeout(function () { modal.hidden = false; modal.querySelector('[data-close]').focus(); }, 600);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.hasAttribute('data-close')) modal.hidden = true;
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.hidden = true; });
  }

  // ---- email link assembled at runtime (keeps the address away from simple scrapers) ----
  var u = 'pauli.maba', h = 'gmail.com';
  var links = document.querySelectorAll('[data-mail]');
  for (var m = 0; m < links.length; m++) {
    links[m].setAttribute('href', 'mailto:' + u + '@' + h + '?subject=' + encodeURIComponent('Your CV, for a specific role'));
  }
})();
