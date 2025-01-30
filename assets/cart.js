// Cart state
const cartDialog = document.getElementById('cart-dialog');

// Initialize cart functionality
function initializeCart() {
  updateCartUI();

  // Listen for product:added events
  document.addEventListener('product:added', () => {
    updateCartUI();
    
    setTimeout(() => cartDialog.classList.add('open'), 10);
    cartDialog.showModal();
  });

  // Add cart toggle event
  document.querySelectorAll('[data-cart-toggle]').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCart();
    });
  });
}

function bindEvents() {
  // Quantity selector events
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      const input = e.currentTarget.parentNode.querySelector('[data-quantity-input]');
      const newQty = action === 'increase' ? 
        parseInt(input.value) + 1 : 
        Math.max(1, parseInt(input.value) - 1);
      input.value = newQty;
      
      updateItemQuantity(e.currentTarget.closest('.cart-item').dataset.itemId, newQty);
    });
  });

  // Remove item events
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      removeItem(e.currentTarget.dataset.remove);
    });
  });

  // Upsell add to cart events
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      addUpsellItem(e.target.dataset.productId);
    });
  });
}

async function updateItemQuantity(itemId, quantity) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemId,
        quantity: quantity
      })
    });
    
    const cart = await response.json();
    updateCartUI(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

async function removeItem(itemKey) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemKey,
        quantity: 0
      })
    });
    
    const cart = await response.json();
    updateCartUI(cart);
  } catch (error) {
    console.error('Error removing item:', error);
  }
}

async function addUpsellItem(productId) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: productId,
          quantity: 1
        }]
      })
    });
    
    const result = await response.json();
    updateCartUI();
  } catch (error) {
    console.error('Error adding item:', error);
  }
}

async function updateCartUI() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();

    const section = await fetch('/cart?section_id=template--18833287708910__cart')
    const render = await section.text()
    document.getElementById('cart-render').innerHTML = render

    // Update cart count
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = `(${cart.item_count})`;
      el.classList.toggle('hidden', cart.item_count === 0);
    });

    bindEvents();

    // Update progress bar
    const threshold = 7500; // $75.00
    const progress = Math.min((cart.total_price / threshold) * 100, 100);
    document.querySelectorAll('.progress-fill').forEach(el => {
      el.style.width = `${progress}%`;
    });
    
    // Update progress text
    const remaining = threshold - cart.total_price;
    document.querySelectorAll('.progress-text').forEach(progressText => {
      if (remaining > 0) {
        progressText.textContent = `Add ${formatMoney(remaining)} more to get FREE shipping!`;
      } else {
        progressText.textContent = '🎉 You\'ve got FREE shipping!';
      }
    });
  } catch (error) {
    console.error('Error updating cart UI:', error);
  }
}

function formatMoney(cents) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

function toggleCart() {
  if (cartDialog.open) {
    cartDialog.classList.remove('open')
    setTimeout(() => cartDialog.close(), 333);
  } else {
    setTimeout(() => cartDialog.classList.add('open'), 10)
    cartDialog.showModal();
  }
}

// Initialize cart when DOM is ready
ready(() => {
  initializeCart();
}); 