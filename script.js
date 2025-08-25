// DOM elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Contact form elements
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const charCount = document.getElementById('charCount');
const messageField = document.getElementById('message');

// Form fields configuration
const fields = {
    fullName: {
        element: document.getElementById('fullName'),
        error: document.getElementById('fullNameError'),
        required: true,
        minLength: 2
    },
    email: {
        element: document.getElementById('email'),
        error: document.getElementById('emailError'),
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    subject: {
        element: document.getElementById('subject'),
        error: document.getElementById('subjectError'),
        required: true,
        minLength: 3
    },
    message: {
        element: document.getElementById('message'),
        error: document.getElementById('messageError'),
        required: true,
        minLength: 10,
        maxLength: 1000
    }
};

// Validation messages
const messages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: (min) => `Must be at least ${min} characters long`,
    maxLength: (max) => `Must not exceed ${max} characters`,
    fullName: 'Please enter your full name (first and last)',
    subject: 'Please provide a subject for your message'
};

// Initialize the application
function init() {
    setupScrollAnimations();
    setupNavigation();
    setupContactForm();
    setupSmoothScrolling();
}

// Scroll-triggered animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation delay for elements in the same section
                const section = entry.target.closest('section');
                const elementsInSection = section ? section.querySelectorAll('.animate-on-scroll') : [entry.target];
                const elementIndex = Array.from(elementsInSection).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, elementIndex * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Navigation functionality
function setupNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

// Contact form functionality
function setupContactForm() {
    if (!form) return; // Exit if form doesn't exist
    
    // Add event listeners
    form.addEventListener('submit', handleSubmit);
    
    // Add real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field.element) {
            field.element.addEventListener('blur', () => validateField(fieldName));
            field.element.addEventListener('input', () => {
                clearFieldError(fieldName);
                if (fieldName === 'message') {
                    updateCharacterCount();
                }
            });
        }
    });
    
    // Initialize character count
    if (messageField && charCount) {
        updateCharacterCount();
    }
    
    // Add form reset functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });
}

// Validate individual field
function validateField(fieldName) {
    const field = fields[fieldName];
    if (!field || !field.element) return true;
    
    const value = field.element.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.required && !value) {
        isValid = false;
        errorMessage = messages.required;
    }
    // Check minimum length
    else if (value && field.minLength && value.length < field.minLength) {
        isValid = false;
        errorMessage = messages.minLength(field.minLength);
    }
    // Check maximum length
    else if (value && field.maxLength && value.length > field.maxLength) {
        isValid = false;
        errorMessage = messages.maxLength(field.maxLength);
    }
    // Check email pattern
    else if (fieldName === 'email' && value && !field.pattern.test(value)) {
        isValid = false;
        errorMessage = messages.email;
    }
    // Check full name (should have at least 2 words)
    else if (fieldName === 'fullName' && value && value.split(' ').filter(word => word.length > 0).length < 2) {
        isValid = false;
        errorMessage = messages.fullName;
    }
    
    // Update field appearance and error message
    if (isValid) {
        showFieldSuccess(fieldName);
    } else {
        showFieldError(fieldName, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = fields[fieldName];
    if (!field || !field.element || !field.error) return;
    
    field.element.classList.remove('success');
    field.element.classList.add('error');
    field.error.textContent = message;
    field.error.classList.add('show');
}

// Show field success
function showFieldSuccess(fieldName) {
    const field = fields[fieldName];
    if (!field || !field.element || !field.error) return;
    
    field.element.classList.remove('error');
    field.element.classList.add('success');
    field.error.classList.remove('show');
}

// Clear field error
function clearFieldError(fieldName) {
    const field = fields[fieldName];
    if (!field || !field.element || !field.error) return;
    
    field.element.classList.remove('error', 'success');
    field.error.classList.remove('show');
}

// Validate entire form
function validateForm() {
    let isFormValid = true;
    
    Object.keys(fields).forEach(fieldName => {
        const isFieldValid = validateField(fieldName);
        if (!isFieldValid) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Update character count for message field
function updateCharacterCount() {
    if (!messageField || !charCount) return;
    
    const currentLength = messageField.value.length;
    const maxLength = fields.message.maxLength;
    
    charCount.textContent = currentLength;
    
    // Change color based on character count
    if (currentLength > maxLength * 0.9) {
        charCount.style.color = '#ffd700';
    } else if (currentLength > maxLength * 0.7) {
        charCount.style.color = '#ffa500';
    } else {
        charCount.style.color = 'rgba(255, 255, 255, 0.7)';
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    // Hide success message if visible
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    // Validate form
    if (!validateForm()) {
        // Focus on first error field
        const firstErrorField = Object.keys(fields).find(fieldName => 
            fields[fieldName].element && fields[fieldName].element.classList.contains('error')
        );
        if (firstErrorField && fields[firstErrorField].element) {
            fields[firstErrorField].element.focus();
        }
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission();
        
        // Show success message
        showSuccessMessage();
        
        // Reset form after delay
        setTimeout(() => {
            resetForm();
        }, 3000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showSubmissionError();
    } finally {
        hideLoadingState();
    }
}

// Show loading state
function showLoadingState() {
    if (!submitBtn) return;
    
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'flex';
}

// Hide loading state
function hideLoadingState() {
    if (!submitBtn) return;
    
    submitBtn.disabled = false;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText) btnText.style.display = 'flex';
    if (btnLoading) btnLoading.style.display = 'none';
}

// Show success message
function showSuccessMessage() {
    if (!successMessage) return;
    
    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show submission error
function showSubmissionError() {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.marginTop = '1rem';
    errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Something went wrong. Please try again.';
    
    if (form) {
        form.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission() {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Reset form
function resetForm() {
    if (!form) return;
    
    form.reset();
    if (successMessage) {
        successMessage.classList.remove('show');
    }
    
    // Clear all field states
    Object.keys(fields).forEach(fieldName => {
        clearFieldError(fieldName);
    });
    
    // Reset character count
    updateCharacterCount();
    
    // Focus on first field
    if (fields.fullName && fields.fullName.element) {
        fields.fullName.element.focus();
    }
}

// Enhanced input formatting
function formatInput(fieldName, value) {
    switch (fieldName) {
        case 'fullName':
            // Capitalize first letter of each word
            return value.replace(/\b\w/g, l => l.toUpperCase());
        case 'email':
            // Convert to lowercase
            return value.toLowerCase();
        default:
            return value;
    }
}

// Add input formatting listeners
Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];
    if (field.element) {
        field.element.addEventListener('blur', (e) => {
            const formatted = formatInput(fieldName, e.target.value);
            if (formatted !== e.target.value) {
                e.target.value = formatted;
            }
        });
    }
});

// Accessibility enhancements
function enhanceAccessibility() {
    // Add ARIA attributes to form
    if (form) {
        form.setAttribute('novalidate', 'true');
    }
    
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field.element && field.error) {
            field.element.setAttribute('aria-describedby', field.error.id);
            field.element.setAttribute('aria-invalid', 'false');
        }
    });
}

// Parallax effect for hero section
function setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    });
}

// Add scroll-to-top functionality
function addScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    enhanceAccessibility();
    addScrollToTop();
    
    // Add subtle entrance animation for the page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Export functions for potential external use
window.LandingPageAPI = {
    validateForm: validateForm,
    resetForm: resetForm,
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    getFormData: () => {
        const data = {};
        Object.keys(fields).forEach(fieldName => {
            if (fields[fieldName].element) {
                data[fieldName] = fields[fieldName].element.value.trim();
            }
        });
        return data;
    }
};

