---
id: advanced-template-customization
title: Advanced Template Customization
sidebar_label: Advanced Customization
slug: /dev-guide/advanced-template-customization
---

While the `init-package.mjs` script handles the initial setup and placeholder replacement, this template is designed to be further customized to meet your project's specific requirements. This guide covers several advanced customization options.

## 1. Automated Dependency Updates (Dependabot/Renovate)

Keeping dependencies up-to-date is crucial for security and accessing new features. Tools like Dependabot (GitHub native) or Renovate can automate this process.

### Setting up Dependabot

1. Create a `.github/dependabot.yml` file in your repository root.
2. Configure it to check for updates to your `package.json` files (for pnpm, npm, or Yarn).

    ```yaml
    # .github/dependabot.yml
    version: 2
    updates:
      # Keep pnpm ecosystem dependencies up to date
      - package-ecosystem: "npm" # Use "npm" for pnpm, yarn, and npm
        directory: "/" # Location of package manifests (checks root and all packages)
        schedule:
          interval: "weekly" # How often to check for updates (daily, weekly, monthly)
        target-branch: "main" # Target branch for PRs
        reviewers:
          - "your-github-username" # Optional: assign reviewers
          # - "your-team-slug"
        assignees:
          - "your-github-username" # Optional: assign someone to the PR
        commit-message:
          prefix: "chore" # Prefix for commit messages
          prefix-development: "chore" # Prefix for dev dependencies
          include: "scope"
        labels:
          - "dependencies"
          - "automated"
        # Group updates for certain packages if desired
        # groups:
        #   docusaurus:
        #     patterns:
        #       - "@docusaurus/*"
        #   biome:
        #     patterns:
        #       - "@biomejs/*"
    ```

3. Commit this file to your `main` branch. Dependabot will start creating Pull Requests for outdated dependencies based on your schedule.

For Renovate, you would typically add a `renovate.json` or configure it via its app integration.

## 2. GitHub Issue and Pull Request Templates

Guiding contributors on how to report issues or submit pull requests can significantly improve the quality of contributions.

