// Password Visibility Toggle
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
    
    const name = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    const btn = document.getElementById('signupBtn');
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    // Show Loading Animation
    btn.disabled = true;
    text.style.display = 'none';
    loader.style.display = 'inline-flex';

    setTimeout(() => {
        // 1. Get existing users
        const users = JSON.parse(localStorage.getItem('shohoj_sheba_users') || '[]');
        
        // 2. Check for duplicate email
        if (users.find(u => u.email === email)) {
            alert("This email is already registered!");
            btn.disabled = false;
            text.style.display = 'inline-flex';
            loader.style.display = 'none';
            return;
        }

        // 3. Save new user
        users.push({ name, email, password, role });
        localStorage.setItem('shohoj_sheba_users', JSON.stringify(users));

        alert("Registration Successful! Please log in.");
        window.location.href = 'login.html';
    }, 1200);
}