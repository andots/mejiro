import { createEffect, createSignal, Match, Switch, type Component } from "solid-js";

import { Menu, PredefinedMenuItem } from "@tauri-apps/api/menu";

import { useBookmarkState } from "../../stores/bookmarks";
import { isDev } from "../../utils";

type Props = {
  index: number;
  title: string;
  width: number;
  fontSize: number;
  isEditing: boolean;
};

const EditableTitle: Component<Props> = (props) => {
  const useBookmark = useBookmarkState();

  const [ref, setRef] = createSignal<HTMLInputElement | null>(null);
  const [value, setValue] = createSignal<string>("");

  const title = () => (isDev() ? `${props.index} - ${props.title}` : props.title);

  // set the value to the title when editing starts
  createEffect(() => {
    setValue(props.title);
  });

  // focus the input element when editing starts
  createEffect(() => {
    if (ref()) {
      ref()?.focus();
      ref()?.select();
    }
  });

  const handleKeydown = async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      // To prevent updating twice, just focus out(blur) here.
      // The title will be updated on handleFocusOut
      if (ref()) ref()?.blur();
    }
  };

  const handleFocusOut = async (e: FocusEvent) => {
    // update title only if it has changed
    if (value() !== props.title) {
      await useBookmark().updateBookmarkTitle(props.index, value());
    }
    useBookmark().setTreeLockState(false);
    useBookmark().setEditingIndex(null);
  };

  const handleContextMenu = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const copy = await PredefinedMenuItem.new({ item: "Copy" });
    const paste = await PredefinedMenuItem.new({ item: "Paste" });
    const cut = await PredefinedMenuItem.new({ item: "Cut" });
    const menu = await Menu.new({
      items: [copy, paste, cut],
    });
    await menu.popup();
  };

  return (
    <Switch>
      <Match when={props.isEditing}>
        <input
          type="text"
          ref={setRef}
          value={value()}
          onFocusOut={handleFocusOut}
          onInput={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeydown}
          onContextMenu={handleContextMenu}
          style={{
            "font-size": `${props.fontSize}px`,
            width: `${props.width}px`,
          }}
          class="flex border bg-background mx-1 px-1 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
        />
      </Match>
      <Match when={!props.isEditing}>
        <div
          class="pl-1 overflow-hidden whitespace-nowrap text-ellipsis"
          style={{
            "font-size": `${props.fontSize}px`,
            width: `${props.width}px`,
          }}
        >
          {title()}
        </div>
      </Match>
    </Switch>
  );
};

export default EditableTitle;
