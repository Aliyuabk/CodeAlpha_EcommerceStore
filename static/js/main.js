/* ============================================================
   CALPHA E-COMMERCE — MAIN SCRIPT
   Modules: Preloader, Mobile Nav, Scroll FX, Search, Lazy Load
   ============================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ----------------------------------------------------------
     1. Preloader
     ---------------------------------------------------------- */
  function initPreloader() {
    const preloader = $('.preloader') || $('#preloader');
    if (!preloader) return;

    const hide = () => preloader.classList.add('hidden', 'fade-out');

    if (document.readyState === 'complete') {
      setTimeout(hide, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 300), { once: true });
    }
    // Safety fallback
    setTimeout(hide, 2500);
  }

  /* ----------------------------------------------------------
     2. Mobile Navigation
     ---------------------------------------------------------- */
 /* ----------------------------------------------------------
   Mobile Navigation Fix
   ---------------------------------------------------------- */
function initMobileNav() {
  // Flexibly target toggle button or create standard fallback listener
  const toggle = $('.mobile-toggle') || $('.menu-toggle') || $('.hamburger');
  const nav    = $('.main-nav') || $('.header-actions');
  const body   = document.body;
  if (!toggle || !nav) return;

  let overlay = $('.mobile-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    toggle.classList.add('active');
    nav.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');
  }

  function closeMenu() {
    toggle.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.contains('active') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);
}

/* ----------------------------------------------------------
   Global Client-Side Search Fix
   ---------------------------------------------------------- */
