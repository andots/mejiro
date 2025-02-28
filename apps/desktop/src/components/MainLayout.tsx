import type { Component } from "solid-js";

import { HEADER_HEIGHT } from "../constants";

import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./Sidebar";
import Resizer from "./Resizer";

const MainLayout: Component = () => {
  return (
    <div class="flex flex-row" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
      <Sidebar />
      <Resizer />

      {/* Empty area */}
      <div class="w-full overflow-y-auto">
        <SettingsPage />
      </div>
    </div>
  );
};

export default MainLayout;
