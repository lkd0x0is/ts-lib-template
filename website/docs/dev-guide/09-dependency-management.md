---
id: dependency-management
title: Dependency Management
sidebar_label: Dependency Management
slug: /dev-guide/dependency-management
---

Effectively managing dependencies is crucial for the health and stability of any software project, especially in a monorepo. This guide outlines how to manage dependencies using pnpm within this template.

## Understanding Dependencies in a Monorepo

* **Workspace Root (`package.json` at the project root):**
  * **`dependencies`**: Generally, the root `package.json` should have very few, if any, runtime dependencies. Runtime dependencies are usually specific to individual packages.
  * **`devDependencies`**: This is where you install tools shared across the entire monorepo, such as TypeScript, Biome, Vitest, Changesets, pnpm itself (via `packageManager` field), and other build or linting tools.

* **Individual Packages (`packages/<package-name>/package.json`):**
  * **`dependencies`**: Runtime dependencies required by this specific package.
  * **`devDependencies`**: Development-time dependencies for this specific package (e.g., specific testing utilities not shared globally, or type definitions for a dependency).
  * **`peerDependencies`**: Dependencies that the package expects its consumer (another package or an application) to provide. This is common for plugins or libraries designed to work with other tools (e.g., a React component library would list `react` as a peer dependency).

## pnpm and Dependency Management

pnpm handles dependencies efficiently:

