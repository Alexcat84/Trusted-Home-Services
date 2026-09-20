/**
 * Real photographs and film, per service.
 *
 * A service with an entry here shows the real thing. A service without one, or
 * without one of the three parts, keeps the labelled empty frames, which is the
 * honest state until somebody shoots the material.
 *
 * Masters stay out of the repo. What ships is re-encoded for the web: stills at
 * 800px wide in WebP, film at 1152 wide with faststart so it can be scrubbed
 * before it has finished arriving.
 *
 * Everything is named off the service key, so a trade is a row in the table at
 * the foot of this file rather than a block of paths to get wrong: stills at
 * <key>/<key>-01.webp, the pair at <key>-before and <key>-after, the film at
 * /videos/<key>-crew.mp4.
 */

const BASE = '/images/services';

/** The frame a set is shown in. Phone photographs are tall, and a frame cut for
    landscape would throw away most of every one of them. */
const TALL = '9 / 16';
/** Taller again. Some phones shoot nearer 9:19, and cutting those to 9:16 would
    take a sixth of the picture off the top and bottom. */
const TALLER = '800 / 1712';
/** Two vertical clips side by side come to nine by eight exactly, so the pair
    fills its frame with no bars and nothing to fill in behind them. */
const REEL = '9 / 8';

/** The stills for a service, numbered from one. */
const stills = (key, count, ratio = TALL) => ({
  ratio,
  // What was asked for: one and a half seconds on each.
  interval: 1500,
  images: Array.from(
    { length: count },
    (_, i) => `${BASE}/${key}/${key}-${String(i + 1).padStart(2, '0')}.webp`,
  ),
});

/** The one shot twice, before the work and after it. */
const pair = (key, ratio = TALL) => ({
  ratio,
  before: `${BASE}/${key}/${key}-before.webp`,
  after: `${BASE}/${key}/${key}-after.webp`,
});

/** The crew on site. */
const film = (key) => ({
  ratio: REEL,
  src: `/videos/${key}-crew.mp4`,
  poster: `/videos/${key}-crew-poster.jpg`,
});

export const SERVICE_MEDIA = {
  cleaning: { gallery: stills('cleaning', 7), beforeAfter: pair('cleaning'), reel: film('cleaning') },
  declutter: { gallery: stills('declutter', 9), beforeAfter: pair('declutter'), reel: film('declutter') },
  curb: { gallery: stills('curb', 9), beforeAfter: pair('curb'), reel: film('curb') },
  flooring: { gallery: stills('flooring', 11), beforeAfter: pair('flooring'), reel: film('flooring') },
  // No film on this one: there are no clips yet, so the frame stays labelled.
  electrical: { gallery: stills('electrical', 10, TALLER), beforeAfter: pair('electrical', TALLER) },
  // Two stills each, and nothing else yet.
  handyman: { gallery: stills('handyman', 2) },
  // The second clip has not arrived, so the film waits rather than going out
  // half built. The stills go now.
  painting: { gallery: stills('painting', 2) },
};

/** What we hold for one service, or an empty set when we hold nothing yet. */
export function getServiceMedia(key) {
  return SERVICE_MEDIA[key] || {};
}
