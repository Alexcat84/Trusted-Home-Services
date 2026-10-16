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
 * Only the first is fetched with the page. The rest are left alone until the
 * one before them ends, which matters here: the drone cut is 10.5MB against
 * 832KB for the opener, and nobody should pay for it on arrival.
 *
 * That 10.5MB is deliberate. The cut was first encoded at 960x540 and looked
 * soft on the site, which read as poor footage; the master is 2560x1440 and
 * sharp, so the softness was ours. It is 1280x720 now, matching the opener,
 * at 2.6 Mbps. Thirty four seconds of drone motion over foliage is the worst
 * case for any codec: AV1 and VP9 were tried and neither beat x264 here, and
 * dropping to 24fps saved nothing. The remaining lever is length.
 */
export const SEQUENCE = ['proposal', 'drone'];

export function getHeroVideo() {
  return HERO_VIDEOS[ACTIVE] || HERO_VIDEOS.proposal;
}

/** The cuts to play in turn, skipping any key that no longer exists. */
export function getHeroSequence() {
  const cortes = SEQUENCE.map((key) => HERO_VIDEOS[key]).filter(Boolean);
  return cortes.length ? cortes : [getHeroVideo()];
}
