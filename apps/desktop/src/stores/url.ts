import { createWithSignal } from "solid-zustand";
import { Invoke } from "../invokes";

interface UrlState {
  url: string;
  title: string;
  progress: number;
  setUrl: (url: string) => void;
  setTitle: (title: string) => void;
  setProgress: (progress: number) => void;
  navigateToUrl: (url: string) => void;
}

export const useUrlState = createWithSignal<UrlState>((set) => ({
  url: "",
  title: "",
  progress: 0,
  setUrl: (url) => set(() => ({ url })),
  setTitle: (title) => set(() => ({ title })),
  setProgress: (progress) => set(() => ({ progress })),
  navigateToUrl: (url) => {
    Invoke.NavigateWebviewUrl(url);
  },
}));
