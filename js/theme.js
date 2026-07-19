/* =========================================================
   theme.js — dark / light mode switcher (persisted)
   Exposes window.renderThemeLabel for language.js.
   ========================================================= */
(function () {
  'use strict';

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const themeIconMobile = document.getElementById('themeIconMobile');
  const themeLabelMobile = document.getElementById('themeLabelMobile');

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  function isAr() {
    return document.documentElement.dir === 'rtl';
  }

  // Keep icon + mobile label in sync with current theme + language.
  function renderThemeLabel() {
    const dark = isDark();
    const ar = isAr();
    if (themeIcon) themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    if (themeIconMobile) themeIconMobile.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    if (themeLabelMobile) {
      themeLabelMobile.textContent = dark
        ? (ar ? 'الوضع الفاتح' : 'Light mode')
        : (ar ? 'الوضع الداكن' : 'Dark mode');
    }
  }
  window.renderThemeLabel = renderThemeLabel;

  function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', theme); } catch (e) {}
    renderThemeLabel();
  }

  window.__themeReady = true;
  let currentTheme = 'light';
  try { currentTheme = localStorage.getItem('theme') || 'light'; } catch (e) {}
  applyTheme(currentTheme);

  function toggleTheme(e) {
    if (e) e.preventDefault();
    currentTheme = isDark() ? 'light' : 'dark';
    applyTheme(currentTheme);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  const mobileBtn = document.getElementById('themeToggleMobile');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', function (e) {
      toggleTheme(e);
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.remove('open');
    });
  }
})();
