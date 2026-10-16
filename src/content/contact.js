/**
 * How to reach the business, in one place.
 *
 * The number was written out by hand in eight strings of copy, in the terms,
 * an FAQ answer and the form error messages, and nowhere as something you
 * could press. On a phone that is the whole point of showing it, so the header
 * and the footer both take it from here and link it as tel:.
 *
 * The copy keeps its own spellings for now, because changing a sentence is the
 * client's call. If the number ever changes, this is the first place to fix
 * and then a search for 204-8000 finds the rest.
 */

/** As it reads on the page, in the local format. */
export const PHONE_DISPLAY = '(613) 204-8000';

/** As a phone dials it: country code, no spaces, nothing to parse. */
export const PHONE_TEL = '+16132048000';

/** Where the work is. */
export const CITY = 'Ottawa, Ontario';
