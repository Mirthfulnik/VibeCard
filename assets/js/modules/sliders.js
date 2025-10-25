const addMediaListener = (query, handler) => {
  if (!query) {
    return;
  }

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handler);
  } else if (typeof query.addListener === 'function') {
    query.addListener(handler);
  }
};

const removeMediaListener = (query, handler) => {
  if (!query) {
    return;
  }

  if (typeof query.removeEventListener === 'function') {
    query.removeEventListener('change', handler);
  } else if (typeof query.removeListener === 'function') {
    query.removeListener(handler);
  }
};

const manageAutoplay = (swiper, motionQuery, interactiveEl) => {
  if (!swiper || !swiper.params || swiper.params.autoplay === false || !swiper.autoplay) {
    return () => {};
  }

  const query = motionQuery || window.matchMedia('(prefers-reduced-motion: reduce)');

  const start = () => {
    if (swiper.autoplay && !query.matches) {
      swiper.autoplay.start();
    }
  };

  const stop = () => {
    if (swiper.autoplay) {
      swiper.autoplay.stop();
    }
  };

  const handleMotionChange = (event) => {
    if (event.matches) {
      stop();
    } else {
      start();
    }
  };

  if (query.matches) {
    stop();
  } else {
    start();
  }

  addMediaListener(query, handleMotionChange);

  const handleMouseEnter = () => stop();
  const handleMouseLeave = () => {
    if (!query.matches) {
      start();
    }
  };

  if (interactiveEl) {
    interactiveEl.addEventListener('mouseenter', handleMouseEnter);
    interactiveEl.addEventListener('mouseleave', handleMouseLeave);
    interactiveEl.addEventListener('focusin', handleMouseEnter);
    interactiveEl.addEventListener('focusout', handleMouseLeave);
  }

  return () => {
    removeMediaListener(query, handleMotionChange);

    if (interactiveEl) {
      interactiveEl.removeEventListener('mouseenter', handleMouseEnter);
      interactiveEl.removeEventListener('mouseleave', handleMouseLeave);
      interactiveEl.removeEventListener('focusin', handleMouseEnter);
      interactiveEl.removeEventListener('focusout', handleMouseLeave);
    }
  };
};

const initHeroSlider = (motionQuery) => {
  const heroCarousel = document.querySelector('.hero__carousel');

  if (!heroCarousel || typeof Swiper === 'undefined') {
    return;
  }

  const paginationEl = heroCarousel.querySelector('.hero__pagination');

  const heroSwiper = new Swiper(heroCarousel, {
    loop: true,
    centeredSlides: true,
    centeredSlidesBounds: true,
    slidesPerView: 'auto',
    spaceBetween: 24,
    grabCursor: true,
    effect: 'coverflow',
    speed: 780,
    roundLengths: true,
    keyboard: { enabled: true },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 0.9,
      slideShadows: false,
    },
    pagination: paginationEl
      ? {
          el: paginationEl,
          clickable: true,
        }
      : undefined,
    autoplay: { delay: 4200, disableOnInteraction: false },
    on: {
      resize(swiper) {
        swiper.update();
        swiper.slideTo(swiper.activeIndex, 0);
      },
      imagesReady(swiper) {
        swiper.update();
      },
    },
    breakpoints: {
      0: {
        spaceBetween: 18,
        coverflowEffect: {
          depth: 140,
        },
      },
      768: {
        spaceBetween: 24,
        coverflowEffect: {
          depth: 200,
        },
      },
      1280: {
        spaceBetween: 32,
        coverflowEffect: {
          depth: 240,
        },
      },
    },
  });

  manageAutoplay(heroSwiper, motionQuery, heroCarousel);
};

const initResponsiveSlider = (element, mediaQueryString, optionsFactory, motionQuery) => {
  if (!element || typeof Swiper === 'undefined') {
    return;
  }

  if (!mediaQueryString) {
    const swiperInstance = new Swiper(element, optionsFactory());
    manageAutoplay(swiperInstance, motionQuery, element);
    return;
  }

  const mediaQuery = window.matchMedia(mediaQueryString);
  let swiperInstance = null;
  let cleanupAutoplay = null;

  const enable = () => {
    if (swiperInstance) {
      return;
    }

    element.classList.remove('is-static');
    
    swiperInstance = new Swiper(element, optionsFactory());
    cleanupAutoplay = manageAutoplay(swiperInstance, motionQuery, element);
  };

  const disable = () => {
    if (swiperInstance) {
      if (typeof cleanupAutoplay === 'function') {
        cleanupAutoplay();
        cleanupAutoplay = null;
      }

      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }

    const orientationClasses = Array.from(element.classList).filter(
      (className) => className !== 'swiper' && className.startsWith('swiper-')
    );

    orientationClasses.forEach((className) => element.classList.remove(className));
    element.classList.add('is-static');

    const wrapper = element.querySelector('.swiper-wrapper');
    if (wrapper) {
     wrapper.removeAttribute('style');

      const wrapperClassesToRemove = Array.from(wrapper.classList).filter(
        (className) => className !== 'swiper-wrapper' && className.startsWith('swiper-')
      );

      wrapperClassesToRemove.forEach((className) => wrapper.classList.remove(className));

      if (typeof wrapper.scrollTo === 'function') {
        wrapper.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        wrapper.scrollLeft = 0;
      }
    }
    
    element.querySelectorAll('.swiper-slide').forEach((slide) => {
      slide.removeAttribute('style');

      const slideClassesToRemove = Array.from(slide.classList).filter(
        (className) => className !== 'swiper-slide' && className.startsWith('swiper-')
      );

      slideClassesToRemove.forEach((className) => slide.classList.remove(className));
    });
  };

  const evaluate = (query) => {
    if (query.matches) {
      enable();
    } else {
      disable();
    }
  };

  evaluate(mediaQuery);
  addMediaListener(mediaQuery, evaluate);
};

