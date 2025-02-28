import type { Component } from "solid-js";

import LoadingBar from "@repo/top-loading-bar/index";
import { useUrlState } from "../stores/url";

const PageLoadingBar: Component = () => {
  const progress = useUrlState((state) => state.progress);
  const setProgress = useUrlState((state) => state.setProgress);

  return (
    <LoadingBar
      color="#8ec5ff"
      progress={progress()}
      onLoaderFinished={() => setProgress(0)}
      transitionTime={300}
      loaderSpeed={500}
      height={4}
    />
  );
};

export default PageLoadingBar;
