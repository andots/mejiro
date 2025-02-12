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
  // TODO: Replace this with the user defined default URL
  url: "https://docs.rs/",
  title: "Docs.rs",
  setUrl: (url) => set(() => ({ url })),
  setTitle: (title) => set(() => ({ title })),
  navigateToUrl: (url) => {
    invokeNavigateWebviewUrl(url);
  },
}));
