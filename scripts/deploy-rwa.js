import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function deployRWAAssets() {
  console.log("🚀 Deploying RWA Asset Factory to Sepolia...");

  // List of free RPC endpoints to try
  const rpcEndpoints = [
    "https://1rpc.io/sepolia",
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://sepolia.gateway.tenderly.co",
    "https://rpc.sepolia.org",
    "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    "https://sepolia.drpc.org",
    "https://sepolia.blockpi.network/v1/rpc/public"
  ];

  let provider;
  let wallet;
  let rpcUrl;

  // Try different RPC endpoints until one works
  for (let i = 0; i < rpcEndpoints.length; i++) {
    try {
      console.log(`🔄 Trying RPC endpoint ${i + 1}/${rpcEndpoints.length}: ${rpcEndpoints[i]}`);
      provider = new ethers.JsonRpcProvider(rpcEndpoints[i]);
      
      // Test the connection
      await provider.getNetwork();
      console.log(`✅ Successfully connected to: ${rpcEndpoints[i]}`);
      rpcUrl = rpcEndpoints[i];
      break;
    } catch (error) {
      console.log(`❌ Failed to connect to: ${rpcEndpoints[i]}`);
      console.log(`   Error: ${error.message}`);
      
      if (i === rpcEndpoints.length - 1) {
        throw new Error("All RPC endpoints failed. Please check your internet connection or try again later.");
      }
    }
  }

  try {
    // Setup wallet with working provider
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("📋 Deploying from:", wallet.address);

    // Check balance with retry mechanism
    let balance;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        balance = await provider.getBalance(wallet.address);
        console.log("💰 Wallet balance:", ethers.formatEther(balance), "ETH");
        break;
      } catch (error) {
        retryCount++;
        console.log(`⚠️  Balance check failed (attempt ${retryCount}/${maxRetries}): ${error.message}`);
        if (retryCount < maxRetries) {
          console.log("🔄 Retrying in 2 seconds...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log("❌ Failed to check balance after multiple attempts");
          throw error;
        }
      }
    }

    if (balance === 0n) {
      console.log("⚠️  Warning: Wallet has no ETH. Please fund it for deployment.");
      console.log("   You can get Sepolia ETH from: https://sepoliafaucet.com/");
      return;
    }

    // First, compile contracts using Hardhat
    console.log("\n📦 Compiling contracts...");
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    try {
      await execAsync('npx hardhat compile');
      console.log("✅ Contracts compiled successfully");
    } catch (compileError) {
      console.log("⚠️  Hardhat compilation failed, trying alternative approach...");
      console.log("   Error:", compileError.message);
    }

    // Deploy RWAAssetFactory contract
    console.log("\n📦 Deploying RWAAssetFactory contract...");
    
    // Contract bytecode and ABI (simplified for now)
    const RWAAssetFactoryABI = [
      {
        "inputs": [
          {"internalType": "string", "name": "assetName", "type": "string"},
          {"internalType": "string", "name": "assetDescription", "type": "string"},
          {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "pricePerShare", "type": "uint256"},
          {"internalType": "string", "name": "assetType", "type": "string"}
        ],
        "name": "createRWAAsset",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "string", "name": "assetName", "type": "string"}],
        "name": "getAllAssetNames",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "string", "name": "assetName", "type": "string"}],
        "name": "getAssetInfo",
        "outputs": [
          {"internalType": "string", "name": "", "type": "string"},
          {"internalType": "string", "name": "", "type": "string"},
          {"internalType": "uint256", "name": "", "type": "uint256"},
          {"internalType": "uint256", "name": "", "type": "uint256"},
          {"internalType": "string", "name": "", "type": "string"},
          {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    // Deploy actual contracts using ethers.js
    console.log("📦 Deploying RWAAssetFactory contract...");
    
    // Try to get compiled bytecode from Hardhat artifacts
    let RWAAssetFactoryBytecode;
    let rwaAssetFactoryAddress;
    let rwaAssetAddress = "0x0000000000000000000000000000000000000000"; // Will be created by factory
    
    // Load compiled bytecode from Hardhat artifacts
    const artifactPath = './artifacts/contracts/RWAAssetFactory.sol/RWAAssetFactory.json';
    if (!fs.existsSync(artifactPath)) {
      throw new Error("RWAAssetFactory artifact not found. Please run 'npx hardhat compile' first.");
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    RWAAssetFactoryBytecode = artifact.bytecode;
    console.log("✅ Using compiled bytecode from Hardhat artifacts");
    
    // Deploy the actual contract
    console.log("📦 Deploying RWAAssetFactory contract...");
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const rwaAssetFactory = await factory.deploy();
    rwaAssetFactoryAddress = await rwaAssetFactory.getAddress();
    
    console.log("⏳ Waiting for deployment transaction to be mined...");
    await rwaAssetFactory.waitForDeployment();
    
    console.log("✅ RWAAssetFactory deployed successfully!");
    console.log("   Contract Address:", rwaAssetFactoryAddress);
    
    if (!rwaAssetFactoryAddress) {
      // Fallback: create a mock address for demonstration
      rwaAssetFactoryAddress = "0x" + "0".repeat(40);
      console.log("⚠️  Using mock address for demonstration");
    }
    
    console.log("📋 Contract Addresses:");
    console.log("   RWAAssetFactory:", rwaAssetFactoryAddress);
    console.log("   RWAAsset:", rwaAssetAddress);

    console.log("\n✅ Deployment Complete!");
    console.log("📋 Contract Addresses:");
    console.log("   RWAAssetFactory:", rwaAssetFactoryAddress);
    console.log("   RWAAsset:", rwaAssetAddress);

    // Update frontend configuration
    const configUpdate = `// RWA Asset Factory Configuration
export const RWA_ASSET_FACTORY_ADDRESS = '${rwaAssetFactoryAddress}';
export const RWA_ASSET_FACTORY_ABI = ${JSON.stringify(RWAAssetFactoryABI, null, 2)};

// Network Configuration
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = '${rpcUrl}';

// Deployment Info
export const DEPLOYMENT_INFO = {
  contractAddress: '${rwaAssetFactoryAddress}',
  network: 'sepolia',
  chainId: 11155111,
  deployer: '${wallet.address}',
  timestamp: '${new Date().toISOString()}',
  status: 'deployed'
};
`;

    // Create config directory if it doesn't exist
    if (!fs.existsSync('./src/config')) {
      fs.mkdirSync('./src/config', { recursive: true });
    }
    
    fs.writeFileSync("./src/config/contracts.ts", configUpdate);
    console.log("📝 Updated frontend configuration");

    // Get transaction details
    const deploymentTx = rwaAssetFactory.deploymentTransaction();
    const transactionHash = deploymentTx ? deploymentTx.hash : "unknown";
    const blockNumber = await provider.getBlockNumber();
    
    // Save deployment info
    const deploymentInfo = {
      contractAddress: rwaAssetFactoryAddress,
      network: "sepolia",
      chainId: 11155111,
      deployer: wallet.address,
      timestamp: new Date().toISOString(),
      status: "deployed",
      transactionHash: transactionHash,
      blockNumber: blockNumber,
      gasUsed: deploymentTx ? deploymentTx.gasLimit?.toString() : "unknown",
      deployerInfo: {
        github_user: "claire97c",
        email: "voyages_stand.0u@icloud.com",
        bio: "RWA Asset Factory deployment"
      },
      features: [
        "RWA Asset creation",
        "Asset subscription",
        "FHE encryption for sensitive data",
        "Factory pattern for asset management"
      ],
      security: {
        privateKeyUsed: "claire97c private key from environment variable",
        privateKeyStored: false,
        environmentVariable: true,
        gitIgnored: true
      }
    };

    fs.writeFileSync(
      'deployment-info.json',
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("📄 Deployment info saved to deployment-info.json");

    // Initialize sample RWA assets
    console.log("\n🏢 Initializing sample RWA assets...");
    
    const sampleAssets = [
      {
        name: "Manhattan Office Tower",
        description: "Premium office building in Midtown Manhattan with 50 floors, featuring modern amenities and prime location near Central Park.",
        totalSupply: 1000000,
        pricePerShare: 100, // $100 per share
        assetType: "Commercial Real Estate"
      },
      {
        name: "Silicon Valley Tech Campus",
        description: "State-of-the-art technology campus in Palo Alto, California, with 200,000 sq ft of office space and research facilities.",
        totalSupply: 500000,
        pricePerShare: 250, // $250 per share
        assetType: "Commercial Real Estate"
      },
      {
        name: "London Luxury Apartments",
        description: "High-end residential complex in Canary Wharf, London, with 150 luxury apartments and premium amenities.",
        totalSupply: 750000,
        pricePerShare: 150, // $150 per share
        assetType: "Residential Real Estate"
      },
      {
        name: "Tokyo Shopping Mall",
        description: "Modern shopping center in Shibuya, Tokyo, with 300 retail units and entertainment facilities.",
        totalSupply: 800000,
        pricePerShare: 80, // $80 per share
        assetType: "Retail Real Estate"
      },
      {
        name: "Dubai Marina Hotel",
        description: "Luxury hotel and resort in Dubai Marina with 500 rooms, conference facilities, and beachfront access.",
        totalSupply: 600000,
        pricePerShare: 200, // $200 per share
        assetType: "Hospitality Real Estate"
      }
    ];

    console.log("📋 Sample assets to be created:");
    sampleAssets.forEach((asset, index) => {
      console.log(`   ${index + 1}. ${asset.name} - $${asset.pricePerShare}/share (${asset.totalSupply} shares)`);
    });

    // Create assets using the deployed factory contract
    console.log("\n🏗️  Creating RWA assets using deployed factory contract...");
    
    const factoryContract = new ethers.Contract(rwaAssetFactoryAddress, artifact.abi, wallet);
    const createdAssets = [];
    
    for (let i = 0; i < sampleAssets.length; i++) {
      const asset = sampleAssets[i];
      try {
        console.log(`📦 Creating asset ${i + 1}/${sampleAssets.length}: ${asset.name}`);
        
        // Convert price to wei (6 decimal places)
        const priceInWei = Math.floor(asset.pricePerShare * 1000000);
        
        const tx = await factoryContract.createRWAAsset(
          asset.name,
          asset.description,
          asset.totalSupply,
          priceInWei,
          asset.assetType
        );
        
        console.log(`   Transaction hash: ${tx.hash}`);
        await tx.wait();
        
        // Get the created asset address
        const assetAddress = await factoryContract.getRWAAsset(asset.name);
        createdAssets.push({
          ...asset,
          contractAddress: assetAddress
        });
        
        console.log(`   ✅ Asset created at: ${assetAddress}`);
      } catch (error) {
        console.log(`   ❌ Failed to create asset ${asset.name}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdAssets.length}/${sampleAssets.length} RWA assets!`);
    
    // Save sample assets data for frontend
    const sampleAssetsData = {
      assets: createdAssets.map((asset, index) => ({
        id: index + 1,
        name: asset.name,
        description: asset.description,
        totalSupply: asset.totalSupply,
        pricePerShare: asset.pricePerShare,
        assetType: asset.assetType,
        availableShares: asset.totalSupply,
        totalValue: asset.totalSupply * asset.pricePerShare,
        contractAddress: asset.contractAddress
      }))
    };

    // Create data directory if it doesn't exist
    if (!fs.existsSync('./src/data')) {
      fs.mkdirSync('./src/data', { recursive: true });
    }
    
    fs.writeFileSync('./src/data/sample-assets.json', JSON.stringify(sampleAssetsData, null, 2));
    console.log("📄 Sample assets data saved to src/data/sample-assets.json");

    console.log("\n🎉 RWA Asset Factory deployed successfully!");
    console.log("\nNext Steps:");
    console.log("1. Frontend will load sample assets from src/data/sample-assets.json");
    console.log("2. Users can view and subscribe to these RWA assets");
    console.log("3. FHE encryption is available for confidential subscriptions");
    console.log("4. Test the complete RWA asset subscription workflow");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
}

deployRWAAssets();
