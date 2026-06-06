// ─── PROJECTS ─────────────────────────────────────────────────────────────────
// Add, remove, or modify projects here.
// Fields:
//   title     - Project name
//   tag       - Category label shown on the card
//   shortDesc - One-line summary shown on the card
//   url       - Live project link opened by "Check Now". Set null if not deployed.
//   github    - GitHub repository link. Set null to hide the GitHub button.
// ──────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'AI Quiz Builder',
    tag: 'AI / Product',
    shortDesc: 'Dynamic quiz generation with a focused learning workflow.',
    url: 'https://github.com/Hiteshkashyap04',
    github: 'https://github.com/Hiteshkashyap04',
  },
  {
    title: 'Plant Disease Detection',
    tag: 'ML / Vision',
    shortDesc: 'Image-based diagnosis for faster agricultural insight.',
    url: 'https://github.com/Hiteshkashyap04',
    github: 'https://github.com/Hiteshkashyap04',
  },
];

// ─── PARTICLE SYSTEM ──────────────────────────────────────────────────────────

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.CONNECTION_DIST = 128;
    this.MOUSE_RADIUS = 165;
    this.running = true;

    this.resize();
    this.spawnParticles();
    this.bindEvents();
    requestAnimationFrame(() => this.loop());
  }

  get count() {
    return window.innerWidth < 640 ? 38 : window.innerWidth < 1024 ? 58 : 82;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.18;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        r: 0.7 + Math.random() * 1.1,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.spawnParticles();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  loop() {
    if (!this.running) return;

    const { ctx, canvas, particles, mouse, CONNECTION_DIST, MOUSE_RADIUS } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < MOUSE_RADIUS && dist > 0) {
        const t = 1 - dist / MOUSE_RADIUS;
        const force = t * t * 0.055;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Drift back toward base velocity
      p.vx += (p.baseVx - p.vx) * 0.012;
      p.vy += (p.baseVy - p.vy) * 0.012;

      // Soft speed cap
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 2.2) {
        p.vx = (p.vx / spd) * 2.2;
        p.vy = (p.vy / spd) * 2.2;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -6) p.x = canvas.width + 6;
      else if (p.x > canvas.width + 6) p.x = -6;
      if (p.y < -6) p.y = canvas.height + 6;
      else if (p.y > canvas.height + 6) p.y = -6;

      // Brightness boost near cursor
      const nearFactor = dist < MOUSE_RADIUS ? (1 - dist / MOUSE_RADIUS) : 0;
      const alpha = 0.28 + nearFactor * 0.48;
      const radius = p.r + nearFactor * 1.4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(138,196,245,${alpha})`;
      ctx.fill();
    }

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const ddx = particles[i].x - particles[j].x;
        const ddy = particles[i].y - particles[j].y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);

        if (d < CONNECTION_DIST) {
          // Connections near cursor are slightly more visible
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          const mdx = mouse.x - midX;
          const mdy = mouse.y - midY;
          const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const mouseBoost = mouseDist < MOUSE_RADIUS ? (1 - mouseDist / MOUSE_RADIUS) * 0.12 : 0;

          const alpha = (1 - d / CONNECTION_DIST) * 0.055 + mouseBoost;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(138,196,245,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

// ─── RENDER PROJECTS ──────────────────────────────────────────────────────────

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (PROJECTS.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);padding:20px 0">No projects added yet.</p>';
    return;
  }

  grid.innerHTML = PROJECTS.map((p) => {
    const ctaBtn = p.url
      ? `<a href="${p.url}" target="_blank" rel="noreferrer" class="btn-check">
           <span>Check Now</span>
           <i class="fas fa-arrow-up-right-from-square"></i>
         </a>`
      : '<span class="btn-check-soon">Coming soon</span>';

    const ghBtn = p.github
      ? `<a href="${p.github}" target="_blank" rel="noreferrer" class="btn-gh" aria-label="GitHub repository">
           <i class="fab fa-github"></i>
         </a>`
      : '';

    return `
      <article class="project-card">
        <div class="project-card-body">
          <span class="project-tag">${p.tag}</span>
          <h3>${p.title}</h3>
          <p>${p.shortDesc}</p>
        </div>
        <div class="project-card-footer">
          ${ctaBtn}
          ${ghBtn}
        </div>
      </article>`;
  }).join('');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.getElementById('menuIcon');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.navbar ul li a');
  const typingEl = document.getElementById('typing');
  const heroInner = document.getElementById('heroInner');
  const copyBtn = document.getElementById('copyBtn');
  const emailText = document.getElementById('emailText');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Render projects
  renderProjects();

  // ── Particle system
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !reducedMotion) {
    new ParticleSystem(canvas);
  }

  // ── Mobile menu
  const closeMenu = () => {
    navLinks.classList.remove('show');
    menuIcon.classList.remove('open');
  };

  const toggleMenu = () => {
    navLinks.classList.toggle('show');
    menuIcon.classList.toggle('open');
  };

  menuIcon?.addEventListener('click', toggleMenu);
  menuIcon?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });

  navItems.forEach((item) => item.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) closeMenu();
  });

  // ── Typing effect
  const textLines = [
    'Computer Science Student',
    'Java Developer',
    'AI and ML Enthusiast',
    'Responsive Interface Builder',
  ];

  let lineIndex = 0;
  let charOffset = 0;
  let deleting = false;

  const tick = () => {
    if (!typingEl) return;
    const line = textLines[lineIndex];
    charOffset += deleting ? -1 : 1;
    typingEl.textContent = line.slice(0, charOffset);

    let delay = deleting ? 42 : 80;

    if (!deleting && charOffset === line.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charOffset === 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % textLines.length;
      delay = 280;
    }

    setTimeout(tick, delay);
  };

  if (typingEl) {
    reducedMotion ? (typingEl.textContent = textLines[0]) : tick();
  }

  // ── Hero parallax
  if (!reducedMotion && heroInner) {
    window.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 900) { heroInner.style.transform = ''; return; }
      const x = (window.innerWidth / 2 - e.clientX) / 65;
      const y = (window.innerHeight / 2 - e.clientY) / 65;
      heroInner.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
  }

  // ── Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.14 }
  );

  document.querySelectorAll('section').forEach((s) => observer.observe(s));

  // ── Copy email
  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent?.trim();
      if (!email) return;

      navigator.clipboard.writeText(email).then(() => {
        const icon = copyBtn.querySelector('i');
        icon?.classList.replace('fa-copy', 'fa-check');
        copyBtn.classList.add('copied');

        setTimeout(() => {
          icon?.classList.replace('fa-check', 'fa-copy');
          copyBtn.classList.remove('copied');
        }, 1800);
      });
    });
  }

  // ── Keyboard: close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});
