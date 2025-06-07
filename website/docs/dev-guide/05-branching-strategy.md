---
id: branching-strategy
title: Branching Strategy
sidebar_label: Branching Strategy
slug: /dev-guide/branching-strategy
---

A consistent branching strategy is crucial for collaborative development, managing features, fixes, and releases effectively. This document outlines the recommended branching model for this project.

We advocate for a simple and effective strategy similar to **GitHub Flow**, with an emphasis on short-lived feature branches and Pull Requests (PRs) for all changes to the main branch.

## Main Branches

* **`main`**:
  * This is the primary development branch and represents the latest stable state of the project.
  * All new development (features, bug fixes, improvements) should branch off `main`.
  * Direct pushes to `main` are typically restricted or disallowed; all changes should be merged via Pull Requests.
  * This branch is what CI/CD pipelines use to build, test, and trigger releases (e.g., via Changesets).
  * It should always be in a state that could be released.

* **`gh-pages`** (or similar for documentation deployment):
  * This branch is specifically used for deploying the Docusaurus documentation website to GitHub Pages.
  * It is automatically managed by the `deploy-docs.yml` GitHub Action and should not be manually edited.

## Feature and Development Branches

* **Naming Convention:**
  * Use descriptive names for your branches, prefixed with a type if desired.
  * Examples:
    * `feat/add-user-authentication`
    * `fix/resolve-login-issue`
    * `docs/update-getting-started`
    * `chore/refactor-ci-script`
    * `refactor/improve-performance-of-X`
    * `user/<your-name>/my-experimental-feature` (for personal, longer-lived explorations)

* **Creation:**
  * Always branch off the latest `main`:

        ```bash
        git checkout main
        git pull origin main
        git checkout -b feat/your-new-feature
        ```

* **Lifespan:**
  * Feature branches should be **short-lived**. Aim to integrate changes back into `main` frequently to avoid large, complex merges.
  * If a feature is substantial, break it down into smaller, manageable PRs.

## Pull Requests (PRs)

* **All changes to `main` must go through a Pull Request.** This includes features, bug fixes, documentation updates, and chores.
* **Purpose of PRs:**
  * Code review and discussion.
  * Automated CI checks (linting, testing, building).
  * A clear history of changes.
* **Creating a PR:**
  * Push your feature branch to the remote repository:

        ```bash
        git push origin feat/your-new-feature
        ```

  * Open a PR from your feature branch targeting `main` on GitHub.
  * Use the `PULL_REQUEST_TEMPLATE.md` (if available in `.github/`) to provide a clear description of the changes, link to any relevant issues, and outline testing performed.
* **Draft PRs:** For work-in-progress that you'd like feedback on or to run CI checks against before it's ready for full review, use [Draft Pull Requests](https://github.blog/2019-02-14-introducing-draft-pull-requests/).
* **Review Process:**
  * At least one (or as per team policy) approval from a team member is typically required.
  * Address all review comments and ensure CI checks are passing.
* **Merging PRs:**
  * Once approved and CI is green, the PR can be merged into `main`.
  * **Squash and Merge** or **Rebase and Merge** are often preferred to keep the `main` branch history clean and linear. Discuss with your team to establish a consistent merge strategy.
    * **Squash and Merge:** Combines all commits from the feature branch into a single commit on `main`. Useful for keeping `main` history tidy with one commit per feature/fix.
    * **Rebase and Merge:** Replays the feature branch's commits on top of the latest `main`, then fast-forwards `main`. Results in a linear history but can include many small commits on `main`.
  * Delete the feature branch after merging.

## Hotfixes

For urgent bug fixes that need to be deployed quickly:

1. Create a hotfix branch from `main`:

    ```bash
    git checkout main
    git pull origin main
    git checkout -b fix/critical-login-bug
    ```

2. Make the necessary changes and commit.
3. Open a PR for the hotfix branch targeting `main`. Expedite the review process.
4. Once merged, this fix will be included in the next release triggered by Changesets (which might be a patch release).

## Release Branches (Optional - Not typically needed with Changesets)

With Changesets, dedicated release branches (like `release/v1.2.0`) are generally **not required** for the typical versioning and publishing workflow. The `release.yml` GitHub Action handles version bumping and publishing directly on `main` after changeset files are merged.

However, if you have a very complex release process or need to stabilize a release while `main` moves forward with new features, you might consider a temporary release branch strategy (e.g., GitFlow's release branches). This adds complexity and should be adopted only if necessary.

## Keeping Your Feature Branches Up-to-Date

To avoid significant merge conflicts, regularly update your feature branch with the latest changes from `main`:

```bash
git checkout main
git pull origin main
git checkout feat/your-new-feature
git rebase main // or git merge main
```

Rebasing is often preferred for a cleaner history before creating or updating a PR, but ensure you understand its implications if the branch is shared.

## Summary

* `main` is always stable and deployable.
* Develop features and fixes on short-lived branches based off `main`.
* Use Pull Requests for all changes to `main`, ensuring code reviews and CI checks pass.
* Keep `main` history clean using appropriate merge strategies (squash or rebase).

This strategy promotes collaboration, code quality, and a stable main line of development, integrating well with the automated CI/CD and Changesets workflows.
