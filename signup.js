/* =============================================
   SHOHOJ SHEBA — SIGNUP.JS (FIXED)
   Proper step highlighting in progress bar
   ============================================= */

let currentStep = 1;
const totalSteps = 4;
let formData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Signup form initialized with proper step highlighting');
    
    setupRoleChange();
    setupInputFocus();
    setupFormValidation();
    setupProgressBarNavigation();
    updateWorkerFields();
    setupAutoSave();
    
    // Initial progress bar update
    updateProgressBar();
});

// ===========================
// AUTO-SAVE FORM DATA
// ===========================
function setupAutoSave() {
    const form = document.getElementById('signupForm');
    
    form.addEventListener('input', (e) => {
        saveFormData();
    });
    
    form.addEventListener('change', (e) => {
        saveFormData();
    });
}

function saveFormData() {
    const form = document.getElementById('signupForm');
    const formDataObj = new FormData(form);
    
    formData = {};
    
    for (let [key, value] of formDataObj.entries()) {
        if (key.endsWith('[]')) {
            const arrayKey = key.replace('[]', '');
            if (!formData[arrayKey]) formData[arrayKey] = [];
            formData[arrayKey].push(value);
        } else {
            formData[key] = value;
        }
    }
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.name && !checkbox.name.endsWith('[]')) {
            formData[checkbox.name] = checkbox.checked;
        }
    });
}

