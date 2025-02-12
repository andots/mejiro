import sharedConfig from "@repo/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "content"> = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "../packages/ui/src/**/*.{html,js,jsx,md,mdx,ts,tsx}",
  ],
  ...sharedConfig,
};

export default config;
