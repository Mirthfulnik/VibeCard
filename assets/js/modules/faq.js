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

export const initFaq = ({ motionQuery } = {}) => {
  const faqItems = document.querySelectorAll('.faq__item');

  if (!faqItems.length) {
    return;
  }

  const reduceMotionQuery = motionQuery || window.matchMedia('(prefers-reduced-motion: reduce)');

    const waitForHeightTransition = (element, callback) => {
    if (element.__faqHeightTransitionHandler) {
      element.removeEventListener('transitionend', element.__faqHeightTransitionHandler);
    }

    const handleTransitionEnd = (event) => {
      if (event.target !== element || event.propertyName !== 'height') {
        return;
      }

      element.removeEventListener('transitionend', handleTransitionEnd);
      element.__faqHeightTransitionHandler = undefined;
      callback();
    };

    element.__faqHeightTransitionHandler = handleTransitionEnd;
    element.addEventListener('transitionend', handleTransitionEnd);
  };
  
  const closeItem = (item) => {
    const button = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!button || !answer) {
      return;
    }

    item.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');

    if (reduceMotionQuery.matches) {
      answer.style.height = '';
      answer.hidden = true;
      return;
    }

    const startHeight = answer.getBoundingClientRect().height;

    if (!startHeight) {
      answer.hidden = true;
      answer.style.height = '';
      return;
    }
    answer.style.height = `${startHeight}px`;

    waitForHeightTransition(answer, () => {
      answer.hidden = true;
      answer.style.height = '';
    });

    window.requestAnimationFrame(() => {
      answer.style.height = '0px';
    });
  };

  const openItem = (item) => {
    const button = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!button || !answer) {
      return;
    }

    const previouslyOpen = document.querySelector('.faq__item.is-open');

    if (previouslyOpen && previouslyOpen !== item) {
      closeItem(previouslyOpen);
    }

    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    answer.hidden = false;

    if (reduceMotionQuery.matches) {
      answer.style.height = 'auto';
      return;
    }

    answer.style.height = 'auto';
    const targetHeight = answer.scrollHeight;
    answer.style.height = '0px';

    waitForHeightTransition(answer, () => {
      answer.style.height = 'auto';
    });

    window.requestAnimationFrame(() => {
      answer.style.height = `${targetHeight}px`;
    });
  };

  const recalcOpenHeights = () => {
    faqItems.forEach((item) => {
      if (!item.classList.contains('is-open')) {
        return;
      }

      const answerEl = item.querySelector('.faq__answer');

      if (!answerEl) {
        return;
      }

      answerEl.style.height = 'auto';
      const recalculatedHeight = answerEl.scrollHeight;
      answerEl.style.height = `${recalculatedHeight}px`;
    });
  };

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (answer) {
      answer.hidden = true;
      answer.style.height = '0px';
    }

    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      if (item.classList.contains('is-open')) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  addMediaListener(reduceMotionQuery, (event) => {
    if (event.matches) {
      faqItems.forEach((item) => {
        const answer = item.querySelector('.faq__answer');
        if (!answer) {
          return;
        }

        if (item.classList.contains('is-open')) {
          answer.style.height = 'auto';
        } else {
          answer.style.height = '';
        }
      });
    } else {
      recalcOpenHeights();
    }
  });

  window.addEventListener('resize', () => {
    if (!reduceMotionQuery.matches) {
      recalcOpenHeights();
    }
  });
};
