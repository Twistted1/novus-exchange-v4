const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../data/persisted_articles.json');
const TS_FILE = path.resolve(__dirname, '../data/articlesData.ts');

const chapters = [
  {
    heading: "STRATEGIC INTELLIGENCE ASSESSMENT: THE SOUTHERN COLOSSUS",
    content: `While international strategic discourse remains obsessively fixated upon the transatlantic corridor and the high-tech contest in East Asia, the fundamental resource foundation of the twenty-first century is being anchored in the Southern Hemisphere. Among the emerging powers of the Global South, the Federative Republic of Brazil occupies a uniquely decisive geopolitical position.

Brazil is not merely a regional South American hegemon; it is an irreplaceable planetary agricultural superpower, the custodian of the Earth's primary terrestrial biodiversity and freshwater lung, a leading deep-water offshore hydrocarbon producer (the Pre-Salt basins), and the historic diplomatic linchpin of the expanded BRICS architecture.

Under the current geopolitical horizon, Brasilia is executing an extraordinarily sophisticated, high-stakes diplomatic and economic doctrine: Active Non-Alignment Combined with Asymmetric Agro-Sovereignty. By refusing to align subserviently with Washington's new Cold War posturing while concurrently deepening structural, bilateral trade integration with Beijing, Brazil is demonstrating how a resource-rich sovereign democracy can exploit multipolar fragmentation to achieve national industrialization and regional autonomy.

Novus Exchange deployed field analysts across Brasilia, the agribusiness corridors of Mato Grosso, and the naval command posts of Manaus and Belém. This comprehensive report deconstructs the physical, economic, and strategic pillars of Brazil's ascendant multi-polar statecraft.

Brazil represents the vanguard of a new geopolitical reality: resource superpowers that possess the physical goods—food, water, clean energy, and critical minerals—that industrial powers cannot live without, granting them sovereign bargaining power unmatched in post-colonial history. In an era marked by climatic shocks and systemic supply chain fractures, the nation that can guarantee food and energy security holds structural sway over consumer empires.`
  },
  {
    heading: "CHAPTER I: AGRO-SOVEREIGNTY AS A GEOPOLITICAL WEAPON",
    content: `To understand modern global power, one must recognize that food is a strategic weapon no less lethal than semiconductors or energy pipelines. In the domain of agricultural calories and proteins, Brazil holds absolute global dominance:

- The World's Breadbasket: Brazil is the world's undisputed top exporter of soybeans, beef, poultry, raw sugar, coffee, and orange juice, while ranking second in corn and fourth in overall grain production. Brazilian agricultural yields feed over one billion human beings across the globe each day.
- The Chinese Feeding Matrix: Over seventy percent of China's total soybean imports—the foundational protein input for China's multi-billion-head livestock industry—originate directly in the red soils of Mato Grosso, Goiás, and Paraná.
- The Reversal of Dependence: Western analysts often characterize the Brazil-China relationship as a neo-colonial arrangement where Brazil exports raw commodities in exchange for Chinese manufactured goods. In reality, the dependency is radically mutual: China cannot feed its domestic population without Brazilian agricultural yields. If Brazilian soybean exports to China were interdicted or halted, urban food inflation in Chinese coastal metropolises would trigger an immediate domestic political crisis within weeks.

Recognizing this asymmetric leverage, Brasilia has successfully negotiated monumental bilateral concessions from Beijing:
1. Local Currency Clearing: Over 80% of agricultural bilateral contracts are now invoiced and settled directly in Chinese Yuan and Brazilian Reais, bypassing the US dollar and Western financial intermediaries.
2. Massive Infrastructure Investments: Chinese state construction enterprises are investing tens of billions of dollars constructing the Bioceanic Railway corridor—a trans-continental freight rail network designed to connect Brazil's agricultural heartland directly through Bolivia and Peru to the Pacific port of Chancay. Once completed, this route will slash transit times for Brazilian exports to Asia by more than twenty days, bypassing the vulnerability of the Panama Canal entirely.
3. Technology Transfer Mandates: Joint aerospace research programs, such as the China-Brazil Earth Resources Satellite (CBERS) series, provide Brazil with sovereign satellite monitoring capabilities independent of NASA or European Space Agency feeds.

Brazilian agricultural research corporation Embrapa has transformed tropical savannah soils into hyper-productive agricultural plains, generating two and three harvests annually on the same soil through advanced crop rotation, biological nitrogen fixation, and precision telemetry.`
  },
  {
    heading: "CHAPTER II: THE BIO-ECONOMY VS. ECOLOGICAL INTERFERENCE",
    content: `The strategic crown jewel of Brazilian sovereignty—and its primary point of friction with the Global North—is the Amazon Basin. Encompassing over six million square kilometers, the biome represents more than twenty percent of global liquid freshwater reserves, billions of tons of sequestered carbon, and an unmapped treasure vault of genetic biodiversity.

For decades, Western environmental discourse has treated the Amazon not as sovereign Brazilian territory, but as a "common heritage of mankind" that Western governments have a moral right to internationalize, regulate, and oversee. Within the Brazilian Armed Forces and the Ministry of Foreign Affairs (Itamaraty), this posture is recognized as Eco-Imperialist Encroachment:

- The Myth of Internationalization: Repeated statements by European heads of state suggesting that foreign powers should impose economic boycotts or deploy international peacekeeping missions to police Amazonian deforestation are viewed in Brasilia as thinly veiled attempts to freeze Brazilian sovereign development and seize control of the basin's immense untapped mineral reserves—including gold, niobium, uranium, and rare earths.
- The Amazon Shield Doctrine (SIPAM/SIVAM): In response, the Brazilian military has executed the Amazon Surveillance and Defense Doctrine, deploying low-altitude radar planes, sovereign satellite imaging constellations, and riverine combat patrol vessels to fortify the northern borders against unauthorized foreign NGOs, illegal biopiracy operations, and transnational narcotrafficking networks.
- The Sovereign Bio-Economy: Brasilia is pioneering an indigenous bio-economic development model that rejects both predatory deforestation and foreign-imposed preservation traps. By investing in regional biotechnology institutes, processing native botanicals (such as açaí, andiroba, and cupuaçu) directly within the Amazonian states, and empowering traditional riverine communities, Brazil is creating high-value industrial exports while keeping the forest canopy intact.

Furthermore, Brazil is utilizing sovereign carbon registries and biodiversity credits to force foreign pharmaceutical and cosmetic corporations to pay equitable royalties on natural genetic material harvested from sovereign soil. The Amazon is no longer an open biological frontier for foreign multinational exploitation; it is a fortified bio-economic sanctuary protected by sovereign law.`
  },
  {
    heading: "CHAPTER III: THE ENERGY EQUATION — THE PRE-SALT FORTRESS AND THE GREEN TRANSITION",
    content: `Unlike Western nations that struggle with dirty, coal-dominated electrical grids, Brazil possesses one of the cleanest and most resilient domestic energy matrices on Earth:
- Over eighty-five percent of Brazil's domestic electricity is generated through zero-carbon renewable sources, dominated by massive hydroelectric generation, booming wind corridors in the Northeast, and rapid solar farm expansion across Minas Gerais.
- Concurrently, Brazil is a premier global hydrocarbon power. The deep-water Pre-Salt offshore oil reserves, buried under two thousand meters of ocean water and five thousand meters of subsea salt rock off the coast of Rio de Janeiro and Santos, produce over 3.5 million barrels of high-grade crude oil per day.
- Sovereign operator Petrobras has developed world-leading deep-water extraction technologies, enabling Brazil to extract offshore oil at breakeven costs below $35 per barrel—generating massive sovereign royalty streams that fund domestic public education, healthcare, and high-tech defense research.

This dual energy profile grants Brazil extraordinary freedom of maneuver: it can credibly champion global decarbonization and green industrialization while simultaneously accumulating colossal export surpluses from global energy markets.

Brazil's ethanol biofuel infrastructure is another pillar of resilience. With flex-fuel automotive fleets running on domestically produced sugarcane ethanol for over four decades, Brazil is completely insulated from foreign oil embargos and refined fuel shortages that paralyze other emerging economies. The country produces its own fuel, feeds its own people, and generates surplus clean energy to power heavy domestic metallurgy.`
  },
  {
    heading: "CHAPTER IV: ACTIVE NON-ALIGNMENT AND THE EXPANDED BRICS ARCHITECTURE",
    content: `Under the sophisticated diplomatic leadership of Itamaraty, Brazil has rejected the Western demand that the Global South choose sides in the confrontation between the United States, Russia, and China:

- Refusal of Sanctions and Weapon Transfers: Brazil unequivocally rejected Western pressure to supply munitions to Ukraine or join unilateral secondary sanctions regimes against Russia, maintaining essential supplies of Russian nitrogen, phosphate, and potassium fertilizers that are vital to Brazilian agricultural productivity. Without Russian fertilizers, Brazilian grain yields would collapse by 40%, triggering famine across the developing world.
- Leading the BRICS Expansion: Brazil was instrumental in shaping the historic expansion of BRICS (incorporating Saudi Arabia, the UAE, Iran, Egypt, and Ethiopia), ensuring that the bloc remains a pragmatic economic coalition focused on financial sovereignty, reform of the United Nations Security Council, and the promotion of South-South technology transfer—rather than an anti-Western military alliance.
- Diplomatic Bridge-Building: Brasilia maintains open, cooperative diplomatic channels with Washington and European capitals, partnering on clean energy and democratic governance while refusing to surrender its independent foreign policy autonomy.

This diplomatic agility is rooted in Itamaraty's historic tradition of universalism: maintaining diplomatic relations with every sovereign state on Earth, resolving border disputes through peaceful arbitration, and championing the inviolability of state sovereignty. Brazil acts as an indispensable diplomatic mediator capable of convening dialogues between Moscow, Beijing, Washington, and the capitals of Africa and Latin America.`
  },
  {
    heading: "CHAPTER V: CONCLUSION — THE EMERGENCE OF A TROPICAL HEGEMON",
    content: `The story of the twenty-first century will not be written exclusively in the northern latitudes. The trajectory of human civilization will be shaped equally by whether the sovereign nations of the Global South can break free from historical cycles of debt servitude, resource exploitation, and political subordination.

Brazil is demonstrating that sovereign power in a fragmented world does not require nuclear warheads or overseas military bases. It requires what Brazil possesses in abundance: the calories to feed nations, the clean energy to power industries, the water to sustain life, and the sovereign diplomatic dignity to look every global superpower in the eye as an equal.

The Southern Colossus has awakened. As multilateral institutions constructed in 1945 decay, Brazil stands at the epicenter of a new diplomatic architecture—one where sovereign nations negotiate on the basis of tangible resources, reciprocal respect, and multipolar realism.

Independent observers and global investors who continue to view Brazil through the outdated lens of regional instability are missing the defining transformation of our era. The future of global commerce, environmental equilibrium, and geopolitical balance runs straight through Brasilia. With unshakeable resource sovereignty, non-aligned statecraft, and industrial resilience, Brazil is forging a sovereign path that other emerging powers are racing to emulate across the Global South.`
  },
  {
    heading: "CHAPTER VI: STRATEGIC LOGISTICS DOSSIER — THE BIOCEANIC CORRIDOR AND CHANCAY MEGA-PORT",
    content: `The geopolitical map of South America is being physically redrawn by concrete and steel. For two centuries, Brazilian commerce looked eastward across the Atlantic toward Europe and North America. Today, the economic center of gravity has shifted irrevocably to the Pacific Rim.

The linchpin of this eastward-to-westward redirection is the Bioceanic Corridor, an ambitious 3,200-kilometer intermodal highway and rail trunk line connecting the agricultural heartlands of Campo Grande and Mato Grosso do Sul directly through the Chaco of Paraguay, northern Argentina, and across the Andes into the deep-water Pacific ports of Ilo and Chancay in Peru.

Novus Exchange field observers in Chancay, sixty kilometers north of Lima, inspected the newly operational mega-port facility constructed by Cosco Shipping Ports:
1. Deep-Water Natural Draft: Chancay features a natural harbor depth of 17.8 meters, capable of berthing the world's largest Triple-E ultra-large container vessels and Capesize bulk carriers that cannot navigate the shallow locks of the Panama Canal.
2. The Panama Bypass: For Brazilian grain, pork, beef, and mineral shipments bound for Shanghai, Qingdao, and Yokohama, routing through Chancay slashes sea transit times from 42 days (via Cape Horn or Panama) down to 23 days. This nineteen-day reduction cuts ocean freight fuel costs by 28% and guarantees fresher agricultural arrival quality.
3. Automated Customs Telemetry: Chancay and Brazilian logistics terminals are interconnected via automated digital customs clearing protocols, utilizing distributed ledger manifests that clear customs clearances while vessels are still mid-ocean.

By securing direct, sovereign access to the Pacific Ocean, Brazil and its South American neighbors have effectively eliminated their historical geographical isolation. South America is no longer a peripheral backyard subject to foreign naval blockades or canal tariffs; it has transformed into a continental bridge linking the Atlantic and Pacific oceans on its own sovereign terms.`
  },
  {
    heading: "CHAPTER VII: DEFENSE INDUSTRIAL INDEPENDENCE — GRIPEN AND SUBMARINE SOVEREIGNTY",
    content: `Sovereignty without the means of self-defense is an illusion. Recognizing that agricultural and mineral wealth invites predatory foreign interventions, Brazil has systematically revitalized its domestic defense-industrial base (BID).

The pillar of this aerospace modernization is the Gripen E/F fighter program, executed through an unprecedented technology transfer agreement between Saab and Brazilian aerospace titan Embraer. Under this covenant, Brazilian aeronautical engineers participated directly in the co-development of the aircraft, culminating in the establishment of the Gripen Design and Development Center (GDDN) in Gavião Peixoto, São Paulo. Brazil does not merely purchase foreign fighter jets; it manufactures them domestically, writes indigenous mission avionics code, and possesses sovereign intellectual property to adapt the platform for South American theater operations.

Concurrently, the Brazilian Navy's Submarine Development Program (PROSUB) at the Itaguaí Naval Complex represents the most technologically ambitious naval engineering project south of the equator. Featuring five state-of-the-art conventional Scorpène-class diesel-electric attack submarines and culminating in the construction of the Álvaro Alberto, South America's first nuclear-powered attack submarine, PROSUB provides the Brazilian Armed Forces with an impenetrable sub-surface deterrent across the "Blue Amazon"—the vast 4.5 million square kilometer maritime exclusive economic zone housing the Pre-Salt oil reserves.

By refusing to depend on foreign defense patrons and anchoring military capability in domestic industrial research, Brazil ensures that its foreign policy decisions cannot be vetoed by overseas weapons embargoes. In a volatile world where great powers increasingly resort to armed coercion, Brazil stands armed with both diplomatic stature and the sovereign industrial steel required to defend its people, borders, and national destiny.`
  }
];

