# Vercel Deployment Guide - FHE-Encrypted RWA Platform

This guide covers deploying the Cipher Home Trade FHE-encrypted RWA asset platform to Vercel.

## 🚀 Deployment Overview

The platform consists of:
- **Frontend**: React + TypeScript application
- **Smart Contracts**: FHE-encrypted RWA asset contracts on Sepolia
- **FHE Integration**: Zama FHEVM for confidential transactions

## 📋 Prerequisites

- Vercel account
- GitHub repository access
- Environment variables configured
- Sepolia testnet contracts deployed

## 🔧 Environment Variables

Configure these environment variables in Vercel:

```env
# Network Configuration
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://1rpc.io/sepolia
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract Addresses
NEXT_PUBLIC_RWA_ASSET_FACTORY_ADDRESS=0xE2948b495f43B15F02A3d90C877e3772fE634179
```

## 🏗️ Deployment Steps

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the project root directory

### 2. Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### 3. Set Environment Variables
In Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all required environment variables
- Ensure they're available for Production, Preview, and Development

### 4. Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete
3. Access your deployed application

## 🔐 FHE Configuration

### Required Headers
The application requires specific headers for FHE SDK:

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy", 
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
```

## 📱 Frontend Features

### FHE-Encrypted Asset Subscription
- Private share amount encryption
- Confidential transaction submission
- Zero-knowledge portfolio management

### Supported Asset Types
- Commercial Real Estate
- Residential Properties  
- Retail Spaces
- Hospitality Assets

## 🔗 Contract Integration

### Deployed Contracts
- **RWAAssetFactory**: `0xE2948b495f43B15F02A3d90C877e3772fE634179`
- **Network**: Ethereum Sepolia Testnet
- **FHE Support**: Full homomorphic encryption enabled

### Contract Functions
- `createRWAAsset()`: Create new RWA assets
- `subscribeToAssetEncrypted()`: FHE-encrypted subscriptions
- `getAllAssetNames()`: List available assets
- `getAssetInfo()`: Get asset details

## 🛠️ Troubleshooting

### Common Issues

1. **FHE SDK Loading Issues**
   - Ensure COOP/COEP headers are set
   - Check browser console for errors
   - Verify network connectivity

2. **Contract Connection Issues**
   - Verify contract addresses
   - Check RPC endpoint availability
   - Ensure wallet is connected to Sepolia

3. **Build Failures**
   - Check environment variables
   - Verify Node.js version (18+)
   - Review build logs

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test contract connectivity
4. Review Vercel build logs

## 📊 Monitoring

### Analytics
- Monitor user interactions
- Track FHE encryption usage
- Analyze transaction patterns

### Performance
- Monitor page load times
- Track FHE SDK initialization
- Measure transaction success rates

## 🔄 Updates

### Contract Updates
1. Deploy new contracts to Sepolia
2. Update contract addresses in environment
3. Redeploy frontend application

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Test new features

## 📈 Production Checklist

- [ ] Environment variables configured
- [ ] Contract addresses updated
- [ ] FHE headers properly set
- [ ] WalletConnect project ID set
- [ ] RPC endpoints verified
- [ ] Build successful
- [ ] FHE encryption working
- [ ] Asset subscription functional

## 🆘 Support

For deployment issues:
1. Check Vercel build logs
2. Review environment variables
3. Test locally first
4. Contact support if needed

---

**Deployed with ❤️ on Vercel using Zama FHEVM technology**