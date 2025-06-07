---
id: project-scripts-reference
title: Project Scripts Reference
sidebar_label: Scripts Reference
slug: /dev-guide/project-scripts-reference
---

This document provides a comprehensive reference for the npm/pnpm scripts defined in the `package.json` files within this monorepo, both at the root level and typically within individual packages.

## Running Scripts

* **Root Scripts:** Run directly from the monorepo root using `pnpm <script-name>`.
  * Example: `pnpm lint`
* **Package-Specific Scripts:** Can be run in two ways:
    1. Navigate to the package directory: `cd packages/<package-name> && pnpm <script-name>`
    2. From the root, using pnpm's `--filter` option: `pnpm --filter <package-name> <script-name>`
        * Example: `pnpm --filter my-lib build`

## Root `package.json` Scripts

These scripts are typically defined in the `package.json` file at the root of the monorepo and operate on all or multiple packages.

### Core Development & Testing

* **`pnpm lint`**
  * **Description:** Checks the entire codebase for linting errors and formatting issues using BiomeJS. This script typically runs Biome in "check" mode.
  * **Usage:** `pnpm lint`

* **`pnpm lint:fix`** or **`pnpm format`**
  * **Description:** Automatically fixes linting errors and reformats code across the entire codebase using BiomeJS. This usually runs Biome in "write" or "fix" mode.
  * **Usage:** `pnpm lint:fix` or `pnpm format`

* **`pnpm typecheck`** or **`pnpm typecheck:all`**
  * **Description:** Runs TypeScript type checking for all packages in the workspace. This often involves invoking `tsc --noEmit` for each package or using a workspace-aware TypeScript solution.
  * **Usage:** `pnpm typecheck`

* **`pnpm build`** or **`pnpm build:all`**
  * **Description:** Builds all library packages within the `packages/` directory. This typically involves compiling TypeScript to JavaScript (e.g., ESM and CJS formats using Rollup or tsc) and generating type declaration files (`.d.ts`).
  * **Usage:** `pnpm build`

* **`pnpm test`** or **`pnpm test:all`**
  * **Description:** Runs all unit and integration tests for all library packages using Vitest.
  * **Usage:** `pnpm test`

* **`pnpm test:watch`** or **`pnpm test:watch:all`**
  * **Description:** Runs all tests in interactive watch mode, recompiling and re-testing on file changes.
  * **Usage:** `pnpm test:watch`

* **`pnpm clean`**
  * **Description:** Cleans build artifacts (e.g., `dist/` folders), caches (e.g., Rollup cache, Vitest cache), and `node_modules` from all packages and the root. This is useful for ensuring a fresh build or resolving caching issues.
  * **Usage:** `pnpm clean`
  * **Note:** Specific `clean` scripts might also exist per package.

### Versioning & Publishing (Changesets)

* **`pnpm changeset`**
  * **Description:** Starts the Changesets interactive CLI. This tool guides you through selecting packages that have changed, specifying the SemVer bump type (patch, minor, major), and writing a summary of the changes. It generates markdown files in the `.changeset/` directory.
  * **Usage:** `pnpm changeset`

* **`pnpm changeset:version`**
  * **Description:** Consumes the markdown files in `.changeset/`, updates the `version` field in the `package.json` of affected packages, and updates their `CHANGELOG.md` files. This command is typically run by the CI/CD pipeline during a release.
  * **Usage:** `pnpm changeset:version`

* **`pnpm changeset:publish`**
  * **Description:** Publishes packages that have new versions (as determined by `changeset version`) to the npm registry. This command is also typically run by the CI/CD pipeline.
  * **Usage:** `pnpm changeset:publish`

* **`pnpm changeset:status`**
  * **Description:** Shows the current status of changesets, including which packages will be released and their new versions if `changeset version` were run. Useful for previewing a release.
  * **Usage:** `pnpm changeset:status`

* **`pnpm release`**
  * **Description:** A composite script often used in CI that orchestrates the full release process. It might include steps like `pnpm build`, `pnpm changeset:version`, and `pnpm changeset:publish`.
  * **Usage:** `pnpm release` (primarily for CI)

### Documentation (Docusaurus)

* **`pnpm docs:dev`**
  * **Description:** Starts the Docusaurus development server for the documentation website, usually found in the `website/` directory. Enables live reloading for documentation changes.
  * **Usage:** `pnpm docs:dev` (Often an alias for `pnpm --filter website start`)

* **`pnpm docs:build`**
  * **Description:** Builds the static Docusaurus documentation website. The output is typically placed in `website/build/`.
  * **Usage:** `pnpm docs:build` (Often an alias for `pnpm --filter website build`)

* **`pnpm docs:generate:api`**
  * **Description:** This is a placeholder for the command(s) needed to generate API documentation markdown from TSDoc comments (e.g., using API Extractor & API Documenter, or TypeDoc).
  * **Important:** The Docusaurus setup is designed for multi-package API docs. This root script might be a wrapper that iterates over packages, or you might need to run API generation per package.
  * **Per-package usage:** `pnpm --filter <package-name> docs:generate:api`
  * Ensure the output directory (e.g., `packages/<package-name>/docs-markdown/`) matches what Docusaurus expects.

* **`pnpm docs:deploy`**
  * **Description:** Deploys the built Docusaurus documentation website (from `website/build/`) to its hosting provider (e.g., GitHub Pages). This is typically handled by the `deploy-docs.yml` GitHub Action.
  * **Usage:** `pnpm docs:deploy` (usually invoked by CI)

## Typical Package-Level Scripts (`packages/<package-name>/package.json`)

Individual packages within the monorepo will also have their own scripts, tailored to their specific needs. Common scripts include:

* **`build`**: Builds only that specific package (e.g., `tsc && rollup -c`).
* **`test`**: Runs tests specifically for that package (e.g., `vitest run`).
* **`test:watch`**: Runs tests for that package in watch mode (e.g., `vitest watch`).
* **`lint`**: Lints only that package's files (e.g., `biome lint .`).
* **`format`**: Formats only that package's files (e.g., `biome format --write .`).
* **`typecheck`**: Runs TypeScript type checking for that package (e.g., `tsc --noEmit -p tsconfig.json`).
* **`clean`**: Cleans build artifacts (`dist/`, `.turbo/`, etc.) specific to that package.
* **`docs:generate:api`**: Generates API documentation markdown specifically for this package.

These package-level scripts are executed by the root-level scripts (e.g., `pnpm build` at the root will trigger the `build` script in each package defined in the workspace).

## Custom Scripts

You can add custom scripts to the root `package.json` or individual package `package.json` files as needed for your project. Remember to document any new root-level scripts that are intended for common developer use.

When adding scripts, consider using tools like `npm-run-all` or `concurrently` if you need to run multiple scripts in parallel or sequentially within a single `pnpm` command, though pnpm's own workspace command execution often handles concurrency well for tasks across multiple packages.
