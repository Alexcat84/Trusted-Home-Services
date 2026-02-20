import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { useLang } from './context/LangContext';
import { getSectionHash } from './translations';

/** Envía el payload a nuestra API (Vercel). Devuelve true si ok. */
async function submitToOwnApi(payload) {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Envía el payload a Formspree si existe VITE_FORMSPREE_* para ese tipo. Devuelve true si se envió y ok. */
async function submitToFormspree(formId, payload) {
  if (!formId || typeof formId !== 'string') return false;
  try {
    const res = await fetch(`https://formspree.io/f/${formId.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Título de sección animado con Anime.js: letras que aparecen al entrar en vista (se repite cada vez que pasas por la sección) */
function AnimatedSectionTitle({ text }) {
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef, { once: false, margin: '-20px' });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const letters = wrapperRef.current.querySelectorAll('.section-title-letter');
    if (!letters.length) return;

    if (inView) {
      animate(letters, {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 900,
        delay: stagger(62, { from: 'first' }),
        ease: 'outExpo',
      });
    } else {
      letters.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
      });
    }
  }, [inView, text]);

  if (!text) return null;
  return (
    <span ref={wrapperRef} className="section-title-animated">
      {text.split('').map((char, i) => (
        <span key={i} className="section-title-letter">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/** Efecto de texto escribiéndose; arranca cuando el bloque entra en vista */
function Typewriter({ text, speed = 42, showCursor = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
  }, [text]);

  useEffect(() => {
    if (!inView || !text) return;
    if (length >= text.length) return;
    const t = setTimeout(() => setLength((n) => Math.min(n + 1, text.length)), speed);
    return () => clearTimeout(t);
  }, [inView, text, length, speed]);

  if (!text) return null;
  return (
    <span ref={ref}>
      {text.slice(0, length)}
      {showCursor && length < text.length && <span className="typewriter-cursor" aria-hidden="true">|</span>}
    </span>
  );
}

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function Section({ id, className, children }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

function AnimatedSection({ id, className, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}

const NAV_KEYS = ['home', 'services', 'how', 'projects', 'realtors', 'partners', 'quote'];

/** Hashes that show dedicated subpages (any language) */
const REALTORS_PAGE_HASHES = ['for-realtors', 'pour-realtors', 'para-realtors'];
const PARTNERS_PAGE_HASHES = ['partners', 'partenaires', 'socios'];
const PROJECTS_PAGE_HASHES = ['our-projects', 'nos-projets', 'nuestros-proyectos'];

function Header() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const hash = (key) => getSectionHash(lang, key);

  // Sincronizar con el hash de la URL (clic en enlace)
  useEffect(() => {
    const updateHash = () => setCurrentHash((window.location.hash || '').slice(1).toLowerCase());
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  // Scroll spy: la sección activa es la que contiene el punto de referencia (50% del viewport)
  useEffect(() => {
    const sectionIds = NAV_KEYS.map((key) => getSectionHash(lang, key));
    const updateActiveFromScroll = () => {
      const refY = window.innerHeight * 0.5; // línea al 50% de la pantalla
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
          <img src="/images/logo v1.0.jpg" alt="Trusted Home Services" className="logo-img" />
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

const HERO_BG_INTERVAL_MS = 4000;

function Hero({ skipAnimation = false }) {
  const { t, lang } = useLang();
  const [bgActive, setBgActive] = useState('first');
  const [heroRealtorModalOpen, setHeroRealtorModalOpen] = useState(false);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { margin: '-1px' });
  const outOfView = !heroInView;

  useEffect(() => {
    const id = setInterval(() => {
      setBgActive((prev) => (prev === 'first' ? 'casa' : prev === 'casa' ? 'luxury' : prev === 'luxury' ? 'tools' : 'first'));
    }, HERO_BG_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const quoteHash = getSectionHash(lang, 'quote');
  return (
    <>
    <section ref={heroRef} id={getSectionHash(lang, 'home')} className={`hero ${outOfView ? 'hero--no-bg' : ''}`}>
      <div className={`hero-bg hero-bg-first ${bgActive !== 'first' ? 'hero-bg--hidden' : ''} ${outOfView ? 'hero-bg--out-of-view' : ''}`} aria-hidden="true" />
      <div className={`hero-bg hero-bg-casa ${bgActive !== 'casa' ? 'hero-bg--hidden' : ''} ${outOfView ? 'hero-bg--out-of-view' : ''}`} aria-hidden="true" />
      <div className={`hero-bg hero-bg-luxury ${bgActive !== 'luxury' ? 'hero-bg--hidden' : ''} ${outOfView ? 'hero-bg--out-of-view' : ''}`} aria-hidden="true" />
      <div className={`hero-bg hero-bg-tools ${bgActive !== 'tools' ? 'hero-bg--hidden' : ''} ${outOfView ? 'hero-bg--out-of-view' : ''}`} aria-hidden="true" />
      <div className={`hero-bg-overlay ${outOfView ? 'hero-bg-overlay--out-of-view' : ''}`} aria-hidden="true" />
      <motion.div
        className={`container hero-content ${skipAnimation ? 'hero-content--no-animate' : ''}`}
        variants={container}
        initial={skipAnimation ? 'visible' : 'hidden'}
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={item}>{t('hero.title')}</motion.h1>
        <motion.p className="hero-subtitle" variants={item}>{t('hero.subtitle')}</motion.p>
        <motion.div className="hero-actions" variants={item}>
          <a href={`#${quoteHash}`} className="btn btn-primary">{t('hero.cta1')}</a>
          <button type="button" className="btn btn-primary" onClick={() => setHeroRealtorModalOpen(true)}>{t('realtorPage.ctaPrimary')}</button>
          <span className="btn btn-primary" aria-hidden="true">{t('hero.cta2')}</span>
        </motion.div>
        <div className="hero-stats-wrap" aria-label="Key facts">
          <div className="home-stats-grid hero-stats-grid">
            <div className="realtor-proof-stat-box">
              <span className="realtor-proof-stat-emoji" aria-hidden="true">🏠</span>
              <span className="realtor-proof-stat-value">{t('realtorPage.proofStats1Value')}</span>
              <span className="realtor-proof-stat-label">{t('realtorPage.proofStats1Label')}</span>
            </div>
            <div className="realtor-proof-stat-box">
              <span className="realtor-proof-stat-emoji" aria-hidden="true">🏆</span>
              <span className="realtor-proof-stat-value">{t('realtorPage.proofStats4Value')}</span>
              <span className="realtor-proof-stat-label">{t('realtorPage.proofStats4Label')}</span>
            </div>
            <div className="realtor-proof-stat-box">
              <span className="realtor-proof-stat-emoji" aria-hidden="true">📍</span>
              <span className="realtor-proof-stat-value">{t('realtorPage.proofStats3Value')}</span>
              <span className="realtor-proof-stat-label">{t('realtorPage.proofStats3Label')}</span>
            </div>
            <div className="realtor-proof-stat-box">
              <span className="realtor-proof-stat-emoji" aria-hidden="true">⚡</span>
              <span className="realtor-proof-stat-value">{t('realtorPage.proofStats2Value')}</span>
              <span className="realtor-proof-stat-label">{t('realtorPage.proofStats2Label')}</span>
            </div>
            <a href={`#${quoteHash}`} className="realtor-proof-stat-box home-stats-quote-card">
              <span className="realtor-proof-stat-emoji" aria-hidden="true">📋</span>
              <span className="realtor-proof-stat-value">{t('homeStats.freeQuoteCard')}</span>
              <span className="realtor-proof-stat-label" aria-hidden="true">&nbsp;</span>
            </a>
          </div>
          <div className="home-stats-seal hero-stats-seal">
            <div className="home-stats-seal-img" aria-hidden="true">
              <img src="/images/quality%20guarantee%20luxury.png" alt="" />
            </div>
            <div className="home-stats-seal-text">
              <p className="home-stats-seal-title">{t('homeStats.qualityTitle')}</p>
              <p className="home-stats-seal-desc">{t('homeStats.qualityDesc')}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
    <RealtorFormModal open={heroRealtorModalOpen} onClose={() => setHeroRealtorModalOpen(false)} />
    </>
  );
}

function HomeStatsBlock() {
  const { t, lang } = useLang();
  const quoteHash = getSectionHash(lang, 'quote');
  return (
    <section className="home-stats" aria-label="Key facts">
      <div className="container">
        <div className="home-stats-grid">
          <div className="realtor-proof-stat-box">
            <span className="realtor-proof-stat-emoji" aria-hidden="true">🏠</span>
            <span className="realtor-proof-stat-value">{t('realtorPage.proofStats1Value')}</span>
            <span className="realtor-proof-stat-label">{t('realtorPage.proofStats1Label')}</span>
          </div>
          <div className="realtor-proof-stat-box">
            <span className="realtor-proof-stat-emoji" aria-hidden="true">🏆</span>
            <span className="realtor-proof-stat-value">{t('realtorPage.proofStats4Value')}</span>
            <span className="realtor-proof-stat-label">{t('realtorPage.proofStats4Label')}</span>
          </div>
          <div className="realtor-proof-stat-box">
            <span className="realtor-proof-stat-emoji" aria-hidden="true">📍</span>
            <span className="realtor-proof-stat-value">{t('realtorPage.proofStats3Value')}</span>
            <span className="realtor-proof-stat-label">{t('realtorPage.proofStats3Label')}</span>
          </div>
          <div className="realtor-proof-stat-box">
            <span className="realtor-proof-stat-emoji" aria-hidden="true">⚡</span>
            <span className="realtor-proof-stat-value">{t('realtorPage.proofStats2Value')}</span>
            <span className="realtor-proof-stat-label">{t('realtorPage.proofStats2Label')}</span>
          </div>
          <a href={`#${quoteHash}`} className="realtor-proof-stat-box home-stats-quote-card">
            <span className="realtor-proof-stat-emoji" aria-hidden="true">📋</span>
            <span className="realtor-proof-stat-value">{t('homeStats.freeQuoteCard')}</span>
            <span className="realtor-proof-stat-label" aria-hidden="true">&nbsp;</span>
          </a>
        </div>
        <div className="home-stats-seal">
          <div className="home-stats-seal-img" aria-hidden="true">
            <img src="/images/quality%20guarantee%20luxury.png" alt="" />
          </div>
          <div className="home-stats-seal-text">
            <p className="home-stats-seal-title">{t('homeStats.qualityTitle')}</p>
            <p className="home-stats-seal-desc">{t('homeStats.qualityDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t, lang } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const values = ['trust', 'family', 'quality', 'respect'];

  return (
    <AnimatedSection id={getSectionHash(lang, 'about')} className="section section-mvv">
      <div className="container">
        <h2 className="section-title"><AnimatedSectionTitle text={t('about.title')} /></h2>
        <p className="section-intro">{t('about.intro')}</p>
        <motion.div
          ref={ref}
          className="mvv-grid"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={container}
        >
          <motion.article
            className="mvv-card mvv-card--mission"
            variants={item}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
          >
            <div className="mvv-icon">M</div>
            <h3>{t('about.mission.title')}</h3>
            <p>{t('about.mission.text')}</p>
          </motion.article>
          <motion.article
            className="mvv-card mvv-card--vision"
            variants={item}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
          >
            <div className="mvv-icon">V</div>
            <h3>{t('about.vision.title')}</h3>
            <p>{t('about.vision.text')}</p>
          </motion.article>
          <motion.article
            className="mvv-card mvv-card--values"
            variants={item}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
          >
            <div className="mvv-icon">V</div>
            <h3>{t('about.values.title')}</h3>
            <ul className="mvv-values-list">
              {values.map((key) => {
                const text = t(`about.values.${key}`);
                const colon = text.indexOf(':');
                const label = colon >= 0 ? text.slice(0, colon) : text;
                const desc = colon >= 0 ? text.slice(colon + 1).trim() : '';
                return (
                  <motion.li
                    key={key}
                    className="mvv-value-item"
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <span className="mvv-value-dot" />
                    <span>{desc ? <><strong>{label}</strong>: {desc}</> : <strong>{label}</strong>}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.article>
        </motion.div>
        <motion.div className="about-extra-row" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
          <div className="about-extra-seal-large" aria-hidden="true">
            <img src="/images/quality%20guarantee%20luxury.png" alt="" />
          </div>
          <div className="about-extra">
            <p className="about-extra-title">{t('about.qualityGuaranteed')}</p>
            <p className="about-extra-desc">{t('about.extra')}</p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Services() {
  const { t, lang } = useLang();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [flippedKey, setFlippedKey] = useState(null);

  const services = [
    { key: 'declutter', img: '/images/decluttering-removal.jpg' },
    { key: 'repair', img: '/images/Plaster.png' },
    { key: 'handyman', img: '/images/handyman.jpg' },
    { key: 'paint', img: '/images/roller painting.jpeg' },
    { key: 'flooring', img: '/images/flooring.jpg' },
    { key: 'curb', img: '/images/curb-appeal.avif' },
    { key: 'staging', img: '/images/staging-organizing.jpg' },
    { key: 'clean', img: '/images/cleaning services 1.png' },
  ];

  return (
    <AnimatedSection id={getSectionHash(lang, 'services')} className="section section-services">
      <div className="container container--wide">
        <h2 className="section-title"><AnimatedSectionTitle text={t('services.title')} /></h2>
        <p className="section-intro">{t('services.intro')}</p>
        <motion.div
          ref={ref}
          className="services-grid services-grid--multi"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={container}
        >
          {services.map((s, i) => (
            <motion.article
              key={s.key}
              className={`service-card-flip ${flippedKey === s.key ? 'flipped' : ''}`}
              variants={item}
              onClick={() => setFlippedKey(flippedKey === s.key ? null : s.key)}
            >
              <div className="service-card-inner">
                <div className="service-card-front">
                  <div className="service-img-wrap">
                    <img src={s.img} alt="" className="service-img" />
                    <span className="service-card-front-hint" aria-hidden="true">{t('services.learnMore')}</span>
                  </div>
                  <div className="service-card-front-text">
                    <h3>{t(`services.${s.key}.title`)}</h3>
                    <p>{t(`services.${s.key}.short`)}</p>
                  </div>
                </div>
                <div className="service-card-back">
                  <h3>{t(`services.${s.key}.title`)}</h3>
                  <div className="service-card-back-body">{t(`services.${s.key}.text`)}</div>
                  <a href={`#${getSectionHash(lang, 'quote')}`} className="btn btn-primary service-card-back-cta" onClick={(e) => e.stopPropagation()}>{t('nav.quote')}</a>
                  <button type="button" className="service-card-back-close" onClick={(e) => { e.stopPropagation(); setFlippedKey(null); }} aria-label={t('quote.back')}>←</button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function ServiceModal({ serviceKey, onClose }) {
  const { t, lang } = useLang();
  if (!serviceKey) return null;
  return (
    <motion.div
      className="service-modal"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="service-modal-backdrop" />
      <motion.div
        className="service-modal-content"
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="service-modal-close" onClick={onClose} aria-label={t('realtors.form.close')}>&times;</button>
        <h2 className="service-modal-title">{t(`services.${serviceKey}.title`)}</h2>
        <div className="service-modal-body">{t(`services.${serviceKey}.text`)}</div>
        <a href={`#${getSectionHash(lang, 'quote')}`} className="btn btn-primary service-modal-cta" onClick={onClose}>{t('nav.quote')}</a>
      </motion.div>
    </motion.div>
  );
}

function HowWeWork() {
  const { t, lang } = useLang();
  const steps = [
    { title: 'steps.step1.title', text: 'steps.step1.text' },
    { title: 'steps.step2.title', text: 'steps.step2.text' },
    { title: 'steps.step3.title', text: 'steps.step3.text' },
  ];

  return (
    <AnimatedSection id={getSectionHash(lang, 'how')} className="section section-steps">
      <div className="container">
        <h2 className="section-title"><AnimatedSectionTitle text={t('steps.title')} /></h2>
        <p className="section-intro section-steps-intro">{t('steps.intro')}</p>
        <motion.div
          className="steps-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <span className="step-num">{i + 1}</span>
              <h3>{t(s.title)}</h3>
              <p>{t(s.text)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Testimonials() {
  const { t, lang } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { nameKey: 'testimonials.name1', roleKey: 'testimonials.role1', quoteKey: 'testimonials.quote1', img: '/images/woman1.jpg' },
    { nameKey: 'testimonials.name2', roleKey: 'testimonials.role2', quoteKey: 'testimonials.quote2', img: '/images/man1.jpg' },
    { nameKey: 'testimonials.name4', roleKey: 'testimonials.role4', quoteKey: 'testimonials.quote4', img: '/images/man2.jpg' },
    { nameKey: 'testimonials.name3', roleKey: 'testimonials.role3', quoteKey: 'testimonials.quote3', img: '/images/woman2.jpg' },
  ];

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <section className="section section-testimonials" aria-label={t('testimonials.title')}>
      <div className="container">
        <h2 className="section-title">{t('testimonials.title')}</h2>
        <div className="testimonials-strip">
          {items.map((item, i) => (
            <div
              key={i}
              className={`testimonial-card ${i === activeIndex ? 'active' : ''}`}
              aria-hidden={i !== activeIndex}
            >
              <img src={item.img} alt="" className="testimonial-avatar" />
              <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
              <p className="testimonial-quote">"{t(item.quoteKey)}"</p>
              <p className="testimonial-name">{t(item.nameKey)}</p>
              <p className="testimonial-role">{t(item.roleKey)}</p>
            </div>
          ))}
        </div>
        <div className="testimonials-dots" aria-hidden="true">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testimonials-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`${t('testimonials.title')} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RealtorFormModal({ open, onClose }) {
  const { t, lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const hasContact = (email.trim() !== '' || phone.trim() !== '');
  const canSubmit = name.trim() !== '' && hasContact && consent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    if (name.trim() === '') errors.push('name');
    if (!hasContact) errors.push('contact');
    if (!consent) errors.push('consent');
    setValidationErrors(errors);
    if (errors.length > 0) return;
    const form = e.target;
    const data = new FormData(form);
    const payload = {
      type: 'realtor',
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone') || '',
      message: data.get('message') || '',
    };
    const ok = await submitToOwnApi(payload);
    if (ok) {
      setSubmitted(true);
      return;
    }
    const formId = import.meta.env.VITE_FORMSPREE_REALTOR;
    if (formId) {
      const fallbackOk = await submitToFormspree(formId, payload);
      if (fallbackOk) setSubmitted(true);
      else setValidationErrors(['submit']);
    } else {
      setValidationErrors(['submit']);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setValidationErrors([]);
    setName('');
    setEmail('');
    setPhone('');
    setConsent(false);
    onClose();
  };

  const goToDetailedQuote = () => {
    handleClose();
    const hash = getSectionHash(lang, 'quote');
    window.location.hash = hash;
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  if (!open) return null;
  return (
    <motion.div
      className="realtor-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget || e.target.getAttribute('aria-hidden') === 'true') handleClose(); }}
    >
      <div className="realtor-modal-backdrop" aria-hidden="true" onClick={handleClose} />
      <motion.div
        className="realtor-modal-content"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="realtor-modal-close" onClick={handleClose} aria-label={t('realtors.form.close')} title={t('realtors.form.close')}>×</button>
        <h2 className="realtor-modal-title">{t('realtors.form.title')}</h2>
        {!submitted ? (
          <>
            <p className="realtor-modal-intro">{t('realtors.form.intro')}</p>
            <form className="realtor-form" onSubmit={handleSubmit}>
              <label>
                <span>{t('realtors.form.name')}</span>
                <input type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t('quote.placeholders.name')} />
              </label>
              <label>
                <span>{t('realtors.form.email')} <em className="realtor-form-optional">({t('realtors.form.emailOrPhone')})</em></span>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('quote.placeholders.email')} />
              </label>
              <label>
                <span>{t('realtors.form.phone')}</span>
                <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('quote.placeholders.phone')} />
              </label>
              <label>
                <span>{t('realtors.form.message')}</span>
                <textarea name="message" rows={3} placeholder={t('realtors.form.messagePlaceholder')} />
              </label>
              <label className="realtor-form-consent">
                <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="realtor-form-consent-input" />
                <span className="realtor-form-consent-box" aria-hidden="true" />
                <span className="realtor-form-consent-text">{t('realtors.form.consent')}</span>
              </label>
              {validationErrors.length > 0 && (
                <div className="realtor-form-errors" role="alert">
                  <ul>
                    {validationErrors.map((key) => (
                      <li key={key}>{t(`realtors.form.errors.${key}`)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="realtor-form-actions">
                <button type="submit" className="btn btn-primary">{t('realtors.form.submit')}</button>
              </div>
            </form>
          </>
        ) : (
          <div className="realtor-modal-success">
            <p className="realtor-modal-success-main">{t('realtors.form.success')}</p>
            <p className="realtor-modal-success-prompt">{t('realtors.form.successDetailPrompt')}</p>
            <div className="realtor-modal-success-actions">
              <button type="button" className="btn btn-primary" onClick={goToDetailedQuote}>{t('realtors.form.getDetailedQuote')}</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function PartnerFormModal({ open, onClose }) {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const base = 'partnersPage.partnerSection';
  const hasContact = (email.trim() !== '' || phone.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    if (name.trim() === '') errors.push('name');
    if (!hasContact) errors.push('contact');
    if (!consent) errors.push('consent');
    setValidationErrors(errors);
    if (errors.length > 0) return;
    const msg = specialty.trim() ? (message.trim() ? `Specialty: ${specialty.trim()}\n\n${message.trim()}` : `Specialty: ${specialty.trim()}`) : message.trim() || undefined;
    const ok = await submitToOwnApi({ type: 'partner', name: name.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined, message: msg });
    if (ok) {
      setSubmitted(true);
      return;
    }
    setValidationErrors(['submit']);
  };

  const handleClose = () => {
    setSubmitted(false);
    setValidationErrors([]);
    setName('');
    setSpecialty('');
    setEmail('');
    setPhone('');
    setMessage('');
    setConsent(false);
    onClose();
  };

  if (!open) return null;
  return (
    <motion.div
      className="realtor-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget || e.target.getAttribute('aria-hidden') === 'true') handleClose(); }}
    >
      <div className="realtor-modal-backdrop" aria-hidden="true" onClick={handleClose} />
      <motion.div
        className="realtor-modal-content"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="realtor-modal-close" onClick={handleClose} aria-label={t(`${base}.close`)} title={t(`${base}.close`)}>×</button>
        <h2 className="realtor-modal-title">{t(`${base}.title`)}</h2>
        {!submitted ? (
          <>
            <p className="realtor-modal-intro">{t(`${base}.modalIntro`)}</p>
            <form className="realtor-form" onSubmit={handleSubmit}>
              <label>
                <span>{t(`${base}.name`)}</span>
                <input type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                <span>{t(`${base}.specialty`)}</span>
                <input type="text" name="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder={t(`${base}.specialtyPlaceholder`)} />
              </label>
              <label>
                <span>{t(`${base}.email`)}</span>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                <span>{t(`${base}.phone`)}</span>
                <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                <span>{t(`${base}.message`)}</span>
                <textarea name="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>
              <label className="realtor-form-consent">
                <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="realtor-form-consent-input" />
                <span className="realtor-form-consent-box" aria-hidden="true" />
                <span className="realtor-form-consent-text">{t(`${base}.consent`)}</span>
              </label>
              {validationErrors.length > 0 && (
                <div className="realtor-form-errors" role="alert">
                  <ul>
                    {validationErrors.map((key) => (
                      <li key={key}>{t(`${base}.errors.${key}`)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="realtor-form-actions">
                <button type="submit" className="btn btn-primary">{t(`${base}.submit`)}</button>
              </div>
            </form>
          </>
        ) : (
          <div className="realtor-modal-success">
            <p className="realtor-modal-success-main">{t(`${base}.success`)}</p>
            <div className="realtor-modal-success-actions">
              <button type="button" className="btn btn-primary" onClick={handleClose}>{t(`${base}.close`)}</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function FranchiseFormModal({ open, onClose }) {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const base = 'partnersPage.franchiseSection';
  const hasContact = (email.trim() !== '' || phone.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    if (name.trim() === '') errors.push('name');
    if (!hasContact) errors.push('contact');
    if (!consent) errors.push('consent');
    setValidationErrors(errors);
    if (errors.length > 0) return;
    const ok = await submitToOwnApi({ type: 'franchise', name: name.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined, message: message.trim() || undefined });
    if (ok) {
      setSubmitted(true);
      return;
    }
    setValidationErrors(['submit']);
  };

  const handleClose = () => {
    setSubmitted(false);
    setValidationErrors([]);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setConsent(false);
    onClose();
  };

  if (!open) return null;
  return (
    <motion.div
      className="realtor-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget || e.target.getAttribute('aria-hidden') === 'true') handleClose(); }}
    >
      <div className="realtor-modal-backdrop" aria-hidden="true" onClick={handleClose} />
      <motion.div
        className="realtor-modal-content"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="realtor-modal-close" onClick={handleClose} aria-label={t(`${base}.close`)} title={t(`${base}.close`)}>×</button>
        <h2 className="realtor-modal-title">{t(`${base}.title`)}</h2>
        {!submitted ? (
          <>
            <p className="realtor-modal-intro">{t(`${base}.modalIntro`)}</p>
            <form className="realtor-form" onSubmit={handleSubmit}>
              <label>
                <span>{t(`${base}.name`)}</span>
                <input type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                <span>{t(`${base}.email`)}</span>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                <span>{t(`${base}.phone`)}</span>
                <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                <span>{t(`${base}.message`)}</span>
                <textarea name="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t(`${base}.messagePlaceholder`)} />
              </label>
              <label className="realtor-form-consent">
                <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="realtor-form-consent-input" />
                <span className="realtor-form-consent-box" aria-hidden="true" />
                <span className="realtor-form-consent-text">{t(`${base}.consent`)}</span>
              </label>
              {validationErrors.length > 0 && (
                <div className="realtor-form-errors" role="alert">
                  <ul>
                    {validationErrors.map((key) => (
                      <li key={key}>{t(`${base}.errors.${key}`)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="realtor-form-actions">
                <button type="submit" className="btn btn-primary">{t(`${base}.submit`)}</button>
              </div>
            </form>
          </>
        ) : (
          <div className="realtor-modal-success">
            <p className="realtor-modal-success-main">{t(`${base}.success`)}</p>
            <div className="realtor-modal-success-actions">
              <button type="button" className="btn btn-primary" onClick={handleClose}>{t(`${base}.close`)}</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Realtors() {
  const { t, lang } = useLang();
  const realtorsHash = getSectionHash(lang, 'realtors');
  return (
    <AnimatedSection className="section section-realtors">
      <div className="container">
        <motion.div
          className="realtors-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">{t('realtors.title')}</h2>
          <p>{t('realtors.text')}</p>
          <a href={`#${realtorsHash}`} className="btn btn-primary">{t('realtorPage.ctaPrimary')}</a>
          <p className="realtors-hint">{t('realtors.form.hint')}</p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function QuoteForm() {
  const { t, lang } = useLang();
  const formRef = useRef(null);
  const [step, setStep] = useState(1);
  const [wholeHouse, setWholeHouse] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [stepError, setStepError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [quoteData, setQuoteData] = useState({ propertyType: '', size: '', areas: '', work: '' });

  const hasContact = (email.trim() !== '' || phone.trim() !== '');
  const canSubmit = name.trim() !== '' && hasContact && consent;

  const totalSteps = wholeHouse ? 4 : 5;
  const progressRaw = totalSteps > 1 ? ((step <= 2 ? step : step - (wholeHouse ? 0 : 1)) - 1) / (totalSteps - 1) * 100 : 0;
  const progress = Math.min(100, progressRaw);

  const handleNext = (next) => {
    if (next === 3 && wholeHouse) setStep(4);
    else setStep(next);
  };
  const handlePrev = (prev) => {
    if (prev === 3 && wholeHouse) setStep(2);
    else setStep(prev);
  };

  const validateStep2 = () => {
    const form = formRef.current;
    const prop = form?.querySelector('input[name="tipo_propiedad"]:checked');
    const size = form?.querySelector('select[name="tamano"]')?.value;
    if (!prop?.value || !size?.trim()) {
      setStepError('propertySize');
      return false;
    }
    setStepError(null);
    return true;
  };
  const validateStep3 = () => {
    const form = formRef.current;
    const areas = form?.querySelectorAll('input[name="areas"]:checked');
    if (!areas?.length) {
      setStepError('areas');
      return false;
    }
    setStepError(null);
    return true;
  };
  const validateStep4 = () => {
    const form = formRef.current;
    const work = form?.querySelectorAll('input[name="trabajo"]:checked');
    if (!work?.length) {
      setStepError('work');
      return false;
    }
    setStepError(null);
    return true;
  };

  const handleSubmitStep5 = async (e) => {
    e.preventDefault();
    const errors = [];
    if (name.trim() === '') errors.push('name');
    if (!hasContact) errors.push('contact');
    if (!consent) errors.push('consent');
    setValidationErrors(errors);
    if (errors.length > 0) return;

    const form = formRef.current;
    const message = form?.querySelector('textarea[name="mensaje"]')?.value || '';

    const payload = {
      type: 'quote',
      wholeHouse,
      propertyType: quoteData.propertyType,
      size: quoteData.size,
      areas: wholeHouse ? 'whole house' : quoteData.areas,
      work: quoteData.work,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message,
    };

    const ok = await submitToOwnApi(payload);
    if (ok) {
      setSubmitted(true);
      return;
    }
    const formId = import.meta.env.VITE_FORMSPREE_QUOTE;
    if (formId) {
      const fallbackOk = await submitToFormspree(formId, payload);
      if (fallbackOk) setSubmitted(true);
      else setValidationErrors(['submit']);
    } else {
      setValidationErrors(['submit']);
    }
  };

  return (
    <AnimatedSection id={getSectionHash(lang, 'quote')} className="section section-quote">
      <div className="container">
        <h2 className="section-title"><AnimatedSectionTitle text={t('quote.title')} /></h2>
        <p className="section-intro">{t('quote.intro')}</p>

        <div className="quote-wizard">
          <div className="quote-progress quote-progress--dynamic" style={{ ['--progress']: progress }}>
            <div className="quote-progress-bar" style={{ width: `${progress}%` }} />
            {[1, 2, 3, 4, 5].map((d) => {
              const isSkipped = wholeHouse && d === 3;
              const isActive = !isSkipped && step === d;
              const isDone = step > d || isSkipped && step >= 4;
              return (
                <span key={d} className={`quote-step-dot ${isActive ? 'active' : isDone ? 'done' : ''}`} data-dot={d}>{d}</span>
              );
            })}
          </div>

          {!submitted ? (
            <form
              ref={formRef}
              className="quote-form"
              onSubmit={handleSubmitStep5}
            >
              {step === 1 && (
                <motion.fieldset className="quote-step active" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  <legend>{t('quote.step1.legend')}</legend>
                  <div className="quote-options">
                    <label className="quote-option">
                      <input type="radio" name="alcance" checked={wholeHouse} onChange={() => setWholeHouse(true)} />
                      <span>{t('quote.step1.whole')}</span>
                    </label>
                    <label className="quote-option">
                      <input type="radio" name="alcance" checked={!wholeHouse} onChange={() => setWholeHouse(false)} />
                      <span>{t('quote.step1.part')}</span>
                    </label>
                  </div>
                  <div className="quote-actions">
                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>{t('quote.next')}</button>
                  </div>
                </motion.fieldset>
              )}

              {step === 2 && (
                <motion.fieldset className="quote-step active" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  <legend>{t('quote.step2prop.legend')}</legend>
                  <p className="quote-tip">{t('quote.step2prop.tip')}</p>
                  <div className="quote-options quote-options--grid">
                    {['condo', 'townhouse', 'single', 'other'].map((p) => (
                      <label key={p} className="quote-option">
                        <input type="radio" name="tipo_propiedad" value={p} />
                        <span>{t(`quote.prop.${p}`)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="quote-fields quote-fields--inline">
                    <label>
                      <span>{t('quote.step2size.legend')}</span>
                      <select name="tamano" required>
                        <option value="">{t('quote.size.select')}</option>
                        <option value="3">3</option>
                        <option value="3.5">3.5</option>
                        <option value="4">4</option>
                        <option value="4.5">4.5</option>
                        <option value="5">5</option>
                        <option value="5+">5+</option>
                      </select>
                    </label>
                  </div>
                  <p className="quote-tip quote-tip--small">{t('quote.step2size.tip')}</p>
                  {stepError === 'propertySize' && (
                    <p className="quote-step-error" role="alert">{t('quote.errors.propertySize')}</p>
                  )}
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => { setStepError(null); setStep(1); }}>{t('quote.back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => {
                      if (!validateStep2()) return;
                      const form = formRef.current;
                      const prop = form?.querySelector('input[name="tipo_propiedad"]:checked')?.value || '';
                      const size = form?.querySelector('select[name="tamano"]')?.value || '';
                      setQuoteData((prev) => ({ ...prev, propertyType: prop, size, ...(wholeHouse ? { areas: 'whole house' } : {}) }));
                      handleNext(3);
                    }}>{t('quote.next')}</button>
                  </div>
                </motion.fieldset>
              )}

              {step === 3 && !wholeHouse && (
                <motion.fieldset className="quote-step active" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  <legend>{t('quote.step2.legend')}</legend>
                  <div className="quote-checkboxes">
                    {['kitchen', 'bath', 'rooms', 'living', 'exterior', 'other'].map((a) => (
                      <label key={a}><input type="checkbox" name="areas" value={a} /> <span>{t(`quote.area.${a}`)}</span></label>
                    ))}
                  </div>
                  {stepError === 'areas' && (
                    <p className="quote-step-error" role="alert">{t('quote.errors.areas')}</p>
                  )}
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => { setStepError(null); setStep(2); }}>{t('quote.back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => {
                      if (!validateStep3()) return;
                      const form = formRef.current;
                      const areasEl = form?.querySelectorAll('input[name="areas"]:checked');
                      const areas = areasEl ? [...areasEl].map((el) => el.value).join(', ') : '';
                      setQuoteData((prev) => ({ ...prev, areas }));
                      setStep(4);
                    }}>{t('quote.next')}</button>
                  </div>
                </motion.fieldset>
              )}

              {step === 4 && (
                <motion.fieldset className="quote-step active" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  <legend>{t('quote.step3.legend')}</legend>
                  <div className="quote-checkboxes">
                    {['paint', 'clean', 'repairs', 'prep', 'curb'].map((w) => (
                      <label key={w}><input type="checkbox" name="trabajo" value={w} /> <span>{t(`quote.work.${w}`)}</span></label>
                    ))}
                  </div>
                  {stepError === 'work' && (
                    <p className="quote-step-error" role="alert">{t('quote.errors.work')}</p>
                  )}
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => { setStepError(null); setStep(wholeHouse ? 2 : 3); }}>{t('quote.back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => {
                      if (!validateStep4()) return;
                      const form = formRef.current;
                      const workEl = form?.querySelectorAll('input[name="trabajo"]:checked');
                      const work = workEl ? [...workEl].map((el) => el.value).join(', ') : '';
                      setQuoteData((prev) => ({ ...prev, work }));
                      setStep(5);
                    }}>{t('quote.next')}</button>
                  </div>
                </motion.fieldset>
              )}

              {step === 5 && (
                <motion.fieldset className="quote-step active" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  <legend>{t('quote.step4.legend')}</legend>
                  <div className="quote-fields">
                    <label><span>{t('quote.fields.name')}</span> <input type="text" name="nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('quote.placeholders.name')} /></label>
                    <label><span>{t('quote.fields.email')} <em className="realtor-form-optional">({t('realtors.form.emailOrPhone')})</em></span> <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('quote.placeholders.email')} /></label>
                    <label><span>{t('quote.fields.phone')}</span> <input type="tel" name="telefono" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('quote.placeholders.phone')} /></label>
                    <label><span>{t('quote.fields.message')}</span> <textarea name="mensaje" rows={3} placeholder={t('quote.placeholders.message')} /></label>
                  </div>
                  <label className="realtor-form-consent">
                    <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="realtor-form-consent-input" />
                    <span className="realtor-form-consent-box" aria-hidden="true" />
                    <span className="realtor-form-consent-text">{t('realtors.form.consent')}</span>
                  </label>
                  {validationErrors.length > 0 && (
                    <div className="realtor-form-errors" role="alert">
                      <ul>
                        {validationErrors.map((key) => (
                          <li key={key}>{t(`quote.errors.${key}`)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(4)}>{t('quote.back')}</button>
                    <button type="submit" className="btn btn-primary">{t('quote.submit')}</button>
                  </div>
                </motion.fieldset>
              )}
            </form>
          ) : (
            <motion.div className="quote-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="quote-success-title">{t('quote.success.title')}</p>
              <p>{t('quote.success.text')}</p>
              <p className="quote-success-closing">{t('quote.success.closing')}</p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}

function PrivacyPolicyPage() {
  const { t, lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };
  const renderList = (text) => text.split('\n').filter(Boolean).map((line, i) => <li key={i}>{line}</li>);
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Trusted Home Services - Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">{t('privacy.backToHome')}</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="privacy-hero">
          <div className="container">
            <h1 className="privacy-hero-title">{t('privacy.title')}</h1>
            <p className="privacy-hero-intro">{t('privacy.intro')}</p>
          </div>
        </div>
        <div className="container privacy-content">
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.collectTitle')}</h2>
            <div className="privacy-cards">
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.collectPersonalTitle')}</h3>
                <ul className="privacy-list">{renderList(t('privacy.collectPersonal'))}</ul>
              </div>
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.collectServiceTitle')}</h3>
                <ul className="privacy-list">{renderList(t('privacy.collectService'))}</ul>
              </div>
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.collectUsageTitle')}</h3>
                <ul className="privacy-list">{renderList(t('privacy.collectUsage'))}</ul>
              </div>
            </div>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.useTitle')}</h2>
            <ul className="privacy-use-list">
              <li>{t('privacy.use1')}</li>
              <li>{t('privacy.use2')}</li>
              <li>{t('privacy.use3')}</li>
              <li>{t('privacy.use4')}</li>
              <li>{t('privacy.use5')}</li>
            </ul>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.sharingTitle')}</h2>
            <div className="privacy-cards privacy-cards--three">
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.sharing1Title')}</h3>
                <p>{t('privacy.sharing1Desc')}</p>
              </div>
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.sharing3Title')}</h3>
                <p>{t('privacy.sharing3Desc')}</p>
              </div>
            </div>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.securityTitle')}</h2>
            <div className="privacy-cards privacy-cards--three">
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.security1Title')}</h3>
                <p>{t('privacy.security1Desc')}</p>
              </div>
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.security2Title')}</h3>
                <p>{t('privacy.security2Desc')}</p>
              </div>
              <div className="privacy-card">
                <h3 className="privacy-card-title">{t('privacy.security3Title')}</h3>
                <p>{t('privacy.security3Desc')}</p>
              </div>
            </div>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.cookiesTitle')}</h2>
            <div className="privacy-cards">
              <div className="privacy-card"><h3 className="privacy-card-title">{t('privacy.cookiesEssentialTitle')}</h3><p>{t('privacy.cookiesEssential')}</p></div>
              <div className="privacy-card"><h3 className="privacy-card-title">{t('privacy.cookiesAnalyticsTitle')}</h3><p>{t('privacy.cookiesAnalytics')}</p></div>
            </div>
            <p className="privacy-cookies-control">{t('privacy.cookiesControl')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.rightsTitle')}</h2>
            <ul className="privacy-use-list">
              <li>{t('privacy.rights1')}</li>
              <li>{t('privacy.rights2')}</li>
              <li>{t('privacy.rights3')}</li>
              <li>{t('privacy.rights5')}</li>
            </ul>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('privacy.updatesTitle')}</h2>
            <p>{t('privacy.updatesIntro')}</p>
            <p className="privacy-last-updated"><strong>{t('privacy.lastUpdated')}:</strong> February 16, 2026</p>
          </section>
          <div className="privacy-back-wrap">
            <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary">{t('privacy.backToHome')}</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TermsOfServicePage() {
  const { t, lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Trusted Home Services - Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">{t('terms.backToHome')}</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="privacy-hero">
          <div className="container">
            <h1 className="privacy-hero-title">{t('terms.title')}</h1>
            <p className="privacy-hero-intro">{t('terms.intro')}</p>
          </div>
        </div>
        <div className="container privacy-content">
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.scopeTitle')}</h2>
            <p className="legal-section-body">{t('terms.scopeBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.quotesTitle')}</h2>
            <p className="legal-section-body">{t('terms.quotesBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.paymentTitle')}</h2>
            <p className="legal-section-body">{t('terms.paymentBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.schedulingTitle')}</h2>
            <p className="legal-section-body">{t('terms.schedulingBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.changesTitle')}</h2>
            <p className="legal-section-body">{t('terms.changesBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.warrantyTitle')}</h2>
            <p className="legal-section-body">{t('terms.warrantyBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.liabilityTitle')}</h2>
            <p className="legal-section-body">{t('terms.liabilityBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.cancellationTitle')}</h2>
            <p className="legal-section-body">{t('terms.cancellationBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.governingTitle')}</h2>
            <p className="legal-section-body">{t('terms.governingBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.contactTitle')}</h2>
            <p className="legal-section-body">{t('terms.contactBody')}</p>
          </section>
          <section className="privacy-section">
            <h2 className="privacy-section-title">{t('terms.updatesTitle')}</h2>
            <p className="legal-section-body">{t('terms.updatesIntro')}</p>
            <p className="privacy-last-updated"><strong>{t('terms.lastUpdated')}:</strong> February 16, 2026</p>
          </section>
          <div className="privacy-back-wrap">
            <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary">{t('terms.backToHome')}</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FAQPage() {
  const { t, lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };
  const qa = Array.from({ length: 12 }, (_, i) => ({ q: `faq.q${i + 1}`, a: `faq.a${i + 1}` }));
  return (
    <div className="privacy-page faq-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Trusted Home Services - Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">{t('faq.backToHome')}</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="privacy-hero">
          <div className="container">
            <h1 className="privacy-hero-title">{t('faq.title')}</h1>
            <p className="privacy-hero-intro">{t('faq.intro')}</p>
          </div>
        </div>
        <div className="container privacy-content">
          {qa.map(({ q, a }, i) => (
            <section key={i} className="privacy-section faq-item">
              <h2 className="privacy-section-title">{t(q)}</h2>
              <p className="legal-section-body faq-answer">{t(a)}</p>
            </section>
          ))}
          <div className="privacy-back-wrap">
            <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary">{t('faq.backToHome')}</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const REALTOR_THIRD_IMG_INTERVAL_MS = 4000;

function ProjectsPage() {
  const { t, lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };
  const proofItems = [1, 2, 3, 4];
  return (
    <div className="privacy-page projects-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Trusted Home Services - Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">{t('projectsPage.backToHome')}</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="privacy-hero">
          <div className="container">
            <h1 className="privacy-hero-title">{t('projectsPage.title')}</h1>
            <p className="privacy-hero-intro">{t('projectsPage.subtitle')}</p>
          </div>
        </div>
        <div className="container privacy-content">
          <section className="privacy-section realtor-proof-section">
            <motion.div
              className="realtor-proof-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
            >
              {proofItems.map((num, i) => (
                <motion.article
                  key={i}
                  className="realtor-proof-card"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="realtor-proof-card-placeholder">
                    <span className="realtor-proof-card-placeholder-label">{t('realtorPage.proofProject')} {num}</span>
                  </div>
                  <p className="realtor-proof-card-location">{t('realtorPage.proofLocationLabel')}: {t('realtorPage.proofLocationPlaceholder')}</p>
                  <p className="realtor-proof-card-desc">{t('realtorPage.proofDescLabel')}: {t('realtorPage.proofDescPlaceholder')}</p>
                </motion.article>
              ))}
            </motion.div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RealtorsPage() {
  const { t, lang } = useLang();
  const [realtorModalOpen, setRealtorModalOpen] = useState(false);
  const [thirdImgActive, setThirdImgActive] = useState('money');
  const homeHash = getSectionHash(lang, 'home');
  useEffect(() => {
    const id = setInterval(() => {
      setThirdImgActive((prev) => (prev === 'money' ? 'sold' : 'money'));
    }, REALTOR_THIRD_IMG_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };
  const offerItems = [t('realtorPage.offer1'), t('realtorPage.offer2'), t('realtorPage.offer3'), t('realtorPage.offer4'), t('realtorPage.offer5')];
  const whyUs = [t('realtorPage.whyUs1'), t('realtorPage.whyUs2'), t('realtorPage.whyUs3'), t('realtorPage.whyUs4')];
  const howSteps = [
    { titleKey: 'how1Title', textKey: 'how1Text' },
    { titleKey: 'how2Title', textKey: 'how2Text' },
    { titleKey: 'how3Title', textKey: 'how3Text' },
    { titleKey: 'how4Title', textKey: 'how4Text' },
  ];
  const realtorFaqItems = [
    { qKey: 'realtorPage.realtorFaq1Q', aKey: 'realtorPage.realtorFaq1A' },
    { qKey: 'realtorPage.realtorFaq2Q', aKey: 'realtorPage.realtorFaq2A' },
    { qKey: 'realtorPage.realtorFaq3Q', aKey: 'realtorPage.realtorFaq3A' },
    { qKey: 'realtorPage.realtorFaq4Q', aKey: 'realtorPage.realtorFaq4A' },
    { qKey: 'realtorPage.realtorFaq5Q', aKey: 'realtorPage.realtorFaq5A' },
  ];
  return (
    <div className="privacy-page realtor-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Trusted Home Services - Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">{t('realtorPage.backToHome')}</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="realtor-hero">
          <div className="container">
            <h1 className="realtor-hero-title">{t('realtorPage.headline')}</h1>
            <p className="realtor-hero-sub">{t('realtorPage.subhead')}</p>
            <p className="realtor-hero-tagline">{t('realtorPage.heroTagline')}</p>
            <div className="realtor-hero-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setRealtorModalOpen(true)}>{t('realtorPage.ctaPrimary')}</button>
            </div>
          </div>
        </div>
        <div className="container privacy-content realtor-content">
          <div className="realtor-alternate-blocks">
            {/* 1. Texto izquierda, imagen derecha */}
            <section className="realtor-alternate-block realtor-alternate-block--text-left">
              <div className="realtor-alternate-content">
                <h2 className="privacy-section-title">{t('realtorPage.offerTitle')}</h2>
                <ul className="realtor-list realtor-list--offer">
                  {offerItems.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="realtor-alternate-img-wrap">
                <img src="/images/Reno.jpg" alt="" className="realtor-alternate-img" />
              </div>
            </section>
            {/* 2. Imagen izquierda, How it works derecha */}
            <section className="realtor-alternate-block realtor-alternate-block--text-right">
              <div className="realtor-alternate-img-wrap">
                <img src="/images/For%20sale%20realtors.png" alt="" className="realtor-alternate-img" />
              </div>
              <div className="realtor-alternate-content">
                <h2 className="privacy-section-title">{t('realtorPage.howTitle')}</h2>
                <ol className="realtor-how-steps">
                  {howSteps.map((step, i) => (
                    <li key={i} className="realtor-how-step">
                      <span className="realtor-how-step-num">{i + 1}</span>
                      <div>
                        <h3 className="realtor-how-step-title">{t(`realtorPage.${step.titleKey}`)}</h3>
                        <p className="realtor-how-step-text">{t(`realtorPage.${step.textKey}`)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
            {/* 3. Texto izquierda, imagen derecha */}
            <section className="realtor-alternate-block realtor-alternate-block--text-left">
              <div className="realtor-alternate-content">
                <h2 className="privacy-section-title">{t('realtorPage.whyUsTitle')}</h2>
                <ul className="realtor-list">
                  {whyUs.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="realtor-alternate-img-wrap realtor-alternate-img-wrap--crossfade">
                <img src="/images/money%20house.jpg" alt="" className={`realtor-alternate-img realtor-alternate-img-layer ${thirdImgActive !== 'money' ? 'realtor-alternate-img-layer--hidden' : ''}`} aria-hidden={thirdImgActive !== 'money'} />
                <img src="/images/sold.jpg" alt="" className={`realtor-alternate-img realtor-alternate-img-layer realtor-alternate-img-sold ${thirdImgActive !== 'sold' ? 'realtor-alternate-img-layer--hidden' : ''}`} aria-hidden={thirdImgActive !== 'sold'} />
              </div>
            </section>
          </div>
          <section className="privacy-section realtor-projects-link-section">
            <h2 className="privacy-section-title realtor-projects-link-title">{t('realtorPage.projectsLinkTitle')}</h2>
            <p className="realtor-projects-link-intro">{t('realtorPage.projectsLinkIntro')}</p>
            <a href={`#${getSectionHash(lang, 'projects')}`} className="btn btn-primary">{t('realtorPage.projectsLinkText')}</a>
          </section>
          <section className="privacy-section realtor-faq-section" id="realtor-faq">
            <h2 className="privacy-section-title realtor-faq-title">{t('realtorPage.realtorFaqTitle')}</h2>
            {realtorFaqItems.map(({ qKey, aKey }, i) => (
              <div key={i} className="realtor-faq-item">
                <h3 className="realtor-faq-question">{t(qKey)}</h3>
                <p className="realtor-faq-answer">{t(aKey)}</p>
              </div>
            ))}
          </section>
          <section className="privacy-section realtor-cta-section">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setRealtorModalOpen(true)}>{t('realtorPage.ctaPrimary')}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setRealtorModalOpen(true)}>{t('realtorPage.ctaSecondary')}</button>
          </section>
        </div>
      </main>
      <RealtorFormModal open={realtorModalOpen} onClose={() => setRealtorModalOpen(false)} />
      <Footer />
    </div>
  );
}

function BecomePartnerPage() {
  const { t, lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [franchiseModalOpen, setFranchiseModalOpen] = useState(false);
  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">{t('partnersPage.backToHome')}</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="privacy-hero">
          <div className="container">
            <h1 className="privacy-hero-title">{t('partnersPage.title')}</h1>
            <p className="privacy-hero-intro">{t('partnersPage.intro')}</p>
          </div>
        </div>
        <div className="container privacy-content">
          <motion.div
            className="become-partner-cols"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
              hidden: {}
            }}
          >
            <motion.section
              className="become-partner-card"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="privacy-section-title">{t('partnersPage.partnerSection.title')}</h2>
              <p className="become-partner-card-intro">{t('partnersPage.partnerSection.intro')}</p>
              <button type="button" className="btn btn-primary" onClick={() => setPartnerModalOpen(true)}>{t('partnersPage.partnerSection.cta')}</button>
            </motion.section>
            <motion.section
              className="become-partner-card"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="privacy-section-title">{t('partnersPage.franchiseSection.title')}</h2>
              <p className="become-partner-card-intro">{t('partnersPage.franchiseSection.intro')}</p>
              <button type="button" className="btn btn-primary" onClick={() => setFranchiseModalOpen(true)}>{t('partnersPage.franchiseSection.cta')}</button>
            </motion.section>
          </motion.div>
        </div>
      </main>
      <PartnerFormModal open={partnerModalOpen} onClose={() => setPartnerModalOpen(false)} />
      <FranchiseFormModal open={franchiseModalOpen} onClose={() => setFranchiseModalOpen(false)} />
      <Footer />
    </div>
  );
}

const ADMIN_TOKEN_KEY = 'th_admin_token';

const ADMIN_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'offer_sent', label: 'Offer sent' },
  { value: 'offer_accepted', label: 'Offer accepted' },
  { value: 'offer_rejected', label: 'Offer rejected' },
  { value: 'work_in_progress', label: 'Work in progress' },
  { value: 'work_done', label: 'Work done' },
];

function AdminPage() {
  const { lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const [token, setToken] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) || '' : '');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterPropertyType, setFilterPropertyType] = useState('');
  const [filterWork, setFilterWork] = useState('');
  const [filterAreas, setFilterAreas] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterMessage, setFilterMessage] = useState('');

  const saveToken = (t) => {
    setToken(t);
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem(ADMIN_TOKEN_KEY, t);
      else localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  };

  const handleLogout = () => {
    saveToken('');
    setError(null);
    setSubmissions([]);
    setLoginError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginUsername.trim() || !loginPassword) {
      setLoginError('Username and password required');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername.trim(), password: loginPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        saveToken(data.token);
        setLoginUsername('');
        setLoginPassword('');
        setError(null);
      } else {
        setLoginError(data.error || 'Invalid username or password');
      }
    } catch (e) {
      setLoginError('Network error');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchList = useCallback(async () => {
    if (!token.trim()) return;
    try {
      const res = await fetch(`/api/submissions?token=${encodeURIComponent(token)}`);
      if (res.status === 401) {
        setError('Session expired. Please log in again.');
        setSubmissions([]);
        return;
      }
      setError(null);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      setError('Network error');
      setSubmissions([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token.trim()) return;
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, [token, fetchList]);

  const filteredSubmissions = submissions.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterStatus !== 'all' && (s.status || 'new') !== filterStatus) return false;
    if (filterDateFrom && s._at && new Date(s._at) < new Date(filterDateFrom)) return false;
    if (filterDateTo && s._at && new Date(s._at) > new Date(filterDateTo)) return false;
    const match = (val, q) => !q.trim() || (val && String(val).toLowerCase().includes(q.trim().toLowerCase()));
    if (!match(s.name, filterName)) return false;
    if (!match(s.email, filterEmail)) return false;
    if (!match(s.phone, filterPhone)) return false;
    if (!match(s.propertyType, filterPropertyType)) return false;
    if (!match(s.work, filterWork)) return false;
    if (!match(s.areas, filterAreas)) return false;
    if (!match(s.size, filterSize)) return false;
    if (!match(s.message, filterMessage)) return false;
    return true;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/submissions?token=${encodeURIComponent(token)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
      }
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Delete the record for "${name || 'this contact'}"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`, { method: 'DELETE' });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };

  const escapeCsvCell = (v) => {
    const s = String(v ?? '').trim();
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s || '';
  };

  const downloadCsv = () => {
    const headers = ['Date', 'Type', 'Name', 'Email', 'Phone', 'Property type', 'Work', 'Areas', 'Size', 'Status', 'Message'];
    const rows = filteredSubmissions.map((s) => [
      s._at ? new Date(s._at).toLocaleString() : '',
      s.type === 'realtor' ? 'Realtor' : 'Quote',
      s.name || '',
      s.email || '',
      s.phone || '',
      s.propertyType || '',
      s.work || '',
      s.areas || '',
      s.size || '',
      ADMIN_STATUS_OPTIONS.find((o) => o.value === (s.status || 'new'))?.label || (s.status || 'New'),
      s.message || '',
    ]);
    const csvContent = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="privacy-page admin-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          {token ? (
            <div className="privacy-header-actions">
              <button type="button" className="btn btn-secondary admin-logout-btn" onClick={handleLogout}>Log out</button>
            </div>
          ) : null}
        </div>
      </header>
      <main className="privacy-main">
        <div className="container privacy-content" style={{ paddingTop: '2rem' }}>
          <h1 className="privacy-hero-title" style={{ marginBottom: '1rem' }}>Admin – Leads &amp; Quotes</h1>

          {!token ? (
            <div className="admin-login-wrap">
              <p className="admin-install-hint">To add to home screen: open Chrome menu (⋮) and choose <strong>Add to Home screen</strong> (you may need to scroll down in the menu).</p>
              <form className="admin-login-form" onSubmit={handleLogin}>
                <label>
                  <span>Username</span>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Admin username"
                    className="admin-token-input"
                    autoComplete="username"
                    autoFocus
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="admin-token-input"
                    autoComplete="current-password"
                  />
                </label>
                {loginError && <p className="admin-error" role="alert">{loginError}</p>}
                <button type="submit" className="btn btn-primary" disabled={loginLoading}>
                  {loginLoading ? 'Logging in…' : 'Log in'}
                </button>
              </form>
            </div>
          ) : (
            <>
          <p className="admin-install-hint">To add to home screen: open Chrome menu (⋮) and choose <strong>Add to Home screen</strong> (you may need to scroll down in the menu).</p>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="admin-table-wrap">
            <div className="admin-filters-card">
              <div className="admin-filters-grid">
                <label className="admin-filter">
                  <span>Type</span>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All</option>
                    <option value="realtor">Realtor</option>
                    <option value="quote">Quote</option>
                  </select>
                </label>
              <label className="admin-filter">
                <span>Status</span>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All</option>
                  {ADMIN_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="admin-filter">
                <span>Date from</span>
                <input type="datetime-local" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Date to</span>
                <input type="datetime-local" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Name</span>
                <input type="text" placeholder="Contains…" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Email</span>
                <input type="text" placeholder="Contains…" value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Phone</span>
                <input type="text" placeholder="Contains…" value={filterPhone} onChange={(e) => setFilterPhone(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Property type</span>
                <input type="text" placeholder="Contains…" value={filterPropertyType} onChange={(e) => setFilterPropertyType(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Work</span>
                <input type="text" placeholder="Contains…" value={filterWork} onChange={(e) => setFilterWork(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Areas</span>
                <input type="text" placeholder="Contains…" value={filterAreas} onChange={(e) => setFilterAreas(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Size</span>
                <input type="text" placeholder="Contains…" value={filterSize} onChange={(e) => setFilterSize(e.target.value)} />
              </label>
              <label className="admin-filter">
                <span>Message</span>
                <input type="text" placeholder="Contains…" value={filterMessage} onChange={(e) => setFilterMessage(e.target.value)} />
              </label>
              </div>
              <div className="admin-filters-actions">
                <button type="button" className="admin-download-csv btn btn-primary" onClick={downloadCsv} disabled={filteredSubmissions.length === 0}>
                  Download CSV
                </button>
              </div>
            </div>
            <div className="admin-toolbar">
              <p className="admin-updated">Updates every 5 seconds. Total: {filteredSubmissions.length} (of {submissions.length})</p>
            </div>
            <p className="admin-csv-hint">Apply filters above (type, status, date range, or any text field). The CSV exports only the rows currently shown.</p>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Property type</th>
                  <th>Work</th>
                  <th>Areas</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s, i) => (
                  <tr key={s.id || i}>
                    <td>{s._at ? new Date(s._at).toLocaleString() : '–'}</td>
                    <td>{s.type === 'realtor' ? 'Realtor partner' : s.type === 'franchise' ? 'Franchise' : s.type === 'partner' ? 'Partner' : s.type === 'quote' ? 'Quote' : s.type || '–'}</td>
                    <td>{s.name || '–'}</td>
                    <td>{s.email || '–'}</td>
                    <td>{s.phone || '–'}</td>
                    <td className="admin-cell-wrap">{s.propertyType || '–'}</td>
                    <td className="admin-cell-wrap">{s.work || '–'}</td>
                    <td className="admin-cell-wrap">{s.areas || '–'}</td>
                    <td>{s.size || '–'}</td>
                    <td className={`admin-status-cell admin-status-cell--${s.status || 'new'}`}>
                      {s.id ? (
                        <select
                          className="admin-status-select"
                          value={s.status || 'new'}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                        >
                          {ADMIN_STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span>{s.status ? ADMIN_STATUS_OPTIONS.find((o) => o.value === s.status)?.label || s.status : 'New'}</span>
                      )}
                    </td>
                    <td className="admin-cell-wrap">{s.message || '–'}</td>
                    <td>
                      {s.id ? (
                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDelete(s.id, s.name)}
                          title="Delete record"
                        >
                          Delete
                        </button>
                      ) : (
                        '–'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSubmissions.length === 0 && !error && token && <p className="admin-empty">No records match the current filters.</p>}
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Footer() {
  const { t, lang } = useLang();
  const hash = (key) => getSectionHash(lang, key);
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/images/logo v1.0.jpg" alt="Trusted Home Services" className="footer-logo" />
          <div className="footer-social" aria-label="Social media">
            <span className="footer-social-link" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg></span>
            <span className="footer-social-link" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.225.043-.404.074-.539.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.051-.15-.051-.225-.015-.239.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.36 1.104.36.231 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg></span>
            <span className="footer-social-link" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span>
            <span className="footer-social-link" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></span>
          </div>
        </div>
        <div className="footer-col footer-quicklinks">
          <h3 className="footer-heading">{t('footer.quickLinks')}</h3>
          <nav className="footer-nav" aria-label="Quick links">
            <a href={`#${hash('home')}`}>{t('footer.home')}</a>
            <a href={`#${hash('services')}`}>{t('footer.services')}</a>
            <a href={`#${hash('how')}`}>{t('footer.how')}</a>
            <a href={`#${hash('projects')}`}>{t('footer.projects')}</a>
            <a href={`#${hash('realtors')}`}>{t('footer.realtors')}</a>
            <a href={`#${hash('quote')}`}>{t('footer.quote')}</a>
            <a href={`#${hash('partners')}`}>{t('footer.partners')}</a>
          </nav>
        </div>
        <div className="footer-col footer-support">
          <h3 className="footer-heading">{t('footer.support')}</h3>
          <nav className="footer-nav" aria-label="Support and legal">
            <a href="#faq">{t('footer.faq')}</a>
            <a href="#privacy">{t('footer.privacyPolicy')}</a>
            <a href="#terms">{t('footer.termsOfService')}</a>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-rights">{t('footer.rights')}</p>
          <nav className="footer-legal" aria-label="Legal">
            <a href="#privacy">{t('footer.privacyPolicy')}</a>
            <a href="#terms">{t('footer.termsOfService')}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function getSubPageFromHash(h) {
  if (REALTORS_PAGE_HASHES.includes(h)) return 'realtors';
  if (PARTNERS_PAGE_HASHES.includes(h)) return 'partners';
  if (PROJECTS_PAGE_HASHES.includes(h)) return 'projects';
  return null;
}

export default function App() {
  const [legalPage, setLegalPage] = useState(null);
  const [subPage, setSubPage] = useState(null);
  const prevSubPageRef = useRef(null);
  const prevLegalPageRef = useRef(null);
  useEffect(() => {
    const h = (window.location.hash || '').replace('#', '').toLowerCase();
    setLegalPage(h === 'privacy' ? 'privacy' : h === 'terms' ? 'terms' : h === 'faq' ? 'faq' : h === 'admin' ? 'admin' : null);
    setSubPage(getSubPageFromHash(h));
    const onHashChange = () => {
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();
      const isLegal = ['privacy', 'terms', 'faq', 'admin'].includes(hash);
      const isSub = getSubPageFromHash(hash) != null;
      if (isLegal || isSub) window.scrollTo(0, 0);
      setLegalPage(hash === 'privacy' ? 'privacy' : hash === 'terms' ? 'terms' : hash === 'faq' ? 'faq' : hash === 'admin' ? 'admin' : null);
      setSubPage(getSubPageFromHash(hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useLayoutEffect(() => {
    if (legalPage || subPage) window.scrollTo(0, 0);
  }, [legalPage, subPage]);
  const wasOnSubOrLegal = prevSubPageRef.current != null || prevLegalPageRef.current != null;
  const nowOnMain = !subPage && !legalPage;
  const skipHeroAnimation = wasOnSubOrLegal && nowOnMain;
  useEffect(() => {
    prevSubPageRef.current = subPage;
    prevLegalPageRef.current = legalPage;
  });
  if (legalPage === 'privacy') return <PrivacyPolicyPage />;
  if (legalPage === 'terms') return <TermsOfServicePage />;
  if (legalPage === 'faq') return <FAQPage />;
  if (legalPage === 'admin') return <AdminPage />;
  if (subPage === 'realtors') return <RealtorsPage />;
  if (subPage === 'partners') return <BecomePartnerPage />;
  if (subPage === 'projects') return <ProjectsPage />;
  return (
    <>
      <Header />
      <main>
        <Hero skipAnimation={skipHeroAnimation} />
        <Services />
        <HowWeWork />
        <Testimonials />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
