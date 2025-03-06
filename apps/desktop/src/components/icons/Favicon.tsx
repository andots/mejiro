import type { Component } from "solid-js";
import { FAVICON_SERVER } from "../../constants";

type Props = {
  url: string;
  width: string | number;
  height: string | number;
};

const Favicon: Component<Props> = (props) => {
  return (
    <img
      width={props.width}
      height={props.height}
      src={`${FAVICON_SERVER}/favicon?url=${props.url}`}
      alt="favicon"
    />
  );
};

export default Favicon;
