
import path from "node:path";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

import {
  GITHUB_USERNAME,
  PROJECT_NAME,
  PROJECT_TITLE,
  PROJECT_TAGLINE,
  getPackagesWithApiDocs,
  generateApiDocsPlugins,
} from "./utils/configUtils";
import logger from "./utils/logger";

logger.info("Starting Docusaurus configuration build...");

// --- Dynamic Configuration Generation ---
const packagesDir = path.resolve(__dirname, "..", "packages");
const apiPackages = getPackagesWithApiDocs(packagesDir);
const apiDocsPlugins = generateApiDocsPlugins(apiPackages, __dirname);

// --- Dynamic Navbar & Footer Items ---
const apiNavbarItems = apiPackages.length > 0
  ? [{
    label: "API Reference",
    position: "left",
    items: apiPackages.map((pkgName) => ({
      label: pkgName,
      to: `/api/${pkgName}`, 
    })),
  } as const]
  : [];
logger.info(`Generated ${apiPackages.length} API Navbar item(s).`);

const apiFooterItems = apiPackages.length > 0
  ? [{ label: "API Reference", to: `/api/${apiPackages[0]}` }]
  : [];
logger.info(`Generated ${apiFooterItems.length} API Footer link(s).`);

// --- Docusaurus Main Configuration ---
const config: Config = {
  title: PROJECT_TITLE,
  tagline: PROJECT_TAGLINE,
  favicon: "img/favicon.ico",

  url: `https://${GITHUB_USERNAME}.github.io`,
  baseUrl: `/${PROJECT_NAME}/`,

  organizationName: GITHUB_USERNAME,
  projectName: PROJECT_NAME,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          path: "docs",
          routeBasePath: "docs",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [...apiDocsPlugins],

  themeConfig: {
    image: "img/social-card.png",
    navbar: {
      title: PROJECT_TITLE,
      logo: {
        alt: `${PROJECT_TITLE} Logo`,
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guidesSidebar",
          position: "left",
          label: "Guides",
        },
        {
          type: "docSidebar",
          sidebarId: "developerGuideSidebar",
          position: "left",
          label: "Dev Guides",
        },
        ...apiNavbarItems,
        {
          href: `https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}`,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [{ label: "Guides", to: "/docs/intro" }, ...apiFooterItems],
        },
        {
          title: "Community",
          items: [{
            label: "GitHub Issues",
            href: `https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}/issues`,
          }],
        },
        {
          title: "More",
          items: [{
            label: "GitHub",
            href: `https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}`,
          }],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ${PROJECT_TITLE}. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["typescript", "javascript", "json", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

logger.info("Docusaurus configuration build finished successfully.");

export default config;