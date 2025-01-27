class CartManager {
  constructor() {
    this.cartDialog = document.getElementById('cart-dialog');
    this.updateCartUI();

    // Listen for product:added events
    document.addEventListener('product:added', () => {
      this.updateCartUI();
      
      setTimeout(()=> this.cartDialog.classList.add('open'), 10)
      this.cartDialog.showModal();
    });

    // Add cart toggle event
    document.querySelectorAll('[data-cart-toggle]').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCart();
      });
    });
  }

  bindEvents() {
    // Quantity selector events
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const input = e.currentTarget.parentNode.querySelector('[data-quantity-input]');
        const newQty = action === 'increase' ? 
          parseInt(input.value) + 1 : 
          Math.max(1, parseInt(input.value) - 1);
        input.value = newQty
        
        this.updateItemQuantity(e.currentTarget.closest('.cart-item').dataset.itemId, newQty);
      });
    });

    // Remove item events
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.removeItem(e.currentTarget.dataset.remove);
      });
    });

    // Upsell add to cart events
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.addUpsellItem(e.target.dataset.productId);
      });
    });
  }

  async updateItemQuantity(itemId, quantity) {
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
      this.updateCartUI(cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  async removeItem(itemKey) {
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
      this.updateCartUI(cart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  async addUpsellItem(productId) {
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
      this.updateCartUI();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  async updateCartUI() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();

      const section = await fetch('/cart?section_id=template--18769867440366__cart')
      const render = await section.text()
      document.getElementById('cart-render').innerHTML = render

      // Update cart count
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = `(${cart.item_count})`;
        el.classList.toggle('hidden', cart.item_count === 0);
      });

      this.bindEvents();

      // // Update progress bar
      // const threshold = 7500; // $75.00
      // const progress = Math.min((cart.total_price / threshold) * 100, 100);
      // document.querySelectorAll('.progress-fill').forEach(el => {
      //   el.style.width = `${progress}%`;
      // });
      
      // // Update progress text
      // const remaining = threshold - cart.total_price;
      // document.querySelectorAll('.progress-text').forEach(progressText => {
      //   if (remaining > 0) {
      //     progressText.textContent = `Add ${formatMoney(remaining)} more to get FREE shipping!`;
      //   } else {
      //     progressText.textContent = '🎉 You\'ve got FREE shipping!';
      //   }
      // });
      
      // // Update subtotal
      // document.querySelectorAll('.cart-subtotal span:last-child').forEach(el => {
      //   el.textContent = formatMoney(cart.total_price);
      // });
    } catch (error) {
      console.error('Error updating cart UI:', error);
    }
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  toggleCart() {
    if (this.cartDialog.open) {
      this.cartDialog.classList.remove('open')
      setTimeout(()=> this.cartDialog.close(), 333);
    } else {
      setTimeout(()=> this.cartDialog.classList.add('open'), 10)
      this.cartDialog.showModal();
    }
  }
}


// const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
ready(() => {
  new CartManager();
}); 