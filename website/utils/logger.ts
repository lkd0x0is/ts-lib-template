
const LOG_PREFIX = "[Docusaurus-Config]";

/**
 * A simple logger for consistent console output during the build process.
 */
 const logger = {
  info: (...args: unknown[]) => console.log(LOG_PREFIX, "INFO:", ...args),
  warn: (...args: unknown[]) => console.warn(LOG_PREFIX, "WARN:", ...args),
  error: (...args: unknown[]) => console.error(LOG_PREFIX, "ERROR:", ...args),
  debug: (label: string, data: unknown) => {
    console.log(`\n${LOG_PREFIX} DEBUG: ${label}`);
    console.dir(data, { depth: null });
  },
};

export default logger