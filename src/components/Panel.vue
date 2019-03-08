<template>
  <div
    class="Panel Row Row--vertical"
    :class="panelClass"
  >
    <div
      class="Panel__title"
      @click="toggleOpen"
    >
      <span>
        {{title}}
      </span>
      <span
        v-if="collapsible"
        class="Panel__toggle"
        :class="toggleClass"
      ></span>
    </div>
    <div
      class="Panel__content"
      v-show="open"
      v-autoscroll="autoscroll"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { autoscroll } from '@/directives/autoscroll';

const componentName = 'Panel';

export default {
  name: componentName,
  directives: {
    autoscroll,
  },
  computed: {
    panelClass() {
      return this.collapsible ? `${componentName}--collapsible` : '';
    },
    toggleClass() {
      return `${componentName}__toggle--${this.open ? 'open' : 'closed'}`;
    },
  },
  data() {
    return {
      open: true,
    };
  },
  props: {
    autoscroll: {
      default: false,
      type: Boolean,
    },
    collapsible: {
      default: false,
      type: Boolean,
    },
    title: {
      required: true,
      type: String,
    },
  },
  methods: {
    toggleOpen() {
      if (!this.collapsible) {
        return;
      }

      this.open = !this.open;
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.Panel {
  width: 100%;

  &--collapsible {
    .Panel__title {
      cursor: pointer;
    }
  }

  &__title {
    background: $panel-title-background-color;
    border-bottom: $border;
    font-weight: bold;
    line-height: 30px;
    padding: 0 10px;
    user-select: none;
    width: 100%;
  }

  &__toggle {
    border: 6px solid $button-color;
    border-left-color: transparent;
    border-right-color: transparent;
    display: block;
    float: right;
    height: 0;
    width: 0;

    &--open {
      border-top-color: transparent;
      margin: 7px 0 8px;
    }

    &--closed {
      border-bottom-color: transparent;
      margin: 13px 0 2px;
    }
  }

  &__content {
    border-bottom: $border;
  }
}
</style>
