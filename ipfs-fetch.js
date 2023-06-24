import { create } from 'kubo-rpc-client'
import fs from 'fs';
import tar from 'tar';
import { pipeline } from 'stream';
import dotenv from 'dotenv';

async function fetchAndExtractDirectory(cid, targetLocation) {
    // Connect to IPFS
    dotenv.config();
    const API_KEY = process.env.IPFS_API_KEY;
    const API_KEY_SECRET = process.env.IPFS_API_KEY_SECRET;
    const auth = 'Basic ' + Buffer.from(API_KEY + ':' + API_KEY_SECRET).toString('base64');

    const ipfs = create({
        protocol: process.env.IPFS_PROTOCOL,
        host: process.env.IPFS_HOST,
        port: process.env.IPFS_PORT,
        headers: {authorization: auth}
    });

    try {
        // Download tar and save locally
        const getResponse = ipfs.get(cid);
        const tarPath = 'temp/folder.tar';
        const writeStream = fs.createWriteStream(tarPath);
        
        await new Promise((resolve, reject) => {
            pipeline(getResponse, writeStream, (error) => {
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
        file: tarPath,
        cwd: targetLocation,
        strip: 1    // skip top level folder
      });

    // Delete temp tar file
      fs.unlinkSync(tarPath);
    } 
    catch (error) {
      console.error(error);
    }
}


const foldercid = 'QmSsNT1cVFieB5sU2vZDo6MHx6TrKAFvzzEsK329me5qV3'
const assetsFolder = "./react-flappy-bird/src/res"

if(fs.existsSync(assetsFolder)) {
    fs.rmSync(assetsFolder, {recursive: true})
}
fetchAndExtractDirectory(foldercid, assetsFolder);