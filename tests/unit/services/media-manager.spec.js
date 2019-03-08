import { apiActions, ApiConnector } from '@/services/api-connector';
import { MediaConnector } from '@/services/media-connector';
import { MediaManager } from '@/services/media-manager';

jest.mock('../../../src/services/api-connector', () => ({
  ApiConnector: jest.fn().mockName('ApiConnector'),
  apiActions: {
    ready: 'ready',
  },
}));
jest.mock('../../../src/services/media-connector', () => ({
  MediaConnector: jest.fn().mockName('MediaConnector'),
}));

describe('Service - MediaManager', () => {
  let apiConnectorMock;
  let mediaConnectorMock;
  let mediaManager;
  let mutationObserverMock;
  let observerMock;
  let targetMock;
  let windowMock;

  beforeEach(() => {
    windowMock = {
      document: {
        body: {},
        querySelectorAll: jest.fn().mockReturnValue([]),
      },
    };
    targetMock = {};

    observerMock = {
      observe: jest.fn().mockName('observe'),
      disconnect: jest.fn().mockName('disconnect'),
    };

    mutationObserverMock = jest.fn(() => (observerMock));

    mutationObserverMock.mockName('MutationObserver');

    global.MutationObserver = mutationObserverMock;

    apiConnectorMock = {
      addListener: jest.fn(),
      destroy: jest.fn(),
      ready: jest.fn(),
    };
    ApiConnector.mockImplementation(() => apiConnectorMock);

    mediaConnectorMock = {
      destroy: jest.fn(),
      register: jest.fn(),
    };

    MediaConnector.mockImplementation(() => mediaConnectorMock);

    mediaManager = new MediaManager(windowMock, targetMock);
  });

  it('should instantiate API connector', () => {
    expect(ApiConnector).toBeCalledWith('mm-content-script', windowMock, targetMock);
  });

  describe('initialize', () => {
    beforeEach(() => {
      mediaManager.initialize();
    });

    it('should add an API connector listener', () => {
      expect(apiConnectorMock.addListener).toBeCalled();
    });

    it('should call the API connector\'s ready method', () => {
      expect(apiConnectorMock.ready).toBeCalled();
    });

    it('should observe the body for childList and subtree mutations', () => {
      expect(observerMock.observe).toBeCalledWith(windowMock.document.body, {
        childList: true,
        subtree: true,
      });
    });

    describe('on API message', () => {
      it('should mark itself as ready and add elements when receiving ready for the first time', () => {
        mediaManager.addElements = jest.fn();

        expect(mediaManager.isReady).toBeFalsy();

        apiConnectorMock.addListener.mock.calls[0][0]({
          data: {
            src: 'mm-devtools',
            action: apiActions.ready,
          },
        });

        expect(mediaManager.isReady).toBeTruthy();
        expect(mediaManager.addElements).toBeCalled();
      });

      it('should register elements when receiving ready for the second time', () => {
        mediaManager.addElements = jest.fn();
        mediaManager.registerElements = jest.fn();

        const event = {
          data: {
            src: 'mm-devtools',
            action: apiActions.ready,
          },
        };

        apiConnectorMock.addListener.mock.calls[0][0](event);

        expect(mediaManager.registerElements).not.toBeCalled();
        mediaManager.addElements.mockClear();

        apiConnectorMock.addListener.mock.calls[0][0](event);

        expect(mediaManager.addElements).not.toBeCalled();
        expect(mediaManager.registerElements).toBeCalled();
      });

      it('should ignore messages not coming from mm-devtools', () => {
        mediaManager.addElements = jest.fn();

        apiConnectorMock.addListener.mock.calls[0][0]({
          data: {
            src: 'unknown',
            action: apiActions.ready,
          },
        });

        expect(mediaManager.isReady).toBeFalsy();
        expect(mediaManager.addElements).not.toBeCalled();
      });
    });

    describe('on body mutation', () => {
      let mutationObserverCallback;

      beforeEach(() => {
        [[mutationObserverCallback]] = mutationObserverMock.mock.calls;
      });

      it('should add new nodes that are videos or audios', () => {
        mediaManager.addElement = jest.fn();

        const audioElement = {
          tagName: 'AUDIO',
        };
        const videoElement = {
          tagName: 'VIDEO',
        };

        mutationObserverCallback([
          {
            addedNodes: [audioElement, videoElement],
            removedNodes: [],
          },
        ]);

        expect(mediaManager.addElement).toHaveBeenCalledTimes(2);
        expect(mediaManager.addElement).toHaveBeenNthCalledWith(1, audioElement);
        expect(mediaManager.addElement).toHaveBeenNthCalledWith(2, videoElement);
      });

      it('should ignore new nodes that are not media', () => {
        mediaManager.addElement = jest.fn();

        const divElement = {
          tagName: 'DIV',
        };

        mutationObserverCallback([
          {
            addedNodes: [divElement],
            removedNodes: [],
          },
        ]);

        expect(mediaManager.addElement).not.toBeCalled();
      });

      it('should remove deleted nodes that are videos or audios', () => {
        mediaManager.removeElement = jest.fn();

        const audioElement = {
          tagName: 'AUDIO',
        };
        const videoElement = {
          tagName: 'VIDEO',
        };

        mutationObserverCallback([
          {
            addedNodes: [],
            removedNodes: [audioElement, videoElement],
          },
        ]);

        expect(mediaManager.removeElement).toHaveBeenCalledTimes(2);
        expect(mediaManager.removeElement).toHaveBeenNthCalledWith(1, audioElement);
        expect(mediaManager.removeElement).toHaveBeenNthCalledWith(2, videoElement);
      });

      it('should ignore deleted nodes that are not media', () => {
        mediaManager.removeElement = jest.fn();

        const divElement = {
          tagName: 'DIV',
        };

        mutationObserverCallback([
          {
            addedNodes: [],
            removedNodes: [divElement],
          },
        ]);

        expect(mediaManager.removeElement).not.toBeCalled();
      });
    });
  });

  describe('addElement', () => {
    it('should register a media connector for the added element', () => {
      mediaManager.isReady = true;

      const element = {};

      mediaManager.addElement(element);

      expect(MediaConnector).toBeCalledWith(element, mediaManager.apiConnector);
    });

    it('should save the element in the media elements map', () => {
      mediaManager.isReady = true;

      const element = {};

      mediaManager.addElement(element);

      expect(mediaManager.mediaElements.get(element)).toBeTruthy();
    });

    it('should not register a media connector for the element if it is already stored in the map', () => {
      mediaManager.isReady = true;

      const element = {};

      mediaManager.addElement(element);

      MediaConnector.mockClear();

      mediaManager.addElement(element);

      expect(MediaConnector).not.toBeCalled();
    });

    it('should not register a media connector for the element if the manager is not ready', () => {
      mediaManager.isReady = false;

      const element = {};

      mediaManager.addElement(element);

      expect(MediaConnector).not.toBeCalled();
    });
  });

  describe('addElements', () => {
    it('should add element for each matching node found', () => {
      const elements = [
        {},
        {},
      ];

      windowMock.document.querySelectorAll.mockReturnValue(elements);

      mediaManager.addElement = jest.fn();

      mediaManager.addElements();

      expect(mediaManager.addElement).toHaveBeenCalledTimes(2);
      expect(mediaManager.addElement).toHaveBeenNthCalledWith(1, elements[0]);
      expect(mediaManager.addElement).toHaveBeenNthCalledWith(2, elements[1]);
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      mediaManager.initialize();
      mediaManager.removeElements = jest.fn();
      mediaManager.destroy();
    });

    it('should remove the elements', () => {
      expect(mediaManager.removeElements).toBeCalled();
    });

    it('should destroy the API connector', () => {
      expect(apiConnectorMock.destroy).toBeCalled();
    });

    it('should disconnect the mutation observer', () => {
      expect(observerMock.disconnect).toBeCalled();
    });
  });

  describe('registerElements', () => {
    beforeEach(() => {
      mediaManager.isReady = true;
    });

    it('should register media connectors for added elements', () => {
      const elements = [
        {
          tagName: 'VIDEO',
        },
        {
          tagName: 'AUDIO',
        },
      ];

      windowMock.document.querySelectorAll.mockReturnValue(elements);
      mediaManager.addElement(elements[0]);
      mediaManager.registerElements();

      expect(mediaConnectorMock.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeElement', () => {
    it('should destroy element\'s media connector', () => {
      const element = {};

      mediaManager.isReady = true;
      mediaManager.addElement(element);
      mediaManager.removeElement(element);

      expect(mediaConnectorMock.destroy).toBeCalled();
    });

    it('should remove element from the media elements map', () => {
      const element = {};

      mediaManager.isReady = true;
      mediaManager.addElement(element);

      expect(mediaManager.mediaElements.get(element)).toBeTruthy();

      mediaManager.removeElement(element);

      expect(mediaManager.mediaElements.get(element)).toBeFalsy();
    });

    it('should not destroy the media connector when unknown element is removed', () => {
      const element = {};

      mediaManager.isReady = true;
      mediaManager.removeElement(element);

      expect(mediaConnectorMock.destroy).not.toBeCalled();
    });

    it('should not destroy the media connector when manager not ready', () => {
      const element = {};

      mediaManager.isReady = false;
      mediaManager.removeElement(element);

      expect(mediaConnectorMock.destroy).not.toBeCalled();
    });
  });

  describe('removeElements', () => {
    it('should call removeElement for each matching media element', () => {
      const elements = [
        {
          tagName: 'VIDEO',
        },
        {
          tagName: 'AUDIO',
        },
      ];

      windowMock.document.querySelectorAll.mockReturnValue(elements);

      mediaManager.removeElement = jest.fn();
      mediaManager.removeElements();

      expect(mediaManager.removeElement).toHaveBeenCalledTimes(2);
      expect(mediaManager.removeElement).toHaveBeenNthCalledWith(1, elements[0]);
      expect(mediaManager.removeElement).toHaveBeenNthCalledWith(2, elements[1]);
    });
  });
});
