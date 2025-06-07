import path from "node:path";
import fs from "fs-extra";
import { glob } from "glob";
import inquirer from "inquirer";
import { replaceInFile } from "replace-in-file";

import displayDiff from "./utilities/display-diff.mjs";
import log from "./utilities/log.mjs";

const CURRENT_YEAR = new Date().getFullYear();

// --- Configuration for Placeholders and Files ---
const SCRIPT_CONFIG = {
	PLACEHOLDERS: {
		GIT_USER_OR_ORG: "lkd0x0is",
		REPO_NAME: "ts-lib-template",
		LIBRARY_NAME_PASCAL_CASE: "TSLib",
		LIBRARY_NAME_KEBAB_CASE: "ts-lib",
		LIBRARY_NAME_FRIENDLY: "TS-Lib",
		LIBRARY_DESCRIPTION: "A Modern TypeScript Library",
		AUTHOR_NAME: "Airi Järvinen",
		AUTHOR_EMAIL: "lkd0x0is@gmail.com",
		LICENSE_YEAR: "{{LICENSE_YEAR}}",
	},

	INITIAL_TEMPLATE_PACKAGE_DIR_NAME: "ts-lib",

	FILES_TO_PROCESS_FOR_PLACEHOLDERS_TEMPLATE: [
		"README.md",
		"packages/{{PACKAGE_DIR_PLACEHOLDER}}/README.md",
		"packages/{{PACKAGE_DIR_PLACEHOLDER}}/package.json",
		"packages/{{PACKAGE_DIR_PLACEHOLDER}}/src/index.ts",
		"packages/{{PACKAGE_DIR_PLACEHOLDER}}/src/calculator.ts",
		"website/docusaurus.config.ts",
		".github/workflows/ci-checks.yml",
		".github/workflows/release.yml",
		".github/workflows/deploy-docs.yml",
		"LICENSE.md",
		"package.json",
	],
	PACKAGE_DIR_PLACEHOLDER_STRING: "{{PACKAGE_DIR_PLACEHOLDER}}",
};
// --- End Configuration ---

/**
 * Detects the current relevant package directory name within 'packages/'.
 * @param {string} initialTemplateDirName - The directory name as defined in the template (e.g., "ts-lib").
 * @returns {Promise<string|null>} The detected directory name, or null if ambiguous.
 */
async function detectSourcePackageDir(initialTemplateDirName) {
	log(
		`Detecting source package directory (initial template name: ${initialTemplateDirName})...`,
		"info",
	);
	const packagesBasePath = path.join(process.cwd(), "packages");

	try {
		// Check if the initial template directory exists
		const initialPath = path.join(packagesBasePath, initialTemplateDirName);
		if (await fs.pathExists(initialPath)) {
			log(
				`Found package directory matching initial template: 'packages/${initialTemplateDirName}'`,
				"info",
			);
			return initialTemplateDirName;
		}

		// If not, scan 'packages/' for other directories
		log(
			`Initial template directory 'packages/${initialTemplateDirName}' not found. Scanning 'packages/'...`,
			"info",
		);
		const entries = await fs.readdir(packagesBasePath, { withFileTypes: true });
		const directories = entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);

		if (directories.length === 1) {
			const detectedDir = directories[0];
			log(
				`Found a single directory: 'packages/${detectedDir}'. Assuming this is the target package directory.`,
				"warn",
			);
			return detectedDir;
		}

		if (directories.length === 0) {
			log(
				`No directories found in 'packages/'. Cannot determine source package directory. Using initial template name '${initialTemplateDirName}' as a fallback, but it might not exist.`,
				"error",
			);
			return initialTemplateDirName;
		}

		log(
			`Multiple directories found in 'packages/': ${directories.join(", ")}. Cannot automatically determine the correct one.`,
			"error",
		);
		log(
			`Please ensure only the target package directory exists in 'packages/' or that it matches the initial template name '${initialTemplateDirName}'.`,
			"error",
		);
		return null; // Ambiguous
	} catch (error) {
		log(`Error detecting source package directory: ${error.message}`, "red");
		log(
			`Falling back to initial template name '${initialTemplateDirName}', but this may be incorrect.`,
			"warn",
		);
		return initialTemplateDirName;
	}
}

/**
 * Prompts the user for project details.
 * @param {object} placeholders - Default placeholder values.
 * @param {string} currentPackageDirName - The currently detected package directory name.
 * @returns {Promise<object>} A promise that resolves to an object containing user answers.
 */
