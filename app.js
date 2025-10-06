// Vibe Card Landing Page interactions

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Hero carousel
  const heroCarousel = document.querySelector('.hero__carousel');

  if (heroCarousel && typeof Swiper !== 'undefined') {
    const paginationEl = heroCarousel.querySelector('.hero__pagination');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const heroSwiper = new Swiper(heroCarousel, {
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
      grabCursor: true,
      effect: 'coverflow',
      speed: 800,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 160,
        modifier: 0.9,
        slideShadows: false,
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
          }
        : undefined,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          coverflowEffect: {
            depth: 120,
          },
        },
        768: {
          coverflowEffect: {
            depth: 160,
          },
        },
      },
    });

    const stopAutoplay = () => {
      if (heroSwiper.autoplay) {
        heroSwiper.autoplay.stop();
      }
    };

    const startAutoplay = () => {
      if (heroSwiper.autoplay) {
        heroSwiper.autoplay.start();
      }
    };

    if (motionQuery.matches) {
      stopAutoplay();
    } else {
      startAutoplay();
    }

    const handleMotionPreferenceChange = (event) => {
      if (event.matches) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };

    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(handleMotionPreferenceChange);
    }

    if (heroSwiper.autoplay) {
      const handleMouseEnter = () => stopAutoplay();
      const handleMouseLeave = () => {
        if (!motionQuery.matches) {
          startAutoplay();
        }
      };

      heroCarousel.addEventListener('mouseenter', handleMouseEnter);
      heroCarousel.addEventListener('mouseleave', handleMouseLeave);
      heroCarousel.addEventListener('focusin', handleMouseEnter);
      heroCarousel.addEventListener('focusout', handleMouseLeave);
    }
  }

  // Value slider (mobile only)
  const valueSliderEl = document.querySelector('.value__slider');

  if (valueSliderEl && typeof Swiper !== 'undefined') {
    const paginationEl = valueSliderEl.querySelector('.value__pagination');
    const mobileBreakpoint = window.matchMedia('(max-width: 768px)');
    let valueSwiper;

    const initValueSwiper = () => {
      if (valueSwiper) return;
      valueSwiper = new Swiper(valueSliderEl, {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 18,
        watchOverflow: true,
        pagination: paginationEl
          ? {
              el: paginationEl,
              clickable: true,
            }
          : undefined,
        breakpoints: {
          0: {
            spaceBetween: 16,
          },
          480: {
            spaceBetween: 20,
          },
        },
      });
    };

    const destroyValueSwiper = () => {
      if (!valueSwiper) return;
      valueSwiper.destroy(true, true);
      valueSwiper = null;
      if (typeof valueSliderEl.scrollTo === 'function') {
        valueSliderEl.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        valueSliderEl.scrollLeft = 0;
      }
    };

    const handleValueSlider = (event) => {
      if (event.matches) {
        initValueSwiper();
      } else {
        destroyValueSwiper();
      }
    };

    handleValueSlider(mobileBreakpoint);

    if (typeof mobileBreakpoint.addEventListener === 'function') {
      mobileBreakpoint.addEventListener('change', handleValueSlider);
    } else if (typeof mobileBreakpoint.addListener === 'function') {
      mobileBreakpoint.addListener(handleValueSlider);
    }
  }

  // Demo preview controls
  const demoViewerEl = document.querySelector('.demo__viewer');

  if (demoViewerEl) {
    const controls = Array.from(demoViewerEl.querySelectorAll('.demo__control'));
    const frame = demoViewerEl.querySelector('.demo-preview__frame');
    const overlay = demoViewerEl.querySelector('.demo-preview__overlay');
    const hintEl = demoViewerEl.querySelector('.demo-preview__hint');
    const titleEl = demoViewerEl.querySelector('.demo-card__title');
    const metaEl = demoViewerEl.querySelector('.demo-card__meta');
    const panelEl = demoViewerEl.querySelector('.demo-card');
    let interactionLocked = true;

    const applyInteractionConstraints = (target) => {
      if (!target) return;

      target.style.touchAction = 'pan-y';
      target.style.overscrollBehavior = 'contain';
    };

    applyInteractionConstraints(frame);
    applyInteractionConstraints(overlay);

    const disableInteraction = () => {
      if (!overlay || interactionLocked) return;
      interactionLocked = true;
      overlay.classList.remove('is-interacting');
      applyInteractionConstraints(overlay);
    };

    const enableInteraction = () => {
      if (!overlay || !interactionLocked) return;
      interactionLocked = false;
      overlay.classList.add('is-interacting');
      applyInteractionConstraints(frame);
    };

    if (overlay) {
      let lastTouchY = null;

      const tryScrollFrame = (deltaY) => {
        if (!frame || typeof deltaY !== 'number' || Number.isNaN(deltaY)) {
          return false;
        }

        try {
          const frameWindow = frame.contentWindow;

          if (!frameWindow || typeof frameWindow.scrollBy !== 'function') {
            return false;
          }

          const documentElement = frameWindow.document?.documentElement;
          const body = frameWindow.document?.body;
          const startY =
            frameWindow.scrollY ??
            frameWindow.pageYOffset ??
            documentElement?.scrollTop ??
            body?.scrollTop ??
            0;

          frameWindow.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });

          const endY =
            frameWindow.scrollY ??
            frameWindow.pageYOffset ??
            documentElement?.scrollTop ??
            body?.scrollTop ??
            0;

          const difference = Math.abs(endY - startY);

          return difference > Number.EPSILON;
        } catch (error) {
          return false;
        }
      };

      const resetTouchTracking = () => {
        lastTouchY = null;
      };

      overlay.addEventListener(
        'wheel',
        (event) => {
          if (interactionLocked) {
            enableInteraction();
          }

          const delegated = tryScrollFrame(event.deltaY);

          if (delegated) {
            event.preventDefault();
          }
        },
        { passive: false }
      );

      overlay.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse') {
          event.preventDefault();
        }
        enableInteraction();
      });

      overlay.addEventListener(
        'touchstart',
        (event) => {
          if (event.touches.length) {
            lastTouchY = event.touches[0].clientY;
          }
          enableInteraction();
        },
        { passive: true }
      );

      overlay.addEventListener(
        'touchmove',
        (event) => {
          if (interactionLocked) {
            enableInteraction();
          }

          if (!event.touches.length) {
            return;
          }

          const currentY = event.touches[0].clientY;

          if (lastTouchY === null) {
            lastTouchY = currentY;
            return;
          }

          const deltaY = lastTouchY - currentY;
          lastTouchY = currentY;

          const delegated = tryScrollFrame(deltaY);

          if (delegated) {
            event.preventDefault();
          }
        },
        { passive: false }
      );

      overlay.addEventListener(
        'touchend',
        () => {
          resetTouchTracking();
          enableInteraction();
        },
        { passive: true }
      );

      overlay.addEventListener(
        'touchcancel',
        () => {
          resetTouchTracking();
        },
        { passive: true }
      );
    }

    const getActiveControl = () => controls.find((button) => button.classList.contains('is-active'));

    const enforceSameHost = () => {
      const activeControl = getActiveControl();
      if (!frame || !activeControl) return;
      const site = activeControl.getAttribute('data-site');
      if (!site) return;
      try {
        const expectedHost = new URL(site).host;
        const currentHost = new URL(frame.src).host;
        if (currentHost && currentHost !== expectedHost) {
          frame.src = site;
        }
      } catch (error) {
        frame.src = site;
      }
    };

    const setActiveControl = (button) => {
      if (!button || !frame || !titleEl || !metaEl) return;
      controls.forEach((control) => {
        const isActive = control === button;
        control.classList.toggle('is-active', isActive);
        control.setAttribute('aria-selected', isActive ? 'true' : 'false');
        control.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      if (panelEl && button.id) {
        panelEl.setAttribute('aria-labelledby', button.id);
      }

      const site = button.getAttribute('data-site');
      const title = button.getAttribute('data-title');
      const meta = button.getAttribute('data-meta');
      const hint = button.getAttribute('data-hint');

      if (title) {
        titleEl.textContent = title;
        frame.setAttribute('title', `Визитка ${title}`);
      }

      if (meta) {
        metaEl.textContent = meta;
      }

      if (hint && hintEl) {
        hintEl.textContent = hint;
      }

      if (site && frame.src !== site) {
        frame.src = site;
      }

      disableInteraction();
    };

    controls.forEach((button) => {
      button.addEventListener('click', () => {
        setActiveControl(button);
      });
    });

    if (frame) {
      frame.addEventListener('load', enforceSameHost);
    }

    const initialControl = getActiveControl() || controls[0];
    if (initialControl) {
      if (!initialControl.hasAttribute('tabindex')) {
        initialControl.setAttribute('tabindex', '0');
      }
      setActiveControl(initialControl);
    }
  }

  // Mobile navigation
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isActive = burger.classList.toggle('active');
      mobileMenu.classList.toggle('open', isActive);
      burger.setAttribute('aria-expanded', String(isActive));
      mobileMenu.setAttribute('aria-hidden', String(!isActive));
      body.style.overflow = isActive ? 'hidden' : '';
 });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        mobileMenu.setAttribute('aria-hidden', true);
        body.style.overflow = '';
      });
    });
  }

  // Privacy modal
  const privacyLink = document.querySelector('.privacy-link');
  const privacyModal = document.getElementById('privacy-modal');

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener('click', (event) => {
      event.preventDefault();
      showModal(privacyModal);
    });
  }

  // Review gallery modal
  const testimonialShots = document.querySelectorAll('.testimonial-shot');
  const reviewModal = document.getElementById('review-modal');
  const reviewImage = document.getElementById('review-modal-image');

  testimonialShots.forEach((card) => {
    card.addEventListener('click', () => {
      const imageSrc = card.getAttribute('data-image');

      if (!reviewModal || !reviewImage || !imageSrc) {
        return;
      }

      const altText =
        card.getAttribute('data-alt') ||
        card.querySelector('img')?.getAttribute('alt') ||
        'Отзыв эксперта';

      card.classList.remove('testimonial-shot--error');
      card.removeAttribute('aria-label');

      const preloadImage = new Image();
      preloadImage.onload = () => {
        reviewImage.src = imageSrc;
        reviewImage.alt = `${altText} — полноразмерный скрин переписки`;
        showModal(reviewModal);
      };

      preloadImage.onerror = () => {
        card.classList.add('testimonial-shot--error');
        card.setAttribute('aria-label', 'Не удалось загрузить изображение отзыва');
      };

      preloadImage.src = imageSrc;
    });
  });

  // Chat conversation animation
  const chatEl = document.querySelector('.chat');

  if (chatEl) {
    const chatMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let chatActivated = false;
    let chatObserver;

    const setChatState = () => {
      if (!chatActivated) return;

      if (chatMotionQuery.matches) {
        chatEl.classList.add('chat--reduced');
        chatEl.classList.remove('chat--active');
      } else {
        chatEl.classList.remove('chat--reduced');
        chatEl.classList.remove('chat--active');
        void chatEl.offsetWidth;
        chatEl.classList.add('chat--active');
      }
    };


@@ -536,45 +558,45 @@ const handleMouseEnter = () => stopAutoplay();
    if (overlay) {
      overlay.addEventListener('click', () => hideModal(modal));
    }
  });

  function showModal(modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    body.style.overflow = 'hidden';
  }

  function hideModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (!document.querySelector('.modal.show')) {
        body.style.overflow = '';
      }
    }, 200);
  }

  // Reveal on scroll
  const revealElements = document.querySelectorAll(
    '.value-card, .timeline__item, .pricing-card, .guarantee-card, .testimonial-shot, .stat'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => {
    el.classList.add('revealable');
    observer.observe(el);
  });
});
    } else {
      createChatObserver();
    }

    const handleChatMotionChange = (event) => {
      if (event.matches) {
        activateChat();
        if (chatObserver) {
          chatObserver.disconnect();
          chatObserver = null;
        }
      } else if (chatActivated) {
        setChatState();
      } else {
        createChatObserver();
      }
    };

    if (typeof chatMotionQuery.addEventListener === 'function') {
      chatMotionQuery.addEventListener('change', handleChatMotionChange);
    } else if (typeof chatMotionQuery.addListener === 'function') {
      chatMotionQuery.addListener(handleChatMotionChange);
    }
  }

  const modals = document.querySelectorAll('.modal');

  modals.forEach((modal) => {
    const closeButtons = modal.querySelectorAll('.modal__close, .modal-close-btn');
    const overlay = modal.querySelector('.modal__overlay');

    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', () => hideModal(modal));
    });

    if (overlay) {
      overlay.addEventListener('click', () => hideModal(modal));
    }
  });

  function showModal(modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    body.style.overflow = 'hidden';
  }

  function hideModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (!document.querySelector('.modal.show')) {
        body.style.overflow = '';
      }
    }, 200);
  }

  // Reveal on scroll
  const revealElements = document.querySelectorAll(
    '.value-card, .timeline__item, .pricing-card, .guarantee-card, .testimonial-shot, .stat'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => {
    el.classList.add('revealable');
    observer.observe(el);
  });
});
