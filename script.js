// script.js – AVORA PIG FARMING · Premium

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ LOADING SCREEN ============ */
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

  /* ============ SCROLL PROGRESS ============ */
  const progressFill = document.getElementById('scroll-progress-fill');
  const progressPig = document.getElementById('scroll-progress-pig');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressPig) progressPig.style.left = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ============ PARALLAX BACKGROUND EFFECTS ============ */
  const bgPhotos = document.querySelectorAll('.section-bg-soft > .bg-photo-wrap .bg-photo');
  function updateParallax() {
    const scrollTop = window.scrollY;
    bgPhotos.forEach(bg => {
      const section = bg.closest('.section-bg-soft');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollTop;
      
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const yPos = (scrollTop - sectionTop) * 0.2;
        bg.style.transform = `scale(1.1) translateY(${yPos}px)`;
      }
    });
  }
  if (!reduceMotion && bgPhotos.length) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ============ BACKGROUND VIDEOS (disabled - using static images instead) ============ */
  // Videos replaced with static images for GitHub Pages compatibility

  /* ============ PARTICLES ============ */
  const particleContainer = document.getElementById('particles');
  if (particleContainer && !reduceMotion) {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 3 + Math.random() * 5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (12 + Math.random() * 14) + 's';
      p.style.animationDelay = (Math.random() * 14) + 's';
      particleContainer.appendChild(p);
    }
  }

  /* ============ STAT COUNTER ANIMATION ============ */
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

  /* ============ SMOOTH SCROLL ============ */
  document.querySelectorAll('.glass-nav a, .btn-primary[href^="#"], .btn-secondary[href^="#"], .service-link[href^="#"]').forEach(link => {
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

  /* ============ NAV: condense on scroll + active link ============ */
  const nav = document.querySelector('.glass-nav');
  const header = document.querySelector('.main-header');
  if (nav && header) {
    const toggleCondensed = () => {
      nav.classList.toggle('nav-condensed', window.scrollY > header.offsetHeight - 120);
    };
    window.addEventListener('scroll', toggleCondensed, { passive: true });
    toggleCondensed();
  }

  const navLinks = document.querySelectorAll('.glass-nav a[href^="#"]');
  const navSections = Array.from(navLinks).map(link => document.getElementById(link.getAttribute('href').substring(1))).filter(Boolean);
  if (navSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.glass-nav a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active-link'));
          link.classList.add('active-link');
        }
      });
    }, { threshold: 0.3, rootMargin: '-30% 0px -50% 0px' });
    navSections.forEach(section => navObserver.observe(section));
  }

  /* ============ BUTTON RIPPLE ============ */
  document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ============ GALLERY LIGHTBOX ============ */
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

  if (!document.getElementById('lightbox-style')) {
    const style = document.createElement('style');
    style.id = 'lightbox-style';
    style.textContent = `@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`;
    document.head.appendChild(style);
  }

  /* ============ SERVICE CARD TILT ============ */
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      if (reduceMotion) return;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ============ TESTIMONIAL CAROUSEL ============ */
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

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); stopAuto(); startAuto(); }));
    const viewport = document.querySelector('.testimonial-viewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', stopAuto);
      viewport.addEventListener('mouseleave', startAuto);
    }
    goTo(0);
    startAuto();
  }

  /* ============ FAQ ACCORDION ============ */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const faqItem = question.closest('.faq-item');
      
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

  /* ============ BACK TO TOP BUTTON ============ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ TIMELINE + FOOTER IN-VIEW TRIGGERS ============ */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) timeline.classList.add('in-view');
      });
    }, { threshold: 0.15 });
    timelineObserver.observe(timeline);

    const items = timeline.querySelectorAll('.timeline-item');
    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 100);
          itemObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    items.forEach(item => itemObserver.observe(item));
  }

  const footerScene = document.querySelector('.footer-scene');
  if (footerScene) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) footerScene.classList.add('in-view');
      });
    }, { threshold: 0.3 });
    footerObserver.observe(footerScene);
  }

  /* ============ GSAP SCROLL REVEALS ============ */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-reveal]').forEach(el => {
      const type = el.dataset.reveal;
      const vars = { opacity: 0 };
      if (type === 'left') vars.x = -60;
      if (type === 'right') vars.x = 60;
      if (type === 'up') vars.y = 50;
      if (type === 'zoom') vars.scale = 0.85;
      if (type === 'blur') { vars.y = 20; vars.filter = 'blur(10px)'; }

      gsap.set(el, vars);
      gsap.to(el, {
        opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)',
        duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    const serviceGrid = document.querySelector('.service-grid');
    if (serviceGrid) {
      gsap.from('.service-card', {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: serviceGrid, start: 'top 85%' }
      });
    }

    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
      gsap.from('.gallery-item', {
        opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: galleryGrid, start: 'top 88%' }
      });
    }

    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
      gsap.from('.pricing-card', {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: pricingGrid, start: 'top 85%' }
      });
    }

    const faqGrid = document.querySelector('.faq-grid');
    if (faqGrid) {
      gsap.from('.faq-item', {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: faqGrid, start: 'top 88%' }
      });
    }

    // Parallax on background wraps
    document.querySelectorAll('.bg-photo-wrap').forEach(wrap => {
      const container = wrap.closest('header, section');
      if (!container) return;
      const isHeader = container.tagName.toLowerCase() === 'header';
      gsap.to(wrap, {
        yPercent: 12, ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: isHeader ? 'top top' : 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = 1;
    });
  }

  console.log('🐖 AVORA PIG FARMING — healthy pigs, trusted farming.');
});