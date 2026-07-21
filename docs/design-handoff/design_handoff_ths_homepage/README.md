# Handoff: Trusted Home Services — Homepage redesign (batch 1)

## Overview
Three distinct homepage design directions for **Trusted Home Services**, a family-run
home-prep company in **Ottawa, Ontario**. One coordinator manages every trade to get a
property market-ready (to sell) or move-ready. The redesign must:

- Lead with the strongest differentiator: **no deposit — you pay when the work is complete** (even on projects up to $50,000).
- Surface **nine services**, including two new ones (**Electrical**, **Home Inspection**) that must be visible, not buried.
- Serve **two audiences**: homeowners selling, and realtors preparing listings.
- Reserve a **hero video slot** (a real before/after renovation reel, added later) that works both **16:9** and **9:16**.
- Be trilingual: **EN / FR / ES**.
- Use orange as a disciplined accent, not on every button.

Each direction is a different answer to: *what does the visitor see first, and how do they reach the nine services?*

---

## About the design files
The files in `prototypes/` are **design references built in HTML**, not production code to
copy line-for-line. They are "Design Component" (`.dc.html`) prototypes: an HTML template
plus a small logic class, rendered by the bundled `support.js` runtime. They exist to show
**intended look, layout, copy and behavior**.

**Your task:** recreate these designs in the target codebase's real environment. The current
production site is **React** (single-file `src/App.jsx` + `src/index.css`, i18n in
`src/translations.js`). Rebuild the chosen direction as idiomatic React components using the
project's existing conventions — do **not** ship the `.dc.html` files or the `support.js`
runtime. If you want to see them render, open any file in `prototypes/` in a browser (they
load `support.js` from the same folder).

### How to read a `.dc.html` file
- The markup between `<x-dc>…</x-dc>` is the **template**. `{{ x }}` are data holes;
  `<sc-for list="{{ items }}" as="item">` is a loop; `<sc-if value="{{ flag }}">` is a conditional.
- The `<script data-dc-script>` block at the bottom is the **logic class** (`class Component`):
  it holds state, data (services, testimonials, i18n), and handlers, and returns everything
  the template needs from `renderVals()`.
- All styling is **inline** on the elements. Media queries live in the single `<style>` block
  in `<helmet>` (keyed off `data-*` attributes) — that is the only CSS worth lifting wholesale.

---

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions are all intended
as shown. Recreate the UI faithfully using the codebase's libraries and patterns. Exact hex
values, font sizes and behaviors are documented below.

---

## Shared design tokens (all three directions)

### Colors
| Token | Hex | Use |
|---|---|---|
| Primary (navy) | `#0a233c` | Header, footer, dark sections, headings |
| Primary dark | `#081b30` | Footer, hover on navy |
| Navy panel alt | `#12324f` / `#14324f` | Video panel, gradient ends |
| Accent (orange) | `#F9772B` | CTAs, NEW badges, active states, one word of the H1 |
| Accent hover | `#e06a20` | Orange button hover |
| Accent tint (on navy) | `#ffb888` | Eyebrows/kickers on dark backgrounds |
| Text | `#21303f` / `#22303e` | Body text |
| Text muted | `#556575` / `#6a7684` / `#70808f` | Secondary text |
| Muted-on-navy | `#9fb0c2` / `#b9c7d6` / `#c3d0dd` | Text on navy |
| Success (form done) | `#1f9d55` on `#e7f6ee` | Quote success check |
| Live dot (Concierge) | `#2bb46e` | Pulsing "available" indicator |

**Backgrounds differ per direction** (the main way they feel distinct):
- **01 The Promise** — warm off-white `#f6f3ee`; cards `#fff`, borders `#eae3d7`/`#ece5da`; section band `#f0ebe2`.
- **02 The Transformation** — white `#fff`; light section `#f6f8fa`; borders `#e6e9ee`; hero on `#0a233c`.
- **03 The Concierge** — warm off-white `#f7f4ef`; cards `#fff`; borders `#ece5da`; trade detail panel gradient `#0a233c → #12324f`.

