import { useEffect } from 'react';

/**
 * The holding page that main serves while the site is being finished.
 *
 * Deliberately self contained: its own styles, no imports from the site, and
 * it never touches index.css. The only other file this branch changes is
 * main.jsx, which renders this instead of the app. That keeps the difference
 * between main and the finished site down to two files, so bringing the real
 * site across later is undoing one commit rather than untangling a merge.
 *
 * Both languages are on the page at once. There is no switcher here, and a
 * holding page is too small to make somebody choose.
 */

const NAVY = '#0e2340';
const ORANGE = '#F9772B';
const PHONE = '(613) 204-8000';

const CSS = `
html, body, #root {
  margin: 0;
  padding: 0;
  background-color: ${NAVY};
}
.uc-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem 3rem;
  background-color: ${NAVY};
  color: #ffffff;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}
.uc-backdrop {
  position: absolute;
  inset: 0;
  background-image: url('/videos/hero-proposal-poster.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.22;
}
.uc-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(14, 35, 64, 0.55) 0%, rgba(14, 35, 64, 0.92) 100%);
}
.uc-inner {
  position: relative;
  width: 100%;
  max-width: 44rem;
  text-align: center;
}
.uc-logo {
  width: min(22rem, 78vw);
  height: auto;
  display: block;
  margin: 0 auto 2.5rem;
  border-radius: 10px;
}
.uc-rule {
  width: 3.5rem;
  height: 4px;
  margin: 0 auto 1.75rem;
  background: ${ORANGE};
  border-radius: 2px;
}
.uc-title {
  margin: 0 0 0.4rem;
  font-family: 'Open Sans', 'Inter', system-ui, sans-serif;
  font-size: clamp(1.9rem, 6vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.uc-title-fr {
  margin: 0 0 2rem;
  font-family: 'Open Sans', 'Inter', system-ui, sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 600;
  color: ${ORANGE};
}
.uc-text {
  margin: 0 auto 0.9rem;
  max-width: 34rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.86);
}
.uc-text-fr {
  color: rgba(255, 255, 255, 0.62);
}
.uc-call {
  margin-top: 2.5rem;
}
.uc-call-label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.uc-phone {
  display: inline-block;
  padding: 0.85rem 2rem;
  border-radius: 999px;
  background: ${ORANGE};
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease;
}
.uc-phone:hover,
.uc-phone:focus-visible {
  background: #e06a20;
}
.uc-phone:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 3px;
}
@media (max-width: 480px) {
  .uc-logo { margin-bottom: 1.75rem; }
  .uc-call { margin-top: 2rem; }
}
`;

export default function UnderConstruction() {
  useEffect(() => {
    document.title = 'Trusted Home Services | Coming soon';
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <main className="uc-page">
        <div className="uc-backdrop" aria-hidden="true" />
        <div className="uc-veil" aria-hidden="true" />
        <div className="uc-inner">
          <img
            className="uc-logo"
            src="/images/Logo v4.0 Inverted.jpg"
            alt="Trusted Home Services"
          />
          <div className="uc-rule" aria-hidden="true" />
          <h1 className="uc-title">Our new site is on its way</h1>
          <p className="uc-title-fr">Notre nouveau site arrive</p>
          <p className="uc-text">
            We are getting homes across Ottawa ready to sell while we finish it. Call us
            and we will come and look at yours.
          </p>
          <p className="uc-text uc-text-fr">
            Entre-temps, nous préparons des maisons partout à Ottawa pour la vente.
            Appelez-nous et nous viendrons voir la vôtre.
          </p>
          <div className="uc-call">
            <span className="uc-call-label">Call us / Appelez-nous</span>
            <a className="uc-phone" href={`tel:+1${PHONE.replace(/\D/g, '')}`}>
              {PHONE}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
