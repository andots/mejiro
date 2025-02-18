(() => {
  document.addEventListener("DOMContentLoaded", () => {
    // Constants
    const CONFIG = {
      DEBOUNCE_TIME: 100,
      EVENTS: {
        URL_CHANGE: "urlchange",
        POP_STATE: "popstate",
      },
      SELECTORS: {
        TITLE: "title",
      },
    };

    class NavigationTracker {
      constructor() {
        this.lastUrlChangeTime = 0;
        this.originalPushState = history.pushState;
        this.originalReplaceState = history.replaceState;

        this.initializeHistoryHooks();
        this.initializeEventListeners();
      }

      initializeHistoryHooks() {
        history.pushState = (...args) => {
          const result = this.originalPushState.apply(history, args);
          this.triggerUrlChange();
          return result;
        };

        history.replaceState = (...args) => {
          const result = this.originalReplaceState.apply(history, args);
          this.triggerUrlChange();
          return result;
        };
      }

      initializeEventListeners() {
        window.addEventListener(CONFIG.EVENTS.POP_STATE, () => this.triggerUrlChange());
        window.addEventListener(CONFIG.EVENTS.URL_CHANGE, () => {
          this.handleUrlChange();
        });
      }

      triggerUrlChange() {
        const now = Date.now();
        if (now - this.lastUrlChangeTime > CONFIG.DEBOUNCE_TIME) {
          window.dispatchEvent(new Event(CONFIG.EVENTS.URL_CHANGE));
          this.lastUrlChangeTime = now;
        }
      }

      handleUrlChange() {
        try {
          // console.log(`URL changed: ${window.location.href}`);
          if (window.__TAURI__) {
            // Additional URL change handling here
            const tauri = window.__TAURI__;
            const invoke = tauri.core.invoke;
            if (invoke) {
              invoke("send_page_url", { url: window.location.href });
            }
          }
        } catch (error) {
          console.error("Error handling URL change:", error);
        }
      }
    }

    class TitleObserver {
      constructor() {
        this.titleElement = document.querySelector(CONFIG.SELECTORS.TITLE);

        if (!this.titleElement) {
          console.warn("Title element not found");
          return;
        }

        this.observer = new MutationObserver(this.handleTitleMutation.bind(this));
        this.initializeObserver();
        this.logCurrentTitle();
      }

      initializeObserver() {
        try {
          this.observer.observe(this.titleElement, { childList: true });
        } catch (error) {
          console.error("Error initializing title observer:", error);
        }
      }

      handleTitleMutation(mutations) {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            this.handleTitleChange();
          }
        }
      }

      handleTitleChange() {
        try {
          // console.log(`Title changed: ${document.title}`);
          if (window.__TAURI__) {
            const tauri = window.__TAURI__;
            const invoke = tauri.core.invoke;
            if (invoke) {
              invoke("send_page_title", { title: document.title });
            }
          }
        } catch (error) {
          console.error("Error handling title change:", error);
        }
      }

      logCurrentTitle() {
        this.handleTitleChange();
      }

      disconnect() {
        this.observer.disconnect();
      }
    }

    // Initialize trackers
    try {
      const navigationTracker = new NavigationTracker();
      const titleObserver = new TitleObserver();

      // Cleanup on page unload if needed
      window.addEventListener("unload", () => {
        titleObserver.disconnect();
      });
    } catch (error) {
      console.error("Error initializing trackers:", error);
    }
  });
})();
