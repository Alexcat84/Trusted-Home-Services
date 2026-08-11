/**
 * Path based routing for the service pages.
 *
 * The rest of the site navigates by hash, which is fine for scrolling to a section
 * on the home page. Service pages need real paths (/services/painting) because
 * search engines index those as separate pages and ignore hash fragments.
 */

import { SERVICE_SLUGS, getServiceKeyFromSlug } from '../content/services.js';

export const SERVICES_BASE = '/services';

/** Which service, if any, the current path points at. */
export function getServiceFromPath(pathname) {
  const path = pathname ?? window.location.pathname;
  const match = String(path || '').match(/^\/services\/([^/?#]+)\/?$/i);
  if (!match) return null;
  try {
    return getServiceKeyFromSlug(decodeURIComponent(match[1]).toLowerCase());
  } catch {
    return null;
  }
}

export function servicePath(key) {
  const slug = SERVICE_SLUGS[key];
  return slug ? `${SERVICES_BASE}/${slug}` : SERVICES_BASE;
}

/**
 * Move to a new path without a full reload, then tell the app to re-read the URL.
 * `popstate` does not fire for pushState, so we raise it ourselves.
 */
export function navigateTo(path, hash = '') {
  const target = `${path}${hash ? `#${hash}` : ''}`;
  if (window.location.pathname + window.location.hash === target) return;
  window.history.pushState({}, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/** True when we are somewhere other than the home page. */
export function isOnSubPath() {
  return window.location.pathname !== '/' && window.location.pathname !== '';
}
