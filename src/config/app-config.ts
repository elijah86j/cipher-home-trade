// Application configuration
export const APP_CONFIG = {
  // Set to false for demo/recording purposes (no FHE encryption)
  // Set to true for production with FHE encryption
  USE_FHE_ENCRYPTION: false,
  
  // Demo mode settings
  DEMO_MODE: {
    enabled: true,
    description: "Demo mode - Simple subscription without FHE encryption",
    showEncryptionToggle: false // Hide encryption toggle in demo mode
  },
  
  // Production mode settings  
  PRODUCTION_MODE: {
    enabled: false,
    description: "Production mode - FHE encrypted subscription",
    showEncryptionToggle: true // Show encryption toggle in production mode
  }
};

// Helper function to get current mode
export function getCurrentMode() {
  return APP_CONFIG.USE_FHE_ENCRYPTION ? 'production' : 'demo';
}

// Helper function to check if encryption is enabled
export function isEncryptionEnabled() {
  return APP_CONFIG.USE_FHE_ENCRYPTION;
}

// Helper function to check if demo mode is enabled
export function isDemoMode() {
  return !APP_CONFIG.USE_FHE_ENCRYPTION;
}
