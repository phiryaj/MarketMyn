// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto slide every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Reset interval on manual slide change
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetInterval();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetInterval();
        });
    });
    
    // Mega Menu - Show on hover for desktop, click for mobile
    const megaMenuItems = document.querySelectorAll('.menu-item');
    
    if (window.innerWidth > 768) {
        megaMenuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.mega-menu-content')?.style.display = 'grid';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.mega-menu-content')?.style.display = 'none';
            });
        });
    } else {
        megaMenuItems.forEach(item => {
            const menuLink = item.querySelector('.menu-link');
            const megaContent = item.querySelector('.mega-menu-content');
            
            if (megaContent) {
                menuLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Close other mega menus
                    document.querySelectorAll('.mega-menu-content').forEach(content => {
                        if (content !== megaContent) {
                            content.style.display = 'none';
                        }
                    });
                    
                    // Toggle current mega menu
                    if (megaContent.style.display === 'grid') {
                        megaContent.style.display = 'none';
                    } else {
                        megaContent.style.display = 'grid';
                    }
                });
            }
        });
    }
    
    // Newsletter Subscription
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const newsletterInput = document.querySelector('.newsletter-form input');
    
    subscribeBtn.addEventListener('click', function() {
        const email = newsletterInput.value.trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate subscription
        newsletterInput.value = '';
        alert('Thank you for subscribing to our newsletter!');
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Animation for button
            this.textContent = 'Added!';
            this.style.backgroundColor = '#28a745';
            
            // Update cart count
            let count = parseInt(cartCount.textContent);
            cartCount.textContent = count + 1;
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
    
    // Visit Store buttons
    const visitStoreButtons = document.querySelectorAll('.visit-store');
    
    visitStoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Redirecting to vendor store...');
        });
    });
    
    // Update year in footer
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
});