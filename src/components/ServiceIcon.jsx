/**
 * One line icon per service, drawn inline so they inherit colour and never load a file.
 *
 * These replace the emoji used in the design reference. Emoji are barred by the site
 * content rules, and they also render as a different picture on Windows, macOS and
 * Android, which is not something a client site should leave to chance.
 */

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

const PATHS = {
  // Paint roller
  painting: <><rect x="3" y="4" width="12" height="5" rx="1" {...P} /><path d="M15 6.5h3.5A1.5 1.5 0 0 1 20 8v2a1.5 1.5 0 0 1-1.5 1.5H12" {...P} /><path d="M12 11.5v3" {...P} /><rect x="10" y="14.5" width="4" height="6" rx="1" {...P} /></>,
  // Leaf and path, for the exterior
  curb: <><path d="M4 20c0-6 4-10 10-10h6c0 6-4 10-10 10H4Z" {...P} /><path d="M4 20c3-4 7-6 12-7" {...P} /></>,
  // Open box
  declutter: <><path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" {...P} /><path d="M3 8.5V16l9 4.5V13" {...P} /><path d="M21 8.5V16l-9 4.5" {...P} /></>,
  // Sofa
  staging: <><path d="M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" {...P} /><path d="M3 12a2 2 0 0 1 2 2v3h14v-3a2 2 0 0 1 2-2" {...P} /><path d="M5 17v2M19 17v2" {...P} /></>,
  // Floor planks in perspective
  flooring: <><path d="M3 20 8 6h8l5 14H3Z" {...P} /><path d="M6.2 14h11.6M7.4 10h9.2" {...P} /></>,
  // Spray bottle
  cleaning: <><path d="M9 8h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8Z" {...P} /><path d="M9 5h3v3H9z" {...P} /><path d="M12 5h4M16 3v4" {...P} /></>,
  // Wrench
  handyman: <><path d="M20 5.5a4.5 4.5 0 0 1-5.9 4.3L6 17.9a2 2 0 0 1-2.8-2.8l8.1-8.1A4.5 4.5 0 0 1 17.6 3l-2.8 2.8 1.9 1.9L19.5 5c.3.2.5.4.5.5Z" {...P} /></>,
  // Bolt
  electrical: <><path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" {...P} /></>,
  // Magnifier over a wall
  inspection: <><circle cx="11" cy="11" r="6" {...P} /><path d="m15.5 15.5 4.5 4.5" {...P} /><path d="M8.5 11h5M11 8.5v5" {...P} /></>,
};

export default function ServiceIcon({ name }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      {path}
    </svg>
  );
}