const initValueSlider = (motionQuery) => {
  const sliderEl = document.querySelector('.value__slider');

  initResponsiveSlider(
    sliderEl,
    '(max-width: 1023px)',
    () => ({
      slidesPerView: 1.1,
      centeredSlides: true,
      spaceBetween: 18,
      loop: true,
      speed: 640,
      watchOverflow: false,
      grabCursor: true,
      keyboard: { enabled: true },
      pagination: {
        el: sliderEl.querySelector('.value__pagination'),
        clickable: true,
      },
      autoplay: { delay: 4000, disableOnInteraction: false },
      breakpoints: {
        0: {
          spaceBetween: 16,
        },
        640: {
          slidesPerView: 1.4,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 2.2,
          centeredSlides: false,
          spaceBetween: 26,
        },
        1440: {
          slidesPerView: 2.7,
          centeredSlides: false,
          spaceBetween: 28,
        },
        1920: {
          slidesPerView: 3.1,
          centeredSlides: false,
          spaceBetween: 32,
        },
      },
    }),
    motionQuery
  );
};

const initTestimonialsSlider = (motionQuery) => {
  const sliderEl = document.querySelector('.testimonials__slider');

  initResponsiveSlider(
    sliderEl,
    '(max-width: 1279px)',
    () => {
      const paginationEl = sliderEl
        ? sliderEl.querySelector('.testimonials__pagination')
        : null;

      return {
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        slidesPerView: 'auto',
        spaceBetween: 24,
        grabCursor: true,
        effect: 'coverflow',
        speed: 760,
        roundLengths: true,
        keyboard: { enabled: true },
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 220,
          modifier: 1,
          slideShadows: false,
        },
        pagination: paginationEl
          ? {
              el: paginationEl,
              clickable: true,
            }
          : undefined,
        autoplay: { delay: 3800, disableOnInteraction: false },
        on: {
          resize(swiper) {
            swiper.update();
          },
          imagesReady(swiper) {
            swiper.update();
          },
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 16,
            coverflowEffect: {
              depth: 0,
              modifier: 0,
            },
          },
          768: {
            slidesPerView: 1.05,
            slidesPerView: 1,
            centeredSlides: false,
            coverflowEffect: {
              depth: 140,
              modifier: 0.65,
            },
          },
          980: {
            slidesPerView: 'auto',
            centeredSlidesBounds: true,
            spaceBetween: 24,
            coverflowEffect: {
              depth: 220,
              modifier: 1,
            },
          },
          1280: {
            slidesPerView: 'auto',
            centeredSlidesBounds: true,
            spaceBetween: 32,
            coverflowEffect: {
              depth: 260,
              modifier: 1.1,
            },
          },
        },
      };
    },
    motionQuery
  );
};

const initPricingSlider = (motionQuery) => {
  const sliderEl = document.querySelector('.pricing__slider');

  if (!sliderEl) {
    return;
  }
  
  initResponsiveSlider(
    sliderEl,
    '(max-width: 1023px)',
    () => ({
      slidesPerView: 'auto',
      centeredSlides: true,
      centeredSlidesBounds: true,
      spaceBetween: 24,
      autoHeight: true,
      watchOverflow: false,
      loop: true,
      grabCursor: true,
      keyboard: { enabled: true },
      pagination: {
        el: sliderEl.querySelector('.pricing__pagination'),
        clickable: true,
      },
      autoplay: { delay: 5200, disableOnInteraction: true },
      breakpoints: {
        0: {
          spaceBetween: 18,
        },
        768: {
          spaceBetween: 24,
        },
      },
    }),
    motionQuery
  );
};

export const initSliders = ({ motionQuery } = {}) => {
  const query = motionQuery || window.matchMedia('(prefers-reduced-motion: reduce)');
  initHeroSlider(query);
  initValueSlider(query);
  initTestimonialsSlider(query);
  initPricingSlider(query);
};
