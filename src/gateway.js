import { getFirstOwnedAsset } from './chain-interface.js';

export class Gateway {
    /**
     * Create a new Gateway instance.
     * @param {URL|string} location - The base location for generating URLs. Use window.location or provide an override gateway as a string.
     * @param {string} accountAddress - The account address for ownership checks. Only required if fetching NFT assets.
     * @param {string} ethURI - Ethereum URI endpoint. Only required if fetching NFT assets.
    */
    constructor(location, accountAddress="", ethURI="") {
        this.location = location; // document.location
        this.accountAddress = accountAddress;
        this.ethURI = ethURI;
    }


    /**
     * Generate a URL from an IPFS CID. Supports both gateways and subdomains.
     * @param {string} ipfsHash - The IPFS CID or hash.
     * @returns {string} The generated URL.
     * @throws {Error} If the provided CID is invalid.
    */
    urlFromCid(ipfsHash) {
        //change to gateway url path
        if(ipfsHash.startsWith('ipfs://')) {
            ipfsHash = ipfsHash.slice(7);
        }
        if(ipfsHash.startsWith('/ipfs/')) {
            ipfsHash = ipfsHash.slice(6);
        }

        // Check if valid CID. Starts with Qm for CIDv0 and ba for CIDv1
        if(!ipfsHash.startsWith('Qm') && !ipfsHash.startsWith('ba')) {
            throw new Error('Invalid CID Provided.');
        }
        
        // Check if a manual gateway was provided.
        if(typeof this.location === 'string') {
            const url = new URL(`/ipfs/${ipfsHash}`, this.location);
            return(url.toString());
        }
        else {
            const host = this.location.host.split('.', 2);

            // If subdomain, replace hash with new one. If gateway, use relative url.
            // Subdomain format: https://<cidv1b32>.ipfs.<gateway-host>.tld/path/to/resource
            if(host.length >= 2 && host[1] === 'ipfs') {
                const origin = this.location.origin;
                const split = ipfsHash.split('/')

                return(`${origin.replace(host[0], split[0])}/${split.slice(1).join('/')}`)
            }
            else {
                return('/ipfs/'+ipfsHash)   // default to relative url
            } 
        }    
    }

    /**
     * @private
    */
    async  _fetchJsonFromIpfs(ipfsHash) {
        const url = this.urlFromCid(ipfsHash);
        const response = await fetch(url.toString());
        
        if(response.headers.get('content-type') !== 'application/json') {
            console.error("CID does not resolve to json file.");
            return;
        }

        const json = await response.json();
        return json;
    }

     /**
     * Generate a URL from a JSON entry in a list.
     * @param {object} jsonList - A json with every entry.
     * @param {string} key - The key corresponding to the desired entry.
     * @returns {Promise<string>} A promise that resolves to the generated URL. Empty string if no assets are owned or 
     * @throws {Error} If the JSON entry is invalid or no account address/ethURI is available.
    */
    async urlFromJsonEntry(jsonList, key) {
        const entry = jsonList[key];
    
        const type = entry.type
        if(!type) {
            console.error("Error parsing entry:", entry);
            throw new Error("Invalid JSON Entry. No 'type' found.");
        }
 
        if(type === 'ownable') {
            if(!this.accountAddress) {
                throw new Error("No account address found.")
            }
            if(!this.ethURI) {
                throw new Error("No chain URI endpoint found.")
            }
            
            const { baseUri, deployAddress } = entry;
            const token = await getFirstOwnedAsset(deployAddress, this.accountAddress, this.ethURI);
            if(token === null) {
                return(""); // Account does not own any assets
            }
            
            const jsonCID = `${baseUri}${token}`;
            const json = await this._fetchJsonFromIpfs(jsonCID);
            
            const url = this.urlFromCid(json.image);
            return(url.toString())
        } 
        else {
            throw new Error("Invalid type: ", type);
        }
    }
}
