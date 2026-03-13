import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';

const CONSENT_KEY = 'trusted_cookie_consent';
const GA_ID = 'G-C4H7QVDMLH';

function loadGoogleAnalytics() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export default function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved === 'accepted') {
        loadGoogleAnalytics();
        return;
      }
      if (saved === 'declined') return;
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch {}
    loadGoogleAnalytics();
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="cookie-consent-inner">
        <p className="cookie-consent-text">
          {t('cookieConsent.message')}{' '}
          <a href="#privacy" className="cookie-consent-link">{t('cookieConsent.privacyLink')}</a>.
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="btn btn-primary cookie-consent-btn" onClick={accept}>
            {t('cookieConsent.accept')}
          </button>
          <button type="button" className="btn btn-secondary cookie-consent-btn" onClick={decline}>
            {t('cookieConsent.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}
