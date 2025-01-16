<script lang="ts">
  import { onMount } from 'svelte'

  let section: string

  onMount(() => {
    fetch('/cart?sections=cart&sections_url=%5C/cart')
      .then(res => res.json())
      .then(data => {
        // console.log(data.cart)
        section = data.cart
      })
  })
</script>

{@html section}