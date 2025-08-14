/**
 * PAGES.JS - JavaScript Spécifique par Page
 * Fonctionnalités uniques selon la page courante
 * Chargé après core.js
 */

// ===========================================
// PAGE DETECTION
// ===========================================

const PageDetector = {
  getCurrentPage() {
    // Détecter la page depuis l'URL
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (!filename || filename === 'index.html' || filename === '') {
      return 'home';
    }
    
    return filename.replace('.html', '');
  },

  getPageFromBody() {
    // Alternative: détecter depuis un attribut data-page sur body
    return document.body.dataset.page || this.getCurrentPage();
  }
};

// ===========================================
// HOME PAGE (index.html)
// ===========================================

const HomePage = {
  init() {
    console.log('🏠 Initialisation page d\'accueil');
    this.initContactForm();
    this.initFAQ();
    this.initResourceDownloads();
    this.initHeroStats();
  },

  /**
   * Gestion du formulaire de contact
   */
  initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleContactSubmission(form);
    });
  },

  async handleContactSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
      // Afficher état de chargement
      submitBtn.disabled = true;
      submitBtn.textContent = document.body.classList.contains('lang-fr') 
        ? 'Envoi en cours...' 
        : 'Sending...';

      // Collecter les données
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Validation client-side
      if (!this.validateContactForm(data)) {
        throw new Error('Données invalides');
      }

      // Log pour debug (en production, envoyer au serveur)
      console.log('📧 Formulaire soumis:', data);
      
      // Simuler envoi (remplacer par vraie API)
      await this.simulateFormSubmission(data);
      
      // Succès
      this.showFormSuccess();
      form.reset();
      
      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          form_name: 'contact',
          form_location: 'homepage'
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur formulaire:', error);
      this.showFormError(error.message);
    } finally {
      // Restaurer le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  },

  validateContactForm(data) {
    const { name, email, practice, message } = data;
    
    // Validation basique
    if (!name || name.length < 2) return false;
    if (!email || !this.isValidEmail(email)) return false;
    if (!practice) return false;
    if (!message || message.length < 10) return false;
    
    return true;
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  async simulateFormSubmission(data) {
    // Simuler délai réseau
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  },

  showFormSuccess() {
    const message = document.body.classList.contains('lang-fr')
      ? 'Merci ! Je vous contacterai dans les 24h.'
      : 'Thank you! I will contact you within 24h.';
    
    this.showAlert(message, 'success');
  },

  showFormError(error) {
    const message = document.body.classList.contains('lang-fr')
      ? `Erreur : ${error}. Veuillez réessayer.`
      : `Error: ${error}. Please try again.`;
    
    this.showAlert(message, 'error');
  },

  showAlert(message, type = 'info') {
    // Créer notification toast
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#22c55e' : '#ef4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      z-index: 1000;
      transition: all 0.3s ease;
      transform: translateX(100%);
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Animation d'entrée
    setTimeout(() => {
      alert.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-suppression
    setTimeout(() => {
      alert.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }, 4000);
  },

  /**
   * Gestion des FAQ
   */
  initFAQ() {
    const faqContainer = document.querySelector('.faq-container') || document.body;
    
    // Event delegation pour les boutons FAQ
    faqContainer.addEventListener('click', (e) => {
      const faqQuestion = e.target.closest('.faq-question');
      if (!faqQuestion) return;
      
      this.toggleFAQ(faqQuestion);
    });
  },

  toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    if (!faqItem) return;
    
    const isActive = faqItem.classList.contains('active');
    
    // Fermer toutes les autres FAQ
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('active');
      }
    });
    
    // Toggle l'item courant
    faqItem.classList.toggle('active', !isActive);
    
    // Analytics
    if (!isActive && typeof gtag !== 'undefined') {
      const questionText = questionElement.textContent.trim().substring(0, 50);
      gtag('event', 'faq_expand', {
        faq_question: questionText
      });
    }
  },

  /**
   * Téléchargements de ressources
   */
  initResourceDownloads() {
    // Event delegation pour les boutons de téléchargement
    document.addEventListener('click', (e) => {
      const downloadBtn = e.target.closest('[data-download]');
      if (!downloadBtn) return;
      
      e.preventDefault();
      const resourceType = downloadBtn.dataset.download;
      this.handleResourceDownload(resourceType);
    });
  },

  handleResourceDownload(resourceType) {
    const resources = {
      'checklist': {
        filename: 'checklist-patient-acquisition.pdf',
        title: 'Patient Acquisition Checklist'
      },
      'journey-map': {
        filename: 'patient-journey-map-template.pdf',
        title: 'Patient Journey Map Template'
      },
      'hipaa-guide': {
        filename: 'hipaa-compliance-guide.pdf',
        title: 'HIPAA Compliance Guide'
      }
    };

    const resource = resources[resourceType];
    if (!resource) {
      console.warn('Resource type non reconnu:', resourceType);
      return;
    }

    // Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'file_download', {
        file_name: resource.filename,
        file_type: 'pdf',
        resource_category: 'marketing_guide'
      });
    }

    // En production, déclencher le vrai téléchargement
    console.log('📥 Téléchargement simulé:', resource.filename);
    
    const message = document.body.classList.contains('lang-fr')
      ? `Téléchargement de ${resource.filename} commencé !`
      : `Download of ${resource.filename} started!`;
    
    this.showAlert(message, 'success');
    
    // TODO: Remplacer par vraie logique de téléchargement
    // window.open(`/downloads/${resource.filename}`, '_blank');
  },

  /**
   * Animation des statistiques hero
   */
  initHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    // Observer pour animer au scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStatNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  },

  animateStatNumber(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasStar = text.includes('★');
    const isNegative = text.includes('-');
    
    let targetValue = parseFloat(text.replace(/[^\d.-]/g, ''));
    if (isNaN(targetValue)) return;

    let currentValue = 0;
    const increment = targetValue / 60; // 60 frames pour 1 seconde
    const suffix = hasPercent ? '%' : hasStar ? '★' : '';
    const prefix = isNegative ? '-' : hasPercent || hasStar ? '+' : '';

    const animate = () => {
      currentValue += increment;
      if (currentValue < targetValue) {
        element.textContent = prefix + Math.floor(currentValue) + suffix;
        requestAnimationFrame(animate);
      } else {
        element.textContent = text; // Valeur finale exacte
      }
    };

    animate();
  }
};

