let previousUrl = "";

const observer = new MutationObserver(() => {
  if (window.location.href !== previousUrl) {
    locationChanged();
    previousUrl = window.location.href;
  }
});
const config = { subtree: true, childList: true };

observer.observe(document, config);

document.addEventListener("DOMContentLoaded", () => {
  locationChanged();
});

function locationChanged() {
  if (window.__TAURI__) {
    const tauri = window.__TAURI__;
    const invoke = tauri.core.invoke;
    if (invoke) {
      invoke("emit_page_params", { title: document.title, url: window.location.href });
    }
  } else {
    console.log("Tauri is not available");
  }
}
