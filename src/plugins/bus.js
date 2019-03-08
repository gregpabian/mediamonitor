/**
 * A simple event bus plugin based on Vue's event emitter.
 * Expects the bus instance to be passed as the 'bus' option.
 * Child components will inherit the bus instance from their parent, unless overridden.
 *
 * Example:
 *
 * new Vue({
 *   bus: new Vue(),
 *   mounted() {
 *     ths.$bus.$on('hello', () => console.log('hello!');
 *     ...
 *     this.$bus.$emit('hello');
 *   }
 * });
 */
export const bus = {
  install(Vue) {
    Vue.mixin({
      beforeCreate() {
        if (this.$options.bus) {
          this.$bus = this.$options.bus;
        } else if (this.$parent && this.$parent.$bus) {
          this.$bus = this.$parent.$bus;
        }
      },
    });
  },
};
