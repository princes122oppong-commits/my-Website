/* ============================================
   JOETECHAI — Section 03: Hero
   Parallax, particles, entrance animations
   ============================================ */

'use strict';

class Hero {
  constructor() {
    this.section = document.querySelector('.hero');
    this.cards = document.querySelectorAll('.glass-card');
    this.frame = document.querySelector('.dashboard-frame');
    this.init();
  }

  init() {
    this.createParticles();
    this.bindParallax();
    this.bindEntrance();
  }

  /* ---- Floating Particles ---- */
  createParticles() {
    if (!this.frame) return;
    const count = 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = 2 + Math.random() * 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: rgba(37, 99, 235, ${0.08 + Math.random() * 0.25});
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
        animation-duration: ${5 + Math.random() * 8}s;
      `;
      this.frame.appendChild(p);
    }
  }

  /* ---- Mouse Parallax on Glass Cards ---- */
  bindParallax() {
    if (!this.section || this.cards.length === 0) return;
    // Only on desktop
    if (window.innerWidth <= 1024) return;

    this.section.addEventListener('mousemove', (e) => {
      const rect = this.section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      this.cards.forEach((card, i) => {
        const intensity = 8 + i * 3;
        card.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
      });
    });

    this.section.addEventListener('mouseleave', () => {
      this.cards.forEach((card) => {
        card.style.transform = '';
      });
    });
  }

  /* ---- Entrance Animation on Scroll ---- */
  bindEntrance() {
    const content = document.querySelector('.hero-content');
    const visual = document.querySelector('.hero-visual');
    if (!content || !visual) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            visual.style.opacity = '1';
            visual.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    content.style.opacity = '0';
    content.style.transform = 'translateY(30px)';
    content.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s';

    visual.style.opacity = '0';
    visual.style.transform = 'translateY(30px)';
    visual.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';

    observer.observe(this.section);
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => new Hero());