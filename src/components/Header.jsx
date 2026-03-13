import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { getSectionHash } from '../translations';

const NAV_KEYS = ['home', 'services', 'how', 'projects', 'realtors', 'partners', 'quote'];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const hash = (key) => getSectionHash(lang, key);

  useEffect(() => {
    const updateHash = () => setCurrentHash((window.location.hash || '').slice(1).toLowerCase());
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_KEYS.map((key) => getSectionHash(lang, key));
    const updateActiveFromScroll = () => {
      const refY = window.innerHeight * 0.5;
      let activeId = sectionIds[0];
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= refY && bottom >= refY) {
          activeId = sectionIds[i];
          break;
        }
        if (top <= refY) activeId = sectionIds[i];
      }
      setCurrentHash(activeId.toLowerCase());
    };
    const onScroll = () => window.requestAnimationFrame(updateActiveFromScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveFromScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [lang]);

  return (
    <header className="header" id="header">
      <div className="header-inner">
        <a href={`#${hash('home')}`} className="logo-wrap" aria-label="Trusted Home Services - Home">
          <img src="/images/Logo v4.0 Inverted.jpg" alt="Trusted Home Services" className="logo-img" />
        </a>
        <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <ul className="nav-list">
            {NAV_KEYS.map((key) => {
              const sectionHash = hash(key);
              const isActive = currentHash === sectionHash.toLowerCase() || (key === 'home' && !currentHash);
              const isCta = key === 'quote';
              return (
                <li key={key}>
                  <a
                    href={`#${sectionHash}`}
                    className={`nav-link ${isCta ? 'nav-cta' : ''} ${isActive ? 'nav-link--active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="lang-switcher" role="group" aria-label="Language">
          {['en', 'fr', 'es'].map((l) => (
            <button
              key={l}
              type="button"
              className={`lang-btn ${lang === l ? 'active' : ''}`}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
