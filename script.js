/* ================================================================
   script.js — Udit Portfolio v3
================================================================ */

/* ── 1. Neon Dot Cursor ──────────────────────────────────── */
const dotOuter = document.getElementById('cursor-dot-outer');
const dotInner = document.getElementById('cursor-dot-inner');

if (dotOuter && dotInner && window.matchMedia('(hover:hover)').matches) {
  let ox = -99, oy = -99;  // outer (lagged)
  let ix = -99, iy = -99;  // inner (tight)
  let tx = -99, ty = -99;  // target (mouse)

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  function animDots() {
    // Inner follows tightly
    ix += (tx - ix) * 0.28;
    iy += (ty - iy) * 0.28;
    dotInner.style.left = ix + 'px';
    dotInner.style.top  = iy + 'px';
    // Outer follows smoothly
    ox += (tx - ox) * 0.10;
    oy += (ty - oy) * 0.10;
    dotOuter.style.left = ox + 'px';
    dotOuter.style.top  = oy + 'px';
    requestAnimationFrame(animDots);
  }
  animDots();

  // Hover state
  const hoverEls = document.querySelectorAll('a, button, .svc-card, .pf-card, .tab, .pr-card, .chip, .tb-pill, .soc-a');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  // Click flash
  document.addEventListener('mousedown', () => document.body.classList.add('click-active'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('click-active'));
} else {
  if (dotOuter) dotOuter.style.display = 'none';
  if (dotInner) dotInner.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ── 2. Hero Canvas (dot-grid with mouse interaction) ─────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const BLUE = '24,119,242';
  let W, H, dots = [];
  const mouse = { x: -999, y: -999 };
  const COLS = 26, ROWS = 14;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }
  function buildDots() {
    dots = [];
    const gx = W / COLS, gy = H / ROWS;
    const isMobile = window.innerWidth <= 768;
    const baseR = isMobile ? 0.6 : 1.3;
    const minR = isMobile ? 0.2 : 0.5;
    for (let r = 0; r <= ROWS; r++) for (let c = 0; c <= COLS; c++) {
      dots.push({ ox: gx * c, oy: gy * r, t: Math.random() * Math.PI * 2, r: Math.random() * baseR + minR, base: Math.random() * .2 + .07 });
    }
  }
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    // Ambient glow
    const g1 = ctx.createRadialGradient(W * .15, H * .25, 0, W * .15, H * .25, W * .55);
    g1.addColorStop(0, `rgba(${BLUE},.16)`); g1.addColorStop(1, `rgba(${BLUE},0)`);
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    // Mouse glow
    if (mouse.x > 0) {
      const gm = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
      gm.addColorStop(0, `rgba(${BLUE},.1)`); gm.addColorStop(1, `rgba(${BLUE},0)`);
      ctx.fillStyle = gm; ctx.fillRect(0, 0, W, H);
    }
    const isMobile = window.innerWidth <= 768;
    const hoverEx = isMobile ? 1.0 : 2.2;
    dots.forEach(d => {
      d.t += .008;
      const pulse = Math.sin(d.t) * .5 + .5;
      const dx = mouse.x - d.ox, dy = mouse.y - d.oy;
      const dist = Math.hypot(dx, dy);
      const att  = dist < 150 ? (1 - dist / 150) : 0;
      const bright = d.base + att * .6 + pulse * .07;
      const cx2 = d.ox + (att > 0 ? dx * att * .16 : 0);
      const cy2 = d.oy + (att > 0 ? dy * att * .16 : 0);
      ctx.beginPath();
      ctx.arc(cx2, cy2, d.r + att * hoverEx, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BLUE},${Math.min(bright, .9)})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    canvas.style.transform = `translateY(${scrollY * 0.15}px)`;
  }, { passive: true });
  resize(); tick();
})();

/* ── 3. Typing Effect ─────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('role-type');
  if (!el) return;
  const roles = ['Graphic Designer', 'Brand Strategist', 'Visual Director', 'Illustrator', 'Photo Artist'];
  let ri = 0, ci = 0, del = false;
  function type() {
    const cur = roles[ri];
    el.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
    del ? ci-- : ci++;
    let spd = del ? 52 : 90;
    if (!del && ci === cur.length) { spd = 1800; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; spd = 400; }
    setTimeout(type, spd);
  }
  setTimeout(type, 900);
})();

/* ── 4. Sticky Nav + Active Link ──────────────────────────── */
const navbar  = document.getElementById('navbar');
const nlItems = document.querySelectorAll('.nl');
const sects   = document.querySelectorAll('section[id]');

