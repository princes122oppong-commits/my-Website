/* ============================================
   JOETECHAI — Section 02: Navigation Bar
   Scroll handling, mobile menu, active link
   ============================================ */

'use strict';

class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.toggle = document.querySelector('.navbar-toggle');
    this.links = document.querySelector('.navbar-links');
    this.actions = document.querySelector('.navbar-actions');
    this.linkItems = document.querySelectorAll('.navbar-links a');
    this.sections = document.querySelectorAll('section[id]');
    this.isOpen = false;
    this.scrollThreshold = 50;
    this.init();
  }

  init() {
    this.bindScroll();
    this.bindToggle();
    this.bindLinks();
    this.bindResize();
    this.bindEscape();
    this.setInitialState();
  }

  /* ---- Scroll ---- */
  bindScroll() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  onScroll() {
    const y = window.scrollY;
    this.navbar.classList.toggle('is-scrolled', y > this.scrollThreshold);
    this.updateActiveLink();
  }

  /* ---- Mobile Toggle ---- */
  bindToggle() {
    if (!this.toggle) return;
    this.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.toggle.classList.toggle('is-active', this.isOpen);
    this.links.classList.toggle('is-active', this.isOpen);

    if (window.innerWidth <= 900) {
      this.actions.classList.toggle('is-mobile-visible', this.isOpen);
    }

    document.body.style.overflow = this.isOpen ? 'hidden' : '';
    this.toggle.setAttribute(
      'aria-label',
      this.isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  }

  closeMenu() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.toggle.classList.remove('is-active');
    this.links.classList.remove('is-active');
    this.actions.classList.remove('is-mobile-visible');
    document.body.style.overflow = '';
    this.toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  /* ---- Link Clicks ---- */
  bindLinks() {
    this.linkItems.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (this.isOpen) this.closeMenu();

        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offset = this.navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ---- Active Link on Scroll ---- */
  updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 200;

    this.sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    this.linkItems.forEach((link) => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('is-active');
      }
    });
  }

  /* ---- Resize ---- */
  bindResize() {
    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.innerWidth > 900 && this.isOpen) {
          this.closeMenu();
        }
      }, 250);
    });
  }

  /* ---- Escape Key ---- */
  bindEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeMenu();
    });
  }

  /* ---- Initial State ---- */
  setInitialState() {
    if (window.scrollY > this.scrollThreshold) {
      this.navbar.classList.add('is-scrolled');
    }
    // Highlight link from URL hash
    const hash = window.location.hash;
    if (hash) {
      const active = document.querySelector(`.navbar-links a[href="${hash}"]`);
      if (active) {
        this.linkItems.forEach((l) => l.classList.remove('is-active'));
        active.classList.add('is-active');
      }
    }
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => new Navigation());
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  new Navigation();
}