* **Issue Templates:** Create files in `.github/ISSUE_TEMPLATE/` to provide structured forms for bug reports, feature requests, etc.
  * Example: `.github/ISSUE_TEMPLATE/bug_report.md`

        ```md
        ---
        name: Bug Report
        about: Create a report to help us improve
        title: "[BUG] Brief description of bug"
        labels: ["bug", "needs-triage"]
        assignees: ''
        ---

        **Describe the bug**
        A clear and concise description of what the bug is.

        **To Reproduce**
        Steps to reproduce the behavior:
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error

        **Expected behavior**
        A clear and concise description of what you expected to happen.

        **Screenshots (if applicable)**
        If applicable, add screenshots to help explain your problem.

        **Environment (please complete the following information):**
        - OS: [e.g. iOS]
        - Browser/Node Version [e.g. chrome 22, Node 20.x]
        - Package Version [e.g. 22]

        **Additional context**
        Add any other context about the problem here.
        ```

  * You can also use [GitHub's issue form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) for more structured input.

* **Pull Request Template:** Create a `.github/PULL_REQUEST_TEMPLATE.md` file.
  * Example: `.github/PULL_REQUEST_TEMPLATE.md`

        ```md
        ---
        name: Default Pull Request
        about: Standard template for pull requests
        ---

        ## Description

        Please include a summary of the change and which issue is fixed or feature is implemented.
        Link to any relevant issues (e.g., `Fixes #123`, `Closes #456`).

        ## Type of change

        Please delete options that are not relevant.

        - [ ] Bug fix (non-breaking change which fixes an issue)
        - [ ] New feature (non-breaking change which adds functionality)
        - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
        - [ ] Documentation update
        - [ ] Chore (refactoring, build process, tooling changes, etc.)

        ## How Has This Been Tested?

        Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.
        - [ ] Unit Tests Added/Updated
        - [ ] Integration Tests Added/Updated
        - [ ] Manual testing steps performed (please describe)

        ## Checklist:

        - [ ] My code follows the style guidelines of this project (ran `pnpm format` and `pnpm lint`).
        - [ ] I have performed a self-review of my own code.
        - [ ] I have commented my code, particularly in hard-to-understand areas.
        - [ ] I have made corresponding changes to the documentation.
        - [ ] My changes generate no new warnings.
        - [ ] I have added tests that prove my fix is effective or that my feature works.
        - [ ] New and existing unit tests pass locally with my changes.
        - [ ] Any dependent changes have been merged and published in downstream modules.
        - [ ] I have added a [Changeset](https://github.com/changesets/changesets) if this change affects a published package.
        ```

## 3. Biome Configuration (`biome.json`)

[BiomeJS](https://biomejs.dev/) handles linting, formatting, and more. The global configuration is in the root `biome.json`.

* **Customizing Rules:** You can enable/disable specific lint rules or adjust formatting options. Refer to the [Biome documentation](https://biomejs.dev/reference/configuration/) for all available settings.

    ```json
    // biome.json (example snippet)
    {
      "organizeImports": {
        "enabled": true
      },
      "linter": {
        "enabled": true,
        "rules": {
          "recommended": true,
          "suspicious": {
            "noDoubleEquals": "warn" // Example: change severity
          },
          "style": {
            "noImplicitBoolean": "off" // Example: disable a rule
          }
        }
      },
      "formatter": {
        "enabled": true,
        "indentStyle": "space",
        "indentWidth": 2
      }
      // ... other configurations for JavaScript, JSON, etc.
    }
    ```

* **Package-Specific Overrides:** If a particular package needs different rules, you can add a `biome.json` file in that package's root directory. Biome will merge configurations, with package-specific settings taking precedence.

## 4. `CODEOWNERS` File

For larger projects or teams, a `.github/CODEOWNERS` file can help automatically assign reviewers or require reviews from specific teams/individuals for changes in certain parts of the codebase.

* Create a file named `CODEOWNERS` in the `.github/` directory.
* **Syntax:** Each line specifies a file pattern followed by one or more GitHub usernames or team names (e.g., `@username`, `@org/team-name`).

    ```text
    # .github/CODEOWNERS

    # Global fallback owners
    * @core-maintainer-1 @core-maintainer-2

    # Documentation changes require review from the docs team
    /website/docs/          @org/docs-team
    /README.md              @org/docs-team

    # Changes to specific packages
    /packages/ui-components/  @ui-lead @frontend-dev1
    /packages/api-client/     @backend-lead

    # Scripts and CI/CD
    /scripts/               @devops-lead
    /.github/workflows/     @devops-lead
    ```

    Refer to [GitHub's CODEOWNERS syntax documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) for more details.

## 5. TypeScript Configuration (`tsconfig.base.json` and per-package `tsconfig.json`)

* **`tsconfig.base.json`:** Contains common TypeScript compiler options shared across all packages. Modify this for global changes to TypeScript behavior (e.g., changing `target`, `module`, or strictness flags).
* **Per-Package `tsconfig.json`:** Each package in `packages/` has its own `tsconfig.json` that typically `extends` the root `tsconfig.base.json`. You can override or add specific compiler options here if a package has unique requirements (e.g., different `lib` entries, specific `paths` aliases for that package).

## 6. GitHub Workflow Adjustments (`.github/workflows/`)

While the provided workflows (`ci-checks.yml`, `release.yml`, `deploy-docs.yml`) offer a solid foundation, you might need to:

* **Test Matrix:** Expand the Node.js version matrix in `ci-checks.yml` to test against more versions.
* **OS Matrix:** Add different operating systems if your libraries need to be cross-platform compatible (e.g., `ubuntu-latest`, `windows-latest`, `macos-latest`).
* **Caching:** Fine-tune pnpm caching for dependencies or build outputs to speed up CI runs.
* **Custom Steps:** Add steps for specific needs, like deploying to different environments, running specialized security scans, or sending notifications.
* **Workflow Triggers:** Adjust the `on:` conditions (e.g., trigger on specific tags, paths, or manual dispatch).

Refer to the [CI/CD Explained](./12-ci-cd-explained.md) guide and [GitHub Actions documentation](https://docs.github.com/en/actions) for more.

## 7. `.nvmrc` and `packageManager`

* **`.nvmrc`**: Update this file if you decide to standardize on a different Node.js version for development.
* **`package.json` (root `packageManager` field)**: If you upgrade pnpm or switch package managers (though this template is heavily pnpm-centric), update this field accordingly. For pnpm, this also helps tools like [Corepack](https://nodejs.org/api/corepack.html) automatically use the correct pnpm version.

These advanced customizations allow you to adapt the template more precisely to your project's scale, team structure, and specific technical requirements.
