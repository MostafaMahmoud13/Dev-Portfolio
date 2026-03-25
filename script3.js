/* ===========================
   APEX — PREMIUM SCRIPTS v2
   =========================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─────────────────────────────
   1. CUSTOM CURSOR
   ───────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorDot = cursor.querySelector('.cursor__dot');
const cursorRing = cursor.querySelector('.cursor__ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
  });

  // Lerp ring for smooth lag
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(cursorRing, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  })();

  // Hover states
  const hoverTargets = 'a, button, [data-magnetic], .benefit-card, .feature-item, .pricing-card, .faq__question, .slider__btn, .step, .trust-badge, .logo-item, .social-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

/* ─────────────────────────────
   2. SCROLL PROGRESS BAR
   ───────────────────────────── */
const scrollFill = document.getElementById('scrollFill');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  scrollFill.style.width = pct + '%';
}, { passive: true });

/* ─────────────────────────────
   3. NAV SCROLL STATE
   ───────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─────────────────────────────
   4. NAV HAMBURGER
   ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    gsap.to(spans[0], { rotate: 45, y: 7, duration: 0.28, ease: 'power2.out' });
    gsap.to(spans[1], { opacity: 0, scaleX: 0, duration: 0.18 });
    gsap.to(spans[2], { rotate: -45, y: -7, duration: 0.28, ease: 'power2.out' });
  } else {
    gsap.to(spans, { rotate: 0, y: 0, opacity: 1, scaleX: 1, duration: 0.28, ease: 'power2.out' });
  }
});
mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  gsap.to(hamburger.querySelectorAll('span'), { rotate: 0, y: 0, opacity: 1, scaleX: 1, duration: 0.25 });
}));

/* ─────────────────────────────
   5. PARTICLES CANVAS
   ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.size = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 160, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 229, 160, ${0.04 * (1 - d/90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────
   6. HERO ENTRANCE
   ───────────────────────────── */
const heroTl = gsap.timeline({ delay: 0.15 });
heroTl
  .fromTo('[data-hero]',
    { opacity: 0, y: 44 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.14 }
  )
  .fromTo('[data-hero-visual]',
    { opacity: 0, x: 50, rotateY: -18 },
    { opacity: 1, x: 0, rotateY: 0, duration: 1.1, ease: 'power3.out' },
    '-=0.55'
  )
  .to('.mockup__float', { opacity: 1, duration: 0.5, stagger: 0.25 }, '-=0.3');

/* ─────────────────────────────
   7. TYPEWRITER
   ───────────────────────────── */
const typewriterEl = document.getElementById('typewriter');
const phrases = ['without the chaos.', 'in record time.', 'with confidence.', 'at startup speed.'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typewrite() {
  const phrase = phrases[phraseIndex];
  if (isDeleting) {
    charIndex--;
    typewriterEl.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    setTimeout(typewrite, 60);
  } else {
    charIndex++;
    typewriterEl.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) { isDeleting = true; setTimeout(typewrite, 2200); }
    else setTimeout(typewrite, 70);
  }
}
setTimeout(typewrite, 2000);

/* ─────────────────────────────
   8. MOCKUP STAT COUNTER
   ───────────────────────────── */
const statCount = document.querySelector('.stat__value[data-count]');
if (statCount) {
  const target = parseInt(statCount.dataset.count);
  setTimeout(() => {
    gsap.fromTo({ val: 0 }, { val: target, duration: 2, ease: 'power2.out',
      onUpdate: function() { statCount.textContent = Math.round(this.targets()[0].val).toLocaleString(); }
    }, {});
  }, 1500);
}

/* ─────────────────────────────
   9. SCROLL REVEAL
   ───────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
revealEls.forEach((el) => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  const idx = siblings.indexOf(el);
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.72, delay: idx * 0.09, ease: 'power3.out' });
    }
  });
});

/* ─────────────────────────────
   10. COUNTER ANIMATIONS (metrics strip)
   ───────────────────────────── */
document.querySelectorAll('.counter[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  const display = el.dataset.display;
  const suffix = el.dataset.suffix || '';

  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => {
      if (display) {
        // Simple swap after short delay
        gsap.to({}, { duration: 1.2, onComplete: () => { el.textContent = display; } });
      } else {
        gsap.fromTo({ val: 0 }, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function() {
            const v = Math.round(this.targets()[0].val);
            el.textContent = (v >= 1000 ? (v/1000).toFixed(v%1000 === 0 ? 0 : 1)+'k' : v) + suffix;
          }
        }, {});
      }
    }
  });
});

/* ─────────────────────────────
   11. SPOTLIGHT CARDS
   ───────────────────────────── */
document.querySelectorAll('.spotlight-card').forEach(card => {
  const spotlight = card.querySelector('.spotlight');
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty('--x', x + '%');
    spotlight.style.setProperty('--y', y + '%');
  });
});

