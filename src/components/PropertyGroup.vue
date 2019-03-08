<template>
  <div class="PropertyGroup">
    <div
      class="PropertyGroup__title"
      @click="toggleOpen"
    >
      <div
        class="PropertyGroup__toggle"
        :class="toggleClass"
      ></div>
      {{name}}
    </div>
    <PropertyList
      class="PropertyGroup__list"
      :properties="properties"
      v-show="open"
    />
  </div>
</template>

<script>
import PropertyList from './PropertyList.vue';

export default {
  name: 'PropertyGroup',
  components: {
    PropertyList,
  },
  props: {
    name: {
      required: true,
      type: [String, Number],
    },
    properties: {
      required: true,
      type: Object,
    },
  },
  computed: {
    toggleClass() {
      return `PropertyGroup__toggle--${this.open ? 'open' : 'closed'}`;
    },
  },
  data() {
    return {
      open: true,
    };
  },
  methods: {
    toggleOpen() {
      this.open = !this.open;
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.PropertyGroup {
  &__title {
    clear: both;
    cursor: pointer;
    user-select: none;
  }

  &__toggle {
    border: 6px solid $button-color;
    border-left-width: 4px;
    border-left-color: transparent;
    border-right-width: 4px;
    border-right-color: transparent;
    display: block;
    float: left;
    height: 0;
    margin-right: 5px;
    width: 0;

    &--open {
      border-top-color: transparent;
      margin-top: -3px;
    }

    &--closed {
      border-bottom-color: transparent;
      margin-top: 3px;
    }
  }

  &__list {
    margin-left: 10px;
  }
}
</style>
