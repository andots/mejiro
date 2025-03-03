import { createEffect, createSignal, Show, type Component } from "solid-js";

import { Menu, PredefinedMenuItem } from "@tauri-apps/api/menu";

import { BOOKMARK_NODE_FONT_SIZE } from "../../constants";
import { useBookmarkState } from "../../stores/bookmarks";
import { isDev } from "../../utils";

type Props = {
  index: number;
  title: string;
  width: number;
  isEditing: boolean;
  shouldHighLight: boolean;
  setEditingStatus: (value: boolean) => void;
};

const EditableTitle: Component<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLInputElement | null>(null);
  const [value, setValue] = createSignal<string>(props.title);

  createEffect(() => {
    if (ref()) ref()?.focus();
  });

  const updateBookmarkTitle = useBookmarkState((state) => state.updateBookmarkTitle);
  const setTreeLockState = useBookmarkState((state) => state.setTreeLockState);

  const title = () => (isDev() ? `${props.index} - ${props.title}` : props.title);

  const handleFocus = (e: FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLInputElement;
    target.select();
  };

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
      await updateBookmarkTitle(props.index, value());
    }
    props.setEditingStatus(false);
    setTreeLockState(false);
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
    <>
      <Show when={props.isEditing}>
        <input
          ref={setRef}
          value={value()}
          onFocus={handleFocus}
          onFocusOut={handleFocusOut}
          onInput={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeydown}
          onContextMenu={handleContextMenu}
          style={{
            "font-size": `${BOOKMARK_NODE_FONT_SIZE}px`,
            width: `${props.width}px`,
          }}
          class="flex border bg-background px-1 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        />
      </Show>
      <Show when={!props.isEditing}>
        <div
          class="pl-1 overflow-hidden whitespace-nowrap text-ellipsis"
          style={{
            "font-size": `${BOOKMARK_NODE_FONT_SIZE}px`,
            width: `${props.width}px`,
          }}
          classList={{
            "bg-blue-300": props.shouldHighLight,
          }}
        >
          {title()}
        </div>
      </Show>
    </>
  );
};

export default EditableTitle;