/* ─────────────────────────────
   12. TILT ON HOVER (benefit cards, feature items, steps)
   ───────────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    gsap.to(card, {
      rotateX: -dy * 6,
      rotateY: dx * 6,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' });
  });
});

/* ─────────────────────────────
   13. MAGNETIC BUTTONS
   ───────────────────────────── */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  const strength = 0.35;
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ─────────────────────────────
   14. BUTTON RIPPLE
   ───────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const ripple = btn.querySelector('.btn__ripple');
    if (!ripple) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.remove('ripple-animate');
    void ripple.offsetWidth;
    ripple.classList.add('ripple-animate');
  });
});

/* Primary button micro-interaction */
document.querySelectorAll('.btn--primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.2, ease: 'power2.out' }));
  btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' }));
  btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.97, duration: 0.1 }));
  btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.04, duration: 0.15 }));
});

/* ─────────────────────────────
   15. TESTIMONIAL SLIDER
   ───────────────────────────── */
const track = document.getElementById('testimonialTrack');
const cards = track.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let current = 0, autoTimer, isDragging = false, dragStart = 0;

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(index) {
  current = (index + cards.length) % cards.length;
  gsap.to(track, { x: `-${current * 100}%`, duration: 0.55, ease: 'power3.inOut' });
  dotsContainer.querySelectorAll('.slider__dot').forEach((d, i) => d.classList.toggle('active', i === current));
  resetAuto();
}
function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 5500);
}
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));
track.addEventListener('pointerdown', e => { isDragging = true; dragStart = e.clientX; track.setPointerCapture(e.pointerId); });
track.addEventListener('pointermove', e => {
  if (!isDragging) return;
  gsap.set(track, { x: `calc(-${current * 100}% + ${e.clientX - dragStart}px)` });
});
track.addEventListener('pointerup', e => {
  if (!isDragging) return;
  isDragging = false;
  const dx = e.clientX - dragStart;
  if (Math.abs(dx) > 60) goTo(dx < 0 ? current + 1 : current - 1);
  else goTo(current);
});
resetAuto();

/* ─────────────────────────────
   16. PRICING TOGGLE
   ───────────────────────────── */
const billingToggle = document.getElementById('billingToggle');
const toggleLabelMonthly = document.getElementById('toggleLabelMonthly');
const toggleLabelAnnual = document.getElementById('toggleLabelAnnual');

billingToggle.addEventListener('click', () => {
  const annual = billingToggle.getAttribute('aria-checked') === 'false';
  billingToggle.setAttribute('aria-checked', annual);

  toggleLabelMonthly.classList.toggle('toggle__label--active', !annual);
  toggleLabelAnnual.classList.toggle('toggle__label--active', annual);

  document.querySelectorAll('.price__amount[data-monthly]').forEach(el => {
    const from = parseFloat(el.textContent) || 0;
    const to = annual ? parseFloat(el.dataset.annual) : parseFloat(el.dataset.monthly);
    gsap.to({ val: from }, {
      val: to, duration: 0.55, ease: 'power2.out',
      onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
    });
  });

  // Pop the featured card
  const featured = document.querySelector('.pricing-card--featured');
  gsap.fromTo(featured,
    { scale: 1.03 },
    { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut',
      onComplete: () => gsap.set(featured, { scale: 1.03 }) }
  );
});

/* ─────────────────────────────
   17. FAQ ACCORDION
   ───────────────────────────── */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Close others
    document.querySelectorAll('.faq__question').forEach(other => {
      if (other !== btn && other.getAttribute('aria-expanded') === 'true') {
        other.setAttribute('aria-expanded', 'false');
        gsap.to(other.nextElementSibling, { maxHeight: 0, duration: 0.35, ease: 'power2.inOut' });
      }
    });

    if (!open) {
      btn.setAttribute('aria-expanded', 'true');
      const h = answer.querySelector('p').scrollHeight + 40;
      gsap.fromTo(answer, { maxHeight: 0 }, { maxHeight: h, duration: 0.42, ease: 'power2.out' });
    } else {
      btn.setAttribute('aria-expanded', 'false');
      gsap.to(answer, { maxHeight: 0, duration: 0.35, ease: 'power2.inOut' });
    }
  });
});

/* ─────────────────────────────
   18. PARALLAX HERO ORBS
   ───────────────────────────── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  if (orb1) gsap.set(orb1, { y: y * 0.14 });
  if (orb2) gsap.set(orb2, { y: -y * 0.09 });
}, { passive: true });

/* ─────────────────────────────
   19. ACTIVE NAV LINK
   ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        const active = l.getAttribute('href') === `#${e.target.id}`;
        l.classList.toggle('active', active);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));

/* ─────────────────────────────
   20. SMOOTH ANCHOR SCROLLING
   ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 0.9, ease: 'power3.inOut' });
    }
  });
});

/* ─────────────────────────────
   21. MOCKUP BAR CHART ANIMATE
   ───────────────────────────── */
gsap.from('.chart__bars .bar', {
  scaleY: 0, transformOrigin: 'bottom',
  duration: 0.7, stagger: 0.08, ease: 'back.out(1.3)',
  delay: 1.4
});

