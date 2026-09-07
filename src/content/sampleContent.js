/**
 * Placeholder content, so the page can be judged at the volume the reference
 * runs at while the real material is still being collected.
 *
 * The text is lorem so that nobody can mistake it for a real review or a real
 * article, and the names are initials rather than people. Delete this file and
 * the two blocks that read it once the genuine reviews and posts arrive.
 */

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc sed velit dignissim sodales ut eu sem.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.',
  'Nulla facilisi. Morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim.',
  'Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a molestie lorem at quam sit amet nulla.',
  'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec velit neque auctor sit.',
];

/** Nine placeholder reviews, which is the count the reference shows at once. */
export const SAMPLE_REVIEWS = Array.from({ length: 9 }, (_, i) => ({
  id: `sample-${i + 1}`,
  initial: String.fromCharCode(65 + i),
  name: `Placeholder ${String.fromCharCode(65 + i)}.`,
  date: 'Sample entry',
  stars: 5,
  text: LOREM[i % LOREM.length],
}));

/** Six placeholder articles for the row the reference fills with blog posts. */
export const SAMPLE_POSTS = Array.from({ length: 6 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: `Placeholder article ${i + 1}`,
  excerpt: LOREM[(i + 2) % LOREM.length],
  img: [
    '/images/roller painting.jpeg',
    '/images/flooring.jpg',
    '/images/curb-appeal.avif',
    '/images/cleaning services 1.png',
    '/images/staging-organizing.jpg',
    '/images/handyman.jpg',
  ][i],
}));
