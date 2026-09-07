import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/useLang';
import { getSectionHash } from '../translations';
import { getServiceList } from '../content/services';
import { navigateTo, servicePath } from '../lib/routing';
import ServiceIcon from './ServiceIcon';
import { ACTIVE_LOCALES } from '../lib/locales';

/* Seven entries in the reference's positions. Two of its slots carry brand
   terms of its own, so those hold the plain equivalents here. */
const NAV_KEYS = ['home', 'about', 'services', 'renovations', 'promise', 'locations', 'team'];
/** The entries that open a panel rather than going somewhere. */
const MENU_KEYS = ['about', 'services', 'team'];
/** What sits under About us. */
const ABOUT_KEYS = ['how', 'projects', 'faq'];
/** The two audiences that sit under work with us. */
const TEAM_KEYS = ['realtors', 'partners'];
/** Entries that scroll to a section rather than opening a page. */
const SECTION_KEYS = ['home', 'services', 'how', 'projects', 'realtors', 'partners', 'quote'];
/** Entries with a page of their own, reached by hash. */
const PAGE_KEYS = ['renovations', 'promise', 'locations', 'faq'];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  // Hover opens the panels, but only where hovering means something. On a touch
  // screen there is no pointer to leave with, so those visitors keep the tap.
  const [canHover, setCanHover] = useState(false);
  const serviceLinks = getServiceList(lang);
  const headerRef = useRef(null);
  const rafPendingRef = useRef(false);
  const rafIdRef = useRef(null);
  const sectionElsRef = useRef([]);
  const lastActiveIdRef = useRef('');
  const hash = (key) => getSectionHash(lang, key);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setCanHover(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  /** Opens on hover, and on tap for anyone without a pointer. */
  const openOnHover = (key) => (canHover ? () => setOpenMenu(key) : undefined);
  const toggleMenu = (key) =>
    setOpenMenu((current) => (canHover ? key : current === key ? null : key));

  // An open panel should close the way people expect: click elsewhere, or press Escape.
  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (e) => {
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

  /** Sends a panel entry to wherever it belongs. */
  const goTo = (key) => (e) => {
    e.preventDefault();
    setOpenMenu(null);
    setMenuOpen(false);
    if (PAGE_KEYS.includes(key)) {
      window.location.hash = key;
      window.scrollTo(0, 0);
      return;
    }
    navigateTo('/', hash(key));
  };

  /** One panel, laid out the same whichever entry opened it. */
  const panel = (id, keys) => (
    <div className="nav-panel" id={id} hidden={openMenu !== id}>
      <div className="container container--wide">
        <ul className="nav-panel-grid">
          {keys.map((k) => (
            <li key={k}>
              <a href={`/#${k}`} className="nav-panel-item" onClick={goTo(k)}>
                <span className="nav-panel-icon" aria-hidden="true">
                  <ServiceIcon name={k} />
                </span>
                <span>
                  <span className="nav-panel-name">{t(`nav.${k}`)}</span>
                  <span className="nav-panel-desc">{t(`nav.${k}Tagline`)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <header
      className="header"
      id="header"
      ref={headerRef}
      onMouseLeave={canHover ? () => setOpenMenu(null) : undefined}
    >
      {/* The mark sits alone across the top, centred, with the row of links
          beneath it. That is the reference arrangement. */}
      <div className="header-brand">
        <a
          href={`/#${hash('home')}`}
          className="header-logo"
          aria-label="Trusted Home Services - Home"
          onClick={(e) => {
            if (window.location.pathname !== '/') {
              e.preventDefault();
              navigateTo('/', hash('home'));
            }
          }}
        >
          <img src="/images/Logo v4.0.jpg" alt="Trusted Home Services" />
        </a>
        <div className="header-utility">
          <div className="lang-switcher">
            <div className="lang-group" role="group" aria-label="Language">
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
      </div>

      <nav className={`header-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <ul className="header-nav-list">
          {NAV_KEYS.map((key) => {
            const sectionHash = hash(key);
            const isActive = currentHash === sectionHash.toLowerCase() || (key === 'home' && !currentHash);

            if (MENU_KEYS.includes(key)) {
              const isOpen = openMenu === key;
              return (
                <li
                  key={key}
                  className={`nav-item-has-menu ${isOpen ? 'is-open' : ''}`}
                  onMouseEnter={openOnHover(key)}
                >
                  <button
                    type="button"
                    className={`header-nav-link header-nav-link--toggle ${isActive ? 'is-active' : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={key}
                    onClick={() => toggleMenu(key)}
                  >
                    {t(`nav.${key}`)}
                    <span className="nav-caret" aria-hidden="true" />
                  </button>
                </li>
              );
            }

            if (PAGE_KEYS.includes(key)) {
              return (
                <li key={key} onMouseEnter={canHover ? () => setOpenMenu(null) : undefined}>
                  <a href={`/#${key}`} className="header-nav-link" onClick={goTo(key)}>
                    {t(`nav.${key}`)}
                  </a>
                </li>
              );
            }

            return (
              <li key={key} onMouseEnter={canHover ? () => setOpenMenu(null) : undefined}>
                <a
                  href={`#${sectionHash}`}
                  className={`header-nav-link ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    setMenuOpen(false);
                    setOpenMenu(null);
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

      {panel('about', ABOUT_KEYS)}
      {panel('team', TEAM_KEYS)}

      {/* Services keeps its own panel, since nine entries with a line each need
          the full width. */}
      <div className="nav-panel" id="services" hidden={openMenu !== 'services'}>
        <div className="container container--wide">
          <ul className="nav-panel-grid">
            {serviceLinks.map((s) => (
              <li key={s.key}>
                <a
                  href={servicePath(s.key)}
                  className="nav-panel-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(null);
                    setMenuOpen(false);
                    navigateTo(servicePath(s.key));
                  }}
                >
                  <span className="nav-panel-icon" aria-hidden="true">
                    <ServiceIcon name={s.key} />
                  </span>
                  <span>
                    <span className="nav-panel-name">{s.name}</span>
                    <span className="nav-panel-desc">{s.tagline}</span>
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
