// Script for interactive behaviours and bilingual support
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const langFrBtn = document.getElementById('langFr');
  const langEnBtn = document.getElementById('langEn');

  // Toggle mobile navigation
  navToggle?.addEventListener('click', () => {
    navList.classList.toggle('open');
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        navList.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Intersection observer to reveal elements
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section, .card, .case-item, .resource-item, .faq-list details').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Translations
  const translations = {
    fr: {
      navHome: 'Accueil',
      navServices: 'Services',
      navCases: 'Études de cas',
      navTeaching: 'Enseignement',
      navResources: 'Ressources',
      navFaq: 'FAQ',
      navContact: 'Contact',
      heroTitle: 'Marketing santé avec crédibilité clinique',
      heroSubtitle: 'Des stratégies qui placent les patients au cœur de votre croissance.',
      ctaConsult: 'Réserver une consultation',
      ctaChecklist: 'Télécharger la checklist',
      aboutTitle: 'À propos',
      aboutParagraph1: 'Mae Ellicent Basiratmand combine une rigueur clinique d’infirmière diplômée (BSN, MS, RN) avec plus de 10 ans d’expérience en marketing numérique.',
      aboutParagraph2: 'En tant que professeure adjointe au College of Business de la Florida Atlantic University, elle enseigne le marketing digital et accompagne les leaders de la santé vers une croissance durable et conforme.',
      servicesTitle: 'Services',
      serviceAuditTitle: 'Audit & Stratégie',
      serviceAuditDesc: 'Analyse holistique de votre présence digitale, conformité et parcours patient pour créer un plan d’action personnalisé.',
      serviceGrowthTitle: 'Direction Marketing Fractionnelle',
      serviceGrowthDesc: 'Accompagnement mensuel en tant que directrice marketing externe pour piloter votre croissance et vos équipes.',
      serviceLaunchTitle: 'Lancement & Go-to-Market',
      serviceLaunchDesc: 'Création de campagnes de lancement pour dispositifs médicaux, cliniques et services innovants dans le respect des normes.',
      casesTitle: 'Études de cas',
      case1Title: 'Clinique de physiothérapie',
      case1Desc: 'Refonte de la stratégie digitale : +40 % de rendez-vous, réduction de 30 % du coût d’acquisition.',
      case2Title: 'Startup med-tech',
      case2Desc: 'Campagne de lancement FDA-compliant générant 500 leads qualifiés en 3 mois.',
      case3Title: 'Centre de chirurgie dentaire',
      case3Desc: 'Audit SEO et marketing local : +60 % d’avis positifs et meilleure visibilité sur Google.',
      teachingTitle: 'Enseignement & Conférences',
      teachingCourse1: 'Cours de marketing numérique et médias sociaux (FAU College of Business)',
      teachingCourse2: 'Bootcamps Executive MHA/OMHA : stratégies cross‑canal',
      teachingCourse3: 'Webinar “Pop‑Culture Advertising”',
      teachingCta: 'Inviter Mae à intervenir',
      resourcesTitle: 'Ressources',
      resource1Title: 'Checklist – Acquisition de patients',
      resource1Desc: '10 actions rapides pour optimiser votre parcours patient et attirer plus de rendez-vous.',
      resource2Title: 'Guide – Publicité conforme HIPAA',
      resource2Desc: 'Comprendre les règles et éviter les pièges légaux dans vos campagnes de marketing santé.',
      resourceDownload: 'Télécharger',
      newsletterLabel: 'Recevez nos guides exclusifs :',
      newsletterSubmit: 'S’inscrire',
      faqTitle: 'Questions fréquentes',
      faq1Question: 'Quelle est votre expérience dans le marketing santé ?',
      faq1Answer: 'Avec un background infirmier et 10 ans en marketing digital, Mae apporte une expertise unique pour les praticiens de la santé.',
      faq2Question: 'Proposez-vous des formations individuelles ?',
      faq2Answer: 'Oui, des sessions d’accompagnement personnalisées sont disponibles pour vous ou votre équipe.',
      faq3Question: 'Travaillez-vous avec des startups ?',
      faq3Answer: 'Absolument ! Nous aidons les startups med‑tech à concevoir et exécuter des stratégies go-to-market conformes.',
      contactTitle: 'Contact',
      contactText: 'Vous souhaitez discuter d’un projet ou d’une collaboration ? Remplissez le formulaire ci-dessous.',
      contactNameLabel: 'Nom',
      contactEmailLabel: 'Email',
      contactMessageLabel: 'Message',
      contactSubmit: 'Envoyer',
      footerRights: 'Tous droits réservés.'
    },
    en: {
      navHome: 'Home',
      navServices: 'Services',
      navCases: 'Case Studies',
      navTeaching: 'Teaching',
      navResources: 'Resources',
      navFaq: 'FAQ',
      navContact: 'Contact',
      heroTitle: 'Healthcare marketing with clinical credibility',
      heroSubtitle: 'Strategies that put patients at the heart of your growth.',
      ctaConsult: 'Book a consultation',
      ctaChecklist: 'Download the checklist',
      aboutTitle: 'About',
      aboutParagraph1: 'Mae Ellicent Basiratmand combines clinical rigour as a registered nurse (BSN, MS, RN) with over 10 years of digital marketing experience.',
      aboutParagraph2: 'As an adjunct professor at Florida Atlantic University’s College of Business, she teaches digital marketing and guides healthcare leaders toward sustainable, compliant growth.',
      servicesTitle: 'Services',
      serviceAuditTitle: 'Audit & Strategy',
      serviceAuditDesc: 'Holistic analysis of your digital presence, compliance and patient journey to create a tailored action plan.',
      serviceGrowthTitle: 'Fractional Marketing Director',
      serviceGrowthDesc: 'Monthly support as your external marketing director to steer your growth and teams.',
      serviceLaunchTitle: 'Launch & Go-to-Market',
      serviceLaunchDesc: 'Creation of launch campaigns for medical devices, clinics and innovative services within regulatory boundaries.',
      casesTitle: 'Case Studies',
      case1Title: 'Physical Therapy Clinic',
      case1Desc: 'Revamped digital strategy: +40 % appointments and 30 % lower acquisition costs.',
      case2Title: 'Med-tech Startup',
      case2Desc: 'FDA-compliant launch campaign generating 500 qualified leads in 3 months.',
      case3Title: 'Dental Surgery Center',
      case3Desc: 'SEO audit & local marketing: +60 % positive reviews and improved Google visibility.',
      teachingTitle: 'Teaching & Speaking',
      teachingCourse1: 'Digital marketing & social media courses (FAU College of Business)',
      teachingCourse2: 'Executive MHA/OMHA bootcamps: cross-channel strategies',
      teachingCourse3: 'Webinar “Pop‑Culture Advertising”',
      teachingCta: 'Invite Mae to speak',
      resourcesTitle: 'Resources',
      resource1Title: 'Checklist – Patient Acquisition',
      resource1Desc: '10 quick actions to optimise your patient journey and attract more appointments.',
      resource2Title: 'Guide – HIPAA compliant advertising',
      resource2Desc: 'Understand the rules and avoid legal pitfalls in your healthcare marketing campaigns.',
      resourceDownload: 'Download',
      newsletterLabel: 'Receive our exclusive guides:',
      newsletterSubmit: 'Subscribe',
      faqTitle: 'Frequently asked questions',
      faq1Question: 'What is your experience in healthcare marketing?',
      faq1Answer: 'With a nursing background and 10 years in digital marketing, Mae brings unique expertise for healthcare practitioners.',
      faq2Question: 'Do you offer one-on-one trainings?',
      faq2Answer: 'Yes, personalised coaching sessions are available for you or your team.',
      faq3Question: 'Do you work with startups?',
      faq3Answer: 'Absolutely! We help med-tech startups design and execute compliant go-to-market strategies.',
      contactTitle: 'Contact',
      contactText: 'Would you like to discuss a project or collaboration? Fill out the form below.',
      contactNameLabel: 'Name',
      contactEmailLabel: 'Email',
      contactMessageLabel: 'Message',
      contactSubmit: 'Send',
      footerRights: 'All rights reserved.'
    }
  };

  let currentLang = 'fr';
  const updateLanguage = (lang) => {
    currentLang = lang;
    document.documentElement.lang = lang;
    // Update aria-current for language buttons
    langFrBtn.setAttribute('aria-current', lang === 'fr');
    langEnBtn.setAttribute('aria-current', lang === 'en');
    // Replace text in elements with data-i18n-key
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
      const key = el.getAttribute('data-i18n-key');
      const translation = translations[lang][key];
      if (translation) {
        el.textContent = translation;
      }
    });
  };
  langFrBtn.addEventListener('click', () => updateLanguage('fr'));
  langEnBtn.addEventListener('click', () => updateLanguage('en'));
  updateLanguage(currentLang);

  // Form interception for demo mode
  function interceptForm(form, messageContainer) {
    form.addEventListener('submit', (e) => {
      if (form.action.includes('your-email@example.com')) {
        e.preventDefault();
        const msg = currentLang === 'fr' ?
          'Mode démonstration : veuillez remplacer l’adresse FormSubmit par votre email dans le code.' :
          'Demo mode: please replace the FormSubmit address with your email in the code.';
        messageContainer.textContent = msg;
        messageContainer.style.color = 'var(--color-primary)';
      }
    });
  }
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');
  const contactForm = document.getElementById('contactForm');
  const contactMessage = document.getElementById('contactMessage');
  if (newsletterForm) interceptForm(newsletterForm, newsletterMessage);
  if (contactForm) interceptForm(contactForm, contactMessage);

  // Set current year in footer
  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear();
});