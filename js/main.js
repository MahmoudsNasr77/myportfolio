/* =========================================================
   main.js — navigation, scrollspy, scroll progress,
   back-to-top, mobile menu, visitor counter, contact spotlight
   Scroll work is batched through requestAnimationFrame.
   ========================================================= */
(function () {
  'use strict';

  /* ----- Mobile menu ----- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mnav').forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ----- Smooth scroll for in-page anchors ----- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ----- Scrollspy (notebook tabs) ----- */
  const tabLinks = document.querySelectorAll('.tab-link');
  const sections = [...tabLinks].map((l) => document.querySelector(l.getAttribute('href')));

  /* ----- Scroll progress + back-to-top ----- */
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    if (backTop) backTop.classList.toggle('show', y > 500);

    // active tab
    let idx = 0;
    const probe = y + 140;
    sections.forEach((s, i) => { if (s && s.offsetTop <= probe) idx = i; });
    tabLinks.forEach((l, i) => l.classList.toggle('active', i === idx));
  }

  // Throttle scroll with rAF.
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ----- Spotlight the Send button when Contact is in view ----- */
  const contactSection = document.getElementById('contact');
  if (contactSection && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => contactSection.classList.toggle('in-view', e.isIntersecting));
    }, { threshold: 0.35 }).observe(contactSection);
  }

  /* ----- Visitor counter (jsonbin) ----- */
  const BIN_ID = '692ef2ecae596e708f7ea663';
  const ACCESS_KEY = '$2a$10$fyovnGfoe0uPo.ciKue4vOUF3QeyLejPfADbFO/uvQUvofs9GU/Eq';
  const countEl = document.getElementById('visitor-count');

  async function updateVisitorCount() {
    if (!countEl) return;
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Access-Key': ACCESS_KEY },
      });
      const data = await res.json();
      const count = data.record.count + 1;
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Access-Key': ACCESS_KEY },
        body: JSON.stringify({ count }),
      });
      // count-up animation
      let c = 0;
      const t = setInterval(() => {
        c += Math.ceil(count / 40);
        if (c >= count) { c = count; clearInterval(t); }
        countEl.textContent = c;
      }, 40);
    } catch (e) {
      countEl.textContent = '—';
    }
  }
  updateVisitorCount();
})();
