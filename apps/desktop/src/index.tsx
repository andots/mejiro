/* @refresh reload */
import { render } from "solid-js/web";

import App from "./components/App";
import "./globals.css";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const initApp = async () => {
  console.log("Initializing app before rendering...");
};

initApp().then(() => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  render(() => <App />, root!);
});
