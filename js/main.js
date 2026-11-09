/**
 * Shivam's Portfolio - Main Orchestrator Script
 * B.Tech CSE (AI & ML) @ Chitkara University | Microsoft AI-901 Certified
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark & Light Mode)
  initTheme();

  // 2. Dynamic Typewriter Effect in Hero
  initTypewriter();

  // 3. Interactive Cursor Glow
  initCursorGlow();

  // 4. Staggered Scroll Animations (IntersectionObserver)
  initScrollAnimations();

  // 5. 3D Card Tilt Effect
  initTiltCards();

  // 6. Project Filtering
  initProjectFilters();

  // 7. Clipboard & Contact Actions
  initContactActions();

  // 8. Certificate Modal Viewer
  initCertificateModal();

  // 9. Mobile Menu & Active Nav Tracking
  initNavigation();
});

/* ==========================================================================
   1. THEME SWITCHER
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeToggle || !themeIcon) return;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('shivam_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('shivam_portfolio_theme', nextTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeIcon.className = 'fas fa-sun';
      themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
      themeToggle.title = 'Switch to Dark Mode';
    } else {
      themeIcon.className = 'fas fa-moon';
      themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
      themeToggle.title = 'Switch to Light Mode';
    }
  }
}

/* ==========================================================================
   2. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriterText');
  if (!target) return;

  const roles = [
    'B.Tech CSE (AI & ML) @ Chitkara University',
    'Microsoft Certified: Azure AI (AI-901)',
    'Wispr Flow & AI Explorer',
    'Passionate Builder & Rapid Learner',
    'Exploring Machine Learning & Deep Tech'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end of text
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. CURSOR GLOW
   ========================================================================== */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      cursorGlow.style.opacity = '1';
      isMoving = true;
    }
  });

  window.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    isMoving = false;
  });

  function render() {
    // Smooth interpolation
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. SCROLL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Animate any skill bars inside
        const skillFills = entry.target.querySelectorAll('.skill-meter-fill');
        skillFills.forEach(fill => {
          const width = fill.getAttribute('data-width') || '85%';
          fill.style.width = width;
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. 3D TILT EFFECT
   ========================================================================== */
function initTiltCards() {
  if (window.innerWidth < 768) return; // Skip on mobile for performance

  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   6. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   7. CONTACT ACTIONS & TOAST
   ========================================================================== */
function initContactActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const contactForm = document.getElementById('contactForm');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Copied to clipboard!';

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(label);
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = textToCopy;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(label);
      });
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const subject = document.getElementById('formSubject').value || 'Portfolio Inquiry';
      const message = document.getElementById('formMessage').value;

      // Construct mailto link
      const mailtoLink = `mailto:shivamhanda277@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Shivam,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;

      // Show toast
      showToast('🚀 Opening email draft to connect with Shivam!');

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);

      contactForm.reset();
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger entrance
  setTimeout(() => toast.classList.add('show'), 20);

  // Remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ==========================================================================
   8. CERTIFICATE MODAL
   ========================================================================== */
function initCertificateModal() {
  const modal = document.getElementById('certModal');
  const openBtns = document.querySelectorAll('[data-open-modal="certModal"]');
  const closeBtns = document.querySelectorAll('[data-close-modal="certModal"]');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal();
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   9. NAVIGATION & ACTIVE SECTION HIGHLIGHT
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close when a link is clicked
    links.forEach(l => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // Active section tracking on scroll
  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}
