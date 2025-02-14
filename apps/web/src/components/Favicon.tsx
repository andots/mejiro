import type { Component } from "solid-js";

const GSTATIC_URL =
  "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL";

type Props = {
  url: string;
  width: string;
  height: string;
};

const Favicon: Component<Props> = (props) => {
  return (
    <img
      width={props.width}
      height={props.height}
      src={`${GSTATIC_URL}&size=32&url=${props.url}`}
      alt="favicon"
    />
  );
};

export default Favicon;
