<template>
  <Panel
    class="VideoTracks"
    title="Video Tracks"
    :collapsible="true"
    v-if="videoTracks.length"
  >
    {{ videoTracks }}
  </Panel>
</template>

<script>
import Panel from './Panel.vue';

export default {
  name: 'VideoTracks',
  components: {
    Panel,
  },
  computed: {
    videoTracks() {
      if (!this.currentGuid) {
        return [];
      }

      return this.$store.state[this.currentGuid].videoTracks;
    },
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
  },
};
</script>

<style lang="stylus">

</style>
