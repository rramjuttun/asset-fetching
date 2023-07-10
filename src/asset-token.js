import { Contract } from 'web3-eth-contract';
import dotenv from 'dotenv';
import contractABI from './contractABI.json' assert { type: 'json' };

dotenv.config();
export async function getFirstOwnedAsset(contractAddress, accountAddress) {
    const contract = new Contract(contractABI, contractAddress);
    contract.setProvider(process.env.ETH_NODE_URI);

    const balance = await contract.methods.balanceOf(accountAddress).call()
    if(balance > 0) {
        const token = await contract.methods.tokenOfOwnerByIndex(accountAddress, 0).call();
        return(token);
    }
    else {
        return(null);
    }
}



