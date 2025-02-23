import { createWithSignal } from "solid-zustand";
import { Invoke } from "../invokes";
import type { UserSettings } from "../types";
import { useUrlState } from "./url";

interface UserSettingsState {
  settings: UserSettings;
  getSettings: () => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
}

export const useSettingsState = createWithSignal<UserSettingsState>((set) => ({
  //! Must sync default values with settings.rs
  settings: {
    language: "en",
    theme: "light",
    gpu_acceleration_enabled: false,
    incognito: true,
    start_page_url: "https://search.brave.com/",
  },
  getSettings: async () => {
    const settings = await Invoke.GetSettings();
    const setUrl = useUrlState((state) => state.setUrl);
    setUrl(settings.start_page_url);
    set({ settings });
  },
  updateSettings: async (settings) => {
    const data = await Invoke.UpdateSettings(settings);
    set({ settings: data });
  },
}));
