<template>
  <Panel
    class="Events"
    title="Events"
    :autoscroll="true"
  >
    <div v-if="currentGuid">
      <div
        class="Events__event"
        v-for="(event, index) in events"
        :key="index"
      >
        <div class="Events__timestamp">
          {{ event.timestamp | toTimestamp }}
        </div>
        <div class="Events__name">
          {{ event.name }}
        </div>
        <div
          class="Events__value"
          v-if="isTimestamp(event.name)"
        >
          {{ event.value | toReadableTime(true) }}
        </div>
        <div
          class="Events__value"
          v-else-if="typeof event.value !== 'undefined'"
        >
          {{ event.value }}
        </div>
      </div>
    </div>
    <div class="Events__noElement" v-else>
      No media element selected
    </div>
  </Panel>
</template>

<script>
import Panel from './Panel.vue';

const timedEvents = [
  'durationchange',
  'pause',
  'playing',
  'seeked',
];

export default {
  name: 'Events',
  components: {
    Panel,
  },
  computed: {
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
    events() {
      if (!this.currentGuid) {
        return null;
      }

      return this.$store.state[this.currentGuid].events;
    },
  },
  methods: {
    isTimestamp(name) {
      return timedEvents.indexOf(name) > -1;
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.Events {
  display: flex;
  flex-direction: column;

  &__noElement {
    margin: 10px;
  }

  &__event {
    display: flex;
    flex-direction: row;
  }

  &__timestamp,
  &__name,
  &__value {
    padding: 2px 5px;
  }

  &__timestamp {
    color: $text-muted-color;
    flex-shrink: 0;
    font-family: Menlo, monospaced;
    margin-left: 5px;
    text-align: right;
  }

  &__value {
    color: $variable-number-color;
    font-family: Menlo, monospaced;
  }

  &__name {
    flex-shrink: 0;
    font-weight: bold;
    width: 120px;
  }

  .Panel__title {
    flex-shrink: 0;
  }

  .Panel__content {
    border-bottom: none;
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
