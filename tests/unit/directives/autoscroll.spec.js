import { autoscroll } from '@/directives/autoscroll';

describe('Directive - Autoscroll', () => {
  let elementMock;
  let observeMock;
  let mutationObserverMock;

  beforeEach(() => {
    elementMock = {
      addEventListener: jest.fn(),
      clientHeight: 0,
      scroll: jest.fn(),
      scrollHeight: 0,
      scrollTop: 0,
    };

    observeMock = jest.fn().mockName('observe');

    mutationObserverMock = jest.fn(() => ({
      observe: observeMock,
    }));

    mutationObserverMock.mockName('MutationObserver');

    global.MutationObserver = mutationObserverMock;
  });

  it('should expose the bind method', () => {
    expect(autoscroll.bind).toBeTruthy();
  });

  it('should bind a scroll event listener', () => {
    autoscroll.bind(elementMock, {
      value: true,
    });

    expect(elementMock.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should observe the element\'s child list and subtree', () => {
    autoscroll.bind(elementMock, {
      value: true,
    });

    expect(observeMock).toBeCalledWith(elementMock, {
      childList: true,
      subtree: true,
    });
  });

  it('should not bind a scroll event listener if the value is falsy', () => {
    autoscroll.bind(elementMock, {
      value: false,
    });

    expect(elementMock.addEventListener).not.toHaveBeenCalled();
  });

  it('should observe the element\'s child list and subtree', () => {
    autoscroll.bind(elementMock, {
      value: false,
    });

    expect(observeMock).not.toHaveBeenCalled();
  });

  describe('mutation observer', () => {
    let observerCallback;

    beforeEach(() => {
      autoscroll.bind(elementMock, {
        value: true,
      });

      [[observerCallback]] = mutationObserverMock.mock.calls;
    });

    it('should scroll the element if child nodes were added', () => {
      const scrollHeight = 42;

      elementMock.scrollHeight = scrollHeight;

      observerCallback([{
        addedNodes: [{}],
      }]);

      expect(elementMock.scroll).toBeCalledWith({
        top: scrollHeight,
        behavior: 'instant',
      });
    });

    it('should scroll the element if child nodes were removed', () => {
      const scrollHeight = 42;

      elementMock.scrollHeight = scrollHeight;

      observerCallback([{
        addedNodes: [],
        removedNodes: [{}],
      }]);

      expect(elementMock.scroll).toBeCalledWith({
        top: scrollHeight,
        behavior: 'instant',
      });
    });

    it('should not scroll the element if child nodes were added but the element was previously scrolled', () => {
      elementMock.scrollHeight = 42;
      elementMock.clientHeight = 20;
      elementMock.scrollTop = 0;
      elementMock.addEventListener.mock.calls[0][1]();

      observerCallback([{
        addedNodes: [{}],
      }]);

      expect(elementMock.scroll).not.toBeCalled();
    });
  });
});
