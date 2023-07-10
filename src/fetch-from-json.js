const fs = require('fs');
const { fetchAndExtractDirectory } = require('./ipfs-fetch.js');
const { getFirstOwnedAsset } = require('./get-asset-token.js')

async function fetchFromJson(filePath) {
    const { getImageCID } = await import('./image-cid-from-json.mjs');

    if(!fs.existsSync(filePath)) {
        throw new Error('json not found')
    }

    const jsonList = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for(const entry of jsonList) {
        const { directory, type } = entry;

        if(!type || !directory) {
            console.error("Error parsing entry:", entry);
            throw new Error("Invalid JSON Entry");
        }

        if(type == 'common') {
            const { hash } = entry;
            await fetchAndExtractDirectory(hash, directory)
        } 
        else if(type == 'ownable') {
            const accountAddress = '0x061de0875047bc07960EB1F2146Bf0097d262Bb1'
            const { baseUri, deployAddress } = entry;
            const token = await getFirstOwnedAsset(deployAddress, accountAddress)
            const jsonCID = `${baseUri}/${token}`;
            const imageCID = await getImageCID(jsonCID)
            await fetchAndExtractDirectory(imageCID, directory)
        } 
        else {
            throw new Error("Invalid type: ", type)
        }
    };
}

fetchFromJson('test.json');


