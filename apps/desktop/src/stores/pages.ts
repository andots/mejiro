import { createWithSignal } from "solid-zustand";

type Page = "dashboard" | "settings";

interface PageState {
  page: Page;
  setPage: (page: Page) => void;
}

export const usePageState = createWithSignal<PageState>((set) => ({
  page: "dashboard",
  setPage: (page) => set({ page }),
}));
