/* ================================================================
   PROJECTS-MASTER.JS — Udit Portfolio Master Project Logic
   Shared interactivity for all project detail pages.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Scroll Reveal Animation ─────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  /* ── 1b. Hero Parallax ─────────────────────────────────── */
  const heroImg = document.querySelector('.project-hero img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (scrollPos < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollPos * 0.3}px)`;
      }
    });
  }

  /* ── 2. Lightbox / Image Zoom ───────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImg) {
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = trigger.getAttribute('href');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
      setTimeout(() => { lightboxImg.setAttribute('src', ''); }, 300);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  /* ── 3. Neon Dot Cursor ─────────────────────────────────── */
  const dotOuter = document.getElementById('cursor-dot-outer');
  const dotInner = document.getElementById('cursor-dot-inner');
  
  if (dotOuter && dotInner && window.matchMedia('(hover:hover)').matches) {
    let ox = -99, oy = -99, ix = -99, iy = -99, tx = -99, ty = -99;
    
    document.addEventListener('mousemove', e => { 
      tx = e.clientX; 
      ty = e.clientY; 
    });

    function animDots() {
      ix += (tx - ix) * 0.28; iy += (ty - iy) * 0.28;
      dotInner.style.left = ix + 'px'; dotInner.style.top  = iy + 'px';
      ox += (tx - ox) * 0.10; oy += (ty - oy) * 0.10;
      dotOuter.style.left = ox + 'px'; dotOuter.style.top  = oy + 'px';
      requestAnimationFrame(animDots);
    }
    animDots();

    const hoverEls = document.querySelectorAll('a, button, .social-card, .related-card, .back-btn, .img-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    document.addEventListener('mousedown', () => document.body.classList.add('click-active'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('click-active'));
  }

  /* ── 4. Card Tilt Effect ────────────────────────────────── */
  document.querySelectorAll('.stat-box, .social-card, .related-card, .logo-card, .type-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { 
      card.style.transform = ''; 
    });
  });

});
