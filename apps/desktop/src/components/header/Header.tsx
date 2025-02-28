import type { Component } from "solid-js";

import LoadingBar from "@repo/top-loading-bar/index";

import { HEADER_HEIGHT } from "../../constants";
import { useUrlState } from "../../stores/url";
import ToolBar from "./ToolBar";

const Header: Component = () => {
  const progress = useUrlState((state) => state.progress);
  const setProgress = useUrlState((state) => state.setProgress);

  return (
    <div
      style={{ height: `${HEADER_HEIGHT}px` }}
      class="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <LoadingBar
        color="#8ec5ff"
        progress={progress()}
        onLoaderFinished={() => setProgress(0)}
        transitionTime={300}
        loaderSpeed={500}
        height={4}
      />
      <ToolBar />
    </div>
  );
};

export default Header;
