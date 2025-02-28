import { createSignal, type Component } from "solid-js";

import { RESIZE_HANDLE_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from "../constants";

import { useWindowState } from "../stores/window";
import { observeMouseDrag } from "../libs/observe-mouse-drag";

const SidebarRisizer: Component = () => {
  const setSidebarWidth = useWindowState((state) => state.setSidebarWidth);

  const [isResizing, setIsResizing] = createSignal(false);

  const handleResizerMouseDown = (mouseDownEvent: MouseEvent) => {
    const initialX = mouseDownEvent.clientX;
    const previousDeltaX = initialX;
    observeMouseDrag({
      onMouseMove: (e) => {
        document.body.style.cursor = "col-resize";
        const deltaX = e.clientX - initialX;
        const newWidth = initialX + deltaX;
        if (
          previousDeltaX !== deltaX &&
          newWidth >= SIDEBAR_MIN_WIDTH &&
          newWidth <= SIDEBAR_MAX_WIDTH
        ) {
          setIsResizing(true);
          setSidebarWidth(newWidth);
        }
      },
      onMouseUp: (e) => {
        setIsResizing(false);
        document.body.style.cursor = "auto";
      },
      onClick: (e) => {
        setIsResizing(false);
        document.body.style.cursor = "auto";
      },
    });
  };

  return (
    <div
      id="sidebar-resizer"
      class="cursor-col-resize hover:bg-sidebar-ring transition-colors duration-150"
      style={{ width: `${RESIZE_HANDLE_WIDTH}px` }}
      onMouseDown={handleResizerMouseDown}
      classList={{
        "bg-sidebar-ring": isResizing(),
        "bg-sidebar-accent": !isResizing(),
      }}
    />
  );
};

export default SidebarRisizer;
