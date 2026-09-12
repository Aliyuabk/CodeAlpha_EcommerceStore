/* ============================================================
   KARAMA LOGISTICS - HEADER & MOBILE SIDEBAR JS (main.js)
   Fixed: Mobile menu, sidebar, accessibility, touch events
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ─── DOM Element References ───
    const preloader = document.querySelector('.preloader');
    const mobileToggle = document.querySelector('.mobile-toggle');
    let mainNav = document.querySelector('.main-nav');
    const body = document.body;
    const header = document.querySelector('.main-header');

    // Store original parent for restoring desktop layout
    let navOriginalParent = mainNav ? mainNav.parentElement : null;
    let navNextSibling = mainNav ? mainNav.nextElementSibling : null;

    // ─── Preloader ───
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 800);
        });
    }

    // ─── Mobile Overlay ───
    let mobileOverlay = document.querySelector('.mobile-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-overlay';
        mobileOverlay.setAttribute('aria-hidden', 'true');
        mobileOverlay.setAttribute('role', 'button');
        mobileOverlay.setAttribute('tabindex', '-1');
        document.body.appendChild(mobileOverlay);
    }

    // ─── Sidebar Close Button (inject for mobile) ───
    let sidebarCloseBtn = document.querySelector('.sidebar-close');
    if (!sidebarCloseBtn && mainNav) {
        sidebarCloseBtn = document.createElement('button');
        sidebarCloseBtn.className = 'sidebar-close';
        sidebarCloseBtn.setAttribute('aria-label', 'Close navigation menu');
        sidebarCloseBtn.setAttribute('type', 'button');
        sidebarCloseBtn.innerHTML = '<i class="fas fa-times"></i>';
        mainNav.insertBefore(sidebarCloseBtn, mainNav.firstChild);
    }

    // ─── Focusable elements selector for focus trap ───
    const FOCUSABLE_SELECTORS = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

    let lastFocusedElement = null;
    let focusTrapHandler = null;

    // ─── Move nav outside header for mobile sidebar ───
    function detachNavForMobile() {
        if (!mainNav || mainNav.parentElement === body) return;
        navOriginalParent = mainNav.parentElement;
        navNextSibling = mainNav.nextElementSibling;
        if (header) {
            header.insertAdjacentElement('afterend', mainNav);
        } else {
            document.body.appendChild(mainNav);
        }
    }

    // ─── Move nav back into header for desktop ───
    function restoreNavForDesktop() {
        if (!mainNav || !navOriginalParent) return;
        if (mainNav.parentElement === navOriginalParent) return;
        if (navNextSibling) {
            navOriginalParent.insertBefore(mainNav, navNextSibling);
        } else {
            navOriginalParent.appendChild(mainNav);
        }
    }

    // ─── Open Menu ───
    function openMenu() {
        if (!mainNav || !mobileOverlay || !mobileToggle) return;
        if (mainNav.classList.contains('active')) return;

        // Store last focused element for restoration
        lastFocusedElement = document.activeElement;

        // CRITICAL FIX: Move nav outside header BEFORE adding active class
        detachNavForMobile();

        // Force browser to paint the DOM move first
        // Then add active class so transition triggers properly
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                mobileToggle.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
                mainNav.classList.add('active');
                mobileOverlay.classList.add('active');
                body.classList.add('menu-open');

                // Prevent background scrolling
                body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';

                // Enable focus trap inside sidebar
                enableFocusTrap();

                // Focus first focusable element in sidebar
                setTimeout(() => {
                    const focusable = mainNav.querySelectorAll(FOCUSABLE_SELECTORS);
                    if (focusable.length > 0) {
                        focusable[0].focus();
                    }
                }, 100);
            });
        });
    }

    // ─── Close Menu ───
    function closeMenu() {
        if (!mainNav || !mobileOverlay || !mobileToggle) return;
        if (!mainNav.classList.contains('active')) return;

        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.classList.remove('menu-open');

        // Restore scrolling
        body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Disable focus trap
        disableFocusTrap();

        // Restore focus to toggle button
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        } else if (mobileToggle) {
            mobileToggle.focus();
        }

        // Wait for transition to finish before moving nav back
        // This ensures the closing animation plays smoothly
        const transitionDuration = 400; // matches CSS transition time
        setTimeout(function() {
            restoreNavForDesktop();
        }, transitionDuration);
    }

    // ─── Toggle Menu ───
    function toggleMenu() {
        if (!mainNav) return;
        if (mainNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // ─── Focus Trap (accessibility) ───
    function enableFocusTrap() {
        if (!mainNav) return;

        focusTrapHandler = function(e) {
            if (e.key !== 'Tab') return;

            const focusable = Array.from(mainNav.querySelectorAll(FOCUSABLE_SELECTORS))
                .filter(el => !el.disabled && el.offsetParent !== null);

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        mainNav.addEventListener('keydown', focusTrapHandler);
    }

    function disableFocusTrap() {
        if (!mainNav || !focusTrapHandler) return;
        mainNav.removeEventListener('keydown', focusTrapHandler);
        focusTrapHandler = null;
    }

    // ─── Event Listeners ───

    // Mobile toggle click
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Overlay click - closes menu
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Sidebar close button
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Close menu when clicking nav links (actual navigation only)
    if (mainNav) {
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('#')) {
                    closeMenu();
                }
            });
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // ─── Touch Swipe to Close Sidebar ───
    let touchStartX = 0;
    let touchStartY = 0;

    if (mainNav) {
        mainNav.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        mainNav.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(touchStartY - touchEndY);

            if (diffX > 60 && diffY < 100) {
                closeMenu();
            }
        }, { passive: true });
    }

    // ─── Header Scroll Effect ───
    let lastScroll = 0;

    function handleHeaderScroll() {
        if (!header) return;
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ─── Scroll Reveal Animations ───
    const revealElements = document.querySelectorAll('.reveal, .fade-in-left, .fade-in-right, .fade-in-scale');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ─── Counter Animation ───
    const counters = document.querySelectorAll('.counter');

    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ─── Scroll to Top Button ───
    let scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.setAttribute('type', 'button');
        document.body.appendChild(scrollTopBtn);
    }

    function toggleScrollTop() {
        if (!scrollTopBtn) return;
        if (window.pageYOffset > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleScrollTop, { passive: true });
    toggleScrollTop();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ─── Smooth Scroll for Anchor Links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Active Nav Link on Scroll ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-link[href^="#"]');

    function setActiveNav() {
        if (sections.length === 0 || navLinks.length === 0) return;
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });

    // ─── Parallax Effect for Hero ───
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            if (scrolled < hero.offsetHeight) {
                hero.style.backgroundPositionY = rate + 'px';
            }
        }, { passive: true });
    }

    // ─── Flash Message Auto-Dismiss ───
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (msg.parentNode) {
                    msg.parentNode.removeChild(msg);
                }
            }, 500);
        }, 5000);
    });

    // ─── Input Focus Effects ───
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.classList.add('input-focused');
            }
        });

        input.addEventListener('blur', function() {
            if (this.parentElement) {
                this.parentElement.classList.remove('input-focused');
            }
        });
    });

    // ─── Lazy Load Images ───
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else if (lazyImages.length > 0) {
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    // ─── Stagger Animation for Grids ───
    const grids = document.querySelectorAll('.stats-grid, .services-grid, .features-grid, .steps-container');
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = (index * 0.1) + 's';
        });
    });

    // ─── Touch Device Detection ───
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    // ─── Resize Handler ───
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                if (mainNav && mainNav.classList.contains('active')) {
                    closeMenu();
                }
                restoreNavForDesktop();
            }
        }, 250);
    });

    // ─── Password Toggle ───
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (!input || !icon) return;

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    console.log('\u2705 CodeAlpha E-commerce JS initialized');
});
// Quick preloader hide (fallback if main.js fails)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 3000);
});