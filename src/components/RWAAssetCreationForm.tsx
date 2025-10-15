import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

interface RWAAssetCreationFormProps {
  onAssetCreated: () => void;
}

export function RWAAssetCreationForm({ onAssetCreated }: RWAAssetCreationFormProps) {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({
    assetName: '',
    assetDescription: '',
    totalSupply: '',
    pricePerShare: '',
    assetType: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAsset = async () => {
    if (!isConnected) {
      setMessage('Please connect your wallet');
      return;
    }

    const { assetName, assetDescription, totalSupply, pricePerShare, assetType } = formData;
    
    if (!assetName || !assetDescription || !totalSupply || !pricePerShare || !assetType) {
      setMessage('Please fill all fields');
      return;
    }

    const totalSupplyNum = parseInt(totalSupply);
    const pricePerShareNum = parseFloat(pricePerShare);

    if (totalSupplyNum <= 0 || pricePerShareNum <= 0) {
      setMessage('Total supply and price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert price to wei (6 decimal places)
      const priceInWei = Math.floor(pricePerShareNum * 1000000);

      const factoryContract = new ethers.Contract(
        '0x0000000000000000000000000000000000000000', // Factory address
        [], // ABI
        signer
      );

      const tx = await factoryContract.createRWAAsset(
        assetName,
        assetDescription,
        totalSupplyNum,
        priceInWei,
        assetType
      );

      setMessage('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      setMessage(`RWA Asset "${assetName}" created successfully!`);
      
      // Reset form
      setFormData({
        assetName: '',
        assetDescription: '',
        totalSupply: '',
        pricePerShare: '',
        assetType: ''
      });

      // Refresh assets list
      setTimeout(() => {
        onAssetCreated();
        setMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Asset creation failed:', error);
      setMessage(`Asset creation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const assetTypes = [
    'Real Estate',
    'Commodities',
    'Precious Metals',
    'Art & Collectibles',
    'Infrastructure',
    'Renewable Energy',
    'Agriculture',
    'Other'
  ];

  return (
    <div>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '1.5rem'
      }}>
        🏭 Create New RWA Asset
      </h2>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '600px'
      }}>
        {/* Asset Name */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Asset Name *
          </label>
          <input
            type="text"
            value={formData.assetName}
            onChange={(e) => handleInputChange('assetName', e.target.value)}
            placeholder="e.g., Manhattan Office Building"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Asset Description */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Asset Description *
          </label>
          <textarea
            value={formData.assetDescription}
            onChange={(e) => handleInputChange('assetDescription', e.target.value)}
            placeholder="Describe the asset, its location, features, etc."
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Asset Type */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Asset Type *
          </label>
          <select
            value={formData.assetType}
            onChange={(e) => handleInputChange('assetType', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select asset type</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Total Supply and Price */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Total Supply *
            </label>
            <input
              type="number"
              value={formData.totalSupply}
              onChange={(e) => handleInputChange('totalSupply', e.target.value)}
              placeholder="1000000"
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              Total number of shares
            </p>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Price per Share (USD) *
            </label>
            <input
              type="number"
              value={formData.pricePerShare}
              onChange={(e) => handleInputChange('pricePerShare', e.target.value)}
              placeholder="100.00"
              step="0.01"
              min="0.01"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              Price in USD
            </p>
          </div>
        </div>

        {/* Cost Preview */}
        {formData.totalSupply && formData.pricePerShare && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#0c4a6e',
              margin: '0 0 0.5rem 0'
            }}>
              Asset Preview
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#0c4a6e'
            }}>
              <div>
                <span style={{ fontWeight: '500' }}>Total Value:</span>
                <span style={{ marginLeft: '0.5rem' }}>
                  ${(parseInt(formData.totalSupply) * parseFloat(formData.pricePerShare || '0')).toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: '500' }}>Shares:</span>
                <span style={{ marginLeft: '0.5rem' }}>
                  {parseInt(formData.totalSupply).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleCreateAsset}
          disabled={loading || !formData.assetName || !formData.assetDescription || 
                   !formData.totalSupply || !formData.pricePerShare || !formData.assetType || !isConnected}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            backgroundColor: (loading || !formData.assetName || !formData.assetDescription || 
                            !formData.totalSupply || !formData.pricePerShare || !formData.assetType || !isConnected)
              ? '#d1d5db' 
              : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: (loading || !formData.assetName || !formData.assetDescription || 
                    !formData.totalSupply || !formData.pricePerShare || !formData.assetType || !isConnected)
              ? 'not-allowed' 
              : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Creating RWA Asset...' : 'Create RWA Asset'}
        </button>

        {/* Messages */}
        {message && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: message.includes('successfully') 
              ? '#dcfce7' 
              : message.includes('failed') || message.includes('error')
                ? '#fee2e2' 
                : '#dbeafe',
            border: `1px solid ${message.includes('successfully') 
              ? '#bbf7d0' 
              : message.includes('failed') || message.includes('error')
                ? '#fecaca' 
                : '#bfdbfe'}`,
            borderRadius: '6px',
            color: message.includes('successfully') 
              ? '#166534' 
              : message.includes('failed') || message.includes('error')
                ? '#991b1b' 
                : '#1e40af',
            fontSize: '0.875rem'
          }}>
            {message}
          </div>
        )}

        {!isConnected && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '6px',
            color: '#92400e',
            fontSize: '0.875rem'
          }}>
            <strong>⚠️ Note:</strong> Please connect your wallet to create RWA assets.
          </div>
        )}

        {/* Information */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#0c4a6e'
        }}>
          <strong>📋 Requirements:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: '1rem' }}>
            <li>All fields are required</li>
            <li>Total supply must be greater than 0</li>
            <li>Price per share must be greater than 0</li>
            <li>Asset name must be unique</li>
            <li>Only contract owner can create assets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
