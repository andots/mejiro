import { createWithSignal } from "solid-zustand";

import type { AppSettings, UserSettings } from "../types";

import { Invoke } from "../invokes";
import { useUrlState } from "./url";

interface UserSettingsState {
  language: string;
  theme: string;
  home_page_url: string;
  sidebar_font_size: number;
  get: () => Promise<void>;
  updateHomePageUrl: (value: string) => Promise<void>;
  updateSidebarFontSize: (value: number) => Promise<void>;
}

export const useUserSettingsState = createWithSignal<UserSettingsState>((set, get) => ({
  language: "en",
  theme: "light",
  home_page_url: "https://search.brave.com/",
  sidebar_font_size: 13.0,
  get: async () => {
    const result = await Invoke.GetUserSettings();
    set({ ...result });
  },
  updateHomePageUrl: async (value) => {
    const result = await Invoke.UpdateUserSettings({
      language: get().language,
      theme: get().theme,
      sidebar_font_size: get().sidebar_font_size,
      home_page_url: value,
    });
    set({ ...result });
  },
  updateSidebarFontSize: async (value) => {
    const result = await Invoke.UpdateUserSettings({
      language: get().language,
      theme: get().theme,
      sidebar_font_size: value,
      home_page_url: get().home_page_url,
    });
    set({ ...result });
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
