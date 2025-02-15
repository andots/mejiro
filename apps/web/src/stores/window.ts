import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";

interface WindowState {
  sidebarVisible: boolean;
  isExternalWebviewVisible: boolean;
  hideExternalWebview: () => void;
  showExternalWebview: () => void;
  toggleExternalWebview: () => void;
  toggleSidebar: () => void;
}

export const useWindowState = createWithSignal<WindowState>((set) => ({
  sidebarVisible: true,
  isExternalWebviewVisible: true,

  hideExternalWebview: async () => {
    set(() => ({ isExternalWebviewVisible: false }));
    Invoke.HideExternalWebview();
  },

  showExternalWebview: async () => {
    set(() => ({ isExternalWebviewVisible: true }));
    Invoke.ShowExternalWebview();
  },

  toggleExternalWebview: async () => {
    const visible = useWindowState((state) => state.isExternalWebviewVisible);
    if (visible()) {
      const hideExternalWebview = useWindowState((state) => state.hideExternalWebview);
      hideExternalWebview();
    } else {
      const showExternalWebview = useWindowState((state) => state.showExternalWebview);
      showExternalWebview();
    }
  },

  toggleSidebar: async () => {
    const appBounds = await Invoke.GetAppWebviewBounds();
    const externalBounds = await Invoke.GetExternalWebviewBounds();
    // TODO: must be user defined state
    const headerHeight = 40;
    const sidebarWidth = 200;
    if (externalBounds.position.Physical.x === 0) {
      // External is full on window, so we need to move it to the right
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: sidebarWidth, y: headerHeight },
      });
      set(() => ({ sidebarVisible: true }));
    } else {
      // External is already moved to the right, so we need to move it back to the left
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: 0, y: headerHeight },
      });
      set(() => ({ sidebarVisible: false }));
    }
  },
}));
