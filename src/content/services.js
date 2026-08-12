/**
 * Service catalogue: one entry per dedicated service page.
 *
 * Copy is original. It was informed by researching how this market describes the
 * same trades, then written from scratch for this business. Nothing is lifted
 * from any competitor, and no competitor is named.
 *
 * Order here is the order shown in the navigation menu.
 */

export const SERVICE_KEYS = [
  'painting',
  'curb',
  'declutter',
  'staging',
  'flooring',
  'cleaning',
  'handyman',
  'electrical',
  'inspection',
];

/** Slug used in the URL: /services/<slug>. Shared across languages so a link works in any locale. */
export const SERVICE_SLUGS = {
  painting: 'painting',
  curb: 'curb-appeal',
  declutter: 'decluttering',
  staging: 'home-staging',
  flooring: 'flooring',
  cleaning: 'cleaning',
  handyman: 'handyman',
  electrical: 'electrical',
  inspection: 'home-inspection',
};

export const SERVICE_IMAGES = {
  painting: '/images/roller painting.jpeg',
  curb: '/images/curb-appeal.avif',
  declutter: '/images/decluttering-removal.jpg',
  staging: '/images/staging-organizing.jpg',
  flooring: '/images/flooring.jpg',
  cleaning: '/images/cleaning services 1.png',
  handyman: '/images/handyman.jpg',
  electrical: '/images/electrical-work.webp',
  inspection: '/images/home-inspection.webp',
};

