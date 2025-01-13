<script lang="ts">
  import { scrollY } from 'svelte/reactivity/window'

  $effect(() => {
    const header = document.querySelector('.header')
    if (scrollY.current > 0 && header && !header.classList.contains('scrolled')) {
      header.classList.add('scrolled')
    } else if (scrollY.current <= 0 && header?.classList.contains('scrolled')) {
      header.classList.remove('scrolled')
    }
  })
</script>
