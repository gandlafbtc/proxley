import NDK, { NDKEvent, NDKPrivateKeySigner, NostrEvent } from "@nostr-dev-kit/ndk";
import { nip19, nip44 } from "nostr-tools";
import { SERVICE_URL, PRIVATE_KEY, RELAYS, TRANSPORTS_METHODS } from "./env";
import { log, setUpLogger } from "./logger";


const signer = new NDKPrivateKeySigner(PRIVATE_KEY);

const ndk = new NDK({ explicitRelayUrls: RELAYS, signer });

const kind = 23338;

setUpLogger().then(()=> {
  log.info(`running proxley`)
  ndk
  .connect()
  .then(() => {
    log.info("Connected to relays");
    main();
  })
  .catch((e) => {
    log.error("Failed to connect to relays", e);
  });
}
)
async function main() {
  const publicKey = (await signer.user()).pubkey;

  log.debug(`My npub is ${nip19.npubEncode(publicKey)}`);

  if (!(await hasPublishedTransportAnnouncement(publicKey))) {
    await announceTransports(publicKey);
  }

  const requestFilter = {
    kinds: [kind],
    "#p": [publicKey],
    since: Math.floor(Date.now() / 1000),
  };

  log.debug("Subscribing to request events", requestFilter);

  const sub = ndk.subscribe(requestFilter, { closeOnEose: false });

  sub.on("event", (event: NDKEvent) => {
    handleRequest(event);
  });
}

async function hasPublishedTransportAnnouncement(publicKey: string): Promise<boolean> {
  const filter = { kinds: [11111], authors: [publicKey] };
  const event = await ndk.fetchEvent(filter);

  event && log.debug(`Transport announcement: ${event.tags}`);

  return !!event;
}

async function announceTransports(publicKey: string) {
  const transports = TRANSPORTS_METHODS.map((method) => {
    if (method === "nipxx") {
      return ["nipxx", publicKey];
    } else if (method === "clearnet") {
      return ["clearnet", SERVICE_URL];
    }
  });
  const event = new NDKEvent(ndk, {
    kind: 11111,
    tags: transports,
  } as NostrEvent);

  await event
    .publish()
    .then(() => log.debug("Publish supported transports {transports}", {transports}))
    .catch((e) => log.error("Failed to publish transport announcement", e));
}

async function handleRequest(event: NDKEvent) {
  const { pubkey, content } = event;

  const convoKey = nip44.getConversationKey(PRIVATE_KEY, pubkey);

  const decryptedContent = nip44.decrypt(content, convoKey);

  const request = JSON.parse(decryptedContent) as { method: string; path: string; body: any };

  log.debug("Received request", request);

  const { method, path, body } = request;

  if (!method || !path) {
    log.error("Invalid decrypted content {decryptedContent}", {decryptedContent});
    return;
  }

  const mintResponse = await fetch(`${SERVICE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    body: JSON.stringify(body),
  });

  if (!mintResponse.ok) {
    log.error("Failed to fetch from mint {mintResponse}", {mintResponse});
    return;
  }

  const mintResponseBody = await mintResponse.json();

  await sendResponse(pubkey, convoKey, mintResponseBody);
}

async function sendResponse(requestPubkey: string, convoKey: Uint8Array, response: any) {
  const encryptedContent = nip44.encrypt(JSON.stringify(response), convoKey);

  const responseEvent = new NDKEvent(ndk, {
    kind: 23338,
    content: encryptedContent,
    tags: [["p", requestPubkey]],
  } as NostrEvent);

  responseEvent
    .publish()
    .then(() => {
      log.debug(`Published response event  ${responseEvent.id}`);
    })
    .catch((e) => {
      log.error("Failed to publish response event", e);
    });
}
