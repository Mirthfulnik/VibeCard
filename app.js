// Vibe Card Landing Page interactions

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Hero carousel
  const heroCarousel = document.querySelector('.hero__carousel');
  const heroSlides = heroCarousel ? heroCarousel.querySelectorAll('.hero__slide') : [];

  if (heroSlides.length) {
    let currentSlide = 0;

    const setActiveSlide = (index) => {
      heroSlides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === index;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', (!isActive).toString());
      });
    };

    setActiveSlide(currentSlide);

    if (heroSlides.length > 1) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let intervalId = null;

      const stopCarousel = () => {
        if (intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      };

      const startCarousel = () => {
        if (motionQuery.matches) {
          return;
        }

        stopCarousel();

        intervalId = window.setInterval(() => {
          currentSlide = (currentSlide + 1) % heroSlides.length;
          setActiveSlide(currentSlide);
        }, 4500);
      };

      const handleMotionPreferenceChange = (event) => {
        if (event.matches) {
          stopCarousel();
          currentSlide = 0;
          setActiveSlide(currentSlide);
        } else {
          startCarousel();
        }
      };

      if (!motionQuery.matches) {
        startCarousel();
      }

      if (heroCarousel) {
        heroCarousel.addEventListener('mouseenter', stopCarousel);
        heroCarousel.addEventListener('mouseleave', startCarousel);
        heroCarousel.addEventListener('focusin', stopCarousel);
        heroCarousel.addEventListener('focusout', startCarousel);
      }

      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionPreferenceChange);
      } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(handleMotionPreferenceChange);
      }
    }
  }

  // Mobile navigation
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      const expanded = burger.classList.contains('active');
      burger.setAttribute('aria-expanded', expanded);
      mobileMenu.setAttribute('aria-hidden', !expanded);
      body.style.overflow = expanded ? 'hidden' : '';
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
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewModal = document.getElementById('review-modal');
  const reviewImage = document.getElementById('review-modal-image');

  reviewCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imageSrc = card.getAttribute('data-image');
      if (reviewModal && reviewImage && imageSrc) {
        reviewImage.src = imageSrc;
        showModal(reviewModal);
      }
    });
  });

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
    '.value-card, .timeline__item, .pricing-card, .guarantee-card, .review-card, .results__cell, .stat'
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
