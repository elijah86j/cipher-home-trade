# Vercel Deployment Guide for Cipher Home Trade

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare the required environment variables

## Step-by-Step Deployment Process

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" or "Import Project"
3. Connect your GitHub account if not already connected
4. Select the repository: `elijah86j/cipher-home-trade`

### Step 2: Configure Project Settings

1. **Project Name**: `cipher-home-trade`
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 3: Environment Variables Configuration

Add the following environment variables in Vercel dashboard:

#### Required Environment Variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=YOUR_RPC_URL_HERE

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID_HERE

# Infura Configuration (Optional)
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY_HERE
NEXT_PUBLIC_RPC_URL=YOUR_ALTERNATIVE_RPC_URL_HERE
```

#### How to Add Environment Variables:

1. In the Vercel project dashboard, go to "Settings"
2. Click on "Environment Variables"
3. Add each variable with the following settings:
   - **Name**: The environment variable name (e.g., `NEXT_PUBLIC_CHAIN_ID`)
   - **Value**: The corresponding value (e.g., `11155111`)
   - **Environment**: Select "Production", "Preview", and "Development"

### Step 4: Build Configuration

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Install Command**: `npm install`
4. **Node.js Version**: 18.x (recommended)

### Step 5: Domain Configuration (Optional)

1. Go to "Domains" in your project settings
2. Add a custom domain if desired
3. Configure DNS settings as instructed by Vercel

### Step 6: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete
3. Your application will be available at the provided Vercel URL

## Post-Deployment Configuration

### Step 7: Verify Deployment

1. **Check Application**: Visit the deployed URL
2. **Test Wallet Connection**: Ensure RainbowKit wallet connection works
3. **Test Network**: Verify Sepolia testnet connection
4. **Check Console**: Monitor browser console for any errors

### Step 8: Update Contract Address (When Available)

Once the smart contract is deployed to Sepolia:

1. Go to Vercel project settings
2. Add new environment variable:
   - **Name**: `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - **Value**: The deployed contract address
3. Redeploy the application

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version (use 18.x)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Working**:
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding new variables
   - Check variable names match exactly

3. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure network configuration matches Sepolia

4. **Network Issues**:
   - Verify Sepolia testnet configuration
   - Check RPC endpoint availability
   - Ensure proper chain ID (11155111)

### Performance Optimization:

1. **Enable Edge Functions** (if needed)
2. **Configure Caching** for static assets
3. **Enable Compression** for better loading times
4. **Monitor Performance** using Vercel Analytics

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to repository
2. **API Keys**: Use Vercel's environment variable system
3. **CORS**: Configure proper CORS settings if needed
4. **Rate Limiting**: Implement rate limiting for API calls

## Monitoring and Analytics

1. **Vercel Analytics**: Enable for performance monitoring
2. **Error Tracking**: Set up error monitoring
3. **Uptime Monitoring**: Monitor application availability
4. **Performance Metrics**: Track Core Web Vitals

## Deployment URLs

- **Production**: `https://cipher-home-trade.vercel.app`
- **Preview**: `https://cipher-home-trade-git-main-elijah86j.vercel.app`
- **Development**: Available after first deployment

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Check GitHub repository for any issues
4. Contact Vercel support if needed

## Next Steps

After successful deployment:
1. Test all functionality
2. Deploy smart contract to Sepolia
3. Update contract address in environment variables
4. Configure custom domain (optional)
5. Set up monitoring and analytics