const EN = {
  painting: {
    name: 'Painting & Coatings',
    tagline: 'Interior, exterior, epoxy floors and cabinet refinishing.',
    metaTitle: 'House Painting Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Interior and exterior painting in Ottawa for homes going on the market or being moved into. No deposit. You pay when the work is complete.',
    intro:
      'Paint is the cheapest way to make a house feel cared for. We prepare the surfaces properly, work in colours that photograph well and read as neutral to buyers, and leave the site clean at the end of every day.',
    includes: [
      'Interior walls in buyer friendly, neutral colours',
      'Ceilings scraped, skim coated or re-stippled where they are stained or dated',
      'Trim, doors, baseboards and railings refinished',
      'Drywall and plaster repaired before any paint goes on',
      'Exterior siding, trim, soffits and the front door',
      'Epoxy coating for garage and basement floors',
    ],
    benefits: [
      { title: 'Buyers see a finished home', text: 'Scuffs, patched holes and yellowed ceilings all read as deferred maintenance. Fresh paint removes that objection before anyone raises it.' },
      { title: 'Listing photos come out brighter', text: 'Neutral walls bounce light instead of absorbing it, so rooms look larger and truer to size in photographs.' },
      { title: 'One crew, one schedule', text: 'Prep, paint and cleanup are handled by the same team, so nothing waits on a subcontractor who is booked elsewhere.' },
    ],
    faq: [
      { q: 'How long does a typical interior take?', a: 'Most main floors are done in two to four days depending on ceiling work and how much repair is needed first. We give you the schedule in writing with the quote.' },
      { q: 'Do you help choose the colours?', a: 'Yes. We suggest shades that photograph well and appeal to the widest range of buyers, and we can match what is already there if you only need part of the house done.' },
    ],
  },
  curb: {
    name: 'Curb Appeal',
    tagline: 'Lawn, power washing, fence and porch touch-ups.',
    metaTitle: 'Curb Appeal Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Exterior clean up, landscaping and entry repairs in Ottawa so your property makes a strong first impression. Free quote within 24 hours.',
    intro:
      'Plenty of buyers decide how they feel about a house before they get out of the car. We tidy the exterior so the first photograph and the first drive past both work in your favour.',
    includes: [
      'Grass cut, shrubs trimmed and trees pruned back',
      'Weeds pulled, fresh mulch laid and seasonal planting at the entry',
      'Decks, patios, walkways and driveways pressure washed',
      'Exterior paint touch ups on trim, railings and the front door',
      'Outdoor lighting, house numbers and mailbox repaired or replaced',
      'Gutters cleared and drainage checked away from the foundation',
    ],
    benefits: [
      { title: 'The first photo does more work', text: 'The exterior shot is what people scroll past or stop on. A tidy front is the difference between a click and a scroll.' },
      { title: 'It signals the rest of the house', text: 'Buyers read a neglected yard as a warning about what they cannot see. A cared for exterior sets a different expectation at the door.' },
      { title: 'Quick to do, quick to show', text: 'Most exterior work is finished in a few days, which makes it the easiest thing to fix when a listing date is already set.' },
    ],
    faq: [
      { q: 'Can you do this in the winter?', a: 'Some of it. Pressure washing and planting wait for the season, but lighting, entry repairs, paint touch ups on sheltered areas and general clean up carry on year round in Ottawa.' },
      { q: 'Do you handle larger landscaping?', a: 'We handle tune up work: trimming, mulch, small plantings and repairs. For a full landscape rebuild we will tell you honestly that it is outside what we do.' },
    ],
  },
  declutter: {
    name: 'Decluttering & Removal',
    tagline: 'Clear-out and final disposition so the property is ready to show.',
    metaTitle: 'Decluttering and Junk Removal in Ottawa | Trusted Home Services',
    metaDescription:
      'Room by room clear out, donation runs and junk removal in Ottawa. We empty the house so painters, cleaners and photographers can do their work.',
    intro:
      'This is the first job on almost every property we prepare. Nothing else can start properly while the rooms are still full, and nothing else changes how large a house feels quite as fast.',
    includes: [
      'Room by room sort into keep, donate, sell and discard',
      'Donation runs to local charities, with receipts where they are offered',
      'Junk hauled away and recycled wherever the material allows',
      'Furniture taken apart and carried out without marking the walls',
      'Paint, chemicals, batteries and electronics taken to proper disposal',
      'Bin delivery and pickup coordinated for larger clear outs',
    ],
    benefits: [
      { title: 'Rooms read at their real size', text: 'Clutter shrinks a space in person and even more in a photograph. Empty floor and clear surfaces are the cheapest square footage you will ever gain.' },
      { title: 'Every other trade moves faster', text: 'Painters, floor installers and cleaners all need clear access. Doing this first keeps the rest of the schedule from slipping.' },
      { title: 'Your move starts early', text: 'Whatever leaves now is something you do not pack, move or pay to store later.' },
    ],
    faq: [
      { q: 'What happens to things we do not want?', a: 'Usable items go to local charities and we bring back receipts where they are issued. The rest is sorted for recycling before anything goes to disposal.' },
      { q: 'Can you work on an estate or a full downsize?', a: 'Yes. These are often emotional jobs, and we work at whatever pace the family needs, setting aside anything that has to be reviewed before it leaves the house.' },
    ],
  },
  staging: {
    name: 'Home Staging',
    tagline: 'Prepare every room so buyers see the potential.',
    metaTitle: 'Home Staging Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Room by room staging in Ottawa using what you already own where possible. We prepare the house so buyers can picture themselves living in it.',
    intro:
      'The way a family lives in a house is rarely the way it sells best. Staging is about editing what is already there so a stranger walking through can imagine their own life in the space.',
    includes: [
      'A room by room plan before anything is moved',
      'Furniture rearranged, using what you already own wherever it works',
      'Accessories, lamps and textiles added where a room feels bare',
      'Empty rooms given enough furniture to read as a bedroom, office or dining room',
      'Closets and storage edited, because buyers open every door',
      'A final pass on the day of photography',
    ],
    benefits: [
      { title: 'Buyers stop measuring and start imagining', text: 'A staged room gives people something to picture themselves in. An empty or crowded one leaves them doing arithmetic instead.' },
      { title: 'Every room gets a purpose', text: 'The spare room that has become storage reads as wasted space on a floor plan. Given a use, it counts.' },
      { title: 'It shows up in the photos', text: 'Most buyers see your house on a screen first. Staging is done for that screen as much as for the open house.' },
    ],
    faq: [
      { q: 'Do we have to rent furniture?', a: 'Usually not. We start with what you own and only bring pieces in when a room is empty or when something is genuinely working against the sale.' },
      { q: 'Can you stage a house we still live in?', a: 'Yes, and most of our staging is exactly that. We work around daily life and keep the house liveable between showings.' },
    ],
  },
  flooring: {
    name: 'Flooring',
    tagline: 'Supply and installation for a fresh, market-ready look.',
    metaTitle: 'Flooring Installation in Ottawa | Trusted Home Services',
    metaDescription:
      'Vinyl, laminate, hardwood refinishing and tile installation in Ottawa. Supply and install with no deposit required.',
    intro:
      'Worn flooring is one of the first things a buyer prices out in their head, and they always price it higher than it costs. Replacing or refinishing it removes that number from the negotiation.',
    includes: [
      'Luxury vinyl plank, often installed straight over the existing floor',
      'Hardwood sanded and refinished, including darker stains that even out old marks',
      'Laminate with acoustic underlay, which condo rules usually require',
      'Ceramic and porcelain tile for entries, kitchens and bathrooms',
      'Carpet tile for basements and secondary rooms',
      'Garage and utility floors patched and coated',
    ],
    benefits: [
      { title: 'It removes a bargaining chip', text: 'A buyer who sees worn floors deducts far more than the work costs. New flooring takes that conversation off the table.' },
      { title: 'It carries the whole room', text: 'Floors run through every photo of a room. Fresh flooring lifts the paint, the light and the furniture along with it.' },
      { title: 'Often faster than expected', text: 'Vinyl and laminate can frequently go over what is already down, which cuts both the cost and the days on site.' },
    ],
    faq: [
      { q: 'Do we have to remove the old floor?', a: 'Not always. Vinyl and laminate can often be laid over a sound existing floor. We check the subfloor first and tell you which way is better in your case.' },
      { q: 'Can hardwood be saved instead of replaced?', a: 'Often yes. If there is enough thickness left, sanding and refinishing costs less than replacement and usually looks better than a new floating floor.' },
    ],
  },
  cleaning: {
    name: 'Cleaning',
    tagline: 'Pre-listing, deep cleaning, post-sale and turnover.',
    metaTitle: 'Deep Cleaning Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Pre-listing deep cleaning, move in and move out cleaning and odour treatment in Ottawa. We leave the property ready to photograph.',
    intro:
      'A clean house does not get commented on, and that is the point. What buyers notice is the opposite, and it is usually the first thing they mention to their agent in the car afterwards.',
    includes: [
      'Full deep clean from ceiling fixtures down to baseboards',
      'Kitchens degreased, including inside the appliances and range hood',
      'Bathrooms descaled, with grout and glass brought back',
      'Windows, tracks and sills cleaned inside and out',
      'Carpet and upholstery cleaned where they can be saved',
      'Odour treatment for smoke, pets and cooking, at the source rather than covered up',
      'Post construction dust removal after renovation work',
    ],
    benefits: [
      { title: 'Smell decides more than people admit', text: 'A buyer may not be able to name what is wrong, but they leave faster. Treating odour at the source is not something paint can do for you.' },
      { title: 'Clean reads as maintained', text: 'People assume a spotless house has been looked after in the ways they cannot see. It is a small job that changes a large impression.' },
      { title: 'It is the last thing done', text: 'We clean after the trades finish, so the house is photograph ready on the day rather than dusty from the work that improved it.' },
    ],
    faq: [
      { q: 'When should the cleaning happen?', a: 'After every other trade is finished and before photography. Cleaning first and renovating second only means paying to clean twice.' },
      { q: 'Can you remove smoke or pet odour for good?', a: 'In most cases yes, by treating the surfaces and the air rather than masking it. If something is beyond treatment, such as saturated carpet or underlay, we will tell you it needs to come out.' },
    ],
  },
  handyman: {
    name: 'Handyman',
    tagline: 'Drywall, caulking, carpentry, fixtures and the small fixes that add up.',
    metaTitle: 'Handyman Repairs in Ottawa | Trusted Home Services',
    metaDescription:
      'Drywall, caulking, minor carpentry, fixtures and general repairs in Ottawa. One trusted crew for the whole punch list, with no deposit.',
    intro:
      'Every house has a list: the door that sticks, the cracked caulking, the cupboard that hangs crooked. Individually none of it matters. Together it is what makes a buyer wonder what else was left undone.',
    includes: [
      'Drywall patched, plastered and sanded ready for paint',
      'Caulking renewed around tubs, sinks, counters and windows',
      'Doors adjusted so they close properly, with new hinges and handles',
      'Cabinet doors and drawers realigned, hardware replaced',
      'Light fixtures, taps, towel bars and blinds swapped out',
      'Trim, baseboards and shelving installed or repaired',
      'Deck boards, railings and gates made safe and solid',
    ],
    benefits: [
      { title: 'The punch list stops being yours', text: 'Instead of chasing several trades for an afternoon of work each, the whole list goes to one crew on one visit.' },
      { title: 'Small faults raise big questions', text: 'A buyer who finds three little things starts hunting for a fourth. Clearing them keeps attention on the house itself.' },
      { title: 'It protects the inspection', text: 'Many of the items that end up on an inspection report are exactly this kind of work, and they are far cheaper to fix before the report than after it.' },
    ],
    faq: [
      { q: 'Is there a minimum job size?', a: 'No. We quote a fixed price for a defined list, or work by the hour for a punch list, whichever ends up better value for you.' },
      { q: 'What used to be listed as repairs and preparation?', a: 'That work now lives here. Drywall, caulking, minor carpentry and fixtures are all part of this service, so there is one place to look instead of two.' },
    ],
  },
  electrical: {
    name: 'Electrical',
    tagline: 'Electrical work, from fixtures to a pre-listing safety check.',
    metaTitle: 'Electrical Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Electrical work in Ottawa: fixtures, outlets, GFCI protection, panel labelling and pre-listing safety checks. Permits arranged where the job requires them.',
    intro:
      'Electrical is the part of a house nobody thinks about until an inspector writes it down. We handle the work properly, with permits where the job calls for one, so it holds up under scrutiny.',
    includes: [
      'Light fixtures, ceiling fans and pot lights supplied and installed',
      'Switches, outlets and dimmers replaced, including USB outlets',
      'GFCI protection added in kitchens, bathrooms and outdoors',
      'Panel labelled correctly, with breaker work and minor upgrades',
      'Knob and tube or aluminum wiring assessed and quoted honestly',
      'Smoke and carbon monoxide alarms brought up to current requirements',
      'Exterior, garage and landscape lighting',
      'A pre-listing check so nothing electrical surprises you later',
    ],
    benefits: [
      { title: 'It clears the inspection early', text: 'Electrical findings frighten buyers more than almost anything else on a report. Handling them beforehand keeps them out of the negotiation.' },
      { title: 'Work you can document', text: 'The job is permitted and inspected where that is required, so you have paperwork to hand over rather than something to explain.' },
      { title: 'Lighting changes how rooms feel', text: 'Dim or dated fixtures make good rooms photograph badly. New lighting is one of the cheapest improvements per dollar in the whole house.' },
    ],
    faq: [
      { q: 'Do you take care of permits?', a: 'Yes. Where the work calls for a permit and an inspection, we arrange both through the proper authority so the job ends up on record.' },
      { q: 'We have knob and tube wiring. Now what?', a: 'We assess it and give you a straight answer about what insurers and buyers will expect. Sometimes it is a contained fix, sometimes it is a larger project, and you should know which before you list.' },
    ],
  },
  inspection: {
    name: 'Home Inspection',
    tagline: 'Know what a buyer will find, before they find it.',
    metaTitle: 'Pre-Listing Home Inspection in Ottawa | Trusted Home Services',
    metaDescription:
      'Pre-listing home inspection in Ottawa with a written photo report. Find the problems before a buyer does and decide what to fix on your own terms.',
    intro:
      'Most sellers meet an inspection report at the worst possible moment: after an offer, with a buyer holding the findings. Doing it first turns the same information into something you control.',
    includes: [
      'Roof, exterior cladding, windows and drainage away from the house',
      'Foundation, structure and visible signs of movement',
      'Electrical panel, wiring and outlet condition',
      'Plumbing supply and drainage, fixtures and water heater',
      'Furnace, air conditioning and ventilation',
      'Attic insulation, ventilation and any evidence of moisture',
      'Basement checked for water entry and dampness',
      'A written report with photographs, in plain language',
    ],
    benefits: [
      { title: 'No surprises after the offer', text: 'A finding you already knew about is a line item. The same finding discovered by a buyer becomes a price reduction and a reason to hesitate.' },
      { title: 'You choose what to fix', text: 'With the report in hand before listing, you decide what is worth repairing and what is better disclosed and priced in.' },
      { title: 'It becomes a selling point', text: 'Handing a buyer a recent inspection and the receipts for what was corrected removes doubt at exactly the moment they are deciding.' },
    ],
    faq: [
      { q: 'Why inspect before listing instead of letting the buyer do it?', a: 'Because the timing changes everything. Before listing it is a to do list you control. After an offer it is leverage in someone else’s hands.' },
      { q: 'Do we have to fix everything it finds?', a: 'No. Some items are worth repairing, some are better disclosed and reflected in the price. The point is to make that a decision rather than an ambush.' },
    ],
  },
};

