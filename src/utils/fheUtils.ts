// FHE utility functions based on project experience

/**
 * Safe string to number conversion (avoid 32-bit overflow)
 * Based on PROJECT_LEARNINGS.md experience
 */
export function getStringValue(str: string): number {
  const first6 = str.substring(0, 6);
  let value = 0;
  for (let i = 0; i < first6.length; i++) {
    value = value * 100 + first6.charCodeAt(i);
  }
  return Math.min(value, 2000000000); // Limit within 32-bit range
}

/**
 * Reverse conversion to display string
 * Based on PROJECT_LEARNINGS.md experience
 */
export function getStringDescription(value: number): string {
  let result = '';
  let num = value;
  while (num > 0 && result.length < 6) {
    const charCode = num % 100;
    if (charCode >= 32 && charCode <= 126) {
      result = String.fromCharCode(charCode) + result;
    }
    num = Math.floor(num / 100);
  }
  return result ? `${result}...` : 'Unknown';
}

/**
 * Correct FHE handle conversion (ensure 32 bytes)
 * Based on PROJECT_LEARNINGS.md experience
 */
export function convertHex(handle: any): string {
  let hex = '';
  if (handle instanceof Uint8Array) {
    hex = `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else if (typeof handle === 'string') {
    hex = handle.startsWith('0x') ? handle : `0x${handle}`;
  } else if (Array.isArray(handle)) {
    hex = `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
  } else {
    hex = `0x${handle.toString()}`;
  }
  
  // Ensure exactly 32 bytes (66 characters including 0x)
  if (hex.length < 66) {
    hex = hex.padEnd(66, '0');
  } else if (hex.length > 66) {
    hex = hex.substring(0, 66);
  }
  return hex;
}

/**
 * Safe BigInt conversion
 * Based on PROJECT_LEARNINGS.md experience
 */
export function safeBigInt(value: string | number): bigint {
  try {
    return BigInt(value);
  } catch (error) {
    console.error('BigInt conversion failed:', error);
    return BigInt(0);
  }
}
