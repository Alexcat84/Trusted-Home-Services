# Handoff: Trusted Home Services — Homepage redesign (6 directions)

## Overview
Six distinct homepage design directions for **Trusted Home Services**, a family-run
home-prep company in **Ottawa, Ontario**. One coordinator manages every trade to get a
property market-ready (to sell) or move-ready. The redesign must:

- Lead with the strongest differentiator: **no deposit — you pay when the work is complete** (even on projects up to $50,000).
- Surface **nine services**, including two new ones (**Electrical**, **Home Inspection**) that must be visible, not buried.
- Serve **two audiences**: homeowners selling, and realtors preparing listings.
- Reserve a **hero video slot** (a real before/after renovation reel, added later) that works both **16:9** and **9:16**.
- Be trilingual: **EN / FR / ES**.
- Use orange as a disciplined accent, not on every button.

Each direction is a different thesis about what the visitor sees first and how they reach the nine services.

## What changed since the first handoff (verification fixes)
- **Files are kebab-case and the hub links are correct.** `00-directions-hub.dc.html` links to
  `01-…` through `06-…`; no more 404s. Keep this convention for any new pages.
- **Every quote trigger is wired, on every page.** Header (desktop + mobile drawer), hero,
  audience/door buttons, the closing CTA, and the trades-board button all open the same modal.
  Root cause of the earlier "dead buttons": in this DC runtime a bare `{{ method }}` event hole
  binds unreliably; all handlers are now returned from `renderVals()`, which binds deterministically.
- **The quote modal now traps focus** (see Interactions): focus moves in on open, `Tab`/`Shift+Tab`
  cycle inside, the rest of the page is `aria-hidden`, and focus returns to the trigger on close.
- **Concierge "Get a quote for this"** pre-selects the active trade's chip in the modal.

## About the design files
The files in `prototypes/` are **design references built in HTML**, not production code to copy
line-for-line. They are "Design Component" (`.dc.html`) prototypes: an HTML template plus a small
logic class, rendered by the bundled `support.js` runtime. They show intended look, layout, copy
and behavior.

**Your task:** recreate the chosen direction in the target codebase's real environment. The current
production site is **React** (single-file `src/App.jsx` + `src/index.css`, i18n in `src/translations.js`).
Rebuild as idiomatic React components using the project's conventions — do **not** ship the `.dc.html`
files or `support.js`. To view a prototype, open it in a browser (it loads `support.js` from the same folder).

### How to read a `.dc.html` file
- Markup between `<x-dc>…</x-dc>` is the **template**. `{{ x }}` = data hole; `<sc-for list="{{ items }}" as="item">` = loop; `<sc-if value="{{ flag }}">` = conditional.
- The `<script data-dc-script>` block is the **logic class** (`class Component`): state, data (services, testimonials, i18n), handlers; `renderVals()` returns everything the template reads.
- Styling is **inline**. Media queries live in the one `<style>` block in `<helmet>`, keyed off `data-*` attributes — that's the only CSS worth lifting wholesale.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions are intended as shown.
Exact values below.

---

## Shared design tokens

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
| Success | `#1f9d55` on `#e7f6ee` | Quote success check |
| Live dot (Concierge) | `#2bb46e` | Pulsing "available" indicator |

Backgrounds differ per direction (the main way they feel distinct):
- **01 Promise** & **06 Local**: warm off-white `#f6f3ee` / `#f7f4ef`; borders `#eae3d7`/`#ece5da`.
- **02 Transformation**, **04 Two Doors**, **05 Sequence**: white `#fff`; light band `#f6f8fa`; borders `#e6e9ee`; navy hero (02).
- **03 Concierge**: warm off-white `#f7f4ef`; trades-detail panel gradient `#0a233c → #12324f`.

### Typography
- **Headings:** `Outfit` (Google Fonts), 700–800, letter-spacing `-0.02em`…`-0.03em`.
- **Body:** `DM Sans` (Google Fonts), 400–700, line-height 1.6.
- **Mono (placeholder labels only):** `ui-monospace, monospace`.
- H1 `clamp(2rem, ~5vw, 4.1rem)` weight 800; section H2 `clamp(1.7rem, 3vw, 2.7rem)` weight 800.
- Eyebrow/kicker: 0.72–0.78rem, `letter-spacing 0.13–0.16em`, uppercase, 700.

