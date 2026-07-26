// ============================================================
// AVORA PIG FARMING · script.js
// Hamburger toggle, scroll effects, counters, carousel, FAQ
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============ LOADING SCREEN ============
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  if (loadingScreen) {
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) progress = 100;
      if (loadingBarFill) loadingBarFill.style.width = progress + '%';
      if (progress >= 100) clearInterval(tick);
    }, 120);

    window.addEventListener('load', () => {
      setTimeout(() => {
        if (loadingBarFill) loadingBarFill.style.width = '100%';
        setTimeout(() => loadingScreen.classList.add('hidden'), 250);
      }, 400);
    });
    setTimeout(() => loadingScreen.classList.add('hidden'), 3500);
  }

  // ============ HAMBURGER MENU TOGGLE ============
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ============ SCROLL PROGRESS ============
  const progressFill = document.getElementById('scroll-progress-fill');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ============ BACK TO TOP ============
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============ NAV CONDENSE ON SCROLL ============
  const nav = document.querySelector('.glass-nav');
  const header = document.querySelector('.main-header');
  if (nav && header) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav-condensed', window.scrollY > header.offsetHeight - 120);
    }, { passive: true });
  }

  // ============ STAT COUNTER ============
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          animateNumber(el, target);
        }
      }
    });
  }, { threshold: 0.4 });
  statNumbers.forEach(el => counterObserver.observe(el));

  function animateNumber(el, target) {
    const duration = 1400;
    const start = performance.now();
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(t);
      el.textContent = Math.round(eased * target);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + '+';
      }
    }
    requestAnimationFrame(step);
  }

  // ============ TESTIMONIAL CAROUSEL ============
  const track = document.querySelector('.testimonial-track');
  const dotsWrap = document.querySelector('.carousel-dots');
  if (track && dotsWrap) {
    const slides = track.querySelectorAll('.testimonial-slide');
    const dots = dotsWrap.querySelectorAll('.dot-btn');
    let current = 0;
    let autoTimer;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function stopAuto() { clearInterval(autoTimer); }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); stopAuto(); startAuto(); });
    });

    const viewport = document.querySelector('.testimonial-viewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', stopAuto);
      viewport.addEventListener('mouseleave', startAuto);
    }
    goTo(0);
    startAuto();
  }

  // ============ FAQ ACCORDION ============
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const faqItem = question.closest('.faq-item');

      // Close all others
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        q.closest('.faq-item').classList.remove('active');
      });

      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('active');
      }
    });
  });

  // ============ GALLERY LIGHTBOX ============
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('src');
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; cursor: pointer; padding: 2rem;
        animation: fadeIn 0.25s ease;
      `;
      overlay.innerHTML = `
        <img src="${src}" alt="AVORA pig" style="
          max-width: 90vw; max-height: 90vh; border-radius: 24px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6); object-fit: contain;
        ">
        <span style="position:absolute; top:1.5rem; right:2rem; color:#fff; font-size:2.5rem; font-weight:300; opacity:0.7;">✕</span>
      `;
      overlay.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';
      });
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
    });
  });

  // Lightbox fade-in style
  if (!document.getElementById('lightbox-style')) {
    const style = document.createElement('style');
    style.id = 'lightbox-style';
    style.textContent = `@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`;
    document.head.appendChild(style);
  }

  // ============ ACTIVE NAV LINK ON SCROLL ============
  const navLinkEls = document.querySelectorAll('.glass-nav a[href^="#"]');
  const sections = Array.from(navLinkEls)
    .map(link => document.getElementById(link.getAttribute('href').substring(1)))
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.glass-nav a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinkEls.forEach(l => l.classList.remove('active-link'));
          link.classList.add('active-link');
        }
      });
    }, { threshold: 0.3, rootMargin: '-30% 0px -50% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  // ============ SMOOTH SCROLL FOR NAV LINKS ============
  document.querySelectorAll('.glass-nav a[href^="#"], .btn-primary[href^="#"], .btn-secondary[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, href);
        }
      }
    });
  });

  console.log('🐖 AVORA PIG FARMING — healthy pigs, trusted farming.');
});