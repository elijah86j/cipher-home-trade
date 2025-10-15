import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import Header from './Header';
import { RWAAssetList } from './RWAAssetList';
import { RWAAssetSubscription } from './RWAAssetSubscription';
import { RWAAssetCreationForm } from './RWAAssetCreationForm';
import { BalanceDisplay } from './BalanceDisplay';
import type { RWAAsset } from '../types';

// Contract configuration
const RWA_ASSET_FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with deployed address
const RWA_ASSET_FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "assetName", "type": "string"},
      {"internalType": "string", "name": "assetDescription", "type": "string"},
      {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
      {"internalType": "uint256", "name": "pricePerShare", "type": "uint256"},
      {"internalType": "string", "name": "assetType", "type": "string"}
    ],
    "name": "createRWAAsset",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "assetName", "type": "string"}],
    "name": "getAllAssetNames",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "assetName", "type": "string"}],
    "name": "getAssetInfo",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export function RWAAssetApp() {
  const { address, isConnected } = useAccount();
  const [assets, setAssets] = useState<RWAAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<RWAAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'subscribe' | 'create'>('assets');

  const loadAssets = async () => {
    if (!isConnected) return;

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(
        RWA_ASSET_FACTORY_ADDRESS,
        RWA_ASSET_FACTORY_ABI,
        provider
      );

      const assetNames = await factory.getAllAssetNames();
      
      const assetDetails = await Promise.all(
        assetNames.map(async (name: string) => {
          const [assetName, description, totalSupply, pricePerShare, assetType, assetAddress] = 
            await factory.getAssetInfo(name);
          
          return {
            name: assetName,
            description,
            totalSupply: Number(totalSupply),
            pricePerShare: Number(pricePerShare) / 1000000, // Convert from wei
            assetType,
            assetAddress
          };
        })
      );

      setAssets(assetDetails);
    } catch (error) {
      console.error('Failed to load RWA assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadAssets();
    }
  }, [isConnected]);

  const handleAssetSelect = (asset: RWAAsset) => {
    setSelectedAsset(asset);
  };

  const handleRefresh = () => {
    loadAssets();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Header />

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {!isConnected ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 3rem',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '1rem'
            }}>
              RWA Asset Subscription Platform
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Subscribe to real-world assets with FHE encryption
            </p>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              display: 'inline-block'
            }}>
              <p style={{
                color: '#667eea',
                fontSize: '0.875rem',
                fontWeight: '600',
                margin: 0
              }}>
                🔗 Please connect your wallet to start subscribing
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Balance Display */}
            <BalanceDisplay
              address={address!}
              assets={assets}
              onRefresh={handleRefresh}
            />

            {/* Tab Navigation */}
            <div style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                borderBottom: '2px solid rgba(229, 231, 235, 0.8)'
              }}>
                <button
                  onClick={() => setActiveTab('assets')}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    border: 'none',
                    background: activeTab === 'assets'
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : 'transparent',
                    color: activeTab === 'assets' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📊 Assets
                </button>
                <button
                  onClick={() => setActiveTab('subscribe')}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    border: 'none',
                    background: activeTab === 'subscribe'
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'transparent',
                    color: activeTab === 'subscribe' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💰 Subscribe
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    border: 'none',
                    background: activeTab === 'create'
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'transparent',
                    color: activeTab === 'create' ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🏭 Create Asset
                </button>
              </div>

              {/* Tab Content */}
              <div style={{
                padding: '1.5rem',
                minHeight: '500px'
              }}>
                {activeTab === 'assets' ? (
                  <RWAAssetList
                    assets={assets}
                    loading={loading}
                    onAssetSelect={handleAssetSelect}
                    selectedAsset={selectedAsset}
                    onRefresh={handleRefresh}
                  />
                ) : activeTab === 'subscribe' ? (
                  <RWAAssetSubscription
                    selectedAsset={selectedAsset}
                    userAddress={address!}
                    onSubscriptionComplete={handleRefresh}
                  />
                ) : (
                  <RWAAssetCreationForm onAssetCreated={handleRefresh} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
