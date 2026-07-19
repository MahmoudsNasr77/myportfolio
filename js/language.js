/* =========================================================
   language.js — EN / AR bilingual toggle with RTL support
   Persists choice; stashes English originals once.
   ========================================================= */
(function () {
  'use strict';

  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  const langLabelMobile = document.getElementById('langLabelMobile');
  const i18nNodes = document.querySelectorAll('[data-ar]');
  const phNodes = document.querySelectorAll('[data-ar-ph]');

  // Stash English originals once so we can toggle back losslessly.
  i18nNodes.forEach((n) => { n.dataset.en = n.innerHTML; });
  phNodes.forEach((n) => { n.dataset.enPh = n.getAttribute('placeholder') || ''; });

  function applyLang(lang) {
    const ar = lang === 'ar';
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    i18nNodes.forEach((n) => { n.innerHTML = ar ? n.dataset.ar : n.dataset.en; });
    phNodes.forEach((n) => n.setAttribute('placeholder', ar ? n.dataset.arPh : n.dataset.enPh));

    // Toggle label shows the OTHER language.
    const otherLabel = ar ? 'English' : 'العربية';
    if (langLabel) langLabel.textContent = otherLabel;
    if (langLabelMobile) langLabelMobile.textContent = otherLabel;

    if (window.__themeReady && typeof window.renderThemeLabel === 'function') {
      window.renderThemeLabel();
    }
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  // Always start in English; Arabic is opt-in per visit via the toggle.
  let current = 'en';
  applyLang(current);

  function toggleLang(e) {
    if (e) e.preventDefault();
    current = document.documentElement.dir === 'rtl' ? 'en' : 'ar';
    applyLang(current);
  }

  if (langToggle) langToggle.addEventListener('click', toggleLang);
  const mobileBtn = document.getElementById('langToggleMobile');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', function (e) {
      toggleLang(e);
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.remove('open');
    });
  }

  // Expose for other modules (e.g. contact status messages).
  window.isArabic = () => document.documentElement.dir === 'rtl';

  /* ----- Top hint toast: offer Arabic on first English visit ----- */
  function showLangToast() {
    if (document.documentElement.dir === 'rtl') return; // already Arabic

    const toast = document.createElement('div');
    toast.className = 'lang-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<i class="fas fa-globe globe"></i>' +
      '<span>You can switch this site to Arabic · يمكنك تغيير اللغة إلى العربية</span>' +
      '<button type="button" class="switch">العربية</button>' +
      '<button type="button" class="close" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    let hideTimer = setTimeout(dismiss, 8000);
    function dismiss() {
      clearTimeout(hideTimer);
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }
    toast.querySelector('.switch').addEventListener('click', () => {
      applyLang('ar');
      dismiss();
    });
    toast.querySelector('.close').addEventListener('click', dismiss);
  }
  showLangToast();
})();
