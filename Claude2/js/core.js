/**
 * CORE.JS - JavaScript Commun
 * Fonctionnalités partagées par toutes les pages
 * Chargé une seule fois et mis en cache
 */

// ===========================================
// CONFIGURATION & CONSTANTES
// ===========================================

const AppConfig = {
  // Sélecteurs DOM
  selectors: {
    navbar: '#navbar',
    progressBar: '#progressBar',
    scrollTop: '#scrollTop',
    mobileMenuBtn: '.mobile-menu-btn',
    navLinks: '.nav-links',
    navLink: '.nav-link',
    langBtn: '.lang-btn',
    fadeIn: '.fade-in'
  },
  
  // Classes CSS
  classes: {
    scrolled: 'scrolled',
    active: 'active',
    visible: 'visible',
    usingKeyboard: 'using-keyboard'
  },
  
  // Seuils et valeurs
  thresholds: {
    navbarScroll: 100,
    scrollTopShow: 300,
    intersectionThreshold: 0.1,
    intersectionRootMargin: '0px 0px -50px 0px'
  },

  // Debounce delays (ms)
  debounce: {
    scroll: 10,
    resize: 250
  }
};

// ===========================================
// UTILITIES
// ===========================================

const Utils = {
  /**
   * Debounce function pour optimiser les événements fréquents
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function pour limiter la fréquence d'exécution
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Smooth scroll vers un élément
   */
  smoothScroll(target, offset = 0) {
    if (!target) return;
    
    const targetPosition = target.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Vérifie si un élément est visible dans le viewport
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Sauvegarde sécurisée dans localStorage
   */
  setStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('Impossible de sauvegarder dans localStorage:', e);
      return false;
    }
  },

  /**
   * Lecture sécurisée depuis localStorage
   */
  getStorage(key, defaultValue = null) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (e) {
      console.warn('Impossible de lire localStorage:', e);
      return defaultValue;
    }
  }
};

// ===========================================
// LANGUAGE MANAGEMENT
// ===========================================

const LanguageManager = {
  currentLang: 'fr',
  
  init() {
    this.bindEvents();
    this.loadSavedLanguage();
  },

  bindEvents() {
    // Event delegation pour les boutons de langue
    document.addEventListener('click', (e) => {
      if (e.target.matches('.lang-btn')) {
        const lang = e.target.dataset.lang;
        if (lang) {
          this.setLanguage(lang);
        }
      }
    });
  },

  setLanguage(lang) {
    if (!['fr', 'en'].includes(lang)) {
      console.warn('Langue non supportée:', lang);
      return;
    }

    // Mettre à jour la classe body
    document.body.className = document.body.className.replace(/lang-\w+/, `lang-${lang}`);
    
    // Mettre à jour les boutons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Sauvegarder la préférence
    Utils.setStorage('language', lang);
    this.currentLang = lang;

    // Dispatch event pour les autres modules
    document.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
  },

  loadSavedLanguage() {
    const savedLang = Utils.getStorage('language', 'fr');
    this.setLanguage(savedLang);
  }
};

// ===========================================
// NAVIGATION MANAGEMENT
// ===========================================

const NavigationManager = {
  navbar: null,
  isScrolled: false,
  
  init() {
    this.navbar = document.querySelector(AppConfig.selectors.navbar);
    if (!this.navbar) {
      console.warn('Navbar non trouvée');
      return;
    }

    this.bindEvents();
    this.initMobileMenu();
    this.initSmoothScrolling();
    this.updateActiveLink();
  },

  bindEvents() {
    // Scroll optimisé avec throttle
    const handleScroll = Utils.throttle(() => {
      this.handleScroll();
      this.updateActiveLink();
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
  },

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollTop > AppConfig.thresholds.navbarScroll;
    
    if (shouldBeScrolled !== this.isScrolled) {
      this.isScrolled = shouldBeScrolled;
      this.navbar.classList.toggle(AppConfig.classes.scrolled, shouldBeScrolled);
    }
  },

  initMobileMenu() {
    const mobileMenuBtn = document.querySelector(AppConfig.selectors.mobileMenuBtn);
    const navLinks = document.querySelector(AppConfig.selectors.navLinks);
    
    if (!mobileMenuBtn || !navLinks) return;

    // Toggle menu mobile
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle(AppConfig.classes.active);
      mobileMenuBtn.classList.toggle(AppConfig.classes.active);
    });

    // Fermer le menu au clic sur un lien
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link')) {
        navLinks.classList.remove(AppConfig.classes.active);
        mobileMenuBtn.classList.remove(AppConfig.classes.active);
      }
    });

    // Fermer le menu au clic extérieur
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove(AppConfig.classes.active);
        mobileMenuBtn.classList.remove(AppConfig.classes.active);
      }
    });
  },

  initSmoothScrolling() {
    // Event delegation pour tous les liens anchor
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        Utils.smoothScroll(target, 80); // Offset pour navbar fixe
      }
    });
  },

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;

    let current = '';
    const scrollPos = window.pageYOffset + 200; // Offset pour activation anticipée

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Mettre à jour les liens actifs
    navLinks.forEach(link => {
      link.classList.remove(AppConfig.classes.active);
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add(AppConfig.classes.active);
      }
    });
  }
};

// ===========================================
// PROGRESS BAR
// ===========================================

