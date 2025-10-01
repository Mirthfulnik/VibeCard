+26
-12

// Vibe Card Landing Page interactions

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Hero carousel
  const heroCarousel = document.querySelector('.hero__carousel');
  const heroSlides = heroCarousel ? Array.from(heroCarousel.querySelectorAll('.hero-slide')) : [];

  if (heroSlides.length) {
    let currentSlide = 0;
    const totalSlides = heroSlides.length;

    const getOffset = (index) => {
      let offset = index - currentSlide;
      if (offset > totalSlides / 2) {
        offset -= totalSlides;
      } else if (offset < -totalSlides / 2) {
        offset += totalSlides;
      }
      return offset;
    };

    const updateSlides = () => {
      heroSlides.forEach((slide, index) => {
        const offset = getOffset(index);
        slide.dataset.position = offset;
        slide.style.setProperty('--offset', offset);
        slide.setAttribute('aria-hidden', (offset !== 0).toString());
        slide.classList.toggle('is-active', offset === 0);
        slide.style.zIndex = String(totalSlides - Math.abs(offset));
      });
    };

    updateSlides();

    if (totalSlides > 1) {
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
          currentSlide = (currentSlide + 1) % totalSlides;
          updateSlides();
        }, 4000);
      };

      const handleMotionPreferenceChange = (event) => {
        if (event.matches) {
          stopCarousel();
          currentSlide = 0;
          updateSlides();
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
