(function () {
  // ---- rotating highlights ----
  var hl = document.getElementById('hl');
  if (hl) {
    var ps = hl.querySelectorAll('.tx p');
    var dotsBox = hl.querySelector('.dots');
    var dots = [];
    for (var d = 0; d < ps.length; d++) {
      var dot = document.createElement('i');
      if (d === 0) dot.className = 'on';
      dotsBox.appendChild(dot);
      dots.push(dot);
    }
    var i = 0, timer = null, DELAY = 5500;
    var show = function (n) {
      ps[i].classList.remove('on'); dots[i].classList.remove('on');
      i = (n + ps.length) % ps.length;
      ps[i].classList.add('on'); dots[i].classList.add('on');
    };
    var start = function () { stop(); timer = setInterval(function () { show(i + 1); }, DELAY); };
    var stop = function () { if (timer) clearInterval(timer); timer = null; };
    hl.setAttribute('tabindex', '0');
    hl.addEventListener('click', function () { show(i + 1); start(); });
    hl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i + 1); start(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); start(); }
    });
    hl.addEventListener('mouseenter', stop);
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
