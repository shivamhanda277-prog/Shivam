/**
 * Shivam's Portfolio - Interactive Neural Particle Canvas
 * Features:
 * - Fluid floating particle mesh
 * - Dynamic constellation link lines
 * - Mouse proximity reaction (repulsion & connection)
 * - Automatic color adaptation for Dark and Light mode
 * - Efficient 60fps rendering with window resize & visibility listeners
 */

(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };
  let animationFrameId;

  // Configuration
  const config = {
    particleCount: window.innerWidth < 768 ? 45 : 85,
    maxDistance: 130,
    baseSpeed: 0.5,
    getParticleColor: () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      return isLight ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.7)';
    },
    getLineColor: (alpha) => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      return isLight ? `rgba(99, 102, 241, ${alpha * 0.3})` : `rgba(6, 182, 212, ${alpha * 0.25})`;
    }
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 1;
      this.vx = (Math.random() - 0.5) * config.baseSpeed;
      this.vy = (Math.random() - 0.5) * config.baseSpeed;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 25) + 5;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = config.getParticleColor();
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      // Border bounce
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 0.5;
          const directionY = forceDirectionY * force * this.density * 0.5;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.hypot(dx, dy);

        if (dist < config.maxDistance) {
          const alpha = 1 - (dist / config.maxDistance);
          ctx.beginPath();
          ctx.strokeStyle = config.getLineColor(alpha);
          ctx.lineWidth = 0.85;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[a].x - mouse.x;
        const mdy = particles[a].y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < mouse.radius) {
          const alpha = 1 - (mdist / mouse.radius);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse move events
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Touch support for mobile devices
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Window resize debounced
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Pause when tab not visible to save CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });

  // Initialize
  resize();
  animate();
})();
