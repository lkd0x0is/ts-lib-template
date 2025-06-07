# Contributing to &lt;PROJECT_TITLE&gt;

First off, thank you for considering contributing to `TS Lib Template`\! We welcome any contributions that help improve this project, whether it's reporting a bug, submitting a feature request, improving documentation, or writing code.

This document provides a high-level overview of how you can contribute. For more detailed information, please refer to our comprehensive **[Developer Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/)** hosted on our documentation site.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms. *(Optional: Add a `CODE_OF_CONDUCT.md` file and link it here, e.g., `[Contributor Code of Conduct](./CODE_OF_CONDUCT.md)`)*

## How to Contribute

We encourage contributions of all kinds\! Here's a general outline of how to contribute code or documentation:

1. **Find an Issue or Propose a Change:**

      * Check the [issue tracker](https://github.com/lkd0x0is/ts-lib-template/issues) for existing bugs, feature requests, or tasks.
      * If you have a new idea or want to report a bug not yet tracked, please [open a new issue](https://github.com/lkd0x0is/ts-lib-template/issues/new/choose) first to discuss it with the maintainers. This helps ensure your effort aligns with the project's goals.

2. **Fork & Clone:**

      * Fork the repository to your own GitHub account.
      * Clone your fork locally: `git clone https://github.com/<YOUR_USERNAME>/<REPO>.git`

3. **Set Up Development Environment:**

      * Ensure you have the prerequisites (Node.js, pnpm) installed as outlined in the main [README.md](./README.md).
      * Install dependencies: `pnpm install`
      * For a detailed guide on setting up your local environment, see the [Getting Started](./README.md#getting-started) section in the README and the [Developer Guide Overview](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/).

4. **Create a Branch:**

      * Create a new branch from the `main` branch for your changes. Please follow the naming conventions outlined in our [Branching Strategy Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/branching-strategy).

        ```bash
        git checkout main
        git pull origin main
        git checkout -b feat/my-awesome-feature # or fix/address-bug-123
        ```

5. **Make Your Changes:**

      * Write your code, add tests, and update documentation as needed.
      * Ensure your code adheres to our [Commit Conventions](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/commit-conventions) and code style (enforced by Biome).
      * Run `pnpm format` and `pnpm lint` to check your code.
      * Run `pnpm test` to ensure all tests pass.

6. **Add a Changeset (if applicable):**

      * If your changes affect any of the published packages (e.g., bug fixes, new features, breaking changes), you **must** add a changeset:

        ```bash
        pnpm changeset
        ```

      * Follow the prompts. For more details, see the [Changesets In-Depth Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/changesets-in-depth).

7. **Commit & Push:**

      * Commit your changes with a descriptive message adhering to our [Commit Conventions](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/commit-conventions).
      * Push your branch to your fork: `git push origin feat/my-awesome-feature`

8. **Submit a Pull Request (PR):**

      * Open a Pull Request from your feature branch to the `main` branch of the original repository.
      * Fill out the PR template with a clear description of your changes, why they were made, and how they were tested. Link any relevant issues.
      * Ensure all CI checks pass.
      * Be prepared to discuss your changes and make revisions based on feedback from the [Code Review Process](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/code-review-process).

## Detailed Contributor Guides

For comprehensive information on specific aspects of contributing, please refer to our Docusaurus Developer Guide:

* **Project Setup & Overview:** [Developer Guide Overview](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/)
* **Understanding the Codebase:** [Detailed Project Structure](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/project-structure-detailed)
* **Branching Strategy:** [Branching Strategy Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/branching-strategy)
* **Commit Messages:** [Commit Conventions Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/commit-conventions)
* **Writing Tests:** [Testing Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/testing-guide)
* **Code Style:** Enforced by Biome. Run `pnpm format` and `pnpm lint`.
* **Submitting PRs & Code Review:** [Code Review Process Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/code-review-process)
* **Working with Dependencies:** [Dependency Management Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/dependency-management)
* **Updating Documentation:** [Documentation Development Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/documentation-development)
* **Versioning (Changesets):** [Changesets In-Depth Guide](https://lkd0x0is.github.io/ts-lib-template/docs/dev-guide/changesets-in-depth)

## Reporting Bugs

If you find a bug, please check if an issue for it already exists. If not, [open a new bug report issue](https://github.com/lkd0x0is/ts-lib-template/issues/new?assignees=&labels=bug%2Cneeds-triage&template=bug_report.md). Please provide as much detail as possible, including steps to reproduce, expected behavior, and actual behavior.

## Suggesting Enhancements or Features

If you have an idea for a new feature or an enhancement to an existing one, please [open a new feature request issue](https://github.com/lkd0x0is/ts-lib-template/issues/new?assignees=&labels=enhancement%2Cneeds-triage&template=feature_request.md) to discuss it with the maintainers.

Thank you for helping make `TS Lib Template` better\!
