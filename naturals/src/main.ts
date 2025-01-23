import { mount } from 'svelte'
import './app.scss'
import App from './App.svelte'
import Cart from './lib/Cart.svelte'
import { initCarousels } from './lib/carousel'

mount(App, { target: document.getElementById('app')! })
// mount(Cart, { target: document.getElementById('cart-render')! })

// Initialize carousels after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initCarousels()
})

// Re-initialize carousels when the Shopify section is reloaded
document.addEventListener('shopify:section:load', (event) => {
  initCarousels()
})

// const app = mount(App, {
//   target: document.getElementById('app')!,
// })

// export default app

