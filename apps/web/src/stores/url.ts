import { createWithSignal } from "solid-zustand";
import { invokeNavigateWebviewUrl } from "../invokes";

interface UrlState {
  url: string;
  title: string;
  setUrl: (url: string) => void;
  setTitle: (title: string) => void;
  navigateToUrl: (url: string) => void;
}

export const useUrlState = createWithSignal<UrlState>((set) => ({
  url: "",
  title: "",
  setUrl: (url) => set(() => ({ url })),
  setTitle: (title) => set(() => ({ title })),
  navigateToUrl: (url) => {
    invokeNavigateWebviewUrl(url);
  },
}));
