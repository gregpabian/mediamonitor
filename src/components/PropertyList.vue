<template>
  <div class="PropertyList">
    <ul class="PropertyList__list">
      <li
        v-for="(value, name) in visibleProperties"
        :key="name"
      >
        <span class="PropertyList__name">
          {{name}}:
        </span>
        <span
          class="PropertyList__value"
          :class="getPropertyClass(value)"
        >
          {{getProperty(value)}}
        </span>
        <span class="PropertyList__comment">
          {{getComment(name, value)}}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { toReadableTime } from '@/filters/to-readable-time';

const readyStates = [
  'HAVE_NOTHING',
  'HAVE_METADATA',
  'HAVE_CURRENT_DATA',
  'HAVE_FUTURE_DATA',
  'HAVE_ENOUGH_DATA',
];

const networkStates = [
  'NETWORK_EMPTY',
  'NETWORK_IDLE',
  'NETWORK_LOADING',
  'NETWORK_NO_SOURCE',
];

const mediaErrors = [
  'MEDIA_ERR_ABORTED',
  'MEDIA_ERR_DECODE',
  'MEDIA_ERR_NETWORK',
  'MEDIA_ERR_SRC_NOT_SUPPORTED',
];

const componentName = 'PropertyList';

export default {
  name: 'PropertyList',
  props: {
    properties: {
      required: true,
      type: Object,
    },
  },
  computed: {
    visibleProperties() {
      return Object.keys(this.properties)
        .reduce((result, name) => {
          if (this.properties[name] !== undefined) {
            result[name] = this.properties[name];
          }

          return result;
        }, {});
    },
  },
  methods: {
    getComment(name, value) {
      switch (name) {
        case 'currentTime':
        case 'duration':
          if (!Number.isNaN(value)) {
            return toReadableTime(value, true);
          }
          break;
        case 'error':
          if (typeof value === 'number') {
            return mediaErrors[value];
          }
          break;
        case 'networkState':
          return networkStates[value];
        case 'readyState':
          return readyStates[value];
      }

      return '';
    },
    getProperty(value) {
      const type = this.getValueType(value);

      if (type === 'string') {
        return `"${value}"`;
      }

      if (type === 'null') {
        return 'null';
      }

      return value;
    },
    getPropertyClass(value) {
      return `${componentName}__${this.getValueType(value)}`;
    },
    getValueType(value) {
      if (typeof value === 'object') {
        if (!value) {
          return 'null';
        }

        return 'object';
      }

      return typeof value;
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.PropertyList {
  font-family: Menlo, monospace;
  font-size: 11px !important;

  &__list {
    list-style-type none;
    margin: 0;
    padding: 0;
  }

  &__name {
    color: $variable-name-color;
  }

  &__value {
    word-break break-all;
  }

  &__boolean {
    color: $variable-boolean-color;
  }

  &__number {
    color: $variable-number-color;
  }

  &__null,
  &__comment {
    color: $variable-null-color;
  }

  &__comment {
    font-style: italic;
  }

  &__string {
    color: $variable-string-color;
  }
}
</style>
