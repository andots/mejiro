import { createWithSignal } from "solid-zustand";
import { Invoke } from "../invokes";
import type { AppSettings, UserSettings } from "../types";
import { useUrlState } from "./url";

interface UserSettingsState {
  settings: UserSettings;
  getSettings: () => Promise<void>;
  updateSettings: (values: UserSettings) => Promise<void>;
}

export const useUserSettingsState = createWithSignal<UserSettingsState>((set) => ({
  settings: {
    language: "en",
    theme: "light",
  },
  getSettings: async () => {
    const settings = await Invoke.GetUserSettings();
    set({ settings });
  },
  updateSettings: async (values) => {
    const settings = await Invoke.UpdateUserSettings(values);
    set({ settings });
  },
}));

interface AppSettingsState {
  settings: AppSettings;
  getSettings: () => Promise<void>;
  updateSettings: (values: AppSettings) => Promise<void>;
}

export const useAppSettingsState = createWithSignal<AppSettingsState>((set) => ({
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
