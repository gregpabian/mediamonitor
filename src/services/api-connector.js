export const apiActions = {
  mediaEvent: 'mediaEvent',
  ready: 'ready',
  register: 'register',
  unregister: 'unregister',
};

export class ApiConnector {
  constructor(name, window, target) {
    this.name = name;
    this.window = window;
    this.target = target;
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
    this.window.addEventListener('message', listener);
  }

  destroy() {
    const listeners = [].concat(this.listeners);

    listeners.forEach((listener) => this.removeListener(listener));
  }

  ready() {
    this.send({
      action: apiActions.ready,
    });
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener);

    if (index === -1) {
      return;
    }

    this.listeners.splice(index, 1);
    this.window.removeEventListener('message', listener);
  }

  send(message) {
    this.target.postMessage({
      ...message,
      src: this.name,
    }, '*');
  }
}
