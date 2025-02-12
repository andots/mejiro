import { createWithSignal } from "solid-zustand";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export type Theme = "light" | "dark" | "system";

export const useThemeState = createWithSignal<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
