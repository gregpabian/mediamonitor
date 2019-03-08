import Vue from 'vue';
import { createLocalVue, mount } from '@vue/test-utils';
import { bus } from '@/plugins/bus';

describe('Plugin - Bus', () => {
  let localVue;

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(bus);
  });

  it('should expose the install method', () => {
    expect(bus.install).toBeTruthy();
    expect(typeof bus.install).toBe('function');
  });

  it('should expose the $bus property on Vue instance if supplied in the options', () => {
    const bus = new Vue();
    const Component = localVue.extend({
      bus,
      localVue,
      template: '<div/>',
    });

    const wrapper = mount(Component);

    expect(wrapper.vm.$bus).toBe(bus);
  });

  it('should inherit the $bus from the parent component', () => {
    const bus = new Vue();
    const Parent = localVue.extend({
      bus,
      localVue,
      template: '<div><child ref="child" /></div>',
    });

    const Child = localVue.extend({
      localVue,
      template: '<div />',
    });

    const wrapper = mount(Parent, {
      stubs: {
        child: Child,
      },
    });

    expect(wrapper.vm.$refs.child.$bus).toBe(bus);
  });

  it('should have no $bus property if the parent has none', () => {
    const bus = new Vue();
    const Parent = localVue.extend({
      localVue,
      template: '<div><child ref="child" /></div>',
    });

    const Child = localVue.extend({
      localVue,
      template: '<div />',
    });

    const wrapper = mount(Parent, {
      stubs: {
        child: Child,
      },
    });

    expect(wrapper.vm.$refs.child.$bus).toBeFalsy();
  });
});
