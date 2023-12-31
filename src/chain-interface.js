import { Contract } from 'web3-eth-contract';

// Minimal ABI for a ERC721-compliant contract. Contains interfaces for
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
Retrieves the first owned asset of a specified account address from a ERC721 smart contract.
@async
@param {string} contractAddress - The address of the smart contract 
@param {string} accountAddress - The address of the account for which to retrieve the first owned asset.
@param {string} nodeURI - The URI of the Ethereum node to connect to for interacting with the blockchain network.
@returns {Promise<number|null>} The token ID of the first owned asset, or null if the account owns no assets.
*/
export async function getFirstOwnedAsset(contractAddress, accountAddress, nodeURI) {
    const contract = new Contract(abi, contractAddress);
    contract.setProvider(nodeURI);

    // Get how many nfts the the account owns
    const balance = await contract.methods.balanceOf(accountAddress).call();
    if(Number(balance) == 0) {
      return(null);
    }

    const token = await contract.methods.tokenOfOwnerByIndex(accountAddress, 0).call();
    return(Number(token));
}