function restoreFormData() {
    const form = document.getElementById('signupForm');
    
    Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        if (Array.isArray(value)) {
            value.forEach(val => {
                const checkbox = form.querySelector(`input[name="${key}[]"][value="${val}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } else {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value;
                } else if (input.type === 'radio') {
                    const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = value;
                }
            }
        }
    });
}

// ===========================
// STEP NAVIGATION
// ===========================
function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }
    
    saveFormData();
    
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
    }
}

function prevStep() {
    saveFormData();
    
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > totalSteps) return;
    
    if (stepNumber > currentStep) {
        if (!validateCurrentStep()) {
            return;
        }
    }
    
    saveFormData();
    
    currentStep = stepNumber;
    updateStepDisplay();
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (activeStep) {
        activeStep.classList.add('active');
    }
    
    // Restore saved data
    restoreFormData();
    
    // Update progress bar
    updateProgressBar();
    
    // Update back button visibility
    updateNavigationButtons();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================
// PROGRESS BAR UPDATE (FIXED)
// ===========================
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    // Set data attribute for CSS styling
    if (progressBar) {
        progressBar.setAttribute('data-current', currentStep);
    }
    
    // Update each step's state
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        
        // Remove all classes first
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            // Steps before current = completed (green with checkmark)
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            // Current step = active (green highlighted)
            step.classList.add('active');
        }
        // Steps after current = default (gray)
    });
}

function updateNavigationButtons() {
    const backButtons = document.querySelectorAll('.btn-back');
    
    backButtons.forEach(btn => {
        if (currentStep === 1) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'inline-flex';
        }
    });
}

// ===========================
// PROGRESS BAR NAVIGATION
// ===========================
function setupProgressBarNavigation() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.style.cursor = 'pointer';
        
        step.addEventListener('click', () => {
            const stepNumber = index + 1;
            
            if (stepNumber <= currentStep + 1) {
                goToStep(stepNumber);
            } else {
                showInfo('Please complete the current step first');
            }
        });
    });
}

// ===========================
// VALIDATION
// ===========================
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    
    if (!currentStepElement) return false;
    
    if (currentStep === 1) {
        return true;
    }
    
    if (currentStep === 2) {
        const firstName = currentStepElement.querySelector('[name="firstName"]');
        const lastName = currentStepElement.querySelector('[name="lastName"]');
        const email = currentStepElement.querySelector('[name="email"]');
        const password = currentStepElement.querySelector('[name="password"]');
        const confirmPassword = currentStepElement.querySelector('[name="confirmPassword"]');
        const dateOfBirth = currentStepElement.querySelector('[name="dateOfBirth"]');
        const gender = currentStepElement.querySelector('[name="gender"]');
        
        if (!firstName?.value.trim()) {
            showError('Please enter your first name');
            firstName?.focus();
            return false;
        }
        
        if (!lastName?.value.trim()) {
            showError('Please enter your last name');
            lastName?.focus();
            return false;
        }
        
        if (!email?.value.trim() || !validateEmail(email.value)) {
            showError('Please enter a valid email address');
            email?.focus();
            return false;
        }
        
        if (!password?.value || password.value.length < 6) {
            showError('Password must be at least 6 characters');
            password?.focus();
            return false;
        }
        
        if (password.value !== confirmPassword?.value) {
            showError('Passwords do not match');
            confirmPassword?.focus();
            return false;
        }
        
        if (!dateOfBirth?.value) {
            showError('Please select your date of birth');
            dateOfBirth?.focus();
            return false;
        }
        
        const age = calculateAge(new Date(dateOfBirth.value));
        if (age < 18) {
            showError('You must be at least 18 years old to sign up');
            return false;
        }
        
        if (!gender?.value) {
            showError('Please select your gender');
            gender?.focus();
            return false;
        }
        
        return true;
    }
    
    if (currentStep === 3) {
        const phone = currentStepElement.querySelector('[name="phone"]');
        const country = currentStepElement.querySelector('[name="country"]');
        const city = currentStepElement.querySelector('[name="city"]');
        const area = currentStepElement.querySelector('[name="area"]');
        const address = currentStepElement.querySelector('[name="address"]');
        
        if (!phone?.value.trim()) {
            showError('Please enter your phone number');
            phone?.focus();
            return false;
        }
        
        if (!country?.value) {
            showError('Please select your country');
            country?.focus();
            return false;
        }
        
        if (!city?.value) {
            showError('Please select your city');
            city?.focus();
            return false;
        }
        
        if (!area?.value.trim()) {
            showError('Please enter your area/district');
            area?.focus();
            return false;
        }
        
        if (!address?.value.trim()) {
            showError('Please enter your street address');
            address?.focus();
            return false;
        }
        
        return true;
    }
    
    if (currentStep === 4) {
        const role = document.querySelector('input[name="role"]:checked')?.value;
        const terms = currentStepElement.querySelector('[name="terms"]');
        
        if (role === 'worker') {
            const experience = currentStepElement.querySelector('[name="experience"]');
            const services = currentStepElement.querySelectorAll('[name="services[]"]:checked');
            const nidNumber = currentStepElement.querySelector('[name="nidNumber"]');
            
            if (!experience?.value) {
                showError('Please select your work experience');
                experience?.focus();
                return false;
            }
            
            if (services.length === 0) {
                showError('Please select at least one service category');
                return false;
            }
            
            if (!nidNumber?.value.trim()) {
                showError('Please enter your NID/Passport number');
                nidNumber?.focus();
                return false;
            }
        }
        
        if (!terms?.checked) {
            showError('You must agree to the Terms & Conditions');
            return false;
        }
        
        return true;
    }
    
    return true;
}

// ===========================
// ROLE CHANGE HANDLER
// ===========================
function setupRoleChange() {
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', updateWorkerFields);
    });
}

function updateWorkerFields() {
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const workerFields = document.querySelector('.worker-fields');
    const userFields = document.querySelector('.user-fields');
    const subtitle = document.getElementById('professionalSubtitle');
    
    if (role === 'worker') {
        workerFields.style.display = 'block';
        userFields.style.display = 'none';
        subtitle.textContent = 'Tell us about your professional background';
        
        document.querySelectorAll('.worker-fields input[data-required="true"]').forEach(field => {
            field.setAttribute('required', 'required');
        });
    } else {
        workerFields.style.display = 'none';
        userFields.style.display = 'block';
        subtitle.textContent = 'Just a few more details to complete your profile';
        
        document.querySelectorAll('.worker-fields input[required]').forEach(field => {
            field.removeAttribute('required');
        });
    }
}

// ===========================
// FORM SUBMISSION
// ===========================
function setupFormValidation() {
    const form = document.getElementById('signupForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        saveFormData();
        
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Form data to submit:', formData);
            
            showSuccess('Account created successfully! Redirecting to login...');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            showError(error.message || 'Failed to create account. Please try again.');
            submitBtn.disabled = false;
            btnText.style.display = 'inline-flex';
            btnLoader.style.display = 'none';
        }
    });
}

// ===========================
// INPUT FOCUS EFFECTS
// ===========================
function setupInputFocus() {
    document.querySelectorAll('.input-wrap input, .input-wrap select, .input-wrap textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.input-wrap')?.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.closest('.input-wrap')?.classList.remove('focused');
        });
    });
}

// ===========================
// PASSWORD TOGGLE
// ===========================
function togglePassword(fieldId, iconId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ===========================
// VALIDATION HELPERS
// ===========================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// ===========================
// NOTIFICATIONS
// ===========================
function showError(message) {
    removeExistingNotifications();
    
    const notification = document.createElement('div');
    notification.className = 'form-notification error';
    notification.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showSuccess(message) {
    removeExistingNotifications();
    
    const notification = document.createElement('div');
    notification.className = 'form-notification success';
    notification.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showInfo(message) {
    removeExistingNotifications();
    
    const notification = document.createElement('div');
    notification.className = 'form-notification info';
    notification.innerHTML = `
        <i class="fa-solid fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function removeExistingNotifications() {
    document.querySelectorAll('.form-notification').forEach(n => n.remove());
}

// Notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .form-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 280px;
        max-width: 400px;
    }
    
    .form-notification.show {
        transform: translateX(0);
    }
    
    .form-notification i {
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .form-notification.error {
        background: linear-gradient(135deg, #dc2626, #ef4444);
        color: white;
    }
    
    .form-notification.success {
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: white;
    }
    
    .form-notification.info {
        background: linear-gradient(135deg, #1565c0, #1e88e5);
        color: white;
    }
    
    @media (max-width: 768px) {
        .form-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: unset;
        }
    }
`;
document.head.appendChild(notificationStyles);