function syncNav() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  let cur = '';
  sects.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
  nlItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}
window.addEventListener('scroll', syncNav, { passive: true });

/* ── 5. Hamburger ─────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const [s0, s1, s2] = hamburger.querySelectorAll('span');
    s1.style.opacity   = open ? '0' : '1';
    s2.style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });
  document.querySelectorAll('.nl').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  }));
}

/* ── 6. Smooth Scroll ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 74, behavior: 'smooth' }); }
  });
});

/* ── 7. Scroll Reveal Animations ──────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // If it's a staggered container, handle children
      if (e.target.classList.contains('reveal-stagger')) {
        const children = e.target.children;
        Array.from(children).forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 100);
        });
      }
      obs.unobserve(e.target);
    }
  });
}, revealOptions);
revealEls.forEach(el => revealObserver.observe(el));

/* ── 8. Skill Bar Animation ──────────────────────────────── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-fill').forEach(f => f.classList.add('animated'));
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const skCard = document.querySelector('.about-card');
if (skCard) skillObs.observe(skCard);

/* ── 9. Counter Animation ────────────────────────────────── */
function animCount(el, target, dur = 1300) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-n').forEach(n => {
        const t = parseInt(n.dataset.target || n.textContent);
        animCount(n, t);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

/* ── 10. Portfolio Tab Filter ────────────────────────────── */
const tabs  = document.querySelectorAll('.tab');
const items = document.querySelectorAll('.pf-item');
if (tabs.length > 0) {
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      items.forEach((item, i) => {
        const match = f === 'all' || item.dataset.c === f;
        item.classList.toggle('hidden', !match);
        if (match) {
          item.classList.remove('visible');
          setTimeout(() => item.classList.add('visible'), i * 40);
        }
      });
    });
  });
}

/* ── 11. Contact Form Processing ─────────────────────────── */
const form    = document.getElementById('ct-form');
const success = document.getElementById('f-ok');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Processing… <i class="ph ph-circle-notch"></i>';
    btn.disabled  = true;
    
    // Fallback to direct Email Draft
    setTimeout(() => {
      btn.innerHTML = orig; 
      btn.disabled = false;
      
      const n = document.getElementById('fn').value.trim();
      const em = document.getElementById('fe').value.trim();
      const s = document.getElementById('fs').value;
      const m = document.getElementById('fm').value.trim();
      const subject = encodeURIComponent('Portfolio Inquiry from ' + n);
      const body = encodeURIComponent('Name: ' + n + '\nEmail: ' + em + '\nRequested Service: ' + s + '\n\nMessage:\n' + m);
      
      if (window.innerWidth > 768) {
        // Desktop: Open Gmail in web browser
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=udit59692@gmail.com&su=' + subject + '&body=' + body, '_blank');
      } else {
        // Mobile: Open native mail app
        window.location.href = 'mailto:udit59692@gmail.com?subject=' + subject + '&body=' + body;
      }
      
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 800);
  });
}

/* ── 12. Card tilt micro-animation ───────────────────────── */
document.querySelectorAll('.profile-card, .svc-card, .pr-card, .about-card, .pf-card, .related-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── Init ────────────────────────────────────────────────── */
syncNav();

/* ── 13. Scroll Progress Bar ─────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100).toFixed(2) + '%';
  }, { passive: true });
})();

/* ── 14. Hero scroll fade ────────────────────────────────── */
(function initHeroFade() {
  const heroFade = document.getElementById('hero-fade');
  const heroSection = document.getElementById('home');
  if (!heroFade || !heroSection) return;
  window.addEventListener('scroll', () => {
    const heroH = heroSection.offsetHeight;
    const sy    = window.scrollY;
    const pct   = Math.min(sy / (heroH * 0.6), 1);
    heroFade.style.opacity   = 1 - pct * 0.6;
    heroFade.style.transform = `translateY(${pct * 18}px)`;
  }, { passive: true });
})();

/* ── 15. Word-split headings ─────────────────────────────── */
(function initWordSplit() {
  document.querySelectorAll('.sh').forEach(el => {
    // Save and wrap each word
    const rawHTML = el.innerHTML;
    // Only wrap plain text nodes (skip <em> etc.)
    el.classList.add('word-split');
    // Rebuild innerHTML by wrapping text-only sections word by word
    el.innerHTML = el.innerHTML.replace(/([^<>\s][^<>]*?)(?=<|$)/g, match => {
      return match.split(' ').map(w => w ? `<span class="word">${w}</span>` : '').join(' ');
    });
    // Stagger each word
    el.querySelectorAll('.word').forEach((w, i) => {
      w.style.transitionDelay = `${0.05 + i * 0.07}s`;
    });
  });
  // Observe them
  const wordObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); wordObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.sh.word-split').forEach(el => wordObs.observe(el));
})();

