---
id: commit-conventions
title: Commit Message Conventions
sidebar_label: Commit Conventions
slug: /dev-guide/commit-conventions
---

Consistent and well-formatted commit messages are essential for maintaining a clear project history, facilitating code reviews, and enabling automated changelog generation and version bumping (especially when used with tools like Changesets).

This project strongly recommends adhering to the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.

## Why Conventional Commits?

* **Automation:** Allows tools to automatically determine semantic version bumps (patch, minor, major) based on commit types. This is crucial for the Changesets workflow.
* **Changelog Generation:** Enables automated generation of human-readable changelogs.
* **Clarity:** Provides a clear and structured commit history, making it easier to understand the nature of changes.
* **Team Communication:** Establishes a common language for describing changes.

## Format of a Conventional Commit Message

A conventional commit message follows this structure:

```text

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

```

### 1. Type

The `<type>` indicates the kind of change being introduced. Common types include:

* **`feat`**: A new feature for the user (corresponds to a `MINOR` SemVer bump if it's a new feature, or `MAJOR` if it's a breaking feature).
* **`fix`**: A bug fix for the user (corresponds to a `PATCH` SemVer bump).
* **`docs`**: Documentation-only changes (e.g., updating README, TSDoc comments).
* **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.). These are often handled by formatters like Biome.
* **`refactor`**: A code change that neither fixes a bug nor adds a feature (e.g., restructuring code, improving performance without changing behavior).
* **`perf`**: A code change that improves performance.
* **`test`**: Adding missing tests or correcting existing tests.
* **`build`**: Changes that affect the build system or external dependencies (e.g., Gulp, Webpack, Rollup, npm, pnpm).
* **`ci`**: Changes to our CI configuration files and scripts (e.g., GitHub Actions).
* **`chore`**: Other changes that don't modify `src` or `test` files (e.g., updating devDependencies, managing project files).
* **`revert`**: Reverts a previous commit.

### 2. Optional Scope

The `[optional scope]` provides contextual information about the part of the codebase affected by the change. It should be a noun enclosed in parentheses.

* Examples:
  * `feat(api): add new user endpoint`
  * `fix(ui): correct button alignment on login page`
  * `docs(parser): clarify usage of the parseNode function`
  * `refactor(core-utils): simplify internal data structure`

    For packages in a monorepo, the scope can be the package name:
  * `feat(my-lib): implement new sorting algorithm`
  * `fix(another-pkg): resolve race condition in event handler`

### 3. Description

The `<description>` is a concise summary of the code changes.

* **Rules:**
  * Use the imperative, present tense: "change" not "changed" nor "changes".
  * Don't capitalize the first letter.
  * No dot (`.`) at the end.
  * Keep it short (ideally under 50 characters, though up to 72 is often acceptable).

* Examples:
  * `feat: allow users to update their profile picture`
  * `fix: prevent memory leak in data processing loop`

### 4. Optional Body

The `[optional body]` provides additional contextual information about the code changes.

* **Rules:**
  * Use the imperative, present tense.
  * Separated from the description by a blank line.
  * Can include motivation for the change and contrast with previous behavior.
  * Lines should be wrapped at 72 characters.

* Example:

    ```text
    fix: correct minor typos in code

    Several typos were found in the codebase during a review.
    This commit corrects them to improve code readability and maintainability.
    ```

### 5. Optional Footer(s)

The `[optional footer(s)]` are used to reference issues, pull requests, or provide information about breaking changes.

* **Rules:**
  * Separated from the body by a blank line (or from the description if no body).
  * Each footer consists of a token, a separator (`:` or `#`), and a value.
* **Breaking Changes:**
  * A commit that introduces a breaking API change **MUST** indicate this in the footer with `BREAKING CHANGE:` followed by a description of the change, how to migrate, etc.
  * Alternatively, a `!` can be appended to the `<type>` or `<type>(<scope>)` (e.g., `feat!: ...` or `feat(api)!: ...`) to signify a breaking change. The `BREAKING CHANGE:` footer is still required.
  * A `BREAKING CHANGE` will trigger a `MAJOR` SemVer bump.

* **Referencing Issues:**
  * `Fixes: #123`
  * `Closes: #456, #789`
  * `Refs: #1011` (for related issues that aren't closed by this commit)

* Example with Breaking Change and Issue Reference:

    ```text
    feat: remove deprecated 'getUser' endpoint

    The 'getUser' endpoint is no longer supported and has been removed.
    Users should migrate to the new 'retrieveUserV2' endpoint which offers
    improved performance and additional filtering capabilities.

    BREAKING CHANGE: The '/api/user' endpoint has been removed.
    Use '/api/v2/user' instead. See anacondocs/migration-guide.md for details.

    Fixes: #234
    ```

## Examples

* **Simple Fix:**

    ```text
    fix: correct spelling of 'receive' in logs
    ```

* **New Feature with Scope:**

    ```text
    feat(auth): implement OTP two-factor authentication
    ```

* **Documentation Change:**

    ```text
    docs: update README with new setup instructions
    ```

* **Refactor with Body:**

    ```text
    refactor(core): simplify internal event emitter logic

    The previous event emitter had unnecessary complexity and was prone to
    memory leaks under specific edge cases. This refactor streamlines the
    implementation and improves its robustness without altering the public API.
    ```

* **Breaking Change:**

    ```text
    feat!: drop support for Node.js 16

    Node.js 16 has reached its end-of-life. This change removes specific
    compatibility layers and updates our minimum required Node.js version.

    BREAKING CHANGE: Minimum supported Node.js version is now 18.x.
    Projects using this library must upgrade their Node.js environment.
    ```

## Tooling

While not strictly enforced by this template's default Git hooks (unless you add them, e.g., via `commitlint` with Husky), adhering to these conventions is highly beneficial, especially for the Changesets workflow. Consider integrating tools like [commitlint](https://commitlint.js.org/) to enforce these conventions automatically.

## Benefits for Changesets

When you run `pnpm changeset`, you'll be asked for a summary of your changes. While this summary is what appears in the `CHANGELOG.md`, your well-crafted commit messages (especially the `<type>` and any `BREAKING CHANGE` indicators) provide crucial context for:

1. **Determining SemVer bump type:** Changesets can sometimes infer bump types or validate your choice based on commit messages if tools were integrated to parse them (though Changesets primarily relies on your interactive input).
2. **Reviewing PRs:** Clear commit messages make PRs easier to review and understand.
3. **Debugging and History Navigation:** `git log` becomes much more informative.

By adopting Conventional Commits, you contribute to a more maintainable, understandable, and automatable project lifecycle.
