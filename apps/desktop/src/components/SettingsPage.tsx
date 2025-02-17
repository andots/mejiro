import { createSignal, For, type Component } from "solid-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Switch, SwitchControl, SwitchThumb } from "@repo/ui/switch";
import { TextField, TextFieldInput } from "@repo/ui/text-field";
import { Button } from "@repo/ui/button";

const SettingsPage: Component = () => {
  const [language, setLanguage] = createSignal("en");
  const [theme, setTheme] = createSignal("light");
  const [gpuAcceleration, setGpuAcceleration] = createSignal(false);
  const [incognito, setIncognito] = createSignal(true);
  const [startPageUrl, setStartPageUrl] = createSignal("https://search.brave.com/");

  return (
    <div class="max-w-2xl m-auto my-4">
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="text-2xl">Settings</CardTitle>
          <CardDescription>Following settings available.</CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          {/* Browser Settings Section */}
          <Card class="w-full p-5">
            <CardTitle class="pb-2 text-base">Webview Settings</CardTitle>
            <CardContent class="p-2 space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <p class="text-md text-muted-foreground">Enable hardware acceleration</p>
                </div>
                <Switch checked={gpuAcceleration()} onChange={setGpuAcceleration}>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                </Switch>
              </div>
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <p class="text-md text-muted-foreground">Incognito mode (Private Browsing)</p>
                </div>
                <Switch checked={incognito()} onChange={setIncognito}>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                </Switch>
              </div>
            </CardContent>
          </Card>

          {/* Start Page Section */}
          <Card class="w-full p-5">
            <CardTitle class="pb-2 text-base">Start Page</CardTitle>
            <CardContent class="p-2 space-y-4">
              <TextField>
                <TextFieldInput
                  type="url"
                  id="start-page-url"
                  placeholder="Start page url"
                  value={startPageUrl()}
                  onChange={(e) => setStartPageUrl(e.currentTarget.value)}
                />
              </TextField>
            </CardContent>
          </Card>

          {/* Pinned URLs Section */}
          <Card class="w-full p-5">
            <CardTitle class="pb-2 text-base">Start Page</CardTitle>
            <CardContent class="p-2 space-y-2">
              <For
                each={[
                  "https://search.brave.com/",
                  "https://docs.rs",
                  "https://crates.io",
                  "https://github.com/search",
                ]}
              >
                {(url) => (
                  <div class="flex items-center justify-between py-2">
                    <span class="text-base truncate">{url}</span>
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                )}
              </For>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
