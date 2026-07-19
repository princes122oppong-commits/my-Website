/* ============================================
   JOETECHAI - Premium SaaS Homepage
   Main JavaScript
   ============================================ */

'use strict';

// ============================================
// NAVIGATION
// ============================================
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    
    // Show nav actions on mobile when menu is open
    if (window.innerWidth <= 768) {
      navActions.classList.toggle('mobile-visible');
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navActions.classList.remove('mobile-visible');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navActions.classList.remove('mobile-visible');
    document.body.style.overflow = '';
  }
});

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    // Store the suffix if any (like +)
    const text = counter.textContent;
    const suffix = text.includes('+') ? '+' : text.includes('%') ? '%' : '';
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(eased * target);
      
      counter.textContent = currentValue.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + suffix;
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  
  // Handle counters specifically
  let countersAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('aos-animate');
        
        // Trigger counter animation if this is the stats section
        if (entry.target.closest('.stats-section') && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(element => observer.observe(element));
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// PARALLAX EFFECT ON HERO GLASS CARDS
// ============================================
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const glassCards = document.querySelectorAll('.glass-card');
  
  if (!hero || glassCards.length === 0) return;
  
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    glassCards.forEach((card, index) => {
      const intensity = 8 + index * 3;
      const moveX = x * intensity;
      const moveY = y * intensity;
      card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
  
  hero.addEventListener('mouseleave', () => {
    glassCards.forEach(card => {
      card.style.transform = '';
    });
  });
}

// ============================================
// INTERSECTION OBSERVER FOR PRODUCT CARDS
// ============================================
function initStaggerAnimation() {
  const cards = document.querySelectorAll('.product-card, .industry-card, .feature-card, .testimonial-card, .pricing-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.5s ease ${index * 0.05}s`;
    observer.observe(card);
  });
}

// ============================================
// HERO PARTICLES & EFFECTS
// ============================================
function initHeroEffects() {
  // Add random floating particles dynamically to the dashboard frame
  const dashboardFrame = document.querySelector('.dashboard-frame');
  if (dashboardFrame) {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: rgba(37, 99, 235, ${0.1 + Math.random() * 0.3});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particle-drift ${5 + Math.random() * 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
      `;
      dashboardFrame.appendChild(particle);
    }
  }
}

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });
  
  sections.forEach(section => observer.observe(section));
}

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
  const preloader = document.createElement('div');
  preloader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--dark-navy, #0F172A);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease, visibility 0.5s ease;
  `;
  
  preloader.innerHTML = `
    <div style="text-align: center;">
      <div style="
        width: 48px;
        height: 48px;
        border: 3px solid rgba(37, 99, 235, 0.1);
        border-top-color: #2563EB;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      "></div>
      <div style="
        font-family: 'Poppins', sans-serif;
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
      ">JoetechAI</div>
    </div>
  `;
  
  document.body.appendChild(preloader);
  
  // Add keyframe for spinner
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.remove(), 500);
    }, 500);
  });
}

// ============================================
// INTERSECTION OBSERVER FOR STATS SECTION
// ============================================
function initStatsObserver() {
  const statsSection = document.querySelector('.stats-section');
  let countersStarted = false;
  
  if (!statsSection) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(statsSection);
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize preloader
  initPreloader();
  
  // Initialize all components
  initScrollAnimations();
  initFAQ();
  initSmoothScroll();
  initHeroEffects();
  initStaggerAnimation();
  
  // Initialize stats observer
  initStatsObserver();
  
  // Initialize hero parallax on desktop only
  if (window.innerWidth > 1024) {
    initHeroParallax();
  }
  
  // Initialize active nav highlight
  // initActiveNavHighlight(); // Optional: uncomment if you want section highlighting
});

// Handle resize events
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    initHeroParallax();
  }
});

console.log('JoetechAI - Premium SaaS Homepage Loaded');
