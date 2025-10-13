const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
if (menuToggle){
  menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
}

const ctaHeader = document.getElementById('ctaHeader');
const ctaFooter = document.getElementById('ctaFooter');
const smoothScroll = (hash) => {
  const el = document.querySelector(hash);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
if (ctaHeader) ctaHeader.addEventListener('click', () => smoothScroll('#contacto'));
if (ctaFooter) ctaFooter.addEventListener('click', (e) => { e.preventDefault(); smoothScroll('#caracteristicas'); });

