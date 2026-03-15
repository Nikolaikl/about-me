(function () {
  // Boot screen
  var bootScreen = document.getElementById('boot-screen');
  var desktopIcons = document.getElementById('desktop-icons');
  var windows = document.querySelectorAll('main .retro-window');

  setTimeout(function () {
    bootScreen.classList.add('fade-out');
    setTimeout(function () {
      bootScreen.style.display = 'none';
      desktopIcons.classList.remove('desktop-icons-hidden');
      desktopIcons.style.transition = 'opacity 0.4s ease';
      windows.forEach(function (win, i) {
        setTimeout(function () {
          win.classList.add('visible');
        }, i * 150);
      });
    }, 600);
  }, 1400);

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

  // Minimize/close buttons
  document.querySelectorAll('.retro-btn-minimize').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.closest('.retro-window').classList.toggle('minimized');
    });
  });

  document.querySelectorAll('.retro-btn-close').forEach(function (btn) {
    if (btn.classList.contains('lightbox-close')) return;
    btn.addEventListener('click', function () {
      this.closest('.retro-window').classList.toggle('minimized');
    });
  });

  // Clock
  var clockEl = document.getElementById('taskbar-clock');
  function updateClock() {
    if (clockEl) {
      clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  updateClock();
  setInterval(updateClock, 30000);

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
})();
