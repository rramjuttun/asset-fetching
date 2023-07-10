const fs = require('fs');

function fetchFromGateway(gateway, cid) {
    return;
}

function fetchFromNode(apiEndpoint) {
    return;
}

async function downloadLocal(ipfsInstance, cid) {
    return;
}

async function getCID() {
    const { getImageCID } = await import('./image-cid-from-json.mjs')

    const jsonCID = 'bafybeiai4sbueeddmtutqwsm2bhkm3ws4xfykeapccazpzx6tubttbdqn4/0'
    const imageCID = 'bafybeibsxhin2shpkokl3kdohwtsscqkmc6gclgiluong3spicw5ea4neq'
    console.log(await getImageCID(jsonCID));
}


