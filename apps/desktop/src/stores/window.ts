import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";
import { SIDEBAR_MIN_WIDTH, HEADER_HEIGHT } from "../constants";
import type { PhysicalSize } from "@tauri-apps/api/dpi";

type ExternalState = "full" | "hidden" | "right";

interface WindowState {
  externalState: ExternalState;
  sidebarWidth: number;
  setupWindowGeometry: () => Promise<void>;
  setSidebarWidth: (newWidth: number) => Promise<void>;
  setExternalSize: (size: PhysicalSize) => Promise<void>;
  changeExternalState: (flag: ExternalState) => Promise<void>;
}

export const useWindowState = createWithSignal<WindowState>((set, get) => ({
  externalState: "right",
  sidebarWidth: SIDEBAR_MIN_WIDTH,
  setupWindowGeometry: async () => {
    const geometry = await Invoke.GetWindowGeometry();
    const sidebarWidth = geometry.sidebar_width;
    if (sidebarWidth === 0) {
      // If the sidebar width is 0, it means the user closed the window without the sidebar.
      // So set externalState to full but keep the sidebar width as the initial value SIDEBAR_MIN_WIDTH.
      set(() => ({ externalState: "full" }));
    } else {
      // Set the sidebar width and external state to right
      set(() => ({ sidebarWidth, externalState: "right" }));
    }
  },
  setSidebarWidth: async (newWidth: number) => {
    const appBounds = await Invoke.GetAppWebviewBounds();
    const externalWidth = appBounds.size.Physical.width - newWidth;
    const externalHeight = appBounds.size.Physical.height - HEADER_HEIGHT;
    const x = newWidth;
    const y = HEADER_HEIGHT;
    await Invoke.SetExternalWebviewBounds({
      size: { width: externalWidth, height: externalHeight },
      position: { x, y },
    });
    set(() => ({ sidebarWidth: newWidth }));
  },
  setExternalSize: async (size: PhysicalSize) => {
    // Set x position based on external state
    let x: number;
    if (get().externalState === "full") {
      x = 0;
    } else {
      x = get().sidebarWidth;
    }
    const y = HEADER_HEIGHT;
    await Invoke.SetExternalWebviewBounds({
      size: { width: size.width - x, height: size.height - y },
      position: { x, y },
    });
  },
  changeExternalState: async (flag: ExternalState) => {
    if (flag === "right") {
      // Set the bounds of the external webview to the right side of the app
      const appBounds = await Invoke.GetAppWebviewBounds();
      const sidebarWidth = get().sidebarWidth;
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - HEADER_HEIGHT,
        },
        position: { x: sidebarWidth, y: HEADER_HEIGHT },
      });
      // Show the external webview if it is hidden
      if (get().externalState === "hidden") {
        await Invoke.ShowExternalWebview();
      }
      set(() => ({ externalState: flag }));
    } else if (flag === "full") {
      // Set the bounds of the external webview to the full size of the app
      const appBounds = await Invoke.GetAppWebviewBounds();
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - HEADER_HEIGHT,
        },
        position: { x: 0, y: HEADER_HEIGHT },
      });
      // Show the external webview if it is hidden
      if (get().externalState === "hidden") {
        await Invoke.ShowExternalWebview();
      }
      set(() => ({ externalState: flag }));
    } else if (flag === "hidden") {
      // Hide the external webview
      await Invoke.HideExternalWebview();
      set(() => ({ externalState: flag }));
    }
  },
}));
