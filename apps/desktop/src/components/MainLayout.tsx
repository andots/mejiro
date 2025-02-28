import { createSignal, type Component } from "solid-js";

import {
  HEADER_HEIGHT,
  RESIZE_HANDLE_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from "../constants";
import { observeMouseDrag } from "../libs/observe-mouse-drag";
import { useWindowState } from "../stores/window";

import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./Sidebar";

const MainLayout: Component = () => {
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
    <div class="flex flex-row" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <Sidebar />

      {/* Resizer */}
      <div
        class="cursor-col-resize hover:bg-sidebar-ring transition-colors duration-150"
        style={{ width: `${RESIZE_HANDLE_WIDTH}px` }}
        onMouseDown={handleResizerMouseDown}
        classList={{
          "bg-sidebar-ring": isResizing(),
          "bg-sidebar-accent": !isResizing(),
        }}
      />

      {/* Empty area */}
      <div class="w-full overflow-y-auto">
        <SettingsPage />
      </div>
    </div>
  );
};

export default MainLayout;
