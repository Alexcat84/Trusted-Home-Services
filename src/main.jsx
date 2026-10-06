import React from 'react';
import ReactDOM from 'react-dom/client';
import UnderConstruction from './UnderConstruction';

/*
 * This branch serves the holding page. The finished site lives on staging and
 * on site-complete, and comes back by undoing this one commit.
 *
 * No service worker here, and any already registered is cleared: a cached
 * holding page outliving the launch is the one way this could go wrong.
 */
if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => registrations.forEach((registration) => registration.unregister()))
    .catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UnderConstruction />
  </React.StrictMode>
);
