const backgroundScriptConnection = chrome.runtime.connect({
  name: 'devtools-page',
});
const { tabId } = chrome.devtools.inspectedWindow;

backgroundScriptConnection.postMessage({
  name: 'mm-init',
  tabId,
});

chrome.devtools.panels.create(
  'Media Monitor',
  'icons/icon_128.png',
  'monitor/index.html',
  (panel) => {
    let isReady = false;

    panel.onShown.addListener((panelWindow) => {
      // on shown gets triggered again when switching devtools between windowed and docked modes
      // this would stop the listeners from binding again
      if (isReady) {
        return;
      }

      backgroundScriptConnection.onMessage.addListener((message) => {
        // forward messages from the content script to the devtools
        if (message.src === 'mm-content-script') {
          panelWindow.postMessage(message, '*');
        }
      });

      panelWindow.addEventListener('message', (event) => {
        // forward messages from the devtools to the background script
        if (event.data.src === 'mm-devtools') {
          backgroundScriptConnection.postMessage({
            ...event.data,
            tabId,
          });
        }
      });

      // onShown is triggered once the panel fully renders and
      // the Vue component is already mounted at this point so send the ready event again
      backgroundScriptConnection.postMessage({
        action: 'ready',
        src: 'mm-devtools',
        tabId,
      });

      isReady = true;
    });
  },
);
