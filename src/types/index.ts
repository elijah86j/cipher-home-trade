export interface RWAAsset {
  id?: number;
  name: string;
  description: string;
  totalSupply: number;
  pricePerShare: number;
  assetType: string;
  availableShares?: number;
  totalValue?: number;
  contractAddress?: string;
  assetAddress?: string;
}

export interface SubscriptionData {
  assetName: string;
  shares: number;
  totalCost: number;
  encrypted: boolean;
}
