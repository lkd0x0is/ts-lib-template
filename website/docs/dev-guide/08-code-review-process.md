---
id: code-review-process
title: Code Review Process
sidebar_label: Code Review Process
slug: /dev-guide/code-review-process
---

Code reviews are a critical step in maintaining code quality, sharing knowledge, and fostering collaboration within the development team. All significant changes, including new features, bug fixes, and refactors, should go through a Pull Request (PR) and code review process before being merged into the `main` branch.

## Goals of Code Review

* **Improve Code Quality:** Catch bugs, logical errors, and potential performance issues. Ensure code is readable, maintainable, and adheres to project standards.
* **Knowledge Sharing:** Help team members learn about different parts of the codebase and new techniques.
* **Mentorship:** Provide opportunities for junior developers to learn from more experienced ones, and vice-versa.
* **Consistency:** Ensure code adheres to established coding conventions, architectural patterns, and project best practices.
* **Identify Alternative Solutions:** Reviewers might suggest simpler, more efficient, or more robust ways to solve a problem.

## The Pull Request (PR) Lifecycle

1. **Branching:** As outlined in the [Branching Strategy](./05-branching-strategy.md), create a feature or fix branch from the latest `main`.
2. **Development:** Implement your changes, including tests and documentation updates. Adhere to [Commit Conventions](./06-commit-conventions.md).
3. **Self-Review:** Before submitting a PR, review your own changes.
    * Did you address all requirements?
    * Is the code clean and understandable?
    * Are there any debugging statements or commented-out code left behind?
    * Do all tests pass locally (`pnpm test`)?
    * Does the code lint and format correctly (`pnpm lint` and `pnpm format`)?
4. **Push & Create PR:**
    * Push your branch to the remote repository.
    * Create a Pull Request targeting the `main` branch on GitHub.
    * Use the `PULL_REQUEST_TEMPLATE.md` (if configured in `.github/`) to provide a comprehensive description:
        * **What?** A summary of the changes.
        * **Why?** The reason for the changes (e.g., link to an issue number like `Fixes #123`).
        * **How?** A brief explanation of the approach taken, if not obvious.
        * **Testing:** How were these changes tested?
        * **Screenshots/GIFs:** If UI changes are involved.
5. **CI Checks:** Automated checks (linting, tests, build) configured in GitHub Actions will run on your PR. Ensure these are all passing.
6. **Assign Reviewers:** Assign one or more team members to review your PR. If unsure, ask the team lead or a senior developer.
7. **Review & Discussion:**
    * Reviewers will examine the code, provide feedback, ask questions, and suggest improvements using GitHub's review tools.
    * The PR author should respond to comments, clarify points, and make necessary revisions.
    * Maintain a respectful and constructive tone throughout the discussion.
8. **Revisions:** The PR author pushes updates to the feature branch to address review feedback. CI checks will re-run.
9. **Approval:** Once reviewers are satisfied and all CI checks pass, they will approve the PR. The number of required approvals may vary based on team policy (e.g., at least one or two).
10. **Merge:** After receiving the necessary approvals and with all checks green:
    * The PR is merged into the `main` branch.
    * The merge strategy (e.g., "Squash and merge," "Rebase and merge") should align with the team's preference for `main` branch history (see [Branching Strategy](./05-branching-strategy.md)).
    * The feature branch is typically deleted after merging.

## For the PR Author (Requesting a Review)

* **Keep PRs Focused and Small:** Smaller PRs are easier and faster to review. If a feature is large, break it down into multiple, logical PRs.
* **Provide Context:** Your PR description is crucial. Explain the "what" and "why" clearly.
* **Be Prepared for Feedback:** View feedback as an opportunity to improve, not as criticism.
* **Respond Promptly:** Address review comments in a timely manner. If you disagree with a suggestion, explain your reasoning respectfully.
* **Run Local Checks:** Ensure `pnpm lint`, `pnpm format`, `pnpm test`, and `pnpm build` pass locally before pushing and opening a PR to save CI time and reviewer effort.
* **Don't Merge Your Own PRs:** Unless explicitly allowed by team policy for trivial changes, avoid merging your own PRs.

## For the Reviewer

* **Understand the Context:** Read the PR description and any linked issues to understand the purpose of the changes.
* **Be Thorough but Constructive:**
  * Look for correctness, clarity, maintainability, performance, security, and adherence to standards.
  * Offer specific, actionable suggestions.
  * Phrase feedback constructively (e.g., "Consider doing X because Y" instead of "This is wrong").
  * Balance pointing out issues with acknowledging good work.
* **Prioritize:** Focus on significant issues first. Nitpicks about minor style issues (often handled by formatters) can be mentioned but shouldn't block a PR unless they severely impact readability.
* **Ask Questions:** If something is unclear, ask for clarification rather than making assumptions.
* **Test (if applicable):** For complex changes or UI features, consider checking out the branch and testing the changes locally.
* **Timeliness:** Aim to review PRs within a reasonable timeframe (e.g., within 1-2 business days, or as per team agreement). If you can't review promptly, let the author know.
* **Approval:** Approve the PR when you are confident that the changes are of good quality and meet the requirements. If you have blocking concerns, clearly state them.

## Review Checklist (Examples)

This is not exhaustive, but here are areas to consider during a review:

* **Functionality:** Does the code do what it's supposed to do? Does it handle edge cases?
* **Clarity & Readability:** Is the code easy to understand? Are variable and function names clear? Is there sufficient commenting for complex logic?
* **Simplicity:** Is there a simpler way to achieve the same result? Is the code overly complex?
* **Maintainability:** Will this code be easy to modify or debug in the future?
* **Tests:** Are there enough tests? Do they cover important scenarios (happy paths, edge cases, error conditions)? Do existing tests still pass?
* **Performance:** Are there any obvious performance bottlenecks or inefficiencies?
* **Security:** Are there any potential security vulnerabilities (e.g., XSS, SQL injection, improper input validation)?
* **Documentation:** Are TSDoc comments updated for API changes? Is any user-facing documentation (if applicable) updated?
* **Adherence to Standards:** Does the code follow project-specific coding conventions, architectural patterns, and best practices?
* **No Unnecessary Code:** Are there any commented-out blocks, debug logs, or dead code?

## Resolving Conflicts

If a feature branch has merge conflicts with `main`, the PR author is responsible for resolving them. This usually involves rebasing the feature branch on the latest `main` or merging `main` into the feature branch.

```bash
# Option 1: Rebase (often preferred for cleaner history)
git checkout main
git pull origin main
git checkout feat/your-feature-branch
git rebase main
# Resolve any conflicts, then force push (if you are the only one on the branch)
git push --force-with-lease origin feat/your-feature-branch

# Option 2: Merge main into feature branch
git checkout main
git pull origin main
git checkout feat/your-feature-branch
git merge main
# Resolve any conflicts, then commit and push
git push origin feat/your-feature-branch
```

A healthy code review process is a cornerstone of a successful software project. It requires active participation, respect, and a shared commitment to quality from all team members.
