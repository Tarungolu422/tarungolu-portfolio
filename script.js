// 78 to 80 currently off 
// Initialize EmailJS early
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('O_ciyEh_y9ZLeTCWp');
    }
})();

// Universal smooth scroll function with easing - optimized for instant start
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;

    // If distance is very small, scroll immediately
    if (Math.abs(distance) < 10) {
        window.scrollTo(0, targetPosition);
        return;
    }

    // Cancel any existing scroll animation first
    if (window.currentScrollAnimation) {
        cancelAnimationFrame(window.currentScrollAnimation);
        window.currentScrollAnimation = null;
    }

    const startTime = performance.now();
    let animationFrameId;
    let lastPosition = startPosition;

    // Easing function for smooth acceleration and deceleration
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        const currentPosition = startPosition + (distance * ease);

        // Only scroll if position actually changed (prevents unnecessary repaints)
        if (Math.abs(currentPosition - lastPosition) > 0.5) {
            window.scrollTo(0, currentPosition);
            lastPosition = currentPosition;
        }

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateScroll);
            window.currentScrollAnimation = animationFrameId;
        } else {
            // Ensure we end exactly at target
            window.scrollTo(0, targetPosition);
            window.currentScrollAnimation = null;
        }
    }

    // Start immediately with first frame - no delay
    animationFrameId = requestAnimationFrame(animateScroll);
    window.currentScrollAnimation = animationFrameId;
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initResumeDownload();
    initTypingEffect();
    initCertificates();
    initNumberAnimation();
    initScrollToTop();
});

// // Send visit notification email on page load
// window.addEventListener('load', sendVisitNotification);

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuClose = document.querySelector('.menu-close');
    const menuBackdrop = document.querySelector('.menu-backdrop');

    // Function to open menu
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        menuBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        menuBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Mobile menu toggle
    hamburger.addEventListener('click', function () {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close button click
    if (menuClose) {
        menuClose.addEventListener('click', function (e) {
            e.stopPropagation();
            closeMenu();
        });
    }

    // Close menu when clicking on backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', function () {
            closeMenu();
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Enhanced smooth scroll for navigation links with custom animation
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                smoothScrollTo(targetSection.offsetTop - 80, 800);
            }
        });
    });

    // Optimized navbar background on scroll - combined with other scroll handlers
    // This will be handled by the unified scroll handler below
}

// Enhanced Scroll animations with mobile optimizations
function initScrollAnimations() {
    const isMobile = window.innerWidth <= 768;

    // Optimized observer options for mobile (less work)
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1, // Lower threshold on mobile
        rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px' // Less margin on mobile
    };

    // Main observer for sections - optimized delays for both mobile and desktop
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Reduced delays for faster appearance on both platforms
                const delay = isMobile ? index * 20 : index * 30; // Faster on desktop too
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Enhanced observer for elements - optimized for both platforms
    const elementObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Reduced stagger for faster animations
                const staggerDelay = isMobile ? (index % 6) * 50 : (index % 6) * 60; // Faster on desktop
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, staggerDelay);
                elementObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile ? 0.1 : 0.12, // Slightly lower on desktop for faster detection
        rootMargin: isMobile ? '0px 0px -40px 0px' : '0px 0px -60px 0px' // Less margin on desktop
    });

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });

    // Observe all animated elements with a single loop
    const animatedSelectors = [
        '.project-card',
        '.skill-item',
        '.stat',
        '.contact-method',
        '.cert-item',
        '.skills-category'
    ];

    animatedSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add('fade-in');
            elementObserver.observe(element);
        });
    });
}


// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Submit to Web3Forms
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .then(data => {
                if (data.success) {
                    handleFormSuccess();
                } else {
                    throw new Error(data.message || 'Form submission failed');
                }
            })
            .catch(() => {
                // Fallback to mailto if Web3Forms fails
                const emailSubject = encodeURIComponent(`New Contact from ${name} - Portfolio Website`);
                const emailBody = encodeURIComponent(`Hello Tarun,

You have received a new message from your portfolio website:

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from your portfolio contact form.`);

                const mailtoLink = `mailto:tarun422rathore@gmail.com?subject=${emailSubject}&body=${emailBody}`;
                window.location.href = mailtoLink;
                handleFormSuccess();
            })
            .finally(() => {
                resetSubmitButton(submitBtn, originalText);
            });
    });

    function handleFormSuccess() {
        // Show success message
        formSuccess.style.display = 'flex';
        contactForm.reset();
        showNotification('Thanks for reaching out! I\'ll get back to you soon.', 'success');

        // Scroll to success message smoothly
        const formSuccessTop = formSuccess.getBoundingClientRect().top + window.pageYOffset - 100;
        smoothScrollTo(formSuccessTop, 600);

        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
    }

    function resetSubmitButton(submitBtn, originalText) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d4aa, #0099cc)' : type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 'linear-gradient(135deg, #0066ff, #00d4aa)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Resume download functionality
