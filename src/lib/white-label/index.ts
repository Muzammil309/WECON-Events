// Enterprise White-Label Customization System for WECON
// Supports complete branding, theming, and custom domain configuration

interface BrandingConfig {
  id: string;
  name: string;
  organizationId: string;
  
  // Visual Branding
  logo: {
    primary: string; // URL to primary logo
    secondary?: string; // URL to secondary/white logo
    favicon: string; // URL to favicon
    dimensions: {
      width: number;
      height: number;
    };
  };
  
  // Color Scheme
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  
  // Typography
  typography: {
    fontFamily: {
      primary: string;
      secondary?: string;
      monospace?: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  
  // Layout & Spacing
  layout: {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  
  // Custom CSS
  customCSS?: string;
  
  // Domain Configuration
  domain: {
    custom?: string; // Custom domain (e.g., events.company.com)
    subdomain?: string; // Subdomain (e.g., company.wecon.events)
    ssl: boolean;
    redirects?: string[]; // Additional domains to redirect
  };
  
  // Email Branding
  email: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    headerImage?: string;
    footerText?: string;
    socialLinks?: {
      platform: string;
      url: string;
    }[];
  };
  
  // Feature Customization
  features: {
    hideWeconBranding: boolean;
    customFooter?: string;
    customTermsUrl?: string;
    customPrivacyUrl?: string;
    customSupportUrl?: string;
    allowedLanguages?: string[];
    defaultLanguage: string;
    timezone: string;
  };
  
  // Mobile App Customization
  mobileApp?: {
    appName: string;
    appIcon: string;
    splashScreen: string;
    primaryColor: string;
    bundleId?: string; // For iOS
    packageName?: string; // For Android
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: string; // URL to preview image
  colors: BrandingConfig['colors'];
  typography: BrandingConfig['typography'];
  layout: BrandingConfig['layout'];
  category: 'corporate' | 'modern' | 'minimal' | 'vibrant' | 'dark' | 'custom';
}

// Predefined theme presets
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue theme perfect for corporate events',
    preview: '/themes/corporate-blue.jpg',
    category: 'corporate',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1f2937',
        secondary: '#4b5563',
        muted: '#9ca3af'
      },
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif'
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    layout: {
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }
    }
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Contemporary gradient theme with vibrant colors',
    preview: '/themes/modern-gradient.jpg',
    category: 'modern',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#ffffff',
      surface: '#faf5ff',
      text: {
        primary: '#1f2937',
        secondary: '#4b5563',
        muted: '#9ca3af'
      },
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#8b5cf6'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Poppins, system-ui, sans-serif',
        secondary: 'Poppins, system-ui, sans-serif'
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    layout: {
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem'
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      shadows: {
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      }
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Clean and minimal design with subtle accents',
    preview: '/themes/minimal-clean.jpg',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#6b7280'
      },
      status: {
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#0284c7'
      }
    },
    typography: {
      fontFamily: {
        primary: 'system-ui, -apple-system, sans-serif',
        secondary: 'system-ui, -apple-system, sans-serif'
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    layout: {
      borderRadius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.375rem',
        xl: '0.5rem'
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        lg: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        xl: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      }
    }
  }
];

// White-label manager class
export class WhiteLabelManager {
  private brandingConfigs: Map<string, BrandingConfig> = new Map();
  private activeBranding: BrandingConfig | null = null;

  // Get all theme presets
  getThemePresets(): ThemePreset[] {
    return THEME_PRESETS;
  }

  // Get theme presets by category
  getThemePresetsByCategory(category: ThemePreset['category']): ThemePreset[] {
    return THEME_PRESETS.filter(preset => preset.category === category);
  }

