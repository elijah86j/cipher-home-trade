import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Cipher Home Trade',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo-project-id-for-development',
  chains: [sepolia],
  ssr: false,
});

export const chains = [sepolia];
