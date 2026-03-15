(function () {
  // Boot screen
  var bootScreen = document.getElementById('boot-screen');
  var desktopIcons = document.getElementById('desktop-icons');
  var windows = document.querySelectorAll('main .retro-window');

  // Randomize boot subtitle
  var bootText = bootScreen.querySelector('.retro-boot-text');
  if (bootText) {
    var bootMessages = [
      'Professional Edition',
      'Portfolio Build 2026.03',
      'Loading awesome things...',
      'Preparing pixels...',
      'Initializing career.exe...'
    ];
    bootText.textContent = bootMessages[Math.floor(Math.random() * bootMessages.length)];
  }

  setTimeout(function () {
    bootScreen.classList.add('fade-out');
    setTimeout(function () {
      bootScreen.style.display = 'none';

      // Staggered desktop icon appearance
      var icons = desktopIcons.querySelectorAll('.retro-desktop-icon');
      desktopIcons.classList.remove('desktop-icons-hidden');
      desktopIcons.style.transition = 'opacity 0.4s ease';
      icons.forEach(function (icon, i) {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(8px)';
        icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(function () {
          icon.style.opacity = '1';
          icon.style.transform = 'translateY(0)';
        }, i * 80);
      });

      windows.forEach(function (win, i) {
        setTimeout(function () {
          win.classList.add('visible');
        }, i * 150);
      });

      // Start typing effect after windows appear
      setTimeout(function () {
        typeIntroText();
      }, windows.length * 150 + 300);

      // Show Clippy after a delay
      setTimeout(function () {
        showClippy();
      }, windows.length * 150 + 2000);
    }, 600);
  }, 1400);

  // Typing effect for intro
  function typeIntroText() {
    var typedEl = document.getElementById('intro-typed');
    if (!typedEl) return;
    var text = 'whoami';
    var i = 0;
    function typeChar() {
      if (i < text.length) {
        typedEl.textContent += text[i];
        i++;
        setTimeout(typeChar, 80 + Math.random() * 60);
      }
    }
    typeChar();
  }

  // Clippy helper Easter egg
  function showClippy() {
    if (sessionStorage.getItem('clippy-dismissed')) return;

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
        '<button class="clippy-close" aria-label="Close">&times;</button>' +
        '<p>' + greeting + 'It looks like you\'re checking out a portfolio!</p>' +
        '<p class="clippy-hint">Try the Konami Code for a surprise.<br><kbd>&uarr;</kbd><kbd>&uarr;</kbd><kbd>&darr;</kbd><kbd>&darr;</kbd><kbd>&larr;</kbd><kbd>&rarr;</kbd><kbd>&larr;</kbd><kbd>&rarr;</kbd><kbd>B</kbd><kbd>A</kbd></p>' +
      '</div>' +
      '<div class="clippy-character">&#128206;</div>';
    document.body.appendChild(clippy);

    // Animate in
    requestAnimationFrame(function () {
      clippy.classList.add('visible');
    });

    function dismissClippy() {
      clippy.classList.remove('visible');
      setTimeout(function () { clippy.remove(); }, 300);
      sessionStorage.setItem('clippy-dismissed', '1');
    }

    clippy.querySelector('.clippy-close').addEventListener('click', dismissClippy);
    clippy.querySelector('.clippy-character').addEventListener('click', dismissClippy);

    // Auto-dismiss after 8 seconds
    setTimeout(function () {
      if (document.body.contains(clippy)) dismissClippy();
    }, 8000);
  }

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  document.querySelectorAll('.project-image img').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(this.src, this.alt);
    });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(this.src, this.alt);
      }
    });
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.querySelectorAll('.lightbox-close').forEach(function (btn) {
    btn.addEventListener('click', closeLightbox);
  });

  // Minimize/close buttons with tooltips
  document.querySelectorAll('.retro-btn-minimize').forEach(function (btn) {
    btn.title = 'Minimize';
    btn.addEventListener('click', function () {
      this.closest('.retro-window').classList.toggle('minimized');
    });
  });

  document.querySelectorAll('.retro-btn-maximize').forEach(function (btn) {
    btn.title = 'Maximize (just kidding)';
    btn.addEventListener('click', function () {
      var win = this.closest('.retro-window');
      win.style.animation = 'window-nope 0.3s ease';
      win.addEventListener('animationend', function () {
        win.style.animation = '';
      }, { once: true });
    });
  });

  document.querySelectorAll('.retro-btn-close').forEach(function (btn) {
    if (btn.classList.contains('lightbox-close')) return;
    btn.title = 'Close (minimize, actually)';
    btn.addEventListener('click', function () {
      this.closest('.retro-window').classList.toggle('minimized');
    });
  });

  // Double-click titlebar to toggle minimize (like real XP)
  document.querySelectorAll('.retro-titlebar').forEach(function (titlebar) {
    titlebar.addEventListener('dblclick', function (e) {
      // Don't trigger on button clicks
      if (e.target.closest('.retro-titlebar-buttons')) return;
      this.closest('.retro-window').classList.toggle('minimized');
    });
    titlebar.style.cursor = 'default';
  });

  // Clock
  var clockEl = document.getElementById('taskbar-clock');
  function updateClock() {
    if (clockEl) {
      var now = new Date();
      var h = now.getHours().toString().padStart(2, '0');
      var m = now.getMinutes().toString().padStart(2, '0');
      clockEl.textContent = h + ':' + m;
    }
  }
  updateClock();

  // Start menu
  var startBtn = document.getElementById('start-button');
  var startMenu = document.getElementById('start-menu');
  if (startBtn && startMenu) {
    startBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      startMenu.classList.toggle('active');
    });
    document.addEventListener('click', function () {
      startMenu.classList.remove('active');
    });
    startMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    document.querySelectorAll('.retro-start-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        startMenu.classList.remove('active');
      });
    });
  }

  // Contact cancel button
  var cancelBtn = document.getElementById('contact-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      var contactWin = document.getElementById('contact-window');
      if (contactWin) contactWin.classList.add('minimized');
    });
  }

  // Desktop icon click to un-minimize
  document.querySelectorAll('.retro-desktop-icon[href^="#"]').forEach(function (icon) {
    icon.addEventListener('click', function () {
      var targetId = this.getAttribute('href').substring(1);
      var targetWin = document.getElementById(targetId);
      if (targetWin && targetWin.classList.contains('minimized')) {
        targetWin.classList.remove('minimized');
      }
    });
  });

  // Escape to close lightbox
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Blinking clock separator
  var colonVisible = true;
  setInterval(function () {
    if (clockEl) {
      colonVisible = !colonVisible;
      var now = new Date();
      var h = now.getHours().toString().padStart(2, '0');
      var m = now.getMinutes().toString().padStart(2, '0');
      clockEl.textContent = h + (colonVisible ? ':' : ' ') + m;
    }
  }, 1000);

  // Tab system for About section
  document.querySelectorAll('.retro-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = this.getAttribute('data-tab');
      // Deactivate all tabs and panels
      this.parentElement.querySelectorAll('.retro-tab').forEach(function (t) {
        t.classList.remove('active');
      });
      this.closest('section').querySelectorAll('.retro-tab-panel').forEach(function (p) {
        p.classList.remove('active');
      });
      // Activate clicked tab and target panel
      this.classList.add('active');
      var panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  // Animate language bars when tab becomes visible
  var languageBarsAnimated = false;
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.id === 'tab-languages' && mutation.target.classList.contains('active') && !languageBarsAnimated) {
        languageBarsAnimated = true;
        var fills = mutation.target.querySelectorAll('.language-fill');
        fills.forEach(function (fill, i) {
          var targetWidth = fill.style.width;
          fill.style.width = '0%';
          setTimeout(function () {
            fill.style.width = targetWidth;
          }, i * 100 + 50);
        });
      }
    });
  });
  document.querySelectorAll('.retro-tab-panel').forEach(function (panel) {
    observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
  });

  // Konami code Easter egg
  var konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var konamiIndex = 0;
  document.addEventListener('keydown', function (e) {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        showBSOD();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function showBSOD() {
    var bsod = document.createElement('div');
    bsod.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#0000AA;color:#fff;font-family:"Courier New",monospace;padding:10vh 8vw;font-size:16px;line-height:1.8;cursor:pointer;';
    bsod.innerHTML =
      '<p style="background:#aaa;color:#0000AA;display:inline;padding:2px 8px;font-weight:bold;">  Nikolai Portfolio  </p><br><br>' +
      'A fatal exception 0E has occurred at 0028:C0034B03 in VXD PORTFOLIO(01) +<br>' +
      '00010E36. The current application will be terminated.<br><br>' +
      '* Press any key to return to the portfolio.<br>' +
      '* Press CTRL+ALT+DEL to pretend this never happened.<br><br>' +
      'Press any key to continue <span style="animation:bsod-blink 1s step-end infinite;">_</span>';
    var style = document.createElement('style');
    style.textContent = '@keyframes bsod-blink{0%,50%{opacity:1}51%,100%{opacity:0}}';
    bsod.appendChild(style);
    document.body.appendChild(bsod);
    var dismiss = function () {
      bsod.remove();
      document.removeEventListener('keydown', dismiss);
    };
    bsod.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss);
  }

  // Console message for curious devs
  console.log(
    '%c Welcome to NikolaiOS! %c\n' +
    'Built with vanilla HTML, CSS & JS — no frameworks needed.\n' +
    'Found the Konami Code yet? Try it!\n' +
    'github.com/nikolaikl',
    'background:#003399;color:#fff;font-size:14px;padding:4px 8px;border-radius:2px;font-weight:bold;',
    'color:#003399;font-size:12px;'
  );
})();