  // Create branding configuration
  createBrandingConfig(config: Omit<BrandingConfig, 'id' | 'createdAt' | 'updatedAt'>): BrandingConfig {
    const brandingConfig: BrandingConfig = {
      ...config,
      id: `branding_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.brandingConfigs.set(brandingConfig.id, brandingConfig);
    return brandingConfig;
  }

  // Update branding configuration
  updateBrandingConfig(id: string, updates: Partial<BrandingConfig>): BrandingConfig {
    const existing = this.brandingConfigs.get(id);
    if (!existing) {
      throw new Error('Branding configuration not found');
    }

    const updated: BrandingConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.brandingConfigs.set(id, updated);
    return updated;
  }

  // Get branding configuration
  getBrandingConfig(id: string): BrandingConfig | undefined {
    return this.brandingConfigs.get(id);
  }

  // Set active branding
  setActiveBranding(id: string): void {
    const config = this.brandingConfigs.get(id);
    if (!config) {
      throw new Error('Branding configuration not found');
    }
    this.activeBranding = config;
  }

  // Get active branding
  getActiveBranding(): BrandingConfig | null {
    return this.activeBranding;
  }

  // Generate CSS variables from branding config
  generateCSSVariables(config: BrandingConfig): string {
    return `
      :root {
        /* Colors */
        --color-primary: ${config.colors.primary};
        --color-secondary: ${config.colors.secondary};
        --color-accent: ${config.colors.accent};
        --color-background: ${config.colors.background};
        --color-surface: ${config.colors.surface};
        --color-text-primary: ${config.colors.text.primary};
        --color-text-secondary: ${config.colors.text.secondary};
        --color-text-muted: ${config.colors.text.muted};
        --color-success: ${config.colors.status.success};
        --color-warning: ${config.colors.status.warning};
        --color-error: ${config.colors.status.error};
        --color-info: ${config.colors.status.info};

        /* Typography */
        --font-family-primary: ${config.typography.fontFamily.primary};
        --font-family-secondary: ${config.typography.fontFamily.secondary || config.typography.fontFamily.primary};
        --font-size-xs: ${config.typography.fontSizes.xs};
        --font-size-sm: ${config.typography.fontSizes.sm};
        --font-size-base: ${config.typography.fontSizes.base};
        --font-size-lg: ${config.typography.fontSizes.lg};
        --font-size-xl: ${config.typography.fontSizes.xl};
        --font-size-2xl: ${config.typography.fontSizes['2xl']};
        --font-size-3xl: ${config.typography.fontSizes['3xl']};
        --font-size-4xl: ${config.typography.fontSizes['4xl']};
        --font-weight-light: ${config.typography.fontWeights.light};
        --font-weight-normal: ${config.typography.fontWeights.normal};
        --font-weight-medium: ${config.typography.fontWeights.medium};
        --font-weight-semibold: ${config.typography.fontWeights.semibold};
        --font-weight-bold: ${config.typography.fontWeights.bold};

        /* Layout */
        --border-radius-sm: ${config.layout.borderRadius.sm};
        --border-radius-md: ${config.layout.borderRadius.md};
        --border-radius-lg: ${config.layout.borderRadius.lg};
        --border-radius-xl: ${config.layout.borderRadius.xl};
        --spacing-xs: ${config.layout.spacing.xs};
        --spacing-sm: ${config.layout.spacing.sm};
        --spacing-md: ${config.layout.spacing.md};
        --spacing-lg: ${config.layout.spacing.lg};
        --spacing-xl: ${config.layout.spacing.xl};
        --shadow-sm: ${config.layout.shadows.sm};
        --shadow-md: ${config.layout.shadows.md};
        --shadow-lg: ${config.layout.shadows.lg};
        --shadow-xl: ${config.layout.shadows.xl};
      }

      /* Custom CSS */
      ${config.customCSS || ''}
    `;
  }

  // Generate email template with branding
  generateEmailTemplate(config: BrandingConfig, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${config.name}</title>
        <style>
          body {
            font-family: ${config.typography.fontFamily.primary};
            color: ${config.colors.text.primary};
            background-color: ${config.colors.background};
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${config.colors.surface};
          }
          .header {
            background-color: ${config.colors.primary};
            padding: 20px;
            text-align: center;
          }
          .header img {
            max-height: 60px;
            width: auto;
          }
          .content {
            padding: 30px;
          }
          .footer {
            background-color: ${config.colors.text.muted};
            color: ${config.colors.background};
            padding: 20px;
            text-align: center;
            font-size: ${config.typography.fontSizes.sm};
          }
          .button {
            display: inline-block;
            background-color: ${config.colors.primary};
            color: ${config.colors.background};
            padding: 12px 24px;
            text-decoration: none;
            border-radius: ${config.layout.borderRadius.md};
            font-weight: ${config.typography.fontWeights.medium};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${config.logo.secondary ? `<img src="${config.logo.secondary}" alt="${config.name}">` : `<h1 style="color: ${config.colors.background}; margin: 0;">${config.name}</h1>`}
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            ${config.email.footerText || `© ${new Date().getFullYear()} ${config.name}. All rights reserved.`}
            ${config.email.socialLinks ? config.email.socialLinks.map(link => `<a href="${link.url}" style="color: ${config.colors.background}; margin: 0 10px;">${link.platform}</a>`).join('') : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Validate domain configuration
  validateDomain(domain: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      errors.push('Invalid domain format');
    }

    // Check for reserved domains
    const reservedDomains = ['localhost', 'wecon.com', 'admin', 'api', 'www'];
    if (reservedDomains.some(reserved => domain.includes(reserved))) {
      errors.push('Domain contains reserved words');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Export branding configuration
  exportBrandingConfig(id: string): string {
    const config = this.brandingConfigs.get(id);
    if (!config) {
      throw new Error('Branding configuration not found');
    }

    return JSON.stringify(config, null, 2);
  }

  // Import branding configuration
  importBrandingConfig(configJson: string): BrandingConfig {
    try {
      const config = JSON.parse(configJson);
      
      // Validate required fields
      if (!config.name || !config.colors || !config.typography) {
        throw new Error('Invalid branding configuration format');
      }

      // Generate new ID and timestamps
      const brandingConfig: BrandingConfig = {
        ...config,
        id: `branding_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.brandingConfigs.set(brandingConfig.id, brandingConfig);
      return brandingConfig;
    } catch (error) {
      throw new Error('Failed to import branding configuration: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}

// Global white-label manager instance
export const whiteLabelManager = new WhiteLabelManager();

// React hook for white-label theming
export function useWhiteLabel() {
  const [activeBranding, setActiveBrandingState] = React.useState(whiteLabelManager.getActiveBranding());

  const setActiveBranding = (id: string) => {
    whiteLabelManager.setActiveBranding(id);
    setActiveBrandingState(whiteLabelManager.getActiveBranding());
  };

  const generateCSS = (config: BrandingConfig) => {
    return whiteLabelManager.generateCSSVariables(config);
  };

  return {
    activeBranding,
    setActiveBranding,
    generateCSS,
    themePresets: whiteLabelManager.getThemePresets(),
    createBranding: whiteLabelManager.createBrandingConfig.bind(whiteLabelManager),
    updateBranding: whiteLabelManager.updateBrandingConfig.bind(whiteLabelManager)
  };
}
