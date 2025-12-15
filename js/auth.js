// Authentication handling for sign-in page
// This will be extended when backend authentication is implemented

const signinForm = document.querySelector('#signin-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

if (signinForm) {
  signinForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Get form data
    const formData = new FormData(this);
    const email = formData.get('email')?.trim();
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
      showError('Please fill in all fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    
    // Disable submit button during request
    const submitButton = this.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';
    
    try {
      // TODO: Replace this with actual authentication endpoint when backend is ready
      // For now, we'll check if user exists and show a message
      // When authentication is implemented, this should call: POST /auth/login or similar
      
      console.log('Attempting to sign in:', email);
      
      // Check if user exists (temporary - replace with actual auth)
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        // TODO: When backend authentication is ready, verify password here
        // For now, just show success message
        showSuccess('Sign in successful! (Note: Password verification not yet implemented)');
        
        // TODO: Store authentication token/session when backend is ready
        // localStorage.setItem('authToken', response.token);
        // localStorage.setItem('userEmail', email);
        
        // Redirect to dashboard or home page after successful login
        // setTimeout(() => {
        //   window.location.href = 'dashboard.html';
        // }, 1500);
      } else {
        showError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      showError('An error occurred. Please try again later.');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.style.color = '#d32f2f';
  errorMessage.style.backgroundColor = '#ffebee';
  errorMessage.style.padding = '1rem';
  errorMessage.style.borderRadius = '8px';
  errorMessage.style.marginBottom = '1rem';
  errorMessage.style.border = '1px solid #d32f2f';
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  successMessage.style.color = '#2e7d32';
  successMessage.style.backgroundColor = '#e8f5e9';
  successMessage.style.padding = '1rem';
  successMessage.style.borderRadius = '8px';
  successMessage.style.marginBottom = '1rem';
  successMessage.style.border = '1px solid #2e7d32';
}

// Check if user is already signed in (when authentication is implemented)
function checkAuthStatus() {
  // TODO: Check localStorage for auth token
  // const token = localStorage.getItem('authToken');
  // if (token) {
  //   // User is signed in, redirect to dashboard
  //   window.location.href = 'dashboard.html';
  // }
}

// Initialize auth check on page load
if (signinForm) {
  checkAuthStatus();
}

