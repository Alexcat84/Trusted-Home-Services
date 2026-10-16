/**
 * The projects page.
 *
 * PLACEHOLDER NARRATIVE. Every caption below is invented. They were written so
 * the client could see how a finished projects page reads, and the client knows
 * they are a mock. The photographs they sit under are not photographs of our
 * jobs either.
 *
 * None of this goes out as a claim about work we did. Before this page is
 * published anywhere public, each caption has to be replaced with the real
 * neighbourhood, the real scope and the real dates, and the photographs with
 * the crew's own before and after shots. A before and after says "we did this",
 * which is the one thing a mock must not be left saying.
 *
 * Order here is the order on the page.
 */

const BASE = '/images/projects';

export const PROJECT_KEYS = ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08'];

/** Both shots of one job, named off its key. */
export const PROJECT_IMAGES = PROJECT_KEYS.reduce((all, key, i) => {
  const n = String(i + 1).padStart(2, '0');
  all[key] = {
    before: `${BASE}/project-${n}-before.webp`,
    after: `${BASE}/project-${n}-after.webp`,
  };
  return all;
}, {});

const EN = {
  p01: {
    title: 'Main floor opened up and refinished',
    place: 'Westboro, Ottawa',
    text: 'A 1940s semi taken back to the studs. We opened the hallway, kept and refinished the original stairs, and laid white oak through the main floor. Eleven days on site, listed the week after.',
  },
  p02: {
    title: 'Unfinished basement turned into living space',
    place: 'Alta Vista, Ottawa',
    text: 'The joists were still open and the block walls bare. Framed, insulated, boarded and floored, it gave the family a second living room to show buyers instead of a storage cellar.',
  },
  p03: {
    title: 'Forty years of storage cleared and made neutral',
    place: 'Hintonburg, Ottawa',
    text: 'The room had not been empty since the owners moved in. Everything out, plaster patched, floors levelled and the whole space brought back to neutral so buyers could see the room and not the contents.',
  },
  p04: {
    title: 'Builder basement finished for the spring market',
    place: 'Barrhaven, Ottawa',
    text: 'Left unfinished when the house was built. Framing closed up, pot lights in, and broadloom down, matched to the rest of the house so it reads as one home rather than a house with a basement.',
  },
  p05: {
    title: 'Front room floors replaced, casings kept',
    place: 'The Glebe, Ottawa',
    text: 'The old floor came out in a morning. New white oak, fresh trim and paint throughout, and the original window casings saved and refinished because the owners asked us to keep them.',
  },
  p06: {
    title: 'Kitchen fitted from bare walls to handover',
    place: 'Kanata, Ottawa',
    text: 'Dust sheets, bare walls and a floor full of tools at the start. Cabinetry, counters, lighting and the arched niche the owners had drawn for us, finished and cleaned before the photographer arrived.',
  },
  p07: {
    title: 'Kitchen finished three days ahead of closing',
    place: 'Riverside South, Ottawa',
    text: 'A tight date and no room to move it. Dark cabinetry, a walnut island and a slatted ceiling, handed over with three days to spare so the family could move in on the day they had planned.',
  },
  p08: {
    title: 'Main bathroom rebuilt with the family in the house',
    place: 'Orléans, Ottawa',
    text: 'Gutted back to the studs and rebuilt around the family still living there. New vanity, mirror and fixtures, tiled and sealed, with the room usable again every evening.',
  },
};

const FR = {
  p01: {
    title: 'Rez-de-chaussée ouvert et refait',
    place: 'Westboro, Ottawa',
    text: 'Un jumelé des années 1940 ramené aux colombages. Nous avons ouvert le couloir, conservé et refait l’escalier d’origine et posé du chêne blanc sur tout l’étage. Onze jours de chantier, inscription la semaine suivante.',
  },
  p02: {
    title: 'Sous-sol non fini devenu pièce de vie',
    place: 'Alta Vista, Ottawa',
    text: 'Les solives étaient encore à nu et les blocs apparents. Charpente, isolation, gypse et plancher : la famille avait une deuxième pièce de vie à montrer plutôt qu’une cave de rangement.',
  },
  p03: {
    title: 'Quarante ans de rangement vidés et remis à neutre',
    place: 'Hintonburg, Ottawa',
    text: 'La pièce n’avait pas été vide depuis l’emménagement. Tout dehors, plâtre repris, planchers mis de niveau et espace ramené au neutre, pour qu’un acheteur voie la pièce et non son contenu.',
  },
  p04: {
    title: 'Sous-sol de constructeur fini pour le marché du printemps',
    place: 'Barrhaven, Ottawa',
    text: 'Laissé brut à la construction. Charpente fermée, encastrés posés et tapis installé, assortis au reste de la maison pour que l’ensemble se lise comme une seule maison.',
  },
  p05: {
    title: 'Planchers du salon remplacés, moulures conservées',
    place: 'Le Glebe, Ottawa',
    text: 'L’ancien plancher est sorti en une matinée. Chêne blanc neuf, moulures et peinture fraîches, et les encadrements de fenêtre d’origine sauvés et refaits, parce que les propriétaires voulaient les garder.',
  },
  p06: {
    title: 'Cuisine posée des murs nus à la remise des clés',
    place: 'Kanata, Ottawa',
    text: 'Toiles de protection, murs nus et outils au sol au départ. Armoires, comptoirs, éclairage et la niche en arche que les propriétaires nous avaient dessinée, terminés et nettoyés avant l’arrivée du photographe.',
  },
  p07: {
    title: 'Cuisine livrée trois jours avant la clôture',
    place: 'Riverside South, Ottawa',
    text: 'Une date serrée et impossible à déplacer. Armoires foncées, îlot en noyer et plafond à lattes, remis avec trois jours d’avance pour que la famille emménage le jour prévu.',
  },
  p08: {
    title: 'Salle de bain refaite avec la famille sur place',
    place: 'Orléans, Ottawa',
    text: 'Démolie jusqu’aux colombages et refaite autour d’une famille qui vivait là. Vanité, miroir et robinetterie neufs, carrelage et joints, et une pièce utilisable chaque soir.',
  },
};

const POR_IDIOMA = { en: EN, fr: FR };

/** The eight jobs, in page order, in the language asked for. */
export function getProjects(lang) {
  const textos = POR_IDIOMA[lang] || EN;
  return PROJECT_KEYS.map((key) => ({ key, ...textos[key], ...PROJECT_IMAGES[key] }));
}
