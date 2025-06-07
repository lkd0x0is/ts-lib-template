import path from "node:path";
import { diffLines } from "diff";

import log from "./log.mjs";

/**
 * Displays a colorized diff of changes between old and new text.
 * @param {string} filePath - The path of the file being diffed (for context).
 * @param {string} oldText - The original text content.
 * @param {string} newText - The new text content.
 */
function displayDiff(filePath, oldText, newText) {
	log(`--- Diff for ${path.basename(filePath)} ---`, "info");
	const diffResult = diffLines(oldText, newText);
	let hasChanges = false;

	// biome-ignore lint/complexity/noForEach: <explanation>
	diffResult.forEach((part) => {
		const lines = part.value.split("\n");
		lines.forEach((line, index) => {
			if (index === lines.length - 1 && line === "") return;
			if (part.added) {
				log(`+ ${line}`, "success");
				hasChanges = true;
			} else if (part.removed) {
				log(`- ${line}`, "error");
				hasChanges = true;
			}
		});
	});

	if (!hasChanges) {
		log("No textual changes detected in this file.", "info");
	}
	log(`--- End Diff for ${path.basename(filePath)} ---`, "info");
}

export default displayDiff;
