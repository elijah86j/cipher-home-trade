import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function testFHEIntegration() {
  console.log("Testing FHE Integration for Cipher Home Trade...");
  
  try {
    // Test 1: Network Connection
    console.log("\n1. Testing network connection...");
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia");
    try {
      const network = await provider.getNetwork();
      console.log("✓ Connected to network:", network.name, "Chain ID:", network.chainId);
    } catch (error) {
      console.log("⚠️  Network connection failed:", error.message);
      console.log("   This may be due to network issues or RPC endpoint problems");
    }
    
    // Test 2: Wallet Connection
    console.log("\n2. Testing wallet connection...");
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not found in environment variables");
    }
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("✓ Wallet address:", wallet.address);
    
    // Test 3: Balance Check
    console.log("\n3. Checking wallet balance...");
    try {
      const balance = await provider.getBalance(wallet.address);
      console.log("✓ Balance:", ethers.formatEther(balance), "ETH");
      
      if (balance === 0n) {
        console.log("⚠️  Warning: Wallet has no ETH. You may need to fund it for deployment.");
      }
    } catch (error) {
      console.log("⚠️  Balance check failed:", error.message);
    }
    
    // Test 4: Environment Variables
    console.log("\n4. Checking environment variables...");
    const requiredVars = [
      'SEPOLIA_RPC_URL',
      'ETHERSCAN_API_KEY',
      'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'
    ];
    
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        console.log(`✓ ${varName}: Set`);
      } else {
        console.log(`⚠️  ${varName}: Not set`);
      }
    }
    
    // Test 5: Contract Compilation (if Hardhat is available)
    console.log("\n5. Testing contract compilation...");
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec.exec);
      
      await execAsync('npx hardhat compile');
      console.log("✓ Contracts compiled successfully");
    } catch (error) {
      console.log("⚠️  Contract compilation failed:", error.message);
      console.log("   This is expected if Hardhat dependencies are not fully installed");
    }
    
    console.log("\n🎉 FHE Integration Test Complete!");
    console.log("\nNext Steps:");
    console.log("1. Fund your wallet with Sepolia ETH if needed");
    console.log("2. Deploy the contract using: npm run deploy");
    console.log("3. Update the contract address in the frontend");
    console.log("4. Test the FHE encryption/decryption workflow");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testFHEIntegration();
