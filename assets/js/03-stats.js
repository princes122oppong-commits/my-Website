/* ============================================
   JOETECHAI — Section 08: Statistics
   Animated counters triggered on scroll
   ============================================ */

'use strict';

class StatsCounter {
  constructor() {
    // Support both old .stats section and new .trusted-businesses section
    this.section = document.querySelector('.trusted-businesses') || document.querySelector('.stats');
    this.counters = document.querySelectorAll('.stat-glass .stat-number, .stats .stat-number');
    this.animated = false;
    this.init();
  }

  init() {
    if (!this.section || this.counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated) {
            this.animated = true;
            this.animateAll();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(this.section);
  }

  animateAll() {
    this.counters.forEach((el) => {
      const raw = el.getAttribute('data-target');
      const target = parseInt(raw, 10);
      if (isNaN(target)) return;

      const suffix = raw.endsWith('+') ? '+' : raw.endsWith('%') ? '%' : '';
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(tick);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new StatsCounter());