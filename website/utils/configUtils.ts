import fs from "node:fs";
import path from "node:path";
import type { PluginConfig } from "@docusaurus/types";
import logger from "./logger";

// --- Site Level Constants ---
export const GITHUB_USERNAME = "lkd0x0is";
export const PROJECT_NAME = "ts-lib-template"; // The name of the repository
export const PROJECT_TITLE = "TS Lib"; // The display name for the project
export const PROJECT_TAGLINE = "A collection of awesome TypeScript libraries";

/**
 * Checks if a directory entry is a valid package directory.
 * Excludes common non-package dirs like 'template' or dot-prefixed dirs.
 */
function isValidPackageDir(entry: fs.Dirent): boolean {
	const packageName = entry.name;
	return (
		entry.isDirectory() &&
		!packageName.startsWith(".") &&
		packageName !== "template"
	);
}

/**
 * Scans the 'packages/' directory to find package names that have API docs.
 */
export function getPackagesWithApiDocs(packagesBasePath: string): string[] {
	logger.info(`Scanning for packages with API docs in: ${packagesBasePath}`);
	if (!fs.existsSync(packagesBasePath)) {
		logger.warn("Packages directory not found. No API docs will be generated.");
		return [];
	}

	try {
		const packages = fs
			.readdirSync(packagesBasePath, { withFileTypes: true })
			.filter(isValidPackageDir)
			.map((entry) => entry.name)
			.filter((packageName) => {
				const apiDocsPath = path.join(
					packagesBasePath,
					packageName,
					"docs-markdown",
				);
				const hasDocs =
					fs.existsSync(apiDocsPath) &&
					(fs.existsSync(path.join(apiDocsPath, "index.md")) ||
						fs.existsSync(path.join(apiDocsPath, "index.markdown")));
				if (hasDocs) {
					logger.info(` -> Found API docs for package: '${packageName}'`);

					const apiEntries = fs.readdirSync(apiDocsPath, {
						withFileTypes: true,
					});

					const docsNum = apiEntries.filter(
						(v) => v.isFile() && v.name.includes("md"),
					).length;

					logger.info(`Found ${docsNum} API markdown docs`);
				}
				return hasDocs;
			})
			.sort();

		if (packages.length === 0) {
			logger.warn("No packages with valid API documentation were found.");
		} else {
			logger.info(
				`Successfully found ${packages.length} package(s) with API docs.`,
			);
		}
		return packages;
	} catch (error) {
		logger.error(
			`Error while scanning packages directory ${packagesBasePath}:`,
			error,
		);
		return [];
	}
}

/**
 * Generates the Docusaurus plugin configuration for each package with API docs.
 */
export function generateApiDocsPlugins(
	packages: string[],
	baseDir: string,
): PluginConfig[] {
	logger.info("Generating API documentation plugins...");

	return packages.map((packageName) => {
		const apiDocsPath = path.join(
			"..",
			"packages",
			packageName,
			"docs-markdown",
		);
		const sidebarFilePath = "./sidebarsApi.ts";

		if (!fs.existsSync(path.resolve(baseDir, sidebarFilePath))) {
			logger.warn(
				`Sidebar file not found for package '${packageName}': ${sidebarFilePath}\n` +
					`API docs for '${packageName}' might not have a working sidebar.`,
			);
		}

		return [
			"@docusaurus/plugin-content-docs",
			{
				id: `api-${packageName}`,
				path: apiDocsPath,
				routeBasePath: `api/${packageName}`,
				sidebarPath: sidebarFilePath,
			},
		];
	});
}