### Spacing / radius / shadow / motion
- Section padding `clamp(3rem, 6vw, 5rem)`; content max-width **1300–1340px**; side padding `1.75rem`.
- Radius: buttons/inputs `9–13px`; cards `14–20px`; pills `999px`.
- Card shadow rest `0 2px 16–20px rgba(10,35,60,0.05)`; hover `0 16–22px 40–50px -18px rgba(10,35,60,.3)`, lift `translateY(-3px)`.
- Video panel shadow `0 30px 70px -20px rgba(10,35,60,.5–.6)`; orange CTA shadow `0 8px 20px rgba(249,119,43,.28)`.
- Reveal-on-load: opacity 0→1 + `translateY(20px)→0`, `.7s cubic-bezier(.2,.7,.3,1)`. **All decorative motion respects `prefers-reduced-motion: reduce`** (already wired).

### The nine services (shared)
Each links to its own indexable page (`/services/<slug>`).

| Service | Slug | New? |
|---|---|---|
| Painting & Coatings | `/services/painting` | |
| Curb Appeal | `/services/curb-appeal` | |
| Home Staging | `/services/staging` | |
| Flooring | `/services/flooring` | |
| Cleaning | `/services/cleaning` | |
| Handyman (absorbs the old "Repairs & prep") | `/services/handyman` | |
| Decluttering & Removal | `/services/decluttering` | |
| **Electrical** | `/services/electrical` | **NEW** |
| **Home Inspection** | `/services/inspection` | **NEW** |

NEW badge: `NEW`, 0.56–0.62rem, weight 800, letter-spacing 0.06em, white on `#F9772B`, radius 4–5px.
Per-direction service copy (benefit lines, "what's included" bullets, phase blurbs) lives in each file's logic-class data arrays — lift the exact strings from there.

---

## The six directions

### 00 — Directions hub (`00-directions-hub.dc.html`)
Review page only (not a public page): the six directions as cards with thesis / menu / pros-cons,
a comparison table, and the recommendation. Not for production.

### 01 — The Promise
- **Thesis:** the no-deposit promise is the headline; trust before features.
- **Hero:** two columns (`1.05fr/0.95fr`). Left: eyebrow, H1 "You don't pay a cent **until the work is done.**", subhead, orange Free Quote + outlined phone, 4-cell proof row (`500+ / 6 yrs / 24 h / $0`). Right: reserved video poster (aspect from `videoOrientation` prop) + overlapping white testimonial card.
- **No-deposit band** directly under the hero (navy).
- **Menu (nav → Services):** dropdown panel split into **Make it show-ready** vs. **Fix & verify**.
- Services (two-group cards) → How we work (3 steps, `#f0ebe2`) → audiences (navy/white) → testimonials (navy carousel) → orange CTA → footer.

