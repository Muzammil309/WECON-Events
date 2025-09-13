// Enterprise Multi-language Support System for WECON
// Supports dynamic language switching, RTL languages, and content localization

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
  enabled: boolean;
}

interface LocalizationContext {
  language: string;
  translations: Translation;
  formatters: {
    date: (date: Date) => string;
    time: (date: Date) => string;
    currency: (amount: number) => string;
    number: (num: number) => string;
  };
}

// Supported languages configuration
export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '$'
    },
    enabled: true
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€'
    },
    enabled: true
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: '€'
    },
    enabled: true
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€'
    },
    enabled: true
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'ر.س'
    },
    enabled: true
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥'
    },
    enabled: true
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥'
    },
    enabled: true
  }
};

// Translation cache
const translationCache = new Map<string, Translation>();

// Main internationalization class
export class I18nManager {
  private currentLanguage: string = 'en';
  private fallbackLanguage: string = 'en';
  private translations: Translation = {};

  constructor(initialLanguage: string = 'en') {
    this.currentLanguage = initialLanguage;
    this.loadTranslations(initialLanguage);
  }

  // Load translations for a specific language
  async loadTranslations(languageCode: string): Promise<void> {
    if (translationCache.has(languageCode)) {
      this.translations = translationCache.get(languageCode)!;
      return;
    }

    try {
      // In a real implementation, these would be loaded from files or API
      const translations = await this.fetchTranslations(languageCode);
      translationCache.set(languageCode, translations);
      this.translations = translations;
    } catch (error) {
      console.error(`Failed to load translations for ${languageCode}:`, error);
      if (languageCode !== this.fallbackLanguage) {
        await this.loadTranslations(this.fallbackLanguage);
      }
    }
  }

  // Fetch translations (mock implementation)
  private async fetchTranslations(languageCode: string): Promise<Translation> {
    // In production, this would fetch from your translation service or files
    const baseTranslations = await import(`./translations/${languageCode}.json`).catch(() => ({}));
    return baseTranslations.default || baseTranslations;
  }

  // Translate a key with optional interpolation
  translate(key: string, params?: Record<string, string | number>): string {
    const translation = this.getNestedTranslation(key);
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
      return key;
    }

    // Handle parameter interpolation
    if (params) {
      return this.interpolateParams(translation, params);
    }

    return translation;
  }

  // Get nested translation value
  private getNestedTranslation(key: string): string {
    const keys = key.split('.');
    let current: any = this.translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return '';
      }
    }

    return typeof current === 'string' ? current : '';
  }

  // Interpolate parameters in translation
  private interpolateParams(translation: string, params: Record<string, string | number>): string {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  // Change current language
  async setLanguage(languageCode: string): Promise<void> {
    if (!SUPPORTED_LANGUAGES[languageCode]?.enabled) {
      throw new Error(`Language ${languageCode} is not supported or enabled`);
    }

    this.currentLanguage = languageCode;
    await this.loadTranslations(languageCode);
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Get language configuration
  getLanguageConfig(languageCode?: string): LanguageConfig {
    const code = languageCode || this.currentLanguage;
    return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES[this.fallbackLanguage];
  }

  // Get all enabled languages
  getEnabledLanguages(): LanguageConfig[] {
    return Object.values(SUPPORTED_LANGUAGES).filter(lang => lang.enabled);
  }

  // Format date according to current language
  formatDate(date: Date): string {
    const config = this.getLanguageConfig();
    return new Intl.DateTimeFormat(this.currentLanguage, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  // Format time according to current language
  formatTime(date: Date): string {
    const config = this.getLanguageConfig();
    return new Intl.DateTimeFormat(this.currentLanguage, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: config.timeFormat.includes('A')
    }).format(date);
  }

  // Format currency according to current language
  formatCurrency(amount: number, currency?: string): string {
    const config = this.getLanguageConfig();
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  }

  // Format number according to current language
  formatNumber(num: number): string {
    return new Intl.NumberFormat(this.currentLanguage).format(num);
  }

  // Get localization context for components
  getLocalizationContext(): LocalizationContext {
    return {
      language: this.currentLanguage,
      translations: this.translations,
      formatters: {
        date: this.formatDate.bind(this),
        time: this.formatTime.bind(this),
        currency: this.formatCurrency.bind(this),
        number: this.formatNumber.bind(this)
      }
    };
  }

  // Detect user's preferred language
  static detectUserLanguage(): string {
    if (typeof window === 'undefined') return 'en';

    // Check localStorage first
    const savedLanguage = localStorage.getItem('wecon_language');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]?.enabled) {
      return savedLanguage;
    }

    // Check browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES[browserLanguage]?.enabled) {
      return browserLanguage;
    }

    // Check browser languages list
    for (const lang of navigator.languages) {
      const langCode = lang.split('-')[0];
      if (SUPPORTED_LANGUAGES[langCode]?.enabled) {
        return langCode;
      }
    }

    return 'en'; // Default fallback
  }

  // Save language preference
  saveLanguagePreference(languageCode: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wecon_language', languageCode);
    }
  }
}

// Global i18n instance
export const i18n = new I18nManager(
  typeof window !== 'undefined' ? I18nManager.detectUserLanguage() : 'en'
);

// Convenience function for translations
export const t = (key: string, params?: Record<string, string | number>): string => {
  return i18n.translate(key, params);
};

// React hook for i18n
export function useI18n() {
  const [language, setLanguageState] = React.useState(i18n.getCurrentLanguage());
  const [context, setContext] = React.useState(i18n.getLocalizationContext());

  const setLanguage = async (languageCode: string) => {
    await i18n.setLanguage(languageCode);
    i18n.saveLanguagePreference(languageCode);
    setLanguageState(languageCode);
    setContext(i18n.getLocalizationContext());
  };

  const translate = (key: string, params?: Record<string, string | number>) => {
    return i18n.translate(key, params);
  };

  return {
    language,
    setLanguage,
    translate,
    context,
    config: i18n.getLanguageConfig(),
    enabledLanguages: i18n.getEnabledLanguages(),
    formatDate: i18n.formatDate.bind(i18n),
    formatTime: i18n.formatTime.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n)
  };
}

// Language switcher component props
export interface LanguageSwitcherProps {
  onLanguageChange?: (language: string) => void;
  showNativeNames?: boolean;
  className?: string;
}

// Utility functions for RTL support
export const isRTL = (languageCode: string): boolean => {
  return SUPPORTED_LANGUAGES[languageCode]?.direction === 'rtl';
};

export const getTextDirection = (languageCode: string): 'ltr' | 'rtl' => {
  return SUPPORTED_LANGUAGES[languageCode]?.direction || 'ltr';
};

// Content localization helpers
export interface LocalizedContent {
  [languageCode: string]: string;
}

export const getLocalizedContent = (content: LocalizedContent, languageCode: string, fallback: string = 'en'): string => {
  return content[languageCode] || content[fallback] || Object.values(content)[0] || '';
};

export const createLocalizedContent = (defaultContent: string, languageCode: string = 'en'): LocalizedContent => {
  return { [languageCode]: defaultContent };
};
