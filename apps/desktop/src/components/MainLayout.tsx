import type { Component } from "solid-js";

import { HEADER_HEIGHT } from "../constants";

import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./Sidebar";
import SidebarRisizer from "./SidebarResizer";

const MainLayout: Component = () => {
  return (
    <div class="flex flex-row" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <Sidebar />
      <SidebarRisizer />

      {/* Empty area */}
      <div class="w-full overflow-y-auto">
        <SettingsPage />
      </div>
    </div>
  );
};

export default MainLayout;
