<template>
  <div class="Grid">
    <div
      class="Grid__divider"
      v-for="n in gridSize"
      :key="n"
      :style="dividerStyle(n)"
    >
      <div class="Grid__timestamp">
        {{ getTime(n) | toReadableTime }}
      </div>
    </div>
    <div class="Grid__duration">
      <div class="Grid__timestamp">
        {{ duration | toReadableTime }}
      </div>
    </div>
  </div>
</template>

<script>
const columnWidth = 80;

export default {
  name: 'Grid',
  computed: {
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
    duration() {
      return this.$store.state[this.currentGuid].duration;
    },
    gridSize() {
      const columns = this.width / columnWidth;

      // we won't have enough room for the duration to render - subtract one divider
      if (columns - Math.floor(columns) < 0.6) {
        return Math.floor(columns) - 1;
      }

      return Math.floor(columns);
    },
    width() {
      return this.$store.state.ui.width;
    },
  },
  methods: {
    dividerStyle(n) {
      return {
        left: `${(n - 1) * columnWidth}px`,
        width: `${columnWidth}px`,
      };
    },
    getTime(n) {
      return (n) * this.duration / (this.width / columnWidth);
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.Grid {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  &__divider {
    border-right: 1px solid #eee;
    height: 100%;
    position: absolute;
    top: 0;
  }

  &__duration {
    position: absolute;
    right: 0;
    top: 0;
    white-space: nowrap;
  }

  &__timestamp {
    font-size: 11px;
    position: absolute;
    right: 2px;
    top: 0;
  }
}
</style>