### Typography
- **Display / headings:** `Outfit` (Google Fonts), weights 400–800. Headings use 700–800, letter-spacing `-0.02em` to `-0.03em`.
- **Body:** `DM Sans` (Google Fonts), weights 400–700, line-height 1.6.
- **Mono (placeholder labels only):** `ui-monospace, monospace`.
- Font stack fallback: `system-ui, sans-serif`.
- H1: `clamp(2.3rem, ~5vw, 4.1rem)`, line-height ~1.0–1.05, weight 800.
- Section H2: `clamp(1.8rem, 3.2–3.4vw, 2.5–2.7rem)`, weight 800.
- Body: 1rem base; subheads `clamp(1.05rem, 1.5vw, 1.25rem)`.
- Eyebrow/kicker: 0.72–0.78rem, `letter-spacing: 0.13–0.16em`, `text-transform: uppercase`, weight 700.

### Spacing / radius / shadow
- Section vertical padding: `clamp(3rem, 6vw, 5rem)`; content max-width **1300–1340px**, side padding `1.75rem`.
- Radius: buttons/inputs `9–13px`; cards `16–20px`; pills `999px`.
- Card shadow (rest): `0 2px 16–20px rgba(10,35,60,0.05)`.
- Card shadow (hover): `0 18–22px 40–50px -18px rgba(10,35,60,0.3–0.35)`, lift `translateY(-3px)`.
- Video panel shadow: `0 30px 70px -20px rgba(10,35,60,0.5–0.6)`.
- Orange CTA shadow: `0 8px 20px rgba(249,119,43,0.28)`.

### Motion
- Reveal on load: `@keyframes …up` — `opacity 0 → 1`, `translateY(20px) → 0`, `.7s cubic-bezier(.2,.7,.3,1)`.
- Fades (menu/modal/testimonial): `.2s–.5s ease`.
- Concierge live dot: pulsing ring `2s infinite`.
- **All decorative motion must respect `prefers-reduced-motion: reduce`** (already wired: reveals/pulses disabled, content shown).

---

## The nine services (shared data)
Order and copy are consistent; each links to its own indexable page (`/services/<slug>`).

| Service | Slug | One-liner | New? |
|---|---|---|---|
| Painting & Coatings | `/services/painting` | Interior & exterior, done fast | |
| Curb Appeal | `/services/curb-appeal` | First impressions that sell | |
| Home Staging | `/services/staging` | Styled for listing photos | |
| Flooring | `/services/flooring` | Repair, refinish, replace | |
| Cleaning | `/services/cleaning` | Deep clean, move-out ready | |
| Handyman | `/services/handyman` | Drywall, trim, fixtures & more (absorbs old "Repairs & prep") | |
| Decluttering & Removal | `/services/decluttering` | Haul-away and reset | |
| **Electrical** | `/services/electrical` | Licensed fixes & upgrades | **NEW** |
| **Home Inspection** | `/services/inspection` | Know before you list | **NEW** |

The Concierge direction also carries a 4-bullet "what's included" list per service — see
`prototypes/03-the-concierge.dc.html` (the `ALL` array in the logic class) for exact copy.

NEW badge: text `NEW`, 0.58–0.62rem, weight 800, `letter-spacing 0.06em`, white on `#F9772B`, radius 4–5px, padding ~`0.12rem 0.4rem`.

---

## Screens / views

