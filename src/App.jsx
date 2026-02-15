import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from './context/LangContext';
import { getSectionHash } from './translations';

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

const NAV_KEYS = ['home', 'about', 'services', 'how', 'quote'];

function Header() {
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

const HERO_BG_INTERVAL_MS = 7000;

function Hero() {
  const { t, lang } = useLang();
  const [bgActive, setBgActive] = useState('image');
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { margin: '-1px' });

  useEffect(() => {
    const id = setInterval(() => {
      setBgActive((prev) => (prev === 'image' ? 'video' : 'image'));
    }, HERO_BG_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bgActive === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.playbackRate = 0.75;
      video.play().catch(() => {});
    }
  }, [bgActive]);

  /* Ocultar fondo solo cuando el hero sale del viewport (scroll). Si vuelves a subir, se ve de nuevo */
  const outOfView = !heroInView;

  return (
    <section ref={heroRef} id={getSectionHash(lang, 'home')} className="hero">
      <div className={`hero-bg ${bgActive === 'video' ? 'hero-bg--hidden' : ''} ${outOfView ? 'hero-bg--out-of-view' : ''}`} aria-hidden="true" />
      <div className={`hero-bg-video ${bgActive === 'image' ? 'hero-bg-video--hidden' : ''} ${outOfView ? 'hero-bg-video--out-of-view' : ''}`} aria-hidden="true">
        <video
          ref={videoRef}
          src="/images/0215%20(1).mp4"
          muted
          playsInline
          className="hero-bg-video-el"
        />
      </div>
      <div className={`hero-bg-overlay ${outOfView ? 'hero-bg-overlay--out-of-view' : ''}`} aria-hidden="true" />
      <motion.div
        className="container hero-content"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={item}>{t('hero.title')}</motion.h1>
        <motion.p className="hero-subtitle" variants={item}>{t('hero.subtitle')}</motion.p>
        <motion.div className="hero-actions" variants={item}>
          <a href={`#${getSectionHash(lang, 'quote')}`} className="btn btn-primary">{t('hero.cta1')}</a>
          <a href="tel:+16132048000" className="btn btn-secondary">{t('hero.cta2')}</a>
        </motion.div>
      </motion.div>
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
        <h2 className="section-title">{t('about.title')}</h2>
        <p className="section-intro">{t('about.intro')}</p>
        <motion.div
          ref={ref}
          className="mvv-grid"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={container}
        >
          <motion.article className="mvv-card mvv-card--mission" variants={item}>
            <div className="mvv-icon">M</div>
            <h3>{t('about.mission.title')}</h3>
            <p>{t('about.mission.text')}</p>
          </motion.article>
          <motion.article className="mvv-card mvv-card--vision" variants={item}>
            <div className="mvv-icon">V</div>
            <h3>{t('about.vision.title')}</h3>
            <p>{t('about.vision.text')}</p>
          </motion.article>
          <motion.article className="mvv-card mvv-card--values" variants={item}>
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
        <motion.div className="about-extra" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
          <p>{t('about.extra')}</p>
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
    { key: 'paint', img: '/images/roller painting.jpeg' },
    { key: 'clean', img: '/images/cleaning services 1.png' },
    { key: 'repair', img: '/images/Plaster.png' },
    { key: 'curb', img: '/images/home makeover.png' },
  ];

  return (
    <AnimatedSection id={getSectionHash(lang, 'services')} className="section section-services">
      <div className="container container--wide">
        <h2 className="section-title">{t('services.title')}</h2>
        <p className="section-intro">{t('services.intro')}</p>
        <motion.div
          ref={ref}
          className="services-grid services-grid--four"
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
        <button type="button" className="service-modal-close" onClick={onClose} aria-label="Close">&times;</button>
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
        <h2 className="section-title">{t('steps.title')}</h2>
        <p className="section-intro">{t('steps.intro')}</p>
        <motion.div
          className="steps-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, staggerChildren: 0.15 }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="step-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
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

function Realtors() {
  const { t, lang } = useLang();
  return (
    <AnimatedSection className="section section-realtors">
      <div className="container">
        <motion.div
          className="realtors-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>{t('realtors.title')}</h2>
          <p>{t('realtors.text')}</p>
          <a href={`#${getSectionHash(lang, 'quote')}`} className="btn btn-primary">{t('realtors.cta')}</a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function QuoteForm() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(1);
  const [wholeHouse, setWholeHouse] = useState(true);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <AnimatedSection id={getSectionHash(lang, 'quote')} className="section section-quote">
      <div className="container">
        <h2 className="section-title">{t('quote.title')}</h2>
        <p className="section-intro">{t('quote.intro')}</p>

        <div className="quote-wizard">
          <div className="quote-progress quote-progress--dynamic" style={{ ['--progress']: progress }}>
            <div className="quote-progress-bar" style={{ width: `${progress}%` }} />
            {[1, 2, 3, 4, 5].map((d) => (
              <span key={d} className={`quote-step-dot ${wholeHouse && d === 3 ? 'hidden-dot' : ''} ${step === d ? 'active' : step > d ? 'done' : ''}`} data-dot={d}>{d}</span>
            ))}
          </div>

          {!submitted ? (
            <form
              className="quote-form"
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
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
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>{t('quote.back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => handleNext(3)}>{t('quote.next')}</button>
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
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>{t('quote.back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>{t('quote.next')}</button>
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
                  <div className="quote-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(wholeHouse ? 2 : 3)}>{t('quote.back')}</button>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(5)}>{t('quote.next')}</button>
                  </div>
                </motion.fieldset>
              )}

              {step === 5 && (
                <motion.fieldset className="quote-step active" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  <legend>{t('quote.step4.legend')}</legend>
                  <div className="quote-fields">
                    <label><span>{t('quote.fields.name')}</span> <input type="text" name="nombre" required placeholder={t('quote.placeholders.name')} /></label>
                    <label><span>{t('quote.fields.email')}</span> <input type="email" name="email" required placeholder={t('quote.placeholders.email')} /></label>
                    <label><span>{t('quote.fields.phone')}</span> <input type="tel" name="telefono" placeholder={t('quote.placeholders.phone')} /></label>
                    <label><span>{t('quote.fields.message')}</span> <textarea name="mensaje" rows={3} placeholder={t('quote.placeholders.message')} /></label>
                  </div>
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
              <a href="https://wa.me/16132048000?text=Hi%2C%20I%20request%20a%20quote." className="btn btn-whatsapp" target="_blank" rel="noopener">{t('quote.success.wa')}</a>
            </motion.div>
          )}
        </div>

        <p className="quote-alt">
          <span>{t('quote.alt')}</span>{' '}
          <a href="https://wa.me/16132048000?text=Hi%2C%20I%20want%20a%20free%20quote." target="_blank" rel="noopener">{t('quote.altlink')}</a>
        </p>
      </div>
    </AnimatedSection>
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
          <p>{t('footer.desc')}</p>
        </div>
        <div className="footer-contact">
          <p><a href="tel:+16132048000">(613) 204-8000</a></p>
          <p>Ottawa, Ontario</p>
        </div>
        <nav className="footer-nav">
          <a href={`#${hash('home')}`}>{t('footer.home')}</a>
          <a href={`#${hash('about')}`}>{t('footer.about')}</a>
          <a href={`#${hash('services')}`}>{t('footer.services')}</a>
          <a href={`#${hash('quote')}`}>{t('footer.quote')}</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <HowWeWork />
        <Realtors />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
