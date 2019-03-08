<template>
  <div class="Toolbar">
    <div class="Toolbar__controls Toolbar__controls--left">
      <button
        type="button"
        class="Toolbar__button"
        @click="clearData"
        :disabled="!currentGuid"
        title="Clear data"
      >
        <span class="icon-blocked" />
      </button>
      <label
        class="hidden"
        for="mediaElements"
      >Media Elements
      </label>
      <select
        class="Toolbar__mediaElements"
        id="mediaElements"
        v-model="currentGuid"
      >
        <option :value="null">
          No media element selected
        </option>
        <option
          v-for="element in elements"
          :key="element.guid"
          :value="element.guid"
        >
          {{ element.selector }} - {{ element.guid }}
        </option>
      </select>
    </div>

    <div
      class="Toolbar__controls Toolbar__controls--right"
      v-if="currentGuid"
    >
      <button
        type="button"
        class="Toolbar__button"
        @click="skipToBeginning"
        title="Skip to beginning"
      >
        <span class="icon-first" />
      </button>
      <button
        type="button"
        class="Toolbar__button"
        @click="skipBack"
        title="Skip 5s backwards"
      >
        <span class="icon-backward2" />
      </button>
      <button v-if="paused" type="button"
        class="Toolbar__button"
        @click="play"
        title="Play"
      >
        <span class="icon-play3" />
      </button>
      <button v-else type="button"
        class="Toolbar__button"
        @click="pause"
        title="Pause"
      >
        <span class="icon-pause2" />
      </button>
      <button
        type="button"
        class="Toolbar__button"
        @click="skipForward"
        title="Skip 5s forward"
      >
        <span class="icon-forward3" />
      </button>
      <button
        type="button"
        class="Toolbar__button"
        @click="skipToEnd"
        title="Skip to end"
      >
        <span class="icon-last" />
      </button>

      <div class="Toolbar__separator" />

      <button
        type="button"
        class="Toolbar__button"
        @click="volumeDown"
        title="Decrease volume"
      >
        <span class="icon-volume-decrease" />
      </button>
      <span class="Toolbar__value">
        {{ volume }}%
      </span>
      <button
        type="button"
        class="Toolbar__button"
        @click="volumeUp"
        title="Increase volume"
      >
        <span class="icon-volume-increase" />
      </button>
      <button v-if="muted" type="button"
        class="Toolbar__button"
        @click="unmute"
        title="Unmute"
      >
        <span class="icon-volume-high" />
      </button>
      <button v-else type="button"
        class="Toolbar__button"
        @click="mute"
        title="Mute"
      >
        <span class="icon-volume-mute2" />
      </button>

      <div class="Toolbar__separator" />

      <button
        type="button"
        class="Toolbar__button"
        @click="speedDown"
        title="Decrease playback speed"
      >
        <span class="icon-minus" />
      </button>
      <span class="Toolbar__value">
        {{ playbackRate }}x
      </span>
      <button
        type="button"
        class="Toolbar__button"
        @click="speedUp"
        title="Increase playback speed"
      >
        <span class="icon-plus" />
      </button>

      <div class="Toolbar__separator" />
    </div>
  </div>
</template>

<script>
import { uiActions } from '@/stores/ui';
import { mediaConnectorActions } from '@/services/media-connector';
import { mediaActions } from '@/stores/media';

export default {
  name: 'Toolbar',
  computed: {
    elements() {
      return this.$store.state.ui.elements;
    },
    currentGuid: {
      get() {
        return this.$store.state.ui.currentGuid;
      },
      set(guid) {
        this.$store.dispatch(uiActions.setCurrentGuid, guid);
      },
    },
    muted() {
      return this.$store.state[this.currentGuid].muted;
    },
    paused() {
      return this.$store.state[this.currentGuid].paused;
    },
    playbackRate() {
      return this.$store.state[this.currentGuid].playbackRate;
    },
    volume() {
      return Math.round(this.$store.state[this.currentGuid].volume * 100);
    },
  },
  methods: {
    clearData() {
      this.$store.dispatch(mediaActions.clearEvents(this.currentGuid));
    },
    mute() {
      this.$bus.$emit(mediaConnectorActions.setMuted, true);
    },
    pause() {
      this.$bus.$emit(mediaConnectorActions.pause);
    },
    play() {
      this.$bus.$emit(mediaConnectorActions.play);
    },
    skipBack() {
      const time = Math.max(0, this.$store.state[this.currentGuid].currentTime - 5);

      this.$bus.$emit(mediaConnectorActions.setCurrentTime, time);
    },
    skipForward() {
      const time = Math.min(
        this.$store.state[this.currentGuid].duration,
        this.$store.state[this.currentGuid].currentTime + 5,
      );

      this.$bus.$emit(mediaConnectorActions.setCurrentTime, time);
    },
    skipToBeginning() {
      this.$bus.$emit(mediaConnectorActions.setCurrentTime, 0);
    },
    skipToEnd() {
      this.$bus.$emit(mediaConnectorActions.setCurrentTime, this.$store.state[this.currentGuid].duration);
    },
    speedDown() {
      const playbackRate = Math.max(0.25, this.$store.state[this.currentGuid].playbackRate - 0.25);

      this.$bus.$emit(mediaConnectorActions.setPlaybackRate, Number(playbackRate.toFixed(2)));
    },
    speedUp() {
      const playbackRate = Math.min(2, this.$store.state[this.currentGuid].playbackRate + 0.25);

      this.$bus.$emit(mediaConnectorActions.setPlaybackRate, Number(playbackRate.toFixed(2)));
    },
    unmute() {
      this.$bus.$emit(mediaConnectorActions.setMuted, false);
    },
    volumeDown() {
      const volume = Math.max(0, this.$store.state[this.currentGuid].volume - 0.05);

      this.$bus.$emit(mediaConnectorActions.setVolume, Number(volume.toFixed(2)));
    },
    volumeUp() {
      const volume = Math.min(1, this.$store.state[this.currentGuid].volume + 0.05);

      this.$bus.$emit(mediaConnectorActions.setVolume, Number(volume.toFixed(2)));
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

$button-margin = 7px 5px;

.Toolbar {
  background: $panel-title-background-color;
  border-bottom: $border;
  display: flex;
  flex-direction: row;
  user-select: none;

  &__controls {
    display: flex;
  }

  &__button {
    background: transparent;
    border: 0;
    color: $button-color;
    cursor: pointer;
    line-height: 16px;
    font-size: 16px;
    margin: $button-margin;
    padding: 0;

    &:disabled,
    &:disabled:hover,
    &:disabled:active {
      color: $button-color;
      cursor: default;
      opacity: .5;
    }

    &:hover {
      color: $button-hover-color;
    }

    &:active {
      color: $button-active-color;
    }

    [class^="icon-"], [class*=" icon-"] {
      display: block;
      height: 16px;
      width: 16px;
    }
  }

  &__mediaElements {
    background: transparent;
    border: none;
    display: inline-block;
    margin: 3px 5px;
    min-width: 150px;
    vertical-align text-top;
  }

  &__value {
    display: inline-block;
    height: 16px;
    line-height: 16px;
    margin: $button-margin;
    text-align: center;
    width: 32px;
  }

  &__separator {
    background: $border-color;
    display: inline-block;
    flex-shrink: 0;
    height: 16px;
    margin: $button-margin;
    width: 1px;
  }
}

@media only screen and (max-width: 640px) {
  .Toolbar {
    flex-direction: column;
  }
}
</style>
