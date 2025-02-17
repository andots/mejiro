import { createWithSignal } from "solid-zustand";

type Page = "home" | "settings";

interface PageState {
  page: Page;
  setPage: (page: Page) => void;
}

export const usePageState = createWithSignal<PageState>((set) => ({
  page: "home",
  setPage: (page) => set({ page }),
}));
