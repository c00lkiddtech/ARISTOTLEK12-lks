(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("pageMonitor.js")
    );
  })().catch(console.error);

})();