const fullContent = chapters.map(c => `### ${c.heading}\n\n${c.content}`).join('\n\n---\n\n');
const words = fullContent.trim().split(/\s+/).filter(Boolean).length;

const originalArticle6 = {
  id: 6,
  category: "Brazil",
  title: "The South American Pivot: Bio-Economic Sovereignty, The Amazon Shield, and Brazil's Multi-Polar Statecraft",
  subtitle: "As global powers fragment into hostile blocs, Brazil is quietly executing the most ambitious non-aligned diplomatic and agricultural strategy in the Southern Hemisphere.",
  excerpt: "An inside audit of the Brasilia-Beijing corridor, agro-sovereignty, the defense of the Amazon basin, and the emergence of a 21st-century resource superpower.",
  date: "OCTOBER 12, 2026",
  readTime: 15,
  wordCount: words,
  tags: ["#Brazil", "#BRICS", "#AgroSovereignty", "#AmazonGeopolitics", "#MultiPolarity"],
  imageUrl: "/images/brazil/aposta-pobreza-divida.svg",
  author: {
    name: "Marcio Novus",
    role: "Marcio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    title: "Chief Investigative Director & Editor-in-Chief",
    bio: "Senior geopolitical researcher and editor at Novus Exchange, investigating asymmetric power networks, sovereign statecraft, and resource diplomacy."
  },
  featured: true,
  isIllustratedFeature: true,
  figures: [
    {
      id: "fig-1",
      url: "/images/brazil/aposta-pobreza-divida.svg",
      caption: "Urban periphery alleyway illuminated by mobile communications backlight, where community graffiti underscores Brazil's grassroots debt and economic resistance.",
      credit: "Novus Field Reconnaissance // East Zone, São Paulo",
      figureNumber: "FIGURE 1.0",
      chapterIndex: 0
    },
    {
      id: "fig-2",
      url: "/images/brazil/minas-gerais-mine.svg",
      caption: "Geological reconnaissance in Minas Gerais' iron and lithium valleys, anchoring Brazil's critical mineral reserves that industrial powers depend upon.",
      credit: "Industrial Reconnaissance Unit // Minas Gerais",
      figureNumber: "FIGURE 2.1",
      chapterIndex: 1
    },
    {
      id: "fig-3",
      url: "/images/brazil/brasilia-us-diplomacy.svg",
      caption: "Modernist glass architecture of the Ministry of Foreign Affairs (Itamaraty) in Brasília, executing Active Non-Alignment statecraft across the expanded BRICS.",
      credit: "Federal District Archival // Institutional Review",
      figureNumber: "FIGURE 3.2",
      chapterIndex: 4
    },
    {
      id: "fig-4",
      url: "/images/brazil/voters-queue-brasilia.svg",
      caption: "Voters queuing outside an electoral polling station in the Federal District, exemplifying Brazil's energetic democratic foundation and sovereign public sphere.",
      credit: "Brasília Bureau // Agência Novus",
      figureNumber: "FIGURE 4.3",
      chapterIndex: 5
    },
    {
      id: "fig-5",
      url: "/images/brazil/late-night-kitchen-bills.svg",
      caption: "Suburban household kitchen in Belo Horizonte balancing energy expenditures and the cost of living against national renewable and biofuel buffers.",
      credit: "Documentary Dispatch // Consumer Credit Watch Brasil",
      figureNumber: "FIGURE 5.4",
      chapterIndex: 3
    }
  ],
  keyMetrics: [
    {
      label: "Global Agricultural Caloric Footprint",
      value: "1.0 BILLION PEOPLE",
      context: "Calculated global population fed by Brazilian grain, soy, and protein exports daily."
    },
    {
      label: "Pre-Salt Deep-Water Output",
      value: "3.5M BBL / DAY",
      context: "Offshore hydrocarbon sovereignty operating with breakeven extraction costs below $35/barrel."
    },
    {
      label: "Clean Renewable Grid Share",
      value: "85.4%",
      context: "Domestic electrical matrix powered by hydroelectric, solar, wind, and ethanol biofuels."
    },
    {
      label: "Bilateral Local Currency Clearing",
      value: "80%+",
      context: "Bilateral agro-contracts with China settled directly in RMB and BRL, bypassing the USD."
    }
  ],
  pullQuotes: [
    {
      quote: "In an era marked by climatic shocks and systemic supply chain fractures, the nation that can guarantee food and energy security holds structural sway over consumer empires.",
      attribution: "Senior Analyst, Agricultural Geopolitics Desk"
    },
    {
      quote: "The Amazon is no longer an open biological frontier for foreign multinational exploitation; it is a fortified bio-economic sanctuary protected by sovereign law.",
      attribution: "Sovereign Defense & Border Intelligence Directorate"
    }
  ],
  content: fullContent
};

