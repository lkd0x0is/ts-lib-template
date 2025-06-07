---
id: helper-scripts-advanced
title: Helper Scripts (Advanced Usage & Troubleshooting)
sidebar_label: Helper Scripts Advanced
slug: /dev-guide/helper-scripts-advanced
---

This guide provides more detailed information, advanced usage tips, and troubleshooting advice for the helper scripts (`init-package.mjs` and `create-package.mjs`) located in the `scripts/` directory. These scripts are designed to streamline initial project setup and the creation of new packages.

Ensure you have the necessary prerequisites mentioned in the main [README.md](../../../README.md) and that `devDependencies` like `fs-extra`, `inquirer`, `replace-in-file`, `glob`, and `diff` are installed in your root `package.json`.

## `scripts/init-package.mjs` (Project Initialization)

This script is intended to be run **once** after cloning the template repository. Its primary goal is to customize the template to become your specific project.

### What it Does (In Detail)

1. **Prompts for Core Information:**
    * GitHub Username/Organization: Used for repository URLs, `package.json` fields, etc.
    * Repository Name: Used for URLs and project naming.
    * Library/Project Display Names: For user-facing names (e.g., Docusaurus title, README title).
    * Kebab-case Package Name for the initial example package: To rename `packages/ts-lib` (or the detected source package).
    * PascalCase Class Name for the example library (if applicable).
    * Author Name & Email: For `LICENSE.md` and `package.json` files.
    * Library Description.

2. **Directory Renaming:**
    * The script attempts to detect the current example package directory (defaulting to `SCRIPT_CONFIG.INITIALtemplate_DIR_NAME` like `ts-lib`).
    * It then renames this directory to the new kebab-case package name provided by the user.

3. **File Content Replacement:**
    * It iterates through a predefined list of files (`SCRIPT_CONFIG.FILES_TO_PROCESS_FOR_PLACEHOLDERS_TEMPLATE` in the script).
    * In these files, it replaces placeholder strings (defined in `SCRIPT_CONFIG.PLACEHOLDERS`) with the values gathered from user prompts.
    * Common placeholders include those for GitHub user/repo, various library name formats, author details, and the current year in licenses.

4. **Specific File Updates:**
    * **Root `package.json`**: Updates project name, author, and potentially filters in scripts if they referenced the old example package name.
    * **`LICENSE.md`**: Updates the copyright year and author name.
    * **Docusaurus Configuration (`website/docusaurus.config.ts`)**: Updates site title, project name, GitHub URLs, etc.
    * **GitHub Workflow files (`.github/workflows/*.yml`)**: Updates repository names or paths referenced in CI/CD jobs.

5. **Diff Display:** For every file modified, a color-coded diff is shown in the console, allowing you to see exactly what changes were made.

### When to Re-run?

* **Generally, no.** This script is designed for initial setup. Re-running it on an already customized project might have unintended consequences if placeholders have been removed or altered.
* If a major template structure change occurs and you need to re-apply certain global changes, you might consider adapting parts of this script, but do so with extreme caution and preferably on a separate branch with version control.

### Customizing the Script

You can modify `scripts/init-package.mjs` if your project has different needs:

* **`SCRIPT_CONFIG.PLACEHOLDERS`**: Add, remove, or change the placeholder strings the script looks for.
* **`SCRIPT_CONFIG.INITIALtemplate_DIR_NAME`**: Change if your initial example package in the template has a different name.
* **`SCRIPT_CONFIG.FILES_TO_PROCESS_FOR_PLACEHOLDERS_TEMPLATE`**: Modify the list of files that undergo placeholder replacement. Remember to use `{{PACKAGE_DIR_PLACEHOLDER}}` for paths that depend on the example package's name.
* **Prompts in `promptForProjectDetails()`**: Add new questions or change default values.
* **`buildReplacements()` Function**: Adjust how replacement values are derived from answers or add new static replacements.

### Troubleshooting `init-package.mjs`

* **"Permission Denied"**:
  * Ensure the script is executable: `chmod +x scripts/init-package.mjs`.
  * Alternatively, always run with `node scripts/init-package.mjs`.
* **"Script fails, placeholders not replaced"**:
  * Check the console output for specific error messages from `fs-extra`, `inquirer`, or `replace-in-file`.
  * Ensure all required `devDependencies` are installed in the root `package.json`.
  * Verify that the placeholder strings defined in `SCRIPT_CONFIG.PLACEHOLDERS` exactly match those in your template files. Even a small typo or case difference can cause replacements to fail.
  * If the script cannot find the initial example package directory to rename, it might misconfigure paths. Ensure `SCRIPT_CONFIG.INITIALtemplate_DIR_NAME` matches the actual directory name in a fresh clone.
* **"Diffs show unexpected changes or no changes"**:
  * This could indicate an issue with the `from` patterns (placeholders) or the `to` values (user input) in the `replaceInFile` calls.
  * Double-check the logic in `buildReplacements()` and how `replacementValues` are constructed.
* **Script Exits Early During Prompts (e.g., Ctrl+C)**:
  * The script should handle this gracefully. If it doesn't, no changes should have been written to disk yet, but it's good to ensure prompts have validation for critical inputs.

