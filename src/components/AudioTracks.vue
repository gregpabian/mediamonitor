<template>
  <Panel class="AudioTracks"
    title="Audio Tracks"
    :collapsible="true"
    v-if="audioTracks.length"
  >
    {{ audioTracks }}
  </Panel>
</template>

<script>
import Panel from './Panel.vue';

export default {
  name: 'AudioTracks',
  components: {
    Panel,
  },
  computed: {
    audioTracks() {
      if (!this.currentGuid) {
        return [];
      }

      return this.$store.state[this.currentGuid].audioTracks;
    },
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
  },
};
</script>

<style lang="stylus">
.AudioTracks {

}
</style>
