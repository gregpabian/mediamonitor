import Vue from 'vue';
import Vuex from 'vuex';
import { uiStore } from './ui';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    ui: uiStore,
  },
});
