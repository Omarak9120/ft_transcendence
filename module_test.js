// Simple test script to verify modules are loading
console.log('Module test script loaded');

// Test if we can access the DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded successfully');
    
    // Check if auth modal exists
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        console.log('Auth modal found in DOM');
    } else {
        console.error('Auth modal not found in DOM');
    }
    
    // Check if signup/login buttons exist
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    
    if (signupBtn) {
        console.log('Signup button found');
    } else {
        console.error('Signup button not found');
    }
    
    if (loginBtn) {
        console.log('Login button found');
    } else {
        console.error('Login button not found');
    }
});

// Test if we can fetch a script module
fetch('/dist/auth.js')
    .then(response => {
        console.log('Auth.js fetch response:', response.status, response.headers.get('content-type'));
    })
    .catch(error => {
        console.error('Failed to fetch auth.js:', error);
    });
