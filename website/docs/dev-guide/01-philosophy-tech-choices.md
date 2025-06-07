---
id: philosophy-tech-choices
title: Philosophy & Technology Choices
sidebar_label: Tech Choices
slug: /dev-guide/philosophy-tech-choices
---

This template is built upon a set of core philosophies and carefully selected technologies to provide a modern, efficient, and maintainable development experience for TypeScript libraries within a monorepo.

## Core Philosophies

* **Developer Experience (DX):** Prioritize tools and workflows that are intuitive, fast, and reduce boilerplate.
* **Automation:** Automate repetitive tasks like linting, formatting, testing, versioning, and publishing.
* **Consistency:** Ensure a consistent structure and tooling across all packages within the monorepo.
* **Type Safety:** Leverage TypeScript to its full potential for robust and maintainable code.
* **Modern Standards:** Embrace modern JavaScript/TypeScript features and best practices.
* **Maintainability:** Choose tools and practices that support long-term project health and ease of updates.

## Technology Choices & Rationale

Here's a breakdown of the key technologies used in this template and why they were selected:

* **pnpm Workspaces:**
  * **Why:** For monorepo management, pnpm offers significant advantages in terms of disk space efficiency (via a content-addressable store and symlinks/hardlinks), installation speed, and stricter dependency resolution (helps prevent phantom dependencies and doppelgangers).
  * *Alternatives considered: Yarn Workspaces, npm Workspaces, Lerna.*

* **TypeScript:**
  * **Why:** Essential for building scalable and maintainable JavaScript applications and libraries. Its static typing catches errors early, improves code readability, and enables better tooling and refactoring.
  * *This is a core, non-negotiable part of the template.*

* **Rollup:**
  * **Why:** For bundling libraries, Rollup excels at creating optimized, tree-shaken bundles in multiple formats (ESM, CJS). It's generally preferred over Webpack for library development due to its focus on flat, efficient output.
  * *Alternatives considered: Webpack, esbuild (esbuild is faster but Rollup has a more mature plugin ecosystem for complex library bundling needs).*

* **Vitest:**
  * **Why:** A modern, fast, and ESM-first testing framework built on top of Vite. It offers near-instant startup times, a Jest-compatible API for easy adoption, and excellent TypeScript/JSX support out-of-the-box.
  * *Alternatives considered: Jest (can be slower, more complex configuration for ESM/TypeScript), Mocha, Jasmine.*

* **BiomeJS:**
  * **Why:** An extremely fast, all-in-one toolchain for the web, providing linting, formatting, import sorting, and more. It's written in Rust and designed for performance. Its unified nature simplifies configuration and reduces the number of development dependencies compared to using ESLint, Prettier, and other separate tools.
  * *Alternatives considered: ESLint + Prettier + various plugins (more configuration, potentially slower, more dependencies).*

* **API Extractor & API Documenter:**
  * **Why:** Microsoft's tooling for generating API documentation and reports from TSDoc comments. API Extractor analyzes the exported API surface, creates `.d.ts` rollups, and generates an API model file. API Documenter then converts this model into markdown files suitable for documentation sites. This provides a robust way to ensure API consistency.
  * *Alternatives considered: TypeDoc (another excellent tool, often simpler for direct markdown generation but API Extractor offers more control over API reports and `d.ts` bundling).*

* **Docusaurus:**
  * **Why:** A static site generator optimized for creating beautiful, content-rich documentation websites. It supports versioning, MDX (Markdown + JSX), search (e.g., Algolia), i18n, and has a rich plugin ecosystem. It integrates well with React.
  * *Alternatives considered: VitePress, Nextra, Docsify, MkDocs.*

* **Changesets:**
  * **Why:** A tool for managing versioning, changelog generation, and publishing in monorepos (and single packages). It enforces that changes are documented with intent (patch, minor, major) and automates the release process effectively.
  * *Alternatives considered: Lerna (in versioning mode, though now often used with Changesets), manual versioning.*

* **GitHub Actions:**
  * **Why:** For CI/CD automation directly within GitHub. It's tightly integrated with GitHub repositories, offers a generous free tier for public projects, and has a vast marketplace of actions.
  * *Alternatives considered: GitLab CI, Jenkins, CircleCI, Travis CI.*

This stack is opinionated but chosen to provide a productive and high-quality development environment. While individual tools can sometimes be swapped, the template is designed around their synergies.
