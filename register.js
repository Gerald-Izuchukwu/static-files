// --- Configuration ---
const REGISTER_MESSAGE_ELEMENT_ID = 'register-message';
const REGISTER_ENDPOINT = '/api/auth/register'; // Adjust to your microservice endpoint

// Function to handle the registration process
function handleRegister() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageEl = document.getElementById(REGISTER_MESSAGE_ELEMENT_ID);

    if (password !== confirmPassword) {
        messageEl.textContent = 'Error: Passwords do not match.';
        messageEl.className = 'message error';
        return;
    }

    messageEl.textContent = 'Registering user...';
    messageEl.className = 'message loading';

    fetch(API_BASE_URL + REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || 'Registration failed.'); });
        }
        return response.json();
    })
    .then(data => {
        // SUCCESS: Inform the user and potentially log them in/redirect
        messageEl.textContent = 'Registration successful! Please log in.';
        messageEl.className = 'message success';
        // In a real app, you might redirect:
        // window.location.href = 'login.html';
        console.log("Registered successfully.", data);
    })
    .catch(error => {
        // FAILURE: Display error message
        messageEl.textContent = `Error: ${error.message}`;
        messageEl.className = 'message error';
        console.error("Registration API Error:", error);
    });
}

// Attach the registration handler to the button
const registerButton = document.getElementById('register-button');
if (registerButton) {
    registerButton.addEventListener('click', handleRegister);
}
