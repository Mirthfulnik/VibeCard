const updateHeaderHeight = (header) => {
  if (!header) {
    return;
  }

  const { offsetHeight } = header;

  if (Number.isFinite(offsetHeight) && offsetHeight > 0) {
    document.documentElement.style.setProperty('--header-height', `${offsetHeight}px`);
  }
};

const toggleHeaderScrolled = (header) => {
  if (!header) {
    return;
  }

  const shouldCompact = window.scrollY > 12;
  header.classList.toggle('header--scrolled', shouldCompact);
};

export const initHeader = () => {
  const header = document.querySelector('.header');

  if (!header) {
    return;
  }

  const resizeObserverSupported = 'ResizeObserver' in window;
  let resizeObserver;

  const handleResize = () => updateHeaderHeight(header);

  updateHeaderHeight(header);
  toggleHeaderScrolled(header);

  if (resizeObserverSupported) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(header);
  } else {
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }

  document.addEventListener('scroll', () => toggleHeaderScrolled(header), { passive: true });
};
