import { useState, useEffect } from 'react';

// FHE SDK will be loaded from CDN script
declare global {
  interface Window {
    Zama?: {
      initSDK: () => Promise<void>;
      createInstance: (config: any) => Promise<any>;
      SepoliaConfig: any;
    };
  }
}

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
        console.log('🌐 Window object available:', typeof window !== 'undefined');
        console.log('🔧 Zama object available:', !!(window as any).Zama);
        console.log('📦 initSDK function available:', !!(window as any).Zama?.initSDK);
        console.log('🏗️ createInstance function available:', !!(window as any).Zama?.createInstance);
        
        setIsLoading(true);
        setError(null);
        
        // Check if FHE SDK is available
        if (typeof window !== 'undefined' && !(window as any).Zama) {
          console.warn('⚠️ FHE SDK not loaded from CDN, retrying...');
          throw new Error('FHE SDK not loaded from CDN');
        }
        
        console.log('📦 Initializing FHE SDK...');
        await window.Zama!.initSDK();
        
        console.log('🏗️ Creating FHE instance...');
        const zamaInstance = await window.Zama!.createInstance(window.Zama!.SepoliaConfig);

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

    // Add a small delay to ensure CDN script is loaded
    console.log('⏰ Setting up FHE initialization timer...');
    const timer = setTimeout(() => {
      console.log('⏰ FHE initialization timer triggered');
      initZama();
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return { instance, isLoading, error };
}

// Export FHE utility functions
export { convertHex };
