// Toggle Password Visibility
function togglePassword() {
    const pw = document.getElementById('password');
    const icon = document.getElementById('eyeIcon');
    if (pw.type === 'password') {
        pw.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        pw.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Signup Logic
function handleSignup(e) {
    e.preventDefault();
    
    // Select the button and loader
    const btn = document.getElementById('signupBtn');
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');

    // Get input values
    const name = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    // Basic Validation
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    // Visual feedback: Start loading
    btn.disabled = true;
    text.style.display = 'none';
    loader.style.display = 'inline-flex';

    setTimeout(() => {
        // Retrieve existing users from localStorage
        const users = JSON.parse(localStorage.getItem('shohoj_sheba_users') || '[]');
        
        // Check for duplicates
        if (users.find(u => u.email === email)) {
            alert("This email is already registered!");
            btn.disabled = false;
            text.style.display = 'inline-flex';
            loader.style.display = 'none';
            return;
        }

        // Save new user
        users.push({ name, email, password, role });
        localStorage.setItem('shohoj_sheba_users', JSON.stringify(users));

        alert("Registration Successful! Redirecting to login...");
        window.location.href = 'login.html';
    }, 1500);
}