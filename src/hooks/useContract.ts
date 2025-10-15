import { useReadContract, useWriteContract, useAccount, useSignTypedData } from 'wagmi';
import { CipherHomeTradeABI } from '../lib/contract-abi';
import { fheManager } from '../lib/fheUtils';

// Contract address - this should be deployed to Sepolia testnet
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual deployed address

export const useCipherHomeTrade = () => {
  const { address } = useAccount();

  return {
    address,
    isConnected: !!address,
  };
};

export const usePropertyList = () => {
  const { data: totalProperties } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CipherHomeTradeABI,
    functionName: 'getTotalProperties',
  });

  return {
    totalProperties: totalProperties as bigint | undefined,
  };
};

export const useUserProfile = (userAddress?: string) => {
  const { address } = useAccount();
  const targetAddress = userAddress || address;

  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CipherHomeTradeABI,
    functionName: 'getUserProfile',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  return {
    profile,
  };
};

export const usePropertyInfo = (propertyId: number) => {
  const { data: propertyInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CipherHomeTradeABI,
    functionName: 'getPropertyInfo',
    args: [BigInt(propertyId)],
  });

  return {
    propertyInfo,
  };
};

export const usePropertyBids = (propertyId: number) => {
  const { data: bidIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CipherHomeTradeABI,
    functionName: 'getPropertyBids',
    args: [BigInt(propertyId)],
  });

  return {
    bidIds: bidIds as bigint[] | undefined,
  };
};

export const useBidInfo = (bidId: number) => {
  const { data: bidInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CipherHomeTradeABI,
    functionName: 'getBidInfo',
    args: [BigInt(bidId)],
  });

  return {
    bidInfo,
  };
};

// Contract write hooks
export const useListProperty = () => {
  const { writeContractAsync: listProperty, isPending, error } = useWriteContract();

  const listPropertyWithParams = async (params: any) => {
    return listProperty({
      address: CONTRACT_ADDRESS,
      abi: CipherHomeTradeABI,
      functionName: 'listProperty',
      ...params,
    });
  };

  return {
    listProperty: listPropertyWithParams,
    isLoading: isPending,
    error,
  };
};

export const usePlaceBid = () => {
  const { writeContractAsync: placeBid, isPending, error } = useWriteContract();

  const placeBidWithParams = async (params: any) => {
    return placeBid({
      address: CONTRACT_ADDRESS,
      abi: CipherHomeTradeABI,
      functionName: 'placeBid',
      ...params,
    });
  };

  return {
    placeBid: placeBidWithParams,
    isLoading: isPending,
    error,
  };
};

export const useAcceptBid = () => {
  const { writeContractAsync: acceptBid, isPending, error } = useWriteContract();

  const acceptBidWithParams = async (params: any) => {
    return acceptBid({
      address: CONTRACT_ADDRESS,
      abi: CipherHomeTradeABI,
      functionName: 'acceptBid',
      ...params,
    });
  };

  return {
    acceptBid: acceptBidWithParams,
    isLoading: isPending,
    error,
  };
};

export const useCreateUserProfile = () => {
  const { writeContractAsync: createProfile, isPending, error } = useWriteContract();

  const createProfileWithParams = async (params: any) => {
    return createProfile({
      address: CONTRACT_ADDRESS,
      abi: CipherHomeTradeABI,
      functionName: 'createUserProfile',
      ...params,
    });
  };

  return {
    createProfile: createProfileWithParams,
    isLoading: isPending,
    error,
  };
};

// FHE-encrypted property listing
export const useListPropertyEncrypted = () => {
  const { writeContractAsync: listProperty, isPending, error } = useWriteContract();
  const { address } = useAccount();

  const listPropertyWithEncryption = async (params: {
    name: string;
    description: string;
    location: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');
    
    // Initialize FHE manager
    await fheManager.initialize();
    
    // Encrypt property data
    const { handles, inputProof } = await fheManager.encryptPropertyData(
      CONTRACT_ADDRESS,
      address,
      params.price,
      params.area,
      params.bedrooms,
      params.bathrooms
    );

    return listProperty({
      address: CONTRACT_ADDRESS,
      abi: CipherHomeTradeABI,
      functionName: 'listProperty',
      args: [
        params.name,
        params.description,
        params.location,
        handles[0], // encrypted price
        handles[1], // encrypted area
        handles[2], // encrypted bedrooms
        handles[3], // encrypted bathrooms
        inputProof
      ],
    });
  };

  return {
    listProperty: listPropertyWithEncryption,
    isLoading: isPending,
    error,
  };
};

// FHE-encrypted bid placement
export const usePlaceBidEncrypted = () => {
  const { writeContractAsync: placeBid, isPending, error } = useWriteContract();
  const { address } = useAccount();

  const placeBidWithEncryption = async (params: {
    propertyId: number;
    amount: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');
    
    // Initialize FHE manager
    await fheManager.initialize();
    
    // Encrypt bid amount
    const { handle, inputProof } = await fheManager.encryptBidAmount(
      CONTRACT_ADDRESS,
      address,
      params.amount
    );

    return placeBid({
      address: CONTRACT_ADDRESS,
      abi: CipherHomeTradeABI,
      functionName: 'placeBid',
      args: [
        BigInt(params.propertyId),
        handle, // encrypted amount
        inputProof
      ],
    });
  };

  return {
    placeBid: placeBidWithEncryption,
    isLoading: isPending,
    error,
  };
};

// FHE decryption for property data
export const useDecryptPropertyData = () => {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const decryptPropertyData = async (handles: string[]) => {
    if (!address) throw new Error('Wallet not connected');
    if (!signTypedDataAsync) throw new Error('Signer not available');
    
    // Initialize FHE manager
    await fheManager.initialize();
    
    return fheManager.decryptPropertyData(
      handles,
      CONTRACT_ADDRESS,
      address,
      signTypedDataAsync
    );
  };

  return {
    decryptPropertyData,
  };
};

// FHE decryption for bid data
export const useDecryptBidData = () => {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const decryptBidAmount = async (handle: string) => {
    if (!address) throw new Error('Wallet not connected');
    if (!signTypedDataAsync) throw new Error('Signer not available');
    
    // Initialize FHE manager
    await fheManager.initialize();
    
    return fheManager.decryptBidAmount(
      handle,
      CONTRACT_ADDRESS,
      address,
      signTypedDataAsync
    );
  };

  return {
    decryptBidAmount,
  };
};
