// RWA Asset Factory Configuration
export const RWA_ASSET_FACTORY_ADDRESS = '0x1851c0BA42C6BDD152BB6666E694d35742A4197A';

// Complete ABI from compiled contract
export const RWA_ASSET_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "AssetAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AssetNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidParameters",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "assetAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pricePerShare",
        "type": "uint256"
      }
    ],
    "name": "RWAAssetCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "AssetSubscribed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      }
    ],
    "name": "assetToName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assetNames",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
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
    "inputs": [],
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
    "name": "getAssetCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      }
    ],
    "name": "getRWAAsset",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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
    "name": "rwaAssets",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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
      },
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "shares",
        "type": "uint64"
      }
    ],
    "name": "subscribeToAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "assetName",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "encryptedShares",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "subscribeToAssetEncrypted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Network Configuration
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';

// Deployment Info
export const DEPLOYMENT_INFO = {
  contractAddress: '0x1851c0BA42C6BDD152BB6666E694d35742A4197A',
  network: 'sepolia',
  chainId: 11155111,
  deployer: '0x912aF42009e089979bA3A304b8A7623AB11e090f',
  timestamp: '2025-10-15T13:05:26.921Z',
  status: 'deployed'
};