## `scripts/create-package.mjs` (New Package Scaffolding)

This script helps you add new packages to your monorepo based on the structure and content of `packages/template/`.

### What it Does (In Detail)

1. **Checks for Template:** Verifies that `packages/template/` (or the configured template directory name) exists.
2. **Prompts for New Package Details:**
    * NPM Scope (optional, e.g., `@my-org`).
    * Package Name (kebab-case, e.g., `my-new-feature`).
    * Package Description.
    * Author Name & Email.
3. **Directory Creation:**
    * Constructs the full package name (e.g., `@my-org/my-new-feature`) and the target directory path (e.g., `packages/my-new-feature`).
    * Checks if the target directory already exists to prevent overwriting.
    * Copies the entire contents of `packages/template/` to the new package directory.
4. **Placeholder Replacement:**
    * Gathers values from user prompts and generates derived values (e.g., PascalCase name from kebab-case name).
    * Iterates through files specified in `SCRIPT_CONFIG.FILES_TO_PROCESS_FOR_PLACEHOLDERS` within the *newly created package directory*.
    * Replaces placeholders (defined in `SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS`) with the new package's specific values.
    * Shows a diff for each modified file.
5. **`package.json` Fine-Tuning:**
    * After generic placeholder replacement, it specifically reads the new package's `package.json`.
    * It ensures critical fields like `name` (full scoped name), `version` (typically set to `0.1.0`), `description`, and `author` are correctly set using the provided inputs. This step acts as a safeguard or override for what the generic replacements did.
    * Shows a diff if these fine-tuning steps result in further changes to `package.json`.

### Customizing `template/`

The effectiveness of `create-package.mjs` heavily relies on how well `packages/template/` is structured and placeholder-ized.

* **Structure:** Include all common files and directories you want in every new package (e.g., `src/index.ts`, `README.md`, `package.json`, `tsconfig.json`, `vite.config.ts`, basic `test/` folder).
* **Placeholders:** Use the exact placeholder strings defined in `SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS` (in `create-package.mjs`) within the files of `template/`.
  * Example for `template/package.json`:

        ```json
        {
          "name": "{{FULL_PACKAGE_NAME}}",
          "version": "0.0.0", // Will be set to 0.1.0 by the script
          "description": "{{PACKAGE_DESCRIPTION}}",
          "author": "{{AUTHOR_NAME}} <{{AUTHOR_EMAIL}}>",
          // ... other fields with placeholders ...
        }
        ```

  * Example for `template/src/index.ts`:

        ```ts
        /**
         * Main entry point for {{PACKAGE_NAME_FRIENDLY}}.
         * @packageDocumentation
         */

        /**
         * A sample function for the {{PACKAGE_NAME_PASCAL_CASE}} library.
         * @returns A greeting string.
         */
        export function hello{{PACKAGE_NAME_PASCAL_CASE}}(): string {
          return "Hello from {{PACKAGE_NAME_KEBAB_CASE}}!";
        }
        ```

### Customizing the Script

* **`SCRIPT_CONFIG.TEMPLATE_DIR_NAME`**: Change if your template package has a different name.
* **`SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS`**: Add or modify placeholders. Ensure these match what's used in `template/`.
* **`SCRIPT_CONFIG.PROMPT_DEFAULTS`**: Change default answers for prompts.
* **`SCRIPT_CONFIG.FILES_TO_PROCESS_FOR_PLACEHOLDERS`**: Adjust which files within the new package are processed for placeholders.
* **Derived Values:** Modify `kebabToPascalCase` or `kebabToFriendlyName` helpers, or add new ones if you need other name transformations.
* **`package.json` Fine-Tuning Logic:** Adjust the part of the script that specifically modifies the new `package.json` if you have different defaults or fields to manage.

### Troubleshooting `create-package.mjs`

* **"Template package directory not found"**:
  * Ensure `packages/template/` (or your configured name) exists.
  * Check for typos in `SCRIPT_CONFIG.TEMPLATE_DIR_NAME`.
* **"Package directory already exists"**:
  * Choose a different package name or delete the existing directory if it's safe to do so.
* **"Placeholders not replaced correctly or replaced with empty strings"**:
  * **Most common issue:** Mismatch between placeholder strings in `SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS` (in the script) and the actual strings used in `template/` files. They must be identical.
  * Verify the `replacementValues` object in the script is being populated correctly with user answers and derived names.
  * Check the `replacePlaceholdersInFiles` function, especially how it maps `placeholderString` to `replacementValues[placeholderString]`.
* **Script Fails During File Operations:**
  * Permissions issues on the `packages/` directory or within `template/`.
  * Ensure `fs-extra` and other file system related dev dependencies are installed.
* **Diffs Show Unexpected Content:**
  * This usually points back to issues with placeholder definitions or the replacement logic.

### Post-Script Actions

Always remember to run `pnpm install` after `create-package.mjs` successfully completes. This is necessary for pnpm to recognize and link the new package within the workspace, install its dependencies, and update the lockfile.

By understanding these details, you can effectively use and customize these helper scripts to fit your monorepo's evolving needs.
