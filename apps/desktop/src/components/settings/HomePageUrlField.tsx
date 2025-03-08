import { createSignal, type Component } from "solid-js";

import { TextField, TextFieldInput } from "@repo/ui/text-field";
import { Button } from "@repo/ui/button";

import { validateUrl } from "../../utils";
import { useUserSettingsState } from "../../stores/settings";

const HomePageUrlField: Component = () => {
  const useUserSettings = useUserSettingsState();

  const [isUpdating, setIsUpdating] = createSignal(false);
  const [homePageUrl, setHomePageUrl] = createSignal(useUserSettings().home_page_url);

  const handleUpdate = async () => {
    if (validateUrl(homePageUrl())) {
      setIsUpdating(true);
      await useUserSettings().updateHomePageUrl(homePageUrl());
      // wait for 500ms before setting isUpdating to false
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  return (
    <div class="flex flex-row justify-between">
      <TextField class="w-10/12">
        <TextFieldInput
          type="url"
          placeholder="Enter your favorite page url..."
          value={homePageUrl()}
          onInput={(e) => setHomePageUrl(e.currentTarget.value)}
          disabled={isUpdating()}
        />
      </TextField>
      <Button class="w-20" onClick={handleUpdate} disabled={isUpdating()}>
        Update
      </Button>
    </div>
  );
};

export default HomePageUrlField;