async function promptForProjectDetails(placeholders, currentPackageDirName) {
	log("Please provide the following details for your new project:", "info");
	return inquirer.prompt([
		{
			name: "githubUser",
			message: "Enter your GitHub Username/Organization:",
			default: placeholders.GIT_USER_OR_ORG,
		},
		{
			name: "repoName",
			message: "Enter your Repository Name:",
			default: placeholders.REPO_NAME,
		},
		{
			name: "libNameFriendly",
			message: "Enter friendly Library Name (e.g., My Awesome Lib):",
			default: placeholders.LIBRARY_NAME_FRIENDLY,
		},
		{
			name: "libNamePascal",
			message: "Enter Library Name in PascalCase (e.g., MyAwesomeLib):",
			default: placeholders.LIBRARY_NAME_PASCAL_CASE,
		},
		{
			name: "libNameKebab",
			message:
				"Enter Library Package Name in kebab-case (e.g., my-awesome-lib):",

			default:
				currentPackageDirName !==
				SCRIPT_CONFIG.INITIAL_TEMPLATE_PACKAGE_DIR_NAME
					? currentPackageDirName
					: placeholders.LIBRARY_NAME_KEBAB_CASE,
		},
		{
			name: "libDescription",
			message: "Enter Library Description:",
			default: placeholders.LIBRARY_DESCRIPTION,
		},
		{
			name: "authorName",
			message: "Author Name:",
			default: placeholders.AUTHOR_NAME,
		},
		{
			name: "authorEmail",
			message: "Author Email:",
			default: placeholders.AUTHOR_EMAIL,
		},
		{
			type: "confirm",
			name: "confirmRenamePackageDir",
			message: (answers) =>
				`The current package directory is 'packages/${currentPackageDirName}'.\n  Rename it to 'packages/${answers.libNameKebab}'?`,
			default: true,
			when: (answers) => answers.libNameKebab !== currentPackageDirName,
		},
	]);
}

/**
 * Renames the package directory if confirmed by the user.
 * @param {string} oldDirName - The current directory name.
 * @param {string} newDirName - The new directory name.
 * @param {boolean} shouldRename - Whether to perform the rename.
 * @returns {Promise<boolean>} True if rename was successful or not needed, false on error.
 */
async function renamePackageDirectory(oldDirName, newDirName, shouldRename) {
	if (!shouldRename || oldDirName === newDirName) {
		if (oldDirName === newDirName && shouldRename) {
			log(
				`Package directory name 'packages/${newDirName}' is already correct. No rename needed.`,
				"info",
			);
		}
		return true;
	}

	log(
		`Attempting to rename 'packages/${oldDirName}' to 'packages/${newDirName}'...`,
		"info",
	);
	try {
		const oldPath = path.join(process.cwd(), "packages", oldDirName);
		const newPath = path.join(process.cwd(), "packages", newDirName);

		if (await fs.pathExists(oldPath)) {
			await fs.rename(oldPath, newPath);
			log(
				`Directory 'packages/${oldDirName}' successfully renamed to 'packages/${newDirName}'.`,
				"success",
			);
			return true;
		}
		log(
			`Directory 'packages/${oldDirName}' not found. Skipping rename.`,
			"warn",
		);
		return true;
	} catch (error) {
		log(
			`Error renaming package directory 'packages/${oldDirName}': ${error.message}`,
			"error",
		);
		log(
			"Please check permissions and ensure the directory is not in use.",
			"error",
		);
		return false;
	}
}

/**
 * Builds the list of replacements.
 * @param {object} answers - User-provided answers.
 * @param {object} placeholders - Default placeholder values.
 * @param {string} currentYear - The current year.
 * @param {string} actualOldPackageName - The actual old package name (kebab-case, could be the detected one).
 * @param {string} newPackageName - The new package name from user input (kebab-case).
 * @returns {Array<{from: RegExp, to: string}>} Array of replacement objects.
 */
