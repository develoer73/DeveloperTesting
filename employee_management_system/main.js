import { authService } from './src/services/authService.js';
import { handle404 } from './src/utils/404-handler.js';

// Check authentication status and redirect accordingly
async function init() {
    try {
        const user = await authService.getCurrentUser();
        if (!user) {
            window.location.href = './src/pages/login/login.html';
        }
    } catch (error) {
        handle404();
    }
}

// Add event listener for page load errors
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        handle404();
    }
}, true);

init();