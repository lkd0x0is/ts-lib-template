# TypeScript Library Monorepo Template

[![Release](https://github.com/lkd0x0is/ts-lib-template/actions/workflows/release.yml/badge.svg)](https://github.com/lkd0x0is/ts-lib-template/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, opinionated template for building, testing, documenting, and publishing modern TypeScript libraries using a pnpm monorepo structure.

**For detailed guides on development, tooling, and contribution, please see our full [Developer Guide](./website/docs/dev-guide/00-overview.md) in the documentation website.**

## Table of Contents

- [TypeScript Library Monorepo Template](#typescript-library-monorepo-template)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Core Features](#core-features)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation \& Setup](#installation--setup)
    - [Verify Setup](#verify-setup)
  - [Key Scripts](#key-scripts)
  - [Development Quick Start](#development-quick-start)
  - [Documentation](#documentation)
  - [Versioning \& Publishing](#versioning--publishing)
  - [CI/CD](#cicd)
  - [Customizing This Template](#customizing-this-template)
  - [Contributing](#contributing)
  - [License](#license)
  - [Feedback](#feedback)

## Overview

This template provides a robust foundation for TypeScript library development within a pnpm-managed monorepo. It integrates a suite of modern tools to streamline your workflow from coding to publishing. An example library (`ts-lib` by default) demonstrates the setup.

For a deeper understanding of the technology choices and project philosophy, refer to the [Template Philosophy & Tech Choices](./website/docs/dev-guide/01-philosophy-tech-choices.md) documentation.

## Core Features

- **Monorepo Management:** Efficiently managed with pnpm Workspaces.
- **Modern Tooling:** TypeScript, Rollup, Vitest, Biome.
- **Documentation:** API Extractor & Docusaurus for comprehensive docs.
- **Release Management:** Changesets for versioning and publishing.
- **Automation:** GitHub Actions for CI/CD and helper scripts for common tasks.

## Project Structure

The main directories and files are:

```text
.
├── .changeset/         # Changeset versioning files
├── .github/            # GitHub Actions workflows, issue/PR templates
├── packages/           # Individual libraries and the template
├── scripts/            # Helper scripts (init-package, create-package)
├── website/            # Docusaurus documentation site
├── .nvmrc              # Node.js version suggestion
├── biome.json          # Biome linter/formatter config
├── package.json        # Root project configuration
├── pnpm-workspace.yaml # pnpm workspace definition
└── tsconfig.base.json  # Base TypeScript configuration
```

For an in-depth look at the structure, see the [Detailed Project Structure Guide](./website/docs/dev-guide/02-project-structure-detailed.md).

## Getting Started

### Prerequisites

- **Node.js:** Version specified in `.nvmrc` (e.g., `>= 22.x`). Use `nvm install && nvm use`.
- **pnpm:** Version specified in `package.json` (e.g., `>= 10.x`). Install via `npm install -g pnpm`.
- **Git:** Recent version.

### Installation & Setup

1. **Fork & Clone** (Recommended): Fork on GitHub, then clone your fork.

    ```bash
    git clone https://github.com/lkd0x0is/ts-lib-template.git
    cd ts-lib-template
    ```

2. **Install Dependencies:**

    ```bash
    pnpm install
    ```

3. **Initialize Project:** Customize the template for your project.

    ```bash
    node scripts/init-package.mjs
    ```

    Follow the prompts. This script updates placeholders and renames the example package.
    After running, review changes (`git diff`), commit, and update any remaining `lkd0x0is/ts-lib-template` placeholders in this README's badges. The script also attempts to update `LICENSE.md`.

    For advanced usage and troubleshooting for `init-package.mjs`, see the [Helper Scripts Guide](./website/docs/dev-guide/03-helper-scripts-advanced.md).

### Verify Setup

Ensure your environment is correctly configured:

```bash
pnpm lint && pnpm build && pnpm test
```

These commands should complete without errors.

## Key Scripts

- `pnpm lint`: Lint and format checks via Biome.
- `pnpm format`: Auto-formats code via Biome.
- `pnpm build`: Builds all packages.
- `pnpm test`: Runs tests for all packages.
- `pnpm changeset`: Start the versioning process for changed packages.
- `pnpm docs:dev`: Run the documentation website locally.
- `node scripts/create-package.mjs`: Scaffold a new package. (See [Helper Scripts Guide](./website/docs/dev-guide/03-helper-scripts-advanced.md))

For a comprehensive list and explanation of all scripts, refer to the [Project Scripts Reference](./website/docs/dev-guide/04-project-scripts-reference.md).

## Development Quick Start

1. Create a new branch (e.g., `feat/my-feature`).
2. Navigate to an existing package (`cd packages/<name>`) or create a new one (`node scripts/create-package.mjs`).
3. Make code changes in `src/`. Add TSDoc comments.
4. Write tests (unit tests co-located, integration tests in `test/`).
5. Run `pnpm --filter <package-name> test` while developing.
6. Before committing: `pnpm format` and `pnpm lint`.
7. Commit using [Conventional Commits](./website/docs/dev-guide/06-commit-conventions.md) (e.g., `feat: add new component`).
8. Push and open a Pull Request.

For more detailed workflows, including branching and code reviews, see the [Development Practices](./website/docs/dev-guide/05-branching-strategy.md) section in our Developer Guide.

## Documentation

Project documentation is built with Docusaurus and includes:

- **Guides & Tutorials:** Manually written in `website/docs/`.
- **API Reference:** Auto-generated from TSDoc comments into `packages/<package-name>/docs-markdown/`.

To view locally: `pnpm docs:dev`

Learn how to write and manage documentation in the [Documentation Development Guide](./website/docs/dev-guide/10-documentation-development.md).

## Versioning & Publishing

Managed by **Changesets** and automated via GitHub Actions.

1. Make changes.
2. Run `pnpm changeset` and follow prompts.
3. Commit the generated changeset file.
4. Merge to `main`. CI will handle versioning and publishing.

For an in-depth guide, see [Versioning with Changesets](./website/docs/dev-guide/11-changesets-in-depth.md).

## CI/CD

GitHub Actions automate:

- **CI Checks:** Lint, test, build on PRs and pushes to `main`.
- **Release:** Versioning and publishing packages to npm on merge to `main` with changesets.
- **Deploy Docs:** Deploys Docusaurus site to GitHub Pages on merge to `main`.

Detailed explanations of workflows are in the [CI/CD Guide](./website/docs/dev-guide/12-ci-cd-explained.md).
Ensure `NPM_TOKEN` secret is set in GitHub repo settings for publishing.

## Customizing This Template

Beyond the `init-package.mjs` script, you can further customize:

- The `packages/template/` for new package scaffolding.
- GitHub Workflows in `.github/workflows/`.
- Biome rules in `biome.json`.
- Set up Dependabot, Issue/PR templates, and `CODEOWNERS`.

For detailed guidance, see [Advanced Template Customization](./website/docs/dev-guide/13-advanced-template-customization.md).

## Contributing

We welcome contributions\! Please read our [Contribution Guidelines](./CONTRIBUTING.md) first.
(The `CONTRIBUTING.md` can be brief and link to more detailed sections in the Docusaurus Developer Guide like [Branching Strategy](./website/docs/dev-guide/05-branching-strategy.md), [Commit Conventions](./website/docs/dev-guide/06-commit-conventions.md), and [Code Review Process](./website/docs/dev-guide/08-code-review-process.md)).

## License

This template is distributed under the MIT License. See `LICENSE.md` for more information.

## Feedback

Encounter issues or have suggestions? Please [open an issue](https://github.com/lkd0x0is/ts-lib-template/issues).
