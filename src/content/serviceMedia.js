/**
 * Real photographs and film, per service.
 *
 * A service with an entry here shows the real thing. A service without one
 * keeps the labelled empty frames, which is the honest state until somebody
 * shoots the material. So adding a trade is adding a key, and nothing else.
 *
 * Masters stay out of the repo. What ships is re-encoded for the web: stills
 * at 800px wide in WebP, film at 1152 wide with faststart so it can be
 * scrubbed before it has finished arriving.
 *
 * `ratio` is the frame each set is shown in, written as a CSS aspect-ratio.
 * These are phone photographs, so they are tall, and a frame cut for landscape
 * would throw away most of every one of them.
 */

const CLEANING = '/images/services/cleaning';
const DECLUTTER = '/images/services/declutter';

export const SERVICE_MEDIA = {
  cleaning: {
    gallery: {
      ratio: '9 / 16',
      // What was asked for: one and a half seconds on each.
      interval: 1500,
      images: [
        `${CLEANING}/cleaning-01.webp`,
        `${CLEANING}/cleaning-02.webp`,
        `${CLEANING}/cleaning-03.webp`,
        `${CLEANING}/cleaning-04.webp`,
        `${CLEANING}/cleaning-05.webp`,
        `${CLEANING}/cleaning-06.webp`,
        `${CLEANING}/cleaning-07.webp`,
      ],
    },
    beforeAfter: {
      ratio: '9 / 16',
      before: `${CLEANING}/cleaning-before.webp`,
      after: `${CLEANING}/cleaning-after.webp`,
    },
    reel: {
      // Two vertical clips side by side come to nine by eight exactly, so the
      // pair fills the frame with no bars and nothing to fill in behind them.
      ratio: '9 / 8',
      src: '/videos/cleaning-crew.mp4',
      poster: '/videos/cleaning-crew-poster.jpg',
    },
  },
  declutter: {
    gallery: {
      ratio: '9 / 16',
      interval: 1500,
      images: [
        `${DECLUTTER}/declutter-01.webp`,
        `${DECLUTTER}/declutter-02.webp`,
        `${DECLUTTER}/declutter-03.webp`,
        `${DECLUTTER}/declutter-04.webp`,
        `${DECLUTTER}/declutter-05.webp`,
        `${DECLUTTER}/declutter-06.webp`,
        `${DECLUTTER}/declutter-07.webp`,
        `${DECLUTTER}/declutter-08.webp`,
        `${DECLUTTER}/declutter-09.webp`,
      ],
    },
    // No pair yet. The after we hold was taken from the driveway looking in,
    // and every before we hold was taken from inside the garage, so the two
    // cannot line up. The labelled empty frames stay until there is a pair.
    reel: {
      ratio: '9 / 8',
      src: '/videos/declutter-crew.mp4',
      poster: '/videos/declutter-crew-poster.jpg',
    },
  },
};

/** What we hold for one service, or an empty set when we hold nothing yet. */
export function getServiceMedia(key) {
  return SERVICE_MEDIA[key] || {};
}
