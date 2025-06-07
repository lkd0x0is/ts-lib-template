---
id: security-practices
title: Security Best Practices
sidebar_label: Security Practices
slug: /dev-guide/security-practices
---

Security is a critical aspect of any software project. While this template provides a solid foundation, maintaining a secure development lifecycle requires ongoing attention and adherence to best practices. This guide outlines key security considerations relevant to this monorepo setup.

## 1. Dependency Management

Vulnerabilities in third-party dependencies are a common attack vector.

* **Regularly Audit Dependencies:**
  * Use `pnpm audit` to check for known vulnerabilities in your installed packages:

        ```bash
        pnpm audit
        ```

  * Review the audit report and update or replace vulnerable dependencies as needed. For resolvable issues, `pnpm audit --fix` might help.
* **Automated Dependency Updates:**
  * Enable [Dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates) (for security updates) or a full dependency update tool like Dependabot version updates or Renovate (see [Advanced Template Customization](./13-advanced-template-customization.md)). These tools automatically create Pull Requests to update outdated or vulnerable dependencies.
  * Carefully review PRs from these tools, ensuring tests pass and changes are understood before merging.
* **Use Trusted Sources:** Only add dependencies from reputable sources and well-maintained packages. Be cautious with new or obscure packages.
* **Lockfile Integrity:** Always commit your `pnpm-lock.yaml` file. This ensures that everyone on the team and in CI uses the exact same versions of dependencies, preventing unexpected behavior due to version drift and ensuring the integrity of the dependency tree that was audited.
* **Minimize Dependencies:** Only include dependencies that are strictly necessary. Fewer dependencies mean a smaller attack surface.

## 2. Secure Coding Practices

* **Input Validation:** Always validate and sanitize any external input, especially if your libraries handle user-provided data or interact with external systems. This helps prevent injection attacks (XSS, SQL injection if applicable, etc.).
* **Error Handling:** Implement robust error handling to prevent information leakage and ensure graceful failure. Avoid exposing sensitive error details to end-users.
* **Principle of Least Privilege:** Ensure that code and processes only have the permissions necessary to perform their tasks.
* **Avoid Hardcoding Secrets:** Never hardcode API keys, passwords, or other sensitive credentials directly in your source code. Use environment variables or secure secret management solutions, especially for CI/CD and deployment.
* **Regular Code Reviews:** The [Code Review Process](./08-code-review-process.md) is a critical security checkpoint. Reviewers should look for potential security flaws in addition to other code quality aspects.
* **Static Analysis Security Testing (SAST):**
  * Biome (used for linting) can catch some security-related code patterns.
  * Consider integrating more specialized SAST tools if your project handles highly sensitive data. GitHub Advanced Security (if available on your plan) includes CodeQL for SAST.

## 3. CI/CD Security

Your CI/CD pipeline is a powerful automation tool but can also be a target if not secured properly.

* **Secure Secrets:**
  * Store sensitive information like `NPM_TOKEN` as encrypted [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
  * Limit the scope of secrets. For example, an `NPM_TOKEN` should only have permissions to publish the specific packages it needs to.
  * Avoid logging secrets in workflow output. GitHub Actions attempts to mask secrets, but be cautious with commands that might inadvertently print them.
* **Workflow Permissions (`GITHUB_TOKEN`):**
  * Grant workflows the minimum necessary permissions for the `GITHUB_TOKEN`. Define this in the `permissions:` block of your workflow files.

        ```yaml
        # .github/workflows/ci-checks.yml
        permissions:
          contents: read # Default, allows checking out code
          pull-requests: read # For PR triggers
        ```

        ```yaml
        # .github/workflows/release.yml
        permissions:
          contents: write # To commit version bumps and tags
          pull-requests: write # To comment on PRs (if changeset-action does this)
          # packages: write # Only if publishing to GitHub Packages Registry
        ```

  * For deploying to GitHub Pages, specific permissions like `pages: write` and `id-token: write` might be needed, as shown in the `deploy-docs.yml` workflow.
* **Third-Party Actions:** Be cautious when using third-party GitHub Actions.
  * Prefer actions from verified creators or official organizations.
  * Pin actions to a specific commit SHA rather than a branch (e.g., `actions/checkout@a12a3943b4bdde767164ada973e8f2e6ef9e2d80` instead of `actions/checkout@v4`) to prevent malicious changes in the action's source from affecting your workflow. Dependabot can help keep these SHAs updated.
* **Protect Main Branch:** Use branch protection rules on `main` to require status checks to pass (including your CI checks) and code reviews before merging. This prevents direct pushes of potentially insecure code.

## 4. Secure Development Environment

* **HTTPS Everywhere:** Use HTTPS for all Git operations and when accessing external resources.
* **Two-Factor Authentication (2FA):** Enable 2FA on your GitHub account and your npm account to protect against unauthorized access.
* **SSH Keys:** Use SSH keys for Git authentication instead of passwords where possible. Protect your SSH private keys.
* **Keep Tools Updated:** Regularly update Node.js, pnpm, your code editor, and other development tools to receive security patches.

## 5. Documentation Security

* **Avoid Exposing Sensitive Information:** Be careful not to include sensitive data (API keys, internal paths, private URLs) in your documentation, examples, or TSDoc comments that get published.
* **Generated Docs:** Review generated API documentation to ensure no internal or sensitive details are inadvertently exposed.

## 6. Reporting Security Vulnerabilities

If your project becomes widely used, consider establishing a clear process for users to report security vulnerabilities privately. This could be a dedicated email address or using GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) feature.

## Continuous Improvement

Security is not a one-time setup but an ongoing process. Regularly review your security practices, stay informed about new threats and vulnerabilities relevant to your technology stack, and adapt your defenses accordingly.

This guide provides a starting point. Depending on the nature and sensitivity of your libraries, you may need to implement additional, more stringent security measures.
