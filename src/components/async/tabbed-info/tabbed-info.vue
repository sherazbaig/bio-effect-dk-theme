<template>
  <div
    v-show="purifiedBlocks.length"
    class="tabbed-info critical-component-clear grid container"
  >
    <div class="col grid xs-span">
      <ul class="tabbed-info__navigation col l2-13 xs-span">
        <li
          v-for="(tab, index) of purifiedBlocks"
          :key="tab.tabTitle"
          class="tabbed-info__navigation-item"
          :class="[
            { [$class('active')]: (index === 0 && activeTab === '') || isActiveTab(tab.tabTitle) },
          ]"
          @click="handleTabClick(tab.tabTitle)"
        >
          <a
            class="tabbed-info__navigation-link text-button-nav"
            :href="`?tab=${convertTitleToCamelCase(tab.tabTitle)}`"
            @click.prevent
            v-text="tab.tabTitle"
          />

          <icon-info-sheet v-if="tab.tabTitle.toLowerCase().includes('info sheet')" />
        </li>
      </ul>

      <div
        v-for="(tab, index) of purifiedBlocks"
        :key="tab.tabTitle"
        class="tabbed-info__content-area"
        :class="getClassForContent(index, tab)"
      >
        <div
          :class="[
            (index === 0 && activeTab === '') || isActiveTab(tab.tabTitle)
              ? (tab.tabType === 'tab-with-before-after' || tab.tabType === 'tab-with-products' ?
                'grid' : '')
              : 'invisible-tab'
          ]"
        >
          <p
            v-if="tab.contentHeading"
            class="tabbed-info__content-heading text-h2-desktop text-mobile-titles"
          >
            {{ tab.contentHeading }}

            <icon-info-sheet
              v-if="tab.tabTitle.toLowerCase().includes('info sheet')"
              class="ml-m"
            />
          </p>

          <div
            v-if="tab.tabContent && tab.tabType !== 'tab-with-products'"
            class="tabbed-info__content"
            :class="tab.tabType === 'tab-with-before-after'? 'col l1-5 xs-span' : 'column'"
            v-html="tab.tabContent"
          />

          <div
            v-if="tab.tabType === 'tab-with-before-after' && tab.beforeImage && tab.afterImage"
            class="tabbed-info__before-after col l6-14 xs-span"
          >
            <div class="tabbed-info__before-after-images">
              <responsive-image
                class="tabbed-info__before-image"
                :image="tab.beforeImage"
                :padding="false"
              />

              <responsive-image
                class="tabbed-info__after-image"
                :image="tab.afterImage"
                :padding="false"
              />

              <input
                v-model="rangeInputValue"
                class="tabbed-info__range-input"
                type="range"
                min="0"
                max="100"
                @change="rangeInputValue = $event.target.value"
              >

              <span class="tabbed-info__separator">
                <span class="tabbed-info__separator-icon" />
              </span>
            </div>

            <div
              v-if="tab.beforeImageText && tab.afterImageText"
              :class="imageBeforeAfterClass"
            >
              <span
                class="tabbed-info__before-text"
                v-text="tab.beforeImageText"
              />
              <span
                class="tabbed-info__after-text"
                v-text="tab.afterImageText"
              />
            </div>
          </div>

          <div
            v-if="tab.tabType === 'tab-with-products'"
            ref="carousel"
            class="col xs-span splide"
            js-splide="carousel"
          >
            <div class="splide__track">
              <ul class="splide__list">
                <li
                  class="tabbed-info__content splide__slide"
                  v-html="tab.tabContent"
                />
                <li
                  v-for="(product, childIndex) of tab.products"
                  :key="childIndex"
                  class="tabbed-info__product splide__slide"
                >
                  <product-card
                    :product="product"
                    :padding="false"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Tabbed info (tabbed-info)
 * -----------------------------------------------------------------------------
 * Tabbed info section.
 *
 * @param {String} blocks - Blocks for creating the tab content and titles.
 *
 */
import Splide from '@splidejs/splide'

import { values as breakpoints } from '~/config/breakpoints'
import classes from '~/config/classes'
import { convertToCamelCase } from '~/helpers/convert'

import ResponsiveImage from '~global/images/responsive-image.vue'
import ProductCard from '~global/product-card/product-card.vue'

