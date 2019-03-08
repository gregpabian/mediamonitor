<template>
  <div class="MediaMonitor Row Row--vertical">
    <div class="MediaMonitor__top Row Row--vertical">
      <Toolbar />
      <Timeline />
    </div>

    <div class="MediaMonitor__bottom Row Row--horizontal Row--large">
      <div class="MediaMonitor__left Row Row--horizontal Row--large">
        <Events class="Row--large" />
      </div>

      <div class="MediaMonitor__right Row Row--vertical">
        <Properties />
        <AudioTracks />
        <VideoTracks />
        <TextTracks />
      </div>
    </div>
  </div>
</template>

<script>
import Events from './components/Events.vue';
import Toolbar from './components/Toolbar.vue';
import Properties from './components/Properties.vue';
import Timeline from './components/Timeline.vue';
import AudioTracks from './components/AudioTracks.vue';
import VideoTracks from './components/VideoTracks.vue';
import TextTracks from './components/TextTracks.vue';
import { uiActions } from './stores/ui';

export default {
  name: 'MediaMonitor',
  components: {
    TextTracks,
    VideoTracks,
    AudioTracks,
    Events,
    Properties,
    Timeline,
    Toolbar,
  },
  mounted() {
    this.$store.dispatch(uiActions.setWidth, window.innerWidth);

    window.addEventListener('resize', () => {
      this.$store.dispatch(uiActions.setWidth, window.innerWidth);
    });
  },
};
</script>

<style lang="stylus">
@import 'assets/variables.styl';
@import 'assets/icons.styl';

body,
html {
  height: 100%;
  width: 100%;
}

body {
  background: $background-color;
  color: $text-color;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  margin: 0;
  padding: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

.MediaMonitor {
  height: 100%;
  overflow-x: hidden;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  &__bottom {
    overflow: hidden;

    &.Row {
      flex-shrink: 1;
    }
  }

  &__left {
    border-right: $border;
  }

  &__right {
    flex-shrink: 0;
    height: 100%;
    overflow: auto;
    width: 300px;
  }
}

.Row {
  display: flex;
  flex: 0 0 auto;

  &--horizontal {
    flex-direction: row;
  }

  &--vertical {
    flex-direction: column;
  }

  &--large {
    flex-grow: 1;
  }
}

.hidden {
  border: 0;
  clip: rect(0,0,0,0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

@media only screen and (max-width: 640px) {
  .MediaMonitor {
    &__bottom {
      flex-direction: column !important;
      overflow: auto;
    }

    &__left {
      order: 2;
    }

    &__right {
      height: auto;
      order: 1;
      width: 100%;
    }
  }
}
</style>
