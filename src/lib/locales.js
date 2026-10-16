/**
 * Languages the site offers.
 *
 * Two, and the Spanish that used to sit behind this list has been deleted:
 * the copy, the service pages and the section slugs. Nothing was published in
 * it, so no link breaks. Bringing it back means writing it again, not adding
 * a line here.
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