// ===========================================
// ABOUT PAGE (about.html)
// ===========================================

const AboutPage = {
  init() {
    console.log('👤 Initialisation page à propos');
    this.initTimelineAnimation();
    this.initCredentialsHover();
  },

  initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Animation séquentielle avec délai
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 200);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    timelineItems.forEach((item, index) => {
      // Style initial pour l'animation
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      observer.observe(item);
    });
  },

  initCredentialsHover() {
    const credentialItems = document.querySelectorAll('.credential-item');
    
    credentialItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
};

// ===========================================
// EXPERIENCE PAGE (experience.html)
// ===========================================

const ExperiencePage = {
  init() {
    console.log('💼 Initialisation page expérience');
    this.initExperienceCards();
    this.initSkillsFilter();
  },

  initExperienceCards() {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
      card.addEventListener('click', () => {
        this.expandCard(card);
      });
    });
  },

  expandCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Fermer toutes les autres cartes
    document.querySelectorAll('.experience-card.expanded').forEach(c => {
      if (c !== card) {
        c.classList.remove('expanded');
      }
    });
    
    // Toggle la carte courante
    card.classList.toggle('expanded', !isExpanded);
    
    if (!isExpanded) {
      // Scroll vers la carte
      setTimeout(() => {
        card.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  },

  initSkillsFilter() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const skill = tag.textContent.trim();
        this.filterBySkill(skill);
      });
    });
  },

  filterBySkill(skill) {
    console.log('🔍 Filtrage par compétence:', skill);
    
    // Mettre en évidence les cartes contenant cette compétence
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
      const cardSkills = Array.from(card.querySelectorAll('.skill-tag'))
        .map(tag => tag.textContent.trim());
      
      if (cardSkills.includes(skill)) {
        card.classList.add('highlighted');
        setTimeout(() => {
          card.classList.remove('highlighted');
        }, 2000);
      }
    });
  }
};

