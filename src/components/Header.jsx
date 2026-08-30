import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/useLang';
import { getSectionHash } from '../translations';
import { getServiceList } from '../content/services';
import { navigateTo, servicePath } from '../lib/routing';
import ServiceIcon from './ServiceIcon';
import { ACTIVE_LOCALES } from '../lib/locales';

const NAV_KEYS = ['home', 'services', 'how', 'projects', 'team'];
/** The two audiences that sit under the "work with us" panel. */
const TEAM_KEYS = ['realtors', 'partners'];
/** Entries that scroll to a section. "team" is a panel, so it has no section of its own. */
const SECTION_KEYS = ['home', 'services', 'how', 'projects', 'realtors', 'partners', 'quote'];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const serviceLinks = getServiceList(lang);
  const headerRef = useRef(null);
  const rafPendingRef = useRef(false);
  const rafIdRef = useRef(null);
  const sectionElsRef = useRef([]);
  const lastActiveIdRef = useRef('');
  const hash = (key) => getSectionHash(lang, key);

  // An open panel should close the way people expect: click elsewhere, or press Escape.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (e) => {
      // The toggle sits in the bar and the services panel is its sibling, so the
      // test has to cover the whole header. Checking only the panel would treat a
      // click on its own toggle as outside, closing and reopening it in one go.
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpenMenu(null);
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
    <header className="header" id="header" ref={headerRef}>
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

              // Services opens a full width panel below the bar, because nine entries
              // with a line of description each do not fit a small dropdown.
              if (key === 'services') {
                const isOpen = openMenu === key;
                return (
                  <li key={key} className={`nav-item-has-menu ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className={`nav-link nav-link--toggle ${isActive ? 'nav-link--active' : ''}`}
                      aria-expanded={isOpen}
                      aria-controls="services-panel"
                      onClick={() => setOpenMenu((current) => (current === key ? null : key))}
                    >
                      {t('nav.services')}
                      <span className="nav-caret" aria-hidden="true" />
                    </button>
                  </li>
                );
              }

              // Work with us keeps the compact dropdown: two entries would look lost
              // spread across a full width bar.
              if (key === 'team') {
                const isOpen = openMenu === key;
                return (
                  <li
                    key={key}
                    className={`nav-item-has-menu ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className={`nav-link nav-link--toggle ${isActive ? 'nav-link--active' : ''}`}
                      aria-expanded={isOpen}
                      aria-controls="team-menu"
                      onClick={() => setOpenMenu((current) => (current === key ? null : key))}
                    >
                      {t('nav.team')}
                      <span className="nav-caret" aria-hidden="true" />
                    </button>
                    <div className="services-menu services-menu--narrow" id="team-menu" hidden={!isOpen}>
                      <ul className="services-menu-list">
                        {TEAM_KEYS.map((k) => (
                          <li key={k}>
                            <a
                              href={`/#${hash(k)}`}
                              className="services-menu-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenMenu(null);
                                setMenuOpen(false);
                                navigateTo('/', hash(k));
                              }}
                            >
                              <span className="services-menu-name">{t(`nav.${k}`)}</span>
                              <span className="services-menu-tagline">{t(`nav.${k}Tagline`)}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                      setOpenMenu(null);
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
          {ACTIVE_LOCALES.map((l) => (
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
      {/* Full width panel, a sibling of the bar rather than a child of the nav item,
          so it can span the whole header instead of hanging off one entry. */}
      <div
        className="services-panel"
        id="services-panel"
        hidden={openMenu !== 'services'}
      >
        <div className="container container--wide">
          <ul className="services-panel-grid">
            {serviceLinks.map((s) => (
              <li key={s.key}>
                <a
                  href={servicePath(s.key)}
                  className="services-panel-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(null);
                    setMenuOpen(false);
                    navigateTo(servicePath(s.key));
                  }}
                >
                  <span className="services-panel-icon" aria-hidden="true">
                    <ServiceIcon name={s.key} />
                  </span>
                  <span>
                    <span className="services-panel-name">{s.name}</span>
                    <span className="services-panel-desc">{s.tagline}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
