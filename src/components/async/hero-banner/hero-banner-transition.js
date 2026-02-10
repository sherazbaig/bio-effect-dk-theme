import { EventInterface } from '@splidejs/splide'
import timings from '~/config/timings'

export function CustomHeroBannerTransition(Splide, Components) {
  const { on } = EventInterface(Splide)
  const { Arrows } = Components
  const { list, pagination, track } = Components.Elements
  const transitionSpeed = 700

  let direction = null
  let transitionActive = false

  function mount() {
    setLayout()
    setClickOnArrows()
    detectSlideChange()
    controlCarouselEvents()
  }

  // eslint-disable-next-line no-empty-function
  function start() {}

  /**
   * Sets primary layout for banner (slides behind each other)
   */
  function setLayout() {
    for (let index = 0; index < list.children.length; index++) {
      const slide = list.children[index]
      const slideTranslate = -100 * index

      slide.style.opacity = '1'
      slide.style.height = '0'
      slide.style.transition = `clip-path ${transitionSpeed}ms`
      slide.style.transform = `translateX(${slideTranslate}%)`

      if (index === 0) {
        slide.style.zIndex = '2'
        slide.style.height = '100%'

        continue
      }

      slide.style.zIndex = '0'
      slide.classList.add('idle-state')
    }
  }

  /**
   * Added this as waitForTransition option in
   * Splide API is not working correctly
   */
  function controlCarouselEvents() {
    on('move', () => {
      if (!transitionActive) {
        setTimeout(() => {
          transitionActive = false
          toggleArrowState('active')
          togglePaginationState('active')
          toggleMobileState('active')
        }, transitionSpeed + 800)
      }

      transitionActive = true
      toggleArrowState('inactive')
      togglePaginationState('inactive')
      toggleMobileState('inactive')
    })
  }

  /**
   * Makes arrows passive
   *
   * @param {String} state - active/inactive to remove click on the buttons
   */
  function toggleArrowState(state) {
    if (state === 'inactive') {
      Arrows.arrows.next.classList.add('click-disabled')
      Arrows.arrows.prev.classList.add('click-disabled')

      return
    }

    Arrows.arrows.next.classList.remove('click-disabled')
    Arrows.arrows.prev.classList.remove('click-disabled')
  }

  /**
   * Makes pagination passive
   *
   * @param {String} state - active/inactive to remove click on the buttons
   */
  function togglePaginationState(state) {
    for (let index = 0; index < pagination.children.length; index++) {
      const paginationChild = pagination.children[index]
      const paginationButton = paginationChild.querySelector('button')

      if (state === 'inactive') {
        paginationButton.classList.add('click-disabled')

        continue
      }

      paginationButton.classList.remove('click-disabled')
    }
  }

  function toggleMobileState(state) {
    if (state === 'inactive') {
      track.classList.add('click-disabled')

      return
    }

    track.classList.remove('click-disabled')
  }

  /**
   * Sets direction on click on arrows
   */
  function setClickOnArrows() {
    Arrows.arrows.next.addEventListener('click', () => {
      direction = 'right'
    })

    Arrows.arrows.prev.addEventListener('click', () => {
      direction = 'left'
    })
  }

  /**
   * Scrolls to the selected slide.
   *
   * @param {Object} current - Slide animation starts at
   * @param {Object} target - Slide animation ends at
   * @param {String} moveDirection - Direction of transition
   */
  function scrollTo(current, target, moveDirection) {
    const nextSlide = list.children[target.page]

    nextSlide.style.zIndex = '1'
    nextSlide.style.height = '100%'

    for (let index = 0; index < list.children.length; index++) {
      if (index !== target.page && index !== current.page) {
        const child = list.children[index]

        child.style.zIndex = '0'
        child.style.height = '0'
      }
    }

    const activeSlide = list.children[current.page]
    activeSlide.classList.add('exit-active')
    activeSlide.style.clipPath = moveDirection === 'right'
      ? 'polygon(0% 0,0 0,0 100%,0% 100%)'
      : 'polygon(100% 0, 100% 0,100% 100%,100% 100%)'

    setTimeout(() => {
      nextSlide.classList.add('enter-active')
      nextSlide.classList.remove('idle-state')
    }, timings.normal)

    setTimeout(() => {
      activeSlide.style.zIndex = '0'
      activeSlide.style.height = '0'
      activeSlide.style.clipPath = ''
      activeSlide.classList.add('idle-state')
      activeSlide.classList.remove('enter-active')
      activeSlide.classList.remove('exit-active')
      nextSlide.style.zIndex = '2'
      nextSlide.style.height = '100%'
    }, transitionSpeed)

    direction = null
  }

  /**
   * Detects when new slider selected, triggers scroll
   */
  function detectSlideChange() {
    on('pagination:updated', (_, prevElement, currElement) => {
      if (prevElement) {
        setTimeout(() => {
          scrollTo(
            prevElement,
            currElement,
            direction ? direction : getDirection(prevElement, currElement),
          )
        }, timings.quick)
      }
    })
  }

  /**
   * Calculates scroll direction in case if arrows not clicked
   *
   * @param {Object} prevElement
   * @param {Object} currElement
   * @returns {String} direction right/left
   */
  function getDirection(prevElement, currElement) {
    if (

      /**
       * Slide switched from index is less than target Slide index
       */
      (prevElement.page < currElement.page ||

      /**
       * Slide switched from is last slide and target slide is first slide
       */
      (prevElement.page === list.children.length - 1 && currElement.page === 0)) &&

      /**
       * Slide switched from is not first slide and target slide is not last
       */
      !(prevElement.page === 0 && currElement.page === list.children.length - 1)
    ) {
      return 'right'
    }

    return 'left'
  }

  function cancel() {
    list.style.transition = ''
  }

  return {
    start,
    mount,
    cancel,
  }
}
