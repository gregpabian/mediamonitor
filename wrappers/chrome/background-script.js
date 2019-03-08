const connections = {};

chrome.runtime.onConnect.addListener((port) => {
  const extensionListener = (message) => {
    // register devtools
    if (message.name === 'mm-init' && message.tabId) {
      connections[message.tabId] = port;
      // forward messages from the devtools to the inspected tab
    } else if (message.src === 'mm-devtools') {
      chrome.tabs.sendMessage(message.tabId, message);
    }
  };

  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(extensionListener);

    Object.keys(connections).some((tabId) => {
      if (connections[tabId] === port) {
        delete connections[tabId];

        return true;
      }

      return false;
    });
  });
});

// forward messages from the inspected tab to devtools
chrome.runtime.onMessage.addListener((message, sender) => {
  if (sender.tab && sender.tab.id in connections) {
    connections[sender.tab.id].postMessage(message);
  }
});
