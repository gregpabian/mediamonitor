<template>
  <div class="Timeline">
    <div
      class="Timeline__chart"
      v-if="currentGuid"
      @click="onClick"
    >
      <div
        class="Timeline__progress"
        :style="progressStyle"
      />
      <Grid />
      <Range
        name="buffered"
        class="Timeline__range--buffered"
      />
      <Range
        name="seekable"
        class="Timeline__range--seekable"
      />
      <Range
        name="played"
        class="Timeline__range--played"
      />
    </div>
    <div
      class="Timeline__noElement"
      v-else
    >
      No media element selected
    </div>
  </div>
</template>

<script>
import Range from './Range.vue';
import Grid from './Grid.vue';
import { mediaConnectorActions } from '@/services/media-connector';

export default {
  name: 'Timeline',
  components: {
    Grid,
    Range,
  },
  computed: {
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
    currentTime() {
      return this.$store.state[this.currentGuid].currentTime;
    },
    duration() {
      return this.$store.state[this.currentGuid].duration;
    },
    progressStyle() {
      return {
        width: `${this.currentTime / this.duration * 100}%`,
      };
    },
    width() {
      return this.$store.state.ui.width;
    },
  },
  methods: {
    onClick(event) {
      this.$bus.$emit(
        mediaConnectorActions.setCurrentTime,
        event.clientX / this.width * this.duration,
      );
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.Timeline {
  border-bottom: $border;
  user-select: none;

  &__chart {
    cursor: pointer;
    height: 64px;
    padding-top: 16px;
    position: relative;
  }

  &__progress {
    background: $progress-color;
    left: 0;
    height: 100%;
    position: absolute;
    top: 0;
  }

  &__noElement {
    margin: 10px;
  }

  &__range {
    &--buffered {
      .Range__bar {
        background: $buffered-color;
      }
    }

    &--seekable {
      .Range__bar {
        background: $seekable-color;
      }
    }

    &--played {
      .Range__bar {
        background: $played-color;
      }
    }
  }
}
</style>
