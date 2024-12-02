// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
  // Theme JavaScript initialization
  initProductForms();
  initCollectionPage();
});

function initProductForms() {
  const productForms = document.querySelectorAll('.product-form');
  
  productForms.forEach(form => {
    // Handle variant changes
    const variantSelects = form.querySelectorAll('[data-option-index]');
    variantSelects.forEach(select => {
      select.addEventListener('change', () => updateVariantSelection(form));
    });

    // Handle quantity changes
    const quantityInput = form.querySelector('[data-quantity-input]');
    const quantityButtons = form.querySelectorAll('.quantity-button');

    quantityButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        const currentValue = parseInt(quantityInput.value);

        if (action === 'increase') {
          quantityInput.value = currentValue + 1;
        } else if (action === 'decrease' && currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
    });

    // Handle form submission
    form.addEventListener('submit', handleAddToCart);
  });
}

function updateVariantSelection(form) {
  const productJson = JSON.parse(document.getElementById('ProductJson-' + form.dataset.productId).textContent);
  const variants = productJson.variants;
  
  // Get selected options
  const selectedOptions = Array.from(form.querySelectorAll('[data-option-index]')).map(select => select.value);
  
  // Find matching variant
  const matchingVariant = variants.find(variant => {
    return variant.options.every((option, index) => option === selectedOptions[index]);
  });

  if (matchingVariant) {
    // Update variant ID
    form.querySelector('[name="id"]').value = matchingVariant.id;
    
    // Update price
    const priceElement = form.closest('.product-section').querySelector('[data-product-price]');
    if (priceElement) {
      priceElement.innerHTML = formatMoney(matchingVariant.price);
    }

    // Update availability
    const addToCartButton = form.querySelector('[data-add-to-cart]');
    const addToCartText = form.querySelector('[data-add-to-cart-text]');
    
    if (matchingVariant.available) {
      addToCartButton.disabled = false;
      addToCartText.textContent = theme.strings.addToCart;
    } else {
      addToCartButton.disabled = true;
      addToCartText.textContent = theme.strings.soldOut;
    }
  }
}

async function handleAddToCart(event) {
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector('[data-add-to-cart]');
  const spinner = submitButton.querySelector('.loading-spinner');

  // Show loading state
  submitButton.disabled = true;
  spinner.classList.remove('hidden');

  try {
    const formData = new FormData(form);
    const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      // Success - update cart drawer/counter
      document.dispatchEvent(new CustomEvent('product:added', {
        detail: {
          product: data
        }
      }));
    } else {
      // Error handling
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Reset button state
    submitButton.disabled = false;
    spinner.classList.add('hidden');
  }
}

function formatMoney(cents) {
  return window.theme.moneyFormat.replace('{{amount}}', (cents / 100).toFixed(2));
}

// Collection page functionality
function initCollectionPage() {
  // Initialize sorting
  const sortSelect = document.getElementById('SortBy');
  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', event.target.value);
      window.location.href = url.href;
    });
  }

  // Initialize filter form submission
  const filterForm = document.getElementById('FacetFiltersForm');
  if (filterForm) {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(filterForm);
      const searchParams = new URLSearchParams(formData);
      const url = new URL(window.location.href);
      
      // Clear existing filter params
      const filterParams = Array.from(url.searchParams.keys())
        .filter(key => key.includes('filter.'));
      filterParams.forEach(param => url.searchParams.delete(param));
      
      // Add new filter params
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          url.searchParams.append(key, value);
        }
      }
      
      window.location.href = url.href;
    });
  }
} 