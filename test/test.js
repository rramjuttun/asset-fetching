import { Gateway } from "../src/gateway.js";
import { getFirstOwnedAsset } from "../src/chain-interface.js";
import dotenv from "dotenv";
dotenv.config()

const contractAddress = '0xca5d572f5a7367e58fdbff9f608813ff525707a6';
const accountAddress = '0x061de0875047bc07960EB1F2146Bf0097d262Bb1'
const nodeURI = process.env.ETH_NODE_URI

const first = await getFirstOwnedAsset(contractAddress, accountAddress, nodeURI);
console.log(first)

const gateway = new Gateway('http://127.0.0.1:8080', accountAddress, nodeURI)
const filePath = './test.json';
const jsonFile = await import(filePath, {assert: { type: 'json' }});

let url = await gateway.urlFromJsonEntry(jsonFile.default, "common")
console.log(url)

url = await gateway.urlFromJsonEntry(jsonFile.default, "ownable")
console.log(url)
