---
id: project-structure-detailed
title: Detailed Project Structure
sidebar_label: Project Structure
slug: /dev-guide/project-structure-detailed
---

This document provides a more detailed explanation of the project's directory structure and the purpose of key files.

```tree
.
├── .changeset/                # Changeset files for versioning (auto-generated)
├── .github/                   # GitHub specific configurations
│   ├── ISSUE_TEMPLATE/        # Templates for GitHub issues (e.g., bug_report.md)
│   ├── PULL_REQUEST_TEMPLATE.md # Template for pull requests
│   └── workflows/             # GitHub Actions CI/CD workflows (ci-checks.yml, release.yml, deploy-docs.yml)
├── packages/                  # Monorepo packages (libraries, applications)
│   ├── template/              # Boilerplate for new packages (used by scripts/create-package.mjs)
│   │   ├── src/index.ts       # Example source file with placeholders
│   │   ├── package.json       # Template package.json with placeholders
│   │   └── README.md          # Template README with placeholders
│   └── ts-lib/                # Example library package (e.g., ts-lib, renamed by init-package.mjs)
│       ├── src/               # TypeScript source files (e.g., index.ts, module.ts)
│       │   └── __tests__/     # Optional: Directory for unit tests if not co-located
│       ├── test/              # Integration/E2E tests (e.g., main.e2e.test.ts)
│       ├── docs-markdown/     # Auto-generated API docs (markdown) for Docusaurus
│       ├── dist/              # Compiled output (e.g., ESM, CJS, .d.ts files) - gitignored
│       ├── api-extractor.json # Configuration for API Extractor (if used)
│       ├── biome.json         # Optional: Package-specific Biome lint/format overrides
│       ├── package.json       # Package manifest (dependencies, scripts)
│       ├── tsconfig.json      # TypeScript configuration for this package (extends tsconfig.base.json)
│       └── vite.config.ts     # Vitest configuration for this package
├── scripts/                   # Helper Node.js scripts for development tasks
│   ├── init-package.mjs       # Project initialization script (run once after clone)
│   ├── create-package.mjs     # New package scaffolding script
│   └── utilities/             # Shared utility functions for scripts (e.g., log.mjs)
├── website/                   # Docusaurus documentation website source
│   ├── docs/                  # Main documentation markdown files (guides, tutorials)
│   ├── src/                   # Custom React components, pages, and CSS for Docusaurus
│   │   ├── css/custom.css     # Custom CSS overrides
│   │   └── pages/index.tsx    # Docusaurus homepage React component
│   ├── static/                # Static assets (images, favicon)
│   ├── blog/                  # Optional: Blog posts (disabled by default)
│   ├── docusaurus.config.ts   # Main Docusaurus site configuration
│   ├── package.json           # Docusaurus website dependencies
│   ├── sidebars.ts            # Sidebar configuration for main documentation
│   └── sidebarsApi.ts         # Sidebar configuration for each package's API docs (dynamically referenced)
├── .editorconfig              # Optional: Defines coding styles for editors
├── .gitattributes             # Optional: Defines attributes per path for Git
├── .gitignore                 # Specifies intentionally untracked files that Git should ignore
├── .nvmrc                     # Specifies the recommended Node.js version for nvm users
├── biome.json                 # Global Biome (linter/formatter) configuration for the monorepo
├── LICENSE.md                 # Project's license file (MIT by default)
├── package.json               # Root package.json (workspace config, root devDependencies, root scripts)
├── pnpm-lock.yaml             # pnpm lockfile, records exact versions of dependencies
├── pnpm-workspace.yaml        # Defines the locations of packages within the monorepo (e.g., `packages/*`)
├── tsconfig.base.json         # Base TypeScript configuration shared by all packages and the root
└── README.md                  # Main project overview, getting started guide (points here for details)
```

### Key Top-Level Files Explained

- **`.nvmrc`**: Specifies the Node.js version to use with [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm). Run `nvm use` to switch to this version.
- **`biome.json`**: The global configuration file for [BiomeJS](https://biomejs.dev/). It defines formatting rules, linting rules, import sorting, and more for the entire monorepo. Packages can have their own `biome.json` to override or extend these global settings.
- **`package.json` (root)**:
  - Defines workspace information for pnpm.
  - Contains `devDependencies` shared across the monorepo (like TypeScript, Biome, Vitest, pnpm itself).
  - Lists root-level scripts for managing the entire monorepo (e.g., `pnpm build`, `pnpm test`, `pnpm lint`).
  - Specifies the `packageManager` (e.g., `pnpm@10.11.0`).
- **`pnpm-workspace.yaml`**: The pnpm specific file that declares the paths where packages are located (e.g., `packages/*`). This enables pnpm's workspace features.
- **`tsconfig.base.json`**: A base TypeScript configuration file. Individual packages (`packages/<package-name>/tsconfig.json`) typically extend this file to share common compiler options (like `strict: true`, `target`, `moduleResolution`).

### `packages/` Directory

This is where your individual libraries or applications reside.

- **`template/`**: A special directory used by the `scripts/create-package.mjs` script as a blueprint for new packages. Customize this to set the standard structure for your new packages.
- **`ts-lib/`**:
  - **`src/`**: Contains the actual TypeScript source code for the library. Unit tests (`*.unit.test.ts`) are often co-located here or in a `src/__tests__` subdirectory.
  - **`test/`**: For integration or end-to-end tests that might involve multiple modules or external interactions.
  - **`docs-markdown/`**: This directory is where tools like API Extractor + API Documenter (or TypeDoc) output the generated API documentation in Markdown format. Docusaurus consumes these files. This directory is typically `.gitignored` if generated during a build step, or committed if pre-generated.
  - **`dist/`**: The output directory for compiled JavaScript files (e.g., ESM, CJS formats) and TypeScript declaration files (`.d.ts`). This directory is always `.gitignored` as it's a build artifact.
  - **`package.json`**: Defines the package's name, version, dependencies, scripts (e.g., for building and testing this specific package), and publishing configuration.
  - **`tsconfig.json`**: Package-specific TypeScript configuration, extending `../../tsconfig.base.json`.
  - **`vite.config.ts`**: Configuration for Vitest if package-specific test settings are needed.

### `scripts/` Directory

Contains helper scripts for development and project management.

- **`init-package.mjs`**: For initial setup of the cloned template.
- **`create-package.mjs`**: For scaffolding new packages.
- **`utilities/`**: May contain shared Node.js modules used by the other scripts (e.g., a common logging utility).

### `website/` Directory

The source code for your Docusaurus documentation website.

- **`docs/`**: Markdown files for general guides, tutorials, and conceptual documentation.
- **`src/pages/`**: Custom React pages for Docusaurus (e.g., the homepage `index.tsx`).
- **`static/`**: Static assets like images, favicons, etc.
- **`docusaurus.config.ts`**: The main configuration file for your Docusaurus site. This is where you define site metadata, themes, plugins (including the multi-package API docs setup), navbar, footer, etc.
- **`sidebars.ts`**: Defines the sidebar structure for the main documentation found in `website/docs/`.
- **`sidebarsApi.ts`**: Dynamically referenced sidebar files, one for each package whose API documentation is being displayed. These define the sidebar structure for that specific package's API reference.

Understanding this structure will help you navigate the project, contribute effectively, and customize it to your needs.
