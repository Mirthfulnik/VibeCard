const STORAGE_KEY = 'cookie-consent-selection';

const readStoredConsent = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[cookie-consent] Failed to read stored consent', error);
    return null;
  }
};

const storeConsent = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch (error) {
    console.warn('[cookie-consent] Failed to store consent', error);
  }
};

const toggleBannerVisibility = (banner, isVisible) => {
  if (!banner) {
    return;
  }

  banner.classList.toggle('cookie-consent--visible', isVisible);
  banner.setAttribute('aria-hidden', String(!isVisible));
};

const attachConsentHandlers = (banner, buttons) => {
  const handleConsent = (value) => {
    storeConsent(value);
    toggleBannerVisibility(banner, false);
  };

  buttons.forEach((button) => {
    const { consent } = button.dataset;

    if (!consent) {
      return;
    }

    button.addEventListener('click', () => handleConsent(consent));
  });
};

export const initCookieConsent = () => {
  const banner = document.querySelector('.cookie-consent');

  if (!banner) {
    return;
  }

  const storedConsent = readStoredConsent();

  if (storedConsent) {
    toggleBannerVisibility(banner, false);
    return;
  }

  const buttons = Array.from(banner.querySelectorAll('[data-consent]'));

  if (!buttons.length) {
    return;
  }

  toggleBannerVisibility(banner, true);
  attachConsentHandlers(banner, buttons);
};
