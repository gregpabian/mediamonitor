export const uiActions = {
  addElement: 'ui/addElement',
  removeElement: 'ui/removeElement',
  setCurrentGuid: 'ui/setCurrentGuid',
  setWidth: 'ui/setWidth',
};

export const uiStore = {
  namespaced: true,
  state: {
    currentGuid: null,
    elements: {},
    width: 0,
  },
  mutations: {
    addElement(state, element) {
      state.elements = {
        ...state.elements,
        [element.guid]: element,
      };

      if (state.currentGuid === null) {
        state.currentGuid = element.guid;
      }
    },
    removeElement(state, element) {
      const newElements = {
        ...state.elements,
      };

      delete newElements[element.guid];

      state.elements = newElements;

      if (state.currentGuid === element.guid) {
        const guids = Object.keys(state.elements);

        state.currentGuid = guids.length
          ? guids[0]
          : null;
      }
    },
    setCurrentGuid(state, guid) {
      state.currentGuid = guid;
    },
    setWidth(state, width) {
      state.width = width;
    },
  },
  actions: {
    addElement(context, { guid, selector }) {
      context.commit('addElement', {
        guid,
        selector,
      });
    },
    removeElement(context, element) {
      context.commit('removeElement', element);
    },
    setCurrentGuid(context, guid) {
      context.commit('setCurrentGuid', guid);
    },
    setWidth(context, width) {
      context.commit('setWidth', width);
    },
  },
};
