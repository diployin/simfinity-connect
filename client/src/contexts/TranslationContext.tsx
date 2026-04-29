import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hooks/useSettings";


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

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

type TranslationData = Record<string, Record<string, string>>;

const STORAGE_KEY = "esim_language";

export function TranslationProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();
  const siteName = settings?.platform_name || "Simfinity FR";

  const [languageCode, setLanguageCode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    }
    return ""; // Will be set once languages load
  });

  const [translations, setTranslations] = useState<TranslationData>({});

  const { data: languages = [], isLoading: languagesLoading } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!languageCode && languages.length > 0) {
      const defaultLanguage = languages.find((l) => l.isDefault)?.code || (languages.length > 0 ? languages[0].code : "en");
      setLanguageCode(defaultLanguage);
    }
  }, [languageCode, languages]);

  const currentLanguage = languages.find((l) => l.code === languageCode) || null;
  const isRTL = currentLanguage?.isRTL || false;

  const { data: translationsData, isLoading: translationsLoading } = useQuery<{
    language: Language;
    translations: TranslationData;
  }>({
    queryKey: [`/api/translations/${languageCode}`],
    enabled: !!languageCode,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (translationsData?.translations) {
      setTranslations(translationsData.translations);
    }
  }, [translationsData]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = languageCode;
    }
  }, [isRTL, languageCode]);

  const setLanguageOLD = useCallback((code: string) => {
    setLanguageCode(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);


  const setLanguage = useCallback((code: string) => {
    console.log("Language changed to:", code);
    setLanguageCode(code);
    setTranslations({}); // ✅ CLEAR OLD TRANSLATIONS
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);


  const t = useCallback(
    (
      key: string,
      fallbackOrParams?: string | Record<string, string | number>,
      params?: Record<string, string | number>
    ): string => {
      let fallback: string | undefined;
      let actualParams: Record<string, string | number> | undefined;

      if (typeof fallbackOrParams === "string") {
        fallback = fallbackOrParams;
        actualParams = params;
      } else {
        fallback = undefined;
        actualParams = fallbackOrParams;
      }

      const keyParts = key.split(".");
      const namespace = keyParts[0];
      const remainingParts = keyParts.slice(1);
      const translationKey = remainingParts.join(".");

      let value: any;

      // 1. Try exact match in the namespace (for flat keys like website -> "home.title")
      if (translations[namespace] && translationKey) {
        value = translations[namespace][translationKey];
      }

      // 2. Try deep traversal in the namespace (for nested JSON structure)
      if (value === undefined && translations[namespace]) {
        let current = translations[namespace];
        for (const part of remainingParts) {
          if (current && typeof current === "object" && part in current) {
            current = current[part];
          } else {
            current = undefined;
            break;
          }
        }
        value = current;
      }

      // 3. Search across all namespaces if not found (fallback logic)
      if (value === undefined) {
        for (const ns of Object.values(translations)) {
          // Try flat match in this namespace
          if (ns[key]) {
            value = ns[key];
            break;
          }

          // Try deep traversal in this namespace
          let current: any = ns;
          let found = true;
          for (const part of keyParts) {
            if (current && typeof current === "object" && part in current) {
              current = current[part];
            } else {
              found = false;
              break;
            }
          }
          if (found && current !== undefined) {
            value = current;
            break;
          }
        }
      }

      if (typeof value !== "string") {
        value = undefined;
      }

      const finalParams: Record<string, string | number> = {
        siteName,
        ...actualParams,
      };

      const strToReplace = value || fallback || key;

      return strToReplace.replace(/\{\{(\w+)\}\}|\{(\w+)\}/g, (match, p1, p2) => {
        const paramKey = p1 || p2;
        return finalParams[paramKey]?.toString() || match;
      });
    },
    [translations, languageCode, siteName]
  );

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

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
