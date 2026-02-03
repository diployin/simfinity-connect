'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';

/* ===================== TYPES ===================== */

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flagCode: string;
  isRTL: boolean;
  isEnabled: boolean;
  isDefault: boolean;
  sortOrder: number;
}

/* ✅ FIX: allow arrays + nested objects */
type TranslationData = Record<string, any>;

interface TranslationContextType {
  language: Language | null;
  languages: Language[];
  languageCode: string;
  isRTL: boolean;
  isLoading: boolean;
  setLanguage: (code: string) => void;
  t: (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ) => string;
}

/* ===================== CONTEXT ===================== */

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'esim_language';

/* ===================== PROVIDER ===================== */

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [languageCode, setLanguageCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    }
    return 'en';
  });

  /* -------- Languages -------- */
  const { data: languages = [], isLoading: languagesLoading } =
    useQuery<Language[]>({
      queryKey: ['/api/languages'],
      staleTime: 5 * 60 * 1000,
    });

  const currentLanguage =
    languages.find((l) => l.code === languageCode) || null;

  const isRTL = currentLanguage?.isRTL ?? false;

  /* -------- Translations -------- */
  const {
    data: translationsData,
    isLoading: translationsLoading,
  } = useQuery<{
    language: Language;
    translations: TranslationData;
  }>({
    queryKey: [`/api/translations/${languageCode}`],
    enabled: !!languageCode,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
  });

  /* -------- HTML lang + dir -------- */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = languageCode;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, [languageCode, isRTL]);

  /* -------- Change language -------- */
  const setLanguage = useCallback((code: string) => {
    setLanguageCode(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);

  /* -------- Translate function (ARRAY + OBJECT SUPPORT) -------- */
  const t = useCallback(
    (
      key: string,
      fallbackOrParams?: string | Record<string, string | number>,
      params?: Record<string, string | number>
    ): string => {
      const translations = translationsData?.translations || {};

      let fallback: string | undefined;
      let actualParams: Record<string, string | number> | undefined;

      if (typeof fallbackOrParams === 'string') {
        fallback = fallbackOrParams;
        actualParams = params;
      } else {
        actualParams = fallbackOrParams;
      }

      const path = key.split('.');
      let value: any = translations;

      for (const part of path) {
        if (value == null) break;

        if (Array.isArray(value)) {
          const index = Number(part);
          value = Number.isNaN(index) ? undefined : value[index];
        } else {
          value = value[part];
        }
      }

      if (typeof value !== 'string') {
        const result = fallback || key;
        if (actualParams) {
          return result.replace(/\{(\w+)\}/g, (_, k) =>
            actualParams?.[k]?.toString() ?? `{${k}}`
          );
        }
        return result;
      }

      if (actualParams) {
        return value.replace(/\{(\w+)\}/g, (_, k) =>
          actualParams?.[k]?.toString() ?? `{${k}}`
        );
      }

      return value;
    },
    [translationsData]
  );


  console.log("translationsData@@@@@@@@@@@@@@@@", translationsData)

  const isLoading = languagesLoading || translationsLoading;

  return (
    <TranslationContext.Provider
      value={{
        language: currentLanguage,
        languages,
        languageCode,
        isRTL,
        isLoading,
        setLanguage,
        t,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

/* ===================== HOOK ===================== */

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
