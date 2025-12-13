// basic helpers
const yr = document.getElementById('yr'); yr.textContent = new Date().getFullYear();

// ===== HEADER & NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
    });
});

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 30;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target + '+';
            }
        };
        updateCounter();
    });
}

// Trigger counter animation when hero is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('hero')) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});
observer.observe(document.querySelector('.hero'));

// ===== SCROLL ANIMATIONS =====
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'slide-up');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .service-card, .award-card, .partner-logo, .value-card').forEach(el => {
    scrollObserver.observe(el);
});

// ===== INFINITE SCROLLING GALLERY =====
const track = document.querySelector(".gallery-track");

// Duplicate content once for infinite effect
track.innerHTML += track.innerHTML;

// ===== POPUP MODAL =====
const popupModal = document.getElementById('popupModal');
let popupShown = false;
let popupAutoCloseTimer = null;
let popupUserInteracting = false;
let popupInputListeners = []; // store {el, handler} so we can remove listeners later

function clearPopupInputListeners() {
    popupInputListeners.forEach(item => {
        try { item.el.removeEventListener('input', item.handler); } catch(e) {}
        try { item.el.removeEventListener('focus', item.handler); } catch(e) {}
    });
    popupInputListeners = [];
}

function showPopupModal() {
    if (!localStorage.getItem('popupShown')) {
        setTimeout(() => {
            popupModal.classList.add('active');
            popupShown = true;

            // find inputs inside modal
            const inputs = popupModal.querySelectorAll('input, textarea, select');
            popupUserInteracting = false;

            // handler to mark that user started interacting and cancel auto-close
            const onInteract = () => {
                popupUserInteracting = true;
                if (popupAutoCloseTimer) {
                    clearTimeout(popupAutoCloseTimer);
                    popupAutoCloseTimer = null;
                }
                // remove listeners once user begins interacting
                clearPopupInputListeners();
            };

            // attach listeners and keep references so we can remove them later if needed
            inputs.forEach(el => {
                el.addEventListener('input', onInteract);
                el.addEventListener('focus', onInteract);
                popupInputListeners.push({ el, handler: onInteract });
            });

            // set auto-close timer: only close if user did NOT start interacting within 10s
            popupAutoCloseTimer = setTimeout(() => {
                if (!popupUserInteracting) {
                    closePopupModal();
                }
                // cleanup listeners/timer after decision
                if (popupAutoCloseTimer) { clearTimeout(popupAutoCloseTimer); popupAutoCloseTimer = null; }
                clearPopupInputListeners();
            }, 10000);
        }, 3000);
    }
}

function closePopupModal() {
    popupModal.classList.remove('active');
    popupShown = false;
    if (popupAutoCloseTimer) {
        clearTimeout(popupAutoCloseTimer);
        popupAutoCloseTimer = null;
    }
    clearPopupInputListeners();
}

function handlePopupSubmit(e) {
    e.preventDefault();
    // mark shown so it won't reappear
    localStorage.setItem('popupShown', 'true');

    // Immediately close modal when the user submits
    closePopupModal();

    // optional: show a quick thank-you (use alert to keep simple)
    alert('Thank you! We have received your information.');
}

// Show popup on page load
window.addEventListener('load', showPopupModal);

// Close popup when clicking outside
popupModal.addEventListener('click', (e) => {
    if (e.target === popupModal) {
        closePopupModal();
    }
});

// ===== INVESTOR MODAL =====
const investorModal = document.getElementById('investorModal');

function openInvestorModal() {
    investorModal.classList.add('active');
}

function closeInvestorModal() {
    investorModal.classList.remove('active');
    const form = document.getElementById('investorForm');
    if (form) form.reset();
}

function handleInvestorSubmit(e) {
    e.preventDefault();
    alert('Thank you for your interest! We will contact you shortly.');
    closeInvestorModal();
}

investorModal.addEventListener('click', (e) => {
    if (e.target === investorModal) {
        closeInvestorModal();
    }
});

// ===== CAROUSEL =====
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
let autoPlayInterval;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[n]) slides[n].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetAutoPlay();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    resetAutoPlay();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

startAutoPlay();

// ===== CONTACT FORM =====
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    const form = document.getElementById('contactForm');
    if (form) form.reset();
}

// ===== WHATSAPP WIDGET =====
function openWhatsApp() {
    const phoneNumber = '+2347061614705';
    const message = encodeURIComponent('Hello AR-RAZZAQ Global Investment Limited, I would like to learn more about your services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// ===== FORM VALIDATION =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});