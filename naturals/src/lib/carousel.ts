import EmblaCarousel from 'embla-carousel'
import type { EmblaOptionsType } from 'embla-carousel'

export function initCarousels() {
  const carouselElements = document.querySelectorAll('[data-carousel]')
  
  carouselElements.forEach(element => {
    const options: EmblaOptionsType = {
      loop: true,
      dragFree: false,
      // containScroll: "trimSnaps"
    }
    
    // Get any custom options from the data-carousel-options attribute
    const customOptions = element.getAttribute('data-carousel-options')
    if (customOptions) {
      try {
        Object.assign(options, JSON.parse(customOptions))
      } catch (e) {
        console.warn('Invalid carousel options:', e)
      }
    }

    const embla = EmblaCarousel(element as HTMLElement, options)

    const thumbElements = document.querySelectorAll('[data-slide-index]')
    
    const setActiveThumb = () => {
      const currentIndex = embla.selectedScrollSnap()
      thumbElements.forEach((thumb, index) => {
        thumb.classList.toggle('is-current', index === currentIndex)
      })
    }

    embla.on('select', setActiveThumb)
    setActiveThumb() // Set initial state

    thumbElements.forEach(thumb => {
      console.log('thumb', thumb)
      thumb.addEventListener('click', () => {
        embla.scrollTo(parseInt(thumb.getAttribute('data-slide-index') || '0'))
      })
    })
    
    // Store the embla instance on the element for future reference
    ;(element as any).__embla = embla
  })
} 