const FR = {
  painting: {
    name: 'Peinture et revêtements',
    tagline: 'Intérieur, extérieur, planchers époxy et armoires refinies.',
    metaTitle: 'Services de peinture résidentielle à Ottawa | Trusted Home Services',
    metaDescription:
      'Peinture intérieure et extérieure à Ottawa pour les maisons mises en vente ou prêtes à habiter. Aucun acompte. Vous payez à la fin des travaux.',
    intro:
      'La peinture est la façon la moins chère de montrer qu’une maison a été entretenue. Nous préparons les surfaces comme il faut, choisissons des teintes qui photographient bien, et laissons le chantier propre chaque soir.',
    includes: [
      'Murs intérieurs dans des teintes neutres qui plaisent aux acheteurs',
      'Plafonds grattés, ratissés ou re-stipplés lorsqu’ils sont tachés ou démodés',
      'Moulures, portes, plinthes et rampes refinies',
      'Réparation du gypse et du plâtre avant toute peinture',
      'Revêtement extérieur, moulures, soffites et porte d’entrée',
      'Revêtement époxy pour planchers de garage et de sous-sol',
    ],
    benefits: [
      { title: 'L’acheteur voit une maison terminée', text: 'Éraflures, trous rebouchés et plafonds jaunis passent pour de l’entretien reporté. Une peinture fraîche élimine l’objection avant qu’elle soit soulevée.' },
      { title: 'Des photos plus lumineuses', text: 'Les murs neutres renvoient la lumière au lieu de l’absorber, alors les pièces paraissent plus grandes et plus fidèles.' },
      { title: 'Une seule équipe, un seul calendrier', text: 'Préparation, peinture et nettoyage sont faits par la même équipe, sans attendre un sous traitant occupé ailleurs.' },
    ],
    faq: [
      { q: 'Combien de temps pour un intérieur type ?', a: 'La plupart des rez de chaussée prennent de deux à quatre jours selon les plafonds et les réparations nécessaires. Le calendrier est écrit dans la soumission.' },
      { q: 'Aidez vous à choisir les couleurs ?', a: 'Oui. Nous proposons des teintes qui photographient bien et plaisent au plus grand nombre, et nous pouvons agencer l’existant si vous ne faites qu’une partie de la maison.' },
    ],
  },
  curb: {
    name: 'Attrait extérieur',
    tagline: 'Pelouse, lavage à pression, clôture et retouches à la véranda.',
    metaTitle: 'Aménagement et attrait extérieur à Ottawa | Trusted Home Services',
    metaDescription:
      'Nettoyage extérieur, aménagement paysager léger et réparations d’entrée à Ottawa pour une première impression réussie. Soumission en 24 heures.',
    intro:
      'Beaucoup d’acheteurs se font une idée avant même de sortir de la voiture. Nous soignons l’extérieur pour que la première photo et le premier coup d’œil jouent en votre faveur.',
    includes: [
      'Pelouse tondue, arbustes taillés et arbres élagués',
      'Mauvaises herbes arrachées, paillis frais et plantations saisonnières à l’entrée',
      'Terrasses, patios, allées et entrées lavés à pression',
      'Retouches de peinture sur moulures, rampes et porte d’entrée',
      'Éclairage extérieur, numéros civiques et boîte aux lettres réparés ou remplacés',
      'Gouttières dégagées et drainage vérifié loin des fondations',
    ],
    benefits: [
      { title: 'La première photo travaille plus fort', text: 'La photo extérieure décide si on fait défiler ou si on s’arrête. Une façade soignée fait la différence.' },
      { title: 'Elle annonce le reste de la maison', text: 'Une cour négligée est lue comme un avertissement sur ce qu’on ne voit pas. Un extérieur entretenu crée une autre attente à la porte.' },
      { title: 'Rapide à faire, rapide à montrer', text: 'La plupart des travaux extérieurs se terminent en quelques jours, ce qui en fait la solution la plus simple quand la date d’inscription est fixée.' },
    ],
    faq: [
      { q: 'Est ce possible en hiver ?', a: 'En partie. Le lavage à pression et les plantations attendent la saison, mais l’éclairage, les réparations d’entrée, les retouches abritées et le nettoyage se poursuivent toute l’année à Ottawa.' },
      { q: 'Faites vous de gros travaux paysagers ?', a: 'Nous faisons la remise en état : taille, paillis, petites plantations et réparations. Pour un réaménagement complet, nous vous dirons franchement que cela dépasse notre offre.' },
    ],
  },
  declutter: {
    name: 'Désencombrement et débarras',
    tagline: 'Vidage et disposition finale pour une propriété prête à visiter.',
    metaTitle: 'Désencombrement et débarras à Ottawa | Trusted Home Services',
    metaDescription:
      'Vidage pièce par pièce, dons et enlèvement des rebuts à Ottawa. Nous libérons la maison pour que peintres, nettoyeurs et photographes puissent travailler.',
    intro:
      'C’est presque toujours la première étape. Rien d’autre ne peut vraiment commencer tant que les pièces sont pleines, et rien ne change aussi vite la perception de l’espace.',
    includes: [
      'Tri pièce par pièce : garder, donner, vendre, jeter',
      'Dons aux organismes locaux, avec reçus lorsqu’ils sont émis',
      'Rebuts enlevés et recyclés chaque fois que la matière le permet',
      'Meubles démontés et sortis sans marquer les murs',
      'Peinture, produits chimiques, piles et électroniques acheminés aux points de dépôt appropriés',
      'Livraison et reprise de conteneurs pour les gros vidages',
    ],
    benefits: [
      { title: 'Les pièces retrouvent leur taille réelle', text: 'L’encombrement rétrécit un espace, et davantage encore en photo. Un plancher dégagé est la superficie la moins chère que vous gagnerez.' },
      { title: 'Tous les autres corps de métier avancent plus vite', text: 'Peintres, poseurs de plancher et nettoyeurs ont besoin d’accès. Commencer par là empêche le calendrier de glisser.' },
      { title: 'Votre déménagement commence tôt', text: 'Tout ce qui part maintenant est ce que vous n’aurez ni à emballer, ni à déplacer, ni à entreposer.' },
    ],
    faq: [
      { q: 'Que deviennent les objets dont on ne veut plus ?', a: 'Ce qui est utilisable va aux organismes locaux et nous rapportons les reçus lorsqu’ils sont émis. Le reste est trié pour le recyclage avant tout envoi aux déchets.' },
      { q: 'Pouvez vous gérer une succession ou un déménagement vers plus petit ?', a: 'Oui. Ce sont souvent des mandats chargés d’émotion et nous avançons au rythme de la famille, en mettant de côté ce qui doit être revu avant de quitter la maison.' },
    ],
  },
  staging: {
    name: 'Mise en valeur',
    tagline: 'Préparer chaque pièce pour que les acheteurs voient le potentiel.',
    metaTitle: 'Mise en valeur de propriétés à Ottawa | Trusted Home Services',
    metaDescription:
      'Mise en valeur pièce par pièce à Ottawa, avec vos meubles quand c’est possible. Nous préparons la maison pour que l’acheteur s’y projette.',
    intro:
      'La façon dont une famille habite une maison est rarement celle qui la vend le mieux. La mise en valeur consiste à retravailler l’existant pour qu’un inconnu puisse s’imaginer y vivre.',
    includes: [
      'Un plan pièce par pièce avant de déplacer quoi que ce soit',
      'Meubles réagencés, avec ce que vous possédez déjà quand cela fonctionne',
      'Accessoires, lampes et textiles ajoutés là où une pièce paraît vide',
      'Pièces vides meublées assez pour se lire comme chambre, bureau ou salle à manger',
      'Placards et rangements épurés, car les acheteurs ouvrent toutes les portes',
      'Une dernière retouche le jour de la séance photo',
    ],
    benefits: [
      { title: 'L’acheteur cesse de mesurer et se projette', text: 'Une pièce mise en valeur donne quelque chose à imaginer. Une pièce vide ou surchargée le laisse faire des calculs.' },
      { title: 'Chaque pièce reçoit une fonction', text: 'La chambre d’amis devenue débarras compte comme espace perdu sur un plan. Avec un usage clair, elle compte vraiment.' },
      { title: 'Cela se voit dans les photos', text: 'La plupart des acheteurs voient d’abord votre maison sur un écran. La mise en valeur est faite pour cet écran autant que pour la visite.' },
    ],
    faq: [
      { q: 'Faut il louer des meubles ?', a: 'Habituellement non. Nous partons de ce que vous avez et n’apportons des pièces que si une chambre est vide ou si un meuble nuit vraiment à la vente.' },
      { q: 'Peut on mettre en valeur une maison encore habitée ?', a: 'Oui, et c’est le cas la plupart du temps. Nous travaillons autour de la vie quotidienne et gardons la maison vivable entre les visites.' },
    ],
  },
  flooring: {
    name: 'Revêtements de sol',
    tagline: 'Fourniture et pose pour un rendu neuf, prêt pour le marché.',
    metaTitle: 'Pose de planchers à Ottawa | Trusted Home Services',
    metaDescription:
      'Vinyle, stratifié, sablage de bois franc et céramique à Ottawa. Fourniture et pose, sans acompte exigé.',
    intro:
      'Un plancher usé est l’une des premières choses qu’un acheteur chiffre dans sa tête, et il chiffre toujours plus haut que le coût réel. Le remplacer retire ce nombre de la négociation.',
    includes: [
      'Vinyle de luxe, souvent posé directement sur le plancher existant',
      'Bois franc sablé et refini, y compris des teintes foncées qui uniformisent les marques',
      'Stratifié avec membrane acoustique, souvent exigée en copropriété',
      'Céramique et porcelaine pour entrées, cuisines et salles de bain',
      'Dalles de tapis pour sous-sols et pièces secondaires',
      'Planchers de garage et de service réparés et scellés',
    ],
    benefits: [
      { title: 'Un argument de négociation en moins', text: 'L’acheteur qui voit un plancher usé déduit bien plus que le coût des travaux. Un plancher neuf retire ce sujet de la table.' },
      { title: 'Il porte toute la pièce', text: 'Le plancher apparaît sur chaque photo. Un revêtement neuf rehausse la peinture, la lumière et le mobilier avec lui.' },
      { title: 'Souvent plus rapide que prévu', text: 'Le vinyle et le stratifié se posent souvent par dessus l’existant, ce qui réduit le coût et les jours de chantier.' },
    ],
    faq: [
      { q: 'Faut il enlever l’ancien plancher ?', a: 'Pas toujours. Le vinyle et le stratifié se posent souvent sur un plancher sain. Nous vérifions le support d’abord et vous disons ce qui vaut mieux dans votre cas.' },
      { q: 'Peut on sauver le bois franc au lieu de le remplacer ?', a: 'Souvent oui. S’il reste assez d’épaisseur, le sablage coûte moins cher qu’un remplacement et rend généralement mieux qu’un plancher flottant neuf.' },
    ],
  },
  cleaning: {
    name: 'Nettoyage',
    tagline: 'Avant inscription, nettoyage en profondeur, après vente et rotation.',
    metaTitle: 'Nettoyage en profondeur à Ottawa | Trusted Home Services',
    metaDescription:
      'Nettoyage avant inscription, entrée et sortie de logement et traitement des odeurs à Ottawa. Nous laissons la propriété prête à photographier.',
    intro:
      'Une maison propre ne suscite aucun commentaire, et c’est exactement le but. Ce que les acheteurs remarquent, c’est le contraire, et c’est souvent la première chose qu’ils mentionnent à leur courtier en repartant.',
    includes: [
      'Nettoyage en profondeur, des luminaires jusqu’aux plinthes',
      'Cuisines dégraissées, y compris l’intérieur des appareils et la hotte',
      'Salles de bain détartrées, coulis et vitres remis à neuf',
      'Fenêtres, rails et appuis nettoyés à l’intérieur comme à l’extérieur',
      'Tapis et tissus d’ameublement nettoyés lorsqu’ils peuvent être sauvés',
      'Traitement des odeurs de fumée, d’animaux et de cuisson, à la source plutôt que masquées',
      'Enlèvement de la poussière après des travaux',
    ],
    benefits: [
      { title: 'L’odeur décide plus qu’on ne l’avoue', text: 'Un acheteur n’arrive pas toujours à nommer ce qui cloche, mais il repart plus vite. Traiter l’odeur à la source est une chose que la peinture ne fera pas.' },
      { title: 'Propre veut dire entretenu', text: 'On suppose qu’une maison impeccable a été soignée dans tout ce qu’on ne voit pas. Petit travail, grande impression.' },
      { title: 'C’est la dernière étape', text: 'Nous nettoyons après les autres corps de métier, pour que la maison soit prête le jour de la photo plutôt que poussiéreuse.' },
    ],
    faq: [
      { q: 'Quand faut il nettoyer ?', a: 'Après tous les autres travaux et avant la séance photo. Nettoyer d’abord et rénover ensuite revient à payer deux fois.' },
      { q: 'Peut on éliminer définitivement les odeurs de fumée ou d’animaux ?', a: 'Dans la plupart des cas oui, en traitant les surfaces et l’air plutôt qu’en masquant. Si un tapis ou une thibaude est saturé, nous vous dirons qu’il faut l’enlever.' },
    ],
  },
  handyman: {
    name: 'Homme à tout faire',
    tagline: 'Gypse, calfeutrage, menuiserie, luminaires et les petits correctifs qui s’additionnent.',
    metaTitle: 'Réparations résidentielles à Ottawa | Trusted Home Services',
    metaDescription:
      'Gypse, calfeutrage, menuiserie légère, luminaires et réparations générales à Ottawa. Une seule équipe pour toute la liste, sans acompte.',
    intro:
      'Chaque maison a sa liste : la porte qui coince, le calfeutrage fendillé, l’armoire de travers. Pris séparément, rien de grave. Ensemble, c’est ce qui fait douter un acheteur du reste.',
    includes: [
      'Gypse réparé, plâtré et sablé, prêt à peindre',
      'Calfeutrage refait autour des baignoires, éviers, comptoirs et fenêtres',
      'Portes ajustées pour bien fermer, avec pentures et poignées neuves',
      'Portes et tiroirs d’armoires réalignés, quincaillerie remplacée',
      'Luminaires, robinets, barres à serviettes et stores remplacés',
      'Moulures, plinthes et tablettes posées ou réparées',
      'Planches de terrasse, rampes et portails rendus solides et sécuritaires',
    ],
    benefits: [
      { title: 'La liste cesse d’être la vôtre', text: 'Plutôt que de courir après plusieurs corps de métier pour une demi journée chacun, toute la liste va à une équipe en une visite.' },
      { title: 'Les petits défauts soulèvent de grandes questions', text: 'L’acheteur qui trouve trois petites choses en cherche une quatrième. Les régler garde l’attention sur la maison.' },
      { title: 'Cela protège l’inspection', text: 'Beaucoup d’éléments qui se retrouvent au rapport sont exactement ce type de travaux, bien moins coûteux à corriger avant qu’après.' },
    ],
    faq: [
      { q: 'Y a t il un minimum ?', a: 'Non. Nous donnons un prix fixe pour une liste définie, ou un taux horaire pour une série de petits travaux, selon ce qui vous avantage.' },
      { q: 'Et ce qui s’appelait réparations et préparation ?', a: 'Ces travaux sont maintenant ici. Gypse, calfeutrage, menuiserie légère et luminaires font partie de ce service, un seul endroit au lieu de deux.' },
    ],
  },
  electrical: {
    name: 'Électricité',
    tagline: 'Travaux électriques, du luminaire à la vérification avant vente.',
    metaTitle: 'Services électriques à Ottawa | Trusted Home Services',
    metaDescription:
      'Travaux électriques à Ottawa : luminaires, prises, protection DDFT, étiquetage du panneau et vérification avant inscription. Permis obtenus au besoin.',
    intro:
      'L’électricité est la partie de la maison à laquelle personne ne pense jusqu’à ce qu’un inspecteur l’écrive. Nous faisons le travail correctement, avec permis lorsque requis.',
    includes: [
      'Luminaires, ventilateurs de plafond et encastrés fournis et installés',
      'Interrupteurs, prises et gradateurs remplacés, y compris les prises USB',
      'Protection DDFT ajoutée en cuisine, en salle de bain et à l’extérieur',
      'Panneau correctement étiqueté, disjoncteurs et améliorations mineures',
      'Câblage à bouton et tube ou en aluminium évalué et chiffré honnêtement',
      'Avertisseurs de fumée et de monoxyde de carbone mis aux normes actuelles',
      'Éclairage extérieur, de garage et paysager',
      'Une vérification avant inscription pour éviter les surprises',
    ],
    benefits: [
      { title: 'L’inspection est réglée d’avance', text: 'Les constatations électriques inquiètent les acheteurs plus que presque tout le reste. Les traiter avant les sort de la négociation.' },
      { title: 'Des travaux documentés', text: 'Le travail est permis et inspecté lorsque cela est requis : vous avez des documents à remettre plutôt qu’une explication à donner.' },
      { title: 'L’éclairage change la perception', text: 'Des luminaires sombres ou démodés font mal photographier de belles pièces. Un nouvel éclairage est l’une des améliorations les plus rentables.' },
    ],
    faq: [
      { q: 'Vous occupez vous des permis ?', a: 'Oui. Lorsque les travaux exigent un permis et une inspection, nous obtenons les deux auprès de l’autorité compétente pour que le tout soit consigné.' },
      { q: 'Nous avons du câblage à bouton et tube. Et maintenant ?', a: 'Nous l’évaluons et vous donnons une réponse claire sur ce qu’assureurs et acheteurs attendront. Parfois c’est un correctif ciblé, parfois un projet plus large, et il vaut mieux le savoir avant d’inscrire.' },
    ],
  },
  inspection: {
    name: 'Inspection de la maison',
    tagline: 'Savoir ce que l’acheteur trouvera, avant qu’il le trouve.',
    metaTitle: 'Inspection avant inscription à Ottawa | Trusted Home Services',
    metaDescription:
      'Inspection avant inscription à Ottawa avec rapport écrit et photos. Découvrez les problèmes avant l’acheteur et décidez quoi corriger à vos conditions.',
    intro:
      'La plupart des vendeurs découvrent un rapport d’inspection au pire moment : après une offre, avec un acheteur qui tient les constatations. En le faisant d’abord, la même information devient un outil que vous contrôlez.',
    includes: [
      'Toiture, revêtement extérieur, fenêtres et drainage autour de la maison',
      'Fondation, structure et signes visibles de mouvement',
      'Panneau électrique, câblage et état des prises',
      'Plomberie d’alimentation et d’évacuation, appareils et chauffe eau',
      'Chauffage, climatisation et ventilation',
      'Isolation et ventilation de l’entretoit, traces d’humidité',
      'Sous-sol vérifié pour infiltration et humidité',
      'Un rapport écrit avec photos, en langage clair',
    ],
    benefits: [
      { title: 'Aucune surprise après l’offre', text: 'Une constatation que vous connaissiez est un point à traiter. La même, découverte par l’acheteur, devient une baisse de prix et une hésitation.' },
      { title: 'Vous choisissez quoi corriger', text: 'Avec le rapport en main avant l’inscription, vous décidez ce qui vaut la réparation et ce qu’il vaut mieux déclarer et refléter dans le prix.' },
      { title: 'Cela devient un argument de vente', text: 'Remettre à l’acheteur une inspection récente et les factures des correctifs enlève le doute au moment précis où il décide.' },
    ],
    faq: [
      { q: 'Pourquoi inspecter avant plutôt que laisser l’acheteur le faire ?', a: 'Parce que le moment change tout. Avant l’inscription, c’est une liste que vous contrôlez. Après une offre, c’est un levier entre les mains de quelqu’un d’autre.' },
      { q: 'Faut il tout corriger ?', a: 'Non. Certains éléments méritent réparation, d’autres sont mieux déclarés et reflétés dans le prix. L’idée est d’en faire une décision plutôt qu’une embuscade.' },
    ],
  },
};

