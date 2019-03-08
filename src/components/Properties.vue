<template>
  <Panel
    class="Properties"
    title="Properties"
    :collapsible="true"
  >
    <PropertyList
      class="Properties__list"
      :properties="properties"
      v-if="currentGuid"
    />
    <div
      class="Properties__noElement"
      v-else
    >
      No media element selected
    </div>
  </Panel>
</template>

<script>
import Panel from './Panel.vue';
import PropertyList from './PropertyList.vue';
import { trackedProperties } from '@/services/media-connector';

export default {
  name: 'Properties',
  components: {
    PropertyList,
    Panel,
  },
  computed: {
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
    properties() {
      if (!this.currentGuid) {
        return null;
      }

      return trackedProperties.reduce((result, name) => {
        result[name] = this.$store.state[this.currentGuid][name];

        return result;
      }, {});
    },
  },
};
</script>

<style lang="stylus">
@import '~@/assets/variables.styl';

.Properties {
  &__list {
    margin: 10px;
  }

  &__noElement {
    margin: 10px;
  }
}
</style>
