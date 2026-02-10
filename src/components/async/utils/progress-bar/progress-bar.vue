<template>
  <div class="progress-bar">
    <div class="progress-bar__bar">
      <div
        class="progress-bar__progress"
        :style="{ width: `${progressValue}%` }"
      />
    </div>

    <div class="progress-bar__information-wrapper">
      <div
        class="progress-bar__progress-value"
        v-text="progressValue"
      />

      <div
        v-if="progressText"
        class="progress-bar__progress-text"
        v-text="progressText"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    progressValue: {
      type: [Number, String],
      default: 0,
    },
    progressText: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
 @import './progress-bar';
</style>
