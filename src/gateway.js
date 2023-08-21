import { getFirstOwnedAsset } from './chain-interface.js';

export class Gateway {
    constructor(rootLocation, accountAddress="", ethURI="") {
        this.rootLocation = rootLocation; // document.location
        this.accountAddress = accountAddress;
        this.ethURI = ethURI;
    }

    urlFromCid(ipfsHash) {
        //change to gateway url path
        if(ipfsHash.startsWith('ipfs://')) {
            ipfsHash = ipfsHash.slice(7);
        }
        if(ipfsHash.startsWith('/ipfs/')) {
            ipfsHash = ipfsHash.slice(6);
        }

        // length 52 for CIDv0 and 65 for CIDv1
        if(!ipfsHash.startsWith('Qm') && !ipfsHash.startsWith('ba')) {
            console.error('Invalid CID Provided.');
            return;
        }
        
        // If subdomain, replace hash with new one. If gateway, use relative url.
        const host = this.rootLocation.host.split('.', 2);
        
        if(host.length >= 2 && host[1] === 'ipfs') {
            const origin = this.rootLocation.origin;
            const split = ipfsHash.split('/')

            return(`${origin.replace(host[0], split[0])}/${split.slice(1).join('/')}`)
        }
        else {
            return('/ipfs/'+ipfsHash)   // default to relative url
        } 
    }

    async  _fetchJsonFromIpfs(ipfsHash) {
        const url = this.urlFromCid(ipfsHash);
        const response = await fetch(url.toString());
        
        if(response.headers.get('content-type') !== 'application/json') {
            console.error("CID does not resolve to json file.");
            return(null);
        }
        const json = await response.json();
        
        return json;
    }

    async urlFromJsonEntry(jsonList, key) {
        const entry = jsonList[key];
    
        const type = entry.type
        if(!type) {
            console.error("Error parsing entry:", entry);
            throw new Error("Invalid JSON Entry. No 'type' found.");
        }

        if(type === 'common') {
            const hash = entry.hash;
            const url = this.urlFromCid(hash);
            return url.toString();
        } 
        else if(type === 'ownable') {
            if(!this.accountAddress) {
                throw new Error("No account address found.")
            }
            if(!this.ethURI) {
                throw new Error("No chain URI endpoint found.")
            }
            
            const { baseUri, deployAddress } = entry;
            const token = await getFirstOwnedAsset(deployAddress, this.accountAddress, this.ethURI)
            
            const jsonCID = `${baseUri}${token}`;
            const json = await this._fetchJsonFromIpfs(jsonCID);
            
            const url = this.urlFromCid(json.image);
            return(url.toString())
        } 
        else {
            console.log("Invalid type: ", type);
            return;
        }
    }
}
