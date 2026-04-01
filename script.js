/* ========================================
   Portfolio JavaScript
   Interactive features, animations, and effects
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingEffect();
    initNavigation();
    initThemeToggle();
    initScrollReveal();
    initExperienceTabs();
    initCounterAnimation();
    initCursorGlow();
});

/* ========================================
   Particle Background
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'light' ? '90, 82, 224' : '108, 99, 255';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles based on screen size
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'light' ? '90, 82, 224' : '108, 99, 255';
        const maxDist = 120;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Only animate when visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    });

    observer.observe(canvas);
    animate();
}

/* ========================================
   Typing Effect
   ======================================== */
function initTypingEffect() {
    const element = document.getElementById('typedText');
    if (!element) return;

    const phrases = [
        'scalable cloud systems.',
        'AI-powered solutions.',
        'distributed architectures.',
        'data pipelines.',
        'full-stack applications.',
        'developer tools.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);
}

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Active section highlighting
        const sections = document.querySelectorAll('.section');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        lastScroll = scrollY;
    });

    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   Theme Toggle
   ======================================== */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Check saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

/* ========================================
   Scroll Reveal Animations
   ======================================== */
function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-title, .about-text, .about-stats, .experience-tabs, ' +
        '.skill-category, .project-card, .pub-card, .edu-card, .cert-card, .contact-content'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Add stagger class to grids
    const staggerContainers = document.querySelectorAll(
        '.skills-grid, .projects-grid, .publications-grid, .education-grid, .certifications-grid'
    );
    staggerContainers.forEach(el => el.classList.add('stagger-children', 'reveal'));

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ========================================
   Experience Tabs
   ======================================== */
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.closest('.stat-card').dataset.count);
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(c => observer.observe(c));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 40;
    const duration = 1500;
    const stepTime = duration / 40;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ========================================
   Cursor Glow Effect
   ======================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
