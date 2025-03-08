import { createSignal, type Component } from "solid-js";

import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
} from "@repo/ui/number-field";
import { useUserSettingsState } from "../../stores/settings";

const SidebarFontSizeField: Component = () => {
  const useUserSettings = useUserSettingsState();
  const [rawValue, setRawValue] = createSignal<number>();

  const handleOnChange = () => {
    const value = rawValue();
    if (value) useUserSettings().updateSidebarFontSize(value);
  };

  return (
    <div class="flex items-center justify-between">
      <div class="space-y-0.5">
        <p class="text-md text-muted-foreground">Sidebar font size (in pixel)</p>
      </div>
      <NumberField
        class="flex flex-col w-20"
        minValue={10.0}
        maxValue={20.0}
        step={0.5}
        formatOptions={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        value={useUserSettings().sidebar_font_size}
        onChange={handleOnChange}
        rawValue={rawValue()}
        onRawValueChange={setRawValue}
        readOnly={true}
        // validationState={rawValue() !== 40 ? "invalid" : "valid"}
      >
        <NumberFieldGroup>
          <NumberFieldInput />
          <NumberFieldIncrementTrigger />
          <NumberFieldDecrementTrigger />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
};

export default SidebarFontSizeField;
