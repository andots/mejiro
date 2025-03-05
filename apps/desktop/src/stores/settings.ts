import { createWithSignal } from "solid-zustand";
import { Invoke } from "../invokes";
import type { AppSettings, UserSettings } from "../types";
import { useUrlState } from "./url";

interface UserSettingsState {
  settings: UserSettings;
  getSettings: () => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
}

export const useUserSettingsState = createWithSignal<UserSettingsState>((set) => ({
  //! Must sync default values with settings.rs
  settings: {
    language: "en",
    theme: "light",
  },
  getSettings: async () => {
    const settings = await Invoke.GetSettings();
    set({ settings });
  },
  updateSettings: async (settings) => {
    const data = await Invoke.UpdateSettings(settings);
    set({ settings: data });
  },
}));

interface AppSettingsState {
  settings: AppSettings;
  getSettings: () => Promise<void>;
  updateSettings: (values: AppSettings) => Promise<void>;
}

export const useAppSettingsState = createWithSignal<AppSettingsState>((set) => ({
  //! Must sync default values with settings.rs
  settings: {
    gpu_acceleration_enabled: false,
    incognito: true,
    start_page_url: "https://search.brave.com/",
  },
  getSettings: async () => {
    const settings = await Invoke.GetAppSettings();
    useUrlState.getState().setUrl(settings.start_page_url);
    set({ settings });
  },
  updateSettings: async (values) => {
    const settings = await Invoke.UpdateAppSettings(values);
    set({ settings });
  },
}));
