(function () {
  'use strict';

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // sessionStorage kann in privaten Fenstern werfen - nie ungeschuetzt nutzen.
  function store(key, value) {
    try {
      if (value === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
  }

  var bootScreen = document.getElementById('boot-screen');
  var desktopIcons = document.getElementById('desktop-icons');
  var windows = document.querySelectorAll('main .retro-window');

  // ==========================================================
  // Reveal
  // Sichtbarkeit ist garantiert, der Effekt ist die Zugabe.
  // ==========================================================
  var revealed = false;

  function revealAll(animated) {
    if (revealed) return;
    revealed = true;

    if (bootScreen) bootScreen.style.display = 'none';
    if (desktopIcons) desktopIcons.classList.add('ready');

    if (!animated) {
      windows.forEach(function (win) {
        win.classList.add('visible');
      });
      typeIntroText(false);
      return;
    }

    if (desktopIcons) {
      desktopIcons.querySelectorAll('.retro-desktop-icon').forEach(function (icon, i) {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(8px)';
        icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(function () {
          icon.style.opacity = '1';
          icon.style.transform = 'translateY(0)';
        }, i * 70);
      });
    }

    windows.forEach(function (win, i) {
      setTimeout(function () {
        win.classList.add('visible');
      }, i * 110);
    });

    setTimeout(function () {
      typeIntroText(true);
    }, windows.length * 110 + 200);

    setTimeout(function () {
      showClippy();
    }, windows.length * 110 + 1800);
  }

  // Sicherheitsnetz: falls unten etwas wirft, ist die Seite trotzdem da.
  setTimeout(function () {
    revealAll(false);
  }, 4000);

  var skipBoot = reduceMotion || store('boot-seen') === '1';

  if (skipBoot || !bootScreen) {
    revealAll(false);
  } else {
    var bootText = bootScreen.querySelector('.retro-boot-text');
    if (bootText) {
      var bootMessages = [
        'Professional Edition',
        'Portfolio Build 2026.09',
        'Loading awesome things...',
        'Preparing pixels...',
        'Initializing career.exe...'
      ];
      bootText.textContent =
        bootMessages[Math.floor(Math.random() * bootMessages.length)];
    }

    var bootTimer = setTimeout(finishBoot, 900);

    // Jeder Klick oder Tastendruck bricht den Boot-Screen sofort ab.
    function skipNow() {
      clearTimeout(bootTimer);
      finishBoot();
    }
    bootScreen.addEventListener('click', skipNow);
    document.addEventListener('keydown', skipNow, { once: true });

    function finishBoot() {
      bootScreen.removeEventListener('click', skipNow);
      store('boot-seen', '1');
      bootScreen.classList.add('fade-out');
      setTimeout(function () {
        revealAll(true);
      }, 450);
    }
  }

  // ==========================================================
  // Tipp-Effekt
  // ==========================================================
  function typeIntroText(animated) {
    var typedEl = document.getElementById('intro-typed');
    if (!typedEl || typedEl.textContent) return;
    var text = 'whoami';
    if (!animated) {
      typedEl.textContent = text;
      return;
    }
    var i = 0;
    (function typeChar() {
      if (i < text.length) {
        typedEl.textContent += text[i];
        i++;
        setTimeout(typeChar, 80 + Math.random() * 60);
      }
    })();
  }

  // ==========================================================
  // Clippy
  // ==========================================================
  function showClippy() {
    if (reduceMotion || store('clippy-dismissed')) return;

    var hour = new Date().getHours();
    var greeting;
    if (hour < 6) greeting = 'Burning the midnight oil? ';
    else if (hour < 12) greeting = 'Good morning! ';
    else if (hour < 18) greeting = 'Good afternoon! ';
    else greeting = 'Good evening! ';

    var clippy = document.createElement('div');
    clippy.className = 'clippy-helper';
    clippy.innerHTML =
      '<div class="clippy-bubble">' +
      '<button type="button" class="clippy-close" aria-label="Dismiss assistant">&times;</button>' +
      '<p>' + greeting + "It looks like you're checking out a portfolio!</p>" +
      '</div>' +
      '<div class="clippy-character" aria-hidden="true">&#128206;</div>';
    document.body.appendChild(clippy);

    requestAnimationFrame(function () {
      clippy.classList.add('visible');
    });

    var autoTimer;
    function dismissClippy() {
      clearTimeout(autoTimer);
      clippy.classList.remove('visible');
      setTimeout(function () {
        clippy.remove();
      }, 300);
      store('clippy-dismissed', '1');
    }

    clippy.querySelector('.clippy-close').addEventListener('click', dismissClippy);
    clippy.querySelector('.clippy-character').addEventListener('click', dismissClippy);
    autoTimer = setTimeout(dismissClippy, 8000);
  }

  // ==========================================================
  // Lightbox - echter modaler Dialog
  // ==========================================================
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCloseBtn = lightbox && lightbox.querySelector('.lightbox-close');
  var lastFocused = null;

  function openLightbox(src, alt, trigger) {
    if (!lightbox) return;
    lastFocused = trigger || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    lightbox.classList.add('active');
    if (lightboxCloseBtn) lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove('active');
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    // Fokus zurueck auf das ausloesende Bild.
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }

  if (lightbox) {
    document.querySelectorAll('.project-image img').forEach(function (img) {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.title = 'Open larger view';
      img.addEventListener('click', function () {
        openLightbox(this.src, this.alt, this);
      });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(this.src, this.alt, this);
        }
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.querySelectorAll('.lightbox-close').forEach(function (btn) {
      btn.addEventListener('click', closeLightbox);
    });

    // Fokusfalle: im offenen Dialog bleibt Tab im Dialog.
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'Tab' && lightboxCloseBtn) {
        e.preventDefault();
        lightboxCloseBtn.focus();
      }
    });
  }

  // ==========================================================
  // Fenster ein-/ausklappen
  // ==========================================================
  function setCollapsed(win, collapsed) {
    win.classList.toggle('minimized', collapsed);
    win.querySelectorAll('[aria-expanded]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  function toggleWindow(win) {
    if (win) setCollapsed(win, !win.classList.contains('minimized'));
  }

  document
    .querySelectorAll('.retro-btn-minimize, .retro-btn-close')
    .forEach(function (btn) {
      if (btn.classList.contains('lightbox-close')) return;
      btn.title = 'Collapse this window';
      btn.addEventListener('click', function () {
        toggleWindow(this.closest('.retro-window'));
      });
    });

  document.querySelectorAll('.retro-btn-maximize').forEach(function (btn) {
    btn.title = 'Maximize (just kidding)';
    btn.addEventListener('click', function () {
      var win = this.closest('.retro-window');
      if (reduceMotion) return;
      win.style.animation = 'window-nope 0.3s ease';
      win.addEventListener(
        'animationend',
        function () {
          win.style.animation = '';
        },
        { once: true }
      );
    });
  });

  document.querySelectorAll('main .retro-titlebar').forEach(function (titlebar) {
    titlebar.addEventListener('dblclick', function (e) {
      if (e.target.closest('.retro-titlebar-buttons')) return;
      toggleWindow(this.closest('.retro-window'));
    });
  });

  // ==========================================================
  // Uhr - einmal pro Minute statt einmal pro Sekunde.
  // Der blinkende Doppelpunkt laeuft jetzt als CSS-Animation.
  // ==========================================================
  var hoursEl = document.getElementById('clock-hours');
  var minutesEl = document.getElementById('clock-minutes');

  function updateClock() {
    if (!hoursEl || !minutesEl) return;
    var now = new Date();
    hoursEl.textContent = String(now.getHours()).padStart(2, '0');
    minutesEl.textContent = String(now.getMinutes()).padStart(2, '0');
    // Auf die naechste volle Minute takten.
    setTimeout(updateClock, (60 - now.getSeconds()) * 1000 + 50);
  }
  updateClock();

  // ==========================================================
  // Start-Menue
  // ==========================================================
  var startBtn = document.getElementById('start-button');
  var startMenu = document.getElementById('start-menu');

  function setStartMenu(open) {
    if (!startBtn || !startMenu) return;
    startMenu.classList.toggle('active', open);
    startBtn.setAttribute('aria-expanded', String(open));
  }

  if (startBtn && startMenu) {
    startBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setStartMenu(!startMenu.classList.contains('active'));
    });

    document.addEventListener('click', function () {
      setStartMenu(false);
    });

    startMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && startMenu.classList.contains('active')) {
        setStartMenu(false);
        startBtn.focus();
      }
    });

    startMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setStartMenu(false);
      });
    });
  }

  // ==========================================================
  // Kontakt-Dialog
  // ==========================================================
  var cancelBtn = document.getElementById('contact-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      var contactWin = document.getElementById('contact-window');
      if (contactWin) setCollapsed(contactWin, true);
    });
  }

  // Interne Links klappen ihr Zielfenster wieder auf.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var targetWin = document.getElementById(
        this.getAttribute('href').substring(1)
      );
      if (targetWin && targetWin.classList.contains('minimized')) {
        setCollapsed(targetWin, false);
      }
    });
  });

  // ==========================================================
  // Taskbar-Scrollspy
  // ==========================================================
  var taskbarBtns = document.querySelectorAll('.retro-taskbar-btn');
  if (taskbarBtns.length && 'IntersectionObserver' in window) {
    var btnByWindowId = {};
    taskbarBtns.forEach(function (btn) {
      btnByWindowId[btn.getAttribute('href').substring(1)] = btn;
    });

    var visibleRatios = {};
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visibleRatios[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        var bestId = null;
        Object.keys(visibleRatios).forEach(function (id) {
          if (
            visibleRatios[id] > 0 &&
            (bestId === null || visibleRatios[id] > visibleRatios[bestId])
          ) {
            bestId = id;
          }
        });

        if (!bestId) return;
        taskbarBtns.forEach(function (btn) {
          var active = btn === btnByWindowId[bestId];
          btn.classList.toggle('active', active);
          if (active) btn.setAttribute('aria-current', 'true');
          else btn.removeAttribute('aria-current');
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    Object.keys(btnByWindowId).forEach(function (id) {
      var win = document.getElementById(id);
      if (win) spy.observe(win);
    });
  }

  // ==========================================================
  // Tabs - ARIA-Pattern inkl. Pfeiltasten (WAI-ARIA APG)
  // ==========================================================
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.retro-tab'));

  function selectTab(tab, setFocus) {
    var tablist = tab.parentElement;
    var section = tab.closest('section');

    tablist.querySelectorAll('.retro-tab').forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    section.querySelectorAll('.retro-tab-panel').forEach(function (panel) {
      panel.classList.remove('active');
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    if (setFocus) tab.focus();

    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) {
      panel.classList.add('active');
      animateLanguageBars(panel);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      selectTab(this, false);
    });

    tab.addEventListener('keydown', function (e) {
      var group = Array.prototype.slice.call(
        this.parentElement.querySelectorAll('.retro-tab')
      );
      var i = group.indexOf(this);
      var next = null;

      if (e.key === 'ArrowRight') next = group[(i + 1) % group.length];
      else if (e.key === 'ArrowLeft') next = group[(i - 1 + group.length) % group.length];
      else if (e.key === 'Home') next = group[0];
      else if (e.key === 'End') next = group[group.length - 1];

      if (next) {
        e.preventDefault();
        selectTab(next, true);
      }
    });
  });

  // ==========================================================
  // Sprachbalken - transform statt width
  // ==========================================================
  var languageBarsAnimated = false;

  function animateLanguageBars(panel) {
    if (languageBarsAnimated || panel.id !== 'tab-languages') return;
    languageBarsAnimated = true;

    var fills = panel.querySelectorAll('.language-fill');
    if (reduceMotion) return;

    fills.forEach(function (fill, i) {
      var target = fill.style.getPropertyValue('--fill');
      fill.style.setProperty('--fill', '0');
      setTimeout(function () {
        fill.style.setProperty('--fill', target);
      }, i * 90 + 50);
    });
  }

  console.log(
    '%c Welcome to NikolaiOS! %c\n' +
      'Built with vanilla HTML, CSS & JS.\n' +
      'github.com/nikolaikl',
    'background:#003399;color:#fff;font-size:14px;padding:4px 8px;border-radius:2px;font-weight:bold;',
    'color:#003399;font-size:12px;'
  );
})();
