(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("injectionConfig.js")
    );
  })().catch(console.error);

})();
