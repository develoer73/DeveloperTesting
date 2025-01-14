export const handleAuthError = (error) => {
    const errorModal = document.getElementById('globalErrorModal');
    const errorMessage = document.getElementById('globalModalErrorMessage');
    const errorDetails = document.getElementById('authErrorDetails');

    if (error.message?.includes('signInWithPassword')) {
        errorMessage.textContent = 'Authentication service is not properly initialized';
        errorDetails.textContent = 'Please check your Supabase client initialization and credentials';
    } else {
        errorMessage.textContent = error.message || 'An unexpected error occurred';
        errorDetails.textContent = 'Please try again later or contact support';
    }

    // Show the modal using Bootstrap
    const bsModal = new bootstrap.Modal(errorModal);
    bsModal.show();
};
