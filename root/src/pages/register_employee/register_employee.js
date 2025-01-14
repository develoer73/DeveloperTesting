// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm4roBz9LB1gfcbCQdbneZD3FVv2-tQ04",
    authDomain: "testing-74c11.firebaseapp.com",
    projectId: "testing-74c11",
    storageBucket: "testing-74c11.firebasestorage.app",
    messagingSenderId: "187226654133",
    appId: "1:187226654133:web:4712daee4988e4ea8505fc",
    measurementId: "G-MX05Q3154G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true
    });

    // Add floating effect to form fields
    const formFields = document.querySelectorAll('.form-control, .form-select');
    formFields.forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('is-focused');
        });
        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('is-focused');
        });
    });

    // Handle same address checkbox
    const sameAddressCheckbox = document.getElementById('sameAddress');
    const emergencyAddressSection = document.getElementById('emergencyAddressSection');
    const employeeAddress = document.querySelector('textarea[name="address"]');
    const emergencyAddress = document.querySelector('textarea[name="emergencyAddress"]');

    sameAddressCheckbox.addEventListener('change', function() {
        if (this.checked) {
            emergencyAddress.value = employeeAddress.value;
            emergencyAddressSection.style.display = 'none';
        } else {
            emergencyAddress.value = '';
            emergencyAddressSection.style.display = 'block';
        }
    });

    // Form submission
    const form = document.getElementById('employeeForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        registerEmployee();
    });

    // Progress bar update
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', updateProgress);
    });

    function updateProgress() {
        const totalFields = formInputs.length;
        const filledFields = Array.from(formInputs).filter(input => input.value.trim() !== '').length;
        const progress = (filledFields / totalFields) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    async function registerEmployee() {
        try {
            // Show loading state
            const submitBtn = document.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

            // Handle image as base64
            let imageBase64 = null;
            const imageUpload = document.getElementById('imageUpload');
            if (imageUpload.files[0]) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(imageUpload.files[0]);
                });
            }

            // Prepare form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                gender: document.getElementById('gender').value,
                nationality: document.getElementById('nationality').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                position: document.getElementById('position').value,
                department: document.getElementById('department').value,
                profileImage: imageBase64, // Store image as base64
                emergencyContact: {
                    name: document.getElementById('emergencyName').value,
                    relation: document.getElementById('emergencyRelation').value,
                    email: document.getElementById('emergencyEmail').value,
                    phone: document.getElementById('emergencyPhone').value,
                    address: document.getElementById('emergencyAddress').value
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Save to Firestore
            const employeesRef = collection(db, 'employees');
            await addDoc(employeesRef, formData);

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Employee registered successfully',
                confirmButtonColor: '#3085d6'
            }).then((result) => {
                if (result.isConfirmed) {
                    form.reset();
                    window.location.href = '../home_screen/home_screen.html';
                }
            });

        } catch (error) {
            console.error('Error registering employee:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to register employee. Please try again.',
                confirmButtonColor: '#d33'
            });
        } finally {
            // Reset submit button
            const submitBtn = document.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Complete Registration';
        }
    }

    // Replace the existing cancel button handler with this new one
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    
    document.getElementById('cancelBtn').addEventListener('click', function(e) {
        e.preventDefault();
        cancelModal.show();
    });

    document.getElementById('confirmCancel').addEventListener('click', function() {
        window.location.href = '../home_screen/home_screen.html';
    });

    // Image upload preview
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const maxSize = 2 * 1024 * 1024; // 2MB

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            if (file.size > maxSize) {
                alert('File is too large. Maximum size is 2MB.');
                this.value = '';
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                alert('Only JPG, PNG and GIF files are allowed.');
                this.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.add('preview-loaded');
            }
            reader.readAsDataURL(file);
        }
    });
});
