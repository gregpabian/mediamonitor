export const mediaActions = [
  'addEvent',
  'clearEvents',
  'initState',
  'setAudioTracks',
  'setAutoplay',
  'setBuffered',
  'setControls',
  'setCrossOrigin',
  'setCurrentSrc',
  'setCurrentTime',
  'setDuration',
  'setEnded',
  'setError',
  'setHeight',
  'setLoop',
  'setMuted',
  'setNetworkState',
  'setPaused',
  'setPlaybackRate',
  'setPlayed',
  'setPoster',
  'setPreload',
  'setReadyState',
  'setSeekable',
  'setSeeking',
  'setSrc',
  'setSrcObject',
  'setTextTracks',
  'setVideoHeight',
  'setVideoTracks',
  'setVideoWidth',
  'setVolume',
  'setWidth',
].reduce((result, name) => {
  result[name] = (guid) => `${guid}/${name}`;

  return result;
}, {});

export const mediaStore = {
  namespaced: true,
  state() {
    return {
      audioTracks: [],
      autoplay: false,
      buffered: null,
      controls: false,
      crossOrigin: null,
      currentSrc: null,
      currentTime: 0,
      duration: 0,
      ended: false,
      error: false,
      events: [],
      height: 0,
      loop: false,
      muted: false,
      networkState: 0,
      paused: false,
      playbackRate: 1,
      played: null,
      poster: null,
      preload: null,
      readyState: 0,
      seekable: null,
      seeking: false,
      src: null,
      srcObject: null,
      textTracks: [],
      videoHeight: 0,
      videoTracks: [],
      videoWidth: 0,
      volume: 1,
      width: 0,
    };
  },
  mutations: {
    addEvent(state, event) {
      state.events = [].concat(state.events, {
        timestamp: Date.now(),
        name: event.name,
        value: event.value,
      });
    },
    clearEvents(state) {
      state.events = [];
    },
    initState(state, newState) {
      Object.keys(newState).forEach((name) => {
        state[name] = newState[name];
      });
    },
    setAudioTracks(state, audioTracks) {
      state.audioTracks = audioTracks;
    },
    setAutoplay(state, autoplay) {
      state.autoplay = autoplay;
    },
    setBuffered(state, buffered) {
      state.buffered = buffered;
    },
    setControls(state, controls) {
      state.controls = controls;
    },
    setCrossOrigin(state, crossOrigin) {
      state.crossOrigin = crossOrigin;
    },
    setCurrentSrc(state, currentSrc) {
      state.currentSrc = currentSrc;
    },
    setCurrentTime(state, currentTime) {
      state.currentTime = currentTime;
    },
    setDuration(state, duration) {
      state.duration = duration;
    },
    setEnded(state, ended) {
      state.ended = ended;
    },
    setError(state, error) {
      state.error = error;
    },
    setHeight(state, height) {
      state.height = height;
    },
    setLoop(state, loop) {
      state.loop = loop;
    },
    setMuted(state, muted) {
      state.muted = muted;
    },
    setNetworkState(state, networkState) {
      state.networkState = networkState;
    },
    setPaused(state, paused) {
      state.paused = paused;
    },
    setPlaybackRate(state, playbackRate) {
      state.playbackRate = playbackRate;
    },
    setPlayed(state, played) {
      state.played = played;
    },
    setPoster(state, poster) {
      state.poster = poster;
    },
    setPreload(state, preload) {
      state.preload = preload;
    },
    setReadyState(state, readyState) {
      state.readyState = readyState;
    },
    setSeekable(state, seekable) {
      state.seekable = seekable;
    },
    setSeeking(state, seeking) {
      state.seeking = seeking;
    },
    setSrc(state, src) {
      state.src = src;
    },
    setSrcObject(state, srcObject) {
      state.srcObject = srcObject;
    },
    setTextTracks(state, textTracks) {
      state.textTracks = textTracks;
    },
    setVideoHeight(state, videoHeight) {
      state.videoHeight = videoHeight;
    },
    setVideoTracks(state, videoTracks) {
      state.videoTracks = videoTracks;
    },
    setVideoWidth(state, videoWidth) {
      state.videoWidth = videoWidth;
    },
    setVolume(state, volume) {
      state.volume = volume;
    },
    setWidth(state, width) {
      state.width = width;
    },
  },
  actions: {
    addEvent(context, event) {
      let value;

      switch (event.name) {
        case 'durationchange':
          value = context.state.duration;
          break;

        case 'resize':
          value = `${context.state.videoWidth}x${context.state.videoHeight}`;
          break;

        case 'pause':
        case 'playing':
        case 'seeked':
          value = context.state.currentTime;
          break;

        case 'volumechange':
          if (context.state.muted) {
            value = 'muted';
          } else {
            value = `${Math.round(context.state.volume * 100)}%`;
          }
          break;
      }

      context.commit('addEvent', {
        name: event.name,
        value,
      });
    },
    clearEvents(context) {
      context.commit('clearEvents');
    },
    initState(context, state) {
      context.commit('initState', state);
    },
    setAudioTracks(context, audioTracks) {
      context.commit('setAudioTracks', audioTracks);
    },
    setAutoplay(context, autoplay) {
      context.commit('setAutoplay', autoplay);
    },
    setBuffered(context, buffered) {
      context.commit('setBuffered', buffered);
    },
    setControls(context, controls) {
      context.commit('setControls', controls);
    },
    setCrossOrigin(context, crossOrigin) {
      context.commit('setCrossOrigin', crossOrigin);
    },
    setCurrentSrc(context, currentSrc) {
      context.commit('setCurrentSrc', currentSrc);
    },
    setCurrentTime(context, currentTime) {
      context.commit('setCurrentTime', currentTime);
    },
    setDuration(context, duration) {
      context.commit('setDuration', duration);
    },
    setEnded(context, ended) {
      context.commit('setEnded', ended);
    },
    setError(context, error) {
      context.commit('setError', error);
    },
    setHeight(context, height) {
      context.commit('setHeight', height);
    },
    setLoop(context, loop) {
      context.commit('setLoop', loop);
    },
    setMuted(context, muted) {
      context.commit('setMuted', muted);
    },
    setNetworkState(context, networkState) {
      context.commit('setNetworkState', networkState);
    },
    setPaused(context, paused) {
      context.commit('setPaused', paused);
    },
    setPlaybackRate(context, playbackRate) {
      context.commit('setPlaybackRate', playbackRate);
    },
    setPlayed(context, played) {
      context.commit('setPlayed', played);
    },
    setPoster(context, poster) {
      context.commit('setPoster', poster);
    },
    setPreload(context, preload) {
      context.commit('setPreload', preload);
    },
    setReadyState(context, readyState) {
      context.commit('setReadyState', readyState);
    },
    setSeekable(context, seekable) {
      context.commit('setSeekable', seekable);
    },
    setSeeking(context, seeking) {
      context.commit('setSeeking', seeking);
    },
    setSrc(context, src) {
      context.commit('setSrc', src);
    },
    setSrcObject(context, srcObject) {
      context.commit('setSrcObject', srcObject);
    },
    setTextTracks(context, textTracks) {
      context.commit('setTextTracks', textTracks);
    },
    setVideoHeight(context, videoHeight) {
      context.commit('setVideoHeight', videoHeight);
    },
    setVideoTracks(context, videoTracks) {
      context.commit('setVideoTracks', videoTracks);
    },
    setVideoWidth(context, videoWidth) {
      context.commit('setVideoWidth', videoWidth);
    },
    setVolume(context, volume) {
      context.commit('setVolume', volume);
    },
    setWidth(context, width) {
      context.commit('setWidth', width);
    },
  },
};
