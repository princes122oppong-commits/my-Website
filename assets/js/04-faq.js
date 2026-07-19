/* ============================================
   JOETECHAI — Section 11: FAQ Accordion
   ============================================ */

'use strict';

class FAQ {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    this.items.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all
        this.items.forEach((i) => i.classList.remove('is-open'));

        // Toggle clicked
        if (!isOpen) {
          item.classList.add('is-open');
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new FAQ());