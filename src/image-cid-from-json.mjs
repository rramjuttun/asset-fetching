import { extract } from 'it-tar'
import map from 'it-map'
import { pipe } from 'it-pipe'
import all from 'it-all'
import dotenv from 'dotenv'
import toBuffer from 'it-to-buffer'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { json } from 'stream/consumers'

async function * tarballed(source) {
	yield * pipe(
		source,
		extract(),
		async function * (source) {
			for await (const entry of source) {
				yield {
					...entry,
					body: await toBuffer(map(entry.body, (buf) => buf.slice()))
				}
			}
		}
	)
}

export async function getImageCID(jsonCID) {
	const { create } = await import('kubo-rpc-client');

	if(jsonCID.startsWith('ipfs://')) {
		jsonCID = jsonCID.slice(7);
	}
	if(jsonCID.startsWith('/ipfs/')) {
		jsonCID = jsonCID.slice(6);
	}

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

	const output = await pipe(
		ipfs.get(jsonCID),
		tarballed,
		(source) => all(source)
	)

	const jsonInfo = JSON.parse(uint8ArrayToString(output[0].body))
    return(jsonInfo.image);
}