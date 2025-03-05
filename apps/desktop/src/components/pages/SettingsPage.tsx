import { createSignal, For, type Component } from "solid-js";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Switch, SwitchControl, SwitchThumb } from "@repo/ui/switch";
import { TextField, TextFieldInput } from "@repo/ui/text-field";
import { Button } from "@repo/ui/button";
import { useAppSettingsState, useUserSettingsState } from "../../stores/settings";
import { validateUrl } from "../../utils";
import { RecommendedSites } from "../../constants";
import Favicon from "../icons/Favicon";
import { useBookmarkState } from "../../stores/bookmarks";

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";

const SettingsPage: Component = () => {
  const useBookmark = useBookmarkState();

  // App Settings
  const useAppSettings = useAppSettingsState();
  const appSettings = useAppSettingsState((state) => state.settings);
  const [gpuAcceleration, setGpuAcceleration] = createSignal(
    appSettings().gpu_acceleration_enabled,
  );
  const [incognito, setIncognito] = createSignal(appSettings().incognito);

  // User Settings
  const useUserSettings = useUserSettingsState();
  const userSettings = useUserSettingsState((state) => state.settings);
  const [homePageUrl, setHomePageUrl] = createSignal(userSettings().home_page_url);
  // const [language, setLanguage] = createSignal(settings().language);
  // const [theme, setTheme] = createSignal(settings().theme);

  const [isUpdating, setIsUpdating] = createSignal(false);

  const handleGpuAccelerationChange = (value: boolean) => {
    setGpuAcceleration(value);
    useAppSettings().updateSettings({ ...appSettings(), gpu_acceleration_enabled: value });
  };

  const handleIncognitoChange = (value: boolean) => {
    setIncognito(value);
    useAppSettings().updateSettings({ ...appSettings(), incognito: value });
  };

  const handleHomePageUrlUpdate = async () => {
    if (validateUrl(homePageUrl())) {
      setIsUpdating(true);
      await useUserSettings().updateSettings({ ...userSettings(), home_page_url: homePageUrl() });
      // wait for 500ms before setting isUpdating to false
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  const handleAppendBookmarkToToolbar = async (title: string, url: string) => {
    useBookmark().appendBookmarkToToolbar(title, url);
  };

  return (
    <div class="max-w-2xl mx-auto my-4">
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="text-2xl">Settings</CardTitle>
          <CardDescription>Following settings are available.</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          {/* Browser Settings Section */}
          <Card class="w-full p-5">
            <CardTitle class="pb-2 text-base">Browser Settings</CardTitle>
            <CardDescription class="mb-2">
              These settings require restarting the application.
            </CardDescription>
            <CardContent class="p-2 space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <p class="text-md text-muted-foreground">Enable hardware acceleration</p>
                </div>
                <Switch
                  checked={gpuAcceleration()}
                  onChange={(value) => handleGpuAccelerationChange(value)}
                >
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                </Switch>
              </div>
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <p class="text-md text-muted-foreground">Incognito mode (Private Browsing)</p>
                </div>
                <Switch checked={incognito()} onChange={(value) => handleIncognitoChange(value)}>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                </Switch>
              </div>
            </CardContent>
          </Card>

          {/* Home Page Section */}
          <Card class="w-full p-5">
            <CardTitle class="pb-2 text-base">Home Page URL</CardTitle>
            <CardDescription class="mb-2">
              Set your favorite page to be displayed when the home button is clicked.
            </CardDescription>
            <CardContent class="flex flex-row justify-between items-center p-2 space-x-3">
              <TextField class="w-10/12">
                <TextFieldInput
                  type="url"
                  placeholder="Enter your favorite page url..."
                  value={homePageUrl()}
                  onInput={(e) => setHomePageUrl(e.currentTarget.value)}
                />
              </TextField>
              <Button class="w-20" onClick={handleHomePageUrlUpdate} disabled={isUpdating()}>
                Update
              </Button>
            </CardContent>
          </Card>

          {/* Toolbar Recommend */}
          <Card class="w-full p-5">
            <CardTitle class="pb-2 text-base">Toolbar Settings</CardTitle>
            <CardDescription class="mb-2">
              <p>
                If there is a <span class="font-bold">"Toolbar"</span> folder in the root directory
                and you place bookmarks in that folder, those bookmarks will automatically be pinned
                to the Toolbar as Quick Navigation Favicons. You can easily add bookmarks to the{" "}
                <span class="font-bold">"Toolbar"</span> by selecting below our recommended sites.
              </p>
            </CardDescription>
            <CardContent class="flex flex-col w-full p-2 space-y-4">
              <For each={RecommendedSites}>
                {({ name, sites }) => {
                  return (
                    <div class="w-full space-y-2">
                      <h4 class="border-b-2">{name}</h4>
                      <div class="flex flex-row flex-wrap pt-1">
                        <For each={sites}>
                          {({ title, url }) => {
                            return (
                              <Button
                                variant="outline"
                                size="sm"
                                class="mb-2 mr-2"
                                onClick={() => handleAppendBookmarkToToolbar(title, url)}
                              >
                                <Favicon url={url} width={"20px"} height={"20px"} />
                                {title}
                              </Button>
                            );
                          }}
                        </For>
                      </div>
                    </div>
                  );
                }}
              </For>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
