import { createContext, useContext, useState, ReactNode } from "react";
import { translations } from "./translations";

type Language = "en" | "zh-CN";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  initialLanguage = "zh-CN",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const t = (key: string): string => {
    return (
      translations[language]?.[
        key as keyof (typeof translations)[typeof language]
      ] ||
      translations["zh-CN"]?.[
        key as keyof (typeof translations)["zh-CN"]
      ] ||
      key
    );
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage } = useI18n();
  return { t, language, setLanguage };
}
