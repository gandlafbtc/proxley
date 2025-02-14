import debug from "debug";
if (!process.env.DEBUG)
    debug.enable("proxy, proxy:*");
const logger = debug("proxy");
const errorLogger = debug("proxy:error");
export { logger, errorLogger };
export default logger;
//# sourceMappingURL=logger.js.map