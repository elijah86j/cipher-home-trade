import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { RWA_ASSET_FACTORY_ADDRESS, RWA_ASSET_FACTORY_ABI } from '../config/contracts';
import type { RWAAsset } from '../types';

interface RWAAssetSubscriptionProps {
  selectedAsset: RWAAsset | null;
  userAddress: string;
  onSubscriptionComplete: () => void;
}

export function RWAAssetSubscription({ 
  selectedAsset, 
  userAddress, 
  onSubscriptionComplete 
}: RWAAssetSubscriptionProps) {
  const { isConnected } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  
  const [shares, setShares] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [useEncryption, setUseEncryption] = useState(true);

  const sharesNum = parseInt(shares) || 0;
  const totalCost = sharesNum * (selectedAsset?.pricePerShare || 0);

  const handleSubscription = async () => {
    if (!selectedAsset || !shares || sharesNum <= 0) {
      setMessage('Please select an asset and enter valid number of shares');
      return;
    }

    if (!isConnected || !instance || !signerPromise) {
      setMessage('Missing wallet or encryption service');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const signer = await signerPromise;
      
      if (useEncryption) {
        // FHE encrypted subscription
        const input = instance.createEncryptedInput(
          selectedAsset.assetAddress,
          userAddress
        );
        input.add64(BigInt(sharesNum));
        const encryptedInput = await input.encrypt();

        // Call encrypted subscription function
        const factoryContract = new ethers.Contract(
          RWA_ASSET_FACTORY_ADDRESS,
          RWA_ASSET_FACTORY_ABI,
          signer
        );

        const tx = await factoryContract.subscribeToAssetEncrypted(
          selectedAsset.name,
          userAddress,
          encryptedInput.handles[0],
          encryptedInput.inputProof
        );
        
        await tx.wait();
        setMessage('Encrypted subscription successful!');
      } else {
        // Regular subscription
        const factoryContract = new ethers.Contract(
          RWA_ASSET_FACTORY_ADDRESS,
          RWA_ASSET_FACTORY_ABI,
          signer
        );

        const tx = await factoryContract.subscribeToAsset(
          selectedAsset.name,
          userAddress,
          sharesNum
        );
        
        await tx.wait();
        setMessage('Subscription successful!');
      }

      // Reset form
      setShares('');
      onSubscriptionComplete();
      
    } catch (error) {
      console.error('Subscription failed:', error);
      setMessage('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedAsset) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        color: '#6b7280'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          📊
        </div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Select an Asset to Subscribe
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Choose an RWA asset from the Assets tab to start your subscription
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '1.5rem'
      }}>
        💰 Subscribe to {selectedAsset.name}
      </h2>

      {/* Asset Info */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          {selectedAsset.name}
        </h3>
        <p style={{
          color: '#6b7280',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {selectedAsset.description}
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <div>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0 0 0.25rem 0',
              fontWeight: '500'
            }}>
              Asset Type
            </p>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              {selectedAsset.assetType}
            </p>
          </div>
          <div>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0 0 0.25rem 0',
              fontWeight: '500'
            }}>
              Total Supply
            </p>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              {selectedAsset.totalSupply.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0 0 0.25rem 0',
              fontWeight: '500'
            }}>
              Price per Share
            </p>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              ${selectedAsset.pricePerShare.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Form */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Number of Shares
          </label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="Enter number of shares"
            min="1"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              color: '#374151',
              backgroundColor: '#ffffff'
            }}
          />
        </div>

        {/* Encryption Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px'
        }}>
          <input
            type="checkbox"
            id="encryption"
            checked={useEncryption}
            onChange={(e) => setUseEncryption(e.target.checked)}
            style={{ margin: 0 }}
          />
          <label htmlFor="encryption" style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#0c4a6e',
            cursor: 'pointer',
            margin: 0
          }}>
            🔒 Use FHE encryption for private subscription
          </label>
        </div>

        {/* Cost Calculation */}
        {sharesNum > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {sharesNum} shares × ${selectedAsset.pricePerShare.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                ${totalCost.toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              borderTop: '1px solid #d1d5db',
              paddingTop: '0.5rem'
            }}>
              <span>Total Cost:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubscription}
          disabled={!shares || sharesNum <= 0 || isSubmitting || !isConnected}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            backgroundColor: (!shares || sharesNum <= 0 || isSubmitting || !isConnected) 
              ? '#d1d5db' 
              : useEncryption ? '#8b5cf6' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: (!shares || sharesNum <= 0 || isSubmitting || !isConnected) 
              ? 'not-allowed' 
              : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {isSubmitting 
            ? 'Processing Subscription...' 
            : useEncryption 
              ? '🔒 Subscribe with FHE Encryption' 
              : '💰 Subscribe to Asset'
          }
        </button>

        {message && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: message.includes('successful') 
              ? '#dcfce7' 
              : message.includes('failed') 
                ? '#fee2e2' 
                : '#dbeafe',
            border: `1px solid ${message.includes('successful') 
              ? '#bbf7d0' 
              : message.includes('failed') 
                ? '#fecaca' 
                : '#bfdbfe'}`,
            borderRadius: '6px',
            color: message.includes('successful') 
              ? '#166534' 
              : message.includes('failed') 
                ? '#991b1b' 
                : '#1e40af',
            fontSize: '0.875rem'
          }}>
            {message}
          </div>
        )}

        {!isConnected && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            color: '#92400e',
            fontSize: '0.875rem'
          }}>
            <strong>⚠️ Note:</strong> Please connect your wallet to subscribe to assets.
          </div>
        )}
      </div>
    </div>
  );
}
