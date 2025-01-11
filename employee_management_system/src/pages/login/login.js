import { ErrorMessage } from '../../components/error_message/error_message.js';

document.addEventListener('DOMContentLoaded', () => {
    ErrorMessage.getInstance();

    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    togglePassword?.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.classList.toggle('bi-eye');
        toggleIcon.classList.toggle('bi-eye-slash');
    });

    // Form submission
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check hardcoded credentials
        if (email === 'admin@gmail.com' && password === 'admin') {
            // Store simple user session
            localStorage.setItem('user', JSON.stringify({ email }));
            window.location.href = '/src/pages/home_screen/home_screen.html';
        } else {
            ErrorMessage.show('Invalid credentials', 'Authentication Error');
            // Clear form
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        }
    });
});
