/**
 * Languages the site offers right now.
 *
 * Spanish is written and kept: the copy still lives in translations.js and in
 * content/services.js, and the Spanish section slugs still resolve so old links
 * do not break. It is switched off here rather than deleted, so turning it back
 * on means adding 'es' to this one list.
 */

export const ACTIVE_LOCALES = ['en', 'fr'];

export const DEFAULT_LOCALE = 'en';

export function isActiveLocale(value) {
  return ACTIVE_LOCALES.includes(value);
}

/** Falls back to the default, which also rescues anyone whose saved choice is now off. */
export function normalizeLocale(value) {
  return isActiveLocale(value) ? value : DEFAULT_LOCALE;
}