const ProgressBarManager = {
  progressBar: null,
  
  init() {
    this.progressBar = document.querySelector(AppConfig.selectors.progressBar);
    if (!this.progressBar) return;

    this.bindEvents();
  },

  bindEvents() {
    const updateProgress = Utils.throttle(() => {
      this.updateProgress();
    }, AppConfig.debounce.scroll);

    window.addEventListener('scroll', updateProgress, { passive: true });
  },

  updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    this.progressBar.style.width = `${Math.min(scrolled, 100)}%`;
  }
};

// ===========================================
// SCROLL TO TOP
// ===========================================

const ScrollToTopManager = {
  button: null,
  isVisible: false,
  
  init() {
    this.button = document.querySelector(AppConfig.selectors.scrollTop);
    if (!this.button) return;

    this.bindEvents();
  },

  bindEvents() {
    // Scroll handler optimisé
    const handleScroll = Utils.throttle(() => {
      this.handleScroll();
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Click handler
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });
  },

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeVisible = scrollTop > AppConfig.thresholds.scrollTopShow;
    
    if (shouldBeVisible !== this.isVisible) {
      this.isVisible = shouldBeVisible;
      this.button.classList.toggle(AppConfig.classes.visible, shouldBeVisible);
    }
  },

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// ===========================================
// ANIMATIONS MANAGER
// ===========================================

const AnimationsManager = {
  observer: null,
  
  init() {
    this.initIntersectionObserver();
    this.observeElements();
  },

  initIntersectionObserver() {
    // Vérifier le support
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver non supporté, affichage direct des éléments');
      this.fallbackAnimation();
      return;
    }

    const options = {
      threshold: AppConfig.thresholds.intersectionThreshold,
      rootMargin: AppConfig.thresholds.intersectionRootMargin
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(AppConfig.classes.visible);
          // Stop observing once animated
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  },

  observeElements() {
    if (!this.observer) return;

    const elements = document.querySelectorAll(AppConfig.selectors.fadeIn);
    elements.forEach(el => {
      this.observer.observe(el);
    });
  },

  fallbackAnimation() {
    // Fallback pour navigateurs sans IntersectionObserver
    const elements = document.querySelectorAll(AppConfig.selectors.fadeIn);
    elements.forEach(el => {
      el.classList.add(AppConfig.classes.visible);
    });
  },

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};

// ===========================================
// ACCESSIBILITY MANAGER
// ===========================================

const AccessibilityManager = {
  init() {
    this.initKeyboardNavigation();
    this.initFocusManagement();
    this.initReducedMotion();
  },

  initKeyboardNavigation() {
    // Détecter l'utilisation du clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add(AppConfig.classes.usingKeyboard);
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove(AppConfig.classes.usingKeyboard);
    });
  },

  initFocusManagement() {
    // Améliorer la navigation au clavier
    document.addEventListener('keydown', (e) => {
      // Escape ferme les menus ouverts
      if (e.key === 'Escape') {
        const activeMenu = document.querySelector('.nav-links.active');
        if (activeMenu) {
          activeMenu.classList.remove(AppConfig.classes.active);
          const menuBtn = document.querySelector('.mobile-menu-btn.active');
          if (menuBtn) {
            menuBtn.classList.remove(AppConfig.classes.active);
            menuBtn.focus();
          }
        }
      }
    });
  },

  initReducedMotion() {
    // Respecter les préférences de mouvement réduit
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition', '0.01ms');
      document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
  }
};

// ===========================================
// ERROR HANDLING
// ===========================================

const ErrorHandler = {
  init() {
    // Capturer les erreurs JavaScript
    window.addEventListener('error', (e) => {
      console.error('Erreur JavaScript:', e.error);
      this.logError('JavaScript Error', e.error);
    });

    // Capturer les promesses rejetées
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Promise rejetée:', e.reason);
      this.logError('Unhandled Promise Rejection', e.reason);
    });
  },

  logError(type, error) {
    // En production, vous pourriez envoyer ces erreurs à un service de monitoring
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${type}: ${error.message || error}`,
        fatal: false
      });
    }
  }
};

// ===========================================
// MAIN APP CONTROLLER
// ===========================================

const App = {
  modules: [
    LanguageManager,
    NavigationManager,
    ProgressBarManager,
    ScrollToTopManager,
    AnimationsManager,
    AccessibilityManager,
    ErrorHandler
  ],

  init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  },

  start() {
    console.log('🚀 Initialisation de l\'application...');
    
    try {
      // Initialiser tous les modules
      this.modules.forEach(module => {
        if (module.init && typeof module.init === 'function') {
          module.init();
        }
      });

      console.log('✅ Application initialisée avec succès');
      
      // Dispatcher event global
      document.dispatchEvent(new CustomEvent('appReady'));
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      ErrorHandler.logError('App Initialization Error', error);
    }
  },

  destroy() {
    // Nettoyer les ressources si nécessaire
    if (AnimationsManager.observer) {
      AnimationsManager.destroy();
    }
  }
};

// ===========================================
// EXPORT & AUTO-INIT
// ===========================================

// Exposer l'API globale pour debug et extensions
window.MaeApp = {
  App,
  Utils,
  LanguageManager,
  NavigationManager,
  ProgressBarManager,
  ScrollToTopManager,
  AnimationsManager,
  AccessibilityManager,
  AppConfig
};

// Auto-initialisation
App.init();