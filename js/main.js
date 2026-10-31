/*
 * Interacciones del sitio: idioma (ES/EN), menú móvil, cabecera, enlace
 * activo del menú, animaciones de entrada, copiar el correo y el enlace a la
 * hoja de vida.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const STRINGS = window.I18N || { es: {}, en: {} };
  const STORAGE_KEY = 'lang';

  const header = document.querySelector('.site-header');
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.menu-btn');
  const langButtons = document.querySelectorAll('.lang-btn');
  const metaDescription = document.querySelector('meta[name="description"]');

  /* ---------- Idioma ---------- */

  const textEls = document.querySelectorAll('[data-i18n]');
  const attrEls = document.querySelectorAll('[data-i18n-attr]');

  // data-i18n-attr="aria-label:clave; title:otra-clave"
  const attrPairs = (el) =>
    el.dataset.i18nAttr
      .split(';')
      .map((pair) => pair.split(':').map((s) => s.trim()))
      .filter(([attr, key]) => attr && key);

  // El español está escrito en el HTML: se guarda al cargar para poder volver a él.
  const spanish = {
    ...STRINGS.es,
    'meta.title': document.title,
    'meta.description': metaDescription ? metaDescription.content : '',
  };
  textEls.forEach((el) => { spanish[el.dataset.i18n] = el.innerHTML; });
  attrEls.forEach((el) => attrPairs(el).forEach(([attr, key]) => { spanish[key] = el.getAttribute(attr); }));

  let lang = 'es';

  function t(key) {
    if (lang === 'en') {
      if (key in STRINGS.en) return STRINGS.en[key];
      console.warn(`[i18n] Falta la traducción al inglés de "${key}"`);
    }
    return spanish[key] ?? key;
  }

  function setLang(next, save = true) {
    lang = next === 'en' ? 'en' : 'es';
    root.lang = lang;
    textEls.forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    attrEls.forEach((el) => attrPairs(el).forEach(([attr, key]) => el.setAttribute(attr, t(key))));
    document.title = t('meta.title');
    if (metaDescription) metaDescription.content = t('meta.description');
    langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
    updateMenuLabel();
    if (save) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* almacenamiento bloqueado */ }
    }
  }

  // Prioridad: ?lang=en en la URL → preferencia guardada → español
  function initialLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'es' || fromUrl === 'en') return fromUrl;
    try { return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es'; } catch { return 'es'; }
  }

  langButtons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));

  /* ---------- Menú móvil ---------- */

  function updateMenuLabel() {
    if (!menuBtn) return;
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
  }

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
  }

  const menuIsOpen = () => Boolean(nav && nav.classList.contains('is-open'));

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => setMenu(!menuIsOpen()));
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', (e) => {
      if (menuIsOpen() && !header.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuIsOpen()) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    const desktop = window.matchMedia('(min-width: 860px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
    else if (desktop.addListener) desktop.addListener(closeOnDesktop);
  }

  /* ---------- Cabecera con fondo al hacer scroll ---------- */

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Enlace activo según la sección visible ---------- */

  const navLinks = [...document.querySelectorAll('.nav-list a[href^="#"]')];

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    // El hero también se observa: al volver arriba no queda ningún enlace activo
    [document.getElementById('inicio'), ...navLinks.map((a) => document.querySelector(a.hash))]
      .filter(Boolean)
      .forEach((section) => spy.observe(section));
  }

  /* ---------- Animaciones de entrada ---------- */

  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Copiar el correo ---------- */

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    if (!navigator.clipboard) {
      btn.hidden = true;
      return;
    }
    const label = btn.querySelector('[data-i18n]');
    let timer = 0;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        return;
      }
      btn.classList.add('is-done');
      label.textContent = t('contact.copied');
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove('is-done');
        label.innerHTML = t(label.dataset.i18n);
      }, 2000);
    });
  });

  /* ---------- Hoja de vida: el enlace aparece solo si existe /cv.pdf ---------- */

  const cvEls = document.querySelectorAll('[data-cv]');
  if (cvEls.length && location.protocol.startsWith('http')) {
    fetch('cv.pdf', { method: 'HEAD', cache: 'no-cache' })
      .then((res) => {
        const type = res.headers.get('content-type') || '';
        if (res.ok && type.includes('pdf')) cvEls.forEach((el) => { el.hidden = false; });
      })
      .catch(() => {});
  }

  /* ---------- Año del pie de página ---------- */

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Idioma inicial ---------- */

  const initial = initialLang();
  if (initial === 'en') setLang('en', false);
  else updateMenuLabel();
})();
