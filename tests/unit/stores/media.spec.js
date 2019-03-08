import { mediaStore, mediaActions } from '@/stores/media';

describe('Store - Media', () => {
  const now = Date.now();

  beforeAll(() => {
    Date.now = jest.fn().mockReturnValue(now);
  });

  it('should be namespaced', () => {
    expect(mediaStore.namespaced).toBe(true);
  });

  it('should return the default state', () => {
    expect(mediaStore.state()).toEqual({
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
    });
  });

  describe('mutations', () => {
    it('should add an event to the store', () => {
      const firstEvent = {
        name: 'first',
        timestamp: now,
        value: 'foo',
      };
      const state = {
        events: [
          firstEvent,
        ],
      };
      const event = {
        name: 'second',
        value: 'baz',
      };

      mediaStore.mutations.addEvent(state, event);

      expect(state.events).toHaveLength(2);
      expect(state.events[0]).toEqual(firstEvent);
      expect(state.events[1]).toEqual({
        name: event.name,
        timestamp: now,
        value: event.value,
      });
    });

    it('should clear the events array', () => {
      const state = {
        events: [
          {
            name: 'first',
            timestamp: now,
            value: 'foo',
          },
        ],
      };

      mediaStore.mutations.clearEvents(state);

      expect(state.events).toHaveLength(0);
    });

    it('should inject the state to the store', () => {
      const initialState = mediaStore.state();
      const newState = {
        autoplay: true,
        controls: true,
        duration: 42,
        loop: true,
        volume: 0.5,
      };

      mediaStore.mutations.initState(initialState, newState);

      expect(initialState.autoplay).toBe(newState.autoplay);
      expect(initialState.controls).toBe(newState.controls);
      expect(initialState.duration).toBe(newState.duration);
      expect(initialState.loop).toBe(newState.loop);
      expect(initialState.volume).toBe(newState.volume);
    });

    it('should set the audio tracks', () => {
      const audioTracks = [
        {
          id: 1,
          enabled: true,
        },
        {
          id: 2,
          enabled: false,
        },
      ];
      const state = {
        audioTracks: [],
      };

      mediaStore.mutations.setAudioTracks(state, audioTracks);

      expect(state.audioTracks).toEqual(audioTracks);
    });

    it('should set the autoplay flag', () => {
      const state = {
        autoplay: false,
      };

      mediaStore.mutations.setAutoplay(state, true);

      expect(state.autoplay).toBe(true);
    });

    it('should set the buffered property', () => {
      const state = {
        buffered: null,
      };
      const buffered = [
        [0, 5],
        [50, 55],
      ];

      mediaStore.mutations.setBuffered(state, buffered);

      expect(state.buffered).toEqual(buffered);
    });

    it('should set the controls flag', () => {
      const state = {
        controls: false,
      };

      mediaStore.mutations.setControls(state, true);

      expect(state.controls).toBe(true);
    });

    it('should set the crossOrigin property', () => {
      const state = {
        crossOrigin: null,
      };
      const crossOrigin = 'use-credentials';

      mediaStore.mutations.setCrossOrigin(state, crossOrigin);

      expect(state.crossOrigin).toEqual(crossOrigin);
    });

    it('should set the currentSrc property', () => {
      const state = {
        currentSrc: null,
      };
      const currentSrc = 'http://foo.bar/baz.mp4';

      mediaStore.mutations.setCurrentSrc(state, currentSrc);

      expect(state.currentSrc).toEqual(currentSrc);
    });

    it('should set the currentTime property', () => {
      const state = {
        currentTime: 0,
      };
      const currentTime = 42;

      mediaStore.mutations.setCurrentTime(state, currentTime);

      expect(state.currentTime).toEqual(currentTime);
    });

    it('should set the duration property', () => {
      const state = {
        duration: 0,
      };
      const duration = 42;

      mediaStore.mutations.setDuration(state, duration);

      expect(state.duration).toEqual(duration);
    });

    it('should set the ended flag', () => {
      const state = {
        ended: false,
      };

      mediaStore.mutations.setEnded(state, true);

      expect(state.ended).toBe(true);
    });

    it('should set the error property', () => {
      const state = {
        error: null,
      };
      const error = 3;

      mediaStore.mutations.setError(state, error);

      expect(state.error).toEqual(error);
    });

    it('should set the height property', () => {
      const state = {
        height: 0,
      };
      const height = 480;

      mediaStore.mutations.setHeight(state, height);

      expect(state.height).toEqual(height);
    });

    it('should set the loop flag', () => {
      const state = {
        loop: false,
      };

      mediaStore.mutations.setLoop(state, true);

      expect(state.loop).toBe(true);
    });

    it('should set the muted flag', () => {
      const state = {
        muted: false,
      };

      mediaStore.mutations.setMuted(state, true);

      expect(state.muted).toBe(true);
    });

    it('should set the networkState property', () => {
      const state = {
        networkState: 0,
      };
      const networkState = 4;

      mediaStore.mutations.setNetworkState(state, networkState);

      expect(state.networkState).toEqual(networkState);
    });

    it('should set the paused flag', () => {
      const state = {
        paused: false,
      };

      mediaStore.mutations.setPaused(state, true);

      expect(state.paused).toBe(true);
    });

    it('should set the playbackRate property', () => {
      const state = {
        playbackRate: 1,
      };
      const playbackRate = 2;

      mediaStore.mutations.setPlaybackRate(state, playbackRate);

      expect(state.playbackRate).toEqual(playbackRate);
    });

    it('should set the played property', () => {
      const state = {
        played: null,
      };
      const played = [
        [0, 5],
        [50, 55],
      ];

      mediaStore.mutations.setPlayed(state, played);

      expect(state.played).toEqual(played);
    });

    it('should set the poster property', () => {
      const state = {
        poster: null,
      };
      const poster = 'http://foo.bar/baz.jpg';

      mediaStore.mutations.setPoster(state, poster);

      expect(state.poster).toEqual(poster);
    });

    it('should set the preload flag', () => {
      const state = {
        preload: false,
      };

      mediaStore.mutations.setPreload(state, true);

      expect(state.preload).toBe(true);
    });

    it('should set the readyState property', () => {
      const state = {
        readyState: 0,
      };
      const readyState = 4;

      mediaStore.mutations.setReadyState(state, readyState);

      expect(state.readyState).toEqual(readyState);
    });

    it('should set the seekable property', () => {
      const state = {
        seekable: null,
      };
      const seekable = [
        [0, 5],
        [50, 55],
      ];

      mediaStore.mutations.setSeekable(state, seekable);

      expect(state.seekable).toEqual(seekable);
    });

    it('should set the seeking flag', () => {
      const state = {
        seeking: false,
      };

      mediaStore.mutations.setSeeking(state, true);

      expect(state.seeking).toBe(true);
    });

    it('should set the src property', () => {
      const state = {
        src: null,
      };
      const src = 'http://foo.bar/baz.mp4';

      mediaStore.mutations.setSrc(state, src);

      expect(state.src).toEqual(src);
    });

    it('should set the srcObject property', () => {
      const state = {
        srcObject: null,
      };
      const srcObject = {};

      mediaStore.mutations.setSrcObject(state, srcObject);

      expect(state.srcObject).toEqual(srcObject);
    });

    it('should set the text tracks', () => {
      const state = {
        textTracks: [],
      };
      const textTracks = [
        {
          id: 1,
          mode: 'disabled',
          name: 'foo',
        },
        {
          id: 2,
          mode: 'disabled',
          name: 'bar',
        },
      ];

      mediaStore.mutations.setTextTracks(state, textTracks);

      expect(state.textTracks).toEqual(textTracks);
    });

    it('should set the videoHeight property', () => {
      const state = {
        videoHeight: 0,
      };
      const videoHeight = 480;

      mediaStore.mutations.setVideoHeight(state, videoHeight);

      expect(state.videoHeight).toEqual(videoHeight);
    });

    it('should set the video tracks', () => {
      const videoTracks = [
        {
          id: 1,
          enabled: true,
        },
        {
          id: 2,
          enabled: false,
        },
      ];
      const state = {
        videoTracks: [],
      };

      mediaStore.mutations.setVideoTracks(state, videoTracks);

      expect(state.videoTracks).toEqual(videoTracks);
    });

    it('should set the videoWidth property', () => {
      const state = {
        videoWidth: 0,
      };
      const videoWidth = 640;

      mediaStore.mutations.setVideoWidth(state, videoWidth);

      expect(state.videoWidth).toEqual(videoWidth);
    });

    it('should set the volume property', () => {
      const state = {
        volume: 1,
      };
      const volume = 0.5;

      mediaStore.mutations.setVolume(state, volume);

      expect(state.volume).toEqual(volume);
    });

    it('should set the width property', () => {
      const state = {
        width: 0,
      };
      const width = 640;

      mediaStore.mutations.setWidth(state, width);

      expect(state.width).toEqual(width);
    });
  });

  describe('actions', () => {
    let contextMock;

    beforeEach(() => {
      contextMock = {
        commit: jest.fn(),
        state: {},
      };
    });

    describe('addEvent', () => {
      it('should set the value to duration when adding durationchange event', () => {
        const event = {
          name: 'durationchange',
        };
        contextMock.state.duration = 42;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: contextMock.state.duration,
        });
      });

      it('should set the value to videoWidth x videoHeight when adding resize event', () => {
        const event = {
          name: 'resize',
        };
        contextMock.state.videoWidth = 640;
        contextMock.state.videoHeight = 480;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: `${contextMock.state.videoWidth}x${contextMock.state.videoHeight}`,
        });
      });

      it('should set the value to currentTime when adding pause event', () => {
        const event = {
          name: 'pause',
        };
        contextMock.state.currentTime = 42;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: contextMock.state.currentTime,
        });
      });

      it('should set the value to currentTime when adding playing event', () => {
        const event = {
          name: 'playing',
        };
        contextMock.state.currentTime = 42;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: contextMock.state.currentTime,
        });
      });

      it('should set the value to currentTime when adding seeked event', () => {
        const event = {
          name: 'seeked',
        };
        contextMock.state.currentTime = 42;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: contextMock.state.currentTime,
        });
      });

      it('should set the value to muted when adding volumechange event in muted state', () => {
        const event = {
          name: 'volumechange',
        };
        contextMock.state.muted = true;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: 'muted',
        });
      });

      it('should set the value to volume% when adding volumechange event in unmuted state', () => {
        const event = {
          name: 'volumechange',
        };
        contextMock.state.muted = false;
        contextMock.state.volume = 0.5;

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
          value: '50%',
        });
      });

      it('should set no value for a progress event', () => {
        const event = {
          name: 'progress',
        };

        mediaStore.actions.addEvent(contextMock, event);

        expect(contextMock.commit).toBeCalledWith('addEvent', {
          ...event,
        });
      });
    });

    it('should call the corresponding clearEvents mutation', () => {
      mediaStore.actions.clearEvents(contextMock);

      expect(contextMock.commit).toBeCalledWith('clearEvents');
    });

    it('should call the corresponding initState mutation', () => {
      const state = {};

      mediaStore.actions.initState(contextMock, state);

      expect(contextMock.commit).toBeCalledWith('initState', state);
    });

    it('should call the corresponding setAudioTracks mutation', () => {
      const audioTracks = [];

      mediaStore.actions.setAudioTracks(contextMock, audioTracks);

      expect(contextMock.commit).toBeCalledWith('setAudioTracks', audioTracks);
    });

    it('should call the corresponding setAutoplay mutation', () => {
      const autoplay = true;

      mediaStore.actions.setAutoplay(contextMock, autoplay);

      expect(contextMock.commit).toBeCalledWith('setAutoplay', autoplay);
    });

    it('should call the corresponding setBuffered mutation', () => {
      const buffered = [];

      mediaStore.actions.setBuffered(contextMock, buffered);

      expect(contextMock.commit).toBeCalledWith('setBuffered', buffered);
    });

    it('should call the corresponding setControls mutation', () => {
      const controls = true;

      mediaStore.actions.setControls(contextMock, controls);

      expect(contextMock.commit).toBeCalledWith('setControls', controls);
    });

    it('should call the corresponding setCrossOrigin mutation', () => {
      const crossOrigin = 'use-credentials';

      mediaStore.actions.setCrossOrigin(contextMock, crossOrigin);

      expect(contextMock.commit).toBeCalledWith('setCrossOrigin', crossOrigin);
    });

    it('should call the corresponding setCurrentSrc mutation', () => {
      const currentSrc = 'http://foo.bar/baz.mp4';

      mediaStore.actions.setCurrentSrc(contextMock, currentSrc);

      expect(contextMock.commit).toBeCalledWith('setCurrentSrc', currentSrc);
    });

    it('should call the corresponding setCurrentTime mutation', () => {
      const currentTime = 42;

      mediaStore.actions.setCurrentTime(contextMock, currentTime);

      expect(contextMock.commit).toBeCalledWith('setCurrentTime', currentTime);
    });

    it('should call the corresponding setDuration mutation', () => {
      const duration = 42;

      mediaStore.actions.setDuration(contextMock, duration);

      expect(contextMock.commit).toBeCalledWith('setDuration', duration);
    });

    it('should call the corresponding setEnded mutation', () => {
      const ended = true;

      mediaStore.actions.setEnded(contextMock, ended);

      expect(contextMock.commit).toBeCalledWith('setEnded', ended);
    });

    it('should call the corresponding setError mutation', () => {
      const error = 3;

      mediaStore.actions.setError(contextMock, error);

      expect(contextMock.commit).toBeCalledWith('setError', error);
    });

    it('should call the corresponding setHeight mutation', () => {
      const height = 480;

      mediaStore.actions.setHeight(contextMock, height);

      expect(contextMock.commit).toBeCalledWith('setHeight', height);
    });

    it('should call the corresponding setLoop mutation', () => {
      const loop = true;

      mediaStore.actions.setLoop(contextMock, loop);

      expect(contextMock.commit).toBeCalledWith('setLoop', loop);
    });

    it('should call the corresponding setMuted mutation', () => {
      const muted = true;

      mediaStore.actions.setMuted(contextMock, muted);

      expect(contextMock.commit).toBeCalledWith('setMuted', muted);
    });

    it('should call the corresponding setNetworkState mutation', () => {
      const networkState = 4;

      mediaStore.actions.setNetworkState(contextMock, networkState);

      expect(contextMock.commit).toBeCalledWith('setNetworkState', networkState);
    });

    it('should call the corresponding setPaused mutation', () => {
      const paused = true;

      mediaStore.actions.setPaused(contextMock, paused);

      expect(contextMock.commit).toBeCalledWith('setPaused', paused);
    });

    it('should call the corresponding setPlaybackRate mutation', () => {
      const playbackRate = 2;

      mediaStore.actions.setPlaybackRate(contextMock, playbackRate);

      expect(contextMock.commit).toBeCalledWith('setPlaybackRate', playbackRate);
    });

    it('should call the corresponding setPlayed mutation', () => {
      const played = [];

      mediaStore.actions.setPlayed(contextMock, played);

      expect(contextMock.commit).toBeCalledWith('setPlayed', played);
    });

    it('should call the corresponding setPoster mutation', () => {
      const poster = 'http://foo.bar/baz.jpg';

      mediaStore.actions.setPoster(contextMock, poster);

      expect(contextMock.commit).toBeCalledWith('setPoster', poster);
    });

    it('should call the corresponding setPreload mutation', () => {
      const preload = true;

      mediaStore.actions.setPreload(contextMock, preload);

      expect(contextMock.commit).toBeCalledWith('setPreload', preload);
    });

    it('should call the corresponding setReadyState mutation', () => {
      const readyState = 4;

      mediaStore.actions.setReadyState(contextMock, readyState);

      expect(contextMock.commit).toBeCalledWith('setReadyState', readyState);
    });

    it('should call the corresponding setSeekable mutation', () => {
      const seekable = [];

      mediaStore.actions.setSeekable(contextMock, seekable);

      expect(contextMock.commit).toBeCalledWith('setSeekable', seekable);
    });

    it('should call the corresponding setSeeking mutation', () => {
      const seeking = true;

      mediaStore.actions.setSeeking(contextMock, seeking);

      expect(contextMock.commit).toBeCalledWith('setSeeking', seeking);
    });

    it('should call the corresponding setSrc mutation', () => {
      const src = 'http://foo.bar/baz.mp4';

      mediaStore.actions.setSrc(contextMock, src);

      expect(contextMock.commit).toBeCalledWith('setSrc', src);
    });

    it('should call the corresponding setSrcObject mutation', () => {
      const srcObject = {};

      mediaStore.actions.setSrcObject(contextMock, srcObject);

      expect(contextMock.commit).toBeCalledWith('setSrcObject', srcObject);
    });

    it('should call the corresponding setTextTracks mutation', () => {
      const textTracks = [];

      mediaStore.actions.setTextTracks(contextMock, textTracks);

      expect(contextMock.commit).toBeCalledWith('setTextTracks', textTracks);
    });

    it('should call the corresponding setVideoHeight mutation', () => {
      const videoHeight = 480;

      mediaStore.actions.setVideoHeight(contextMock, videoHeight);

      expect(contextMock.commit).toBeCalledWith('setVideoHeight', videoHeight);
    });

    it('should call the corresponding setVideoTracks mutation', () => {
      const videoTracks = [];

      mediaStore.actions.setVideoTracks(contextMock, videoTracks);

      expect(contextMock.commit).toBeCalledWith('setVideoTracks', videoTracks);
    });

    it('should call the corresponding setVideoWidth mutation', () => {
      const videoWidth = 640;

      mediaStore.actions.setVideoWidth(contextMock, videoWidth);

      expect(contextMock.commit).toBeCalledWith('setVideoWidth', videoWidth);
    });

    it('should call the corresponding setVolume mutation', () => {
      const volume = 0.5;

      mediaStore.actions.setVolume(contextMock, volume);

      expect(contextMock.commit).toBeCalledWith('setVolume', volume);
    });

    it('should call the corresponding setWidth mutation', () => {
      const width = 640;

      mediaStore.actions.setWidth(contextMock, width);

      expect(contextMock.commit).toBeCalledWith('setWidth', width);
    });
  });

  describe('mediaActions', () => {
    it('should return namespaced action names', () => {
      const actions = [
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
      ];
      const guid = 'abcd1234';

      actions.forEach((name) => {
        expect(mediaActions[name](guid)).toBe(`${guid}/${name}`);
      });
    });
  });
});
