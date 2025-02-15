import { createWithSignal } from "solid-zustand";

import { Invoke } from "../invokes";

interface WindowState {
  isExternalWebviewVisible: boolean;
  hideExternalWebview: () => void;
  showExternalWebview: () => void;
  toggleExternalWebview: () => void;
  toggleSidebar: () => void;
}

export const useWindowState = createWithSignal<WindowState>((set) => ({
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
      // 全画面状態なので、サイドバー分の幅を引く
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: sidebarWidth, y: headerHeight },
      });
    } else {
      await Invoke.SetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: 0, y: headerHeight },
      });
    }
  },
}));
