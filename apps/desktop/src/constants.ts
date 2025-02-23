export const ICON_SIZE = {
  SMALL: "22",
  NORMAL: "24",
  MEDIUM: "26",
  LARGE: "28",
} as const;

export const ROUTES = {
  HOME: "/",
} as const;

//! Must sync events.rs
export const AppEvent = {
  SettingsUpdated: "app://settings-updated",
  ExternalPageLoaded: "app://external-page-loaded",
  ExternalNavigation: "app://external-navigation",
  ExternalTitleChanged: "app://external-title-changed",
};

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
