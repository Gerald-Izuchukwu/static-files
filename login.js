// --- Configuration ---
const API_BASE_URL = 'http://your-k8s-ingress-ip-or-hostname'; // Replace with your K8s Ingress/Service
const MESSAGE_ELEMENT_ID = 'login-message';
const LOGIN_ENDPOINT = '/api/auth/login'; // Adjust to your microservice endpoint

// Function to handle the login process
function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById(MESSAGE_ELEMENT_ID);

    messageEl.textContent = 'Logging in...';
    messageEl.className = 'message loading';

    fetch(API_BASE_URL + LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            // Handle 4xx or 5xx errors from the API
            return response.json().then(err => { throw new Error(err.message || 'Login failed.'); });
        }
        return response.json();
    })
    .then(data => {
        // SUCCESS: Store token or session info (e.g., in localStorage)
        localStorage.setItem('authToken', data.token); 
        messageEl.textContent = 'Login successful! Redirecting...';
        messageEl.className = 'message success';
        // In a real app, you would redirect the user:
        // window.location.href = 'dashboard.html';
        console.log("Logged in successfully. Token:", data.token);
    })
    .catch(error => {
        // FAILURE: Display error message
        messageEl.textContent = `Error: ${error.message}`;
        messageEl.className = 'message error';
        console.error("Login API Error:", error);
    });
}

// Attach the login handler to the button
const loginButton = document.getElementById('login-button');
if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
}
