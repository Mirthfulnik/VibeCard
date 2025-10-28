const applyInteractionConstraints = (target) => {
  if (!target) {
    return;
  }

  target.style.touchAction = 'pan-y';
  target.style.overscrollBehavior = 'contain';
};

export const initDemoViewer = () => {
  const viewerEl = document.querySelector('.demo__viewer');

  if (!viewerEl) {
    return;
  }

  const controls = Array.from(viewerEl.querySelectorAll('.demo__control'));
  const frame = viewerEl.querySelector('.demo-preview__frame');
  const overlay = viewerEl.querySelector('.demo-preview__overlay');
  const hintEl = viewerEl.querySelector('.demo-preview__gesture-text');
  const titleEl = viewerEl.querySelector('.demo-card__title');
  const metaEl = viewerEl.querySelector('.demo-card__meta');
  const panelEl = viewerEl.querySelector('.demo-card');
  const stageEl = viewerEl.querySelector('.demo-preview__stage');
  const fallbackImage = viewerEl.querySelector('.demo-preview__fallback');

  if (!controls.length || !frame || !panelEl) {
    return;
  }

  let interactionLocked = true;
  let lastTouchY = null;
  let shouldAnimateOverlay = true;
  applyInteractionConstraints(frame);
  applyInteractionConstraints(overlay);

  const markPreviewLoaded = () => {
    if (stageEl) {
      stageEl.classList.add('is-loaded');
    }
  };

  const showFallbackPreview = () => {
    if (stageEl) {
      stageEl.classList.remove('is-loaded');
    }
  };

  const updateFallbackPreview = (source, alt) => {
    if (!fallbackImage) {
      return;
    }

    if (source) {
      fallbackImage.src = source;
    }

    if (alt) {
      fallbackImage.alt = alt;
    }
  };

  
  const disableInteraction = () => {
    interactionLocked = true;
    shouldAnimateOverlay = true;
    overlay?.classList.remove('is-active');
    setOverlayAnimationState(true);
  };

    overlay.classList.toggle('is-animated', isAnimated);
  };
    overlay?.classList.remove('is-active');
    
  };

  const enableInteraction = () => {
    interactionLocked = false;
    overlay?.classList.add('is-active');
    if (shouldAnimateOverlay) {
      shouldAnimateOverlay = false;
      setOverlayAnimationState(false);
    }
  };

  const forceVerticalScroll = () => {
    if (!frame || !frame.contentWindow) {
      return;
    }

    try {
      const iframeDocument = frame.contentDocument || frame.contentWindow.document;

      if (!iframeDocument) {
        return;
      }

      const { documentElement, body } = iframeDocument;

      if (documentElement) {
        documentElement.style.overflowX = 'hidden';
        documentElement.style.width = '100%';
      }

      if (body) {
        body.style.overflowX = 'hidden';
        body.style.width = '100%';
      }
    } catch (error) {
      // Ignore cross-origin access errors
    }
  };

  const tryScrollFrame = (deltaY) => {
    if (!frame || !frame.contentWindow) {
      return false;
    }

    try {
      const iframeDocument = frame.contentDocument || frame.contentWindow.document;

      if (!iframeDocument) {
        return false;
      }

      const scrollElement = iframeDocument.scrollingElement || iframeDocument.documentElement;

      if (!scrollElement) {
        return false;
      }

      if (typeof scrollElement.scrollLeft === 'number' && scrollElement.scrollLeft !== 0) {
        scrollElement.scrollLeft = 0;
      }

      const targetScrollTop = scrollElement.scrollTop + deltaY;

      if (targetScrollTop <= 0) {
        scrollElement.scrollTop = 0;
        return scrollElement.scrollTop !== 0;
      }

      const maxScrollTop = scrollElement.scrollHeight - scrollElement.clientHeight;

      if (targetScrollTop >= maxScrollTop) {
        scrollElement.scrollTop = maxScrollTop;
        return scrollElement.scrollTop !== maxScrollTop;
      }

      scrollElement.scrollTop = targetScrollTop;
      return true;
    } catch (error) {
      return false;
    }
  };

  const resetTouchTracking = () => {
    lastTouchY = null;
  };

  if (overlay) {
    overlay.addEventListener(
      'wheel',
      (event) => {
        if (interactionLocked) {
          enableInteraction();
        }

        const delegated = tryScrollFrame(event.deltaY);

        if (delegated) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    overlay.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') {
        event.preventDefault();
      }
      enableInteraction();
    });

    overlay.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length) {
          lastTouchY = event.touches[0].clientY;
        }
        enableInteraction();
      },
      { passive: true }
    );

    overlay.addEventListener(
      'touchmove',
      (event) => {
        if (interactionLocked) {
          enableInteraction();
        }

        if (!event.touches.length) {
          return;
        }

        const currentY = event.touches[0].clientY;

        if (lastTouchY === null) {
          lastTouchY = currentY;
          return;
        }

        const deltaY = lastTouchY - currentY;
        lastTouchY = currentY;

        const delegated = tryScrollFrame(deltaY);

        if (delegated) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    overlay.addEventListener(
      'touchend',
      () => {
        resetTouchTracking();
        enableInteraction();
      },
      { passive: true }
    );

    overlay.addEventListener(
      'touchcancel',
      () => {
        resetTouchTracking();
      },
      { passive: true }
    );
  }

  const getActiveControl = () => controls.find((button) => button.classList.contains('is-active'));

  const enforceSameHost = () => {
    const activeControl = getActiveControl();

    if (!frame || !activeControl) {
      return false;
    }

    const site = activeControl.getAttribute('data-site');

    if (!site) {
      return false;
    }

    try {
      const expectedHost = new URL(site).host;
      const currentHost = new URL(frame.src).host;
      if (currentHost && currentHost !== expectedHost) {
        frame.src = site;
        return true;
      }
    } catch (error) {
      frame.src = site;
      return true;
    }

    return false;
  };

  const setActiveControl = (button) => {
    if (!button) {
      return;
    }

    controls.forEach((control) => {
      const isActive = control === button;
      control.classList.toggle('is-active', isActive);
      control.setAttribute('aria-selected', isActive ? 'true' : 'false');
      control.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    if (panelEl && button.id) {
      panelEl.setAttribute('aria-labelledby', button.id);
    }

    const site = button.getAttribute('data-site');
    const title = button.getAttribute('data-title');
    const meta = button.getAttribute('data-meta');
    const hint = button.getAttribute('data-hint');
    const preview = button.getAttribute('data-preview');
    const previewAltAttr = button.getAttribute('data-preview-alt');

    if (title && titleEl) {
      titleEl.textContent = title;
      frame.setAttribute('title', `Визитка ${title}`);
    }

    if (meta && metaEl) {
      metaEl.textContent = meta;
    }

    if (hint && hintEl) {
      hintEl.textContent = hint;
    }

    const fallbackAlt =
      previewAltAttr ||
      (title ? `Превью визитки ${title}` : fallbackImage?.getAttribute('alt') || 'Превью визитки');

    updateFallbackPreview(preview, fallbackAlt);
    showFallbackPreview();

    if (site) {
      frame.src = site;
    } else {
      frame.removeAttribute('src');
    }

    disableInteraction();
  };

  controls.forEach((button) => {
    button.addEventListener('click', () => setActiveControl(button));
  });

  frame.addEventListener('load', () => {
    const reloaded = enforceSameHost();
    if (reloaded) {
      showFallbackPreview();
    } else {
      markPreviewLoaded();
      forceVerticalScroll();
    }
  });

  const initialControl = getActiveControl() || controls[0];

  if (initialControl) {
    if (!initialControl.hasAttribute('tabindex')) {
      initialControl.setAttribute('tabindex', '0');
    }
    setActiveControl(initialControl);
  }
};
