/**
 * The reel that plays in the centre of the hero.
 *
 * Every cut we have encoded stays shipped, so switching between them is a change
 * of one word here and nothing else. All are muted loops, so none carries audio.
 *
 * Masters live in media-source/ and stay out of the repo. The copies here are
 * re-encoded for the web: 1280 wide, audio track stripped, faststart enabled.
 */

export const HERO_VIDEOS = {
  proposal: {
    src: '/videos/hero-proposal.mp4',
    poster: '/videos/hero-proposal-poster.jpg',
  },
  primary: {
    src: '/videos/hero-primary.mp4',
    poster: '/videos/hero-primary-poster.jpg',
  },
  alternate: {
    src: '/videos/hero-alt.mp4',
    poster: '/videos/hero-alt-poster.jpg',
  },
};

/** Which cut is live. Set to any key above to swap what the hero plays. */
export const ACTIVE = 'proposal';

export function getHeroVideo() {
  return HERO_VIDEOS[ACTIVE] || HERO_VIDEOS.proposal;
}
