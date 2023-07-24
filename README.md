# IPFS Assets Service Worker 

This library provides a service worker for a website deployed on IPFS to fetch other IPFS assets. It will use the current gateway or subdomain where the page is being accessed from as the provider for the requested assets. 

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
| rootURL      | `Location`                                     | `Yes`                 | The location where the website is being accessed from. It should be `document.location` or `window.location`. The gateway will attempt to use the rootURL as the hostname when requesting other IPFS content.  |
| accountAddress | `String`                                                             | `No`                                         | The public wallet address of the user accessing the website                                                             |
| ethURI     | `String`                                                             | `No`                                    | A URL that resolves to a node on a blockchain network                                                                 |                                             |

### Methods
#### `urlFromCid(cid)`
Returns a urlL to an IPFS asset given by `cid`. If the root location is accessed by a subdomain, then an absolute url using the same subdomain is returned. Otherwise, a relative URL is returned.  

**Example: Subdomain** 

Assume the website is being accessed from `http://<CID>.ipfs.localhost:8080` (a subdomain link)
```js
const gateway = new Gateway(document.location)
gateway.urlFromCid('bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m')
```
Returns `http://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m.ipfs.localhost:8080`

**Example: Gateway** 

Assume the website is being accessed from `http://localhost:8080/ipfs/<CID>` (a gateway link)
```js
const gateway = new Gateway(document.location)
gateway.urlFromCid('bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m')
```
Returns `/ipfs/bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m`

#### `urlFromJsonEntry(json, key)`
Returns a url to the IPFS object in `json` given by `key`. Requires `accountAddress` and `ethURI` to be given to the constructor.   

`json` must be in the [format generated by the IPFS Upload Extension](https://github.com/rramjuttun/vscode-asset-converter#extension-commands). If the type of the json entry is `ownable`, then the function will query the blockchain and IPFS for the first asset owned by `accountAddress` 

**Example: Ownable**

