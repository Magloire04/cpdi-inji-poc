"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Load language from storage if exists
  useEffect(() => {
    const storedLang = localStorage.getItem('cdpi_lang');
    if (storedLang && (storedLang === 'en' || storedLang === 'fr')) {
      setLang(storedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('cdpi_lang', newLang);
  };

  const t = (module, key) => {
    if (!translations[lang] || !translations[lang][module]) return key;
    return translations[lang][module][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
