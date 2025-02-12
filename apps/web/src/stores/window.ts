import { createWithSignal } from "solid-zustand";

import { invokeHideExternalWebview, invokeShowExternalWebview } from "../invokes";

interface WindowState {
  isExternalWebviewVisible: boolean;
  setExternalWebviewVisible: (visible: boolean) => void;
  hideExternalWebview: () => void;
  showExternalWebview: () => void;
  toggleExternalWebview: () => void;
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
    const show = useWindowState((state) => state.showExternalWebview);
    const hide = useWindowState((state) => state.hideExternalWebview);
    if (visible()) {
      hide();
    } else {
      show();
    }
  },
}));
