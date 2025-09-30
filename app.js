// Vibe Card Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Demo site switching functionality
    const demoBtns = document.querySelectorAll('.demo-btn');
    const demoIframe = document.getElementById('demo-iframe');
    
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            demoBtns.forEach(otherBtn => {
                otherBtn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Change iframe source
            const siteUrl = this.getAttribute('data-site');
            if (demoIframe && siteUrl) {
                demoIframe.src = siteUrl;
            }
        });
    });

    // Telegram modal functionality
    const telegramBtns = document.querySelectorAll('.telegram-btn');
    const telegramModal = document.getElementById('telegram-modal');
    const telegramLink = document.getElementById('telegram-link');
    
    telegramBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            
            if (telegramModal && telegramLink) {
                telegramLink.href = url;
                showModal(telegramModal);
            }
        });
    });

    // Privacy policy modal functionality
    const privacyLink = document.querySelector('.privacy-link');
    const privacyModal = document.getElementById('privacy-modal');
    
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showModal(privacyModal);
        });
    }

    // Modal close functionality
    const modalCloses = document.querySelectorAll('.modal__close, .modal-close-btn');
    const modalOverlays = document.querySelectorAll('.modal__overlay');
    
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });
    
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });

    // Modal helper functions
    function showModal(modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 250);
    }

    // Smooth scrolling for navigation links
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    
    navLinksAll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.advantage-card, .process-step, .pricing-card, .guarantee-item, .review-placeholder');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .advantage-card,
        .process-step,
        .pricing-card,
        .guarantee-item,
        .review-placeholder {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .advantage-card.animate-in,
        .process-step.animate-in,
        .pricing-card.animate-in,
        .guarantee-item.animate-in,
        .review-placeholder.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .process-step:nth-child(even).animate-in {
            animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .process-step:nth-child(odd).animate-in {
            animation: slideInRight 0.6s ease-out forwards;
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .hero__content {
            animation: heroFadeIn 1s ease-out forwards;
        }
        
        @keyframes heroFadeIn {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .advantage-card:nth-child(1).animate-in {
            animation-delay: 0.1s;
        }
        
        .advantage-card:nth-child(2).animate-in {
            animation-delay: 0.2s;
        }
        
        .advantage-card:nth-child(3).animate-in {
            animation-delay: 0.3s;
        }
        
        .pricing-card:nth-child(1).animate-in {
            animation-delay: 0.1s;
        }
        
        .pricing-card:nth-child(2).animate-in {
            animation-delay: 0.2s;
        }
        
        .pricing-card:nth-child(3).animate-in {
            animation-delay: 0.3s;
        }
        
        .guarantee-item:nth-child(1).animate-in {
            animation-delay: 0.1s;
        }
        
        .guarantee-item:nth-child(2).animate-in {
            animation-delay: 0.2s;
        }
        
        .guarantee-item:nth-child(3).animate-in {
            animation-delay: 0.3s;
        }
        
        .review-placeholder:nth-child(1).animate-in {
            animation-delay: 0.1s;
        }
        
        .review-placeholder:nth-child(2).animate-in {
            animation-delay: 0.2s;
        }
        
        .review-placeholder:nth-child(3).animate-in {
            animation-delay: 0.3s;
        }
        
        .review-placeholder:nth-child(4).animate-in {
            animation-delay: 0.4s;
        }
    `;
    document.head.appendChild(style);

    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });

    // Preload iframe content for better UX
    const preloadIframes = [
        'https://nikita-sinopalnikov-marketer.ru/',
        'https://mirthfulnik.github.io/valentin-poslanchik/',
        'https://anastasiakorob.github.io/anastasiya-korob-psiholog/'
    ];

    // Add loading state to demo iframe
    const demoSection = document.querySelector('.demo');
    if (demoSection && demoIframe) {
        demoIframe.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        demoIframe.addEventListener('loadstart', function() {
            this.style.opacity = '0.5';
        });
    }

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                hideModal(openModal);
            }
        }
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.advantage-card, .pricing-card, .guarantee-item, .review-placeholder');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing effect to chat messages (restart animation on visibility)
    const chatObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const messages = entry.target.querySelectorAll('.message');
                messages.forEach((message, index) => {
                    message.style.animation = 'none';
                    setTimeout(() => {
                        message.style.animation = `messageSlide 0.5s ease-out ${(index + 1) * 1.5}s forwards`;
                    }, 100);
                });
            }
        });
    }, { threshold: 0.5 });

    const chatDemo = document.querySelector('.chat-demo');
    if (chatDemo) {
        chatObserver.observe(chatDemo);
    }

    // Initialize tooltips for better UX
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-charcoal-700);
                color: var(--color-gray-200);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
                box-shadow: var(--shadow-lg);
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });

    console.log('Vibe Card landing page initialized successfully!');
});