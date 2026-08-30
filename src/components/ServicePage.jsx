import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/useLang';
import { getServiceContent, getServiceList, SERVICE_IMAGES } from '../content/services';
import { navigateTo, servicePath } from '../lib/routing';
import Header from './Header';
import Footer from './Footer';

/** Keeps the tab title and meta description in step with the service being viewed. */
function useServiceMeta(content) {
  useEffect(() => {
    if (!content) return undefined;
    const previousTitle = document.title;
    document.title = content.metaTitle;

    let tag = document.querySelector('meta[name="description"]');
    let created = false;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
      created = true;
    }
    const previousDescription = tag.getAttribute('content');
    tag.setAttribute('content', content.metaDescription);

    return () => {
      document.title = previousTitle;
      if (created) tag.remove();
      else if (previousDescription != null) tag.setAttribute('content', previousDescription);
    };
  }, [content]);
}

export default function ServicePage({ serviceKey }) {
  const { t, lang } = useLang();
  const content = getServiceContent(lang, serviceKey);
  useServiceMeta(content);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceKey]);

  if (!content) return null;

  const others = getServiceList(lang).filter((s) => s.key !== serviceKey);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" className="service-page">
        <section className="service-hero">
          <div className="container service-hero-inner">
            <div className="service-hero-copy">
              <p className="service-eyebrow">{t('nav.services')}</p>
              <h1 className="service-title">{content.name}</h1>
              <p className="service-tagline">{content.tagline}</p>
              <p className="service-intro">{content.intro}</p>
              <div className="service-hero-actions">
                <a href="tel:+16132048000" className="btn btn-secondary">{t('hero.cta2')}</a>
              </div>
            </div>
            <div className="service-hero-media">
              <img src={SERVICE_IMAGES[serviceKey]} alt="" loading="eager" />
            </div>
          </div>
        </section>

        <section className="section service-includes">
          <div className="container">
            <h2 className="section-title">{t('services.includesTitle')}</h2>
            <ul className="service-list">
              {content.includes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section-alt service-benefits">
          <div className="container">
            <h2 className="section-title">{t('services.benefitsTitle')}</h2>
            <div className="service-benefit-grid">
              {content.benefits.map((b) => (
                <motion.article
                  key={b.title}
                  className="service-benefit"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4 }}
                >
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section service-faq">
          <div className="container">
            <h2 className="section-title">{t('services.faqTitle')}</h2>
            <dl className="service-faq-list">
              {content.faq.map((item) => (
                <div className="service-faq-item" key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section service-others">
          <div className="container">
            <h2 className="section-title">{t('services.othersTitle')}</h2>
            <ul className="service-others-grid">
              {others.map((s) => (
                <li key={s.key}>
                  <a
                    href={servicePath(s.key)}
                    className="service-others-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(servicePath(s.key));
                    }}
                  >
                    <span className="service-others-name">{s.name}</span>
                    <span className="service-others-tagline">{s.tagline}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
