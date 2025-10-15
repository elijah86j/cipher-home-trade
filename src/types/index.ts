export interface RWAAsset {
  name: string;
  description: string;
  totalSupply: number;
  pricePerShare: number;
  assetType: string;
  assetAddress: string;
}

export interface SubscriptionData {
  assetName: string;
  shares: number;
  totalCost: number;
  encrypted: boolean;
}
