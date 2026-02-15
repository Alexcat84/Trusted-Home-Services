(function () {
  'use strict';

  var LANG_STORAGE = 'trusted_lang';
  var DEFAULT_LANG = 'en';

  function getTranslation(lang, key) {
    var t = window.TRUSTED_I18N && window.TRUSTED_I18N[lang] ? window.TRUSTED_I18N[lang] : window.TRUSTED_I18N[DEFAULT_LANG];
    if (!t) return key;
    var parts = key.split('.');
    var cur = t;
    for (var i = 0; i < parts.length && cur != null; i++) cur = cur[parts[i]];
    return cur != null ? cur : key;
  }

  function applyLanguage(lang) {
    if (!window.TRUSTED_I18N || !window.TRUSTED_I18N[lang]) lang = DEFAULT_LANG;
    try { localStorage.setItem(LANG_STORAGE, lang); } catch (e) {}
    document.documentElement.lang = lang === 'es' ? 'es' : lang === 'fr' ? 'fr' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = getTranslation(lang, el.getAttribute('data-i18n'));
      if (typeof val === 'string') el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var val = getTranslation(lang, el.getAttribute('data-i18n-html'));
      if (typeof val === 'string') el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = getTranslation(lang, el.getAttribute('data-i18n-placeholder'));
      if (typeof val === 'string') el.placeholder = val;
    });

    document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
      var l = btn.getAttribute('data-lang');
      var active = l === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    var navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      var label = lang === 'es' ? 'Abrir menú' : lang === 'fr' ? 'Ouvrir le menu' : 'Open menu';
      navToggle.setAttribute('aria-label', label);
    }
  }

  // ----- Header: menú móvil -----
  var header = document.getElementById('header');
  var nav = header && header.querySelector('.nav');
  var toggle = header && header.querySelector('.nav-toggle');

  function openMenu() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
  }

  // Cerrar menú al hacer clic en un enlace (móvil)
  if (nav) {
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  // Cerrar menú al redimensionar a desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMenu();
  });

  // ----- Animaciones al hacer scroll -----
  var animated = document.querySelectorAll('[data-animate]');
  if (animated.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    animated.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ----- Modal servicios -----
  var serviceModal = document.getElementById('serviceModal');
  var serviceModalBackdrop = document.getElementById('serviceModalBackdrop');
  var serviceModalClose = document.getElementById('serviceModalClose');
  var serviceModalTitle = document.getElementById('serviceModalTitle');
  var serviceModalBody = document.getElementById('serviceModalBody');

  function openServiceModal(serviceKey) {
    if (!serviceModal || !window.TRUSTED_I18N) return;
    var lang = '';
    try { lang = localStorage.getItem(LANG_STORAGE) || DEFAULT_LANG; } catch (err) { lang = DEFAULT_LANG; }
    var t = window.TRUSTED_I18N[lang] && window.TRUSTED_I18N[lang].services ? window.TRUSTED_I18N[lang].services : window.TRUSTED_I18N[DEFAULT_LANG].services;
    var service = t[serviceKey];
    if (service && serviceModalTitle && serviceModalBody) {
      serviceModalTitle.textContent = service.title;
      serviceModalBody.textContent = service.text;
      serviceModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }
  function closeServiceModal() {
    if (serviceModal) {
      serviceModal.hidden = true;
      document.body.style.overflow = '';
    }
  }
  if (serviceModalBackdrop) serviceModalBackdrop.addEventListener('click', closeServiceModal);
  if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceModal);
  document.querySelectorAll('.service-card--clickable[data-service]').forEach(function (card) {
    card.addEventListener('click', function () { openServiceModal(card.getAttribute('data-service')); });
  });

  // ----- Cotización: wizard con lógica condicional (whole house vs part) -----
  var form = document.getElementById('quoteForm');
  var steps = form && form.querySelectorAll('.quote-step');
  var progressBar = document.querySelector('.quote-progress-bar');
  var stepDots = document.querySelectorAll('.quote-step-dot');
  var quoteProgress = document.querySelector('.quote-progress--dynamic');
  var quoteSuccess = document.getElementById('quoteSuccess');

  var currentStep = 1;

  function isWholeHouse() {
    var alcance = form && form.querySelector('input[name="alcance"]:checked');
    return alcance && alcance.value === 'toda-la-casa';
  }
  function getTotalSteps() {
    return isWholeHouse() ? 4 : 5;
  }
  function getStepIndex(stepNum) {
    if (isWholeHouse()) {
      if (stepNum <= 2) return stepNum - 1;
      if (stepNum === 4) return 2;
      if (stepNum === 5) return 3;
      return 0;
    }
    return stepNum - 1;
  }

  function goToStep(step) {
    if (!steps) return;
    var whole = isWholeHouse();
    var step3 = form && form.querySelector('.quote-step[data-step="3"]');
    if (step3) {
      step3.style.display = whole ? 'none' : '';
      step3.classList.toggle('active', !whole && step === 3);
    }
    steps.forEach(function (s) {
      if (parseInt(s.dataset.step, 10) === step) s.classList.add('active');
      else s.classList.remove('active');
    });
    currentStep = step;
    if (quoteProgress) quoteProgress.classList.toggle('quote-progress--whole', whole);
    var total = getTotalSteps();
    var idx = getStepIndex(step);
    if (progressBar) progressBar.style.width = (total > 1 ? (idx / (total - 1)) * 100 : 100) + '%';
    stepDots.forEach(function (dot) {
      var d = parseInt(dot.getAttribute('data-dot'), 10);
      dot.classList.remove('active', 'done');
      if (whole && d === 3) return;
      var dotStep = whole && d > 3 ? d - 1 : d;
      var currentIdx = getStepIndex(step);
      var dotIdx = whole && d > 2 ? d - 2 : d - 1;
      if (dotIdx === currentIdx) dot.classList.add('active');
      else if (dotIdx < currentIdx) dot.classList.add('done');
    });
  }

  if (form) {
    form.addEventListener('click', function (e) {
      var next = e.target.closest('.quote-next');
      var prev = e.target.closest('.quote-prev');
      if (next) {
        e.preventDefault();
        var n = parseInt(next.dataset.next, 10);
        if (n === 3 && isWholeHouse()) n = 4;
        if (n >= 1 && n <= 5) goToStep(n);
      }
      if (prev) {
        e.preventDefault();
        var p = parseInt(prev.dataset.prev, 10);
        if (p === 3 && isWholeHouse()) p = 2;
        if (p >= 1 && p <= 5) goToStep(p);
      }
    });
    form.addEventListener('change', function () {
      if (form.querySelector('input[name="alcance"]')) goToStep(currentStep);
    });

    // Mostrar detalle de cocina cuando se marca "Cocina" en paso 2
    var cocinaDetalle = document.getElementById('cocinaDetalle');
    var areaCheckboxes = form.querySelectorAll('input[name="areas"]');
    if (cocinaDetalle && areaCheckboxes.length) {
      function toggleCocinaDetalle() {
        var cocina = form.querySelector('input[name="areas"][value="cocina"]');
        cocinaDetalle.hidden = !cocina || !cocina.checked;
      }
      areaCheckboxes.forEach(function (cb) {
        cb.addEventListener('change', toggleCocinaDetalle);
      });
      toggleCocinaDetalle();
    }

    // Envío del formulario (sin backend: mostrar éxito + link WhatsApp con resumen)
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var parts = [];
      formData.forEach(function (val, key) {
        if (val && key !== 'nombre' && key !== 'email' && key !== 'telefono' && key !== 'mensaje') {
          parts.push(val);
        }
      });
      var intro = { en: 'Hi, I request a quote. ', fr: 'Bonjour, je demande un devis. ', es: 'Hola, solicito cotización. ' };
      var curLang = (function () { try { return localStorage.getItem(LANG_STORAGE) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; } })();
      var msg = (intro[curLang] || intro.en);
      if (parts.length) msg += (curLang === 'es' ? 'Interés: ' : curLang === 'fr' ? 'Intérêt: ' : 'Interest: ') + parts.join(', ') + '. ';
      msg += (curLang === 'es' ? 'Nombre: ' : curLang === 'fr' ? 'Nom: ' : 'Name: ') + (formData.get('nombre') || '') + '. ';
      if (formData.get('mensaje')) msg += (curLang === 'es' ? 'Mensaje: ' : curLang === 'fr' ? 'Message: ' : 'Message: ') + formData.get('mensaje');
      var whatsappUrl = 'https://wa.me/16132048000?text=' + encodeURIComponent(msg.trim());

      // En producción aquí enviarías los datos a tu backend o a Formspree/Netlify
      // fetch('/api/quote', { method: 'POST', body: formData });

      form.hidden = true;
      if (quoteSuccess) {
        quoteSuccess.hidden = false;
        var waLink = quoteSuccess.querySelector('.btn-whatsapp');
        if (waLink) waLink.href = whatsappUrl;
      }
    });
  }

  // Inicializar paso 1 y barra de progreso
  goToStep(1);

  // ----- Idioma: aplicar guardado o por defecto EN -----
  var savedLang = '';
  try { savedLang = localStorage.getItem(LANG_STORAGE) || ''; } catch (e) {}
  if (savedLang !== 'en' && savedLang !== 'fr' && savedLang !== 'es') savedLang = DEFAULT_LANG;
  applyLanguage(savedLang);

  document.querySelectorAll('.lang-switcher .lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var l = btn.getAttribute('data-lang');
      if (l) applyLanguage(l);
    });
  });
})();
