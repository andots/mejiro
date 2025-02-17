import { createWithSignal } from "solid-zustand";
import { Invoke } from "../invokes";
import type { UserSettings } from "../types";
import { useUrlState } from "./url";

interface UserSettingsState {
  settings: UserSettings | undefined;
  syncSettings: () => void;
}

export const useSettingsState = createWithSignal<UserSettingsState>((set) => ({
  settings: undefined,
  syncSettings: async () => {
    const settings = await Invoke.GetSettings();
    const setUrl = useUrlState((state) => state.setUrl);
    setUrl(settings.start_page_url);
    set({ settings });
  },
}));
