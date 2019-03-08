import { MediaManager } from './services/media-manager';

const isChromeExtension = 'chrome' in window && !!chrome.runtime.onMessage;
const target = isChromeExtension
  ? window
  : document.getElementById('devtools').contentWindow;
const mm = new MediaManager(window, target);

mm.initialize();

// destroy the monitor on unload in order to unregister all the elements from the devtools
window.addEventListener('beforeunload', () => {
  mm.destroy();
});

// enable content-script <-> devtools proxy through the background script
if (isChromeExtension) {
  // forward message form the background script to the content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.src === 'mm-devtools') {
      window.postMessage(message, '*');
    }
  });

  // forward messages from the content script to the background script
  window.addEventListener('message', (event) => {
    if (
      event.source === window
      && event.data.src === 'mm-content-script'
    ) {
      chrome.runtime.sendMessage(event.data);
    }
  });
}
