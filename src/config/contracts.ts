// RWA Asset Factory Configuration
export const RWA_ASSET_FACTORY_ADDRESS = '0x2bE8AB1dcC952C4d8A2bDE41691F9B672294e020';
export const RWA_ASSET_FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assetDescription",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pricePerShare",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "assetType",
        "type": "string"
      }
    ],
    "name": "createRWAAsset",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      }
    ],
    "name": "getAllAssetNames",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      }
    ],
    "name": "getAssetInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Network Configuration
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = 'https://1rpc.io/sepolia';

// Deployment Info
export const DEPLOYMENT_INFO = {
  contractAddress: '0x2bE8AB1dcC952C4d8A2bDE41691F9B672294e020',
  network: 'sepolia',
  chainId: 11155111,
  deployer: '0x912aF42009e089979bA3A304b8A7623AB11e090f',
  timestamp: '2025-10-16T07:33:29.211Z',
  status: 'deployed'
};
