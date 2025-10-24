// --- Checkout Page Handlers ---

// Populates the cart table summary
function renderCartSummary() {
    const cart = getCart();
    const tbody = document.getElementById('cart-items-body');
    const totalEl = document.getElementById('cart-total');
    let grandTotal = 0;
    
    tbody.innerHTML = ''; // Clear existing rows

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Your cart is empty. <a href="products.html">Start shopping!</a></td></tr>';
        totalEl.textContent = '$0.00';
        document.getElementById('place-order-button').disabled = true;
        return;
    }
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        grandTotal += subtotal;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
        `;
    });

    totalEl.textContent = `$${grandTotal.toFixed(2)}`;
    document.getElementById('place-order-button').disabled = false;
}

// Submits the final order to the microservice
async function handlePlaceOrder() {
    const messageEl = document.getElementById('checkout-message');
    const cart = getCart();
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (cart.length === 0 || !address || !paymentMethod) {
        messageEl.textContent = 'Please fill out all details and ensure your cart is not empty.';
        messageEl.className = 'message error';
        return;
    }
    
    const orderPayload = {
        shippingAddress: address,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({ 
            productId: item.id, 
            quantity: item.quantity, 
            price: item.price 
        }))
    };

    messageEl.textContent = 'Processing order...';
    messageEl.className = 'message loading';
    document.getElementById('place-order-button').disabled = true;

    try {
        const result = await apiFetch(ORDER_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(orderPayload)
        });

        // SUCCESS
        clearCart();
        renderCartSummary(); // Clears the table display
        messageEl.textContent = `Order placed successfully! Order ID: ${result.orderId}`;
        messageEl.className = 'message success';
        
    } catch (error) {
        // FAILURE
        messageEl.textContent = `Order failed: ${error.message}`;
        messageEl.className = 'message error';
        document.getElementById('place-order-button').disabled = false;
        console.error("Order submission error:", error);
    }
}

// Attach event listeners for the Checkout page
if (document.getElementById('cart-summary-table')) {
    window.addEventListener('load', renderCartSummary);

    const placeOrderButton = document.getElementById('place-order-button');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', handlePlaceOrder);
    }
}
