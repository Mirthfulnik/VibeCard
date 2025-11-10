(function() {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initHeader() {
    const header = $('.header');
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('header--scrolled');
      else header.classList.remove('header--scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initNavigation() {
    const burger = $('.header__burger');
    const mobileMenu = $('#mobile-menu');
    if (!burger || !mobileMenu) return;

    const links = $$('.mobile-menu__link', mobileMenu);

    function openMenu() {
      burger.classList.add('active');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('body--lock');
    }
    function closeMenu() {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('body--lock');
    }

    burger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMenu(); else openMenu();
    });

    links.forEach(a => a.addEventListener('click', closeMenu));

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  function initHeroSwiper() {
    if (typeof Swiper === 'undefined') return;
    const el = $('.hero__carousel');
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      speed: 600,
      pagination: {
        el: '.hero__pagination',
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 1.05, spaceBetween: 20 },
        1024: { slidesPerView: 1.2, spaceBetween: 24 }
      }
    });
  }

  function initDemoViewer() {
    const controls = $$('.demo__control');
    const card = $('.demo-card');
    if (!controls.length || !card) return;

    const titleEl = $('.demo-card__title', card);
    const metaEl = $('.demo-card__meta', card);
    const frame = $('.demo-preview__frame', card);
    const fallback = $('.demo-preview__fallback', card);
    const stage = $('.demo-preview__stage', card);
    const overlay = $('.demo-preview__overlay', card);

    function activate(btn) {
      controls.forEach(c => {
        c.classList.toggle('is-active', c === btn);
        c.setAttribute('aria-selected', c === btn ? 'true' : 'false');
        c.setAttribute('tabindex', c === btn ? '0' : '-1');
      });
      titleEl.textContent = btn.dataset.title || '';
      metaEl.textContent = btn.dataset.meta || '';
      const src = btn.dataset.site || '';
      const preview = btn.dataset.preview || '';
      const alt = btn.dataset.previewAlt || '';

      overlay.classList.remove('is-active');
      stage.classList.remove('is-loaded');
      fallback.style.opacity = '1';
      if (preview) {
        fallback.src = preview;
        fallback.alt = alt || 'Превью';
      }
      if (src) {
        frame.src = src;
      }
    }

    frame.addEventListener('load', () => {
      stage.classList.add('is-loaded');
    }, { passive: true });

    overlay.addEventListener('pointerdown', () => {
      overlay.classList.add('is-active');
    });

    controls.forEach(btn => btn.addEventListener('click', () => activate(btn)));
  }

  function initFaq() {
    $$('.faq__item').forEach(item => {
      const btn = $('.faq__question', item);
      const answer = $('.faq__answer', item);
      if (!btn || !answer) return;

      const expand = () => {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        const h = answer.scrollHeight + 'px';
        answer.style.height = h;
        answer.style.opacity = '1';
        // after transition, set to auto for proper resizing
        answer.addEventListener('transitionend', function handler() {
          answer.style.height = 'auto';
          answer.removeEventListener('transitionend', handler);
        });
      };
      const collapse = () => {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        const h = answer.scrollHeight + 'px';
        answer.style.height = h;
        requestAnimationFrame(() => {
          answer.style.height = '0px';
          answer.style.opacity = '0';
        });
      };

      btn.addEventListener('click', () => {
        if (item.classList.contains('is-open')) collapse();
        else expand();
      });
    });
  }

  function initModals() {
    // Telegram
    const tgButtons = $$('.telegram-btn');
    const tgModal = $('#telegram-modal');
    const tgLink = $('#telegram-link');
    const closeButtons = $$('.modal__close, .modal-close-btn');
    const overlays = $$('.modal__overlay');

    function openModal(modal) {
      if (!modal) return;
      modal.classList.remove('hidden');
      requestAnimationFrame(() => modal.classList.add('show'));
      document.body.classList.add('body--lock');
    }
    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('show');
      setTimeout(() => modal.classList.add('hidden'), 200);
      document.body.classList.remove('body--lock');
    }

    tgButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.dataset.url;
        if (tgLink && url) tgLink.href = url;
        openModal(tgModal);
      });
    });

    // Privacy link
    const privacyLinks = $$('.privacy-link');
    const privacyModal = $('#privacy-modal');
    privacyLinks.forEach(a => a.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    }));

    closeButtons.forEach(btn => btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    }));
    overlays.forEach(ov => ov.addEventListener('click', () => {
      const modal = ov.closest('.modal');
      closeModal(modal);
    }));

    // Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        $$('.modal.show').forEach(m => closeModal(m));
      }
    });
  }

  function initCookieConsent() {
    const bar = $('.cookie-consent');
    if (!bar) return;
    const key = 'vc_cookie_consent';
    if (localStorage.getItem(key)) return;
    setTimeout(() => bar.classList.add('cookie-consent--visible'), 800);

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      const value = btn.getAttribute('data-consent');
      localStorage.setItem(key, value);
      bar.classList.remove('cookie-consent--visible');
    });
  }

  function initRevealEffects() {
    const els = $$('.revealable');
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('revealed');
          io.unobserve(ent.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
  }

  window.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initNavigation();
    initHeroSwiper();
    initDemoViewer();
    initFaq();
    initModals();
    initCookieConsent();
    initRevealEffects();
  });
})();
