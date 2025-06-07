---
id: documentation-development
title: Documentation Development Guide
sidebar_label: Writing Documentation
slug: /dev-guide/documentation-development
---

Effective documentation is key to a successful project. This guide covers how to write, structure, and manage documentation for this project using [Docusaurus](https://docusaurus.io/).

The documentation is split into two main categories:

1. **General Guides & Tutorials:** Conceptual explanations, usage guides, tutorials, and development practices (like this Developer Guide itself).
2. **API Reference:** Automatically generated documentation from TSDoc comments in the source code of each package.

All documentation source files are located within the `website/` directory.

## General Guides & Tutorials

These are manually written Markdown files that reside primarily in the `website/docs/` directory.

### Creating a New Document

1. **Create a Markdown File:** Add a new `.md` or `.mdx` (for React components within Markdown) file in the appropriate subdirectory of `website/docs/`. For example, to add a new tutorial:

    ```bash
    touch website/docs/tutorials/my-new-tutorial.md
    ```

2. **Add Frontmatter:** At the top of your Markdown file, include Docusaurus frontmatter to define its ID, title, and sidebar label:

    ```markdown
    ---
    id: my-new-tutorial # Unique ID for this document
    title: My New Awesome Tutorial
    sidebar_label: New Tutorial
    slug: /tutorials/my-new-tutorial # Optional: custom URL slug
    ---

    Your tutorial content starts here...
    ```

    * `id`: A unique identifier for the doc. Often the filename without the extension.
    * `title`: The main title of the document, displayed on the page.
    * `sidebar_label`: The text displayed in the sidebar for this document.
    * `slug` (Optional): Customize the URL path. If omitted, it's derived from the file path.

3. **Write Content:** Use standard Markdown. You can also leverage Docusaurus-specific features like [admonitions](https://docusaurus.io/docs/markdown-features/admonitions) (notes, tips, warnings), [tabs](https://docusaurus.io/docs/markdown-features/tabs), and [MDX](https://docusaurus.io/docs/markdown-features/react) for embedding React components.

### Adding to a Sidebar

To make your new document accessible, you need to add it to a sidebar. Sidebars are configured in `website/sidebars.ts`.

1. **Open `website/sidebars.ts`**.
2. Find the relevant sidebar (e.g., `guidesSidebar`, `developerGuideSidebar`).
3. Add an entry for your new document. You can reference it by its `id` (from the frontmatter) or by its relative path from the `website/docs/` directory (without the extension).

    ```typescript
    // website/sidebars.ts
    import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

    const sidebars: SidebarsConfig = {
      guidesSidebar: [
        'intro', // Refers to intro.md (or a file with id: intro)
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            'tutorials/existing-tutorial',
            'tutorials/my-new-tutorial', // Added new tutorial (id: my-new-tutorial)
          ],
        },
      ],
      // ... other sidebars like developerGuideSidebar
    };

    export default sidebars;
    ```

### Custom Pages

For pages that require more complex layouts or React components (like the homepage), you can create them in `website/src/pages/`. These are typically `.js`, `.jsx`, `.ts`, or `.tsx` files. See the [Docusaurus Pages documentation](https://docusaurus.io/docs/creating-pages) for more details.

## API Reference Documentation

API reference documentation is automatically generated from TSDoc comments in the TypeScript source code of each package.

### Workflow for API Docs

1. **Write TSDoc Comments:** Document all exported functions, classes, types, interfaces, and methods in your package's `src/**/*.ts` files using [TSDoc](https://tsdoc.org/) syntax.

    ```typescript
    /**
     * Adds two numbers.
     * @param a - The first number.
     * @param b - The second number.
     * @returns The sum of `a` and `b`.
     * @remarks
     * This is a simple addition function.
     * @example
     * ```ts
     * add(2, 3) // returns 5
     * ```
     * @public
     */
    export function add(a: number, b: number): number {
      return a + b;
    }
    ```

2. **Generate API Markdown:** Use the configured API documentation tool (e.g., API Extractor + API Documenter, or TypeDoc with `typedoc-plugin-markdown`) to process the TSDoc comments and generate Markdown files. This is typically done via a script in each package:

    ```bash
    pnpm --filter <package-name> docs:generate:api
    ```

    This script should output the Markdown files into the `packages/<package-name>/docs-markdown/` directory.

3. **Docusaurus Integration:**
    * The `website/docusaurus.config.ts` file is configured to dynamically create a Docusaurus documentation plugin instance for each package that has a `docs-markdown` folder.
    * Each instance has its own `routeBasePath` (e.g., `/api/<package-name>`) and `sidebarPath`.

4. **API Sidebars:**
    * For each package `my-lib` with API docs, you need a corresponding sidebar configuration file in the `website/` directory, conventionally named `sidebarsApi.my-lib.ts`.
    * This file defines the sidebar structure for that package's API reference. Often, an autogenerated sidebar is sufficient:

        ```typescript
        // website/sidebarsApi.my-lib.ts
        import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

        const sidebars: SidebarsConfig = {
          // The key here (e.g., 'apiReferenceSidebar') must match the 'sidebarId'
          // used in docusaurus.config.ts for this package's navbar/footer link.
          apiReferenceSidebar: [
            {
              type: 'autogenerated',
              dirName: '.', // Autogenerates from the root of 'packages/my-lib/docs-markdown/'
            },
          ],
        };
        export default sidebars;
        ```

    * Ensure the `index.md` (or a similar entry point file) is generated by your API tool in the `docs-markdown` root for each package to serve as the landing page for that API section. Your API tool might also generate `_category_.json` files to help Docusaurus with autogenerated sidebar labels and ordering.

## Viewing Documentation Locally

To preview your documentation changes (both guides and API reference) locally:

1. Ensure any API markdown is up-to-date by running the relevant `docs:generate:api` script(s).
2. Start the Docusaurus development server from the **monorepo root**:

    ```bash
    pnpm docs:dev
    ```

    This usually opens the site at `http://localhost:3000` and provides live reloading.

## Versioned Documentation

Maintaining documentation for different versions of your libraries is crucial as they evolve. Docusaurus provides a [versioning system](https://docusaurus.io/docs/versioning).

### Basic Versioning Workflow (If Implemented)

1. **Create a New Version:** When you are ready to cut a new version of your documentation (e.g., when releasing a new library version with significant changes):

    ```bash
    # Run from the 'website/' directory or use pnpm filter
    pnpm --filter website docs:version <version-number>
    # Example:
    pnpm --filter website docs:version 1.2.3
    ```

    This command will:
    * Copy the current content from `website/docs/` and `website/sidebars.ts` (and API docs if versioned) into a version-specific directory (e.g., `website/versioned_docs/version-1.2.3/` and `website/versioned_sidebars/version-1.2.3-sidebars.json`).
    * The `website/docs/` content will then represent the "next" or "unreleased" version.

2. **Managing Versions:**
    * The `versions.json` file in the `website/` directory lists all available documentation versions.
    * Users can switch between versions using a dropdown in the Docusaurus navbar.

### Versioning API Documentation

Versioning API documentation alongside general guides requires careful configuration. Each Docusaurus `plugin-content-docs` instance (one per package for API docs) can be versioned independently if needed, but this adds complexity.

A common strategy for monorepos is to version the *entire documentation site* when significant changes occur across multiple packages or the main library. Simpler projects might opt to only document the "latest" version of the API and rely on changelogs for historical API changes.

**This template does not pre-configure Docusaurus versioning.** If you need it, you'll need to follow the Docusaurus documentation to set it up according to your project's versioning strategy.

## Best Practices for Documentation

* **Know Your Audience:** Write for the users of your libraries.
* **Be Clear and Concise:** Avoid jargon where possible; explain it if necessary.
* **Provide Examples:** Code examples are invaluable. Ensure they are correct and easy to understand.
* **Keep it Up-to-Date:** Outdated documentation is worse than no documentation. Make updating docs part of your development workflow.
* **Use Admonitions:** Highlight important notes, tips, warnings, or danger sections.
* **Structure for Readability:** Use headings, lists, and code blocks effectively.
* **Review Documentation:** Treat documentation changes like code changes – have them reviewed.

By following these guidelines, you can create and maintain high-quality documentation that greatly benefits your users and contributors.
