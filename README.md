# IPFS Assets Service Worker 

This library provides a service worker for a website deployed on IPFS to fetch other IPFS assets. If accessed from IPFS, it will use the current gateway or subdomain where the page is being accessed from as the provider for the requested assets.

## Features
* Get a fetch URL from a CID using a gateway or subdomain.
* Get a fetch URL for a user's first owned asset in an ERC721 NFT collection.

## Use

### Install and import 
Install the package using 
```bash
npm install https://github.com/rramjuttun/assets-to-nfts
```

Import the package into your project using 
```js
import { Gateway } from 'ipfs-gateway-fetch'
```

### Create

#### `new Gateway(rootURL, accountAddress?, ethURI?)`

> create a gateway object

#### Parameters

| Name     | Type                                                                 | Required                                          | Description                                                                                                    |
| -------- | -------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| location      | `Location` or `String`                                     | `Yes`                 | The location where the website is being accessed from. If the app is being hosted on IPFS, it should be `document.location` or `window.location`. The gateway will attempt to use the same host when requesting other IPFS content. If the app is not being hosted on IPFS, it should be a URL resolving to a IPFS gateway.  (`https://ipfs.io` for example) |
| accountAddress | `String`                                                             | `No`                                         | The public wallet address of the user accessing the website. Only required if fetching NFT assets.                                                             |
| ethURI     | `String` or `Provider`                                                            | `No`                                    | A URL that resolves to a node on a blockchain network or an instance of an [EIP-1193 Provider](https://eips.ethereum.org/EIPS/eip-1193) (`window.ethereum` for example). Only required if fetching NFT assets.                                                                |                                             |

## Methods
### urlFromCid(cid)
Returns a url to an IPFS asset given by `cid`. If the root location is accessed by a subdomain, then an absolute url using the same subdomain is returned. Otherwise, a relative URL is returned as recommended by the IPFS documentation.  

**Example: Subdomain** 

Assume the website is being accessed from `http://<CID>.ipfs.localhost:8080` (a subdomain link)
```js
const gateway = new Gateway(document.location)
gateway.urlFromCid('bafybeicaubxlzbr4sgc3tfwakfn7ganskxlgxmx25pdrcsojchgs3xpfqq')
```
Returns `http://bafybeicaubxlzbr4sgc3tfwakfn7ganskxlgxmx25pdrcsojchgs3xpfqq.ipfs.localhost:8080`

**Example: Gateway** 

Assume the website is being accessed from `http://localhost:8080/ipfs/<CID>` (a gateway link)
```js
const gateway = new Gateway(document.location)
const url = gateway.urlFromCid('bafybeicaubxlzbr4sgc3tfwakfn7ganskxlgxmx25pdrcsojchgs3xpfqq')
```
Returns `/ipfs/bafybeicaubxlzbr4sgc3tfwakfn7ganskxlgxmx25pdrcsojchgs3xpfqq`

**Example: Not being accessed from IPFS**

Assume the website is not being accessed from IPFS and instead from a dedicated hosting website. An IPFS gateway would then be explicitly required.
```js
const gateway = new Gateway("https://ipfs.io")
const url = gateway.urlFromCid('bafybeicaubxlzbr4sgc3tfwakfn7ganskxlgxmx25pdrcsojchgs3xpfqq')
```
Returns `https://ipfs.io/ipfs/bafybeicaubxlzbr4sgc3tfwakfn7ganskxlgxmx25pdrcsojchgs3xpfqq`

### `urlFromJsonEntry(json, key)`
Returns a url to the IPFS object in `json` given by `key`. Requires `accountAddress` and `ethURI` to be given to the constructor.   

`json` must be in the [format generated by the IPFS Upload Extension](https://github.com/rramjuttun/vscode-asset-converter#extension-commands). If the type of the json entry is `ownable`, then the function will query the blockchain and IPFS for the first asset owned by `accountAddress` 

**Example**

```json
{
  "src/assets/birds": {
    "baseUri": "ipfs://ba...",
    "deployAddress": "0x...",
    "type": "ownable"
  }
}
```

```js
import json from './assets.json'
const gateway = new Gateway(document.location, "0x...", window.ethereum)
const url = await gateway.urlFromJsonEntry(json, "src/assets/birds")
```

Returns a url to the first asset owned by accountAddress in the given smart contract. The url format is the same as returned by the `urlFromCid(cid)` method.





