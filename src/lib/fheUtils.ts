import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

// FHE utility functions for property trading
export class FHEManager {
  private instance: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing FHE SDK...');
      await initSDK();
      
      console.log('Creating FHE instance...');
      this.instance = await createInstance(SepoliaConfig);
      this.isInitialized = true;
      
      console.log('FHE initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FHE:', error);
      throw error;
    }
  }

  // Convert FHE handle to proper hex format (32 bytes)
  private convertHex(handle: any): string {
    let hex = '';
    if (handle instanceof Uint8Array) {
      hex = `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
    } else if (typeof handle === 'string') {
      hex = handle.startsWith('0x') ? handle : `0x${handle}`;
    } else if (Array.isArray(handle)) {
      hex = `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
    }
    
    // Ensure exactly 32 bytes (66 characters including 0x)
    if (hex.length < 66) {
      hex = hex.padEnd(66, '0');
    } else if (hex.length > 66) {
      hex = hex.substring(0, 66);
    }
    return hex;
  }

  // Encrypt property data for listing
  async encryptPropertyData(
    contractAddress: string,
    userAddress: string,
    price: number,
    area: number,
    bedrooms: number,
    bathrooms: number
  ): Promise<{ handles: string[]; inputProof: string }> {
    if (!this.isInitialized || !this.instance) {
      throw new Error('FHE Manager not initialized');
    }

    try {
      console.log('Encrypting property data:', { price, area, bedrooms, bathrooms });
      
      const input = this.instance.createEncryptedInput(contractAddress, userAddress);
      input.add32(BigInt(price));
      input.add32(BigInt(area));
      input.add8(bedrooms);
      input.add8(bathrooms);
      
      const encryptedInput = await input.encrypt();
      
      // Convert handles to proper hex format
      const handles = encryptedInput.handles.map((handle: any) => this.convertHex(handle));
      const inputProof = `0x${Array.from(encryptedInput.inputProof)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;
      
      console.log('Property data encrypted successfully');
      return { handles, inputProof };
    } catch (error) {
      console.error('Failed to encrypt property data:', error);
      throw error;
    }
  }

  // Encrypt bid amount
  async encryptBidAmount(
    contractAddress: string,
    userAddress: string,
    amount: number
  ): Promise<{ handle: string; inputProof: string }> {
    if (!this.isInitialized || !this.instance) {
      throw new Error('FHE Manager not initialized');
    }

    try {
      console.log('Encrypting bid amount:', amount);
      
      const input = this.instance.createEncryptedInput(contractAddress, userAddress);
      input.add32(BigInt(amount));
      
      const encryptedInput = await input.encrypt();
      
      const handle = this.convertHex(encryptedInput.handles[0]);
      const inputProof = `0x${Array.from(encryptedInput.inputProof)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;
      
      console.log('Bid amount encrypted successfully');
      return { handle, inputProof };
    } catch (error) {
      console.error('Failed to encrypt bid amount:', error);
      throw error;
    }
  }

  // Decrypt property data for viewing
  async decryptPropertyData(
    handles: string[],
    contractAddress: string,
    userAddress: string,
    signTypedDataFn: (args: any) => Promise<string>
  ): Promise<{ price: number; area: number; bedrooms: number; bathrooms: number }> {
    if (!this.isInitialized || !this.instance) {
      throw new Error('FHE Manager not initialized');
    }

    try {
      console.log('Decrypting property data for handles:', handles);

      const keypair = this.instance.generateKeypair();
      const handleContractPairs = handles.map(handle => ({
        handle,
        contractAddress,
      }));

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "10";
      const contractAddresses = [contractAddress];

      const eip712 = this.instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      const signature = await signTypedDataFn({
        domain: eip712.domain,
        types: eip712.types,
        primaryType: 'UserDecryptRequestVerification',
        message: eip712.message,
      });

      const result = await this.instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        userAddress,
        startTimeStamp,
        durationDays,
      );

      const decryptedData = {
        price: Number(result[handles[0]]),
        area: Number(result[handles[1]]),
        bedrooms: Number(result[handles[2]]),
        bathrooms: Number(result[handles[3]]),
      };

      console.log('Property data decrypted successfully:', decryptedData);
      return decryptedData;
    } catch (error) {
      console.error('Failed to decrypt property data:', error);
      throw error;
    }
  }

  // Decrypt bid amount
  async decryptBidAmount(
    handle: string,
    contractAddress: string,
    userAddress: string,
    signTypedDataFn: (args: any) => Promise<string>
  ): Promise<number> {
    if (!this.isInitialized || !this.instance) {
      throw new Error('FHE Manager not initialized');
    }

    try {
      console.log('Decrypting bid amount for handle:', handle);

      const keypair = this.instance.generateKeypair();
      const handleContractPairs = [{
        handle,
        contractAddress,
      }];

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "10";
      const contractAddresses = [contractAddress];

      const eip712 = this.instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      const signature = await signTypedDataFn({
        domain: eip712.domain,
        types: eip712.types,
        primaryType: 'UserDecryptRequestVerification',
        message: eip712.message,
      });

      const result = await this.instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        userAddress,
        startTimeStamp,
        durationDays,
      );

      const decryptedAmount = Number(result[handle]);
      console.log('Bid amount decrypted successfully:', decryptedAmount);
      return decryptedAmount;
    } catch (error) {
      console.error('Failed to decrypt bid amount:', error);
      throw error;
    }
  }
}

// Global FHE manager instance
export const fheManager = new FHEManager();
