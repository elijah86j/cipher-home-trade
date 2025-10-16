import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { RWA_ASSET_FACTORY_ADDRESS } from '../config/contracts';
import type { RWAAsset } from '../types';

// Simple ABI for non-encrypted subscription
const SIMPLE_FACTORY_ABI = [
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
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "name": "subscribeToAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

interface SimpleRWAAssetSubscriptionProps {
  selectedAsset: RWAAsset | null;
  onSubscriptionSuccess: () => void;
}

export default function SimpleRWAAssetSubscription({ 
  selectedAsset, 
  onSubscriptionSuccess 
}: SimpleRWAAssetSubscriptionProps) {
  const { address: userAddress } = useAccount();
  const [shares, setShares] = useState<string>('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscription = async () => {
    if (!selectedAsset || !userAddress || !shares) {
      setMessage('Please select an asset and enter the number of shares');
      return;
    }

    const sharesNum = parseInt(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
      setMessage('Please enter a valid number of shares');
      return;
    }

    if (sharesNum > selectedAsset.availableShares) {
      setMessage(`Only ${selectedAsset.availableShares.toLocaleString()} shares available`);
      return;
    }

    setIsSubscribing(true);
    setMessage('');

    try {
      console.log('🚀 Starting simple subscription process...');
      console.log('Asset:', selectedAsset.name);
      console.log('Shares:', sharesNum);
      console.log('User:', userAddress);

      // Get signer from wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const factoryContract = new ethers.Contract(
        RWA_ASSET_FACTORY_ADDRESS,
        SIMPLE_FACTORY_ABI,
        signer
      );

      console.log('📝 Calling simple subscription contract...');
      setMessage('Subscribing to asset...');

      // Call the simple subscription function (no encryption)
      const tx = await factoryContract.subscribeToAsset(
        selectedAsset.name,
        userAddress,
        sharesNum
      );

      console.log('⏳ Waiting for transaction confirmation...');
      setMessage('Transaction submitted. Waiting for confirmation...');

      const receipt = await tx.wait();
      console.log('✅ Subscription successful!', receipt);

      setMessage(`Successfully subscribed to ${sharesNum} shares of ${selectedAsset.name}!`);
      
      // Reset form
      setShares('');
      
      // Notify parent component
      onSubscriptionSuccess();

    } catch (error: any) {
      console.error('❌ Subscription failed:', error);
      
      if (error.message?.includes('user rejected')) {
        setMessage('Transaction was cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        setMessage('Insufficient funds for transaction');
      } else if (error.message?.includes('execution reverted')) {
        setMessage('Transaction failed: ' + (error.reason || 'Unknown error'));
      } else {
        setMessage('Subscription failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!selectedAsset) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          RWA Asset Subscription
        </h3>
        <p className="text-gray-600">
          Please select an asset to subscribe to shares.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Simple RWA Asset Subscription
      </h3>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Selected Asset:</h4>
        <div className="bg-gray-50 p-3 rounded">
          <p className="font-medium">{selectedAsset.name}</p>
          <p className="text-sm text-gray-600">{selectedAsset.assetType}</p>
          <p className="text-sm text-gray-600">
            Available: {selectedAsset.availableShares.toLocaleString()} shares
          </p>
          <p className="text-sm text-gray-600">
            Price: ${selectedAsset.pricePerShare} per share
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Shares
        </label>
        <input
          type="number"
          id="shares"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          placeholder="Enter number of shares"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          style={{
            backgroundColor: 'white',
            color: '#111827',
            border: '1px solid #d1d5db'
          }}
          min="1"
          max={selectedAsset.availableShares}
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum: {selectedAsset.availableShares.toLocaleString()} shares
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('Successfully') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSubscription}
        disabled={isSubscribing || !shares || !userAddress}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          isSubscribing || !shares || !userAddress
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isSubscribing ? 'Subscribing...' : 'Subscribe to Asset'}
      </button>

    </div>
  );
}
