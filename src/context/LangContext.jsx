import { createContext, useContext, useState, useEffect } from 'react';
import { t, getSectionHash, getSectionKeyFromHash } from '../translations';

const LangContext = createContext(null);

const STORAGE_KEY = 'trusted_lang';

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'fr' || saved === 'es' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    document.documentElement.lang = lang === 'es' ? 'es' : lang === 'fr' ? 'fr' : 'en';
    const hash = window.location.hash.slice(1);
    const sectionKey = getSectionKeyFromHash(hash);
    if (sectionKey) {
      const newHash = getSectionHash(lang, sectionKey);
      if (newHash !== hash) window.location.hash = newHash;
    }
  }, [lang]);

  const setLang = (l) => setLangState(l === 'en' || l === 'fr' || l === 'es' ? l : 'en');
  const translate = (key) => t(lang, key);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
