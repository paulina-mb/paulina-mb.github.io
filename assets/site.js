(function () {
  // ---- rotating highlights ----
  var hl = document.getElementById('hl');
  if (hl) {
    var ps = hl.querySelectorAll('.tx p');
    var cnt = hl.querySelector('.cnt');
    var bar = hl.querySelector('.bar i');
    var i = 0, timer = null;
    // reading time: 3s to find the text + about 0.33s per word (a calm pace), between 7 and 14 seconds
    var dur = function (el) { var w = el.textContent.trim().split(/\s+/).length; return Math.max(7000, Math.min(14000, 3000 + w * 330)); };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var runBar = function () {
      if (!bar) return;
      bar.classList.remove('run'); bar.style.transitionDuration = dur(ps[i]) + 'ms'; void bar.offsetWidth; bar.classList.add('run');
    };
    var show = function (n) {
      ps[i].classList.remove('on');
      i = (n + ps.length) % ps.length;
      ps[i].classList.add('on');
      if (cnt) cnt.textContent = (i + 1) + ' / ' + ps.length;
    };
    var stop = function () { if (timer) clearTimeout(timer); timer = null; if (bar) bar.classList.remove('run'); };
    var start = function () {
      stop(); if (reduce) return;
      runBar();
      timer = setTimeout(function () { show(i + 1); start(); }, dur(ps[i]));
    };
    hl.querySelector('.nx').addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); start(); });
    hl.querySelector('.pv').addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); start(); });
    hl.addEventListener('click', function () { show(i + 1); start(); });
    hl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); start(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); start(); }
    });
    hl.addEventListener('mouseenter', function () { stop(); });
    hl.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
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