### 02 — The Transformation
- **Thesis:** show the outcome first; before/after video is the hero (the brief's 3-column layout, clean).
- **Hero (navy):** centered headline + subhead over a **3-col grid** (`0.85/1.5/0.85`): left contact card (Free Quote, phone, "No deposit" seal), center large **video poster** (orange play, BEFORE/AFTER chips), right testimonials card; proof strip below.
- **Menu (nav → Services):** full-width **mega-menu** — 3-col tiles of the 7 standard services + an orange feature column promoting the two NEW trades.
- Services grid (9 image-placeholder cards) → How we work (numbered cards, `#f6f8fa`) → audiences → orange CTA → footer.

### 03 — The Concierge
- **Thesis:** one point of contact; the services list becomes the navigation.
- **Hero:** two columns. Left: live-dot eyebrow, H1 "One number. Every trade **handled.**", navy phone block + orange "Get a free quote →", "No deposit · 500+ homes" row. Right: reserved video poster ("MEET THE CREW").
- **Menu (nav → Services):** slim single-panel list of all nine (NEW inline).
- **Trades board (centerpiece):** two panes (`0.85/1.15`). Left: 9 trade buttons (Electrical + Home Inspection pinned first, NEW). Right: navy detail panel that swaps on select — icon, name, "What's included" checklist, "Get a quote for this" (pre-selects that trade's chip) + "See full details →".
- How we work → audiences → testimonials (navy) → orange CTA → footer.

### 04 — Two Doors
- **Thesis:** fork the two audiences at the door; the page then reframes copy + services for who you are.
- **Hero:** short headline "Two ways in. One team behind both." over **two door cards** — "Selling your home?" (navy) and "For realtors" (warm white) — each with checklist + CTA (the CTA pre-selects that role in the quote form).
- **Menu (nav → Services) + services section:** an **audience-segmented list** — a Homeowners / Realtors toggle reframes each service's one-liner (and the section heading, how-it-works copy, and testimonials) to that reader.
- Video/proof band (reserved video + stats) → how we work → testimonials → orange CTA → footer.

### 05 — The Sequence
- **Thesis:** the site is a prep timeline, day 1 to sold.
- **Hero:** two columns. Left: H1 "From day one to **sold.**", subhead, "Start my plan — free quote" + phone, no-deposit line. Right: reserved video poster ("DAY 1 → SOLD").
- **Menu (nav → Services) + Roadmap section:** a **chronological roadmap** — a horizontal 4-phase rail (Assess → Repair → Refresh → Present) ending in a SOLD flag; clicking a phase reveals its services (with day-ranges) below. The nine services are distributed across the four phases. The nav panel mirrors this as four chronological columns.
- Audiences (realtor angle: "list in days, not weeks") → testimonials (navy) → orange CTA → footer.

### 06 — The Local
- **Thesis:** trust by proximity — Ottawa neighbourhoods and local proof carry the page.
- **Hero:** two columns. Left: H1 "The home-prep team already on **your street.**", subhead, Free Quote + phone, no-deposit line. Right: reserved video poster ("OTTAWA JOB").
- **Local section:** a **service-area map placeholder** (CSS grid + pins for Kanata, Barrhaven, Westboro, Orléans, etc. — client supplies the real map) beside recent-work example cards + a stats bar. *(Example results are illustrative placeholders — client to replace with real photos/addresses; a caption says so.)*
- **Menu (nav → Services) + directory section:** a **searchable services directory** — a text input filters the nine live as you type; "no match" prompts a call.
- How we work → audiences → testimonials (navy) → orange CTA → footer.

---

## Menu solutions (each direction resolves the 9-service menu differently)
1. **Promise** — grouped 2-job dropdown panel.
2. **Transformation** — full-width visual mega-menu + promoted NEW column.
3. **Concierge** — interactive two-pane trades board.
4. **Two Doors** — audience-segmented list (Homeowners/Realtors toggle).
5. **Sequence** — chronological roadmap by prep phase.
6. **Local** — searchable directory (type-to-filter).

## Shared: Header
Fixed top bar, `z-index 1000`, inner max-width 1300–1340px, padding `0.85rem 1.75rem`. Navy
(`rgba(10,35,60,0.98)`) with white text on 01/02/04/05; translucent off-white + `backdrop-filter: blur(10px)`
with navy text on 03/06. Left: orange-triangle mark + "Trusted Home / SERVICES · OTTAWA" wordmark
*(production has a real logo image — swap it in)*. Nav: Services (per-direction menu), plus How We Work /
For Realtors / Our Projects (order varies). Right: EN/FR/ES segmented switcher (active = orange), phone
`(613) 204-8000` (tel: link), orange **Free Quote**. Below ~1060–1080px the desktop nav + right cluster
collapse to a hamburger opening a full-screen navy drawer (same links + phone + Free Quote).

## Interactions & behavior
- **Services menu:** click the nav "Services" to toggle the panel/mega-menu/board/directory for that
  direction. `aria-expanded` reflects state; opening it closes the mobile drawer.
- **Mobile drawer:** hamburger toggles a full-screen overlay; links close on click.
- **Free Quote modal (all directions, all triggers):** `role="dialog" aria-modal="true"` over a blurred scrim.
  3 steps — (1) role select + multi-select service chips; (2) address/timeline/notes; (3) name/phone/email;
  progress bar fills; **Continue/Back** navigate; **Send request** → success state. Closes on ✕, backdrop,
  or **Escape**. **Focus is trapped**: on open focus moves to the first control, `Tab`/`Shift+Tab` cycle
  within, `<header>` and `<main>` get `aria-hidden="true"`, and on close focus returns to the trigger.
  Testimonial auto-rotation pauses while open.
  - **Two Doors:** the door CTAs pre-select role (homeowner/realtor). **Concierge:** "Get a quote for this" pre-selects the active trade's chip.
- **Testimonial carousel:** auto-advances every 5.5s; dots jump. (Two Doors filters testimonials by the current audience.)
- **Language switcher:** EN/FR/ES set the active language; nav labels + Free Quote label (and, on Promise, the hero eyebrow/H1/subhead) re-render.
- **Hover:** nav bg tint; cards lift + shadow; orange darkens to `#e06a20`; service rows tint.

## Deliberately NOT fully wired (be honest in production)
- **Hero play button:** opens the quote modal as a stand-in, since there is no video yet. When the real
  looping muted `<video>` (with a poster fallback) exists, wire the play button to it and keep the quote
  CTAs separate. Until then this is intentional, not a bug.
- **i18n is partial in the prototype:** the switcher translates nav + Free Quote (+ hero strings on
  Promise); section bodies stay English. Production must translate all copy via `src/translations.js`.
- **Quote form:** no validation or submission — steps advance freely and "Send request" always succeeds.
  Wire to the existing quote endpoint + admin pipeline in production, with per-step validation.
- **Local (06) results/map:** placeholder examples and a CSS map stand-in; client supplies real data.

## State (per page; React equivalents)
`lang`, `servicesOpen`/`megaOpen`, `navOpen`, `quoteOpen`, `quoteStep` (1–3), `quoteDone`, `role`,
`chips` (selected service names), `ti` (testimonial index), plus per-direction: `trade` (Concierge active
trade), `aud` (Two Doors audience), `phase` (Sequence roadmap phase), `q` (Local search query).
No data fetching in the prototype.

## Responsive
Content max-width 1300–1340px; fluid type via `clamp()`; `fr` grids + `gap`. ~1060–1080px: nav + header
CTAs → hamburger/drawer. ~900–940px: hero → 1 column (video/center moves up), service grids / audience /
step / footer grids → 1 col; the Sequence rail scrolls horizontally; the Local map/directory stack.
~560px: tighter service grids; H1 shrinks. Touch targets ≥ 44px.

## Accessibility
Visible keyboard focus; modal is `aria-modal`, focus-trapped, Escape-closable, returns focus, and
`aria-hidden`s the rest of the page. Language group uses `role="group"` + `aria-pressed`; menu toggles use
`aria-expanded`. Navy/white and orange/white combos meet AA at the sizes used. Respects
`prefers-reduced-motion`. Image placeholders are decorative; real photos need meaningful `alt`.

## Assets
- **No external images** (strict CSP): photo/video areas are CSS placeholders (navy gradient + diagonal-stripe
  texture + mono label). Client supplies real photos and the hero video.
- **Icons** are emoji placeholders (🎨 🌿 🛋 🪵 ✨ 🔧 📦 ⚡ 🔍) — replace with the codebase's icon set.
- **Logo** is a CSS wordmark; production has a real logo image.
- **Fonts:** Outfit + DM Sans via Google Fonts (already used by the live site).

## Files
```
prototypes/
  00-directions-hub.dc.html      Review hub (cards + comparison table + recommendation) — not a production page
  01-the-promise.dc.html         No-deposit-first, grouped services panel
  02-the-transformation.dc.html  Video hero (3-col), mega-menu
  03-the-concierge.dc.html       One-contact, interactive trades board
  04-two-doors.dc.html           Audience fork, audience-segmented services
  05-the-sequence.dc.html        Day-1-to-sold roadmap menu
  06-the-local.dc.html           Ottawa proof + searchable directory
  support.js                     DC runtime (only needed to OPEN the prototypes; do not port)
```
Open any prototype in a browser; resize for responsive; click **Services** for each menu; click any
**Free Quote** to run the modal.

## Recommendation (from the hub)
Lead with **The Promise** (no-deposit headline — the strongest, least template-like opening, and it
doesn't depend on an asset that doesn't exist yet), then borrow: **The Transformation**'s 3-column video
hero as the section below the fold; **The Concierge**'s trades board as the `/services` index; **The
Sequence**'s roadmap as the How-We-Work page; **Two Doors**' audience toggle for the services section; and
**The Local**'s neighbourhood proof as a trust band. If the priority is "show the work immediately," swap
the lead to **The Transformation** with the same borrowed parts.

## Carry-over fixes from the current site
- `styles.css` in the repo root is orphaned (the app imports `src/index.css`) — remove it.
- Real palette is `--color-primary: #0a233c` (not the `#223151` in the old design doc).
- Optimize images before launch (the current `decluttering-removal.jpg` is 5.8 MB) — ship WebP/AVIF, sized.