function initResumeDownload() {
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Create a link to download the PDF file
        const link = document.createElement('a');
        link.href = 'resume/Er. Tarun Kumar Rathore.pdf';
        link.download = 'resume/Er. Tarun Kumar Rathore.pdf';
        link.target = '_blank';

        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Resume download started!', 'success');
    });
}


// Typing animation effect for hero subtitle
function initTypingEffect() {
    const subtitleText = document.querySelector('.subtitle-text');
    if (!subtitleText) return;

    const titles = [
        'Delivering Scalable ML & Agentic AI Solutions',
        'AI & Data Science Professional',
        'Generative AI Engineer',
        'Data Analyst Specialist',
        'Power BI Developer',
        'SQL-Driven Solutions'
    ];

    let currentIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let charIndex = 0;

    function typeText() {
        const currentTitle = titles[currentIndex];

        if (!isDeleting && charIndex < currentTitle.length) {
            // Typing forward
            currentText = currentTitle.substring(0, charIndex + 1);
            subtitleText.textContent = currentText;
            charIndex++;
            setTimeout(typeText, 100);
        } else if (!isDeleting && charIndex === currentTitle.length) {
            // Finished typing, wait before deleting
            setTimeout(() => {
                isDeleting = true;
                typeText();
            }, 2000); // Wait 2 seconds before deleting
        } else if (isDeleting && charIndex > 0) {
            // Deleting backward
            currentText = currentTitle.substring(0, charIndex - 1);
            subtitleText.textContent = currentText;
            charIndex--;
            setTimeout(typeText, 50); // Faster deletion
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next title
            isDeleting = false;
            currentIndex = (currentIndex + 1) % titles.length;
            setTimeout(typeText, 500); // Brief pause before next title
        }
    }

    // Start typing animation after initial delay
    setTimeout(() => {
        typeText();
    }, 1000);
}

// Optimized parallax effect - disabled on mobile, optimized for desktop
function initParallaxEffect() {
    // Disable parallax on mobile devices for better scroll performance
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        return; // Skip parallax on mobile
    }

    const floatingElements = document.querySelectorAll('.element');
    if (floatingElements.length === 0) return;

    // Cache elements and pre-calculate speeds
    const elements = Array.from(floatingElements).map((element, index) => ({
        element: element,
        speed: (index + 1) * 0.1
    }));

    let parallaxTicking = false;
    let lastScrollY = 0;
    let lastParallaxY = 0;

    function updateParallax() {
        const scrolled = window.pageYOffset;

        // Only update if scroll changed significantly (reduces work)
        const scrollDiff = Math.abs(scrolled - lastScrollY);
        if (scrollDiff < 3) {
            parallaxTicking = false;
            return;
        }

        lastScrollY = scrolled;
        const rate = scrolled * -0.5;

        // Only update if parallax position changed significantly
        const parallaxDiff = Math.abs(rate - lastParallaxY);
        if (parallaxDiff < 0.5) {
            parallaxTicking = false;
            return;
        }

        lastParallaxY = rate;

        // Batch DOM updates
        elements.forEach(({ element, speed }) => {
            element.style.transform = `translateY(${rate * speed}px)`;
        });
        parallaxTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });
}

// Initialize parallax effect
initParallaxEffect();

// Enhanced smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            smoothScrollTo(target.offsetTop - 80, 800);
        }
    });
});

// Add loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Add a subtle fade-in effect to the entire page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Unified optimized scroll handler for all scroll operations - desktop & mobile
let unifiedScrollTicking = false;
let lastScrollY = 0;
let lastNavbarState = false;
let lastButtonState = false;

// Cache DOM elements for better performance
let cachedNavbar = null;
let cachedProgressBar = null;
let cachedScrollToTopBtn = null;
let cachedDocHeight = 0;

function cacheDOMElements() {
    cachedNavbar = document.querySelector('.navbar');
    cachedProgressBar = document.querySelector('.scroll-progress');
    cachedScrollToTopBtn = document.getElementById('scrollToTop');
    cachedDocHeight = document.body.scrollHeight - window.innerHeight;
}

// Cache elements on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cacheDOMElements);
} else {
    cacheDOMElements();
}

// Recalculate doc height on resize (throttled)
let resizeTicking = false;
window.addEventListener('resize', function () {
    if (!resizeTicking) {
        requestAnimationFrame(() => {
            cachedDocHeight = document.body.scrollHeight - window.innerHeight;
            resizeTicking = false;
        });
        resizeTicking = true;
    }
}, { passive: true });