import IconInfoSheet from '~icons/general/info-sheet.svg'

export default {
  name: 'TabbedInfo',
  components: { ProductCard, ResponsiveImage, IconInfoSheet },

  props: {
    blocks: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      activeTab: '',
      imageBeforeAfterClass: 'tabbed-info__before-after-text text-mobile-p-desktop text-button-nav col xs-span l6-14 mt-xs',
      rangeInputValue: 50,
      config: {
        arrows: false,
        breakpoints: {
          [breakpoints.m]: {
            fixedWidth: null,
            gap: 'var(--layout-tablet-gutter)',
            perMove: 2,
            perPage: 2,
          },
          [breakpoints.l]: {
            fixedWidth: null,
            gap: 'var(--spacing-xl)',
            keyboard: true,
            perMove: 3,
            perPage: 3,
          },
        },
        gap: 'var(--layout-mobile-gutter)',
        fixedWidth: '300px',
        mediaQuery: 'min',
        speed: this.$timing('normal'),
        type: 'slide',
      },
    }
  },

  computed: {

    /**
     * Return blocks that have tab title and content.
     * Otherwise, the block is not valid render in the section.
     * @return {Array}
     */
    purifiedBlocks() {
      return this.blocks.filter((block) => block.tabTitle && block.tabContent)
    },
  },

  watch: {

    /**
     * Watch for range value input change and set the property value.
     * This is used for the before and after image slider.
     */
    rangeInputValue() {
      document.documentElement.style.setProperty('--range-value', `${this.rangeInputValue}%`)
    },
  },

  mounted() {
    document.documentElement.style.setProperty('--range-value', '50%')
    this.initCarousel()
    this.setPopstateEvent()
    this.setActiveTab()
  },

  methods: {

    /**
     * Check if the tab is active.
     * @param {String} tabTitle
     * @return {boolean}
     */
    isActiveTab(tabTitle) {
      return this.activeTab === tabTitle ||
        this.activeTab === this.convertTitleToCamelCase(tabTitle)
    },

    /**
     * Convert title to camel case.
     * @param {String} value
     * @return {String}
     */
    convertTitleToCamelCase(value) {
      return convertToCamelCase(value)
    },

    /**
     * Set event listener for pop state.
     */
    setPopstateEvent() {
      window.addEventListener('popstate', () => {
        this.setActiveTab()
      })
    },

    /**
     * Get the class for the content area.
     * @param {Number} index
     * @param {Object} tab
     * @return {String}
     */
    getClassForContent(index, tab) {
      let contentClass = ''
      // If this tab is active, do NOT add invisible-tab
      if (
        (index === 0 && this.activeTab === '') || this.isActiveTab(tab.tabTitle)
      ) {
        if (tab.tabType === 'tab-with-before-after') {
          contentClass += 'l2-14'
        } else {
          contentClass += 'l2-13'
        }
        contentClass += ` ${classes.active} col xs-span`
        return contentClass.trim()
      }

      // For inactive tabs, add invisible-tab to hide them
      return 'invisible-tab'
    },

    /**
     * Set the active tab on popstate.
     */
    setActiveTab() {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      const defaultTab = this.convertTitleToCamelCase((this.purifiedBlocks || [])[0]?.tabTitle)
      const param = params.get('tab') || defaultTab
      if (!param) {
        return
      }

      this.activeTab = param

      // Ensure URL reflects the active tab if not already set
      if (!params.get('tab') && defaultTab) {
        this.updateQueryParams(defaultTab)
      }
    },

    /**
     * Handle tab click functionality.
     * @param {String} title
     */
    handleTabClick(title) {
      this.activeTab = this.convertTitleToCamelCase(title)
      this.updateQueryParams(this.activeTab)
    },

    /**
     * Update query params with the tab title.
     * @param {String} tabTitle
     */
    updateQueryParams(tabTitle) {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.set('tab', tabTitle)
      url.search = params.toString()
      window.history.pushState({}, '', url)
    },

    /**
     * Init Splide carousel.
     */
    initCarousel() {
      if (!this.$refs.carousel) {
        return
      }

      this.carousel = new Splide(this.$refs.carousel[0], this.config)
      this.carousel.mount()
    },
  },
}
</script>

<style lang="scss">
@import './tabbed-info';
</style>
