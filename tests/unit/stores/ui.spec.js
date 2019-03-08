import { uiStore } from '@/stores/ui';

describe('Store - UI', () => {
  it('should be namespaced', () => {
    expect(uiStore.namespaced).toBe(true);
  });

  it('should return the default state', () => {
    expect(uiStore.state).toEqual({
      currentGuid: null,
      elements: {},
      width: 0,
    });
  });

  describe('mutations', () => {
    it('should add an element to the existing ones', () => {
      const state = {
        currentGuid: 'foo',
        elements: {
          foo: {
            selector: '#foo',
            guid: 'foo',
          },
        },
      };
      const element = {
        guid: 'bar',
        selector: '#bar',
      };

      uiStore.mutations.addElement(state, element);

      expect(Object.keys(state.elements)).toHaveLength(2);
      expect(state.elements.bar).toEqual(element);
    });

    it('should update the current guid when the first element is added', () => {
      const state = {
        currentGuid: null,
        elements: {},
      };
      const element = {
        guid: 'bar',
        selector: '#bar',
      };

      uiStore.mutations.addElement(state, element);

      expect(state.currentGuid).toEqual(element.guid);
    });

    it('should remove an element from the existing ones', () => {
      const element = {
        guid: 'bar',
        selector: '#bar',
      };
      const state = {
        currentGuid: 'foo',
        elements: {
          foo: {
            selector: '#foo',
            guid: 'foo',
          },
          bar: element,
        },
      };

      uiStore.mutations.removeElement(state, element);

      expect(Object.keys(state.elements)).toHaveLength(1);
      expect(state.elements.bar).toBeFalsy();
    });

    it('should update the current guid with the next element when the current element is removed', () => {
      const element = {
        guid: 'bar',
        selector: '#bar',
      };
      const state = {
        currentGuid: element.guid,
        elements: {
          foo: {
            selector: '#foo',
            guid: 'foo',
          },
          bar: element,
        },
      };

      uiStore.mutations.removeElement(state, element);

      expect(state.currentGuid).toBe('foo');
    });

    it('should set the current guid to null when the last element is removed', () => {
      const element = {
        guid: 'bar',
        selector: '#bar',
      };
      const state = {
        currentGuid: element.guid,
        elements: {
          bar: element,
        },
      };

      uiStore.mutations.removeElement(state, element);

      expect(state.currentGuid).toBe(null);
    });

    it('should set the current guid', () => {
      const guid = 'foo';
      const state = {
        currentGuid: null,
      };

      uiStore.mutations.setCurrentGuid(state, guid);

      expect(state.currentGuid).toBe(guid);
    });

    it('should set the width', () => {
      const width = 1024;
      const state = {
        width: 0,
      };

      uiStore.mutations.setWidth(state, width);

      expect(state.width).toBe(width);
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

    it('should call the corresponding addElement mutation with just the guid and selector', () => {
      const event = {
        name: 'register',
        guid: 'foo',
        selector: '#foo',
      };

      uiStore.actions.addElement(contextMock, event);

      expect(contextMock.commit).toBeCalledWith('addElement', {
        guid: event.guid,
        selector: event.selector,
      });
    });

    it('should call the corresponding removeElement mutation', () => {
      const event = {
        name: 'register',
        guid: 'foo',
        selector: '#foo',
      };

      uiStore.actions.removeElement(contextMock, event);

      expect(contextMock.commit).toBeCalledWith('removeElement', event);
    });

    it('should call the corresponding setCurrentGuid mutation', () => {
      const guid = 'foo';

      uiStore.actions.setCurrentGuid(contextMock, guid);

      expect(contextMock.commit).toBeCalledWith('setCurrentGuid', guid);
    });

    it('should call the corresponding setWidth mutation', () => {
      const width = 1024;

      uiStore.actions.setWidth(contextMock, width);

      expect(contextMock.commit).toBeCalledWith('setWidth', width);
    });
  });
});
