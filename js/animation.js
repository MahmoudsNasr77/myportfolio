/* =========================================================
   animation.js — scroll reveal, animated counters, typing
   Uses IntersectionObserver + requestAnimationFrame.
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Scroll reveal ----- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target); // reveal once — fewer callbacks
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ----- Animated counters ----- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1400;
    let startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => countObs.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ----- Typing animation (hero) ----- */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = {
      en: ['Odoo ERP Developer', 'REST API Engineer', 'Python Backend', 'Backend Systems'],
      ar: ['مطوّر أنظمة أودو', 'مهندس واجهات API', 'واجهة خلفية بايثون', 'أنظمة الواجهة الخلفية'],
    };
    const lang = () => (window.isArabic && window.isArabic() ? 'ar' : 'en');

    if (reduceMotion) {
      typedEl.textContent = phrases[lang()][0];
    } else {
      let pi = 0, ci = 0, deleting = false;
      function tick() {
        const list = phrases[lang()];
        const word = list[pi % list.length];
        ci += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, ci);
        let delay = deleting ? 45 : 90;
        if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi++; delay = 350; }
        setTimeout(tick, delay);
      }
      tick();
    }
  }
})();