(() => {
  const sendTitleToTauri = (title) => {
    if (!window.__TAURI__?.core?.invoke) {
      return;
    }
    window.__TAURI__.core.invoke("plugin:js-injection|send_page_title", { title });
  };

  const handleTitleChange = () => {
    const title = document.title;
    sendTitleToTauri(title);
  };

  try {
    handleTitleChange();
  } catch (error) {
    console.error("Error initializing trackers:", error);
  }
})();
