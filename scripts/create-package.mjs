import path from "node:path";
import fs from "fs-extra";
import { glob } from "glob";
import inquirer from "inquirer";
import { replaceInFile } from "replace-in-file";

import displayDiff from "./utilities/display-diff.mjs";
import log from "./utilities/log.mjs";

const CURRENT_YEAR = new Date().getFullYear();

// --- Configuration ---
const SCRIPT_CONFIG = {
	TEMPLATE_DIR_NAME: "template", // Name of the template directory inside 'packages/'
	PACKAGES_BASE_DIR: "packages",
	// Placeholders to be used *within* the template files
	TEMPLATE_PLACEHOLDERS: {
		PACKAGE_NAME_KEBAB_CASE: "{{PACKAGE_NAME_KEBAB_CASE}}",
		PACKAGE_NAME_PASCAL_CASE: "{{PACKAGE_NAME_PASCAL_CASE}}",
		PACKAGE_NAME_FRIENDLY: "{{PACKAGE_NAME_FRIENDLY}}",
		PACKAGE_SCOPE: "{{PACKAGE_SCOPE}}", // e.g., @my-org
		FULL_PACKAGE_NAME: "--template--", // e.g., @my-org/my-package
		PACKAGE_DESCRIPTION: "{{PACKAGE_DESCRIPTION}}",
		AUTHOR_NAME: "{{AUTHOR_NAME}}", // Consider fetching from a global config or git
		AUTHOR_EMAIL: "{{AUTHOR_EMAIL}}", // Consider fetching from a global config or git
		YEAR: "{{YEAR}}",
	},
	// Default values for prompts, can be overridden by user
	PROMPT_DEFAULTS: {
		AUTHOR_NAME: "Your Name", // Or load from git config
		AUTHOR_EMAIL: "your.email@example.com", // Or load from git config
		PACKAGE_DESCRIPTION: "A new awesome package",
	},
	// Files within the new package to process for placeholder replacement
	// Paths are relative to the new package's root
	FILES_TO_PROCESS_FOR_PLACEHOLDERS: [
		"package.json",
		"README.md",
		"src/**/*.ts", // Example: process all .ts files in src
		// Add other files or patterns as needed, e.g., "LICENSE.md"
	],
};
// --- End Configuration ---

/**
 * Converts a kebab-case string to PascalCase.
 * e.g., "my-new-util" -> "MyNewUtil"
 * @param {string} str - The kebab-case string.
 * @returns {string} The PascalCase string.
 */
