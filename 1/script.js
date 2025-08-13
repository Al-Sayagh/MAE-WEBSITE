// Language switching with ARIA and persistence
const langButtons = document.querySelectorAll('.lang-btn');
function setLang(lang){
  document.body.classList.toggle('lang-en', lang==='en');
  document.body.classList.toggle('lang-fr', lang==='fr');
  langButtons.forEach(b=>{
    const active = b.dataset.lang === lang;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  // persist language
  try { localStorage.setItem('lang', lang); } catch(e){}
}
langButtons.forEach(btn=>btn.addEventListener('click', ()=> {
  const lang = btn.dataset.lang;
  setLang(lang);
}));

// Initialize language from storage or default
(() => {
  let initial = 'fr';
  try {
    const saved = localStorage.getItem('lang');
    if(saved) initial = saved;
  } catch(e){}
  setLang(initial);
})();

// IntersectionObserver for fade-up animations
const fadeEls = document.querySelectorAll('.fade-up');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
}, {threshold:.2});
fadeEls.forEach(el=>io.observe(el));

// Active nav link highlight + aria-current
const navLinks = document.querySelectorAll('.nav-link');
const sections = [...navLinks].map(a=>document.querySelector(a.getAttribute('href')));
const navIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    const id = '#' + e.target.id; 
    if(e.isIntersecting){
      navLinks.forEach(a=>{
        const active = a.getAttribute('href')===id;
        a.classList.toggle('active', active);
        if(active){ a.setAttribute('aria-current','page'); } else { a.removeAttribute('aria-current'); }
      });
    }
  });
}, {rootMargin:'-60% 0px -30% 0px', threshold:0});
sections.forEach(s=>s && navIO.observe(s));

// Year
document.getElementById('y').textContent = new Date().getFullYear();

// Lead magnet form: guard against placeholder email and show status
function interceptForm(formId, statusId){
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    const action = form.getAttribute('action') || '';
    if(action.includes('your-email@example.com')){
      e.preventDefault();
      status.textContent = document.body.classList.contains('lang-en') ? 
        'Demo mode: set your email in the form action to enable send.' :
        'Mode démo : remplacez l’email dans l’action du formulaire pour activer l’envoi.';
    }
  });
}
interceptForm('lm-form','lm-status');
interceptForm('contact-form','contact-status');

// Navigation toggle for mobile
const navElem = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
if(navElem && navToggle){
  navToggle.addEventListener('click', () => {
    navElem.classList.toggle('open');
    const expanded = navElem.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
  // Close menu when clicking a nav link (for mobile)
  navElem.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navElem.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll progress bar update
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  if(!progressBar) return;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
  const percent = (scrollTop) / (scrollHeight - clientHeight) * 100;
  progressBar.style.width = percent + '%';
}
window.addEventListener('scroll', updateProgress);
updateProgress();

// Scroll to top button
const toTopBtn = document.getElementById('toTop');
function toggleToTop(){
  if(!toTopBtn) return;
  if(window.scrollY > 500){
    toTopBtn.classList.add('show');
  } else {
    toTopBtn.classList.remove('show');
  }
}
window.addEventListener('scroll', toggleToTop);
toggleToTop();
if(toTopBtn){
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });
}

// Instant downloads for resources (works offline)
function downloadTextFile(filename, content){
  const blob = new Blob([content], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
document.getElementById('instant-checklist')?.addEventListener('click', ()=>{
  const fr = document.body.classList.contains('lang-fr');
  const title = fr ? 'Checklist — 10 quick wins (FR)\n' : 'Checklist — 10 quick wins (EN)\n';
  const items = [
    'Claim local SEO: Google Business, NAP, categories',
    'Fast homepage with clear CTA + phone',
    'Review flow at point-of-care (QR)',
    'Landing pages by specialty',
    'Tracking: GA4 + conversions',
    'Paid search for top 3 services',
    'Social calendar: 3 posts/week',
    'Email reactivation of lapsed patients',
    'FAQ page for compliance & risks',
    'Monthly KPI review: CAC, LTV, occupancy'
  ].map((x,i)=> (i+1)+'. '+x).join('\n');
  downloadTextFile(fr ? 'checklist_fr.txt' : 'checklist_en.txt', title+items+'\n');
});

document.querySelectorAll('.dl-guide').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const filename = btn.dataset.file || 'guide.txt';
    const fr = document.body.classList.contains('lang-fr');
    const content = fr ? 'Contenu de démonstration — téléchargez et remplacez par votre guide.' : 'Demo content — replace with your actual guide.';
    downloadTextFile(filename, content + '\n');
  });
});

// Default language is set via persisted localStorage in IIFE above
