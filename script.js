(function () {
  var nav = document.getElementById('nav'), menu = document.getElementById('menu'), burger = document.getElementById('burger');
  addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 8) }, { passive: true });
  burger.addEventListener('click', function () { var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o) });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false') } });
  var links = [].slice.call(menu.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id) }) } }) }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s) });
  }
})();
