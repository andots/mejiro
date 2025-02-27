export const HEADER_HEIGHT = 40;
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 600;

export const BOOKMARK_NODE_FONT_SIZE = 13;
export const INDICATOR_WIDTH = "100px";
export const INDICATOR_HEIGHT = "4px";
export const BLOCK_SIZE = 18;
export const BLOCK_SIZE_PX = `${BLOCK_SIZE}px`;
export const RESIZE_HANDLE_WIDTH = 4;
export const SELECT_BOX_WIDTH = "180px";

export const ROUTES = {
  HOME: "/",
} as const;

type Site = {
  title: string;
  url: string;
};

type RecommendedSites = {
  name: string;
  sites: Site[];
};

export const RecommendedSites: RecommendedSites[] = [
  {
    name: "Search",
    sites: [
      {
        title: "Brave Search",
        url: "https://search.brave.com",
      },
      {
        title: "DuckDuckGo",
        url: "https://www.duckduckgo.com",
      },
      {
        title: "GiHub Search",
        url: "https://github.com/search",
      },
      {
        title: "Google",
        url: "https://www.google.com",
      },
      {
        title: "Bing",
        url: "https://www.bing.com",
      },
      {
        title: "Wikipedia",
        url: "https://www.wikipedia.org",
      },
    ],
  },
  {
    name: "Services",
    sites: [
      {
        title: "GitHub",
        url: "https://github.com",
      },
      {
        title: "GitLab",
        url: "https://gitlab.com",
      },
      {
        title: "Vercel",
        url: "https://vercel.com",
      },
      {
        title: "Netlify",
        url: "https://www.netlify.com",
      },
      {
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
      },
    ],
  },
  {
    name: "Rust",
    sites: [
      {
        title: "Docs.rs",
        url: "https://docs.rs",
      },
      {
        title: "Crates.io",
        url: "https://crates.io",
      },
      {
        title: "Rust Documentation",
        url: "https://doc.rust-lang.org",
      },
      {
        title: "Rust Book",
        url: "https://doc.rust-lang.org/book",
      },
      {
        title: "Rust By Example",
        url: "https://doc.rust-lang.org/stable/rust-by-example",
      },
    ],
  },
  {
    name: "TypeScript / Javascript",
    sites: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
      },
      {
        title: "NPM",
        url: "https://www.npmjs.com",
      },
      {
        title: "SolidJS",
        url: "https://docs.solidjs.com",
      },
      {
        title: "React",
        url: "https://reactjs.org",
      },
      {
        title: "Vue",
        url: "https://vuejs.org",
      },
      {
        title: "Svelte",
        url: "https://svelte.dev",
      },
    ],
  },
  {
    name: "Design",
    sites: [
      {
        title: "Tailwind CSS",
        url: "https://tailwindcss.com",
      },
      {
        title: "Figma",
        url: "https://www.figma.com",
      },
    ],
  },
];
