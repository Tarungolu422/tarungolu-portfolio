// 23 to 26 and then 701 to 731

// Initialize EmailJS early
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('O_ciyEh_y9ZLeTCWp');
    }
})();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initResumeDownload();
    initProjectCards();
    initTypingEffect();
    initCertificates();
    initNumberAnimation();
    initScrollToTop();
});

// // Send visit notification email on page load  currently off
// window.addEventListener('load', function () {
//     sendVisitNotification();
// });

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

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .stat, .contact-method, .cert-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Skill bars animation (removed - using card-based design now)
function initSkillBars() {
    // Skill items will animate via scroll animations instead
    // No longer needed since we removed progress bars
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
            .catch(error => {
                console.error('Error:', error);
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

        // Scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

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

// Project cards interaction
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
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

// Parallax effect for floating elements
function initParallaxEffect() {
    const floatingElements = document.querySelectorAll('.element');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Initialize parallax effect
initParallaxEffect();

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
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
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
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
        // Ensure we only add the listener once and only on actual clicks
        certItem.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const pdfPath = this.getAttribute('data-pdf');

            if (pdfPath) {
                // Encode the path to handle spaces and special characters
                const encodedPath = encodeURI(pdfPath);

                // Show notification first
                showNotification('Opening certificate PDF...', 'success');

                // Wait 1.5 seconds before opening the PDF
                setTimeout(() => {
                    // Open PDF in a new tab
                    window.open(encodedPath, '_blank');
                }, 1000);
            } else {
                showNotification('Certificate PDF not found', 'error');
            }
        }, { once: false, passive: false });
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
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Function to handle scroll to top
    function scrollToTop() {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();

        // Detect if mobile/responsive (width <= 768px)
        const isMobile = window.innerWidth <= 768;
        const duration = isMobile ? 800 : 2000; // Fast on mobile (0.8s), slow on desktop (2s)

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // Handle click event
    scrollToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        scrollToTop();
    });

    // Handle touch events for better mobile responsiveness (no delay)
    let touchStartTime = 0;
    scrollToTopBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
        touchStartTime = Date.now();
    }, { passive: false });

    scrollToTopBtn.addEventListener('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const touchDuration = Date.now() - touchStartTime;
        // Only trigger if it's a quick tap (not a long press)
        if (touchDuration < 300) {
            scrollToTop();
        }
    }, { passive: false });
}

// // Send visit notification email  ----- currently off 
// function sendVisitNotification() {
//     // Check if EmailJS is loaded
//     if (typeof emailjs === 'undefined') {
//         console.warn('EmailJS is not loaded. Visit notification will not be sent.');
//         return;
//     }

//     // EmailJS configuration
//     const EMAILJS_SERVICE_ID = 'service_ad42fbc';
//     const EMAILJS_TEMPLATE_ID = 'template_jfcj8er';

//     // Get visit time
//     const visitTime = new Date().toLocaleString();

//     // Prepare email template parameters
//     const templateParams = {
//         date: visitTime,
//         visitor: 'New visitor accessed your portfolio page.'
//     };

//     // Send email (silently, without user interaction)
//     emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
//         .then(function (response) {
//             console.log('Visit email sent successfully!', response.status, response.text);
//         })
//         .catch(function (error) {
//             console.error('Failed to send visit email:', error);
//             // Fail silently - don't show error to visitors
//         });
// }
