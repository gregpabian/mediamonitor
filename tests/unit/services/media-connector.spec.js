import { generate } from '@/services/guid';
import { apiActions } from '@/services/api-connector';
import { MediaConnector, mediaConnectorActions } from '@/services/media-connector';

jest.mock('../../../src/services/guid', () => ({
  generate: jest.fn().mockName('generate'),
}));

function findCallsByFirstArgument(mock, first) {
  return mock.mock.calls.filter((call) => call[0] === first);
}

describe('Service - MediaConnector', () => {
  const guid = 'guid1234';

  let apiMock;
  let elementMock;
  let mediaConnector;

  beforeEach(() => {
    apiMock = {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      send: jest.fn(),
    };

    elementMock = {
      addEventListener: jest.fn(),
      autoplay: false,
      buffered: {
        end() {
          return 42;
        },
        length: 1,
        start() {
          return 0;
        },
      },
      className: '',
      controls: false,
      crossOrigin: '',
      currentSrc: '',
      currentTime: NaN,
      duration: NaN,
      ended: false,
      error: {
        code: 3,
      },
      height: 0,
      id: null,
      loop: false,
      muted: false,
      networkState: 0,
      pause: jest.fn(),
      paused: false,
      play: jest.fn(),
      playbackRate: 1,
      played: {
        end: jest.fn(),
        length: 0,
        start: jest.fn(),
      },
      poster: null,
      preload: false,
      readyState: 0,
      removeEventListener: jest.fn(),
      seekable: {
        end: jest.fn(),
        length: 0,
        start: jest.fn(),
      },
      seeking: false,
      src: '',
      tagName: 'VIDEO',
      textTracks: {
        addEventListener: jest.fn(),
        length: 0,
        removeEventListener: jest.fn(),
      },
      videoHeight: 0,
      videoWidth: 0,
      volume: 1,
      width: 0,
    };

    generate.mockReturnValue(guid);

    mediaConnector = new MediaConnector(elementMock, apiMock);
  });

  describe('constructor', () => {
    it('should add an API listener', () => {
      expect(apiMock.addListener).toBeCalled();
    });

    it('should bind media event listeners', () => {
      const events = [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'resize',
        'seeked',
        'seeking',
        'stalled',
        'suspended',
        'timeupdate',
        'volumechange',
        'waiting',
      ];

      events.forEach((name) => {
        expect(elementMock.addEventListener).toHaveBeenCalledWith(name, expect.any(Function));
      });

      expect(elementMock.textTracks.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should register itself through the API', () => {
      expect(apiMock.send).toHaveBeenCalledWith({
        action: apiActions.register,
        guid,
        selector: 'video',
        value: {
          autoplay: elementMock.autoplay,
          buffered: [[0, 42]],
          controls: elementMock.controls,
          crossOrigin: elementMock.crossOrigin,
          currentSrc: elementMock.currentSrc,
          currentTime: elementMock.currentTime,
          duration: elementMock.duration,
          ended: elementMock.ended,
          error: elementMock.error.code,
          height: elementMock.height,
          loop: elementMock.loop,
          muted: elementMock.muted,
          networkState: elementMock.networkState,
          paused: elementMock.paused,
          playbackRate: elementMock.playbackRate,
          played: [],
          poster: elementMock.poster,
          preload: elementMock.preload,
          readyState: elementMock.readyState,
          seekable: [],
          seeking: elementMock.seeking,
          src: elementMock.src,
          textTracks: [],
          videoHeight: elementMock.videoHeight,
          videoWidth: elementMock.videoWidth,
          volume: elementMock.volume,
          width: elementMock.width,
        },
      });
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      mediaConnector.destroy();
    });

    it('should remove all the event listeners form the media element', () => {
      const events = [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'resize',
        'seeked',
        'seeking',
        'stalled',
        'suspended',
        'timeupdate',
        'volumechange',
        'waiting',
      ];

      events.forEach((name) => {
        expect(elementMock.removeEventListener).toHaveBeenCalledWith(name, expect.any(Function));
      });

      expect(elementMock.textTracks.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove the API listener', () => {
      expect(apiMock.removeListener).toBeCalled();
    });

    it('should unregister itself from the API', () => {
      expect(apiMock.send).toBeCalledWith({
        action: apiActions.unregister,
        guid,
      });
    });
  });

  describe('media events', () => {
    const testEvents = {
      abort: {},
      canplay: {},
      canplaythrough: {},
      durationchange: {
        duration: NaN,
      },
      emptied: {},
      ended: {},
      error: {
        error: 3,
      },
      loadeddata: {},
      loadedmetadata: {},
      loadstart: {},
      pause: {
        currentTime: NaN,
      },
      play: {},
      playing: {
        currentTime: NaN,
      },
      progress: {},
      ratechange: {
        playbackRate: 1,
      },
      resize: {
        videoHeight: 0,
        videoWidth: 0,
      },
      seeked: {},
      seeking: {},
      stalled: {},
      suspended: {},
      timeupdate: {
        currentTime: NaN,
        played: [],
      },
      volumechange: {
        muted: false,
        volume: 1,
      },
      waiting: {},
    };

    function testMediaEvent(name, value) {
      it(`should sent the ${name} event${Object.keys(value).length ? ' with values' : ''}`, () => {
        const [[, callback]] = findCallsByFirstArgument(elementMock.addEventListener, name);

        apiMock.send.mockClear();

        callback();

        expect(apiMock.send).toBeCalledWith({
          action: apiActions.mediaEvent,
          guid,
          name,
          value: {
            ...value,
            buffered: [[0, 42]],
            seekable: [],
          },
        });
      });
    }

    Object.keys(testEvents).forEach((name) => {
      testMediaEvent(name, testEvents[name]);
    });

    it('should send the custom text tracks change event on text tracks change', () => {
      elementMock.textTracks.addEventListener.mock.calls[0][1]();

      expect(apiMock.send).toBeCalledWith({
        action: apiActions.mediaEvent,
        guid,
        name: 'mm_texttrackschange',
        value: {
          textTracks: [],
          buffered: [[0, 42]],
          seekable: [],
        },
      });
    });
  });

  describe('getError', () => {
    it('should return the error code when below 4', () => {
      elementMock.error = {
        code: 3,
        message: '',
      };

      expect(mediaConnector.getError()).toBe(elementMock.error.code);
    });

    it('should return the error code when above or equal to 4', () => {
      elementMock.error = {
        code: 4,
        message: '404: Not Found',
      };

      expect(mediaConnector.getError()).toBe(elementMock.error.message);
    });
  });

  describe('getSelector', () => {
    it('should return complete element selector', () => {
      expect(mediaConnector.getSelector()).toBe('video');

      elementMock.tagName = 'AUDIO';

      expect(mediaConnector.getSelector()).toBe('audio');

      elementMock.id = 'foo';

      expect(mediaConnector.getSelector()).toBe('audio#foo');

      elementMock.className = 'foo bar baz';

      expect(mediaConnector.getSelector()).toBe('audio#foo.foo.bar.baz');

      elementMock.id = '';

      expect(mediaConnector.getSelector()).toBe('audio.foo.bar.baz');
    });
  });

  describe('getTextTracks', () => {
    it('should return an array of text tracks', () => {
      elementMock.textTracks = [
        {
          activeCues: [],
          cues: [],
          id: '',
          kind: 'subtitles',
          label: 'English',
          language: 'en',
          mode: 'disabled',
        },
        {
          activeCues: [],
          cues: [],
          id: '',
          kind: 'subtitles',
          label: 'Polish',
          language: 'pl',
          mode: 'hidden',
        },
      ];

      expect(mediaConnector.getTextTracks()).toEqual([
        {
          id: '',
          kind: 'subtitles',
          label: 'English',
          language: 'en',
          mode: 'disabled',
        },
        {
          id: '',
          kind: 'subtitles',
          label: 'Polish',
          language: 'pl',
          mode: 'hidden',
        },
      ]);
    });
  });

  describe('actions', () => {
    it('should pause the player', () => {
      mediaConnector[mediaConnectorActions.pause]();

      expect(elementMock.pause).toBeCalled();
    });

    it('should play the player', () => {
      mediaConnector[mediaConnectorActions.play]();

      expect(elementMock.play).toBeCalled();
    });

    it('should set the current time', () => {
      const currentTime = 42;

      mediaConnector[mediaConnectorActions.setCurrentTime](currentTime);

      expect(elementMock.currentTime).toBe(currentTime);
    });

    it('should set loop', () => {
      const loop = true;

      mediaConnector[mediaConnectorActions.setLoop](loop);

      expect(elementMock.loop).toBe(loop);
    });

    it('should set muted', () => {
      const muted = true;

      mediaConnector[mediaConnectorActions.setMuted](muted);

      expect(elementMock.muted).toBe(muted);
    });

    it('should set the playback rate', () => {
      const playbackRate = 2;

      mediaConnector[mediaConnectorActions.setPlaybackRate](playbackRate);

      expect(elementMock.playbackRate).toBe(playbackRate);
    });

    it('should set a text track', () => {
      elementMock.textTracks = [
        {
          activeCues: [],
          cues: [],
          id: '',
          kind: 'subtitles',
          label: 'English',
          language: 'en',
          mode: 'disabled',
        },
        {
          activeCues: [],
          cues: [],
          id: '',
          kind: 'subtitles',
          label: 'Polish',
          language: 'pl',
          mode: 'hidden',
        },
      ];

      const track = {
        index: 1,
        mode: 'showing',
      };

      mediaConnector[mediaConnectorActions.setTextTrack](track);

      expect(elementMock.textTracks[1].mode).toBe(track.mode);
    });
  });

  describe('onMessage', () => {
    let onMessage;

    beforeEach(() => {
      onMessage = (data) => apiMock.addListener.mock.calls[0][0]({
        data,
      });
    });

    it('should execute a known action sent from the devtools for this particular guid', () => {
      onMessage({
        src: 'mm-devtools',
        action: apiActions.mediaEvent,
        guid,
        name: mediaConnectorActions.play,
      });

      expect(elementMock.play).toBeCalled();
    });

    it('should execute a known action with value sent from the devtools for this particular guid', () => {
      const volume = 0.5;

      onMessage({
        src: 'mm-devtools',
        action: apiActions.mediaEvent,
        guid,
        name: mediaConnectorActions.setVolume,
        value: volume,
      });

      expect(elementMock.volume).toBe(volume);
    });

    it('should ignore actions from unknown source', () => {
      onMessage({
        src: 'unknown',
        action: apiActions.mediaEvent,
        guid,
        name: mediaConnectorActions.play,
      });

      expect(elementMock.play).not.toBeCalled();
    });

    it('should ignore actions meant for a different guid', () => {
      onMessage({
        src: 'mm-devtools',
        action: apiActions.mediaEvent,
        guid: 'anotherone',
        name: mediaConnectorActions.play,
      });

      expect(elementMock.play).not.toBeCalled();
    });

    it('should ignore unsupported actions', () => {
      mediaConnector.unknown = jest.fn();

      onMessage({
        src: 'mm-devtools',
        action: apiActions.mediaEvent,
        guid,
        name: 'unknown',
      });

      expect(mediaConnector.unknown).not.toBeCalled();
    });
  });
});
