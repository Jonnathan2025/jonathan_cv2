/**
 * ============================================
 * PORTAFOLIO DIGITAL - JONNATHAN CASTILLO
 * Archivo JavaScript Principal (Corregido)
 * ============================================
 */

const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    typewriterSpeed: 100,
    typewriterDelay: 1000,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px'
};

// ============================================
// UTILIDADES
// ============================================
const Utils = {
    // Selector único
    $: (selector) => document.querySelector(selector),
    // Selector múltiple
    $$: (selector) => document.querySelectorAll(selector),

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function () {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ============================================
// MÓDULOS
// ============================================

const Navigation = {
    init() {
        this.setupSmoothScrolling();
        this.setupNavbarScroll();
        this.setupMobileMenu();
    },

    setupSmoothScrolling() {
        Utils.$$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = Utils.$(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - CONFIG.scrollOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    const navbarCollapse = Utils.$('#navbarNav');
                    if (navbarCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                }
            });
        });
    },

    setupNavbarScroll() {
        const navbar = Utils.$('#mainNavbar');
        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(37, 99, 235, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(37, 99, 235, 0.9)';
                navbar.style.boxShadow = 'none';
            }
        }, 16);
        window.addEventListener('scroll', handleScroll);
    },

    setupMobileMenu() {
        const navbarToggler = Utils.$('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                navbarToggler.classList.toggle('active');
            });
        }
    }
};

const Animations = {
    init() {
        this.setupIntersectionObserver();
        this.setupProgressBars();
        this.setupTypewriter();
    },

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('skill-item')) {
                        this.animateProgressBar(entry.target);
                    }
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        });

        Utils.$$('.fade-in').forEach(el => observer.observe(el));
    },

    animateProgressBar(skillItem) {
        const progressFill = skillItem.querySelector('.progress-fill');
        if (progressFill && !progressFill.classList.contains('animated')) {
            const targetWidth = progressFill.getAttribute('data-width');
            setTimeout(() => {
                progressFill.style.width = `${targetWidth}%`;
                progressFill.classList.add('animated');
            }, CONFIG.animationDuration);
        }
    },

    setupProgressBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth && !bar.classList.contains('animated')) {
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = `${targetWidth}%`;
                            bar.classList.add('animated');
                        }, CONFIG.animationDuration);
                    }
                }
            });
        }, {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        });

        Utils.$$('.progress-fill').forEach(bar => observer.observe(bar));
    },

    setupTypewriter() {
        const heroTitle = Utils.$('.hero-title');
        if (!heroTitle) return;
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const type = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, CONFIG.typewriterSpeed);
            } else {
                heroTitle.classList.add('typing-complete');
            }
        };
        setTimeout(type, CONFIG.typewriterDelay);
    }
};

const VisualEffects = {
    init() {
        this.setupParallax();
        this.setupHoverEffects();
    },

    setupParallax() {
        const parallax = Utils.$('.parallax-bg');
        if (!parallax) return;

        const handleScroll = Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
        }, 16);

        window.addEventListener('scroll', handleScroll);
    },

    setupHoverEffects() {
        Utils.$$('.skill-item').forEach(item => {
            item.addEventListener('mouseenter', () => item.style.transform = 'translateY(-10px) scale(1.02)');
            item.addEventListener('mouseleave', () => item.style.transform = 'translateY(0) scale(1)');
        });

        Utils.$$('.project-card').forEach(card => {
            const img = card.querySelector('.project-image');
            card.addEventListener('mouseenter', () => img && (img.style.transform = 'scale(1.1)'));
            card.addEventListener('mouseleave', () => img && (img.style.transform = 'scale(1)'));
        });
    }
};

const Performance = {
    init() {
        this.setupLazyLoading();
    },

    setupLazyLoading() {
        const images = Utils.$$(`img[data-src]`);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => observer.observe(img));
    }
};

const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navbarCollapse = Utils.$('#navbarNav');
                if (navbarCollapse?.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    },

    setupScreenReaderSupport() {
        Utils.$$('.skill-icon i, .contact-icon i').forEach(icon => {
            icon.setAttribute('aria-hidden', 'true');
        });

        Utils.$$('section').forEach((section, i) => {
            const heading = section.querySelector('h2');
            if (heading && !heading.id) {
                heading.id = `section-title-${i}`;
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
    },

    setupFocusManagement() {
        Utils.$$('.skill-item, .project-card, .contact-item').forEach(item => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('focus', () => item.style.outline = '2px solid #3b82f6');
            item.addEventListener('blur', () => item.style.outline = 'none');
        });
    }
};

// ============================================
// MÓDULO PRINCIPAL
// ============================================
const Portfolio = {
    init() {
        this.setupListeners();
        this.initializeModules();
    },

    setupListeners() {
        window.addEventListener('load', () => document.body.classList.add('loaded'));
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));

        Utils.$$('a[href="#"]').forEach(link => {
            link.addEventListener('click', e => e.preventDefault());
        });
    },

    initializeModules() {
        try {
            Navigation.init();
            Animations.init();
            VisualEffects.init();
            Performance.init();
            Accessibility.init();
            console.log('✅ Portfolio inicializado correctamente');
        } catch (err) {
            console.error('❌ Error al inicializar:', err);
        }
    },

    handleResize() {
        const hero = Utils.$('.hero-section');
        if (hero) {
            hero.style.minHeight = window.innerWidth <= 768 ? '80vh' : '100vh';
        }
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => Portfolio.init());