### Shared: Header (all directions)
- **Fixed** top bar, full width, `z-index 1000`, max-width 1300–1340px inner, padding `0.85rem 1.75rem`, min-height ~62px.
- **01/02:** navy background (`rgba(10,35,60,0.98)`), white text. **03:** translucent off-white (`rgba(247,244,239,0.94)` + `backdrop-filter: blur(10px)`), navy text, bottom border `#e8e1d5`.
- **Left:** logo lockup = orange triangle mark (CSS borders) + "Trusted Home" (Outfit 800) over "SERVICES · OTTAWA" (0.62rem, letter-spacing 0.34em). *(Production has a real logo image — swap it in.)*
- **Center/right nav:** Services (opens the direction's menu — see each), How We Work, For Realtors, Our Projects.
- **Right cluster:** EN/FR/ES segmented switcher (active = orange), phone `(613) 204-8000` (with tel: link; Concierge adds a pulsing green live dot), and an orange **Free Quote** button.
- **Responsive:** below ~1060–1080px the desktop nav + right cluster hide and a hamburger (44×44) shows, opening a full-screen navy drawer with the same links, the phone, and Free Quote.

### 01 — The Promise
- **Thesis:** the no-deposit promise is the headline; trust before features.
- **Hero:** two columns (`1.05fr / 0.95fr`). Left: eyebrow ("Ottawa · 500+ homes in 6 years"), H1 "You don't pay a cent **until the work is done.**" (last clause in orange), subhead, orange **Free Quote** + outlined phone button, and a 4-cell proof row (`500+` homes / `6 yrs` / `24 h` quote / `$0` deposit). Right: reserved **video poster** (aspect from `videoOrientation` prop, gradient navy, diagonal-stripe texture, mono label "BEFORE → AFTER · loop · muted", white circular play button) with an overlapping white testimonial card bottom-left.
- **No-deposit band:** full-width navy strip directly under the hero — "No deposit, ever." + explanation.
- **Services menu (nav → "Services"):** a panel drops from the header, split into two labeled groups — **Make it show-ready** (Painting, Curb Appeal, Staging, Flooring, Cleaning) and **Fix & verify** (Handyman, Decluttering, Electrical NEW, Home Inspection NEW), two columns of links each.
- **Services section:** the same two groups as two white cards; each row = icon tile + name (+NEW) + one-liner + arrow.
- **How we work:** 3 numbered steps on a `#f0ebe2` band.
- **Audiences:** two cards ("Selling your home" navy / "For realtors" white).
- **Testimonials:** navy section, single rotating quote (5.5s auto-advance) + dots.
- **Final CTA:** orange band. **Footer:** navy, brand + Services + Company columns + legal row.

### 02 — The Transformation
- **Thesis:** show the outcome first; the before/after video is the hero. This is the brief's literal three-column hero, executed cleanly.
- **Hero (on navy):** centered headline "See the before & after before you commit a dollar" + subhead, over a **three-column grid** (`0.85fr / 1.5fr / 0.85fr`):
  - **Left:** contact card — orange Free Quote, outlined phone, "Free quote within 24 hours"; plus a "No deposit, ever" seal card (orange-ringed shield).
  - **Center:** large **video poster**, orange circular play button, BEFORE / AFTER chips bottom corners, mono status label, aspect from `videoOrientation`.
  - **Right:** testimonials card (rotating quote + dots).
  - Below: a centered proof strip (`500+ / 6 yrs / 24 h / $0`) on a hairline divider.
- **Services menu (nav → "Services"):** full-width **mega-menu** — left: 3-column grid of the 7 standard services (icon tile + name + desc); right: an orange feature column promoting the two **NEW** trades + a "Get a free quote" button.
- **Services section:** 3-column grid of 9 image-placeholder cards (16:9 gradient + stripe texture + icon), NEW badge top-right.
- **How we work:** 3 cards with circular numbered badges on `#f6f8fa`.
- **Audiences / Final CTA (orange) / Footer:** as shared.

### 03 — The Concierge
- **Thesis:** one point of contact for every trade; the services list becomes the navigation.
- **Hero:** two columns (`1.1fr / 0.9fr`). Left: live-dot eyebrow, H1 "One number. Every trade **handled.**", subhead, a navy **phone block** ("Call us now" + big number) beside an orange "Get a free quote →" button, then a row: "🛡 No deposit — pay when it's done · **500+** homes in 6 years". Right: reserved **video poster** ("MEET THE CREW", play button).
- **Services menu (nav → "Services"):** a slim single-panel list — heading "One coordinator handles all of it" + all nine in a 3-column link grid (NEW badges inline).
- **The Trades Board (centerpiece):** on white, a two-pane interactive board (`0.85fr / 1.15fr`). Left: vertical list of nine trades (Electrical + Home Inspection pinned first with NEW), each a button with icon tile; the selected one is orange-outlined on a peach tint. Right: a navy detail panel that updates on select — icon, name, description, a "What's included" checklist (orange ✓), and two CTAs ("Get a quote for this" + "See full details →").
- **How we work:** "What one call sets in motion" — 3 numbered white cards.
- **Audiences / Testimonials (navy) / Final CTA (orange) / Footer:** as shared.

---

## Interactions & behavior
- **Services menu:** click the nav "Services" button to toggle the panel/mega-menu (Promise & Concierge = dropdown panel; Transformation = full-width mega-menu). `aria-expanded` reflects state. Opening the menu closes the mobile drawer.
- **Mobile drawer:** hamburger toggles a full-screen navy overlay; links close it on click.
- **Free Quote modal (all directions):** opens from any Free Quote / play / audience button. A floating, focus-region dialog (`role="dialog" aria-modal="true"`) over a blurred scrim.
  - **3 steps:** (1) role select (Homeowner / Realtor) + multi-select service chips; (2) property address, timeline, notes; (3) name, phone, email. Progress bar of 3 segments fills as you go.
  - **Continue / Back** navigate steps; **Send request** on step 3 shows a success state (green check, "We'll call you within 24 hours… No deposit required — ever.").
  - Closes on ✕, backdrop click, or **Escape**. Testimonial auto-rotation pauses while the modal is open.
- **Testimonial carousel:** auto-advances every 5.5s; dots jump directly. Four testimonials (copy in each file's `TESTI` array).
- **Language switcher:** EN/FR/ES set the active language; nav labels + Free Quote label (and, in Promise, the hero eyebrow/H1/subhead) re-render. **i18n is partial in the prototype** (nav + key hero strings). Production must translate all copy via `src/translations.js`.
- **Trades board (Concierge only):** clicking a trade on the left sets `trade` index; the right detail panel swaps content. Default selection = Electrical (index 0).
- **Hover:** nav links get a subtle bg; cards lift + deepen shadow; orange buttons darken to `#e06a20`; service rows tint.

## State
Per page (React equivalents): `lang` ('EN'|'FR'|'ES'), `servicesOpen`/`megaOpen` (bool), `navOpen` (bool, mobile drawer), `quoteOpen` (bool), `quoteStep` (1–3), `quoteDone` (bool), `role` (''|'homeowner'|'realtor'), `chips` (map of selected service names), `ti` (testimonial index, interval-driven), and — Concierge only — `trade` (active trade index).

No data fetching in the prototype. In production, the quote form should submit to the existing quote endpoint and feed the admin pipeline (the current app already has quote + realtor + partner submission flows and an admin table).

## Responsive behavior
- Content max-width 1300–1340px; fluid type via `clamp()`; grids use `fr` units + `gap`.
- **~1060–1080px:** desktop nav + header CTAs hide → hamburger + full-screen drawer.
- **~900–940px:** hero collapses to one column (video/center moves to top); services grids, audience cards, step grids and footer collapse to 1 column; Transformation service grid → 2 cols.
- **~560px:** proof row → 2 cols (Promise); service grid → 1 col (Transformation); H1 shrinks.
- Touch targets ≥ 44px (hamburger, drawer links, phone).

## Accessibility
- Keyboard: visible focus should be preserved on all controls; modal is `aria-modal` and closes on Escape (add a proper focus trap + return-focus in production).
- Language group uses `role="group"` + `aria-pressed`; menu toggles use `aria-expanded`.
- Color contrast: navy/white and orange/white combinations meet AA for the sizes used; keep orange text at ≥ the sizes shown.
- Respects `prefers-reduced-motion`.
- Every image placeholder is decorative; real photos need meaningful `alt`.

## Assets
- **No external images** in the prototypes (a strict CSP blocks them). Photo areas are CSS
  placeholders (navy gradient + diagonal-stripe texture + a mono label saying what belongs there).
  The client supplies real photos and the hero video later.
- **Icons** are emoji placeholders in the prototype (🎨 🌿 🛋 🪵 ✨ 🔧 📦 ⚡ 🔍). Replace with the
  codebase's real icon set.
- **Logo** is a CSS wordmark placeholder; production has a real logo image (`Logo v4.0 Inverted.jpg`).
- **Fonts:** Outfit + DM Sans via Google Fonts (already used by the live site).

## Files
```
prototypes/
  00-directions-hub.dc.html     Review hub: the 3 directions with thesis / menu / pros-cons
  01-the-promise.dc.html        Direction 1 — no-deposit-first, grouped services panel
  02-the-transformation.dc.html Direction 2 — video hero (3-col), mega-menu
  03-the-concierge.dc.html      Direction 3 — one-contact, interactive trades board
  support.js                    DC runtime (needed only to OPEN the prototypes in a browser; do not port)
```
Open any prototype in a browser to see it live. Resize to test responsive behavior; click
**Services** to see each menu solution; click **Free Quote** to run the multi-step modal.

## Notes for implementation
- This is **batch 1 of 2**: three more directions (Two Doors, The Directory, The Local) and a
  final comparison + recommendation are planned. Confirm the chosen direction before full build-out.
- Fix carried over from the current site: `styles.css` in the repo root is orphaned (the app
  imports `src/index.css`) — remove it to avoid palette confusion. The **real** palette is the
  one above (`--color-primary: #0a233c`), not the `#223151` in the old design doc.
- Optimize images before launch (the current `decluttering-removal.jpg` is 5.8 MB) — ship WebP/AVIF, sized.
