const fs = require('fs');
const tar = require('tar');
const { pipeline } = require('stream');
const dotenv = require('dotenv');

async function fetchAndExtractDirectory(cid, targetLocation) {
    const { create } = await import('kubo-rpc-client');

	if(cid.startsWith('ipfs://')) {
		cid = cid.slice(7);
	}
	if(cid.startsWith('/ipfs/')) {
		cid = cid.slice(6);
	}

    // Connect to IPFS
    dotenv.config();
    const API_KEY = process.env.IPFS_API_KEY;
    const API_KEY_SECRET = process.env.IPFS_API_KEY_SECRET;
    const auth = 'Basic ' + Buffer.from(API_KEY + ':' + API_KEY_SECRET).toString('base64');

    const ipfs = await create({
        url: process.env.IPFS_API_ENDPOINT+"/api/v0",
        headers: {authorization: auth}
    });

    if(!await ipfs.isOnline()) {
        throw new Error("Not connected to a running and valid IPFS node");
   	}

    try {
		let tarFile;
		const fetchedFolder = ipfs.get(cid);

		// Download tar and save locally to temp location
		tarFile = './temp/folder.tar';
		const writeStream = fs.createWriteStream(tarFile);
		
		await new Promise((resolve, reject) => {
			pipeline(fetchedFolder, writeStream, (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});

		// Extract tar
		fs.mkdirSync(targetLocation, { recursive: true });

		await tar.extract({
			file: tarFile,
			cwd: targetLocation,
			strip: 0   // skip top level folder
		});
	
		// Delete temp tar file
		//fs.unlinkSync(tarFile);
    } 
    catch (error) {
      console.error(error);
    }
}
// const foldercid = 'bafybeibsxhin2shpkokl3kdohwtsscqkmc6gclgiluong3spicw5ea4neq';
// const cid = 'bafybeibsxhin2shpkokl3kdohwtsscqkmc6gclgiluong3spicw5ea4neq/black.png'
// fetchAndExtractDirectory(cid, './images')

module.exports = {
	fetchAndExtractDirectory
}