/* ─────────────────────────────
   22. PRICING CARD SHIMMER ON HOVER
   ───────────────────────────── */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      boxShadow: card.classList.contains('pricing-card--featured')
        ? '0 0 0 1px rgba(0,229,160,0.15), 0 0 80px rgba(0,229,160,0.18), 0 32px 64px rgba(0,0,0,0.5)'
        : '0 0 0 1px rgba(0,229,160,0.1), 0 32px 56px rgba(0,0,0,0.45)',
      duration: 0.4
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      boxShadow: card.classList.contains('pricing-card--featured')
        ? '0 0 0 1px rgba(0,229,160,0.08), 0 0 60px rgba(0,229,160,0.08)'
        : 'none',
      duration: 0.4
    });
  });
});

/* ─────────────────────────────
   23. LIVE ACTIVITY TOAST
   ───────────────────────────── */
const activityToast = document.getElementById('activityToast');
const toastName = document.getElementById('toastName');
const toastAction = document.getElementById('toastAction');
const toastImg = activityToast.querySelector('img');

const activities = [
  { name: 'Alex from Berlin', action: 'just started a free trial', img: 5 },
  { name: 'Priya from Mumbai', action: 'upgraded to Pro plan', img: 9 },
  { name: 'James from New York', action: 'just deployed to production', img: 12 },
  { name: 'Sofia from Barcelona', action: 'just started a free trial', img: 15 },
  { name: 'Kai from Tokyo', action: 'upgraded to Enterprise', img: 18 },
  { name: 'Oren from Tel Aviv', action: 'completed onboarding', img: 21 },
  { name: 'Mia from London', action: 'just invited 3 teammates', img: 25 },
  { name: 'Dex from Sydney', action: 'just deployed in 2.8s', img: 28 },
];
let toastIndex = 0;

function showToast() {
  const item = activities[toastIndex % activities.length];
  toastName.textContent = item.name;
  toastAction.textContent = item.action;
  toastImg.src = `https://i.pravatar.cc/32?img=${item.img}`;
  toastIndex++;

  activityToast.classList.add('visible');
  setTimeout(() => activityToast.classList.remove('visible'), 4000);
}

setTimeout(() => {
  showToast();
  setInterval(showToast, 9000);
}, 3500);

/* ─────────────────────────────
   24. HERO HEADLINE STAGGER LINES
   ───────────────────────────── */
gsap.utils.toArray('.hero__headline .line').forEach((line, i) => {
  gsap.fromTo(line,
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.9, delay: 0.5 + i * 0.12, ease: 'power3.out' }
  );
});

/* ─────────────────────────────
   25. STEP NUMBERS MORPH
   ───────────────────────────── */
document.querySelectorAll('.step__number').forEach(num => {
  ScrollTrigger.create({
    trigger: num, start: 'top 85%', once: true,
    onEnter: () => {
      gsap.from(num, { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out' });
    }
  });
});

/* ─────────────────────────────
   26. SECTION UNDERLINE REVEAL (section-tag)
   ───────────────────────────── */
document.querySelectorAll('.section-tag').forEach(tag => {
  ScrollTrigger.create({
    trigger: tag, start: 'top 90%', once: true,
    onEnter: () => {
      gsap.from(tag, { opacity: 0, scale: 0.85, duration: 0.5, ease: 'back.out(1.6)' });
    }
  });
});

/* ─────────────────────────────
   27. FOOTER STAGGER
   ───────────────────────────── */
ScrollTrigger.create({
  trigger: '.footer', start: 'top 90%', once: true,
  onEnter: () => {
    gsap.from('.footer__col', { opacity: 0, y: 18, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
  }
});

/* ─────────────────────────────
   28. TRUST BADGES STAGGER
   ───────────────────────────── */
ScrollTrigger.create({
  trigger: '.trust-badges', start: 'top 90%', once: true,
  onEnter: () => {
    gsap.from('.trust-badge', { opacity: 0, y: 12, scale: 0.9, duration: 0.4, stagger: 0.07, ease: 'back.out(1.4)' });
  }
});

/* ─────────────────────────────
   29. FLOATING CARDS APPEAR
   ───────────────────────────── */
ScrollTrigger.create({
  trigger: '.hero__visual', start: 'top 60%', once: true,
  onEnter: () => {
    gsap.to('.mockup__float', { opacity: 1, duration: 0.5, stagger: 0.2 });
  }
});

/* ─────────────────────────────
   30. METRICS STRIP COUNTER GLOW
   ───────────────────────────── */
ScrollTrigger.create({
  trigger: '.metrics', start: 'top 80%', once: true,
  onEnter: () => {
    gsap.from('.metric', { opacity: 0, y: 24, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
  }
});

/* ─────────────────────────────
   CONSOLE SIGNATURE
   ───────────────────────────── */
console.log('%c⬡ APEX', 'color:#00E5A0;font-family:Syne,sans-serif;font-weight:800;font-size:22px;');
console.log('%cPremium micro-interactions · GSAP · Vanilla JS', 'color:#8A9BB0;font-size:11px;');
