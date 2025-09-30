// Vibe Card Landing Page interactions

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

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

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.header');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (hash.length > 1) {
        const target = document.querySelector(hash);
        if (target) {
          event.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((faq) => faq.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Demo iframe switching
  const demoButtons = document.querySelectorAll('.demo__btn');
  const demoIframe = document.getElementById('demo-iframe');

  demoButtons.forEach((button) => {
    button.addEventListener('click', () => {
      demoButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const site = button.getAttribute('data-site');
      if (demoIframe && site) {
        demoIframe.src = site;
      }
    });
  });

  // Telegram modal
  const telegramButtons = document.querySelectorAll('.telegram-btn');
  const telegramModal = document.getElementById('telegram-modal');
  const telegramLink = document.getElementById('telegram-link');

  telegramButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const url = button.getAttribute('data-url');
      if (telegramModal && telegramLink && url) {
        telegramLink.href = url;
        showModal(telegramModal);
      }
    });
  });

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
