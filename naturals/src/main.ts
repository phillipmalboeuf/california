import './app.scss'

import { mount } from 'svelte'

import Swup from 'swup'
import SwupScriptsPlugin from '@swup/scripts-plugin'

import App from './App.svelte'
import Cart from './lib/Cart.svelte'
import { initCarousels } from './lib/carousel'

mount(App, { target: document.getElementById('app')! })
// mount(Cart, { target: document.getElementById('cart-render')! })

const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn)
ready(() => {
  initCarousels()
})

// Re-initialize carousels when the Shopify section is reloaded
document.addEventListener('shopify:section:load', (event) => {
  initCarousels()
})


const swup = new Swup({
  containers: ['#MainContent'],
  // plugins: [new SwupScriptsPlugin()]
});

swup.hooks.on('page:view', (visit) => {
  initCarousels()
  document.dispatchEvent(new Event('page:reset'))
})

// const app = mount(App, {
//   target: document.getElementById('app')!,
// })

// export default app

