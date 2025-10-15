import { useMemo, useEffect, useState } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

async function walletClientToSigner(walletClient: any): Promise<JsonRpcSigner> {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new BrowserProvider(transport, network);
  const signer = await provider.getSigner(account.address);
  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();

  useEffect(() => {
    async function getSigner() {
      if (walletClient) {
        try {
          const ethSigner = await walletClientToSigner(walletClient);
          setSigner(ethSigner);
        } catch (error) {
          console.error('Error creating signer:', error);
          setSigner(undefined);
        }
      } else {
        setSigner(undefined);
      }
    }

    getSigner();
  }, [walletClient]);

  return signer;
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });

  return useMemo(() => {
    if (!publicClient) return undefined;

    const network = {
      chainId: publicClient.chain.id,
      name: publicClient.chain.name,
      ensAddress: publicClient.chain.contracts?.ensRegistry?.address,
    };

    return new BrowserProvider(publicClient.transport, network);
  }, [publicClient]);
}
