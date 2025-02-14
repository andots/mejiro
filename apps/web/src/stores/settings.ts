import { createWithSignal } from "solid-zustand";
import { invokeGetSettings } from "../invokes";
import type { UserSettings } from "../types";
import { useUrlState } from "./url";

interface UserSettingsState {
  settings: UserSettings | undefined;
  syncSettings: () => void;
}

export const useSettingsState = createWithSignal<UserSettingsState>((set) => ({
  settings: undefined,
  syncSettings: async () => {
    const settings = await invokeGetSettings();
    const setUrl = useUrlState((state) => state.setUrl);
    setUrl(settings.start_page_url);
    set({ settings });
  },
}));
