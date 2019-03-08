import { ApiConnector, apiActions } from './api-connector';
import { MediaConnector } from './media-connector';

export class MediaManager {
  constructor(window, target) {
    this.window = window;
    this.apiConnector = new ApiConnector('mm-content-script', window, target);
    this.mediaElements = new WeakMap();
    this.isReady = false;
  }

  addElement(element) {
    if (!this.isReady) {
      return;
    }

    if (this.mediaElements.has(element)) {
      return;
    }

    const mediaConnector = new MediaConnector(element, this.apiConnector);

    this.mediaElements.set(element, mediaConnector);
  }

  addElements() {
    const elements = this.window.document.querySelectorAll('video, audio');

    elements.forEach((element) => this.addElement(element));
  }

  destroy() {
    this.removeElements();
    this.apiConnector.destroy();
    this.observer.disconnect();
  }

  initialize() {
    this.apiConnector.addListener((event) => {
      if (
        event.data.src !== 'mm-devtools'
        || event.data.action !== apiActions.ready
      ) {
        return;
      }

      if (this.isReady) {
        this.registerElements();

        return;
      }

      this.isReady = true;

      this.addElements();
    });

    this.apiConnector.ready();

    this.observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.addedNodes.length) {
          record.addedNodes.forEach((element) => {
            if (element.tagName === 'AUDIO' || element.tagName === 'VIDEO') {
              this.addElement(element);
            }
          });
        }

        if (record.removedNodes.length) {
          record.removedNodes.forEach((element) => {
            if (element.tagName === 'AUDIO' || element.tagName === 'VIDEO') {
              this.removeElement(element);
            }
          });
        }
      });
    });

    this.observer.observe(this.window.document.body, {
      childList: true,
      subtree: true,
    });
  }

  registerElements() {
    const elements = this.window.document.querySelectorAll('video, audio');

    elements.forEach((element) => {
      if (this.mediaElements.has(element)) {
        const mediaConnector = this.mediaElements.get(element);

        mediaConnector.register();
      }
    });
  }

  removeElement(element) {
    if (!this.isReady) {
      return;
    }

    if (!this.mediaElements.has(element)) {
      return;
    }

    const mediaConnector = this.mediaElements.get(element);

    mediaConnector.destroy();
    this.mediaElements.delete(element);
  }

  removeElements() {
    const elements = this.window.document.querySelectorAll('video, audio');

    elements.forEach((element) => this.removeElement(element));
  }
}
