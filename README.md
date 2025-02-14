# cashu ❤️ nostr

A proxy that allows Cashu mints and wallets to talk to each other over nostr. They just need pubkeys!

This will also create a kind `11111` transport announcement event defined by [NIP-37](https://github.com/nostr-protocol/nips/blob/459e5aaead3e1d4803d2f7798d2c7ab784cfab14/137.md) (open PR). With this, a mint can be identified simply by a pubkey.

see [demo wallet](https://github.com/gudnuf/cashu-proxy-tester) that talks to mints using the below protocol defined as NIP-XX

This projects is an example of the following idea:

### NIP-XX

#### Kind `23338`
```json
{
    "kind": 23338,
    "content": "nip44.encrypt(JSON.stringify(request), convoKey)",
    "tags": [
        [
            "p",
            "requestPubkey"
        ]
    ]
}
```

Where requests and responses are RESTful with the following format:
```ts
{
   method: 'POST' | 'GET';
   path: string; // ie. /v1/melt
   body: any
}
```

>> An open question on these requests is the maximum safe size for events, some relays may reject the event if the `body` is too large

A mint will subscribe to `23338` events tagged with the mint's public key and wallets will initiate communication by broadcasting a `23338` to a mint and then listen for the response.

This means wallets and mints are both making subscriptions to `{ "kind": 23338, "p": service_pubkey }` with the main difference being that mint's will have a static pubkey.

As I'm writing this, I wonder if wallets should subscribe to the event id of the request?

## Mint Discovery

Mint's can announce themselves with a kind `11111` as a "service with a pubkey" and then use that same pubkey to create a nostr profile and advertise the service. 

This could be paired with NIP-87 mint discovery, where the mint is discovered via NIP-87 and then the kind `11111` is used to find the mint's supported transport methods.

Also, mints might want to use the same pubkey advertised in their info endpoint. If mints did this, then wallets could save this pubkey and later look up the mint on nostr.

## Usage

Proxy for any mint by setting `MINT_URL` to the mint you want to proxy for.

Install:

```bash
npm install
```

Use one of the following scripts to start a proxy with a specified environment file.

```bash
npm run start:instance1
```

```bash
npm run start:instance2
```

Or create your own .env and
```bash
npm run start
```