function unifiedScrollHandler() {
    const scrollY = window.pageYOffset || window.scrollTop;
    const isMobile = window.innerWidth <= 768;
    const scrollDiff = Math.abs(scrollY - lastScrollY);

    // Only update if scroll changed significantly (reduces work)
    if (scrollDiff < 1) {
        unifiedScrollTicking = false;
        return;
    }

    // Navbar background update (only when state changes)
    if (cachedNavbar) {
        const shouldBeDark = scrollY > 100;
        if (shouldBeDark !== lastNavbarState) {
            cachedNavbar.style.background = shouldBeDark
                ? 'rgba(10, 10, 10, 0.98)'
                : 'rgba(10, 10, 10, 0.95)';
            lastNavbarState = shouldBeDark;
        }
    }

    // Scroll progress bar (throttled for both mobile and desktop)
    const progressThreshold = isMobile ? 15 : 5; // Desktop: update more frequently but still throttled
    if (scrollDiff > progressThreshold && cachedProgressBar) {
        const scrollPercent = (scrollY / cachedDocHeight) * 100;
        cachedProgressBar.style.width = scrollPercent + '%';
    }

    // Scroll to top button visibility (only when state changes)
    if (cachedScrollToTopBtn) {
        const shouldBeVisible = scrollY > 300;
        if (shouldBeVisible !== lastButtonState) {
            if (shouldBeVisible) {
                cachedScrollToTopBtn.classList.add('visible');
            } else {
                cachedScrollToTopBtn.classList.remove('visible');
            }
            lastButtonState = shouldBeVisible;
        }
    }

    lastScrollY = scrollY;
    unifiedScrollTicking = false;
}

// Make it accessible globally for scroll-to-top button
window.unifiedScrollHandler = unifiedScrollHandler;

// Single optimized scroll listener for all scroll operations
window.addEventListener('scroll', function () {
    if (!unifiedScrollTicking) {
        window.requestAnimationFrame(unifiedScrollHandler);
        unifiedScrollTicking = true;
    }
}, { passive: true });

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #00d4aa, #0099cc);
        z-index: 10000;
        transition: width 0.2s ease;
        will-change: width;
    `;
    document.body.appendChild(progressBar);
}

// Initialize scroll progress
initScrollProgress();

// Add particle effect for hero section
function initParticleEffect() {
    const heroSection = document.querySelector('.hero');
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    heroSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 170, ${particle.opacity})`;
            ctx.fill();
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Initialize particle effect
initParticleEffect();

// Certificates functionality - open PDF on click
function initCertificates() {
    const certItems = document.querySelectorAll('.cert-item');

    if (certItems.length === 0) return;

    certItems.forEach(certItem => {
        certItem.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const pdfPath = this.getAttribute('data-pdf');
            if (pdfPath) {
                showNotification('Opening certificate PDF...', 'success');
                setTimeout(() => window.open(encodeURI(pdfPath), '_blank'), 1000);
            } else {
                showNotification('Certificate PDF not found', 'error');
            }
        }, { passive: false });
    });
}

// Number animation (count-up effect) for stats
function initNumberAnimation() {
    const stats = document.querySelectorAll('.stat h3');

    const animateNumber = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target + '+';
            }
        };

        updateNumber();
    };

    // Create intersection observer for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const statElement = entry.target;
                const text = statElement.textContent.trim();
                const number = parseInt(text);

                if (!isNaN(number)) {
                    statElement.dataset.animated = 'true';
                    statElement.textContent = '0+';
                    animateNumber(statElement, number, 2000);
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Observe all stat numbers
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (!scrollToTopBtn) return;

    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    // Scroll button visibility is handled by unified scroll handler
    // No need for separate listener

    // Check on page load
    toggleScrollButton();

    // Function to handle smooth scroll to top - starts immediately
    function scrollToTop(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Start scroll immediately without any delay
        smoothScrollTo(0, 1000);
    }

    // Track if scroll is already in progress to prevent multiple triggers
    let isScrolling = false;

    // Handle click event - immediate response
    scrollToTopBtn.addEventListener('click', function (e) {
        if (!isScrolling) {
            isScrolling = true;
            scrollToTop(e);
            // Reset flag after animation completes
            setTimeout(() => {
                isScrolling = false;
            }, 1100);
        }
    }, { passive: false });

    // Handle touch events - start immediately on touchstart for instant response
    let touchStarted = false;
    let touchMoved = false;

    scrollToTopBtn.addEventListener('touchstart', function (e) {
        touchStarted = true;
        touchMoved = false;
        // Start scroll immediately on touchstart for instant response
        if (!isScrolling) {
            isScrolling = true;
            e.preventDefault();
            e.stopPropagation();
            scrollToTop(e);
            setTimeout(() => {
                isScrolling = false;
            }, 1100);
        }
    }, { passive: false });

    scrollToTopBtn.addEventListener('touchmove', function (e) {
        if (touchStarted) {
            touchMoved = true;
        }
    }, { passive: true });

    scrollToTopBtn.addEventListener('touchend', function (e) {
        // Prevent default behavior that might cause delay
        if (touchStarted && !touchMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
        touchStarted = false;
        touchMoved = false;
    }, { passive: false });
}

// Send visit notification email
function sendVisitNotification() {
    if (typeof emailjs === 'undefined') return;

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_ad42fbc';
    const EMAILJS_TEMPLATE_ID = 'template_jfcj8er';

    // Get visit time
    const visitTime = new Date().toLocaleString();

    // Prepare email template parameters
    const templateParams = {
        date: visitTime,
        visitor: 'New visitor accessed your portfolio page.'
    };

    // Send email silently
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).catch(() => {
        // Fail silently
    });
}

