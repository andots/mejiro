import { createWithSignal } from "solid-zustand";

import {
  invokeGetAppWebviewBounds,
  invokeGetExternalWebviewBounds,
  invokeHideExternalWebview,
  invokeSetExternalWebviewBounds,
  invokeShowExternalWebview,
} from "../invokes";

interface WindowState {
  isExternalWebviewVisible: boolean;
  setExternalWebviewVisible: (visible: boolean) => void;
  hideExternalWebview: () => void;
  showExternalWebview: () => void;
  toggleExternalWebview: () => void;
  toggleSidebar: () => void;
}

export const useWindowState = createWithSignal<WindowState>((set) => ({
  isExternalWebviewVisible: true,

  setExternalWebviewVisible: (visible: boolean) =>
    set(() => ({ isExternalWebviewVisible: visible })),

  hideExternalWebview: async () => {
    set(() => ({ isExternalWebviewVisible: false }));
    invokeHideExternalWebview();
  },

  showExternalWebview: async () => {
    set(() => ({ isExternalWebviewVisible: true }));
    invokeShowExternalWebview();
  },

  toggleExternalWebview: async () => {
    const visible = useWindowState((state) => state.isExternalWebviewVisible);
    const showExternalWebview = useWindowState((state) => state.showExternalWebview);
    const hideExternalWebview = useWindowState((state) => state.hideExternalWebview);
    if (visible()) {
      hideExternalWebview();
    } else {
      showExternalWebview();
    }
  },

  toggleSidebar: async () => {
    const appBounds = await invokeGetAppWebviewBounds();
    const externalBounds = await invokeGetExternalWebviewBounds();
    // TODO: must be user defined state
    const headerHeight = 40;
    const sidebarWidth = 200;
    if (externalBounds.position.Physical.x === 0) {
      // 全画面状態なので、サイドバー分の幅を引く
      await invokeSetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width - sidebarWidth,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: sidebarWidth, y: headerHeight },
      });
    } else {
      await invokeSetExternalWebviewBounds({
        size: {
          width: appBounds.size.Physical.width,
          height: appBounds.size.Physical.height - headerHeight,
        },
        position: { x: 0, y: headerHeight },
      });
    }
  },
}));
