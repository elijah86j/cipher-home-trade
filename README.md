# Cipher Home Trade - FHE-Encrypted RWA Asset Platform

A decentralized real estate investment platform built with **Fully Homomorphic Encryption (FHE)** technology, enabling confidential and private asset subscriptions on the blockchain.

## 🔐 Key Features

- **FHE-Encrypted Asset Subscriptions**: Private and confidential investment transactions
- **Real-World Asset (RWA) Tokenization**: Commercial real estate, residential properties, retail spaces
- **Zero-Knowledge Portfolio Management**: Your investment data remains encrypted
- **Decentralized Architecture**: Built on Ethereum with Zama FHEVM
- **Confidential Transactions**: Share amounts and investment details are encrypted

## 🏗️ Architecture

### Smart Contracts
- **RWAAssetFactory**: Factory contract for creating and managing RWA assets
- **RWAAsset**: Individual asset contracts with FHE-encrypted minting capabilities
- **FHE Integration**: Uses `@fhevm/solidity` for encrypted data types (`euint64`, `externalEuint64`)

### Frontend
- **React + TypeScript**: Modern web interface
- **Wagmi v2**: Ethereum wallet integration
- **FHE SDK**: `@zama-fhe/relayer-sdk` for client-side encryption
- **Tailwind CSS**: Responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet
- Sepolia testnet ETH

### Installation

```bash
# Clone the repository
git clone https://github.com/elijah86j/cipher-home-trade.git
cd cipher-home-trade

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Configuration

```env
# Network Configuration
SEPOLIA_RPC_URL=https://1rpc.io/sepolia
ETHERSCAN_API_KEY=your_etherscan_api_key

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Private Key (for deployment)
PRIVATE_KEY=your_private_key
```

### Development

```bash
# Start development server
npm run dev

# Deploy contracts
npx hardhat run scripts/deploy-rwa.js --network sepolia
```

## 🔒 FHE Encryption Features

### Encrypted Asset Subscription
- **Private Share Amounts**: Investment quantities are encrypted using FHE
- **Confidential Transactions**: No one can see your investment details
- **Zero-Knowledge Proofs**: Verify transactions without revealing data

### Technical Implementation
```typescript
// FHE encryption for asset subscription
const input = zamaInstance.createEncryptedInput(
  RWA_ASSET_FACTORY_ADDRESS,
  userAddress
);
input.add64(BigInt(sharesNum));
const encryptedInput = await input.encrypt();

// Submit encrypted transaction
await factoryContract.subscribeToAssetEncrypted(
  assetName,
  userAddress,
  encryptedInput.handles[0],
  encryptedInput.inputProof
);
```

## 📊 Supported Asset Types

- **Commercial Real Estate**: Office buildings, tech campuses
- **Residential Properties**: Luxury apartments, housing complexes  
- **Retail Spaces**: Shopping malls, retail centers
- **Hospitality**: Hotels, resorts, conference facilities

## 🛠️ Development

### Contract Development
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy-rwa.js --network sepolia
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### FHE Configuration
The platform uses Zama FHEVM with Sepolia testnet configuration:

```typescript
// FHE instance initialization
const zamaInstance = await ZamaSDK.createInstance(ZamaSDK.SepoliaConfig);
```

### Contract Addresses
- **RWAAssetFactory**: `0xE2948b495f43B15F02A3d90C877e3772fE634179`
- **Network**: Ethereum Sepolia Testnet

## 📱 Usage

### 1. Connect Wallet
- Install MetaMask or compatible wallet
- Connect to Sepolia testnet
- Ensure you have testnet ETH

### 2. Browse Assets
- View available RWA assets
- Check asset details and pricing
- Review investment opportunities

### 3. Encrypted Subscription
- Select desired asset
- Enter share amount (encrypted)
- Submit confidential transaction
- Monitor encrypted portfolio

## 🔐 Security Features

- **FHE Encryption**: All sensitive data encrypted on-chain
- **Access Control**: ACL permissions for encrypted data
- **Private Transactions**: Investment details remain confidential
- **Zero-Knowledge**: Verify without revealing data

## 📈 Demo Video

Watch the FHE-encrypted RWA asset subscription demo:

[![FHE Asset Demo](fhe-asset-compressed.mp4)](fhe-asset-compressed.mp4)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/elijah86j/cipher-home-trade)
- **Zama FHEVM**: [Documentation](https://docs.zama.ai/fhevm)
- **Sepolia Testnet**: [Etherscan](https://sepolia.etherscan.io/)

## 🆘 Support

For technical support or questions:
- Open an issue on GitHub
- Check the documentation
- Review the demo video

---

**Built with ❤️ using Zama FHEVM technology**