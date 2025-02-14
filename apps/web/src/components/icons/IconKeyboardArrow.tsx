// https://icon-sets.iconify.design/ic/page-2.html?icon-filter=arrow&prefixes=Baseline
const IconKeyboardArrow = (props: { isOpen: boolean }) => (
  <svg
    width="20"
    height="20"
    class="w-[20px]"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <title>ic:baseline-keyboard-arrow-right</title>
    {props.isOpen ? (
      <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z" />
    ) : (
      <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
    )}
  </svg>
);

export default IconKeyboardArrow;
