import { generate } from './guid';
import { apiActions } from './api-connector';

export const trackedProperties = [
  'autoplay',
  'controls',
  'crossOrigin',
  'currentSrc',
  'currentTime',
  'duration',
  'ended',
  'error',
  'height',
  'loop',
  'muted',
  'networkState',
  'paused',
  'playbackRate',
  'poster',
  'preload',
  'readyState',
  'seeking',
  'src',
  // TODO
  // 'srcObject',
  'videoHeight',
  'videoWidth',
  'volume',
  'width',
];

export const mediaConnectorActions = {
  pause: 'pause',
  play: 'play',
  setCurrentTime: 'setCurrentTime',
  setLoop: 'setLoop',
  setMuted: 'setMuted',
  setPlaybackRate: 'setPlaybackRate',
  setTextTrack: 'setTextTrack',
  setVolume: 'setVolume',
};

export const mediaConnectorActionNames = Object.keys(mediaConnectorActions);

export function timeRangeToArray(range) {
  const result = [];

  for (let i = 0; i < range.length; i += 1) {
    result.push([range.start(i), range.end(i)]);
  }

  return result;
}

export class MediaConnector {
  constructor(el, api) {
    this.el = el;
    this.api = api;
    this.listeners = {};
    this.guid = generate();
    this.messageHandler = (event) => {
      this.onMessage(event.data);
    };

    this.api.addListener(this.messageHandler);
    this.bindMediaEvents();
    this.register();
  }

  addListener(name, callback) {
    this.listeners[name] = callback;
    this.el.addEventListener(name, this.listeners[name]);
  }

  bindMediaEvents() {
    this.addListener('abort', () => this.send('abort'));
    this.addListener('canplay', () => this.send('canplay'));
    this.addListener('canplaythrough', () => this.send('canplaythrough'));
    this.addListener('durationchange', () => this.onDurationChange());
    this.addListener('emptied', () => this.send('emptied'));
    this.addListener('ended', () => this.send('ended'));
    this.addListener('error', () => this.onError());
    this.addListener('loadeddata', () => this.send('loadeddata'));
    this.addListener('loadedmetadata', () => this.send('loadedmetadata'));
    this.addListener('loadstart', () => this.send('loadstart'));
    this.addListener('pause', () => this.onPause());
    this.addListener('play', () => this.send('play'));
    this.addListener('playing', () => this.onPlaying());
    this.addListener('progress', () => this.send('progress'));
    this.addListener('ratechange', () => this.onRateChange());
    this.addListener('resize', () => this.onResize());
    this.addListener('seeked', () => this.send('seeked'));
    this.addListener('seeking', () => this.send('seeking'));
    this.addListener('stalled', () => this.send('stalled'));
    this.addListener('suspended', () => this.send('suspended'));
    this.addListener('timeupdate', () => this.onTimeUpdate());
    this.addListener('volumechange', () => this.onVolumeChange());
    this.addListener('waiting', () => this.send('waiting'));

    this.textTracksChangeHandler = () => this.onTextTracksChange();
    this.el.textTracks.addEventListener('change', this.textTracksChangeHandler);
  }

  destroy() {
    Object.keys(this.listeners).forEach((name) => {
      this.el.removeEventListener(name, this.listeners[name]);
    });
    this.el.textTracks.removeEventListener('change', this.textTracksChangeHandler);

    this.api.removeListener(this.messageHandler);
    this.unregister();
  }

  getError() {
    return this.el.error.code < 4
      ? this.el.error.code
      : this.el.error.message;
  }

  getSelector() {
    const tag = this.el.tagName.toLowerCase();
    const id = this.el.id ? `#${this.el.id}` : '';
    const className = this.el.className
      ? `.${this.el.className.split(' ').join('.')}`
      : '';

    return `${tag}${id}${className}`;
  }

  getTextTracks() {
    const tracks = [];

    for (let i = 0; i < this.el.textTracks.length; i += 1) {
      const track = this.el.textTracks[i];

      tracks.push({
        id: track.id,
        kind: track.kind,
        label: track.label,
        language: track.language,
        mode: track.mode,
      });
    }

    return tracks;
  }

  [mediaConnectorActions.pause]() {
    return this.el.pause();
  }

  [mediaConnectorActions.play]() {
    return this.el.play();
  }

  [mediaConnectorActions.setCurrentTime](time) {
    this.el.currentTime = time;
  }

  [mediaConnectorActions.setLoop](loop) {
    this.el.loop = loop;
  }

  [mediaConnectorActions.setMuted](muted) {
    this.el.muted = muted;
  }

  [mediaConnectorActions.setPlaybackRate](playbackRate) {
    this.el.playbackRate = playbackRate;
  }

  [mediaConnectorActions.setTextTrack](data) {
    const track = this.el.textTracks[data.index];

    Object.keys(data).forEach((name) => {
      if (name !== 'index') {
        track[name] = data[name];
      }
    });
  }

  [mediaConnectorActions.setVolume](volume) {
    this.el.volume = volume;
  }

  onDurationChange() {
    this.send('durationchange', {
      duration: this.el.duration,
    });
  }

  onError() {
    this.send('error', {
      error: this.getError(),
    });
  }

  onMessage(message) {
    if (
      message.src !== 'mm-devtools'
      || message.action !== apiActions.mediaEvent
      || message.guid !== this.guid
      || mediaConnectorActionNames.indexOf(message.name) === -1
    ) {
      return;
    }

    this[message.name](message.value);
  }

  onPause() {
    this.send('pause', {
      currentTime: this.el.currentTime,
    });
  }

  onPlaying() {
    this.send('playing', {
      currentTime: this.el.currentTime,
    });
  }

  onRateChange() {
    this.send('ratechange', {
      playbackRate: this.el.playbackRate,
    });
  }

  onResize() {
    this.send('resize', {
      videoHeight: this.el.videoHeight,
      videoWidth: this.el.videoWidth,
    });
  }

  onTextTracksChange() {
    this.send('mm_texttrackschange', {
      textTracks: this.getTextTracks(),
    });
  }

  onTimeUpdate() {
    this.send('timeupdate', {
      currentTime: this.el.currentTime,
      played: timeRangeToArray(this.el.played),
    });
  }

  onVolumeChange() {
    this.send('volumechange', {
      muted: this.el.muted,
      volume: this.el.volume,
    });
  }

  register() {
    const value = trackedProperties.reduce((result, name) => {
      if (name === 'error' && this.el.error) {
        result.error = this.getError();
      } else {
        result[name] = this.el[name];
      }

      return result;
    }, {});

    value.buffered = timeRangeToArray(this.el.buffered);
    value.seekable = timeRangeToArray(this.el.seekable);
    value.played = timeRangeToArray(this.el.played);
    value.textTracks = this.getTextTracks();

    this.api.send({
      action: apiActions.register,
      guid: this.guid,
      selector: this.getSelector(),
      value,
    });
  }

  send(name, value) {
    this.api.send({
      action: apiActions.mediaEvent,
      guid: this.guid,
      name,
      value: {
        ...value,
        buffered: timeRangeToArray(this.el.buffered),
        seekable: timeRangeToArray(this.el.seekable),
      },
    });
  }

  unregister() {
    this.api.send({
      action: apiActions.unregister,
      guid: this.guid,
    });
  }
}
