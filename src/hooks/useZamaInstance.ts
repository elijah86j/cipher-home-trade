import { useState, useEffect } from 'react';
import * as ZamaSDK from '@zama-fhe/relayer-sdk/bundle';

// FHE handle conversion function based on project experience
const convertHex = (handle: any): string => {
  console.log('Converting handle:', handle, 'type:', typeof handle, 'isUint8Array:', handle instanceof Uint8Array);
  
  let formattedHandle: string;
  if (typeof handle === 'string') {
    formattedHandle = handle.startsWith('0x') ? handle : `0x${handle}`;
  } else if (handle instanceof Uint8Array) {
    formattedHandle = `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else if (Array.isArray(handle)) {
    // Handle array format
    formattedHandle = `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else {
    formattedHandle = `0x${handle.toString()}`;
  }
  
  console.log('Converted handle:', formattedHandle);
  
  // Ensure exactly 32 bytes (66 characters including 0x)
  if (formattedHandle.length < 66) {
    formattedHandle = formattedHandle.padEnd(66, '0');
  } else if (formattedHandle.length > 66) {
    formattedHandle = formattedHandle.substring(0, 66);
  }
  
  return formattedHandle;
};

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initZama = async () => {
      try {
        console.log('🔍 Starting FHE SDK initialization...');
        setIsLoading(true);
        setError(null);
        
        console.log('📦 Initializing FHE SDK...');
        console.log('🔍 ZamaSDK object:', ZamaSDK);
        console.log('🔍 Available methods:', Object.keys(ZamaSDK));
        
        await ZamaSDK.initSDK();
        
        console.log('🏗️ Creating FHE instance...');
        const zamaInstance = await ZamaSDK.createInstance(ZamaSDK.SepoliaConfig);

        if (mounted) {
          setInstance(zamaInstance);
          console.log('✅ FHE SDK initialized successfully');
          console.log('🔐 FHE instance ready for encryption operations');
        }
      } catch (err) {
        console.error('❌ Failed to initialize Zama instance:', err);
        
        if (mounted) {
          setError('Failed to initialize encryption service. FHE features will be disabled.');
          console.warn('⚠️ FHE features will be disabled due to initialization failure');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initZama();

    return () => {
      mounted = false;
    };
  }, []);

  return { instance, isLoading, error };
}

// Export FHE utility functions
export { convertHex };
