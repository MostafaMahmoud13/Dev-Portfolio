/* ═══════════════════════════════════════════════
   NEXUS — JavaScript / GSAP Animations
═══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) gsap.to(window, { duration: 1.2, scrollTo: target, ease: 'power3.inOut' });
  });
});

/* ──────────────────────────────────────────────
   CURSOR
────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.05, ease: 'none' });
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(animateFollower);
})();

document.addEventListener('mousedown', () => {
  gsap.to(cursor, { scale: 0.8, duration: 0.15 });
  gsap.to(follower, { scale: 0.8, duration: 0.15 });
});
document.addEventListener('mouseup', () => {
  gsap.to(cursor, { scale: 1, duration: 0.15 });
  gsap.to(follower, { scale: 1, duration: 0.15 });
});

/* ──────────────────────────────────────────────
   PARTICLE CANVAS
────────────────────────────────────────────── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.color = Math.random() > 0.6 ? '#00b4ff' : '#0066ff';
    this.connected = [];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Init particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

let mouseParticleX = -9999, mouseParticleY = -9999;
document.addEventListener('mousemove', e => {
  mouseParticleX = e.clientX;
  mouseParticleY = e.clientY;
});

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00b4ff';
        ctx.globalAlpha = (1 - dist / 100) * 0.06;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    // Mouse connections
    const mdx = particles[i].x - mouseParticleX;
    const mdy = particles[i].y - mouseParticleY;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 160) {
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseParticleX, mouseParticleY);
      ctx.strokeStyle = '#00b4ff';
      ctx.globalAlpha = (1 - mdist / 160) * 0.15;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrameId = requestAnimationFrame(animateParticles);
}
animateParticles();

/* ──────────────────────────────────────────────
   HERO ENTRANCE ANIMATION
────────────────────────────────────────────── */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
  .to('.title-line', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.4')
  .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
  .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
  .to('.hero-stats', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
  .to('.hero-visual', { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' }, '-=0.8')
  .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2');

// Set initial states
gsap.set('.hero-badge', { y: 20 });
gsap.set('.hero-sub', { y: 20 });
gsap.set('.hero-actions', { y: 20 });
gsap.set('.hero-stats', { y: 20 });
gsap.set('.hero-visual', { x: 60 });
gsap.set('.title-line', { y: '100%' });

/* ──────────────────────────────────────────────
   COUNTER ANIMATION
────────────────────────────────────────────── */
function animateCounter(el, target, suffix) {
  gsap.to({ val: 0 }, {
    val: target,
    duration: 2.2,
    ease: 'power2.out',
    delay: 1.2,
    onUpdate: function() {
      el.textContent = Math.round(this.targets()[0].val);
    }
  });
}

document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.dataset.target);
  animateCounter(el, target);
});

/* ──────────────────────────────────────────────
   NAV SCROLL BEHAVIOR
────────────────────────────────────────────── */
ScrollTrigger.create({
  start: 80,
  onEnter: () => document.getElementById('nav').classList.add('scrolled'),
  onLeaveBack: () => document.getElementById('nav').classList.remove('scrolled')
});

/* ──────────────────────────────────────────────
   SCROLL-TRIGGERED REVEALS
────────────────────────────────────────────── */

// Section titles
gsap.utils.toArray('.reveal-text').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// Fade reveals
gsap.utils.toArray('.reveal-fade').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'power2.out',
      delay: i * 0.05,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// Up reveals (staggered children)
gsap.utils.toArray('.reveal-up').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// Right reveal (product screen)
gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 80 },
    {
      opacity: 1, x: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// Feature cards
gsap.utils.toArray('.reveal-card').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 60, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.85,
      delay: (parseInt(el.dataset.index) || i) * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
});

// Gallery items
gsap.utils.toArray('.reveal-gallery').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, scale: 0.92, y: 40 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 0.9,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/* ──────────────────────────────────────────────
   PARALLAX EFFECTS
────────────────────────────────────────────── */

// Hero visual parallax on scroll
gsap.to('.hero-visual', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

// Hero content slight parallax
gsap.to('.hero-content', {
  y: 60,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5
  }
});

// Grid overlay parallax
gsap.to('.hero-grid-overlay', {
  y: 80,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 2
  }
});

