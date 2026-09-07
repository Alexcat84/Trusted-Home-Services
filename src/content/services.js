/**
 * Service catalogue: one entry per dedicated service page.
 *
 * Copy is original. It was informed by researching how this market describes the
 * same trades, then written from scratch for this business. Nothing is lifted
 * from any competitor, and no competitor is named.
 *
 * Order here is the order shown in the navigation menu.
 */

/**
 * The order of the work, not a catalogue.
 *
 * The client asked for the running order of an actual job: cleaning and
 * decluttering first, because nothing else can start while the rooms are full,
 * and inspection and staging last. Everything between them follows the sequence
 * a house goes through on the way to a listing.
 *
 * This one list drives both the menu panel and the cards on the home page, so
 * the two can never drift apart.
 */
export const SERVICE_KEYS = [
  'cleaning',
  'declutter',
  'handyman',
  'electrical',
  'painting',
  'flooring',
  'curb',
  'inspection',
  'staging',
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
  cleaning: {
    name: 'Cleaning',
    tagline: 'The first pass through the house, and the last one before the photos.',
    metaTitle: 'Deep Cleaning Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Deep cleaning, move in and move out cleaning and odour treatment in Ottawa. The first job on site and the last one before photography.',
    intro:
      'This is where a job starts. Nobody can price a house they cannot see properly, and no trade works well around someone else’s mess. We clean first so the plan is made on what is actually there, then come back at the end so the property is photographed, or handed over, on the day it looks its best.',
    includes: [
      'A heavy pass at the start of the job and a lighter one before the photographs',
      'Ceilings, fixtures and baseboards, so rooms read as cared for from top to bottom',
      'Kitchens degreased inside the appliances and the range hood, where people always look',
      'Bathrooms descaled, grout and glass brought back to something anyone would touch',
      'Windows, tracks and sills, so daylight comes through instead of stopping at the glass',
      'Carpet and upholstery lifted where they can be saved, and called out where they cannot',
      'Odour from smoke, pets and cooking treated at the source, so a room smells of nothing',
      'Construction dust cleared after the trades, so nobody sees the work that improved the house',
    ],
    benefits: [
      { title: 'Everything after it goes faster', text: 'Painters, floor fitters and electricians move quicker over clear surfaces, and the price they quote is closer to the truth when they can see what they are quoting on.' },
      { title: 'Smell decides more than people admit', text: 'A visitor may not be able to name what is wrong, but they leave sooner and they remember it in the car. Treating odour at the source is not something paint can do for you.' },
      { title: 'Clean reads as maintained', text: 'People assume a spotless house has been looked after in the ways they cannot see. It is a small job that changes a large impression, whether the next person through the door is buying or moving in.' },
    ],
    faq: [
      { q: 'Why clean first if the work is only going to make a mess again?', a: 'Because the plan and the price both depend on seeing the house properly, and trades lose hours working around clutter and grime. The heavy clean at the start is about access. The lighter pass at the end is the one that gets photographed.' },
      { q: 'Can you remove smoke or pet odour for good?', a: 'In most cases yes, by treating the surfaces and the air rather than masking it. If something is beyond treatment, such as saturated carpet or underlay, we will tell you it needs to come out.' },
    ],
  },
  declutter: {
    name: 'Decluttering & Removal',
    tagline: 'Nothing else can start while the rooms are still full.',
    metaTitle: 'Decluttering and Junk Removal in Ottawa | Trusted Home Services',
    metaDescription:
      'Room by room clear out, donation runs and junk removal in Ottawa. We empty the house so the painters, the cleaners and the camera can do their work.',
    intro:
      'Clutter costs twice. It hides the house from anyone trying to value it, and it slows down every trade that has to work around it. Clearing it is the cheapest square footage you will ever gain, and the job is the same whether you are listing next month or finally taking your own house back.',
    includes: [
      'Room by room sort into keep, donate, sell and discard, decided by you',
      'Donation runs to local charities, with receipts wherever they are issued',
      'Junk hauled away and recycled wherever the material allows',
      'Furniture taken apart and carried out without marking the walls on the way',
      'Paint, chemicals, batteries and electronics taken to proper disposal, not the curb',
      'Bin delivery and pickup arranged when a clear out is big enough to need one',
    ],
    benefits: [
      { title: 'Rooms read at their real size', text: 'A full room looks smaller in person and smaller again in a photograph. Empty floor and clear surfaces are the cheapest square footage in the house.' },
      { title: 'Every other trade moves faster', text: 'Painters, floor fitters and cleaners all need clear access. Doing this first is what keeps the rest of the schedule from slipping.' },
      { title: 'Your move starts early', text: 'Whatever leaves now is something you do not pack, do not move, and do not pay to store later.' },
    ],
    faq: [
      { q: 'What happens to the things we do not want?', a: 'Usable items go to local charities and we bring back receipts where they are issued. The rest is sorted for recycling before anything goes to disposal.' },
      { q: 'Can you handle an estate or a full downsize?', a: 'Yes. These are often difficult jobs, and we work at whatever pace the family needs, setting aside anything that has to be reviewed before it leaves the house.' },
    ],
  },
  handyman: {
    name: 'Handyman',
    tagline: 'The small things that together make a house look neglected.',
    metaTitle: 'Handyman Repairs in Ottawa | Trusted Home Services',
    metaDescription:
      'Drywall, caulking, minor carpentry, fixtures and general repairs in Ottawa. One crew for the whole list, with no deposit.',
    intro:
      'Every house has a list. The door that sticks, the cracked caulking, the cupboard hanging crooked. On its own none of it matters. Together it is what makes someone wonder what else was left undone, and it is the cheapest part of the whole job to put right.',
    includes: [
      'Drywall patched, plastered and sanded so the wall takes paint without showing the repair',
      'Caulking renewed around tubs, sinks, counters and windows, where mould shows first',
      'Doors adjusted so they close properly, with hinges and handles that feel solid',
      'Cabinet doors and drawers realigned and rehung, so a kitchen closes square',
      'Light fixtures, taps, towel bars and blinds swapped for something of this decade',
      'Trim, baseboards and shelving installed or repaired so the edges of rooms look finished',
      'Deck boards, railings and gates made safe, because that is what people lean on',
    ],
    benefits: [
      { title: 'Small faults raise big questions', text: 'Someone who finds three little things starts hunting for a fourth. Clearing the list keeps attention on the house itself.' },
      { title: 'One crew, one visit', text: 'Instead of chasing several trades for an afternoon of work each, the whole list goes to one team in one go.' },
      { title: 'It protects the inspection', text: 'Many of the items that end up on an inspection report are exactly this kind of work, and they cost far less to fix before the report than after it.' },
    ],
    faq: [
      { q: 'Is there a minimum job size?', a: 'No. We quote a fixed price for a defined list, or work by the hour for a punch list, whichever ends up better value for you.' },
      { q: 'Is this only for houses going on the market?', a: 'No. A good share of this work is for people staying put who have simply run out of weekends.' },
    ],
  },
  electrical: {
    name: 'Electrical',
    tagline: 'The part of a house nobody thinks about until somebody writes it down.',
    metaTitle: 'Electrical Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Electrical work in Ottawa: fixtures, outlets, GFCI protection, panel labelling and pre-listing safety checks. Permits arranged where the job requires them.',
    intro:
      'Electrical is the one trade where the work has to stand up to paperwork as well as to the eye. We do it properly, with permits where the job calls for them, so what you hand over is a record rather than an explanation.',
    includes: [
      'Light fixtures, ceiling fans and pot lights, so rooms photograph bright instead of yellow',
      'Switches, outlets and dimmers replaced, including the USB outlets people now expect',
      'GFCI protection in kitchens, bathrooms and outdoors, which is the first thing flagged',
      'The panel labelled properly, so the next owner is not guessing at breakers',
      'Knob and tube or aluminum wiring assessed and quoted straight, before it becomes a surprise',
      'Smoke and carbon monoxide alarms brought up to current requirements',
      'Exterior, garage and landscape lighting, so the house still reads well after dark',
      'A pre-listing check, so nothing electrical turns up at the worst possible moment',
    ],
    benefits: [
      { title: 'It clears the inspection early', text: 'Electrical findings worry people more than almost anything else on a report. Handling them beforehand keeps them out of the negotiation.' },
      { title: 'Work you can document', text: 'Where a permit and an inspection are required we arrange both, so you end up with paperwork to hand over rather than something to explain.' },
      { title: 'Light changes how a room feels', text: 'Dim or dated fixtures make good rooms photograph badly. New lighting is one of the cheapest improvements per dollar in the house, and you get the benefit whether you sell or stay.' },
    ],
    faq: [
      { q: 'Do you take care of permits?', a: 'Yes. Where the work calls for a permit and an inspection we arrange both through the proper authority, so the job ends up on record.' },
      { q: 'We have knob and tube wiring. Now what?', a: 'We assess it and give you a straight answer about what insurers and buyers will expect. Sometimes it is a contained fix and sometimes it is a larger project, and you should know which before you list.' },
    ],
  },
  painting: {
    name: 'Painting & Coatings',
    tagline: 'The cheapest way to make a house look cared for.',
    metaTitle: 'House Painting Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Interior and exterior painting in Ottawa for homes going on the market or being moved into. No deposit. You pay when the work is complete.',
    intro:
      'Paint returns more per dollar than anything else we do. It is also the work people most often regret rushing, because a soft edge or a patch showing through is the first thing anyone notices. We prepare properly, work in colours that photograph well, and leave the site clean every evening.',
    includes: [
      'Walls in neutral colours that suit the widest range of buyers, and still suit you if you stay',
      'Ceilings scraped, skim coated or re-stippled where stains and age are showing',
      'Trim, doors, baseboards and railings refinished so edges look sharp in photographs',
      'Drywall and plaster made good first, so no repair telegraphs through the finish',
      'Exterior siding, trim, soffits and the front door, which is the part everyone touches',
      'Epoxy coating for garage and basement floors, turning grey concrete into finished space',
    ],
    benefits: [
      { title: 'People see a finished house', text: 'Scuffs, patched holes and yellowed ceilings all read as deferred maintenance. Fresh paint removes the objection before anyone raises it.' },
      { title: 'Photographs come out brighter', text: 'Neutral walls bounce light instead of absorbing it, so rooms look larger and truer to size on a screen, which is where most people see the house first.' },
      { title: 'One crew, one schedule', text: 'Preparation, painting and cleanup are handled by the same team, so nothing waits on a subcontractor who is booked elsewhere.' },
    ],
    faq: [
      { q: 'How long does a typical interior take?', a: 'Most main floors are done in two to four days, depending on ceiling work and how much repair is needed first. The schedule comes in writing with the quote.' },
      { q: 'Do you help choose the colours?', a: 'Yes. We suggest shades that photograph well and appeal to the widest range of people, and we can match what is already there if only part of the house is being done.' },
    ],
  },
  flooring: {
    name: 'Flooring',
    tagline: 'The surface that runs through every photograph of every room.',
    metaTitle: 'Flooring Installation in Ottawa | Trusted Home Services',
    metaDescription:
      'Vinyl, laminate, hardwood refinishing and tile installation in Ottawa. Supply and install with no deposit required.',
    intro:
      'Worn flooring is one of the first things anyone prices in their head, and they always price it higher than it costs. Replacing or refinishing takes that number out of the conversation, and it is the change people notice the moment they walk in.',
    includes: [
      'Luxury vinyl plank, often laid straight over a sound existing floor',
      'Hardwood sanded and refinished, including darker stains that even out old marks',
      'Laminate with acoustic underlay, which condo rules in Ottawa usually require',
      'Ceramic and porcelain tile for entries, kitchens and bathrooms, where wear shows first',
      'Carpet tile for basements and secondary rooms, warm underfoot and replaceable by the square',
      'Garage and utility floors patched and coated, so the last room anyone sees is finished too',
    ],
    benefits: [
      { title: 'It removes a bargaining chip', text: 'Someone who sees worn floors deducts far more than the work costs. New flooring takes that conversation off the table.' },
      { title: 'It carries the whole room', text: 'Floors run through every photograph of a room. Fresh flooring lifts the paint, the light and the furniture along with it.' },
      { title: 'Often faster than expected', text: 'Vinyl and laminate can frequently go over what is already down, which cuts both the cost and the days on site.' },
    ],
    faq: [
      { q: 'Do we have to remove the old floor?', a: 'Not always. Vinyl and laminate can often be laid over a sound existing floor. We check the subfloor first and tell you which way is better in your case.' },
      { q: 'Can hardwood be saved instead of replaced?', a: 'Often yes. If there is enough thickness left, sanding and refinishing costs less than replacement and usually looks better than a new floating floor.' },
    ],
  },
  curb: {
    name: 'Curb Appeal',
    tagline: 'The photograph people decide on before they read a word.',
    metaTitle: 'Curb Appeal Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Exterior clean up, landscaping and entry repairs in Ottawa so your property makes a strong first impression. Free quote within 24 hours.',
    intro:
      'Plenty of people decide how they feel about a house before they get out of the car, and the exterior shot is the one they either stop on or scroll past. Tidying the outside is quick, it is visible from the street, and it sets the expectation for everything inside.',
    includes: [
      'Grass cut, shrubs trimmed and trees pruned back off the walls and the windows',
      'Weeds pulled, fresh mulch laid and seasonal planting at the entry, where people wait',
      'Decks, patios, walkways and driveways pressure washed back to their real colour',
      'Paint touch ups on trim, railings and the front door, the part everyone puts a hand on',
      'Outdoor lighting, house numbers and mailbox repaired so the address reads at a glance',
      'Gutters cleared and drainage checked away from the foundation, which an inspector will look at',
    ],
    benefits: [
      { title: 'The first photograph does the most work', text: 'The exterior shot is what people scroll past or stop on. A tidy front is the difference between a click and a scroll.' },
      { title: 'It sets the expectation for the rest', text: 'A neglected yard reads as a warning about what cannot be seen. A cared for exterior sets a different tone at the door.' },
      { title: 'Quick to do, quick to show', text: 'Most exterior work is finished in a few days, which makes it the easiest thing to fix when a listing date is already set.' },
    ],
    faq: [
      { q: 'Can you do this in the winter?', a: 'Some of it. Pressure washing and planting wait for the season, but lighting, entry repairs, paint touch ups on sheltered areas and general clean up carry on year round in Ottawa.' },
      { q: 'Do you handle larger landscaping?', a: 'We handle tune up work: trimming, mulch, small plantings and repairs. For a full landscape rebuild we will tell you honestly that it is outside what we do.' },
    ],
  },
  inspection: {
    name: 'Home Inspection',
    tagline: 'Find what a buyer would find, while it is still your decision.',
    metaTitle: 'Pre-Listing Home Inspection in Ottawa | Trusted Home Services',
    metaDescription:
      'Pre-listing home inspection in Ottawa with a written photo report. Find the problems before a buyer does and decide what to fix on your own terms.',
    intro:
      'Most sellers meet an inspection report at the worst possible moment: after an offer, with somebody else holding the findings. Doing it first turns the same information into a list you control, and it tells you where money is worth spending before you spend it.',
    includes: [
      'Roof, cladding, windows and the drainage running away from the house',
      'Foundation, structure and any visible sign of movement',
      'Electrical panel, wiring and the condition of the outlets',
      'Plumbing supply and drainage, fixtures and the water heater',
      'Furnace, air conditioning and ventilation',
      'Attic insulation, ventilation and any evidence of moisture',
      'Basement checked for water entry and damp',
      'A written report with photographs, in plain language rather than trade shorthand',
    ],
    benefits: [
      { title: 'No surprises after the offer', text: 'A finding you already knew about is a line item. The same finding discovered by a buyer becomes a price reduction and a reason to hesitate.' },
      { title: 'You decide what is worth fixing', text: 'With the report in hand before listing you choose what to repair and what to disclose and price in. It also stops money going into work the house did not need.' },
      { title: 'It becomes something to show', text: 'Handing over a recent inspection and the receipts for what was corrected removes doubt at exactly the moment somebody is deciding.' },
    ],
    faq: [
      { q: 'Why inspect before listing instead of letting the buyer do it?', a: 'Because the timing changes everything. Before listing it is a list you control. After an offer it is leverage in somebody else’s hands.' },
      { q: 'Do we have to fix everything it finds?', a: 'No. Some items are worth repairing and some are better disclosed and reflected in the price. The point is to make that a decision rather than an ambush.' },
    ],
  },
  staging: {
    name: 'Home Staging',
    tagline: 'The last thing done, and the one that ends up in the photographs.',
    metaTitle: 'Home Staging Services in Ottawa | Trusted Home Services',
    metaDescription:
      'Room by room staging in Ottawa using what you already own where possible. We prepare the house so people can picture themselves living in it.',
    intro:
      'The way a family lives in a house is rarely the way it sells best. Staging is editing what is already there so a stranger walking through can picture their own life in the space, and it comes last, once every other trade is out of the way.',
    includes: [
      'A room by room plan agreed before anything is moved',
      'Furniture rearranged using what you already own wherever it works',
      'Accessories, lamps and textiles added where a room reads bare on camera',
      'Empty rooms given enough furniture to read as a bedroom, an office or a dining room',
      'Closets and storage edited, because people open every door',
      'A final pass on the morning of the photography',
    ],
    benefits: [
      { title: 'People stop measuring and start imagining', text: 'A staged room gives somebody something to picture themselves in. An empty or crowded one leaves them doing arithmetic instead.' },
      { title: 'Every room gets a purpose', text: 'The spare room that became storage reads as wasted space on a floor plan. Given a use, it counts.' },
      { title: 'It is done for the camera as much as the door', text: 'Most people see the house on a screen before they see it in person, and the photographs are what decide whether they come at all.' },
    ],
    faq: [
      { q: 'Do we have to rent furniture?', a: 'Usually not. We start with what you own and only bring pieces in when a room is empty or when something is genuinely working against the sale.' },
      { q: 'Can you stage a house we are still living in?', a: 'Yes, and most of our staging is exactly that. We work around daily life and keep the house liveable between showings.' },
    ],
  },
};

