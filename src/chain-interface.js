import { Contract } from 'web3-eth-contract';
import dotenv from 'dotenv';

// Minimal ABI for a ERC721-compliant contract. Only contains interfaces for
// "balanceOf" and "tokenOfOwnerByIndex" functions.
const abi = [
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" }
      ],
      "name": "balanceOf",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "owner", "type": "address" },
        { "internalType": "uint256", "name": "index", "type": "uint256" }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]

/**
Retrieves the first owned asset of a specified account address from a smart contract.
@async
@param {string} contractAddress - The address of the smart contract 
@param {string} accountAddress - The address of the account for which to retrieve the first owned asset.
@param {string} nodeURI - The URI of the Ethereum node to connect to for interacting with the blockchain network.
@returns {Promise<string|null>} The token ID of the first owned asset, or null if the account owns no assets.
*/
export async function getFirstOwnedAsset(contractAddress, accountAddress, nodeURI) {
    const contract = new Contract(abi, contractAddress);
    contract.setProvider(nodeURI);

    const balance = await contract.methods.balanceOf(accountAddress).call()
    if(balance > 0) {
        const token = await contract.methods.tokenOfOwnerByIndex(accountAddress, 0).call();
        console.log(token);
        return(token);
    }
    else {
        return(null);
    }
}

dotenv.config();
const nodeURI = process.env.ETH_NODE_URI;
const contractAddress = '0xca5d572f5a7367e58fdbff9f608813ff525707a6';
const accountAddress = '0x061de0875047bc07960EB1F2146Bf0097d262Bb1'
getFirstOwnedAsset(contractAddress, accountAddress, nodeURI);





