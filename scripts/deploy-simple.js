const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("Deploying CipherHomeTrade contract...");

  // Connect to Sepolia network
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deploying from address:", wallet.address);
  
  // Get the contract factory
  const CipherHomeTrade = await ethers.getContractFactory("CipherHomeTradeSimple");
  
  // Deploy the contract with a verifier address
  const verifierAddress = "0x0000000000000000000000000000000000000000";
  const cipherHomeTrade = await CipherHomeTrade.deploy(verifierAddress);
  
  await cipherHomeTrade.waitForDeployment();
  
  const contractAddress = await cipherHomeTrade.getAddress();
  
  console.log("CipherHomeTrade deployed to:", contractAddress);
  
  // Update the contract address in the frontend
  const fs = require('fs');
  const path = require('path');
  
  const contractABIPath = path.join(__dirname, '../src/lib/contract-abi.ts');
  let contractABI = fs.readFileSync(contractABIPath, 'utf8');
  
  // Update the contract address
  contractABI = contractABI.replace(
    "const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';",
    `const CONTRACT_ADDRESS = '${contractAddress}';`
  );
  
  fs.writeFileSync(contractABIPath, contractABI);
  
  console.log("Contract address updated in frontend");
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
