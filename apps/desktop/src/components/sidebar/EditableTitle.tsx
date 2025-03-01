import { createSignal, Show, type Component } from "solid-js";

import { autofocus } from "@solid-primitives/autofocus";

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
  const [value, setValue] = createSignal<string>(props.title);

  const updateBookmarkTitle = useBookmarkState((state) => state.updateBookmarkTitle);
  const setTreeLockState = useBookmarkState((state) => state.setTreeLockState);

  const title = () => (isDev() ? `${props.index} - ${props.title}` : props.title);

  const handleFocus = (e: FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLInputElement;
    target.select();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      props.setEditingStatus(false);
      setTreeLockState(false);
      // update title only if it has changed
      if (value() !== props.title) {
        updateBookmarkTitle(props.index, value());
      }
    }
  };

  const handleFocusOut = (e: FocusEvent) => {
    props.setEditingStatus(false);
    setTreeLockState(false);
    // update title only if it has changed
    if (value() !== props.title) {
      updateBookmarkTitle(props.index, value());
    }
  };

  return (
    <>
      <Show when={props.isEditing}>
        <input
          autofocus
          ref={autofocus}
          value={value()}
          onFocus={handleFocus}
          onFocusOut={handleFocusOut}
          onInput={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeydown}
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
