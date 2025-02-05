import './app.scss'
import '/node_modules/plyr/dist/plyr.css'

import { mount } from 'svelte'

import Swup from 'swup'
import SwupScriptsPlugin from '@swup/scripts-plugin'

import App from './App.svelte'
import Cart from './lib/Cart.svelte'
import { initCarousels } from './lib/carousel'
import { initPlyr } from './lib/plyr'
mount(App, { target: document.getElementById('app')! })
// mount(Cart, { target: document.getElementById('cart-render')! })

const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn)
ready(() => {
  initCarousels()
  initPlyr()
})

// Re-initialize carousels when the Shopify section is reloaded
document.addEventListener('shopify:section:load', (event) => {
  initCarousels()
  initPlyr()
})


// const swup = new Swup({
//   containers: ['#MainContent'],
//   // plugins: [new SwupScriptsPlugin()]
// });

// swup.hooks.on('page:view', (visit) => {
//   initCarousels()
//   document.dispatchEvent(new Event('page:reset'))
// })

// const app = mount(App, {
//   target: document.getElementById('app')!,
// })

// export default app

