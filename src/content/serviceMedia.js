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

/** The frame a set is shown in.
 *
 * The photographs come off a phone at nine by sixteen, and they were shown
 * that way at first. On the page it read badly: the frame stood 626px against
 * copy of 330 to 417, so every service page carried a column of empty space
 * beside the text. Square is wider, little more than half the height, and the
 * crop was checked against all of them before it was taken: nothing loses a
 * head or its subject, and the outdoor work reads better for it. */
const SQUARE = '1 / 1';
/** Two vertical clips side by side come to nine by eight exactly, so the pair
    fills its frame with no bars and nothing to fill in behind them. */
const REEL = '9 / 8';

/** The stills for a service, numbered from one. */
const stills = (key, count, ratio = SQUARE) => ({
  ratio,
  // What was asked for: one and a half seconds on each.
  interval: 1500,
  images: Array.from(
    { length: count },
    (_, i) => `${BASE}/${key}/${key}-${String(i + 1).padStart(2, '0')}.webp`,
  ),
});

/** The one shot twice, before the work and after it. */
const pair = (key, ratio = SQUARE) => ({
  ratio,
  before: `${BASE}/${key}/${key}-before.webp`,
  after: `${BASE}/${key}/${key}-after.webp`,
});

/**
 * Sections a trade leaves out altogether, as against showing them empty.
 *
 * An empty frame says the material is coming. That is right while it is, and
 * wrong once a trade is not going to have it, or not for a long while. These
 * are the ones asked to be left off rather than held open.
 */
const without = (...sections) => ({ omit: sections });

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
  // The stills came nearer nine by nineteen and are cut to the same frame as
  // everything else rather than given a taller one: what the crop takes is
  // floor and ceiling.
  electrical: { gallery: stills('electrical', 10), beforeAfter: pair('electrical'), ...without('reel') },
  // Two stills, and the other two sections left off rather than held open.
  handyman: { gallery: stills('handyman', 2), ...without('beforeAfter', 'reel') },
  // The second clip has not arrived, so the film waits rather than going out
  // half built. The stills go now.
  painting: { gallery: stills('painting', 2) },
  // Nothing shot for either of these yet. They keep the pair open, since that
  // is the shot to ask for first, and leave the film off.
  inspection: without('reel'),
  staging: without('reel'),
};

/** What we hold for one service, or an empty set when we hold nothing yet. */
export function getServiceMedia(key) {
  return SERVICE_MEDIA[key] || {};
}
