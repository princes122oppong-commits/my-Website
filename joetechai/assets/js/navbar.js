/* ============================================
   JOETECHAI - Premium Navigation Bar
   Stripe/Linear Inspired JavaScript
   ============================================ */

'use strict';

class Navbar {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navLinks = document.querySelector('.nav-links');
    this.navActions = document.querySelector('.nav-actions');
    this.navLinkItems = document.querySelectorAll('.nav-links a');
    this.sections = document.querySelectorAll('section[id]');
    this.lastScroll = 0;
    this.isMenuOpen = false;
    this.scrollThreshold = 50;
    
    this.init();
  }
  
  init() {
    this.bindScroll();
    this.bindMobileMenu();
    this.bindNavLinks();
    this.bindResize();
    this.highlightActiveLink();
    this.setInitialState();
  }
  
  // Set initial state based on scroll position
  setInitialState() {
    if (window.scrollY > this.scrollThreshold) {
      this.navbar.classList.add('scrolled');
    }
  }
  
  // Handle scroll events with throttling
  bindScroll() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  handleScroll() {
    const currentScroll = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScroll > this.scrollThreshold) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    
    // Update active link based on scroll position
    this.updateActiveLinkOnScroll();
    
    this.lastScroll = currentScroll;
  }
  
  // Mobile menu toggle
  bindMobileMenu() {
    if (!this.navToggle) return;
    
    this.navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
    
    // Close menu on backdrop click
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !e.target.closest('.navbar')) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navToggle.classList.toggle('active');
    this.navLinks.classList.toggle('active');
    
    if (window.innerWidth <= 900) {
      this.navActions.classList.toggle('mobile-visible');
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Update aria-label
    this.navToggle.setAttribute(
      'aria-label',
      this.isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.navToggle.classList.remove('active');
    this.navLinks.classList.remove('active');
    this.navActions.classList.remove('mobile-visible');
    document.body.style.overflow = '';
    this.navToggle.setAttribute('aria-label', 'Open navigation menu');
  }
  
  // Handle nav link clicks
  bindNavLinks() {
    this.navLinkItems.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Close mobile menu
        if (this.isMenuOpen) {
          this.closeMenu();
        }
        
        // Handle smooth scroll for anchor links
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            this.smoothScrollTo(target);
          }
        }
      });
    });
  }
  
  // Smooth scroll to element
  smoothScrollTo(target) {
    const navHeight = this.navbar.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  // Update active link based on scroll position
  updateActiveLinkOnScroll() {
    let current = '';
    const scrollPos = window.scrollY + 200;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    this.navLinkItems.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Highlight active link on page load
  highlightActiveLink() {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (hash) {
      const activeLink = document.querySelector(`.nav-links a[href="${hash}"]`);
      if (activeLink) {
        this.navLinkItems.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
        
        // Scroll to the section after a short delay
        setTimeout(() => {
          const target = document.querySelector(hash);
          if (target) {
            this.smoothScrollTo(target);
          }
        }, 100);
      }
    }
  }
  
  // Handle window resize
  bindResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 900 && this.isMenuOpen) {
          this.closeMenu();
        }
      }, 250);
    });
  }
}

// Initialize navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  new Navbar();
}