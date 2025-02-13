import { createWithSignal } from "solid-zustand";
import { invokeGetSettings } from "../invokes";
import type { UserSettings } from "../types";

interface UserSettingsState {
  settings: UserSettings | undefined;
  syncSettings: () => void;
  // theme: Theme;
  // toggleTheme: () => void;
}

// export type Theme = "light" | "dark" | "system";

export const useSettingsState = createWithSignal<UserSettingsState>((set) => ({
  settings: undefined,
  syncSettings: async () => {
    const settings = await invokeGetSettings();
    set({ settings });
  },
  // theme: "light",
  // toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
