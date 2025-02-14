import type { Component } from "solid-js";

type Props = {
  isOpen: boolean;
};

// https://icon-sets.iconify.design/ic/page-2.html?icon-filter=folder
const IconFolder: Component<Props> = (props) => (
  <svg
    width="20"
    height="20"
    class="w-[20px]"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title>ic:folder</title>
    {props.isOpen ? (
      <path
        fill="currentColor"
        d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m0 12H4V8h16z"
      />
    ) : (
      <path
        fill="currentColor"
        d="m9.17 6l2 2H20v10H4V6zM10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8z"
      />
    )}
  </svg>
);

export default IconFolder;
