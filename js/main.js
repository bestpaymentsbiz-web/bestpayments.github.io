// ========================================
// Navigation & Mobile Menu
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// Back to Top Button
// ========================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// AOS (Animate On Scroll) Implementation
// ========================================
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => {
        observer.observe(el);
        
        // Add delay if specified
        const delay = el.getAttribute('data-aos-delay');
        if (delay) {
            el.style.transitionDelay = `${delay}ms`;
        }
    });
}

// Initialize AOS on page load
document.addEventListener('DOMContentLoaded', initAOS);

// ========================================
// Contact Form Handling
// ========================================
/* 기존 HTML form을 Naver Form iframe으로 대체하여, 
    해당 로직은 더 이상 필요하지 않으므로 주석 처리합니다.
*/
// const contactForm = document.getElementById('contactForm');

// if (contactForm) {
//     contactForm.addEventListener('submit', (e) => {
//         e.preventDefault();
        
//         // Get form data
//         const formData = {
//             company: document.getElementById('company').value,
//             name: document.getElementById('name').value,
//             phone: document.getElementById('phone').value,
//             email: document.getElementById('email').value,
//             service: document.getElementById('service').value,
//             message: document.getElementById('message').value
//         };

//         // Log form data (in production, this would be sent to a server)
//         console.log('Contact Form Submitted:', formData);

//         // Show success message
//         alert('문의가 성공적으로 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.');

//         // Reset form
//         contactForm.reset();
//     });
// }

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section's nav link
            const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ========================================
// Page Load Animation
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// Dropdown Menu for Mobile
// ========================================
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// ========================================
// Form Validation Enhancement
// ========================================
/*
    기존 HTML form을 Naver Form iframe으로 대체하여, 
    유효성 검사 로직은 더 이상 필요하지 않으므로 주석 처리합니다.
*/
// function validateEmail(email) {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
// }

// function validatePhone(phone) {
//     const re = /^[0-9-]+$/;
//     return re.test(phone);
// }

// // Add real-time validation
// // if (contactForm) is now always false because contactForm is not defined (commented out)
// /*
// if (contactForm) {
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone');

//     emailInput.addEventListener('blur', function() {
//         if (this.value && !validateEmail(this.value)) {
//             this.style.borderColor = '#f44336';
//         } else {
//             this.style.borderColor = '#ddd';
//         }
//     });

//     phoneInput.addEventListener('blur', function() {
//         if (this.value && !validatePhone(this.value)) {
//             this.style.borderColor = '#f44336';
//         } else {
//             this.style.borderColor = '#ddd';
//         }
//     });
// }
// */

// ========================================
// Console Welcome Message
// ========================================
console.log('%c베스트페이먼츠 BestPayments', 'font-size: 24px; font-weight: bold; color: #1E88E5;');
console.log('%c전자결제대행 전문기업', 'font-size: 14px; color: #64B5F6;');
console.log('Website developed with ❤️');