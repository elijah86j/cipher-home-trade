# Cipher Home Trade

A decentralized real estate trading platform built with React, TypeScript, and Web3 technologies.

## Project Overview

Cipher Home Trade is a modern web3 application that enables secure and transparent real estate transactions using blockchain technology. The platform provides a marketplace for property trading with encrypted data protection and smart contract integration.

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Modern UI library
- **shadcn-ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Web3** - Blockchain integration
- **RainbowKit** - Wallet connection library
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/elijah86j/cipher-home-trade.git
cd cipher-home-trade
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=YOUR_RPC_URL_HERE
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID_HERE
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY_HERE
```

## Features

- **Secure Property Listings** - Encrypted property data using FHE (Fully Homomorphic Encryption)
- **Wallet Integration** - Connect with popular wallets like MetaMask, Rainbow, and more
- **Smart Contracts** - Automated and secure transaction processing
- **Real-time Updates** - Live marketplace statistics and property updates
- **Responsive Design** - Optimized for desktop and mobile devices

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.