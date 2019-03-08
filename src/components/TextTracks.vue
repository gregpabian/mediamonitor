<template>
  <Panel
    class="TextTracks"
    title="Text Tracks"
    :collapsible="true"
    v-if="textTracks.length"
  >
    <PropertyGroup v-for="(track, index) in textTracks"
      :key="index"
      :name="index"
      :properties="track"
    />
  </Panel>
</template>

<script>
import Panel from './Panel.vue';
import PropertyGroup from './PropertyGroup.vue';

export default {
  name: 'TextTracks',
  components: {
    PropertyGroup,
    Panel,
  },
  computed: {
    textTracks() {
      if (!this.currentGuid) {
        return [];
      }

      return this.$store.state[this.currentGuid].textTracks;
    },
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
  },
};
</script>

<style lang="stylus">
.TextTracks {
  .Panel__content {
    padding: 10px;
  }
}
</style>
