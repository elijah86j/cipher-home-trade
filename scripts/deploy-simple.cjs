const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying Simple RWA Asset Factory to Sepolia...");
  
  // Get the contract factory
  const SimpleRWAAssetFactory = await ethers.getContractFactory("SimpleRWAAssetFactory");
  
  // Deploy the factory contract
  console.log("📦 Deploying SimpleRWAAssetFactory contract...");
  const factory = await SimpleRWAAssetFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ SimpleRWAAssetFactory deployed successfully!");
  console.log("   Contract Address:", factoryAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      SimpleRWAAssetFactory: factoryAddress,
      SimpleRWAAsset: "0x0000000000000000000000000000000000000000" // Factory creates individual assets
    }
  };
  
  // Update frontend configuration
  const contractsPath = path.join(__dirname, '../src/config/contracts.ts');
  let contractsContent = fs.readFileSync(contractsPath, 'utf8');
  
  // Update the factory address
  contractsContent = contractsContent.replace(
    /export const RWA_ASSET_FACTORY_ADDRESS = '[^']*';/,
    `export const RWA_ASSET_FACTORY_ADDRESS = '${factoryAddress}';`
  );
  
  fs.writeFileSync(contractsPath, contractsContent);
  console.log("📝 Updated frontend configuration");
  
  // Save deployment info
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to deployment-info.json");
  
  console.log("\n🏢 Initializing sample RWA assets...");
  
  // Sample assets data
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
  
  console.log("\n🏗️  Creating RWA assets using deployed factory contract...");
  
  const sampleAssetsData = {
    assets: []
  };
  
  for (let index = 0; index < sampleAssets.length; index++) {
    const asset = sampleAssets[index];
    console.log(`📦 Creating asset ${index + 1}/${sampleAssets.length}: ${asset.name}`);
    
    const tx = await factory.createRWAAsset(
      asset.name,
      asset.description,
      asset.totalSupply,
      asset.pricePerShare,
      asset.assetType
    );
    
    await tx.wait();
    const assetAddress = await factory.rwaAssets(asset.name);
    console.log(`   ✅ Asset created at: ${assetAddress}`);
    
    // Add to sample assets data
    sampleAssetsData.assets.push({
      id: index + 1,
      name: asset.name,
      description: asset.description,
      totalSupply: asset.totalSupply,
      pricePerShare: asset.pricePerShare,
      assetType: asset.assetType,
      availableShares: asset.totalSupply,
      totalValue: asset.totalSupply * asset.pricePerShare,
      contractAddress: assetAddress
    });
  }
  
  console.log(`\n🎉 Successfully created ${sampleAssets.length}/${sampleAssets.length} RWA assets!`);
  
  // Save sample assets data
  const sampleAssetsPath = path.join(__dirname, '../src/data/sample-assets.json');
  fs.writeFileSync(sampleAssetsPath, JSON.stringify(sampleAssetsData, null, 2));
  console.log("📄 Sample assets data saved to src/data/sample-assets.json");
  
  console.log("\n🎉 Simple RWA Asset Factory deployed successfully!");
  console.log("\nNext Steps:");
  console.log("1. Frontend will load sample assets from src/data/sample-assets.json");
  console.log("2. Users can view and subscribe to these RWA assets (NO ENCRYPTION)");
  console.log("3. Test the complete RWA asset subscription workflow");
  console.log("4. Perfect for video recording and demonstration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
