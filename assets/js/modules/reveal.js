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

const initChatAnimation = (motionQuery) => {
  const chatEl = document.querySelector('.chat');

  if (!chatEl) {
    return;
  }

  chatEl.classList.add('chat--prepared');

  const chatMotionQuery = motionQuery || window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  let chatActivated = false;
  let chatObserver = null;

  const setChatState = () => {
    if (!chatActivated) {
      return;
    }

    if (chatMotionQuery.matches) {
      chatEl.classList.add('chat--reduced');
      chatEl.classList.remove('chat--active');
    } else {
      chatEl.classList.remove('chat--reduced');
      chatEl.classList.remove('chat--active');
      void chatEl.offsetWidth;
      chatEl.classList.add('chat--active');
    }
  };

  const activateChat = () => {
    if (chatActivated) {
      return;
    }

    chatActivated = true;
    setChatState();
  };

  const observeChat = () => {
    if (!supportsIntersectionObserver || chatObserver) {
      return;
    }

    chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateChat();
            if (chatObserver) {
              chatObserver.disconnect();
              chatObserver = null;
            }
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    chatObserver.observe(chatEl);
  };

  if (chatMotionQuery.matches) {
    activateChat();
  } else if (supportsIntersectionObserver) {
    observeChat();
  } else {
    activateChat();
  }

  const handleChatMotionChange = (event) => {
    if (event.matches) {
      activateChat();
      if (chatObserver) {
        chatObserver.disconnect();
        chatObserver = null;
      }
    } else if (chatActivated) {
      setChatState();
    } else if (supportsIntersectionObserver) {
      observeChat();
    }
  };

  addMediaListener(chatMotionQuery, handleChatMotionChange);
};

const initRevealOnScroll = (motionQuery) => {
  const revealElements = document.querySelectorAll(
    '.value-card, .timeline__item, .pricing-card, .guarantee-card, .testimonial-shot, .stat'
  );

  if (!revealElements.length) {
    return;
  }

  const reduceMotionQuery = motionQuery || window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => {
      element.classList.add('revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => {
    element.classList.add('revealable');
    revealObserver.observe(element);
  });
};

export const initRevealEffects = ({ motionQuery } = {}) => {
  const query = motionQuery || window.matchMedia('(prefers-reduced-motion: reduce)');
  initChatAnimation(query);
  initRevealOnScroll(query);
};
