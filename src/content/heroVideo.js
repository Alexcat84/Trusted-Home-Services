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
  drone: {
    src: '/videos/hero-drone.mp4',
    poster: '/videos/hero-drone-poster.jpg',
  },
};

/** Which cut is live. Set to any key above to swap what the hero plays. */
export const ACTIVE = 'proposal';

/**
 * What the hero plays, in order, before starting again.
 *
 * The drone flight opens, and the renovation sequence follows it.
 *
 * Only the first entry is fetched with the page; the rest are left alone until
 * the one before them ends. With the drone first, that first fetch is the
 * 10.5MB file rather than the 832KB one, so the home page now streams a 2.6
 * Mbps video on arrival. It plays as it arrives rather than waiting for the
 * whole file, and the poster frame holds the space until it starts, but on a
 * weak connection that opening will stall where the old one did not.
 *
 * The 10.5MB is already the floor for this shot at this length. It was first
 * encoded at 960x540 and looked soft, which read as poor footage; the master
 * is 2560x1440 and sharp, so the softness was ours. It is 1280x720 now, the
 * same frame as the other cut. Thirty four seconds of drone motion over
 * foliage is the worst case for any codec: AV1 and VP9 were both tried and
 * neither beat x264 on it, and 24fps saved nothing. Length is the only lever
 * left, and now that this cut opens the page it is worth pulling.
 */
export const SEQUENCE = ['drone', 'proposal'];

export function getHeroVideo() {
  return HERO_VIDEOS[ACTIVE] || HERO_VIDEOS.proposal;
}

/** The cuts to play in turn, skipping any key that no longer exists. */
export function getHeroSequence() {
  const cortes = SEQUENCE.map((key) => HERO_VIDEOS[key]).filter(Boolean);
  return cortes.length ? cortes : [getHeroVideo()];
}