const ES = {
  painting: {
    name: 'Pintura y recubrimientos',
    tagline: 'Interior, exterior, pisos epóxicos y renovación de gabinetes.',
    metaTitle: 'Servicios de pintura en Ottawa | Trusted Home Services',
    metaDescription:
      'Pintura interior y exterior en Ottawa para casas que salen al mercado o se preparan para habitar. Sin depósito. Paga al terminar el trabajo.',
    intro:
      'La pintura es la forma más económica de mostrar que una casa fue cuidada. Preparamos bien las superficies, usamos tonos que se ven bien en fotos y dejamos la obra limpia cada día.',
    includes: [
      'Paredes interiores en tonos neutros que gustan a los compradores',
      'Techos raspados, emplastecidos o texturizados de nuevo cuando están manchados',
      'Molduras, puertas, zócalos y barandas renovados',
      'Reparación de tablaroca y yeso antes de aplicar pintura',
      'Revestimiento exterior, molduras, aleros y puerta principal',
      'Recubrimiento epóxico para pisos de garaje y sótano',
    ],
    benefits: [
      { title: 'El comprador ve una casa terminada', text: 'Raspones, huecos tapados y techos amarillentos se leen como mantenimiento pendiente. La pintura fresca elimina esa objeción antes de que surja.' },
      { title: 'Las fotos salen más luminosas', text: 'Las paredes neutras reflejan la luz en vez de absorberla, así los cuartos se ven más amplios y fieles a su tamaño.' },
      { title: 'Un solo equipo, un solo calendario', text: 'Preparación, pintura y limpieza los hace el mismo equipo, sin esperar a un subcontratista ocupado en otro lado.' },
    ],
    faq: [
      { q: '¿Cuánto tarda un interior típico?', a: 'La mayoría de las plantas principales toman de dos a cuatro días según los techos y las reparaciones previas. El calendario va por escrito en la cotización.' },
      { q: '¿Ayudan a elegir los colores?', a: 'Sí. Proponemos tonos que se ven bien en fotos y agradan al mayor número de compradores, y podemos igualar lo existente si solo se pinta una parte.' },
    ],
  },
  curb: {
    name: 'Atractivo exterior',
    tagline: 'Jardín, lavado a presión, cerca y retoques del pórtico.',
    metaTitle: 'Atractivo exterior y jardinería en Ottawa | Trusted Home Services',
    metaDescription:
      'Limpieza exterior, jardinería y reparación de accesos en Ottawa para causar una buena primera impresión. Cotización en 24 horas.',
    intro:
      'Muchos compradores deciden qué sienten por una casa antes de bajarse del auto. Ordenamos el exterior para que la primera foto y el primer vistazo jueguen a su favor.',
    includes: [
      'Césped cortado, arbustos podados y árboles recortados',
      'Maleza retirada, mantillo fresco y plantas de temporada en la entrada',
      'Terrazas, patios, andadores y entradas lavados a presión',
      'Retoques de pintura en molduras, barandas y puerta principal',
      'Iluminación exterior, número de casa y buzón reparados o cambiados',
      'Canaletas despejadas y drenaje revisado lejos de los cimientos',
    ],
    benefits: [
      { title: 'La primera foto rinde más', text: 'La toma exterior decide si alguien sigue deslizando o se detiene. Un frente ordenado marca la diferencia.' },
      { title: 'Anticipa el resto de la casa', text: 'Un jardín descuidado se lee como advertencia de lo que no se ve. Un exterior cuidado crea otra expectativa en la puerta.' },
      { title: 'Rápido de hacer, rápido de mostrar', text: 'Casi todo el trabajo exterior se termina en pocos días, lo que lo vuelve la solución más simple cuando ya hay fecha de publicación.' },
    ],
    faq: [
      { q: '¿Se puede hacer en invierno?', a: 'En parte. El lavado a presión y las plantas esperan la temporada, pero iluminación, reparaciones de entrada, retoques en zonas protegidas y limpieza general siguen todo el año en Ottawa.' },
      { q: '¿Hacen jardinería mayor?', a: 'Hacemos puesta a punto: poda, mantillo, plantas pequeñas y reparaciones. Para un rediseño completo del jardín le diremos con franqueza que está fuera de lo que ofrecemos.' },
    ],
  },
  declutter: {
    name: 'Despeje y retiro',
    tagline: 'Vaciado y disposición final para dejar la propiedad lista para mostrar.',
    metaTitle: 'Despeje y retiro de objetos en Ottawa | Trusted Home Services',
    metaDescription:
      'Vaciado cuarto por cuarto, donaciones y retiro de desechos en Ottawa. Liberamos la casa para que pintores, limpieza y fotógrafo puedan trabajar.',
    intro:
      'Es el primer trabajo en casi toda propiedad que preparamos. Nada más puede empezar bien mientras los cuartos siguen llenos, y nada cambia tan rápido la sensación de espacio.',
    includes: [
      'Clasificación cuarto por cuarto: conservar, donar, vender y desechar',
      'Entregas a organizaciones locales, con recibo cuando lo emiten',
      'Desechos retirados y reciclados siempre que el material lo permita',
      'Muebles desarmados y sacados sin marcar las paredes',
      'Pintura, químicos, baterías y electrónicos llevados a disposición adecuada',
      'Coordinación de contenedores para vaciados grandes',
    ],
    benefits: [
      { title: 'Los cuartos recuperan su tamaño real', text: 'El desorden encoge un espacio en persona y más aún en foto. Un piso despejado son los metros más baratos que va a ganar.' },
      { title: 'Los demás oficios avanzan más rápido', text: 'Pintores, instaladores de piso y limpieza necesitan acceso libre. Empezar por aquí evita que el calendario se atrase.' },
      { title: 'Su mudanza empieza antes', text: 'Todo lo que sale ahora es algo que no va a empacar, mover ni pagar por guardar después.' },
    ],
    faq: [
      { q: '¿Qué pasa con lo que ya no queremos?', a: 'Lo aprovechable va a organizaciones locales y traemos el recibo cuando lo emiten. El resto se separa para reciclaje antes de mandar algo a desecho.' },
      { q: '¿Atienden una sucesión o una mudanza a algo más pequeño?', a: 'Sí. Suelen ser trabajos con carga emocional y avanzamos al ritmo de la familia, apartando lo que deba revisarse antes de salir de la casa.' },
    ],
  },
  staging: {
    name: 'Preparación de espacios',
    tagline: 'Preparar cada cuarto para que el comprador vea el potencial.',
    metaTitle: 'Preparación de espacios en Ottawa | Trusted Home Services',
    metaDescription:
      'Preparación cuarto por cuarto en Ottawa usando lo que ya tiene cuando es posible. Dejamos la casa lista para que el comprador se imagine viviendo ahí.',
    intro:
      'La forma en que una familia vive una casa rara vez es la que mejor la vende. Preparar los espacios es editar lo que ya está para que un desconocido pueda imaginarse ahí.',
    includes: [
      'Un plan cuarto por cuarto antes de mover nada',
      'Muebles reacomodados, con lo que usted ya tiene cuando funciona',
      'Accesorios, lámparas y textiles donde un cuarto se ve vacío',
      'Cuartos vacíos amueblados lo suficiente para leerse como recámara, oficina o comedor',
      'Clósets y almacenaje ordenados, porque el comprador abre todas las puertas',
      'Un repaso final el día de la sesión de fotos',
    ],
    benefits: [
      { title: 'El comprador deja de medir y empieza a imaginar', text: 'Un cuarto preparado da algo en qué proyectarse. Uno vacío o saturado lo deja haciendo cuentas.' },
      { title: 'Cada cuarto recibe una función', text: 'La recámara extra convertida en bodega se lee como espacio perdido en el plano. Con un uso claro, sí cuenta.' },
      { title: 'Se nota en las fotos', text: 'La mayoría ve su casa primero en una pantalla. Esto se hace tanto para esa pantalla como para la visita.' },
    ],
    faq: [
      { q: '¿Hay que rentar muebles?', a: 'Normalmente no. Partimos de lo que usted tiene y solo traemos piezas cuando un cuarto está vacío o cuando algo realmente juega en contra de la venta.' },
      { q: '¿Pueden preparar una casa habitada?', a: 'Sí, y es lo más común. Trabajamos alrededor de la vida diaria y dejamos la casa habitable entre visitas.' },
    ],
  },
  flooring: {
    name: 'Pisos',
    tagline: 'Suministro e instalación para un acabado nuevo, listo para el mercado.',
    metaTitle: 'Instalación de pisos en Ottawa | Trusted Home Services',
    metaDescription:
      'Vinil, laminado, pulido de madera y cerámica en Ottawa. Suministro e instalación, sin depósito.',
    intro:
      'Un piso gastado es de lo primero que el comprador calcula mentalmente, y siempre lo calcula más caro de lo que cuesta. Cambiarlo saca ese número de la negociación.',
    includes: [
      'Vinil de lujo, muchas veces instalado sobre el piso existente',
      'Madera lijada y renovada, incluso con tonos oscuros que emparejan marcas viejas',
      'Laminado con base acústica, que los reglamentos de condominio suelen exigir',
      'Cerámica y porcelanato para entradas, cocinas y baños',
      'Loseta de alfombra para sótanos y cuartos secundarios',
      'Pisos de garaje y cuartos de servicio reparados y sellados',
    ],
    benefits: [
      { title: 'Elimina un argumento de negociación', text: 'Quien ve un piso gastado descuenta mucho más de lo que cuesta el trabajo. Un piso nuevo quita ese tema de la mesa.' },
      { title: 'Sostiene todo el cuarto', text: 'El piso aparece en cada foto. Uno nuevo levanta también la pintura, la luz y los muebles.' },
      { title: 'Suele ser más rápido de lo esperado', text: 'Vinil y laminado a menudo se colocan sobre lo existente, lo que baja el costo y los días de obra.' },
    ],
    faq: [
      { q: '¿Hay que quitar el piso viejo?', a: 'No siempre. Vinil y laminado suelen colocarse sobre un piso en buen estado. Revisamos la base primero y le decimos qué conviene en su caso.' },
      { q: '¿Se puede salvar la madera en vez de cambiarla?', a: 'Muchas veces sí. Si queda suficiente espesor, lijar y renovar cuesta menos que reemplazar y casi siempre se ve mejor que un flotante nuevo.' },
    ],
  },
  cleaning: {
    name: 'Limpieza',
    tagline: 'Antes de publicar, limpieza profunda, posventa y cambio de inquilino.',
    metaTitle: 'Limpieza profunda en Ottawa | Trusted Home Services',
    metaDescription:
      'Limpieza profunda antes de publicar, entrada y salida de inquilinos y tratamiento de olores en Ottawa. Dejamos la propiedad lista para fotografiar.',
    intro:
      'Una casa limpia no genera comentarios, y de eso se trata. Lo que el comprador nota es lo contrario, y suele ser lo primero que le menciona a su agente al salir.',
    includes: [
      'Limpieza profunda, desde las lámparas hasta los zócalos',
      'Cocinas desengrasadas, incluido el interior de electrodomésticos y la campana',
      'Baños sin sarro, con juntas y cristales recuperados',
      'Ventanas, rieles y repisas limpias por dentro y por fuera',
      'Alfombras y tapicería lavadas cuando se pueden salvar',
      'Tratamiento de olores de humo, mascotas y cocina, en el origen y no encima',
      'Retiro de polvo después de obra',
    ],
    benefits: [
      { title: 'El olor decide más de lo que se admite', text: 'El comprador quizá no sepa nombrar qué está mal, pero se va antes. Tratar el olor en su origen es algo que la pintura no hace.' },
      { title: 'Limpio se lee como mantenido', text: 'La gente asume que una casa impecable fue cuidada también en lo que no se ve. Trabajo pequeño, impresión grande.' },
      { title: 'Es lo último que se hace', text: 'Limpiamos después de los demás oficios, para que la casa esté lista el día de la foto y no llena de polvo por la obra que la mejoró.' },
    ],
    faq: [
      { q: '¿Cuándo conviene limpiar?', a: 'Después de todos los demás trabajos y antes de las fotos. Limpiar primero y renovar después solo significa pagar dos veces.' },
      { q: '¿Se puede quitar el olor a humo o mascota para siempre?', a: 'En la mayoría de los casos sí, tratando superficies y aire en lugar de taparlo. Si algo ya no tiene remedio, como una alfombra saturada, se lo diremos con claridad.' },
    ],
  },
  handyman: {
    name: 'Reparaciones generales',
    tagline: 'Tablaroca, sellados, carpintería, luminarias y los arreglos pequeños que suman.',
    metaTitle: 'Reparaciones del hogar en Ottawa | Trusted Home Services',
    metaDescription:
      'Tablaroca, sellado, carpintería menor, luminarias y reparaciones generales en Ottawa. Un solo equipo para toda la lista, sin depósito.',
    intro:
      'Toda casa tiene su lista: la puerta que se atora, el sellado cuarteado, la alacena chueca. Por separado no importa nada. Juntos son lo que hace dudar al comprador de lo demás.',
    includes: [
      'Tablaroca reparada, resanada y lijada, lista para pintar',
      'Sellado renovado en tinas, lavabos, cubiertas y ventanas',
      'Puertas ajustadas para que cierren bien, con bisagras y manijas nuevas',
      'Puertas y cajones de gabinetes realineados, herrajes cambiados',
      'Luminarias, llaves, toalleros y persianas reemplazados',
      'Molduras, zócalos y repisas instalados o reparados',
      'Tablas de terraza, barandas y portones dejados firmes y seguros',
    ],
    benefits: [
      { title: 'La lista deja de ser suya', text: 'En vez de perseguir a varios oficios por medio día de trabajo cada uno, toda la lista va a un solo equipo en una visita.' },
      { title: 'Las fallas pequeñas abren preguntas grandes', text: 'Quien encuentra tres detalles empieza a buscar el cuarto. Resolverlos mantiene la atención en la casa.' },
      { title: 'Protege la inspección', text: 'Muchos puntos que terminan en el reporte son justo este tipo de trabajo, mucho más barato de corregir antes que después.' },
    ],
    faq: [
      { q: '¿Hay un mínimo de trabajo?', a: 'No. Damos precio cerrado por una lista definida, o cobramos por hora para una serie de pendientes, lo que le convenga más.' },
      { q: '¿Y lo que antes aparecía como reparaciones y preparación?', a: 'Ese trabajo ahora vive aquí. Tablaroca, sellado, carpintería menor y luminarias son parte de este servicio, un solo lugar en vez de dos.' },
    ],
  },
  electrical: {
    name: 'Electricidad',
    tagline: 'Trabajo eléctrico, de la lámpara a la revisión previa a la venta.',
    metaTitle: 'Servicios eléctricos en Ottawa | Trusted Home Services',
    metaDescription:
      'Trabajo eléctrico en Ottawa: luminarias, contactos, protección GFCI, rotulado de tablero y revisión antes de publicar. Permisos gestionados cuando aplican.',
    intro:
      'La instalación eléctrica es la parte de la casa en la que nadie piensa hasta que un inspector la escribe. Hacemos el trabajo correctamente, con permiso cuando corresponde.',
    includes: [
      'Luminarias, ventiladores de techo y empotrados suministrados e instalados',
      'Apagadores, contactos y atenuadores cambiados, incluidos contactos con USB',
      'Protección GFCI añadida en cocinas, baños y exteriores',
      'Tablero correctamente rotulado, con pastillas y mejoras menores',
      'Cableado antiguo o de aluminio evaluado y cotizado con honestidad',
      'Detectores de humo y monóxido de carbono al día con la norma vigente',
      'Iluminación exterior, de garaje y de jardín',
      'Una revisión antes de publicar para que nada eléctrico lo sorprenda',
    ],
    benefits: [
      { title: 'Despeja la inspección desde antes', text: 'Los hallazgos eléctricos asustan al comprador más que casi cualquier otro punto del reporte. Resolverlos antes los saca de la negociación.' },
      { title: 'Trabajo documentado', text: 'La obra se tramita con permiso e inspección cuando se requiere, así usted tiene papeles que entregar y no algo que explicar.' },
      { title: 'La luz cambia cómo se sienten los cuartos', text: 'Luminarias tenues o anticuadas hacen que buenos cuartos salgan mal en foto. Renovar la iluminación es de las mejoras más rentables por peso invertido.' },
    ],
    faq: [
      { q: '¿Se encargan de los permisos?', a: 'Sí. Cuando la obra requiere permiso e inspección, gestionamos ambos ante la autoridad correspondiente para que quede registrada.' },
      { q: 'Tenemos cableado antiguo. ¿Y ahora?', a: 'Lo evaluamos y le damos una respuesta clara sobre lo que van a esperar aseguradoras y compradores. A veces es un arreglo puntual y a veces un proyecto mayor, y conviene saberlo antes de publicar.' },
    ],
  },
  inspection: {
    name: 'Inspección de la casa',
    tagline: 'Saber qué va a encontrar el comprador, antes de que lo encuentre.',
    metaTitle: 'Inspección antes de vender en Ottawa | Trusted Home Services',
    metaDescription:
      'Inspección previa a la publicación en Ottawa con reporte escrito y fotos. Detecte los problemas antes que el comprador y decida qué reparar en sus términos.',
    intro:
      'La mayoría de los vendedores conoce un reporte de inspección en el peor momento: después de una oferta y con el comprador sosteniendo los hallazgos. Hacerlo primero convierte esa misma información en algo que usted controla.',
    includes: [
      'Techo, revestimiento exterior, ventanas y drenaje alrededor de la casa',
      'Cimentación, estructura y señales visibles de movimiento',
      'Tablero eléctrico, cableado y estado de los contactos',
      'Plomería de suministro y desagüe, muebles de baño y calentador',
      'Calefacción, aire acondicionado y ventilación',
      'Aislamiento y ventilación del ático, y rastros de humedad',
      'Sótano revisado por filtraciones y humedad',
      'Un reporte escrito con fotos, en lenguaje claro',
    ],
    benefits: [
      { title: 'Sin sorpresas después de la oferta', text: 'Un hallazgo que usted ya conocía es un punto por atender. El mismo hallazgo descubierto por el comprador se vuelve rebaja de precio y motivo de duda.' },
      { title: 'Usted decide qué reparar', text: 'Con el reporte en mano antes de publicar, usted define qué vale la pena arreglar y qué conviene declarar y reflejar en el precio.' },
      { title: 'Se convierte en argumento de venta', text: 'Entregar al comprador una inspección reciente y las facturas de lo corregido elimina la duda justo cuando está decidiendo.' },
    ],
    faq: [
      { q: '¿Por qué inspeccionar antes en vez de dejar que lo haga el comprador?', a: 'Porque el momento lo cambia todo. Antes de publicar es una lista de pendientes que usted controla. Después de una oferta es una palanca en manos ajenas.' },
      { q: '¿Hay que reparar todo lo que encuentre?', a: 'No. Algunos puntos conviene repararlos y otros conviene declararlos y reflejarlos en el precio. La idea es que sea una decisión y no una emboscada.' },
    ],
  },
};

const BY_LOCALE = { en: EN, fr: FR, es: ES };

/** Content for one service in the requested language, falling back to English. */
export function getServiceContent(lang, key) {
  const table = BY_LOCALE[lang] || EN;
  return table[key] || EN[key] || null;
}

/** Every service in menu order, with the bits the navigation needs. */
export function getServiceList(lang) {
  return SERVICE_KEYS.map((key) => {
    const c = getServiceContent(lang, key);
    return {
      key,
      slug: SERVICE_SLUGS[key],
      name: c.name,
      tagline: c.tagline,
      img: SERVICE_IMAGES[key],
    };
  });
}

/** Reverse lookup for routing: /services/<slug> back to a service key. */
export function getServiceKeyFromSlug(slug) {
  const entry = Object.entries(SERVICE_SLUGS).find(([, s]) => s === slug);
  return entry ? entry[0] : null;
}
