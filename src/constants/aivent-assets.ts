// AIvent Asset URLs - Using locally downloaded assets
// Generated from comprehensive asset extraction

export const AIVENT_ASSETS = {
  // Background Images
  backgrounds: {
    '1': '/assets/aivent-extracted/images/backgrounds/1.webp',
    '2': '/assets/aivent-extracted/images/backgrounds/2.webp',
  },
  
  // Speaker Images
  speakers: {
    '1': '/assets/aivent-extracted/images/speakers/1.webp',
    '2': '/assets/aivent-extracted/images/speakers/2.webp',
    '3': '/assets/aivent-extracted/images/speakers/3.webp',
    '8': '/assets/aivent-extracted/images/speakers/8.webp',
    '20': '/assets/aivent-extracted/images/speakers/20.webp',
  },
  
  // Icon Images
  icons: {
    '1': '/assets/aivent-extracted/images/icons/1.webp',
    '2': '/assets/aivent-extracted/images/icons/2.webp',
    '3': '/assets/aivent-extracted/images/icons/3.webp',
    '4': '/assets/aivent-extracted/images/icons/4.webp',
    '8': '/assets/aivent-extracted/images/icons/8.webp',
    '10': '/assets/aivent-extracted/images/icons/10.webp',
    'logo': '/assets/aivent-extracted/images/icons/logo.webp',
  },
  
  // Logo Images
  logos: {
    // Will be populated when logos are available
  },
  
  // Other Images
  images: {
    'homepage-1': '/assets/aivent-extracted/images/homepage-1.webp',
    'homepage-2': '/assets/aivent-extracted/images/homepage-2.webp',
    'homepage-3': '/assets/aivent-extracted/images/homepage-3.webp',
    'homepage-4': '/assets/aivent-extracted/images/homepage-4.webp',
    'homepage-5': '/assets/aivent-extracted/images/homepage-5.webp',
    'c1': '/assets/aivent-extracted/images/c1.webp',
    's3': '/assets/aivent-extracted/images/s3.webp',
    's4': '/assets/aivent-extracted/images/s4.webp',
    's5': '/assets/aivent-extracted/images/s5.webp',
    's6': '/assets/aivent-extracted/images/s6.webp',
    's7': '/assets/aivent-extracted/images/s7.webp',
    's8': '/assets/aivent-extracted/images/s8.webp',
    's9': '/assets/aivent-extracted/images/s9.webp',
    'l3': '/assets/aivent-extracted/images/l3.webp',
    'l4': '/assets/aivent-extracted/images/l4.webp',
    'l5': '/assets/aivent-extracted/images/l5.webp',
    'arrow-down-light': '/assets/aivent-extracted/images/arrow-down-light.png',
    'arrow-down': '/assets/aivent-extracted/images/arrow-down.png',
    'arrow-up-light': '/assets/aivent-extracted/images/arrow-up-light.png',
    'arrow-up': '/assets/aivent-extracted/images/arrow-up.png',
    'arrow-right-white': '/assets/aivent-extracted/images/arrow-right-white.svg',
    'arrow-top-right-white': '/assets/aivent-extracted/images/arrow-top-right-white.svg',
  },
  
  // CSS Files
  css: {
    'bootstrap': '/assets/aivent-extracted/css/bootstrap.min.css',
    'vendors': '/assets/aivent-extracted/css/vendors.css',
    'style': '/assets/aivent-extracted/css/style.css',
    'scheme': '/assets/aivent-extracted/css/scheme-01.css',
  },
  
  // JavaScript Files
  js: {
    'vendors': '/assets/aivent-extracted/js/vendors.js',
    'designesia': '/assets/aivent-extracted/js/designesia.js',
    'countdown': '/assets/aivent-extracted/js/countdown-custom.js',
    'marquee': '/assets/aivent-extracted/js/custom-marquee.js',
  }
};

// Helper function to get asset URL
export function getAiventAsset(category: keyof typeof AIVENT_ASSETS, name: string): string {
  const categoryAssets = AIVENT_ASSETS[category] as Record<string, string>;
  return categoryAssets[name] || '';
}

// Specific helper functions for common assets
export function getAiventBackground(name: string): string {
  return getAiventAsset('backgrounds', name);
}

export function getAiventSpeaker(name: string): string {
  return getAiventAsset('speakers', name);
}

export function getAiventIcon(name: string): string {
  return getAiventAsset('icons', name);
}

export function getAiventImage(name: string): string {
  return getAiventAsset('images', name);
}
