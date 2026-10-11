

document.addEventListener("DOMContentLoaded", () => {
  // Once the page loads, grab the tab ID from the URL params and request the info needed
  // to properly render the block page.
  let tid = new URLSearchParams(document.location.search).get('tid')
  if (!tid) {
    return
  }
  const eventRequest = {source:'extension', cmd: 'getBlockEvent', blockedTabId:tid}

  // Send a message to the service worker to get the info needed to inject the block page.
  // this includes the block event AND the configuration for the block page (color, style, i18n, etc.)
  chrome.runtime.sendMessage(chrome.runtime.id, eventRequest, (response) => {
    // The script injection needs the JSON in a <script> tag
    if (response?.data) {
      const config = document.createElement("script");
      config.type = "application/json";
      config.id = "block-page-config";
      config.innerText = response.data;
      document.body.appendChild(config);
    }


    // Inject our block page from the script injection
    const bpScript = document.createElement("script");
    bpScript.type = "text/javascript";
    bpScript.src = "scripts/blockPageScript.js";
    document.body.appendChild(bpScript);
  })
})
