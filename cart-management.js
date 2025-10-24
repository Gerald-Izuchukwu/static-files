// --- API Configuration (Must point to your K8s Ingress/LoadBalancer) ---
const API_BASE_URL = 'http://api.your-microservice-domain.com';
const PRODUCT_ENDPOINT = '/api/products';
const ORDER_ENDPOINT = '/api/orders';

// --- Utility Functions for Cart Management (using localStorage) ---
const CART_STORAGE_KEY = 'shoppingCart';

// Gets the cart array from local storage, or returns an empty array
function getCart() {
    try {
        const cartJson = localStorage.getItem(CART_STORAGE_KEY);
        return cartJson ? JSON.parse(cartJson) : [];
    } catch (e) {
        console.error("Error reading cart from localStorage:", e);
        return [];
    }
}

// Saves the current cart array to local storage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Clears the cart after a successful checkout
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
}

// --- General API Fetch Helper (Handles Auth Token if available) ---
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers // Allow overriding or adding other headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Attach token for protected routes
    }

    const response = await fetch(API_BASE_URL + endpoint, {
        ...options,
        headers: headers,
    });

    if (!response.ok) {
        // Attempt to read error message from the response body
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    // Return the JSON data
    return response.json();
}
