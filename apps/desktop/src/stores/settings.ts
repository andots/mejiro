import { createWithSignal } from "solid-zustand";

import type { AppSettings, UserSettings } from "../types";

import { Invoke } from "../invokes";
import { useUrlState } from "./url";

interface UserSettingsState {
  settings: UserSettings;
  get: () => Promise<void>;
  update: (values: UserSettings) => Promise<void>;
}

export const useUserSettingsState = createWithSignal<UserSettingsState>((set) => ({
  settings: {
    language: "en",
    theme: "light",
    home_page_url: "https://search.brave.com/",
  },
  get: async () => {
    const settings = await Invoke.GetUserSettings();
    set({ settings });
  },
  update: async (values) => {
    const settings = await Invoke.UpdateUserSettings(values);
    set({ settings });
  },
}));

interface AppSettingsState {
  settings: AppSettings;
  get: () => Promise<void>;
  update: (values: AppSettings) => Promise<void>;
}

export const useAppSettingsState = createWithSignal<AppSettingsState>((set) => ({
  settings: {
    gpu_acceleration_enabled: false,
    incognito: true,
    start_page_url: "https://search.brave.com/",
  },
  get: async () => {
    const settings = await Invoke.GetAppSettings();
    useUrlState.getState().setUrl(settings.start_page_url);
    set({ settings });
  },
  update: async (values) => {
    const settings = await Invoke.UpdateAppSettings(values);
    set({ settings });
  },
}));