const FR = {
  cleaning: {
    name: 'Nettoyage',
    tagline: 'Le premier passage dans la maison, et le dernier avant les photos.',
    metaTitle: 'Services de nettoyage en profondeur à Ottawa | Trusted Home Services',
    metaDescription:
      'Nettoyage en profondeur, nettoyage d’emménagement et de déménagement et traitement des odeurs à Ottawa. Le premier travail sur place et le dernier avant la séance photo.',
    intro:
      'C’est ici que le chantier commence. Personne ne peut chiffrer une maison qu’il ne voit pas comme il faut, et aucun corps de métier ne travaille bien dans le désordre des autres. Nous nettoyons d’abord pour que le plan repose sur ce qui est vraiment là, puis nous revenons à la fin pour que la propriété soit photographiée, ou remise, le jour où elle paraît à son mieux.',
    includes: [
      'Un passage en profondeur au début du chantier et un plus léger avant les photos',
      'Plafonds, luminaires et plinthes, pour que les pièces respirent le soin de haut en bas',
      'Cuisines dégraissées jusque dans les appareils et la hotte, là où l’on regarde toujours',
      'Salles de bain détartrées, coulis et vitres remis dans un état que l’on ose toucher',
      'Fenêtres, rails et appuis, pour que la lumière entre au lieu de s’arrêter sur la vitre',
      'Tapis et tissus nettoyés quand ils peuvent être sauvés, signalés quand ils ne le peuvent pas',
      'Odeurs de fumée, d’animaux et de cuisson traitées à la source, pour que la pièce ne sente rien',
      'Poussière de chantier retirée après les équipes, pour qu’on ne voie pas les travaux',
    ],
    benefits: [
      { title: 'Tout ce qui suit va plus vite', text: 'Peintres, poseurs de planchers et électriciens avancent plus vite sur des surfaces dégagées, et le prix qu’ils annoncent est plus juste quand ils voient ce qu’ils chiffrent.' },
      { title: 'L’odeur décide plus qu’on ne l’admet', text: 'Un visiteur n’arrive pas toujours à nommer ce qui cloche, mais il repart plus tôt et il s’en souvient dans la voiture. Traiter l’odeur à la source, la peinture ne le fera pas pour vous.' },
      { title: 'Propre veut dire entretenu', text: 'On suppose qu’une maison impeccable a aussi été soignée là où cela ne se voit pas. Petit travail, grande impression, que la personne suivante achète ou emménage.' },
    ],
    faq: [
      { q: 'Pourquoi nettoyer en premier si les travaux vont tout resalir ?', a: 'Parce que le plan et le prix dépendent tous deux de bien voir la maison, et que les équipes perdent des heures à contourner le désordre. Le gros nettoyage du début sert à l’accès. Le passage léger de la fin est celui qui sera photographié.' },
      { q: 'Pouvez-vous éliminer définitivement les odeurs de fumée ou d’animaux ?', a: 'Dans la plupart des cas oui, en traitant les surfaces et l’air plutôt qu’en les masquant. Si quelque chose dépasse le traitement, un tapis ou une thibaude saturée par exemple, nous vous dirons qu’il faut le retirer.' },
    ],
  },
  declutter: {
    name: 'Désencombrement et débarras',
    tagline: 'Rien d’autre ne peut commencer tant que les pièces sont pleines.',
    metaTitle: 'Désencombrement et débarras à Ottawa | Trusted Home Services',
    metaDescription:
      'Vidage pièce par pièce, dons et enlèvement des rebuts à Ottawa. Nous libérons la maison pour que les peintres, les nettoyeurs et l’appareil photo puissent travailler.',
    intro:
      'L’encombrement coûte deux fois. Il cache la maison à qui essaie de l’évaluer, et il ralentit chaque équipe qui doit le contourner. Le dégager est la surface la moins chère que vous gagnerez jamais, et le travail est le même que vous mettiez en vente le mois prochain ou que vous repreniez enfin possession de chez vous.',
    includes: [
      'Tri pièce par pièce entre garder, donner, vendre et jeter, décidé par vous',
      'Dons portés aux organismes locaux, avec les reçus lorsqu’ils sont délivrés',
      'Rebuts emportés et recyclés partout où la matière le permet',
      'Meubles démontés et sortis sans marquer les murs au passage',
      'Peinture, produits, piles et électronique confiés à la filière prévue, pas au trottoir',
      'Conteneur livré et repris quand le débarras est assez important pour en demander un',
    ],
    benefits: [
      { title: 'Les pièces retrouvent leur vraie taille', text: 'Une pièce pleine paraît plus petite sur place, et plus petite encore en photo. Un plancher dégagé est la surface la moins chère de la maison.' },
      { title: 'Toutes les autres équipes vont plus vite', text: 'Peintres, poseurs et nettoyeurs ont tous besoin d’un accès libre. Commencer par là, c’est ce qui empêche le calendrier de glisser.' },
      { title: 'Votre déménagement commence plus tôt', text: 'Tout ce qui part maintenant, vous ne l’emballez pas, vous ne le transportez pas et vous ne payez pas pour l’entreposer.' },
    ],
    faq: [
      { q: 'Que deviennent les choses dont nous ne voulons plus ?', a: 'Ce qui est utilisable va aux organismes locaux et nous rapportons les reçus lorsqu’ils sont délivrés. Le reste est trié pour le recyclage avant que quoi que ce soit parte à l’élimination.' },
      { q: 'Pouvez-vous gérer une succession ou un déménagement complet ?', a: 'Oui. Ce sont souvent des chantiers difficiles, et nous avançons au rythme de la famille, en mettant de côté tout ce qui doit être revu avant de quitter la maison.' },
    ],
  },
  handyman: {
    name: 'Bricolage',
    tagline: 'Les petites choses qui, ensemble, donnent l’air d’une maison négligée.',
    metaTitle: 'Réparations et bricolage à Ottawa | Trusted Home Services',
    metaDescription:
      'Gypse, calfeutrage, menuiserie légère, luminaires et réparations générales à Ottawa. Une seule équipe pour toute la liste, sans acompte.',
    intro:
      'Chaque maison a sa liste. La porte qui coince, le calfeutrage fendillé, l’armoire de travers. Pris un par un, aucun de ces points ne compte. Ensemble, c’est ce qui fait se demander ce qui a été laissé de côté, et c’est la partie la moins chère de tout le chantier à corriger.',
    includes: [
      'Gypse rebouché, plâtré et sablé pour que le mur prenne la peinture sans montrer la réparation',
      'Calfeutrage refait autour des baignoires, éviers, comptoirs et fenêtres, là où la moisissure paraît en premier',
      'Portes ajustées pour qu’elles ferment vraiment, avec des charnières et des poignées solides',
      'Portes et tiroirs d’armoire réalignés et reposés, pour qu’une cuisine ferme droit',
      'Luminaires, robinets, porte-serviettes et stores remplacés par du matériel de cette décennie',
      'Moulures, plinthes et tablettes posées ou réparées pour que les bords des pièces soient finis',
      'Planches de terrasse, garde-corps et portails remis en sécurité, car c’est là qu’on s’appuie',
    ],
    benefits: [
      { title: 'Les petits défauts soulèvent de grandes questions', text: 'Qui trouve trois petites choses en cherche une quatrième. Régler la liste garde l’attention sur la maison elle-même.' },
      { title: 'Une équipe, une visite', text: 'Plutôt que de courir après plusieurs corps de métier pour une demi-journée chacun, toute la liste passe à une seule équipe en une fois.' },
      { title: 'Cela protège l’inspection', text: 'Beaucoup des points qui finissent dans un rapport d’inspection sont exactement ce genre de travaux, et ils coûtent bien moins cher avant le rapport qu’après.' },
    ],
    faq: [
      { q: 'Y a-t-il une taille minimale de chantier ?', a: 'Non. Nous donnons un prix fixe pour une liste définie, ou nous travaillons à l’heure pour une liste de finitions, selon ce qui vous revient le moins cher.' },
      { q: 'Est-ce réservé aux maisons mises en vente ?', a: 'Non. Une bonne part de ces travaux est faite pour des gens qui restent chez eux et qui ont simplement épuisé leurs fins de semaine.' },
    ],
  },
  electrical: {
    name: 'Électricité',
    tagline: 'La partie de la maison à laquelle on ne pense pas avant qu’on l’écrive.',
    metaTitle: 'Services d’électricité à Ottawa | Trusted Home Services',
    metaDescription:
      'Travaux électriques à Ottawa : luminaires, prises, protection DDFT, panneau étiqueté et vérification avant la mise en vente. Permis obtenus lorsque requis.',
    intro:
      'L’électricité est le seul métier où le travail doit tenir sur papier autant qu’à l’œil. Nous le faisons dans les règles, avec les permis lorsque le chantier l’exige, pour que ce que vous remettez soit un dossier et non une explication.',
    includes: [
      'Luminaires, ventilateurs de plafond et encastrés, pour que les pièces photographient claires et non jaunes',
      'Interrupteurs, prises et gradateurs remplacés, y compris les prises USB devenues courantes',
      'Protection DDFT dans les cuisines, les salles de bain et à l’extérieur, le premier point signalé',
      'Panneau étiqueté correctement, pour que le prochain propriétaire ne devine pas ses disjoncteurs',
      'Câblage à bouton et tube ou en aluminium évalué et chiffré franchement, avant qu’il ne surprenne',
      'Avertisseurs de fumée et de monoxyde de carbone mis aux exigences en vigueur',
      'Éclairage extérieur, de garage et de terrain, pour que la maison tienne encore la nuit tombée',
      'Une vérification avant la mise en vente, pour qu’aucun point électrique ne sorte au mauvais moment',
    ],
    benefits: [
      { title: 'Cela règle l’inspection tôt', text: 'Les constats électriques inquiètent plus que presque tout le reste d’un rapport. Les traiter avant les sort de la négociation.' },
      { title: 'Des travaux qui se documentent', text: 'Lorsqu’un permis et une inspection sont requis, nous obtenons les deux, pour que vous ayez des papiers à remettre plutôt qu’une explication à donner.' },
      { title: 'La lumière change une pièce', text: 'Des luminaires ternes ou démodés font mal photographier de bonnes pièces. L’éclairage neuf est l’une des améliorations les moins chères au dollar, et vous en profitez que vous vendiez ou que vous restiez.' },
    ],
    faq: [
      { q: 'Vous occupez-vous des permis ?', a: 'Oui. Lorsque les travaux exigent un permis et une inspection, nous obtenons les deux auprès de l’autorité compétente, pour que le chantier reste au dossier.' },
      { q: 'Nous avons du câblage à bouton et tube. Et maintenant ?', a: 'Nous l’évaluons et vous donnons une réponse franche sur ce qu’attendront les assureurs et les acheteurs. Parfois c’est une correction limitée, parfois un projet plus lourd, et il vaut mieux le savoir avant de mettre en vente.' },
    ],
  },
  painting: {
    name: 'Peinture et revêtements',
    tagline: 'La façon la moins chère de montrer qu’une maison a été soignée.',
    metaTitle: 'Services de peinture résidentielle à Ottawa | Trusted Home Services',
    metaDescription:
      'Peinture intérieure et extérieure à Ottawa pour les maisons mises en vente ou prêtes à habiter. Aucun acompte. Vous payez à la fin des travaux.',
    intro:
      'La peinture rapporte plus au dollar que tout ce que nous faisons. C’est aussi le travail qu’on regrette le plus d’avoir bâclé, parce qu’une ligne molle ou une reprise qui transparaît est la première chose que l’on remarque. Nous préparons comme il faut, choisissons des teintes qui photographient bien, et laissons le chantier propre chaque soir.',
    includes: [
      'Murs dans des teintes neutres qui plaisent au plus grand nombre, et qui vous plaisent encore si vous restez',
      'Plafonds grattés, ratissés ou re-stipplés là où les taches et l’âge se voient',
      'Moulures, portes, plinthes et rampes refinies pour que les arêtes soient nettes en photo',
      'Gypse et plâtre repris d’abord, pour qu’aucune réparation ne transparaisse sous la finition',
      'Revêtement extérieur, moulures, soffites et porte d’entrée, la partie que tout le monde touche',
      'Revêtement époxy pour les planchers de garage et de sous-sol, du béton gris devenu pièce finie',
    ],
    benefits: [
      { title: 'On voit une maison terminée', text: 'Éraflures, trous rebouchés et plafonds jaunis passent pour de l’entretien reporté. Une peinture fraîche élimine l’objection avant qu’elle soit soulevée.' },
      { title: 'Les photos sortent plus lumineuses', text: 'Les murs neutres renvoient la lumière au lieu de l’absorber, alors les pièces paraissent plus grandes et plus fidèles à l’écran, là où la plupart des gens voient la maison en premier.' },
      { title: 'Une seule équipe, un seul calendrier', text: 'Préparation, peinture et nettoyage sont faits par la même équipe, sans attendre un sous-traitant occupé ailleurs.' },
    ],
    faq: [
      { q: 'Combien de temps pour un intérieur type ?', a: 'La plupart des rez-de-chaussée prennent de deux à quatre jours selon les plafonds et les réparations nécessaires. Le calendrier est écrit dans la soumission.' },
      { q: 'Aidez-vous à choisir les couleurs ?', a: 'Oui. Nous proposons des teintes qui photographient bien et plaisent au plus grand nombre, et nous pouvons agencer l’existant si vous ne faites qu’une partie de la maison.' },
    ],
  },
  flooring: {
    name: 'Revêtements de sol',
    tagline: 'La surface qui traverse chaque photo de chaque pièce.',
    metaTitle: 'Pose de planchers à Ottawa | Trusted Home Services',
    metaDescription:
      'Vinyle, stratifié, sablage de bois franc et pose de céramique à Ottawa. Fourniture et pose, sans acompte.',
    intro:
      'Un plancher usé est l’une des premières choses que l’on chiffre dans sa tête, et on le chiffre toujours plus cher que le coût réel. Le remplacer ou le refaire sort ce nombre de la conversation, et c’est le changement que l’on remarque dès l’entrée.',
    includes: [
      'Vinyle de luxe, souvent posé directement sur un plancher existant en bon état',
      'Bois franc sablé et refini, y compris des teintes plus foncées qui égalisent les marques',
      'Stratifié avec membrane acoustique, que les règlements de condo d’Ottawa exigent en général',
      'Céramique et porcelaine pour les entrées, cuisines et salles de bain, là où l’usure paraît en premier',
      'Dalles de tapis pour sous-sols et pièces secondaires, chaudes aux pieds et remplaçables à l’unité',
      'Planchers de garage et de service repris et revêtus, pour que la dernière pièce vue soit finie aussi',
    ],
    benefits: [
      { title: 'Cela retire un argument de négociation', text: 'Qui voit des planchers usés retranche bien plus que le coût des travaux. Un plancher neuf sort cette discussion de la table.' },
      { title: 'Il porte toute la pièce', text: 'Le plancher traverse chaque photo d’une pièce. Un revêtement frais relève la peinture, la lumière et les meubles avec lui.' },
      { title: 'Souvent plus rapide qu’on ne croit', text: 'Le vinyle et le stratifié peuvent souvent se poser sur l’existant, ce qui réduit à la fois le coût et les jours de chantier.' },
    ],
    faq: [
      { q: 'Faut-il enlever l’ancien plancher ?', a: 'Pas toujours. Le vinyle et le stratifié se posent souvent sur un plancher existant en bon état. Nous vérifions le support d’abord et vous disons quelle voie est la meilleure chez vous.' },
      { q: 'Peut-on sauver le bois franc au lieu de le remplacer ?', a: 'Souvent oui. S’il reste assez d’épaisseur, le sablage et la finition coûtent moins cher que le remplacement et rendent en général mieux qu’un plancher flottant neuf.' },
    ],
  },
  curb: {
    name: 'Attrait extérieur',
    tagline: 'La photo sur laquelle on se décide avant d’avoir lu un mot.',
    metaTitle: 'Aménagement et attrait extérieur à Ottawa | Trusted Home Services',
    metaDescription:
      'Nettoyage extérieur, aménagement paysager léger et réparations d’entrée à Ottawa pour une première impression réussie. Soumission en 24 heures.',
    intro:
      'Beaucoup de gens se font une idée d’une maison avant de sortir de la voiture, et la photo extérieure est celle sur laquelle on s’arrête ou que l’on fait défiler. Ranger l’extérieur est rapide, cela se voit depuis la rue, et cela fixe l’attente pour tout ce qui se trouve à l’intérieur.',
    includes: [
      'Pelouse tondue, arbustes taillés et arbres dégagés des murs et des fenêtres',
      'Mauvaises herbes arrachées, paillis frais et plantations de saison à l’entrée, là où l’on attend',
      'Terrasses, patios, allées et entrées lavés à pression jusqu’à leur vraie couleur',
      'Retouches de peinture sur moulures, rampes et porte d’entrée, ce que chacun touche',
      'Éclairage extérieur, numéro civique et boîte aux lettres réparés pour que l’adresse se lise d’un coup d’œil',
      'Gouttières dégagées et drainage vérifié loin des fondations, ce qu’un inspecteur regardera',
    ],
    benefits: [
      { title: 'La première photo travaille le plus', text: 'La photo extérieure est celle que l’on fait défiler ou sur laquelle on s’arrête. Une façade soignée fait la différence entre un clic et un défilement.' },
      { title: 'Elle annonce le reste', text: 'Un terrain négligé se lit comme un avertissement sur ce qu’on ne voit pas. Un extérieur soigné donne un autre ton dès la porte.' },
      { title: 'Vite fait, vite visible', text: 'La plupart des travaux extérieurs se terminent en quelques jours, ce qui en fait le plus simple à corriger quand la date de mise en vente est déjà fixée.' },
    ],
    faq: [
      { q: 'Est-ce possible en hiver ?', a: 'En partie. Le lavage à pression et les plantations attendent la saison, mais l’éclairage, les réparations d’entrée, les retouches de peinture sur les zones abritées et le nettoyage général se poursuivent toute l’année à Ottawa.' },
      { q: 'Faites-vous de l’aménagement paysager d’envergure ?', a: 'Nous faisons la remise en forme : taille, paillis, petites plantations et réparations. Pour une refonte complète du terrain, nous vous dirons franchement que cela dépasse ce que nous faisons.' },
    ],
  },
  inspection: {
    name: 'Inspection résidentielle',
    tagline: 'Trouvez ce qu’un acheteur trouverait, pendant que la décision est encore la vôtre.',
    metaTitle: 'Inspection avant mise en vente à Ottawa | Trusted Home Services',
    metaDescription:
      'Inspection avant la mise en vente à Ottawa, avec rapport écrit et photos. Trouvez les problèmes avant l’acheteur et décidez quoi corriger à vos conditions.',
    intro:
      'La plupart des vendeurs découvrent un rapport d’inspection au pire moment : après une offre, avec quelqu’un d’autre qui tient les constats. Le faire d’abord transforme la même information en une liste que vous contrôlez, et vous dit où l’argent vaut la peine d’être mis avant de le dépenser.',
    includes: [
      'Toiture, revêtement, fenêtres et drainage qui s’éloigne de la maison',
      'Fondation, structure et tout signe visible de mouvement',
      'Panneau électrique, câblage et état des prises',
      'Alimentation et évacuation de plomberie, appareils et chauffe-eau',
      'Chauffage, climatisation et ventilation',
      'Isolation et ventilation du grenier, et toute trace d’humidité',
      'Sous-sol vérifié pour les infiltrations et l’humidité',
      'Un rapport écrit avec photos, en langage clair plutôt qu’en jargon de métier',
    ],
    benefits: [
      { title: 'Aucune surprise après l’offre', text: 'Un constat que vous connaissiez déjà est une ligne de plus. Le même constat découvert par un acheteur devient une baisse de prix et une raison d’hésiter.' },
      { title: 'Vous décidez ce qui vaut la peine', text: 'Le rapport en main avant la mise en vente, vous choisissez quoi réparer et quoi déclarer et refléter dans le prix. Cela évite aussi de mettre de l’argent dans des travaux dont la maison n’avait pas besoin.' },
      { title: 'Cela devient une pièce à montrer', text: 'Remettre une inspection récente et les factures de ce qui a été corrigé lève le doute au moment précis où quelqu’un se décide.' },
    ],
    faq: [
      { q: 'Pourquoi inspecter avant la mise en vente plutôt que laisser l’acheteur le faire ?', a: 'Parce que le moment change tout. Avant la mise en vente, c’est une liste que vous contrôlez. Après une offre, c’est un levier entre les mains de quelqu’un d’autre.' },
      { q: 'Faut-il corriger tout ce que le rapport trouve ?', a: 'Non. Certains points valent la réparation, d’autres se déclarent et se reflètent dans le prix. L’idée est d’en faire une décision plutôt qu’une embuscade.' },
    ],
  },
  staging: {
    name: 'Mise en valeur',
    tagline: 'La dernière chose faite, et celle qui se retrouve sur les photos.',
    metaTitle: 'Mise en valeur résidentielle à Ottawa | Trusted Home Services',
    metaDescription:
      'Mise en valeur pièce par pièce à Ottawa, avec ce que vous possédez déjà lorsque c’est possible. Nous préparons la maison pour qu’on s’y projette.',
    intro:
      'La façon dont une famille habite une maison est rarement celle qui la vend le mieux. La mise en valeur consiste à éditer ce qui est déjà là pour qu’un inconnu qui traverse les pièces puisse y projeter sa propre vie, et elle vient en dernier, une fois toutes les équipes parties.',
    includes: [
      'Un plan pièce par pièce convenu avant que quoi que ce soit ne bouge',
      'Meubles réarrangés avec ce que vous possédez déjà partout où cela fonctionne',
      'Accessoires, lampes et textiles ajoutés là où une pièce paraît nue à la caméra',
      'Pièces vides meublées juste assez pour se lire comme chambre, bureau ou salle à manger',
      'Placards et rangements édités, parce qu’on ouvre toutes les portes',
      'Un dernier passage le matin de la séance photo',
    ],
    benefits: [
      { title: 'On cesse de mesurer et on se projette', text: 'Une pièce mise en valeur donne quelque chose où se voir. Une pièce vide ou encombrée laisse faire des calculs à la place.' },
      { title: 'Chaque pièce reçoit un usage', text: 'La chambre d’amis devenue débarras se lit comme de l’espace perdu sur un plan. Avec un usage, elle compte.' },
      { title: 'C’est fait pour l’appareil autant que pour la porte', text: 'La plupart des gens voient la maison à l’écran avant de la voir en vrai, et ce sont les photos qui décident s’ils viennent.' },
    ],
    faq: [
      { q: 'Faut-il louer des meubles ?', a: 'En général non. Nous partons de ce que vous avez et n’apportons des pièces que lorsqu’une pièce est vide ou qu’un élément nuit vraiment à la vente.' },
      { q: 'Pouvez-vous mettre en valeur une maison que nous habitons ?', a: 'Oui, et c’est le cas de la plupart de nos mises en valeur. Nous composons avec la vie quotidienne et gardons la maison vivable entre les visites.' },
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
