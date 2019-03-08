import { apiActions, ApiConnector } from '@/services/api-connector';

describe('Service - API Connector', () => {
  let apiConnector;
  let windowMock;
  let targetMock;

  beforeEach(() => {
    windowMock = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    targetMock = {
      postMessage: jest.fn(),
    };

    apiConnector = new ApiConnector('test', windowMock, targetMock);
  });

  it('should bind a message event listener when adding a listener', () => {
    const listener = jest.fn();

    apiConnector.addListener(listener);

    expect(windowMock.addEventListener).toBeCalledWith('message', listener);
  });

  it('should unbind a message event listener when removing a listener', () => {
    const listener = jest.fn();

    apiConnector.addListener(listener);
    apiConnector.removeListener(listener);

    expect(windowMock.removeEventListener).toBeCalledWith('message', listener);
  });

  it('should not throw nor call removeEventListener when trying to remove an unknown listener', () => {
    const listener = jest.fn();

    expect(() => apiConnector.removeListener(listener)).not.toThrow();
    expect(windowMock.removeEventListener).not.toBeCalled();
  });

  it('should post a message to the target when sending', () => {
    const message = {
      action: 'foo',
      value: 'bar',
    };

    apiConnector.send(message);

    expect(targetMock.postMessage).toBeCalledWith({
      ...message,
      src: 'test',
    }, '*');
  });

  it('should send the ready action when ready', () => {
    apiConnector.ready();

    expect(targetMock.postMessage).toBeCalledWith({
      action: apiActions.ready,
      src: 'test',
    }, '*');
  });

  it('should remove all the bound listeners when destroyed', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    apiConnector.addListener(listener1);
    apiConnector.addListener(listener2);
    apiConnector.destroy();

    expect(windowMock.removeEventListener).toHaveBeenCalledTimes(2);
    expect(windowMock.removeEventListener).toHaveBeenNthCalledWith(1, 'message', listener1);
    expect(windowMock.removeEventListener).toHaveBeenNthCalledWith(2, 'message', listener2);
  });
});
