const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
let activeModal = null;
let previouslyFocused = null;
let focusTrapCleanup = null;

const toggleBodyScroll = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : '';
};

const trapFocus = (modal) => {
  const focusable = Array.from(modal.querySelectorAll(focusableSelector));

  if (!focusable.length) {
    return () => {};
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  modal.addEventListener('keydown', handleKeyDown);
  window.setTimeout(() => first.focus(), 0);

  return () => {
    modal.removeEventListener('keydown', handleKeyDown);
  };
};

const openModal = (modal) => {
  if (!modal || activeModal === modal) {
    return;
  }

  previouslyFocused = document.activeElement;
  modal.classList.remove('hidden');

  window.setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  toggleBodyScroll(true);
  activeModal = modal;
  focusTrapCleanup = trapFocus(modal);
};

const closeModal = (modal) => {
  if (!modal) {
    return;
  }

  modal.classList.remove('show');

  window.setTimeout(() => {
    modal.classList.add('hidden');
    if (!document.querySelector('.modal.show')) {
      toggleBodyScroll(false);
    }
  }, 180);

  if (typeof focusTrapCleanup === 'function') {
    focusTrapCleanup();
    focusTrapCleanup = null;
  }

  if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
    previouslyFocused.focus();
  }

  if (activeModal === modal) {
    activeModal = null;
  }
};

const bindModalControls = (modal) => {
  const closeButtons = modal.querySelectorAll('.modal__close, .modal-close-btn');
  const overlay = modal.querySelector('.modal__overlay');

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => closeModal(modal));
  });

  if (overlay) {
    overlay.addEventListener('click', () => closeModal(modal));
  }
};

const initTelegramModal = () => {
  const buttons = document.querySelectorAll('.telegram-btn');
  const modal = document.getElementById('telegram-modal');
  const link = document.getElementById('telegram-link');

  if (!buttons.length || !modal || !link) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const url = button.getAttribute('data-url');
      if (url) {
        link.href = url;
      } else {
        link.removeAttribute('href');
      }
      openModal(modal);
    });
  });
};

const initPrivacyModal = () => {
  const links = document.querySelectorAll('.privacy-link');
  const modal = document.getElementById('privacy-modal');

  if (!links.length || !modal) {
    return;
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(modal);
    });
  });
};

const initReviewModal = () => {
  const shots = document.querySelectorAll('.testimonial-shot');
  const modal = document.getElementById('review-modal');
  const modalImage = document.getElementById('review-modal-image');

  if (!shots.length || !modal || !modalImage) {
    return;
  }

  shots.forEach((shot) => {
    shot.addEventListener('click', () => {
      const imageSrc = shot.getAttribute('data-image');

      if (!imageSrc) {
        return;
      }

      const altText =
        shot.getAttribute('data-alt') ||
        shot.querySelector('img')?.getAttribute('alt') ||
        'Отзыв эксперта';

      shot.classList.remove('testimonial-shot--error');
      shot.removeAttribute('aria-label');

      const preloadImage = new Image();

      preloadImage.onload = () => {
        modalImage.src = imageSrc;
        modalImage.alt = `${altText} — полноразмерный скрин переписки`;
        openModal(modal);
      };

      preloadImage.onerror = () => {
        shot.classList.add('testimonial-shot--error');
        shot.setAttribute('aria-label', 'Не удалось загрузить изображение отзыва');
      };

      preloadImage.src = imageSrc;
    });
  });
};

export const initModals = () => {
  const modals = document.querySelectorAll('.modal');

  modals.forEach((modal) => bindModalControls(modal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });

  initTelegramModal();
  initPrivacyModal();
  initReviewModal();
};

export const hideActiveModal = () => {
  if (activeModal) {
    closeModal(activeModal);
  }
};
