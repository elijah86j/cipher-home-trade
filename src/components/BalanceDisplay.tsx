import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import type { RWAAsset } from '../types';

interface BalanceDisplayProps {
  address: string;
  assets: RWAAsset[];
  onRefresh: () => void;
}

export function BalanceDisplay({ address, assets, onRefresh }: BalanceDisplayProps) {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('BalanceDisplay - Assets received:', assets);
    console.log('Assets length:', assets?.length);
    if (assets && assets.length > 0) {
      console.log('First asset:', assets[0]);
      console.log('Asset types:', assets.map(a => a.assetType));
      console.log('All asset data:', assets.map(a => ({
        name: a.name,
        assetType: a.assetType,
        totalSupply: a.totalSupply,
        pricePerShare: a.pricePerShare
      })));
    } else {
      console.log('No assets or empty array');
    }
  }, [assets]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        setEthBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error('Failed to fetch ETH balance:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchBalance();
    }
  }, [address]);

  return (
    <div style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          💼 Portfolio Overview
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {/* ETH Balance */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '1.5rem',
              marginRight: '0.5rem'
            }}>
              Ξ
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#0c4a6e'
            }}>
              ETH Balance
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            {loading ? '...' : `${parseFloat(ethBalance).toFixed(4)} ETH`}
          </div>
        </div>

        {/* Available Assets */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '1.5rem',
              marginRight: '0.5rem'
            }}>
              📊
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#166534'
            }}>
              Available Assets
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            {assets.length} Assets
          </div>
        </div>

        {/* Total Value */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '1.5rem',
              marginRight: '0.5rem'
            }}>
              💰
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#92400e'
            }}>
              Total Portfolio Value
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            ${assets.reduce((sum, asset) => {
              const totalSupply = Number(asset.totalSupply) || 0;
              const pricePerShare = Number(asset.pricePerShare) || 0;
              return sum + (totalSupply * pricePerShare);
            }, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Asset Summary */}
      {assets.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 0.75rem 0'
          }}>
            Asset Types Distribution
          </h4>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {(() => {
              console.log('Rendering asset types distribution...');
              console.log('Assets for distribution:', assets);
              
              if (!assets || assets.length === 0) {
                console.log('No assets available for distribution');
                return (
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    No assets loaded
                  </span>
                );
              }
              
              const assetTypes = assets.map(asset => {
                console.log('Asset type for:', asset.name, 'is:', asset.assetType);
                return asset.assetType || 'Unknown';
              });
              console.log('All asset types:', assetTypes);
              
              const uniqueTypes = Array.from(new Set(assetTypes));
              console.log('Unique asset types:', uniqueTypes);
              
              return uniqueTypes.map(type => {
                const count = assets.filter(asset => (asset.assetType || 'Unknown') === type).length;
                console.log(`Type: ${type}, Count: ${count}`);
                return (
                  <span
                    key={type}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    {type} ({count})
                  </span>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
