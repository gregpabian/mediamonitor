import Vue from 'vue';
import MediaMonitor from './MediaMonitor.vue';
import { store } from './stores/index';
import { ApiConnector, apiActions } from './services/api-connector';
import { uiActions } from './stores/ui';
import { mediaStore, mediaActions } from './stores/media';
import { toTimestamp } from './filters/to-timestamp';
import { toReadableTime } from './filters/to-readable-time';
import { bus } from './plugins/bus';
import { mediaConnectorActionNames, mediaConnectorActions } from './services/media-connector';

Vue.config.productionTip = false;

Vue.filter('toTimestamp', toTimestamp);
Vue.filter('toReadableTime', toReadableTime);
Vue.use(bus);

new Vue({
  bus: new Vue(),
  computed: {
    currentGuid() {
      return this.$store.state.ui.currentGuid;
    },
  },
  methods: {
    onMessage(event) {
      if (
        event.data.src !== 'mm-content-script'
        || !event.data.action
      ) {
        return;
      }

      const { guid, value } = event.data;

      switch (event.data.action) {
        case apiActions.mediaEvent: {
          if (value.buffered) {
            this.$store.dispatch(mediaActions.setBuffered(guid), value.buffered);
          }

          if (value.seekable) {
            this.$store.dispatch(mediaActions.setSeekable(guid), value.seekable);
          }

          switch (event.data.name) {
            case 'durationchange':
              this.$store.dispatch(mediaActions.setDuration(guid), value.duration);
              break;
            case 'pause':
              this.$store.dispatch(mediaActions.setPaused(guid), true);
              break;
            case 'playing':
              this.$store.dispatch(mediaActions.setPaused(guid), false);
              break;
            case 'ratechange':
              this.$store.dispatch(mediaActions.setPlaybackRate(guid), value.playbackRate);
              break;
            case 'resize':
              this.$store.dispatch(mediaActions.setVideoWidth(guid), value.videoWidth);
              this.$store.dispatch(mediaActions.setVideoHeight(guid), value.videoHeight);
              break;
            case 'mm_texttrackschange':
              this.$store.dispatch(mediaActions.setTextTracks(guid), value.textTracks);

              // return immediately - we don't want to log custom events
              return;
            case 'timeupdate':
              this.$store.dispatch(mediaActions.setCurrentTime(guid), value.currentTime);
              this.$store.dispatch(mediaActions.setPlayed(guid), value.played);

              // return immediately - we don't want to flood the events section with time updates
              return;
            case 'volumechange':
              this.$store.dispatch(mediaActions.setVolume(guid), value.volume);
              this.$store.dispatch(mediaActions.setMuted(guid), value.muted);
          }

          this.$store.dispatch(mediaActions.addEvent(guid), {
            name: event.data.name,
          });
          break;
        }

        // let the content script we're also ready so that it starts registering media elements
        case apiActions.ready:
          this.apiConnector.ready();
          break;

        case apiActions.register:
          // prevent from registering the same element again
          if (Object.prototype.hasOwnProperty.call(this.$store.state.ui.elements, guid)) {
            return;
          }

          this.$store.dispatch(uiActions.addElement, event.data);
          this.$store.registerModule(guid, mediaStore);
          this.$store.dispatch(mediaActions.initState(guid), value);
          break;

        case apiActions.unregister:
          this.$store.dispatch(uiActions.removeElement, event.data);
          this.$store.unregisterModule(guid);
          break;
      }
    },
    sendMediaEvent(name, value) {
      this.apiConnector.send({
        action: apiActions.mediaEvent,
        guid: this.currentGuid,
        name,
        value,
      });
    },
  },
  mounted() {
    const target = process.env.NODE_ENV === 'production'
      ? window
      : window.parent;
    this.apiConnector = new ApiConnector('mm-devtools', window, target);
    this.apiConnector.addListener((event) => this.onMessage(event));
    this.apiConnector.ready();

    // proxy all the events through the API
    mediaConnectorActionNames.forEach((name) => {
      const event = mediaConnectorActions[name];

      this.$bus.$on(event, (value) => this.sendMediaEvent(event, value));
    });
  },
  store,
  render: (h) => h(MediaMonitor),
}).$mount('#app');