// Interactive section orbs parallax
gsap.utils.toArray('.int-orb').forEach(orb => {
  const speed = parseFloat(orb.dataset.speed) || 0.2;
  gsap.to(orb, {
    y: -150 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: '.interactive',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

/* ──────────────────────────────────────────────
   INTERACTIVE MOUSE PARALLAX
────────────────────────────────────────────── */
const interactiveSection = document.getElementById('interactive');
const interactiveInner = document.getElementById('interactiveInner');

let ticking = false;
document.addEventListener('mousemove', e => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const rect = interactiveSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;

        document.querySelectorAll('.int-node').forEach(node => {
          const depth = parseFloat(node.dataset.depth) || 0.5;
          gsap.to(node, {
            x: dx * 40 * depth,
            y: dy * 30 * depth,
            duration: 1,
            ease: 'power2.out'
          });
        });

        gsap.to('.int-bg-text', {
          x: dx * 30,
          y: dy * 20,
          duration: 1.5,
          ease: 'power2.out'
        });

        gsap.to('.int-orb-1', {
          x: dx * 60,
          y: dy * 40,
          duration: 2,
          ease: 'power2.out'
        });
        gsap.to('.int-orb-2', {
          x: -dx * 40,
          y: -dy * 30,
          duration: 2,
          ease: 'power2.out'
        });
        gsap.to('.int-orb-3', {
          x: dx * 30,
          y: -dy * 20,
          duration: 2,
          ease: 'power2.out'
        });
      }

      // Hero visual parallax on mouse move
      const heroRect = document.querySelector('.hero').getBoundingClientRect();
      if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
        const hcx = window.innerWidth / 2;
        const hcy = window.innerHeight / 2;
        const hdx = (e.clientX - hcx) / hcx;
        const hdy = (e.clientY - hcy) / hcy;

        gsap.to('#heroVisual', {
          x: hdx * 20,
          y: hdy * 10,
          duration: 1.5,
          ease: 'power2.out'
        });

        gsap.to('.floating-card', {
          x: hdx * 30,
          y: hdy * 15,
          duration: 2,
          ease: 'power2.out',
          stagger: 0.1
        });
      }

      ticking = false;
    });
    ticking = true;
  }
});

/* ──────────────────────────────────────────────
   FEATURE CARD GLOW ON HOVER
────────────────────────────────────────────── */
document.querySelectorAll('.feat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.feat-glow');
    if (glow) {
      glow.style.background = `radial-gradient(300px at ${x}px ${y}px, rgba(0,180,255,0.1), transparent)`;
    }
  });
});

/* ──────────────────────────────────────────────
   PRODUCT SCREEN BAR ANIMATION
────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.product-screen',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.bar',
      { scaleY: 0, transformOrigin: 'bottom' },
      {
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.3
      }
    );
    gsap.fromTo('.mc-fill',
      { width: 0 },
      { width: el => el.style.width, duration: 1.2, ease: 'power2.out', stagger: 0.15, delay: 0.5 }
    );
  }
});

/* ──────────────────────────────────────────────
   FLOATING CARDS STAGGER ENTRANCE
────────────────────────────────────────────── */
gsap.set('.floating-card', { opacity: 0, scale: 0.8 });
setTimeout(() => {
  gsap.to('.floating-card', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: 0.2,
    ease: 'back.out(1.7)',
    delay: 1.8
  });
}, 0);

/* ──────────────────────────────────────────────
   CTA SECTION ANIMATION
────────────────────────────────────────────── */
const ctaTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.cta-section',
    start: 'top 75%',
    toggleActions: 'play none none none'
  }
});
ctaTl
  .fromTo('.cta-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
  .fromTo('.cta-body', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
  .fromTo('.cta-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
  .fromTo('.cta-logos', { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.2');

/* ──────────────────────────────────────────────
   SKILL BARS IN GALLERY (animate on hover-ish)
────────────────────────────────────────────── */
ScrollTrigger.create({
  trigger: '.gallery-grid',
  start: 'top 85%',
  onEnter: () => {
    gsap.fromTo('.sbf div',
      { width: 0 },
      { width: el => el.style.width, duration: 1.2, ease: 'power2.out', stagger: 0.15, delay: 0.5 }
    );
  }
});

/* ──────────────────────────────────────────────
   FOOTER ENTRANCE
────────────────────────────────────────────── */
gsap.fromTo('.footer-inner',
  { opacity: 0, y: 20 },
  {
    opacity: 1, y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 95%'
    }
  }
);

/* ──────────────────────────────────────────────
   SECTION LABEL STAGGER
────────────────────────────────────────────── */
gsap.utils.toArray('.section-label').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -20 },
    {
      opacity: 1, x: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%'
      }
    }
  );
});

/* ──────────────────────────────────────────────
   SCROLL PROGRESS INDICATOR
────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #00b4ff, #0066ff);
  z-index: 10001;
  width: 0%;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(0,180,255,0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${progress}%`;
});

/* ──────────────────────────────────────────────
   GALLERY ITEM TILT EFFECT
────────────────────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy * -6;
    const ry = (x - cx) / cx * 6;
    gsap.to(item, {
      rotateX: rx,
      rotateY: ry,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800
    });
  });
  item.addEventListener('mouseleave', () => {
    gsap.to(item, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.6, ease: 'power2.out'
    });
  });
});

/* ──────────────────────────────────────────────
   BUTTON MAGNETIC EFFECT
────────────────────────────────────────────── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ──────────────────────────────────────────────
   PERFORMANCE: Pause particles when tab hidden
────────────────────────────────────────────── */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animFrameId);
  } else {
    animateParticles();
  }
});

/* ──────────────────────────────────────────────
   LOG
────────────────────────────────────────────── */
console.log('%c NEXUS ', 'background: #00b4ff; color: #000; font-size: 1.2rem; font-weight: bold; padding: 4px 12px; border-radius: 4px;');
console.log('%c Interface loaded. Everything is intentional.', 'color: #00b4ff; font-size: 0.85rem;');
