'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/messages/en.json';
import bn from '@/messages/bn.json';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatNumber: (num: string | number) => string;
  tApi: (value: string) => string;
}

const translations: Record<Language, any> = { en, bn };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect saved language or browser language
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'bn') {
        setLanguageState('bn');
      }
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation is missing in current language
        let fallbackValue = translations['en'];
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk];
          } else {
            fallbackValue = null;
            break;
          }
        }
        if (typeof fallbackValue === 'string') {
          value = fallbackValue;
          break;
        }
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (replacements) {
      let result = value;
      Object.entries(replacements).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
      return result;
    }

    return value;
  };

  const formatNumber = (num: string | number): string => {
    const str = String(num);
    if (language !== 'bn') return str;

    const digits: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return str.replace(/[0-9]/g, (w) => digits[w] || w);
  };

  const tApi = (value: string): string => {
    if (!value) return '';
    
    // Normalize string to match JSON keys
    const cleanKey = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/__+/g, '_'); // avoid duplicate underscores
    
    const path = `api.${cleanKey}`;
    const translated = t(path);
    
    // If not found in API dictionary, return original
    if (translated === path) {
      // Fallback for special keys
      if (cleanKey.includes('unhealthy_sensitive')) return t('api.unhealthy_sensitive');
      return value;
    }
    
    return translated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber, tApi }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