function kebabToPascalCase(str) {
	if (!str) return "";
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

/**
 * Converts a kebab-case string to a more friendly, spaced title case.
 * e.g., "my-new-util" -> "My New Util"
 * @param {string} str - The kebab-case string.
 * @returns {string} The friendly string.
 */
function kebabToFriendlyName(str) {
	if (!str) return "";
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Prompts the user for new package details.
 * @returns {Promise<object>} User's answers.
 */
async function promptForPackageDetails() {
	log("Please provide details for the new package:", "info");
	return inquirer.prompt([
		{
			name: "packageScope",
			message: "NPM Scope (e.g., @my-org, leave empty if none):",
			default: "",
			filter: (input) => input.trim(),
		},
		{
			name: "packageNameKebab",
			message: "Package Name (kebab-case, e.g., my-new-util):",
			validate: (input) =>
				/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input) ||
				"Please enter a valid kebab-case name (e.g., my-awesome-package)",
			filter: (input) => input.trim(),
		},
		{
			name: "packageDescription",
			message: "Package Description:",
			default: SCRIPT_CONFIG.PROMPT_DEFAULTS.PACKAGE_DESCRIPTION,
		},
		{
			name: "authorName",
			message: "Author Name:",
			default: SCRIPT_CONFIG.PROMPT_DEFAULTS.AUTHOR_NAME,
		},
		{
			name: "authorEmail",
			message: "Author Email:",
			default: SCRIPT_CONFIG.PROMPT_DEFAULTS.AUTHOR_EMAIL,
		},
	]);
}

/**
 * Replaces placeholders in specified files within the new package.
 * @param {string} packagePath - Absolute path to the new package directory.
 * @param {object} replacementValues - Key-value pairs of placeholders and their values.
 */
async function replacePlaceholdersInFiles(packagePath, replacementValues) {
	log("Replacing placeholders in new package files...", "info");

	const fromPatterns = [];
	const toValues = [];

	for (const placeholderKey in SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS) {
		const placeholderString =
			SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS[placeholderKey];

		fromPatterns.push(
			new RegExp(placeholderString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
		);

		toValues.push(replacementValues[placeholderString] || "");
	}

	if (fromPatterns.length === 0) {
		log("No placeholders configured to replace.", "warn");
		return;
	}

	for (const globPattern of SCRIPT_CONFIG.FILES_TO_PROCESS_FOR_PLACEHOLDERS) {
		const filesToProcess = await glob(globPattern, {
			cwd: packagePath,
			nodir: true,
			absolute: true,
			dot: true,
		});

		for (const filePath of filesToProcess) {
			let originalContent = "";
			try {
				originalContent = await fs.readFile(filePath, "utf-8");

				let tempContent = originalContent;
				let madeChange = false;
				for (let i = 0; i < fromPatterns.length; i++) {
					const newTempContent = tempContent.replace(
						fromPatterns[i],
						toValues[i],
					);
					if (newTempContent !== tempContent) {
						madeChange = true;
						tempContent = newTempContent;
					}
				}

				if (madeChange) {
					await replaceInFile({
						files: filePath,
						from: fromPatterns,
						to: toValues,
					});
					const newContent = await fs.readFile(filePath, "utf-8");
					log(`Processed: ${path.relative(process.cwd(), filePath)}`, "info");
					displayDiff(filePath, originalContent, newContent);
				} else {
					log(
						`No changes for: ${path.relative(process.cwd(), filePath)}`,
						"debug",
					);
				}
			} catch (error) {
				log(
					`Warning: Could not process file ${filePath}: ${error.message}`,
					"warn",
				);
			}
		}
	}
}

/**
 * Main function to create a new package.
 */
async function run() {
	log("🚀 Starting new package creation process...", "info");

	const templateSourcePath = path.join(
		process.cwd(),
		SCRIPT_CONFIG.PACKAGES_BASE_DIR,
		SCRIPT_CONFIG.TEMPLATE_DIR_NAME,
	);

	if (!(await fs.pathExists(templateSourcePath))) {
		log(
			`Template package directory not found at: ${templateSourcePath}`,
			"error",
		);
		log(
			`Please create a '${SCRIPT_CONFIG.TEMPLATE_DIR_NAME}' directory inside '${SCRIPT_CONFIG.PACKAGES_BASE_DIR}/'.`,
			"warn",
		);
		return;
	}

	const answers = await promptForPackageDetails();

	const fullPackageName = answers.packageScope
		? `${answers.packageScope}/${answers.packageNameKebab}`
		: answers.packageNameKebab;

	const newPackageDirName = answers.packageNameKebab;
	const newPackageAbsPath = path.join(
		process.cwd(),
		SCRIPT_CONFIG.PACKAGES_BASE_DIR,
		newPackageDirName,
	);

	if (await fs.pathExists(newPackageAbsPath)) {
		log(
			`Error: Package directory already exists: ${newPackageAbsPath}`,
			"error",
		);
		return;
	}

	try {
		log(
			`Scaffolding new package '${fullPackageName}' at '${path.relative(process.cwd(), newPackageAbsPath)}'...`,
			"info",
		);
		await fs.copy(templateSourcePath, newPackageAbsPath);
		log("Template files copied successfully.", "success");

		// Prepare placeholder values
		const replacementValues = {
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.PACKAGE_NAME_KEBAB_CASE]:
				answers.packageNameKebab,
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.PACKAGE_NAME_PASCAL_CASE]:
				kebabToPascalCase(answers.packageNameKebab),
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.PACKAGE_NAME_FRIENDLY]:
				kebabToFriendlyName(answers.packageNameKebab),
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.PACKAGE_SCOPE]: answers.packageScope,
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.FULL_PACKAGE_NAME]: fullPackageName,
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.PACKAGE_DESCRIPTION]:
				answers.packageDescription,
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.AUTHOR_NAME]: answers.authorName,
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.AUTHOR_EMAIL]: answers.authorEmail,
			[SCRIPT_CONFIG.TEMPLATE_PLACEHOLDERS.YEAR]: CURRENT_YEAR.toString(),
		};

		await replacePlaceholdersInFiles(newPackageAbsPath, replacementValues);

		// Special handling for package.json if not fully covered by generic placeholders
		// For example, ensuring version is set, or clearing specific fields.
		const newPkgJsonPath = path.join(newPackageAbsPath, "package.json");
		if (await fs.pathExists(newPkgJsonPath)) {
			log("Fine-tuning new package.json...", "info");
			let originalPkgJsonContent = "";
			try {
				originalPkgJsonContent = await fs.readFile(newPkgJsonPath, "utf-8");
				const pkgJson = JSON.parse(originalPkgJsonContent);

				// Overwrite or set specific fields that might not be placeholders
				pkgJson.name = fullPackageName;
				pkgJson.version = "0.1.0";
				pkgJson.description = answers.packageDescription;
				if (answers.authorName) {
					pkgJson.author = `${answers.authorName}${answers.authorEmail ? ` <${answers.authorEmail}>` : ""}`;
				}

				const newPkgJsonContent = JSON.stringify(pkgJson, null, 2);
				if (originalPkgJsonContent !== newPkgJsonContent) {
					await fs.writeFile(newPkgJsonPath, newPkgJsonContent);
					log("Updated package.json specific fields.", "success");
					displayDiff(
						newPkgJsonPath,
						originalPkgJsonContent,
						newPkgJsonContent,
					);
				} else {
					log("No further specific changes needed for package.json.", "info");
				}
			} catch (e) {
				log(`Warning: Could not fine-tune package.json: ${e.message}`, "warn");
			}
		}

		log(`🎉 Package '${fullPackageName}' created successfully! 🎉`, "success");
		log("Next steps:", "warn");
		log("  1. Review all changes in the new package directory.", "warn");
		log(
			"  2. Run your package manager's install command (e.g., `pnpm install`) to link the new package in the workspace.",
			"warn",
		);
		log("  3. Start developing your new package!", "warn");
	} catch (error) {
		log(`Error creating package: ${error.message}`, "error");
		if (error.stack) console.error(error.stack);

		// Attempt to clean up if directory was created
		if (await fs.pathExists(newPackageAbsPath)) {
			log(
				`Attempting to clean up created directory: ${newPackageAbsPath}`,
				"warn",
			);
			await fs.remove(newPackageAbsPath).catch((cleanupError) => {
				log(`Error during cleanup: ${cleanupError.message}`, "error");
			});
		}
	}
}

run().catch((error) => {
	log(`Script failed catastrophically: ${error.message}`, "error");
	if (error.stack) {
		console.error(error.stack);
	}
	process.exit(1);
});
