import { mount } from 'svelte'
import './app.scss'
import App from './App.svelte'
import Cart from './lib/Cart.svelte'

mount(App, { target: document.getElementById('app')! })
// mount(Cart, { target: document.getElementById('cart-render')! })

// const app = mount(App, {
//   target: document.getElementById('app')!,
// })

// export default app

