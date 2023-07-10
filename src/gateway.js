import { getFirstOwnedAsset } from './asset-token.js';
import fs from 'fs';

export class Gateway {
    constructor(gateway) {
        this.gateway = gateway;
        // eg. 'http://127.0.0.1:8080'
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
        
        const url = new URL(ipfsHash, this.gateway);
        return(url)
    }

    async  _fetchJsonFromIpfs(ipfsHash) {
        const url = this.urlFromCid(ipfsHash);
        const response = await fetch(url);

        if(response.headers.get('content-type') !== 'application/json') {
            console.error("CID does not resolve to json file.");
            return(null);
        }
        const json = await response.json();
        return json;
    }

    async urlFromJsonEntry(filePath, key) {
        if(!fs.existsSync(filePath)) {
            throw new Error('json not found')
        }
    
        const jsonList = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const entry = jsonList[key];
    
        const type = entry.type
        if(!type) {
            console.error("Error parsing entry:", entry);
            throw new Error("Invalid JSON Entry. No 'type' found.");
        }

        if(type == 'common') {
            const hash = entry.hash;
            const url = this.urlFromCid(hash);
            console.log(url.toString())
            return url.toString();
        } 
        else if(type == 'ownable') {
            const accountAddress = '0x061de0875047bc07960EB1F2146Bf0097d262Bb1'
            const { baseUri, deployAddress } = entry;
            const token = await getFirstOwnedAsset(deployAddress, accountAddress)
            
            const jsonCID = `${baseUri}/${token}`;
            const json = await this._fetchJsonFromIpfs(jsonCID);
            const url = this.urlFromCid(json.image);

            console.log(url.toString())
            return(url.toString())
        } 
        else {
            throw new Error("Invalid type: ", type)
        }
    
    }
}

const gateway = new Gateway('http://127.0.0.1:8080')
const hash = 'bafybeiai4sbueeddmtutqwsm2bhkm3ws4xfykeapccazpzx6tubttbdqn4/0';

gateway.urlFromJsonEntry('test.json', "oimages")