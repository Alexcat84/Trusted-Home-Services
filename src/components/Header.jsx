import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/useLang';
import { getSectionHash } from '../translations';
import { getServiceList } from '../content/services';
import { navigateTo, servicePath, goToHash } from '../lib/routing';
import { ACTIVE_LOCALES } from '../lib/locales';

/* Seven entries in the reference's positions. Two of its slots carry brand
   terms of its own, so those hold the plain equivalents here. */
const NAV_KEYS = ['home', 'about', 'services', 'promise', 'locations', 'team', 'franchises'];
/** The entries that open a panel rather than going somewhere. */
const MENU_KEYS = ['about', 'services', 'team'];
/** What sits under About us. */
const ABOUT_KEYS = ['who', 'how', 'projects', 'faq'];
/** The two audiences that sit under work with us. */
const TEAM_KEYS = ['realtors', 'partners'];
/** Entries that scroll to a section rather than opening a page. */
const SECTION_KEYS = ['home', 'services', 'how', 'projects', 'realtors', 'partners', 'quote'];
/** Entries with a page of their own, reached by hash. */
/* Franchises is kept apart from the partner page on purpose: the two answer
   different searches and each needs its own page to rank for them. */
const PAGE_KEYS = ['who', 'promise', 'locations', 'faq', 'franchises'];
/** Where an entry goes when its label and its page do not share a name. */
const PAGE_HASH = { who: 'about' };

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
      goToHash(PAGE_HASH[key] || key);
      window.scrollTo(0, 0);
      return;
    }
    const id = hash(key);
    // From another page, change page first. On the home page, assign the hash,
    // which is what actually scrolls: pushState does not, and neither does it
    // fire hashchange.
    goToHash(id);
    // After a page change the section is not mounted yet, and when the hash was
    // already correct nothing fires at all, so land it either way.
    window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  /** A narrow list under the entry that opened it, which is the shape the
      reference uses: plain uppercase links, no icons and no descriptions. */
  const panel = (id, entries) => (
    <div className="nav-drop" id={id} hidden={openMenu !== id}>
      <ul className="nav-drop-list">
        {entries.map((e) => (
          <li key={e.key}>
            <a href={e.href} className="nav-drop-link" onClick={e.onClick}>
              {e.label}
            </a>
          </li>
        ))}
      </ul>
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
                  {key === 'services'
                    ? panel('services', serviceLinks.map((sv) => ({
                        key: sv.key,
                        label: sv.name,
                        href: servicePath(sv.key),
                        onClick: (ev) => {
                          ev.preventDefault();
                          setOpenMenu(null);
                          setMenuOpen(false);
                          navigateTo(servicePath(sv.key));
                        },
                      })))
                    : panel(key, (key === 'about' ? ABOUT_KEYS : TEAM_KEYS).map((k) => ({
                        key: k,
                        label: t(`nav.${k}`),
                        href: `/#${k}`,
                        onClick: goTo(k),
                      })))}
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

    </header>
  );
}
