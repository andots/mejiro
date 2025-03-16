(() => {
  let previousTitle;

  const sendTitleToTauri = (title) => {
    // console.log("Title changed:", title);
    if (!window.__TAURI__?.core?.invoke) {
      return;
    }
    window.__TAURI__.core.invoke("plugin:js-injection|send_page_title", { title });
  };

  const handleTitleChange = () => {
    const title = document.title;
    if (title !== "" && title !== previousTitle) {
      sendTitleToTauri(title);
    }
    previousTitle = document.title;
  };

  const setupObserver = (selector) => {
    const element = document.querySelector(selector);

    if (!element) {
      console.warn("element not found", selector);
      return null;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          handleTitleChange();
        }
      }
    });

    try {
      observer.observe(element, { childList: true });
      return observer;
    } catch (error) {
      console.error("Error initializing title observer:", error);
      return null;
    }
  };

  try {
    // Call handleTitleChange() here to send initial title
    handleTitleChange();

    // Setup observer for <head> and <title> elements especially for SPA sites that use client-side routing
    // some sites (e.g. solidjs, kobalte) needs to observe the <head> element
    const headObserver = setupObserver("head");
    // some sites (e.g. crates.io) needs to observe the <title> element
    const titleObserver = setupObserver("title");

    // cleanup
    window.addEventListener("unload", () => {
      headObserver?.disconnect();
      titleObserver?.disconnect();
    });
  } catch (error) {
    console.error("Error initializing trackers:", error);
  }
})();
