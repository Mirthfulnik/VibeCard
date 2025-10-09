import { initHeader } from './modules/header.js';
import { initNavigation } from './modules/navigation.js';
import { initSliders } from './modules/sliders.js';
import { initDemoViewer } from './modules/demo-viewer.js';
import { initFaq } from './modules/faq.js';
import { initModals } from './modules/modals.js';
import { initCookieConsent } from './modules/cookie-consent.js';
import { initRevealEffects } from './modules/reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  initHeader();
  initNavigation();
  initSliders({ motionQuery });
  initDemoViewer();
  initFaq({ motionQuery });
  initModals();
  initCookieConsent();
  initRevealEffects({ motionQuery });
});
