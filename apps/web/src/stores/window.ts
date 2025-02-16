import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";

type ExternalState = "full" | "hide" | "right";

interface WindowState {
  externalState: ExternalState;
  changeExternalState: (flag: ExternalState) => void;
}

export const useWindowState = createWithSignal<WindowState>((set, get) => ({
  externalState: "right",
  changeExternalState: async (flag: ExternalState) => {
    const headerHeight = 40;
    const sidebarWidth = 200;
    const appBounds = await Invoke.GetAppWebviewBounds();
    if (flag === "right") {
      // Set the bounds of the external webview to the right side of the app
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: sidebarWidth, y: headerHeight },
      });
      // Show the external webview if it is hidden
      if (get().externalState === "hide") {
        await Invoke.ShowExternalWebview();
      }
      set(() => ({ externalState: "right" }));
    } else if (flag === "hide") {
      // Hide the external webview
      await Invoke.HideExternalWebview();
      set(() => ({ externalState: "hide" }));
    } else if (flag === "full") {
      // Set the bounds of the external webview to the full size of the app
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: 0, y: headerHeight },
      });
      // Show the external webview if it is hidden
      if (get().externalState === "hide") {
        await Invoke.ShowExternalWebview();
      }
      set(() => ({ externalState: "full" }));
    }
  },
}));