// Update data/persisted_articles.json
const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const art6Idx = articles.findIndex(a => a.id === 6);
if (art6Idx >= 0) {
  articles[art6Idx] = originalArticle6;
} else {
  articles.push(originalArticle6);
}
// Sort by ID
articles.sort((a, b) => a.id - b.id);
fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf8');

// Update data/articlesData.ts
const authorsCode = `import { Article, Author, SigningAuthorType } from "../types";

export const AUTHORS: Record<SigningAuthorType, Author> = {
  "Novus AI": {
    name: "Novus AI",
    role: "Novus AI",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    title: "Autonomous Intelligence Engine v4.2",
    bio: "Automated machine intelligence synthesising satellite telemetry, shipping manifests, financial clearing logs, and sovereign trade telemetry in real time."
  },
  "Marcio": {
    name: "Marcio",
    role: "Marcio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    title: "Chief Investigative Director & Editor-in-Chief",
    bio: "Senior geopolitical researcher and editor at Novus Exchange, investigating asymmetric power networks, sovereign statecraft, and resource diplomacy."
  },
  "Guest": {
    name: "Guest Correspondent",
    role: "Guest",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    title: "Contributing Senior Analyst & Field Envoy",
    bio: "Independent sovereign analyst, field researcher, and intelligence fellow contributing investigative field dispatches via the Novus open reporting wire."
  }
};

export const ARTICLES_DATA: Article[] = ` + JSON.stringify(articles, null, 2) + `;\n`;

fs.writeFileSync(TS_FILE, authorsCode, 'utf8');
console.log("Successfully restored original Article 6: The South American Pivot! Total words:", words);
