import React, { useState, useRef, useEffect } from 'react';
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
  }, [inView]);

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

const NAV_KEYS = ['home', 'about', 'services', 'how', 'quote'];

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
          <span className="btn btn-secondary" aria-hidden="true">{t('hero.cta2')}</span>
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
    { key: 'paint', img: '/images/roller painting.jpeg' },
    { key: 'clean', img: '/images/cleaning services 1.png' },
    { key: 'repair', img: '/images/Plaster.png' },
    { key: 'curb', img: '/images/home makeover.png' },
  ];

  return (
    <AnimatedSection id={getSectionHash(lang, 'services')} className="section section-services">
      <div className="container container--wide">
        <h2 className="section-title"><AnimatedSectionTitle text={t('services.title')} /></h2>
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
        <h2 className="section-title"><AnimatedSectionTitle text={t('steps.title')} /></h2>
        <p className="section-intro">{t('steps.intro')}</p>
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
        <button type="button" className="realtor-modal-close" onClick={handleClose} aria-label={t('realtors.form.close')}>×</button>
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
            <p>{t('realtors.form.success')}</p>
            <button type="button" className="btn btn-primary" onClick={handleClose}>{t('realtors.form.close')}</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Realtors() {
  const { t, lang } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
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
            <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>{t('realtors.cta')}</button>
            <p className="realtors-hint">{t('realtors.form.hint')}</p>
          </motion.div>
        </div>
      </AnimatedSection>
      <RealtorFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
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
    const prop = form?.querySelector('input[name="tipo_propiedad"]:checked')?.value || '';
    const size = form?.querySelector('select[name="tamano"]')?.value || '';
    const areasEl = form?.querySelectorAll('input[name="areas"]:checked');
    const workEl = form?.querySelectorAll('input[name="trabajo"]:checked');
    const areas = areasEl ? [...areasEl].map((el) => el.value).join(', ') : '';
    const work = workEl ? [...workEl].map((el) => el.value).join(', ') : '';
    const message = form?.querySelector('textarea[name="mensaje"]')?.value || '';

    const payload = {
      type: 'quote',
      wholeHouse,
      propertyType: prop,
      size,
      areas: wholeHouse ? 'whole house' : areas,
      work,
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
                    <button type="button" className="btn btn-primary" onClick={() => { if (validateStep2()) handleNext(3); }}>{t('quote.next')}</button>
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
                    <button type="button" className="btn btn-primary" onClick={() => { if (validateStep3()) setStep(4); }}>{t('quote.next')}</button>
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
                    <button type="button" className="btn btn-primary" onClick={() => { if (validateStep4()) setStep(5); }}>{t('quote.next')}</button>
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

        <p className="quote-alt">
          <span>{t('quote.alt')}</span>{' '}
          <a href="https://wa.me/16132048000?text=Hi%2C%20I%20want%20a%20free%20quote." target="_blank" rel="noopener" className="quote-alt-wa">
            <svg className="quote-alt-wa-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('quote.altlink')}
          </a>
        </p>
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

const ADMIN_TOKEN_KEY = 'th_admin_token';

function AdminPage() {
  const { lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');
  const [token, setToken] = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_TOKEN_KEY) || '' : '');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  const saveToken = (t) => {
    setToken(t);
    if (typeof window !== 'undefined') sessionStorage.setItem(ADMIN_TOKEN_KEY, t);
  };

  useEffect(() => {
    if (!token.trim()) return;
    const fetchList = async () => {
      try {
        const res = await fetch(`/api/submissions?token=${encodeURIComponent(token)}`);
        if (res.status === 401) {
          setError('Invalid token');
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
    };
    fetchList();
    const interval = setInterval(fetchList, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = homeHash;
    setTimeout(() => window.scrollTo(0, 0), 50);
  };

  return (
    <div className="privacy-page admin-page">
      <header className="privacy-header">
        <div className="container privacy-header-inner">
          <a href={`#${homeHash}`} onClick={goHome} className="privacy-logo-link" aria-label="Home">
            <img src="/images/logo v1.0.jpg" alt="" className="privacy-logo" />
          </a>
          <a href={`#${homeHash}`} onClick={goHome} className="btn btn-primary privacy-back-btn">Back to Home</a>
        </div>
      </header>
      <main className="privacy-main">
        <div className="container privacy-content" style={{ paddingTop: '2rem' }}>
          <h1 className="privacy-hero-title" style={{ marginBottom: '1rem' }}>Admin – Leads &amp; Quotes</h1>
          <div className="admin-token-wrap">
            <label>
              <span>Access token (ADMIN_SECRET):</span>
              <input
                type="password"
                value={token}
                onChange={(e) => saveToken(e.target.value)}
                placeholder="Enter token"
                className="admin-token-input"
              />
            </label>
          </div>
          <p className="admin-push-sync-hint" style={{ marginBottom: '1rem' }}>Avisos por email: configura en Vercel <code>RESEND_API_KEY</code> y <code>ADMIN_EMAIL</code> para recibir un correo por cada envío de formulario. Esta página es instalable como app web (menú del navegador → «Instalar» o «Añadir a pantalla de inicio»).</p>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="admin-table-wrap">
            <p className="admin-updated">Updates every 5 seconds. Total: {submissions.length}</p>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Property type</th>
                  <th>Work</th>
                  <th>Areas</th>
                  <th>Size</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr key={i}>
                    <td>{s._at ? new Date(s._at).toLocaleString() : '–'}</td>
                    <td>{s.type === 'realtor' ? 'Realtor' : 'Quote'}</td>
                    <td>{s.name || '–'}</td>
                    <td>{[s.email, s.phone].filter(Boolean).join(' · ') || '–'}</td>
                    <td>{s.propertyType || '–'}</td>
                    <td>{s.work || '–'}</td>
                    <td>{s.areas || '–'}</td>
                    <td>{s.size || '–'}</td>
                    <td>{s.message || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {submissions.length === 0 && !error && token && <p className="admin-empty">No submissions yet.</p>}
          </div>
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
            <a href={`#${hash('about')}`}>{t('footer.about')}</a>
            <a href={`#${hash('services')}`}>{t('footer.services')}</a>
            <a href={`#${hash('how')}`}>{t('footer.how')}</a>
            <a href={`#${hash('quote')}`}>{t('footer.quote')}</a>
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

export default function App() {
  const [legalPage, setLegalPage] = useState(null); // 'privacy' | 'terms' | 'faq' | 'admin' | null
  useEffect(() => {
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    setLegalPage(hash === 'privacy' ? 'privacy' : hash === 'terms' ? 'terms' : hash === 'faq' ? 'faq' : hash === 'admin' ? 'admin' : null);
    const onHashChange = () => {
      const h = (window.location.hash || '').replace('#', '').toLowerCase();
      setLegalPage(h === 'privacy' ? 'privacy' : h === 'terms' ? 'terms' : h === 'faq' ? 'faq' : h === 'admin' ? 'admin' : null);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    if (legalPage) window.scrollTo(0, 0);
  }, [legalPage]);
  if (legalPage === 'privacy') return <PrivacyPolicyPage />;
  if (legalPage === 'terms') return <TermsOfServicePage />;
  if (legalPage === 'faq') return <FAQPage />;
  if (legalPage === 'admin') return <AdminPage />;
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
