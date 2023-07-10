const { Web3 } = require("web3");
const dotenv = require('dotenv');
const contractABI = require("./contractABI.json");

dotenv.config();
async function getFirstOwnedAsset(contractAddress, accountAddress) {
    const web3 = new Web3(process.env.ETH_NODE_URI);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const balance = await contract.methods.balanceOf(accountAddress).call()
    if(balance > 0) {
        const token = await contract.methods.tokenOfOwnerByIndex(accountAddress, 0).call();
        return(token);
    };
}

module.exports = {
    getFirstOwnedAsset
}



