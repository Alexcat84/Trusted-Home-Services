/**
 * The reel that plays in the centre of the hero.
 *
 * Two cuts are encoded and shipped. To swap which one the site shows, change
 * ACTIVE below and nothing else. Both are muted loops, so neither carries audio.
 *
 * Masters live in media-source/ and stay out of the repo. The copies here are
 * re-encoded for the web: 1280 wide, no audio track, faststart enabled.
 */

export const HERO_VIDEOS = {
  primary: {
    src: '/videos/hero-primary.mp4',
    poster: '/videos/hero-primary-poster.jpg',
  },
  alternate: {
    src: '/videos/hero-alt.mp4',
    poster: '/videos/hero-alt-poster.jpg',
  },
};

/** Which cut is live. Set to 'alternate' to fall back to the earlier reel. */
export const ACTIVE = 'primary';

export function getHeroVideo() {
  return HERO_VIDEOS[ACTIVE] || HERO_VIDEOS.primary;
}