/* ── 16. Reveal-stagger container observer ───────────────── */
(function initStaggerContainers() {
  const staggerObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Array.from(e.target.children).forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 90);
        });
        staggerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-stagger').forEach(el => staggerObs.observe(el));
})();

/* ── 17. Magnetic CTA buttons ────────────────────────────── */
(function initMagneticButtons() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.btn-primary, .btn-whatsapp').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ── 18. Text-scramble on section pills ──────────────────── */
(function initTextScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
  function scramble(el) {
    const original = el.dataset.text || el.textContent;
    el.dataset.text = original;
    let frame = 0;
    const totalFrames = 18;
    const id = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (frame / totalFrames > i / original.length) return ch;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (++frame > totalFrames) { el.textContent = original; clearInterval(id); }
    }, 30);
  }
  const pillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { scramble(e.target); pillObs.unobserve(e.target); }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.pill').forEach(el => pillObs.observe(el));
})();

/* ── 19. Parallax depth on sections ─────────────────────── */
(function initSectionParallax() {
  const layers = [
    { sel: '.svc-s',   speed: 0.08 },
    { sel: '.pf-s',    speed: 0.05 },
    { sel: '.pricing-s', speed: 0.06 },
  ];
  const targets = layers.map(l => ({ el: document.querySelector(l.sel), speed: l.speed }))
                        .filter(t => t.el);
  if (!targets.length) return;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    targets.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const mid  = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.backgroundPositionY = `calc(50% + ${mid * speed}px)`;
    });
  }, { passive: true });
})();

/* ── 20. Spotlight glow that follows active section ──────── */
(function initSectionSpotlight() {
  const spotlight = document.createElement('div');
  spotlight.id = 'section-spotlight';
  spotlight.style.cssText = [
    'position:fixed', 'pointer-events:none', 'z-index:0',
    'width:600px', 'height:600px', 'border-radius:50%',
    'background:radial-gradient(circle,rgba(24,119,242,.07) 0%,transparent 70%)',
    'transform:translate(-50%,-50%)', 'transition:top .8s ease,left .8s ease',
    'top:50%', 'left:50%'
  ].join(';');
  document.body.appendChild(spotlight);
  const sects = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let active = sects[0];
    sects.forEach(s => { if (window.scrollY >= s.offsetTop - 200) active = s; });
    const r = active.getBoundingClientRect();
    spotlight.style.top  = (r.top + r.height / 2 + window.scrollY) + 'px';
    spotlight.style.left = (window.innerWidth / 2) + 'px';
  }, { passive: true });
})();

/* ── 21. Smooth stat ticker (spring re-ease on re-scroll) ── */
(function initSpringCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    let current = 0, raf = null;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (raf) cancelAnimationFrame(raf);
          current = 0;
          const step = () => {
            const diff = target - current;
            current += Math.max(1, Math.ceil(diff * 0.12));
            el.textContent = Math.min(current, target);
            if (current < target) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.6 });
    obs.observe(el.closest('.stat-item') || el);
  });
})();

/* ── 22. Service card subtle scroll-depth lift ───────────── */
(function initSvcScrollLift() {
  const cards = Array.from(document.querySelectorAll('.svc-card'));
  if (!cards.length) return;
  const lift = () => {
    const vy = window.innerHeight;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const pct  = 1 - Math.max(0, Math.min(1, (rect.top - vy * 0.1) / (vy * 0.8)));
      const ty   = (1 - pct) * 30;
      const op   = 0.4 + pct * 0.6;
      card.style.transform = `translateY(${ty}px)`;
      card.style.opacity   = op;
    });
  };
  window.addEventListener('scroll', lift, { passive: true });
  lift();
})();