function buildReplacements(
	answers,
	placeholders,
	currentYear,
	actualOldPackageName,
	newPackageName,
) {
	const replacements = [
		{
			from: new RegExp(placeholders.GIT_USER_OR_ORG, "g"),
			to: answers.githubUser,
		},
		{ from: new RegExp(placeholders.REPO_NAME, "g"), to: answers.repoName },
		{
			from: new RegExp(placeholders.LIBRARY_NAME_PASCAL_CASE, "g"),
			to: answers.libNamePascal,
		},
		{
			from: new RegExp(placeholders.LIBRARY_NAME_KEBAB_CASE, "g"),
			to: newPackageName,
		},
		{
			from: new RegExp(placeholders.LIBRARY_NAME_FRIENDLY, "g"),
			to: answers.libNameFriendly,
		},
		{
			from: new RegExp(placeholders.LIBRARY_DESCRIPTION, "g"),
			to: answers.libDescription,
		},
		{ from: new RegExp(placeholders.AUTHOR_NAME, "g"), to: answers.authorName },
		{
			from: new RegExp(placeholders.AUTHOR_EMAIL, "g"),
			to: answers.authorEmail,
		},
		{
			from: new RegExp(placeholders.LICENSE_YEAR, "g"),
			to: currentYear.toString(),
		},
	];

	// If the *actual old package name* (detected one, e.g., "my-current-lib")
	// is different from the *generic placeholder* (e.g., "ts-lib") AND
	// is different from the *new package name*, then we also need to replace occurrences
	// of this *actual old package name*.
	if (
		actualOldPackageName !== placeholders.LIBRARY_NAME_KEBAB_CASE &&
		actualOldPackageName !== newPackageName
	) {
		replacements.push({
			from: new RegExp(
				actualOldPackageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
				"g",
			),
			to: newPackageName,
		});
	}
	return replacements;
}

/**
 * Performs find and replace operations in specified files and shows diffs.
 * @param {string[]} fileGlobsToProcess - Array of file paths/globs.
 * @param {Array<{from: RegExp, to: string}>} replacements - Array of replacement objects.
 * @returns {Promise<boolean>} True if all files processed successfully.
 */
async function performTextReplacementsWithDiff(
	fileGlobsToProcess,
	replacements,
) {
	log("Performing text replacements and showing diffs...", "info");
	let allProcessedSuccessfully = true;

	for (const fileGlob of fileGlobsToProcess) {
		const actualFilePaths = await glob(fileGlob, {
			nodir: true,
			cwd: process.cwd(),
			absolute: true,
			ignore: ["**/node_modules/**", "**/.git/**"],
		});

		if (actualFilePaths.length === 0) {
			log(`No files matched pattern: ${fileGlob}`, "info");
			continue;
		}

		for (const filePath of actualFilePaths) {
			let originalContent;
			try {
				originalContent = await fs.readFile(filePath, "utf-8");
			} catch (readError) {
				log(
					`Warning: Could not read file ${path.relative(process.cwd(), filePath)} for diffing: ${readError.message}`,
					"warn",
				);
				allProcessedSuccessfully = false;
				continue;
			}

			const replaceOptionsForFile = {
				files: filePath,
				from: replacements.map((r) => r.from),
				to: replacements.map((r) => r.to),
			};

			try {
				const singleFileResults = await replaceInFile(replaceOptionsForFile);

				if (singleFileResults?.[0]?.hasChanged) {
					const newContent = await fs.readFile(filePath, "utf-8");
					log(`Updated: ${path.relative(process.cwd(), filePath)}`, "success");
					displayDiff(
						path.relative(process.cwd(), filePath),
						originalContent,
						newContent,
					);
				} else {
					log(
						`No textual changes for: ${path.relative(process.cwd(), filePath)}`,
						"debug",
					);
				}
			} catch (error) {
				log(
					`Warning: Could not process file ${path.relative(process.cwd(), filePath)}: ${error.message}`,
					"warn",
				);
				allProcessedSuccessfully = false;
			}
		}
	}

	if (allProcessedSuccessfully) {
		log("Text replacements and diffing completed.", "success");
	} else {
		log("Text replacements and diffing completed with some warnings.", "warn");
	}
	return allProcessedSuccessfully;
}

/**
 * Updates filters in the root package.json if necessary.
 * @param {string} oldPackageFilterName - The old package name used in filters (source package dir name).
 * @param {string} newPackageFilterName - The new package name for filters (target package dir name).
 * @returns {Promise<boolean>} True if successful or no update needed, false on error.
 */
async function updateRootPackageJsonFilters(
	oldPackageFilterName,
	newPackageFilterName,
) {
	if (oldPackageFilterName === newPackageFilterName) {
		return true;
	}

	log(
		`Updating filters in root package.json from '${oldPackageFilterName}' to '${newPackageFilterName}'...`,
		"info",
	);
	try {
		const rootPkgPath = path.join(process.cwd(), "package.json");
		if (!(await fs.pathExists(rootPkgPath))) {
			log("Root package.json not found. Skipping filter update.", "warn");
			return true;
		}

		const originalContent = await fs.readFile(rootPkgPath, "utf-8");
		let newContent = originalContent;

		const escapedOldFilter = oldPackageFilterName.replace(
			/[.*+?^${}()|[\]\\]/g,
			"\\$&",
		);
		const oldFilterPattern = new RegExp(`--filter ${escapedOldFilter}\\b`, "g");
		const newFilterString = `--filter ${newPackageFilterName}`;

		let madeChange = false;
		if (oldFilterPattern.test(newContent)) {
			newContent = newContent.replace(oldFilterPattern, newFilterString);
			madeChange = true;
		}

		if (madeChange) {
			await fs.writeFile(rootPkgPath, newContent, "utf-8");
			log("Updated filters in root package.json.", "success");
			displayDiff("package.json (root)", originalContent, newContent);
		} else {
			log(
				"No filters matching the old package name found in root package.json.",
				"info",
			);
		}
		return true;
	} catch (error) {
		log(`Error updating root package.json: ${error.message}`, "error");
		return false;
	}
}

