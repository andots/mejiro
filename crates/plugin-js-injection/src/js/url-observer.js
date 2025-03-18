(() => {
  console.info("Run: url-observer");

  const DEBOUNCE_TIME = 100;
  const URL_CHANGE_EVENT = "urlchange";
  const POP_STATE_EVENT = "popstate";

  let lastUrlChangeTime = 0;
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const sendUrlToTauri = (url) => {
    // console.log("URL changed:", window.location.href);
    if (!window.__TAURI__?.core?.invoke) {
      return;
    }
    window.__TAURI__.core.invoke("plugin:js-injection|send_page_url", { url });
  };

  const handleUrlChange = () => {
    try {
      sendUrlToTauri(window.location.href);
    } catch (error) {
      console.error("Error handling URL change:", error);
    }
  };

  const setupUrlTracking = () => {
    // override pushState and replaceState to detect URL changes
    history.pushState = (...args) => {
      const result = originalPushState.apply(history, args);
      const now = Date.now();
      if (now - lastUrlChangeTime > DEBOUNCE_TIME) {
        window.dispatchEvent(new Event(URL_CHANGE_EVENT));
        lastUrlChangeTime = now;
      }
      return result;
    };

    // override pushState and replaceState to detect URL changes
    history.replaceState = (...args) => {
      const result = originalReplaceState.apply(history, args);
      const now = Date.now();
      if (now - lastUrlChangeTime > DEBOUNCE_TIME) {
        window.dispatchEvent(new Event(URL_CHANGE_EVENT));
        lastUrlChangeTime = now;
      }
      return result;
    };

    // listen for POP_STATE_EVENT and URL_CHANGE_EVENT
    window.addEventListener(POP_STATE_EVENT, handleUrlChange);
    window.addEventListener(URL_CHANGE_EVENT, handleUrlChange);
  };

  try {
    // need to call handleUrlChange() here to send initial url
    handleUrlChange();
    setupUrlTracking();
  } catch (error) {
    console.error("Error initializing trackers:", error);
  }
})();
