// --- Buy Page Handlers ---

// Gets the product ID from the URL query parameter (e.g., ?id=123)
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Renders the product details on the buy page
async function loadProductDetails() {
    const productId = getProductIdFromUrl();
    const container = document.getElementById('product-detail-card');
    const messageEl = document.getElementById('buy-message');

    if (!productId) {
        container.innerHTML = '<h2>Error: Product ID missing.</h2>';
        return;
    }
    
    container.innerHTML = `<h2>Loading Product ID: ${productId}...</h2>`;

    try {
        const product = await apiFetch(`${PRODUCT_ENDPOINT}/${productId}`, { method: 'GET' });
        
        container.innerHTML = `
            <img src="${product.imageUrl || 'placeholder.jpg'}" alt="${product.name}">
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p>${product.description}</p>
            </div>
        `;
        // Store product data temporarily for 'Add to Cart'
        container.dataset.productData = JSON.stringify(product);

    } catch (error) {
        container.innerHTML = `<h2>Failed to load product details.</h2>`;
        messageEl.textContent = `Error: ${error.message}`;
        messageEl.className = 'message error';
        console.error("Product detail error:", error);
    }
}

// Adds the current product/quantity to the cart in localStorage
function handleAddToCart() {
    const container = document.getElementById('product-detail-card');
    const messageEl = document.getElementById('buy-message');
    const quantityInput = document.getElementById('quantity');

    if (!container.dataset.productData) {
        messageEl.textContent = 'Error: Product data not loaded.';
        messageEl.className = 'message error';
        return;
    }

    const product = JSON.parse(container.dataset.productData);
    const quantity = parseInt(quantityInput.value, 10);
    
    if (quantity <= 0) return;

    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // If product already exists, update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new product
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    saveCart(cart);
    messageEl.textContent = `${quantity}x ${product.name} added to cart!`;
    messageEl.className = 'message success';
    
    // Optional: Reset quantity to 1 after adding
    quantityInput.value = 1; 
}

// Attach event listeners for the Buy page
if (document.getElementById('product-detail-card')) {
    window.addEventListener('load', loadProductDetails);
    
    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', handleAddToCart);
    }
}
