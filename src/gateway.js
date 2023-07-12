import { getFirstOwnedAsset } from './chain-interface.js';

export class Gateway {
    constructor(gateway, accountAddress="", ethURI="") {
        this.gateway = gateway; // eg. 'http://127.0.0.1:8080'
        this.accountAddress = accountAddress;
        this.ethURI = ethURI;
    }

    urlFromCid(ipfsHash) {
        //change to gateway url path
        if(ipfsHash.startsWith('ipfs://')) {
            ipfsHash = ipfsHash.replace('ipfs://', '/ipfs/')
        }
        if(!ipfsHash.startsWith('/ipfs/')) {
            ipfsHash = '/ipfs/'+ipfsHash;
        }

        // length 52 for CIDv0 and 65 for CIDv1
        if(!ipfsHash.startsWith('/ipfs/Qm') && !ipfsHash.startsWith('/ipfs/ba')) {
            console.error('Invalid CID Provided.');
            return(null);
        }
        
        const url = new URL(this.gateway);
        url.pathname = ipfsHash;
        return(url)
    }

    async  _fetchJsonFromIpfs(ipfsHash) {
        const url = this.urlFromCid(ipfsHash);
        console.log(url)
        const response = await fetch(url);

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

        if(type == 'common') {
            const hash = entry.hash;
            const url = this.urlFromCid(hash);
            return url.toString();
        } 
        else if(type == 'ownable') {
            if(!this.accountAddress) {
                throw new Error("No account address found.")
            }
            if(!this.ethURI) {
                throw new Error("No chain URI endpoint found.")
            }
            
            const { baseUri, deployAddress } = entry;
            const token = await getFirstOwnedAsset(deployAddress, this.accountAddress, this.ethURI)
            
            const jsonCID = baseUri+token;
            const json = await this._fetchJsonFromIpfs(jsonCID);
            const url = this.urlFromCid(json.image);

            return(url.toString())
        } 
        else {
            throw new Error("Invalid type: ", type)
        }
    
    }
}
