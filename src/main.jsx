import React from 'react';
import ReactDOM from 'react-dom/client';
import { LangProvider } from './context/LangContext';
import { QuoteProvider } from './context/QuoteProvider';
import App from './App';
import CookieConsent from './components/CookieConsent';
import './index.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <QuoteProvider>
        <CookieConsent />
        <App />
      </QuoteProvider>
    </LangProvider>
  </React.StrictMode>
);
