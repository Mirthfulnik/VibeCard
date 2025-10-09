const focusableSelector = 'a[href], button:not([disabled]), [tabindex="0"]';

const setBodyScroll = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : '';
};

export const initNavigation = () => {
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = mobileMenu ? Array.from(mobileMenu.querySelectorAll('a')) : [];
  const desktopBreakpoint = window.matchMedia('(min-width: 1025px)');
  let focusTrapCleanup = null;

  if (!burger || !mobileMenu) {
    return;
  }

  const toggleMenu = (isOpen) => {
    burger.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    setBodyScroll(isOpen);

    if (isOpen) {
      focusTrapCleanup = trapFocus(mobileMenu);
    } else if (typeof focusTrapCleanup === 'function') {
      focusTrapCleanup();
      focusTrapCleanup = null;
    }
  };

  const closeMenu = () => toggleMenu(false);

  burger.addEventListener('click', () => {
    const willOpen = !burger.classList.contains('active');
    toggleMenu(willOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && burger.classList.contains('active')) {
      closeMenu();
    }
  });

  const handleBreakpointChange = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (typeof desktopBreakpoint.addEventListener === 'function') {
    desktopBreakpoint.addEventListener('change', handleBreakpointChange);
  } else if (typeof desktopBreakpoint.addListener === 'function') {
    desktopBreakpoint.addListener(handleBreakpointChange);
  }
};

const trapFocus = (element) => {
  const focusableElements = Array.from(element.querySelectorAll(focusableSelector));

  if (!focusableElements.length) {
    return () => {};
  }

  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  window.setTimeout(() => firstEl.focus(), 0);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};
