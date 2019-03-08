<template>
  <div class="Range">
    <div class="Range__bar"
      v-for="(range, index) in ranges"
      :key="index"
      :style="getRangeStyle(range)"
      :title="getTitle(range)"
    />
    <div class="Range__name">
      {{name}}
    </div>
  </div>
</template>

<script>
import { toReadableTime } from '@/filters/to-readable-time';

export default {
  name: 'Range',
  props: {
    name: {
      required: true,
      type: String,
    },
  },
  computed: {
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
    duration() {
      return this.$store.state[this.currentGuid].duration;
    },
    ranges() {
      return this.$store.state[this.currentGuid][this.name];
    },
  },
  methods: {
    getRangeStyle(range) {
      const left = `${range[0] / this.duration * 100}%`;
      const width = `${(range[1] - range[0]) / this.duration * 100}%`;

      return {
        left,
        width,
      };
    },
    getTitle(range) {
      return `${toReadableTime(range[0], true)} - ${toReadableTime(range[1], true)}`;
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.Range {
  height: 16px;
  left: 0;
  line-height: 16px;
  position: relative;
  top: 0;
  width: 100%;

  &__name {
    font-size: 11px;
    font-weight: bold;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
  }

  &__bar {
    height: 14px;
    position: absolute;
    top: 1;
  }
}
</style>
