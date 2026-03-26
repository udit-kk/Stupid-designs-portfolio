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
const revealEls = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
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
