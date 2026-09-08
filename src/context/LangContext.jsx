import { useState, useEffect } from 'react';
import { t, getSectionHash, getSectionKeyFromHash } from '../translations';
import { LangContext } from './langContextInstance';
import { normalizeLocale } from '../lib/locales';

const STORAGE_KEY = 'trusted_lang';

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      // normalizeLocale also covers a visitor whose saved choice is now switched off.
      return normalizeLocale(localStorage.getItem(STORAGE_KEY));
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch { /* storage unavailable (e.g. private mode); ignore */ }
    document.documentElement.lang = lang;
    // The address follows the language, but the reader does not move. Assigning
    // window.location.hash would scroll to the anchor, which turned a language
    // switch into a jump to whichever section the URL happened to name.
    const hash = window.location.hash.slice(1);
    const sectionKey = getSectionKeyFromHash(hash);
    if (sectionKey) {
      const newHash = getSectionHash(lang, sectionKey);
      if (newHash !== hash) {
        window.history.replaceState(null, '', `${window.location.pathname}#${newHash}`);
      }
    }
  }, [lang]);

  const setLang = (l) => setLangState(normalizeLocale(l));

  const translate = (key) => t(lang, key);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LangContext.Provider>
  );
}