// ===========================================
// ACHIEVEMENTS PAGE (achievements.html)
// ===========================================

const AchievementsPage = {
  init() {
    console.log('🏆 Initialisation page réalisations');
    this.initAchievementCards();
    this.initAwardGallery();
  },

  initAchievementCards() {
    const cards = document.querySelectorAll('.card[data-year]');
    
    cards.forEach(card => {
      const year = card.dataset.year;
      if (year) {
        this.addYearBadge(card, year);
      }
    });
  },

  addYearBadge(card, year) {
    const badge = document.createElement('div');
    badge.className = 'year-badge';
    badge.textContent = year;
    badge.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 2;
    `;
    
    card.style.position = 'relative';
    card.appendChild(badge);
  },

  initAwardGallery() {
    const awardCards = document.querySelectorAll('.card-badge');
    
    awardCards.forEach(badge => {
      badge.addEventListener('click', () => {
        this.showAwardDetails(badge);
      });
    });
  },

  showAwardDetails(badge) {
    const card = badge.closest('.card');
    if (!card) return;
    
    const title = card.querySelector('h3')?.textContent || 'Award';
    const description = card.querySelector('p')?.textContent || '';
    
    console.log('🏆 Détails award:', { title, description });
    
    // TODO: Implémenter modal ou expansion pour détails
  }
};

// ===========================================
// PAGE ROUTER
// ===========================================

const PageRouter = {
  pages: {
    'home': HomePage,
    'about': AboutPage,
    'experience': ExperiencePage,
    'achievements': AchievementsPage
  },

  init() {
    // Attendre que l'app principale soit prête
    document.addEventListener('appReady', () => {
      this.initCurrentPage();
    });
    
    // Fallback si appReady ne se déclenche pas
    setTimeout(() => {
      this.initCurrentPage();
    }, 1000);
  },

  initCurrentPage() {
    const currentPage = PageDetector.getCurrentPage();
    const pageHandler = this.pages[currentPage];
    
    if (pageHandler && typeof pageHandler.init === 'function') {
      try {
        pageHandler.init();
        console.log(`✅ Page ${currentPage} initialisée`);
      } catch (error) {
        console.error(`❌ Erreur initialisation page ${currentPage}:`, error);
      }
    } else {
      console.log(`ℹ️ Aucun handler spécifique pour la page: ${currentPage}`);
    }
  }
};

// ===========================================
// ANALYTICS HELPER
// ===========================================

const Analytics = {
  track(event, data = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event, data);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', event, data);
    }
    
    console.log('📊 Analytics event:', event, data);
  },

  trackPageView(page) {
    this.track('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
};

// ===========================================
// GLOBAL FUNCTIONS (backward compatibility)
// ===========================================

// Exposer les fonctions globales pour compatibilité
window.toggleFaq = (element) => {
  HomePage.toggleFAQ(element);
};

window.downloadResource = (type) => {
  HomePage.handleResourceDownload(type);
};

// ===========================================
// AUTO-INIT
// ===========================================

// Initialiser le routeur de pages
PageRouter.init();

// Exposer l'API pour debug
if (window.MaeApp) {
  window.MaeApp.Pages = {
    HomePage,
    AboutPage,
    ExperiencePage,
    AchievementsPage,
    PageRouter,
    Analytics
  };
}