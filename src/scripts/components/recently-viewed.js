/**
 * Component: Recently viewed script.
 * -----------------------------------------------------------------------------
 * Recently viewed script which creates recently viewed products carousel in
 * account page.
 *
 */
import Splide from '@splidejs/splide'
import { values as breakpoints } from '~/config/breakpoints'

/**
 * DOM selectors.
 */
const selectors = {
  carousel: '#carousel',
  carouselList: '#carousel-list',
  fallbackProducts: '[js-fallback-products]',
  footer: '.customers-account__footer',
  productWrapper: '.customers-account__carousel',
}

/**
 * Create a new example object.
 */
export default () => {

  /**
   * DOM node selectors.
   */
  const nodeSelectors = {
    carousel: document.querySelector(selectors.carousel),
    fallbackProducts: document.querySelector(selectors.fallbackProducts),
    productWrapper: document.querySelector(selectors.productWrapper),
  }

  let products = []

  const config = {
    arrows: false,
    breakpoints: {
      [breakpoints.l]: {
        arrows: true,
        gap: 'var(--spacing-xl)',
        perPage: 2,
      },
      [breakpoints.xl]: {
        keyboard: true,
        perPage: 3,
      },
    },
    gap: 'var(--spacing-m)',
    mediaQuery: 'min',
    pagination: false,
    perMove: 1,
    perPage: 1,
    speed: 600,
    type: 'slide',
  }

  /**
   * Initialise component.
   */
  function init() {
    setRecentlyViewedProducts()
    initCarousel()
  }

  /**
   * Reads recently viewed products from local storage and builds the HTML.
   */
  function setRecentlyViewedProducts() {
    products = JSON.parse(
      localStorage.getItem('recentlyViewed'),
    ) || cnvs.customer.fallbackProducts || []

    if (products.length === 0) {
      return
    }

    let html = ''

    products.forEach(product => {
      html += `
        <div class="customers-account__slide splide__slide">
          <a
            class="customers-account__slide-wrapper"
            href="${product.url}"
          >
            <h3 class="customers-account__product-title text-h5-desktop text-h6">
              ${product.name}
            </h3>
            <div class="customers-account__view-image-wrapper">
              <img
                src="${product.image}"
                alt="${product.name}"
                class="customers-account__view-image"
              >
            </div>
          </a>
        </div>
      `
    })

    if (!window.matchMedia(`(min-width: ${breakpoints.m}px)`).matches) {
      html += '<div class="splide__slide"></div>'
    }

    nodeSelectors.productWrapper.insertAdjacentHTML('beforeend', html)
  }

  /**
   * Initialise carousel.
   */
  function initCarousel() {
    const carousel = new Splide(nodeSelectors.carousel, config)
    carousel.mount()

    if (window.matchMedia(`(min-width: ${breakpoints.m}px)`).matches) {
      nodeSelectors.carousel.querySelector(selectors.carouselList).style.transform = 'translateX(-100px)'
    }

    if (products.length < 4) {
      nodeSelectors.carousel.querySelector(selectors.footer).style.display = 'none'
    }
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}
