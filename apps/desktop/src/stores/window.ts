import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import { SIDEBAR_MIN_WIDTH, HEADER_HEIGHT } from "../constants";

type ExternalState = "full" | "hidden" | "right";

interface WindowState {
  externalState: ExternalState;
  headerHeight: number;
  sidebarWidth: number;
  setSidebarWidth: (newWidth: number) => Promise<void>;
  changeExternalState: (flag: ExternalState) => Promise<void>;
}

export const useWindowState = createWithSignal<WindowState>((set, get) => ({
  externalState: "right",
  headerHeight: HEADER_HEIGHT,
  sidebarWidth: SIDEBAR_MIN_WIDTH,
  setSidebarWidth: async (newWidth: number) => {
    const appBounds = await Invoke.GetAppWebviewBounds();
    const externalWidth = appBounds.size.Physical.width - newWidth;
    const externalHeight = appBounds.size.Physical.height - get().headerHeight;
    const x = newWidth;
    const y = get().headerHeight;
    await Invoke.SetExternalWebviewBounds({
      size: { width: externalWidth, height: externalHeight },
      position: { x, y },
    });
    set(() => ({ sidebarWidth: newWidth }));
  },
  changeExternalState: async (flag: ExternalState) => {
    const headerHeight = get().headerHeight;
    const sidebarWidth = get().sidebarWidth;
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
      if (get().externalState === "hidden") {
        await Invoke.ShowExternalWebview();
      }
      set(() => ({ externalState: "right" }));
    } else if (flag === "hidden") {
      // Hide the external webview
      await Invoke.HideExternalWebview();
      set(() => ({ externalState: "hidden" }));
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
      if (get().externalState === "hidden") {
        await Invoke.ShowExternalWebview();
      }
      set(() => ({ externalState: "full" }));
    }
  },
}));
