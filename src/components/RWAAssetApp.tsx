import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import Header from './Header';
import { RWAAssetList } from './RWAAssetList';
import { RWAAssetSubscription } from './RWAAssetSubscription';
import { RWAAssetCreationForm } from './RWAAssetCreationForm';
import { BalanceDisplay } from './BalanceDisplay';
import type { RWAAsset } from '../types';

// Import contract configuration
import { RWA_ASSET_FACTORY_ADDRESS, RWA_ASSET_FACTORY_ABI } from '../config/contracts';

export function RWAAssetApp() {
  const { address, isConnected } = useAccount();
  const [assets, setAssets] = useState<RWAAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<RWAAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'subscribe' | 'create'>('create');
  
  // Form data state to persist across tab switches
  const [formData, setFormData] = useState({
    assetName: '',
    assetDescription: '',
    totalSupply: '',
    pricePerShare: '',
    assetType: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const loadAssets = async () => {
    try {
      setLoading(true);

      // Try to load from contract first (only if wallet is connected)
      if (isConnected && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const factory = new ethers.Contract(
            RWA_ASSET_FACTORY_ADDRESS,
            RWA_ASSET_FACTORY_ABI,
            provider
          );

          console.log('🔍 Loading assets from contract:', RWA_ASSET_FACTORY_ADDRESS);
        
          const assetNames = await factory.getAllAssetNames.staticCall();
          console.log('📝 Asset names from contract:', assetNames);
          console.log('✅ Successfully loaded', assetNames.length, 'assets from contract');
          
          if (assetNames.length > 0) {
            const assetDetails = await Promise.all(
              assetNames.map(async (name: string) => {
                try {
                  const [assetName, description, assetType, totalSupply, availableShares, pricePerShare] = 
                    await factory.getAssetInfo(name);
                  
                  return {
                    id: assetNames.indexOf(name) + 1,
                    name: assetName,
                    description,
                    totalSupply: Number(totalSupply),
                    pricePerShare: Number(pricePerShare),
                    assetType,
                    availableShares: Number(availableShares),
                    totalValue: Number(totalSupply) * Number(pricePerShare),
                    contractAddress: await factory.getRWAAsset(name)
                  };
                } catch (assetError) {
                  console.error(`Failed to load asset ${name}:`, assetError);
                  return null;
                }
              })
            );

            const validAssets = assetDetails.filter(asset => asset !== null);
            console.log('Loaded assets:', validAssets);
            setAssets(validAssets);
            return;
          }
        } catch (error) {
          console.error('Failed to load assets from contract:', error);
        }
      }
      
      // If wallet not connected or contract failed, load demo assets
      console.log('🔄 Loading demo assets (no wallet connected or contract failed)');
      const demoAssets = [
        {
          id: 1,
          name: "Manhattan Office Tower",
          description: "Premium office building in Midtown Manhattan with 50 floors, featuring modern amenities and prime location near Central Park.",
          totalSupply: 1000000,
          pricePerShare: 100,
          assetType: "Commercial Real Estate",
          availableShares: 1000000,
          totalValue: 100000000,
          contractAddress: "0x0000000000000000000000000000000000000000"
        },
        {
          id: 2,
          name: "Silicon Valley Tech Campus",
          description: "State-of-the-art technology campus in Palo Alto, California, with 200,000 sq ft of office space and research facilities.",
          totalSupply: 500000,
          pricePerShare: 250,
          assetType: "Commercial Real Estate",
          availableShares: 500000,
          totalValue: 125000000,
          contractAddress: "0x0000000000000000000000000000000000000000"
        },
        {
          id: 3,
          name: "London Luxury Apartments",
          description: "High-end residential complex in Canary Wharf, London, with 150 luxury apartments and premium amenities.",
          totalSupply: 750000,
          pricePerShare: 150,
          assetType: "Residential Real Estate",
          availableShares: 750000,
          totalValue: 112500000,
          contractAddress: "0x0000000000000000000000000000000000000000"
        },
        {
          id: 4,
          name: "Tokyo Shopping Mall",
          description: "Modern shopping center in Shibuya, Tokyo, with 300 retail units and entertainment facilities.",
          totalSupply: 800000,
          pricePerShare: 80,
          assetType: "Retail Real Estate",
          availableShares: 800000,
          totalValue: 64000000,
          contractAddress: "0x0000000000000000000000000000000000000000"
        },
        {
          id: 5,
          name: "Dubai Marina Hotel",
          description: "Luxury hotel and resort in Dubai Marina with 500 rooms, conference facilities, and beachfront access.",
          totalSupply: 600000,
          pricePerShare: 200,
          assetType: "Hospitality Real Estate",
          availableShares: 600000,
          totalValue: 120000000,
          contractAddress: "0x0000000000000000000000000000000000000000"
        }
      ];
      setAssets(demoAssets);
    } catch (error) {
      console.error('Failed to load RWA assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [isConnected]);

  const handleAssetSelect = (asset: RWAAsset) => {
    setSelectedAsset(asset);
  };

  const handleRefresh = () => {
    loadAssets();
  };

  const handleFormInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAsset = async () => {
    if (!isConnected) {
      setFormMessage('Please connect your wallet');
      return;
    }

    const { assetName, assetDescription, totalSupply, pricePerShare, assetType } = formData;
    
    if (!assetName || !assetDescription || !totalSupply || !pricePerShare || !assetType) {
      setFormMessage('Please fill all fields');
      return;
    }

    const totalSupplyNum = parseInt(totalSupply);
    const pricePerShareNum = parseFloat(pricePerShare);

    if (totalSupplyNum <= 0 || pricePerShareNum <= 0) {
      setFormMessage('Total supply and price must be greater than 0');
      return;
    }

    try {
      setFormLoading(true);
      setFormMessage('');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert price to wei (6 decimal places)
      const priceInWei = Math.floor(pricePerShareNum * 1000000);

      const factoryContract = new ethers.Contract(
        RWA_ASSET_FACTORY_ADDRESS,
        RWA_ASSET_FACTORY_ABI,
        signer
      );

      console.log('Creating RWA asset with:', {
        assetName,
        assetDescription,
        totalSupply: totalSupplyNum,
        pricePerShare: priceInWei,
        assetType
      });

      const tx = await factoryContract.createRWAAsset(
        assetName,
        assetDescription,
        totalSupplyNum,
        priceInWei,
        assetType
      );

      setFormMessage('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      setFormMessage(`RWA Asset "${assetName}" created successfully!`);
      
      // Reset form after successful creation
      setFormData({
        assetName: '',
        assetDescription: '',
        totalSupply: '',
        pricePerShare: '',
        assetType: ''
      });
      
      // Refresh assets list
      handleRefresh();
    } catch (error) {
      console.error('Failed to create RWA asset:', error);
      setFormMessage(`Failed to create asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setFormLoading(false);
    }
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
              </div>

              {/* Tab Content */}
              <div style={{
                padding: '1.5rem',
                minHeight: '500px'
              }}>
                {activeTab === 'create' ? (
                  <RWAAssetCreationForm 
                    onAssetCreated={handleRefresh}
                    formData={formData}
                    onFormDataChange={handleFormInputChange}
                    onCreateAsset={handleCreateAsset}
                    loading={formLoading}
                    message={formMessage}
                  />
                ) : activeTab === 'assets' ? (
                  <RWAAssetList
                    assets={assets}
                    loading={loading}
                    onAssetSelect={handleAssetSelect}
                    selectedAsset={selectedAsset}
                    onRefresh={handleRefresh}
                  />
                ) : (
                  <RWAAssetSubscription
                    selectedAsset={selectedAsset}
                    userAddress={address!}
                    onSubscriptionComplete={handleRefresh}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
