import type { Component } from "solid-js";

const GSTATIC_URL =
  "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL";

type Props = {
  url: string | undefined | null;
};

const Favicon: Component<Props> = (props) => {
  return (
    <div class="w-6 h-6 flex items-center justify-center">
      <img width="20" height="20" src={`${GSTATIC_URL}&size=32&url=${props.url}`} alt="favicon" />
    </div>
  );
};

export default Favicon;
