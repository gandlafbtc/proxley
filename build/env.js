import "dotenv/config";
import { hexToUint8Array } from "./util.js";
if (!process.env.MINT_URL)
    throw new Error("MINT_URL is not set");
if (!process.env.PRIVATE_KEY)
    throw new Error("PRIVATE_KEY is not set");
if (!process.env.RELAYS)
    throw new Error("RELAYS is not set");
if (!process.env.TRANSPORTS)
    throw new Error("TRANSPORTS is not set");
export const MINT_URL = process.env.MINT_URL;
export const PRIVATE_KEY = hexToUint8Array(process.env.PRIVATE_KEY);
export const RELAYS = process.env.RELAYS.split(",");
export const TRANSPORTS_METHODS = process.env.TRANSPORTS.split(",");
//# sourceMappingURL=env.js.map