/**
 * Main function to run the project initialization script.
 */
async function run() {
	log("🚀 Starting project initialization...", "info");

	const {
		PLACEHOLDERS,
		INITIAL_TEMPLATE_PACKAGE_DIR_NAME,
		FILES_TO_PROCESS_FOR_PLACEHOLDERS_TEMPLATE,
		PACKAGE_DIR_PLACEHOLDER_STRING,
	} = SCRIPT_CONFIG;

	// 1. Detect the actual source package directory name
	const sourcePackageDirName = await detectSourcePackageDir(
		INITIAL_TEMPLATE_PACKAGE_DIR_NAME,
	);
	if (!sourcePackageDirName) {
		log("Could not determine the source package directory. Aborting.", "error");
		process.exit(1);
	}
	log(
		`Using '${sourcePackageDirName}' as the current package directory name.`,
		"info",
	);

	// 2. Get user input
	const answers = await promptForProjectDetails(
		PLACEHOLDERS,
		sourcePackageDirName,
	);

	// 3. Determine if package directory should be renamed and what the new name is.
	const shouldRenameDir =
		!!answers.confirmRenamePackageDir &&
		answers.libNameKebab !== sourcePackageDirName;
	const targetPackageDirName = shouldRenameDir
		? answers.libNameKebab
		: sourcePackageDirName;

	// 4. Rename the example package directory if needed
	if (shouldRenameDir) {
		const renameSuccess = await renamePackageDirectory(
			sourcePackageDirName,
			targetPackageDirName,
			true,
		);
		if (!renameSuccess) {
			log(
				"Critical error during directory renaming. Aborting further file processing.",
				"error",
			);
			process.exit(1);
		}
	} else {
		log("Package directory rename not requested or not needed.", "info");
	}

	// 5. Prepare list of files to process, using the targetPackageDirName
	const filesToProcess = FILES_TO_PROCESS_FOR_PLACEHOLDERS_TEMPLATE.map(
		(filePathTemplate) =>
			filePathTemplate.replace(
				new RegExp(PACKAGE_DIR_PLACEHOLDER_STRING, "g"),
				targetPackageDirName,
			),
	);

	// 6. Define replacements
	//    actualOldPackageName is sourcePackageDirName (what was detected/started with)
	//    newPackageName is answers.libNameKebab (what the user wants for the package name content)
	const replacements = buildReplacements(
		answers,
		PLACEHOLDERS,
		CURRENT_YEAR,
		sourcePackageDirName,
		answers.libNameKebab,
	);

	// 7. Perform text replacements in files and show diffs
	await performTextReplacementsWithDiff(filesToProcess, replacements);

	// 8. Update root package.json scripts if they explicitly filter for the old package name
	//    oldPackageFilterName is sourcePackageDirName
	//    newPackageFilterName is targetPackageDirName (which reflects the directory name on disk)
	await updateRootPackageJsonFilters(
		sourcePackageDirName,
		targetPackageDirName,
	);

	log("🎉 Project initialization complete! 🎉", "success");
	log("Next steps:", "warn");
	log(
		"  1. Review all changes, especially in package.json files and CI workflows.",
		"warn",
	);
	log(
		"  2. Run `pnpm install` (or your package manager's install command) to update dependencies and links.",
		"warn",
	);
	log("  3. Commit the changes to your repository.", "warn");
	log(
		`  4. If the package was changed (from '${sourcePackageDirName}' to '${targetPackageDirName}'), consider cleaning up example code in 'packages/${targetPackageDirName}/src' and related tests.`,
		"warn",
	);
}

// --- Script Execution ---
run().catch((error) => {
	if (error.isTtyError) {
		log(
			"Error: Prompt could not be rendered in the current environment.",
			"error",
		);
	} else {
		log(
			`An unexpected error occurred during initialization: ${error.message}`,
			"error",
		);
		if (error.stack) {
			console.error(error.stack);
		}
	}
	process.exit(1);
});
