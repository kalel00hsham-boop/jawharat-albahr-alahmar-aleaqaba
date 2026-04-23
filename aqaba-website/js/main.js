// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 0) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .card, .hotel-card, .food-card, .info-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
  else link.classList.remove('active');
});

// ===== SETTINGS WIDGET (A11y & Themes) =====
function initSettingsWidget() {
  const widgetHTML = `
    <div class="settings-toolbar">
      <div class="settings-menu" id="settingsMenu">
        <div class="settings-group">
          <h4>حجم الخط (تكبير/تصغير)</h4>
          <div class="a11y-controls">
            <button class="a11y-btn" id="btnFontInc">A+</button>
            <button class="a11y-btn" id="btnFontDec">A-</button>
          </div>
        </div>
        <div class="settings-group">
          <h4>المظهر (الألوان)</h4>
          <div class="theme-controls">
            <div class="theme-circle theme-blue active" data-theme="default" title="الأساسي"></div>
            <div class="theme-circle theme-dark-btn" data-theme="theme-dark" title="الداكن"></div>
            <div class="theme-circle theme-sand-btn" data-theme="theme-sand" title="الصحراوي"></div>
          </div>
        </div>
      </div>
      <button class="settings-btn" id="settingsBtn" title="الإعدادات">
        <i class="fas fa-cog fa-spin-hover"></i>
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');
  if(settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      settingsMenu.classList.toggle('open');
    });
  }

  // == Font Sizing ==
  let currentFontSize = parseInt(localStorage.getItem('aqabaFontSize')) || 16;
  const setFontSize = (size) => {
    document.documentElement.style.setProperty('--base-font-size', size + 'px');
    localStorage.setItem('aqabaFontSize', size);
  };
  
  // Apply saved font size
  setFontSize(currentFontSize);
  
  document.getElementById('btnFontInc').addEventListener('click', () => {
    if(currentFontSize < 24) {
      currentFontSize += 2;
      setFontSize(currentFontSize);
    }
  });
  
  document.getElementById('btnFontDec').addEventListener('click', () => {
    if(currentFontSize > 12) {
      currentFontSize -= 2;
      setFontSize(currentFontSize);
    }
  });

  // == Theming ==
  let currentTheme = localStorage.getItem('aqabaTheme') || 'default';
  const themeCircles = document.querySelectorAll('.theme-circle');

  const applyTheme = (themeName) => {
    document.body.classList.remove('theme-dark', 'theme-sand');
    if (themeName !== 'default') {
      document.body.classList.add(themeName);
    }
    localStorage.setItem('aqabaTheme', themeName);
    
    // Update active circle
    themeCircles.forEach(circle => {
      circle.classList.remove('active');
      if (circle.getAttribute('data-theme') === themeName) {
        circle.classList.add('active');
      }
    });
  };

  // Apply saved
  applyTheme(currentTheme);

  themeCircles.forEach(circle => {
    circle.addEventListener('click', (e) => {
      applyTheme(e.target.getAttribute('data-theme'));
    });
  });
}

// Call on load
document.addEventListener('DOMContentLoaded', initSettingsWidget);

