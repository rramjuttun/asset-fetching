import { Gateway } from "../src/gateway.js";
import { getFirstOwnedAsset } from "../src/chain-interface.js";
import assert from 'assert';
import dotenv from "dotenv";

dotenv.config()
const contractAddress = '0xca5d572f5a7367e58fdbff9f608813ff525707a6';
const accountAddress = '0x061de0875047bc07960EB1F2146Bf0097d262Bb1'
const nodeURI = process.env.ETH_NODE_URI

const location1 = {
    hash: '',
    host: 'localhost:8080',
    hostname: 'localhost',
    href: 'http://localhost:8080/ipfs/bafybeigrruwiv26xlepp27i2ayfz3dkkqsz6h5imugbaoabgixbrw6nkaq/',
    origin: 'http://localhost:8080',
    pathname: '/ipfs/bafybeigrruwiv26xlepp27i2ayfz3dkkqsz6h5imugbaoabgixbrw6nkaq/',
    port: '8080',
    protocol: 'http:'
}

const location2 = {
    hash: "#x-ipfs-companion-no-redirect",
    host: "bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m.ipfs.4everland.io",
    hostname: "bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m.ipfs.4everland.io",
    href: "https://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m.ipfs.4everland.io/#x-ipfs-companion-no-redirect",
    origin: "https://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m.ipfs.4everland.io",
    pathname: "/",
    port: "",
    protocol: "https:"
}

const location3 = {
    hash: "",
    host: "bafybeigrruwiv26xlepp27i2ayfz3dkkqsz6h5imugbaoabgixbrw6nkaq.ipfs.localhost:8080",
    hostname: "bafybeigrruwiv26xlepp27i2ayfz3dkkqsz6h5imugbaoabgixbrw6nkaq.ipfs.localhost",
    href: "http://bafybeigrruwiv26xlepp27i2ayfz3dkkqsz6h5imugbaoabgixbrw6nkaq.ipfs.localhost:8080/",
    origin: "http://bafybeigrruwiv26xlepp27i2ayfz3dkkqsz6h5imugbaoabgixbrw6nkaq.ipfs.localhost:8080",
    pathname: "/",
    port: "8080",
    protocol: "http:"
}

function testUrlFromCid() {
    const gateway1 = new Gateway(location1, accountAddress, nodeURI);
    const gateway2 = new Gateway(location2, accountAddress, nodeURI);
    const gateway3 = new Gateway(location3, accountAddress, nodeURI);
    const gateway4 = new Gateway('http://127.0.0.1:8080', accountAddress, nodeURI);

    const folderHash = 'bafybeif4q3r2zz4s5kj44c3fzbseigku6rktgfulnzhqfyrqnacsb5fdru/bird1.png'
    const imageHash = 'bafkreiclqv6folmmrgyiasyd7wfftyvhmcqjxzzbyncmdtgvs7h5xrg6h4'

    assert(gateway1.urlFromCid(folderHash) === '/ipfs/bafybeif4q3r2zz4s5kj44c3fzbseigku6rktgfulnzhqfyrqnacsb5fdru/bird1.png', "1");
    assert(gateway1.urlFromCid(imageHash) === '/ipfs/bafkreiclqv6folmmrgyiasyd7wfftyvhmcqjxzzbyncmdtgvs7h5xrg6h4', "2");

    assert(gateway2.urlFromCid(folderHash) === 'https://bafybeif4q3r2zz4s5kj44c3fzbseigku6rktgfulnzhqfyrqnacsb5fdru.ipfs.4everland.io/bird1.png', "3");
    assert(gateway2.urlFromCid(imageHash) === 'https://bafkreiclqv6folmmrgyiasyd7wfftyvhmcqjxzzbyncmdtgvs7h5xrg6h4.ipfs.4everland.io/', "4");

    assert(gateway3.urlFromCid(folderHash) === 'http://bafybeif4q3r2zz4s5kj44c3fzbseigku6rktgfulnzhqfyrqnacsb5fdru.ipfs.localhost:8080/bird1.png', "5");
    assert(gateway3.urlFromCid(imageHash) === 'http://bafkreiclqv6folmmrgyiasyd7wfftyvhmcqjxzzbyncmdtgvs7h5xrg6h4.ipfs.localhost:8080/', "6");

    assert(gateway4.urlFromCid(folderHash) === "http://127.0.0.1:8080/ipfs/bafybeif4q3r2zz4s5kj44c3fzbseigku6rktgfulnzhqfyrqnacsb5fdru/bird1.png", "7");
    assert(gateway4.urlFromCid(imageHash) === "http://127.0.0.1:8080/ipfs/bafkreiclqv6folmmrgyiasyd7wfftyvhmcqjxzzbyncmdtgvs7h5xrg6h4", "8");
    console.log('testUrlFromCid pass')
}

async function testGetFromJson() {
    const filePath = './test.json';
    const jsonFile = await import(filePath, {assert: { type: 'json' }});
    const gateway = new Gateway(location2, accountAddress, nodeURI);
    const url = await gateway.urlFromJsonEntry(jsonFile.default, "ownable");
    
    assert(url === 'https://bafybeif4q3r2zz4s5kj44c3fzbseigku6rktgfulnzhqfyrqnacsb5fdru.ipfs.4everland.io/bird1.png');
    console.log('testGetFromJson pass')
}

testUrlFromCid()
await testGetFromJson();
