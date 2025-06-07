const COLORS = {
	reset: "\x1b[0m",
	green: "\x1b[32m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
};

const LOG_TYPE_COLORS = {
	default: COLORS.reset,
	info: COLORS.reset,
	success: COLORS.green,
	warn: COLORS.yellow,
	error: COLORS.red,
	debug: COLORS.blue,

	green: COLORS.green,
	red: COLORS.red,
	yellow: COLORS.yellow,
};

/**
 * Logs a message to the console with specified styling based on type.
 * @param {any} message - The message to log. Will be converted to a string.
 * @param {string} type - The type of message (e.g., "info", "success", "warn", "error", "debug",
 * or a direct color like "green"). Defaults to "info".
 */
const log = (message, type = "info") => {
	const color = LOG_TYPE_COLORS[type.toLowerCase()] || LOG_TYPE_COLORS.default;
	const messageStr = String(message);

	if (process.stdout.isTTY) {
		if (color === COLORS.reset) {
			console.log(messageStr);
		} else {
			console.log(`${color}${messageStr}${COLORS.reset}`);
		}
	} else {
		console.log(messageStr);
	}
};

export default log;
