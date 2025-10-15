import { useState } from 'react';
import type { RWAAsset } from '../types';

interface RWAAssetListProps {
  assets: RWAAsset[];
  loading: boolean;
  onAssetSelect: (asset: RWAAsset) => void;
  selectedAsset: RWAAsset | null;
  onRefresh: () => void;
}

export function RWAAssetList({ 
  assets, 
  loading, 
  onAssetSelect, 
  selectedAsset, 
  onRefresh 
}: RWAAssetListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        fontSize: '1.125rem',
        color: '#6b7280'
      }}>
        Loading RWA assets...
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827',
          margin: 0
        }}>
          📊 Available RWA Assets
        </h2>
        <button
          onClick={onRefresh}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          {assets.length === 0 ? 'No RWA assets available' : 'No assets match your search'}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {filteredAssets.map((asset, index) => (
            <div
              key={index}
              onClick={() => onAssetSelect(asset)}
              style={{
                padding: '1.5rem',
                border: selectedAsset?.name === asset.name 
                  ? '2px solid #3b82f6' 
                  : '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: selectedAsset?.name === asset.name 
                  ? '#eff6ff' 
                  : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedAsset?.name === asset.name 
                  ? '0 4px 12px rgba(59, 130, 246, 0.15)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (selectedAsset?.name !== asset.name) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAsset?.name !== asset.name) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {asset.name}
                </h3>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {asset.assetType}
                </span>
              </div>

              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {asset.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
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
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {asset.totalSupply.toLocaleString()}
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
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    ${asset.pricePerShare.toFixed(2)}
                  </p>
                </div>
              </div>

              {selectedAsset?.name === asset.name && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#dbeafe',
                  border: '1px solid #93c5fd',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  ✓ Selected for subscription
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
