import { useState, useEffect } from 'react';
import { useLang } from '../context/useLang';

const CONSENT_KEY = 'trusted_cookie_consent';
const GA_ID = 'G-C4H7QVDMLH';

function loadGoogleAnalytics() {
  if (window.gtag) return;

  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gtagScript);

  const initScript = document.createElement('script');
  initScript.src = '/ga-init.js';
  initScript.dataset.gaId = GA_ID;
  document.head.appendChild(initScript);
}

function getStoredConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(() => {
    const saved = getStoredConsent();
    return saved !== 'accepted' && saved !== 'declined';
  });

  useEffect(() => {
    if (getStoredConsent() === 'accepted') loadGoogleAnalytics();
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch { /* storage unavailable (e.g. private mode); ignore */ }
    loadGoogleAnalytics();
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch { /* storage unavailable (e.g. private mode); ignore */ }
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
