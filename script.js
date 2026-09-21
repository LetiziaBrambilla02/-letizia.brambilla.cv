const motion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#year').textContent = new Date().getFullYear();
const header = document.querySelector('header');
const progress = document.querySelector('.progress');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
let frame = false;
function updateScroll() {
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + (range > 0 ? scrollY / range : 0) + ')';
  header.classList.toggle('scrolled', scrollY > 25);
  if (!motion.matches) document.querySelectorAll('.parallax').forEach((image, index) => {
    const rect = image.closest('section, article').getBoundingClientRect();
    const shift = Math.max(-28, Math.min(28, (innerHeight / 2 - rect.top) * .035));
    image.style.translate = '0 ' + (shift * (index ? .7 : 1)) + 'px';
  });
  frame = false;
}
addEventListener('scroll', () => { if (!frame) { frame = true; requestAnimationFrame(updateScroll); } }, {passive:true});
updateScroll();
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.querySelector('span').textContent = '＋'; }
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('span').textContent = open ? '×' : '＋';
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menu.focus(); } });
matchMedia('(min-width:681px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('waiting'); reveal.unobserve(entry.target); }
  }), {threshold:.06});
  if (!motion.matches) document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('waiting'); reveal.observe(element);
  });
  const active = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) nav.querySelectorAll('a').forEach(link => {
      const current = link.hash === '#' + entry.target.id;
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
  }), {rootMargin:'-18% 0px -60% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => active.observe(section));
}
motion.addEventListener('change', event => { if (event.matches) {
  document.querySelectorAll('.waiting').forEach(element => element.classList.remove('waiting'));
  document.querySelectorAll('.parallax').forEach(image => image.style.translate = '');
}});
