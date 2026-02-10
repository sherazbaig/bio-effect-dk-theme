<template>
  <div class="faq-section critical-component-clear container">
    <div class="faq-section__grid grid">
      <h2
        class="faq-section__title text-h2-desktop text-mobile-titles col l2-5 xs-span"
        v-text="title"
      />

      <div class="faq-section__body col l7-13 xs-span">
        <div
          v-for="(block, index) of blocks"
          :key="`block-${index}`"
          class="faq-section__block"
        >
          <div
            class="faq-section__question-wrapper"
            :aria-label="$string('general.faq.show_answer')"
            role="button"
            tabindex="0"
            @click="questionStates[index] = !questionStates[index]"
            @keyup.enter.space="questionStates[index] = !questionStates[index]"
          >
            <div
              class="faq-section__question text-p-desktop text-mobile-p"
              v-html="block.question"
            />

            <outlined-plus v-if="!questionStates[index]" />
            <outlined-minus v-else />
          </div>

          <transition-height :padding-bottom="32">
            <div
              v-show="questionStates[index]"
              class="faq-section__answer text-p-desktop text-mobile-p"
              v-html="block.answer"
            />
          </transition-height>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: faq-section (faq-section)
 * -----------------------------------------------------------------------------
 * FAQ section with title and questions/answers.
 *
 * @param {String} title - FAQ section title.
 * @param {Array} blocks - FAQ questions and answers.
 *
 */
import OutlinedPlus from '~icons/directional-navigation/outlined-plus.svg'
import OutlinedMinus from '~icons/directional-navigation/outlined-minus.svg'

import TransitionHeight from '~global/core/transition-height'

export default {
  name: 'FaqSection',

  components: {
    OutlinedMinus,
    OutlinedPlus,
    TransitionHeight,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    blocks: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isOpen: false,
      questionStates: Array.from({ length: this.blocks.length }, () => false),
    }
  },
}
</script>

<style lang="scss">
@import './faq-section';
</style>