* **Content-Addressable Store:** Downloads each version of a package only once and stores it in a global store (`~/.pnpm-store`).
* **Symlinks/Hardlinks:** Packages in your `node_modules` directories are linked from this global store, saving disk space.
* **Strictness:** pnpm creates a non-flat `node_modules` structure by default, which helps prevent issues with phantom dependencies (accessing packages that aren't explicitly listed in `package.json`).

## Common Operations

All `pnpm` commands for dependency management should generally be run from the **root of the monorepo**.

### Adding Dependencies

* **To a Specific Package:**
    Use the `--filter <package-name>` option.

    ```bash
    # Add a runtime dependency to 'my-lib'
    pnpm --filter my-lib add <dependency-name>

    # Add a dev dependency to 'my-lib'
    pnpm --filter my-lib add -D <dependency-name>

    # Add a peer dependency to 'my-lib'
    pnpm --filter my-lib add -P <dependency-name>
    ```

    Example: `pnpm --filter @<scope>/<package-name> add lodash`
    Example: `pnpm --filter @<scope>/<package-name> add -D @types/lodash`

* **To the Workspace Root (for shared dev tools):**
    Use the `-w` or `--workspace-root` flag.

    ```bash
    # Add a dev dependency to the root
    pnpm add -D -w <dev-dependency-name>
    ```

    Example: `pnpm add -D -w eslint`

### Removing Dependencies

* **From a Specific Package:**

    ```bash
    pnpm --filter <package-name> remove <dependency-name>
    ```

    Example: `pnpm --filter my-lib remove lodash`

* **From the Workspace Root:**

    ```bash
    pnpm remove -w <dev-dependency-name>
    ```

    Example: `pnpm remove -w eslint`

### Updating Dependencies

* **Interactive Update (Recommended for most cases):**
    pnpm provides an interactive update experience.

    ```bash
    # Update dependencies across the entire workspace (interactive)
    pnpm update -i -r # -r for recursive (all packages)

    # Update dependencies for a specific package (interactive)
    pnpm --filter <package-name> update -i
    ```

    This will show you outdated packages and allow you to select which ones to update.

* **Update to Latest Version:**
    To update specific packages to their latest version:

    ```bash
    # Update a specific dependency in 'my-lib' to its latest version
    pnpm --filter my-lib add <dependency-name>@latest

    # Update a specific dev dependency in the root to its latest version
    pnpm add -D -w <dev-dependency-name>@latest
    ```

* **General Update (Use with caution):**
    Running `pnpm update -r` without `-i` will update packages according to the ranges specified in your `package.json` files and the `pnpm-lock.yaml`. This might not always bring them to the absolute latest versions if your version ranges are restrictive.

### Listing Dependencies

* **List dependencies for a specific package:**

    ```bash
    pnpm --filter <package-name> list
    ```

* **List why a package is installed (useful for debugging):**

    ```bash
    pnpm why <dependency-name> [--recursive] [--dev]
    ```

* **Check for outdated dependencies:**

    ```bash
    pnpm outdated -r
    ```

## Workspace Protocol (`workspace:`)

pnpm allows you to link local packages within the monorepo using the `workspace:` protocol. This ensures that when you specify a local package as a dependency, pnpm will use the local version from your workspace.

* **Example:** If `package-a` depends on `package-b` (both in your workspace):
    In `packages/package-a/package.json`:

    ```json
    {
      "dependencies": {
        "package-b": "workspace:*"
      }
    }
    ```

    Or, for a specific version constraint that still resolves to the workspace package if matched:

    ```json
    {
      "dependencies": {
        "package-b": "workspace:^1.2.0"
      }
    }
    ```

* **Adding Workspace Dependencies:**
    When you run `pnpm --filter package-a add package-b`, if `package-b` is found in the workspace, pnpm will automatically use the `workspace:` protocol (unless configured otherwise or if `package-b` is also available on npm and you specify a version range that doesn't match the local one).

* **Benefits:**
  * Ensures you are using the local, in-development versions of your packages.
  * Simplifies linking between packages.
  * When publishing, Changesets (or pnpm itself during pack/publish) typically resolves these `workspace:` versions to actual version numbers.

## The Lockfile (`pnpm-lock.yaml`)

* **Purpose:** The `pnpm-lock.yaml` file at the root of your monorepo records the exact versions of all dependencies (and their transitive dependencies) for all packages in the workspace.
* **Importance:**
  * **Ensures reproducible builds:** Everyone on the team and your CI server will install the exact same dependency versions.
  * **Source of truth:** It's the definitive record of your dependency tree.
* **Management:**
  * **Commit `pnpm-lock.yaml` to version control.**
  * Do not manually edit this file. It is managed by pnpm.
  * If you encounter issues or merge conflicts in `pnpm-lock.yaml`, it's often best to:
        1. Resolve conflicts in your `package.json` files first.
        2. Run `pnpm install` again. pnpm will attempt to regenerate the lockfile based on the resolved `package.json` files.
        3. In rare, more complex cases, you might need to delete `node_modules` and `pnpm-lock.yaml` and run `pnpm install` from scratch (ensure you have no uncommitted `package.json` changes first).

## Keeping Dependencies Up-to-Date

* **Regularly check for outdated packages:**

    ```bash
    pnpm outdated -r
    ```

* **Use tools like Dependabot or Renovate:** Configure these tools (e.g., via `.github/dependabot.yml`) to automatically create Pull Requests for dependency updates. This is highly recommended for security patches and staying current. See [Advanced Template Customization](./13-advanced-template-customization.md) for an example.
* **Test thoroughly after updates:** Especially for major version bumps, ensure that updates do not introduce breaking changes or regressions by running all tests and performing manual verification if needed.

## Troubleshooting

* **"Phantom Dependencies":** If you find your code relying on a package that's not explicitly in your `package.json`, pnpm's strictness should usually prevent this. If it occurs, explicitly add the missing dependency.
* **Version Conflicts:** If different packages require incompatible versions of the same dependency, pnpm will try to resolve this. Check `pnpm list` or `pnpm why` to understand the dependency tree. You might need to update packages or use pnpm [overrides](https://pnpm.io/package_json#pnpmoverrides) (use with caution).
* **Slow Installs (Rarely with pnpm):** Ensure you're not behind a restrictive proxy. Check `~/.pnpm-store` for its size and health.

By following these practices, you can maintain a clean, stable, and efficient dependency management system within your monorepo.
