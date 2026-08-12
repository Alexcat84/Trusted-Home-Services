import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/useLang';
import { getSectionHash } from '../translations';
import { useQuote } from '../context/useQuote';
import { getServiceList } from '../content/services';
import { navigateTo, servicePath } from '../lib/routing';

const NAV_KEYS = ['home', 'services', 'how', 'projects', 'team', 'quote'];
/** The two audiences that sit under the "work with us" panel. */
const TEAM_KEYS = ['realtors', 'partners'];
/** Entries that scroll to a section. "team" is a panel, so it has no section of its own. */
const SECTION_KEYS = ['home', 'services', 'how', 'projects', 'realtors', 'partners', 'quote'];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { openQuote } = useQuote();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const serviceLinks = getServiceList(lang);
  const menuRefs = useRef({});
  const rafPendingRef = useRef(false);
  const rafIdRef = useRef(null);
  const sectionElsRef = useRef([]);
  const lastActiveIdRef = useRef('');
  const hash = (key) => getSectionHash(lang, key);

  // An open panel should close the way people expect: click elsewhere, or press Escape.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (e) => {
      const panel = menuRefs.current[openMenu];
      if (panel && !panel.contains(e.target)) setOpenMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    const updateHash = () => {
      const nextHash = (window.location.hash || '').slice(1).toLowerCase();
      lastActiveIdRef.current = nextHash;
      setCurrentHash(nextHash);
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    const sectionIds = SECTION_KEYS.map((key) => getSectionHash(lang, key));
    sectionElsRef.current = sectionIds.map((id) => document.getElementById(id));
    lastActiveIdRef.current = '';

    const updateActiveFromScroll = () => {
      rafPendingRef.current = false;
      rafIdRef.current = null;

      const refY = window.innerHeight * 0.5;
      let activeId = sectionIds[0];
      for (let i = 0; i < sectionIds.length; i++) {
        const el = sectionElsRef.current[i];
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= refY && bottom >= refY) {
          activeId = sectionIds[i];
          break;
        }
        if (top <= refY) activeId = sectionIds[i];
      }

      const nextActiveId = activeId.toLowerCase();
      if (nextActiveId !== lastActiveIdRef.current) {
        lastActiveIdRef.current = nextActiveId;
        setCurrentHash(nextActiveId);
      }
    };

    const onScroll = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;
      rafIdRef.current = window.requestAnimationFrame(updateActiveFromScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveFromScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current != null) window.cancelAnimationFrame(rafIdRef.current);
      rafPendingRef.current = false;
      rafIdRef.current = null;
    };
  }, [lang]);

  return (
    <header className="header" id="header">
      <div className="header-inner">
        <a
          href={`/#${hash('home')}`}
          className="logo-wrap"
          aria-label="Trusted Home Services - Home"
          onClick={(e) => {
            if (window.location.pathname !== '/') {
              e.preventDefault();
              navigateTo('/', hash('home'));
            }
          }}
        >
          <img src="/images/Logo v4.0 Inverted.jpg" alt="Trusted Home Services" className="logo-img" />
        </a>
        <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <ul className="nav-list">
            {NAV_KEYS.map((key) => {
              const sectionHash = hash(key);
              const isActive = currentHash === sectionHash.toLowerCase() || (key === 'home' && !currentHash);
              const isCta = key === 'quote';

              // Two entries open a panel: nine service pages, and the two audiences
              // who come here to work with the business rather than to hire it.
              if (key === 'services' || key === 'team') {
                const isOpen = openMenu === key;
                const items =
                  key === 'services'
                    ? serviceLinks.map((s) => ({
                        id: s.key,
                        name: s.name,
                        tagline: s.tagline,
                        onSelect: () => navigateTo(servicePath(s.key)),
                      }))
                    : TEAM_KEYS.map((k) => ({
                        id: k,
                        name: t(`nav.${k}`),
                        tagline: t(`nav.${k}Tagline`),
                        onSelect: () => navigateTo('/', hash(k)),
                      }));

                return (
                  <li
                    key={key}
                    ref={(el) => { menuRefs.current[key] = el; }}
                    className={`nav-item-has-menu ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className={`nav-link nav-link--toggle ${isActive ? 'nav-link--active' : ''}`}
                      aria-expanded={isOpen}
                      aria-controls={`${key}-menu`}
                      onClick={() => setOpenMenu((current) => (current === key ? null : key))}
                    >
                      {t(`nav.${key}`)}
                      <span className="nav-caret" aria-hidden="true" />
                    </button>
                    <div
                      className={`services-menu ${key === 'team' ? 'services-menu--narrow' : ''}`}
                      id={`${key}-menu`}
                      hidden={!isOpen}
                    >
                      <ul className="services-menu-list">
                        {items.map((entry) => (
                          <li key={entry.id}>
                            <a
                              href="#"
                              className="services-menu-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenMenu(null);
                                setMenuOpen(false);
                                entry.onSelect();
                              }}
                            >
                              <span className="services-menu-name">{entry.name}</span>
                              <span className="services-menu-tagline">{entry.tagline}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              // The quote entry raises the dialog rather than scrolling anywhere.
              if (isCta) {
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className="nav-link nav-cta"
                      onClick={() => {
                        setMenuOpen(false);
                        openQuote();
                      }}
                    >
                      {t(`nav.${key}`)}
                    </button>
                  </li>
                );
              }

              return (
                <li key={key}>
                  <a
                    href={`#${sectionHash}`}
                    className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                    onClick={(e) => {
                      setMenuOpen(false);
                      // From a service page the hash alone would not leave the page, so route home first.
                      if (window.location.pathname !== '/') {
                        e.preventDefault();
                        navigateTo('/', sectionHash);
                      }
                    }}
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
