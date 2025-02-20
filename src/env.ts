import { hexToUint8Array } from "./util.js";

if (!Bun.env.SERVICE_URL) throw new Error("SERVICE_URL is not set");
if (!Bun.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set");
if (!Bun.env.RELAYS) throw new Error("RELAYS is not set");
if (!Bun.env.TRANSPORTS) throw new Error("TRANSPORTS is not set");

export const SERVICE_URL = Bun.env.SERVICE_URL;
export const PRIVATE_KEY = hexToUint8Array(Bun.env.PRIVATE_KEY);
export const RELAYS = Bun.env.RELAYS.split(",");
export const TRANSPORTS_METHODS = Bun.env.TRANSPORTS.split(",");
