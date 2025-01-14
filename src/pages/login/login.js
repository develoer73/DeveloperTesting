import { ErrorMessage } from '../../components/error_message/error_message.js';
import { PATHS } from '../../router/index.js';

document.addEventListener('DOMContentLoaded', initializeLogin);

function initializeLogin() {
    ErrorMessage.getInstance();
    setupPasswordToggle();
    setupLoginForm();
}

function setupPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    togglePassword?.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.classList.toggle('bi-eye');
        toggleIcon.classList.toggle('bi-eye-slash');
    });
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!validateInputs(email, password)) {
        return;
    }

    authenticateUser(email, password);
}

function validateInputs(email, password) {
    if (!email || !password) {
        ErrorMessage.show('Please fill in all fields', 'Validation Error');
        return false;
    }
    return true;
}

function authenticateUser(email, password) {
    if (email === 'admin@gmail.com' && password === 'admin') {
        loginSuccess(email);
    } else {
        loginFailure();
    }
}

function loginSuccess(email) {
    localStorage.setItem('user', JSON.stringify({ email }));
    window.location.href = PATHS.HOME;
}

function loginFailure() {
    ErrorMessage.show('Invalid credentials', 'Authentication Error');
    clearForm();
}

function clearForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}
