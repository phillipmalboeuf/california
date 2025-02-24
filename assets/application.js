const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

ready(() => {
  initProductForms();
  initQuickAdd();
  initCollectionPage();
  initStockist();
})

document.addEventListener('page:reset', () => {
  initProductForms();
  initQuickAdd();
  initCollectionPage();
  initStockist();
})

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
  const formData = new FormData(form)
  const productId = Object.fromEntries(formData).product_id;
  const productJson = JSON.parse(document.getElementById('ProductJson-' + productId).textContent);
  const variants = productJson.product.variants;
  
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

    // Reload page with variant ID
    // const url = new URL(window.location.href);
    // url.searchParams.set('variant', matchingVariant.id);
    // window.location.href = url.href;
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
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
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

async function handleQuickAdd(event) {
  const button = event.currentTarget;
  const spinner = button.querySelector('.loading-spinner');
  
  // Show loading state
  button.disabled = true;
  spinner?.classList.remove('hidden');

  try {
    const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: button.dataset.variantId,
          quantity: 1
        }]
      })
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
    button.disabled = false;
    spinner?.classList.add('hidden');
  }
}

function initQuickAdd() {
  document.querySelectorAll('[data-quick-add-button]').forEach(button => {
    button.addEventListener('click', handleQuickAdd);
  });
}

function initStockist() {
  // const stockistContainer = document.querySelector('[data-stockist-widget-tag]');
  
  // if (stockistContainer && window.Stockist) {
  //   // If there's an existing widget instance, destroy it
  //   // if (window.stockistWidget) {
  //   //   window.stockistWidget.destroy();
  //   // }

  //   // Initialize a new widget instance
    

  //   // Rebuild the widget if needed
  //   if (typeof window.stockistRebuildWidget === 'function') {
  //     window.stockistRebuildWidget();
  //   } else {
  //     window.stockistWidget = window.Stockist({
  //     widget_id: stockistContainer.dataset.stockistWidgetTag,
  //     container: stockistContainer,
  //     loader_image: false,
  //     platform: 'shopify'
  //   });
  //   }
  // }
}