function initProductSearch() {
  // Select ALL inputs matching search to support top header search
  const inputs = $$('input[type="text"], .search-input');
  const cards  = $$('.product-card');
  const grid   = $('.product-grid') || (cards[0] ? cards[0].parentElement : null);

  if (!inputs.length || !cards.length) return;

  function filterProducts(query) {
    const q = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      // Search in title, heading tags, or data attributes
      const title = (
        card.dataset.title || 
        card.querySelector('.product-title, h3, h4, a')?.textContent || 
        ''
      ).toLowerCase();
      
      const match = !q || title.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    // Handle Empty State
    if (grid) {
      let emptyMsg = $('.search-empty', grid);
      if (visibleCount === 0 && q) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.className = 'search-empty';
          emptyMsg.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; font-size: 1.1rem; color: #64748b;';
          grid.appendChild(emptyMsg);
        }
        emptyMsg.textContent = `No products found matching "${query}".`;
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    }
  }

  // Bind input event listener across all search input instances
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      // Sync all search boxes if multiple exist
      inputs.forEach(i => { if (i !== e.target) i.value = val; });
      filterProducts(val);
    });

    // Handle Enter Key / Form Submit
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterProducts(input.value);
      }
    });
  });
}
  /* ----------------------------------------------------------
     3. Header Scroll Effects & Scroll-to-Top
     ---------------------------------------------------------- */
  function initScrollEffects() {
    const header = $('.main-header');

    let scrollTopBtn = $('.scroll-top');
    if (!scrollTopBtn) {
      scrollTopBtn = document.createElement('button');
      scrollTopBtn.className = 'scroll-top';
      scrollTopBtn.type = 'button';
      scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
      scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      document.body.appendChild(scrollTopBtn);
    }

    function onScroll() {
      const y = window.pageYOffset || document.documentElement.scrollTop;

      if (header) {
        header.classList.toggle('scrolled', y > 40);
      }

      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', y > 350);
      }
    }

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     4. Scroll Reveal Animations
     ---------------------------------------------------------- */
  function initReveal() {
    const items = $$('.reveal, .fade-in-left, .fade-in-right, .fade-in-scale');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     5. Lazy Image Loading
     ---------------------------------------------------------- */
  function initLazyImages() {
    const imgs = $$('img[data-src]');
    if (!imgs.length) return;

    if (!('IntersectionObserver' in window)) {
      imgs.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    imgs.forEach(img => observer.observe(img));
  }

  /* ----------------------------------------------------------
     6. Flash Message Dismissal
     ---------------------------------------------------------- */
  function initFlashMessages() {
    $$('.flash-message').forEach(msg => {
      setTimeout(() => {
        msg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(-15px)';
        setTimeout(() => msg.remove(), 400);
      }, 5000);
    });
  }

  /* ----------------------------------------------------------
     7. Password Toggle Visibility
     ---------------------------------------------------------- */
  function initPasswordToggle() {
    $$('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', function () {
        const wrap  = this.closest('.password-input-wrap') || this.parentElement;
        const input = wrap ? wrap.querySelector('input') : null;
        const icon  = this.querySelector('i');
        if (!input || !icon) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
      });
    });
  }

  /* ----------------------------------------------------------
     8. Smooth Anchor Link Scrolling
     ---------------------------------------------------------- */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const header = $('.main-header');
        const offset = (header ? header.offsetHeight : 0) + 15;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ----------------------------------------------------------
     9. Client-Side Product Search Filtering
     ---------------------------------------------------------- */
  function initProductSearch() {
    const form  = $('.search-form');
    const input = $('.search-input');
    const grid  = $('.product-grid');
    if (!input || !grid) return;

    const meta  = $('.search-meta');
    const cards = $$('.product-card', grid);

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function filterProducts(query) {
      const q = query.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const title    = (card.dataset.title || card.querySelector('.product-title')?.textContent || '').toLowerCase();
        const category = (card.dataset.category || '').toLowerCase();
        const match    = !q || title.includes(q) || category.includes(q);

        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (meta) {
        if (q) {
          meta.innerHTML = `Showing <strong>${visibleCount}</strong> result${visibleCount !== 1 ? 's' : ''} for "<strong>${escapeHtml(query)}</strong>" <a href="#" class="clear-search">Clear</a>`;
          const clear = meta.querySelector('.clear-search');
          if (clear) {
            clear.addEventListener('click', (e) => {
              e.preventDefault();
              input.value = '';
              filterProducts('');
              input.focus();
            });
          }
        } else {
          meta.textContent = '';
        }
      }

      let emptyMsg = $('.search-empty', grid);
      if (visibleCount === 0 && q) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('p');
          emptyMsg.className = 'empty-message search-empty';
          emptyMsg.textContent = `No products found for "${query}". Try a different term.`;
          grid.appendChild(emptyMsg);
        } else {
          emptyMsg.textContent = `No products found for "${query}". Try a different term.`;
          emptyMsg.style.display = '';
        }
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    }

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => filterProducts(input.value), 150);
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        filterProducts(input.value);
      });
    }

    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get('q');
    if (initialQ) {
      input.value = initialQ;
      filterProducts(initialQ);
    }
  }

  /* ----------------------------------------------------------
     10. Active Nav Link on Page Scroll
     ---------------------------------------------------------- */
  function initActiveNav() {
    const sections = $$('section[id]');
    const links    = $$('.main-nav .nav-link[href^="#"]');
    if (!sections.length || !links.length) return;

    function updateActiveLink() {
      const pos = window.pageYOffset + 120;
      sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        if (pos >= top && pos < top + height) {
          links.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + section.id;
            link.classList.toggle('active', isActive);
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }

  /* ----------------------------------------------------------
     11. Stagger Delay Calculations for Grids
     ---------------------------------------------------------- */
  function initGridStagger() {
    const grids = $$('.product-grid, .stats-grid, .services-grid, .features-grid, .steps-container');
    grids.forEach(grid => {
      Array.from(grid.children).forEach((child, index) => {
        child.style.transitionDelay = (index * 0.05) + 's';
      });
    });
  }

  /* ----------------------------------------------------------
     Initialization
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initMobileNav();
    initScrollEffects();
    initReveal();
    initLazyImages();
    initFlashMessages();
    initPasswordToggle();
    initSmoothAnchors();
    initProductSearch();
    initActiveNav();
    initGridStagger();
  });
})();