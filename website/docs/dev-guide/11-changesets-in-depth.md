---

id: changesets-in-depth
title: Versioning & Publishing with Changesets
sidebar_label: Changesets In-Depth
slug: /dev-guide/changesets-in-depth
---

This guide provides an in-depth look at how [Changesets](https://github.com/changesets/changesets) is used in this template to manage versioning, generate changelogs, and publish packages. Understanding this workflow is crucial for contributors and maintainers.

## What is Changesets?

Changesets is a tool designed to help manage versioning and changelogs for JavaScript projects, especially monorepos. Instead of manually bumping versions in `package.json` files, developers create "changeset files" that describe their changes and the intended semantic version bump for each affected package. These files are then committed to the repository. Later, a release process consumes these changeset files to update package versions, generate changelogs, and publish packages.

## Core Concepts

* **Changeset File:** A small Markdown file created by a developer that describes a set of changes and specifies which packages should receive a `patch`, `minor`, or `major` version bump. These files are stored in the `.changeset/` directory.
* **Semantic Versioning (SemVer):** Changesets helps enforce [SemVer](https://semver.org/). The choice of bump type (patch, minor, major) in a changeset file dictates how package versions will be updated.
  * **`patch`**: For backward-compatible bug fixes.
  * **`minor`**: For new functionality added in a backward-compatible manner.
  * **`major`**: For incompatible API changes (breaking changes).
* **Changelogs:** Changesets automatically updates (or creates) `CHANGELOG.md` files for each package based on the summaries provided in the changeset files.
* **Publishing:** Changesets can determine which packages have new versions ready to be published and can assist in the publishing process.

## The Changesets Workflow

The typical workflow with Changesets in this template is as follows:

### 1. Making Changes

As a developer, you make code changes to one or more packages in the monorepo. These changes could be bug fixes, new features, or breaking changes.

### 2. Adding a Changeset File

Once your changes are complete and ready to be committed (ideally on a feature branch), you need to document them with a changeset file.

* **Run the Command:**
    From the root of the monorepo, execute:

    ```bash
    pnpm changeset
    ```

* **Interactive CLI:** This will launch an interactive command-line interface that guides you through the process:
    1. **Select Packages:** It will list all packages in the monorepo. You'll use the arrow keys and spacebar to select which packages are affected by your changes and require a version bump.
    2. **Choose Bump Type:** For each selected package, you'll be prompted to choose the SemVer bump type (`patch`, `minor`, or `major`). Carefully consider the nature of your changes for each package.
        * If a change in one package forces a breaking change in a dependent package (even if the dependent package's own code didn't change much), that dependent package might also need a major bump.
    3. **Write a Summary:** For the set of changes, you'll write a concise summary in Markdown. This summary will be used to populate the `CHANGELOG.md` files.
        * Be clear and informative. If your commit messages follow [Conventional Commits](./06-commit-conventions.md), you can often adapt parts of your commit message subject lines for the summary.
        * You can use Markdown formatting (e.g., backticks for code, links).

* **Generated File:** After completing the prompts, Changesets will create a new Markdown file in the `.changeset/` directory with a unique, human-readable name (e.g., `.changeset/lovely-llamas-jump.md`).

    *Example `.changeset/awesome-docs-update.md` file:*

    ```markdown
    ---
    "@your-scope/package-a": minor
    "@your-scope/package-b": patch
    ---

    feat(package-a): Add new `superCoolFeature()` that enhances user experience.
    fix(package-b): Corrected an off-by-one error in the pagination logic.
    ```

### 3. Committing the Changeset File

Add the generated changeset file(s) to your Git commit along with your code changes:

```bash
git add .changeset/awesome-docs-update.md
git add packages/package-a/src/index.ts
git add packages/package-b/src/utils.ts
git commit -m "feat(package-a): implement superCoolFeature, fix(package-b): pagination error"
```

### 4\. Pull Request and Merge

Push your branch and open a Pull Request targeting `main`. When the PR is reviewed and merged, the changeset file(s) become part of the `main` branch.

### 5\. The Release Process (Automated by CI)

The `.github/workflows/release.yml` GitHub Action is typically configured to handle the release process when changes (especially changeset files) are merged into `main`.

* **Trigger:** The workflow usually triggers on pushes to `main`.
* **Steps:**
    1. **Checkout Code & Setup:** Sets up Node.js, pnpm, and installs dependencies.
    2. **Version Packages (`pnpm changeset:version` or `npx changeset version`):**
          * Changesets reads all `.md` files in the `.changeset/` directory.
          * It updates the `version` field in the `package.json` of each package specified in the changeset files according to the bump type.
          * It updates (or creates) `CHANGELOG.md` files for these packages, appending the summaries from the changeset files.
          * The processed changeset files are then deleted from `.changeset/`.
          * These changes (`package.json` and `CHANGELOG.md` updates) are committed and pushed back to `main` by the CI job.
    3. **Publish Packages (`pnpm changeset:publish` or `npx changeset publish`):**
          * Changesets identifies packages whose versions have changed and that are not marked as `private: true` in their `package.json`.
          * It publishes these packages to the configured npm registry (requires `NPM_TOKEN` secret in GitHub Actions).
    4. **Create GitHub Release:** The workflow often creates a GitHub Release for the new version(s), potentially using the generated changelog content.

## Managing Breaking Changes

* **Indicate in Changeset:** When adding a changeset, if your changes introduce a breaking change for a package, select `major` as the bump type for that package.
* **Describe in Summary:** Clearly document the breaking change in the changeset summary, including:
  * What broke.
  * Why the change was made.
  * How users can migrate to the new version.
        This information will go into the `CHANGELOG.md`.
* **Conventional Commits:** If you use Conventional Commits, mark your commit message with `BREAKING CHANGE:` in the footer or `!` after the type/scope (e.g., `feat!: ...`). This serves as an additional signal but Changesets primarily relies on the bump type you select interactively.

## Previewing Release Status

Before a release is officially made, you can check the status of pending changesets:

```bash
pnpm changeset status
```

This command will show:

* Which packages have pending changesets.
* What their new versions would be.
* A consolidated list of the changeset summaries.

This is very useful for maintainers to understand the scope of an upcoming release.

## Manual Releases (If Needed)

While the CI pipeline automates releases, maintainers can also perform these steps manually if necessary (e.g., for a hotfix or if CI is unavailable). This typically involves:

1. Ensure you have the latest `main` branch.
2. Ensure all necessary changeset files are present.
3. `pnpm install`
4. `pnpm build` (to ensure packages are built before publishing)
5. `pnpm changeset version` (commits and pushes version bumps and changelogs)
6. `pnpm changeset publish` (publishes to npm)
      * You'll need to be authenticated with npm and have publish rights.
      * You might need to provide an OTP (One-Time Password) if 2FA is enabled on your npm account.

It's generally recommended to let the CI handle releases for consistency and to avoid manual errors.

## Tips and Best Practices

* **One Changeset per PR (Usually):** If a PR contains logically distinct changes that should have separate changelog entries or different SemVer impacts on packages, you can create multiple changeset files within that single PR. However, often one changeset per PR that summarizes its overall impact is sufficient.
* **Be Clear in Summaries:** The changeset summary is what users will see in the changelog. Make it informative.
* **Review Changeset Files in PRs:** Ensure that contributors are adding appropriate changeset files with correct bump types and clear summaries as part of their PRs.
* **Empty Changesets:** If you want to release a package without any specific code changes (e.g., to re-release a failed publish or to align versions), you can create an "empty" changeset by selecting a package and a bump type, but providing a minimal or generic summary like "Version bump for release alignment."

Changesets provides a robust and developer-friendly way to manage releases in a monorepo, ensuring that versioning is intentional and changelogs are consistently generated.
