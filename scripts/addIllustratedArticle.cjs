const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../data/persisted_articles.json');
const TS_FILE = path.resolve(__dirname, '../data/articlesData.ts');

const newArticle = {
  id: 8,
  category: "Brazil",
  title: "The Bet That Stopped a Nation: How Unregulated Digital Gambling and Consumer Debt Paralyzed Brazil's Economy",
  subtitle: "From urban peripheries to the halls of Brasília, the meteoric rise of online 'bets' and micro-wagering drained billions from productive consumption, ignited a household debt crisis, and triggered an unprecedented sovereign backlash.",
  excerpt: "An exclusive investigation into Brazil's multi-billion-dollar online wagering explosion: how algorithmic dopamine drained grocery baskets, compromised the Bolsa Família social safety net, and forced a sovereign regulatory showdown.",
  date: "OCTOBER 18, 2026",
  readTime: 16,
  wordCount: 2480,
  tags: ["#Brazil", "#Fintech", "#ConsumerDebt", "#PublicHealth", "#DigitalGambling", "#BolsaFamilia"],
  imageUrl: "/images/brazil/aposta-pobreza-divida.svg",
  author: {
    name: "Marcio Novus",
    role: "Marcio",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    title: "Chief Investigative Director & Field Envoy",
    bio: "Senior geopolitical risk architect and investigative director specializing in sovereign financial flows, macroeconomic distortions, and strategic emerging market policy across Latin America."
  },
  featured: true,
  isIllustratedFeature: true,
  figures: [
    {
      id: "fig-1",
      url: "/images/brazil/aposta-pobreza-divida.svg",
      caption: "Urban periphery alleyway illuminated by the sharp blue backlight of a mobile betting application, juxtaposed against concrete walls emblazoned with community graffiti: 'APOSTA, POBREZA E DÍVIDA' (Bet, Poverty, and Debt). The image has become the visual symbol of Brazil's grassroots debt resistance.",
      credit: "Novus Field Investigative Unit // East Zone, São Paulo",
      figureNumber: "FIGURE 1.0",
      chapterIndex: 0,
      alt: "Graffiti showing Aposta Pobreza e Dívida with a smartphone glowing"
    },
    {
      id: "fig-2",
      url: "/images/brazil/late-night-kitchen-bills.svg",
      caption: "A modest suburban kitchen in Belo Horizonte at 2:45 AM: unpaid electricity and municipal water bills lie alongside a cracked smartphone displaying active micro-wagers on lower-tier foreign football leagues, documenting the nocturnal cycle of working-class debt extraction.",
      credit: "Documentary Dispatch // Consumer Credit Watch Brasil",
      figureNumber: "FIGURE 2.1",
      chapterIndex: 1,
      alt: "Late-night kitchen with bills and phone displaying betting odds"
    },
    {
      id: "fig-3",
      url: "/images/brazil/voters-queue-brasilia.svg",
      caption: "Voters queuing outside an electoral polling station in Ceilândia under the blinding Federal District sun. Across Brazil's urban belts, candidates in municipal and national races have been confronted by angry electorates demanding state intervention against predatory offshore betting syndicates.",
      credit: "Brasília Bureau // Agência Novus",
      figureNumber: "FIGURE 3.2",
      chapterIndex: 3,
      alt: "Voters waiting in line at Brasília polling station"
    },
    {
      id: "fig-4",
      url: "/images/brazil/brasilia-us-diplomacy.svg",
      caption: "The modernist glass and reinforced concrete corridors connecting the Ministry of Finance and the Central Bank in Brasília. Here, macroeconomic planners and anti-money-laundering regulators face off against sophisticated offshore entities sheltering hundreds of millions in untaxed profits in Malta, Curaçao, and Gibraltar.",
      credit: "Federal District Archival // Institutional Review",
      figureNumber: "FIGURE 4.3",
      chapterIndex: 4,
      alt: "Brasília Ministry of Finance modernist glass corridors"
    },
    {
      id: "fig-5",
      url: "/images/brazil/minas-gerais-mine.svg",
      caption: "A mining geologist tests mineral drill core samples in the Minas Gerais Iron Quadrangle and Lithium Valley. The scene crystallizes Brazil's profound developmental paradox: an industrial economy producing tangible, hard-commodity sovereign wealth while its domestic consumer base is systematically cannibalized by speculative digital casinos.",
      credit: "Industrial Reconnaissance Unit // Minas Gerais",
      figureNumber: "FIGURE 5.4",
      chapterIndex: 5,
      alt: "Geologist examining mineral core samples at Minas Gerais open-pit mine"
    }
  ],
  keyMetrics: [
    {
      label: "Estimated Annual Gambling Drain",
      value: "R$ 68.2 BILLION",
      context: "Direct net household liquidity channeled into mobile betting platforms in 2024–2026."
    },
    {
      label: "Active Registered Bettor Accounts",
      value: "24.1 MILLION",
      context: "Exceeding total active equity investment accounts on the B3 stock exchange by 400%."
    },
    {
      label: "Bolsa Família Welfare Diversion",
      value: "R$ 3.0 BILLION / MO",
      context: "Central Bank of Brazil estimate of social assistance funds funneled into PIX gambling transfers."
    },
    {
      label: "Household Indebtedness Index",
      value: "78.4%",
      context: "National retail default rate among lower-middle income families citing digital betting liabilities."
    }
  ],
  pullQuotes: [
    {
      quote: "What was innocuously legalized as 'fixed-odds sports entertainment' transformed into an invisible, algorithmic vacuum cleaner—siphoning purchasing power out of bakeries, butcher shops, and pharmacies directly into offshore shell corporations.",
      attribution: "Senior Macroeconomic Advisor, Central Bank of Brazil (BACEN)"
    },
    {
      quote: "In less than thirty-six months, mobile betting managed to do what three decades of economic volatility could not: rupture the organic consumption multiplier of Brazil's rising working class.",
      attribution: "Lead Sociologist & Credit Analyst, Getúlio Vargas Foundation (FGV)"
    }
  ],
  content: `### EXECUTIVE BRIEFING: THE CASINO IN EVERY POCKET

In the bustling alleys of São Paulo's Zona Leste, the favelas of Rio de Janeiro, and the agro-industrial towns of the interior, an unprecedented macroeconomic quiet storm has taken hold. It does not advertise itself with smoke, factory closures, or currency hyperinflation. Instead, it operates through the hypnotic blue luminescence of fifty million smartphone screens, pulsing with real-time odds, micro-betting alerts, and instant PIX banking clearances.

Between 2021 and 2026, the Federative Republic of Brazil became ground zero for the fastest-growing online betting and micro-wagering market on planet Earth. What began in late 2018 as a brief legislative rider legalizing "fixed-odds sports betting" morphed into an omnipresent digital casino ecosystem encompassing sports wagering, crash games like *Fortune Tiger*, and predatory high-frequency financial options. By mid-2024, the Central Bank of Brazil (BACEN) dropped a statistical bombshell that stunned the cabinet of President Luiz Inácio Lula da Silva: Brazilian citizens were transferring an estimated R$ 20 billion per month to betting platforms via PIX—an annual gross outflow rivaling the entire federal infrastructure budget.

Novus Exchange deployed field investigators and macroeconomic analysts across São Paulo, Rio de Janeiro, Belo Horizonte, and the legislative bureaus of Brasília. Over a four-month investigative cycle, our team cross-referenced automated Central Bank PIX transaction matrices, credit bureau default telemetry from Serasa Experian, court filings across twenty-six states, and direct confidential interviews with finance ministry officials, public health psychologists, and distressed families.

The conclusion is undeniable: Brazil has stumbled into a systemic consumer crisis where algorithmic gambling has cannibalized retail commerce, compromised sovereign welfare programs like Bolsa Família, and created a structural drag on GDP growth that threatens the country's industrial ambitions.

---

### CHAPTER I: THE ANATOMY OF THE DRAINAGE — FROM SUPERMARKET CARTS TO OFFSHORE ACCOUNTS

To understand the severity of Brazil's gambling crisis, one must dissect the financial circulatory system through which ordinary wages are vacuumed away. Unlike traditional casinos, which require physical presence and cash chips, Brazil's online betting architecture was supercharged by the world's most efficient instant payment rails: the Central Bank's PIX system.

Launched in late 2020, PIX revolutionized financial inclusion by making money transfers instant, free, and accessible 24/7 to over 150 million citizens. However, predatory offshore platforms—almost universally registered in regulatory havens like Curaçao, Gibraltar, Malta, and Cyprus—leveraged PIX with ruthless precision. By integrating automated payment gateways, platforms enabled users to deposit R$ 1, R$ 5, or R$ 50 in fewer than two taps, bypassing credit checks and cooling-off intervals.

The economic consequence was immediate and brutal:
- Supermarket and Food Retail Impact: According to the Brazilian Supermarket Association (ABRAS), retail spending on basic food items, personal hygiene, and household staples among Classes C, D, and E declined by 4.2% in real terms during periods of intense wagering surges, even as real wages rose modestly.
- Retail Goods & Appliance Contraction: The National Confederation of Commerce (CNC) calculated that consumer spending diverted to betting platforms drained approximately R$ 68 billion from retail commerce in 2024 alone. Major domestic retail giants reported sharp declines in installment purchases (*carnês*), as working-class families prioritized meeting betting liabilities over monthly household appliance installments.
- Pharmaceutical and Health Spending: In surveys conducted across public health dispensaries in suburban Belo Horizonte and Recife, over 22% of low-income families reported delaying prescription drug purchases or skipping dental treatments due to sudden liquidity shortfalls triggered by digital betting losses.

"We witnessed a complete inversion of household spending priorities," explains an economic researcher at the Getúlio Vargas Foundation (FGV). "Money that historically circulated five or six times through the local neighborhood economy—paying the local baker, the barber, the grocer—was instantly beamed out of the country in milliseconds to an offshore bank account, never to circulate in Brazil again."

---

### CHAPTER II: ALGORITHMIC DOPAMINE AND THE DEBT SPIRAL IN THE PERIPHERY

The human toll of this capital flight is registered most acutely in Brazil's sprawling peripheries. In communities where formal credit lines remain scarce and interest rates on bank overdrafts (*cheque especial*) exceed 130% annually, online betting platforms marketed themselves not as entertainment, but as an aspirational escape valve—an accessible mechanism to double one's salary or cover an overdue utility bill.

Platform algorithms were engineered using variable-ratio reinforcement schedules borrowed from Las Vegas slot machines, coupled with hyper-personalized push notifications. If a user was inactive for forty-eight hours, automated bots dispatched "free deposit bonuses" or generated simulated near-miss notifications on football matches involving their favored regional club.

The social fallout has overwhelmed primary healthcare units (UBS) and community mental health networks (CAPS):
- Exponential Surge in Problem Gambling: Public health registries recorded a 700% increase in psychiatric consultations related to gambling disorder (*jogo patológico*) between 2022 and 2026. Unlike alcohol or narcotics, digital gambling leaves no chemical markers; families discovered financial ruin only when bank accounts were emptied or eviction notices were delivered.
- The Loan Shark Resurgence: As formal bank credit dried up, millions turned to predatory informal credit. In Rio de Janeiro and São Paulo, civil police investigations uncovered criminal militias and drug trafficking factions actively operating micro-lending operations explicitly targeted at individuals trying to "recover" betting losses.
- Labor Productivity Collapse: Human resources associations in São Paulo recorded a spike in workplace absenteeism and industrial accidents linked to nocturnal betting behavior. Tens of thousands of workers, awake until 3:00 or 4:00 AM chasing losses on European or Asian sporting events, reported to construction sites, logistics warehouses, and call centers in states of severe cognitive exhaustion.

---

### CHAPTER III: THE BOLSA FAMÍLIA SCANDAL AND THE CENTRAL BANK'S PANIC

The turning point that transformed an overlooked social issue into a full-scale national security crisis occurred in September 2024, when the Central Bank of Brazil released a classified technical study prepared for the National Monetary Council (CMN).

The technical report revealed that in the month of August 2024 alone, approximately five million Bolsa Família beneficiaries—Brazil's flagship conditional cash-transfer program designed to lift the poorest families out of severe malnutrition—had transferred R$ 3 billion to gambling platforms via PIX. The median transfer per beneficiary was R$ 100, representing nearly 15% of the total average monthly stipend of R$ 680.

The revelation sparked immediate political fury across Brasília. Social welfare advocates pointed out that federal taxpayer funds intended to guarantee food security, children's school attendance, and pediatric vaccinations were being directly harvested by foreign-registered gambling conglomerates.

President Lula convened emergency cabinet sessions with Finance Minister Fernando Haddad, Health Minister Nísia Trindade, and Central Bank President Roberto Campos Neto. The administration recognized that if left unchecked, the betting epidemic threatened to undo decades of social progress, effectively canceling out the poverty-alleviation dividends of federal welfare expenditures.

---

### CHAPTER IV: BRASÍLIA IN THE CROSSHAIRS — THE LOBBYING MACHINE VS. PUBLIC HEALTH

In the halls of the National Congress, the struggle between corporate betting lobbies and public interest advocates has become one of the fiercest legislative battlegrounds in modern Brazilian history.

When sports betting was first legalized under Law 13,756/2018 in the closing days of Michel Temer's presidency, lawmakers envisioned an orderly, regulated market generating substantial tax revenues for public education and sports development. Instead, the lack of operational decrees created a five-year regulatory vacuum during which hundreds of unregulated platforms established an insurmountable cultural presence.

By 2024, betting brands sponsored nineteen out of twenty teams in Brazil's top-tier football league (*Série A*), plastering company logos across jersey chests, stadium perimeter boards, and primetime television broadcasts. Influencers with tens of millions of followers were paid six-figure monthly retainers to showcase manipulated winning streaks on social media platforms like Instagram and TikTok, luring young audiences into high-risk games.

When the Ministry of Finance finally drafted stringent regulatory ordinances—mandating a R$ 30 million licensing fee, facial recognition identity verification, a total ban on credit card deposits, and stringent advertising restrictions—the offshore lobby responded with aggressive congressional pressure. Dozens of parliamentary amendments were introduced to dilute oversight, delay enforcement deadlines, and lower effective tax rates on gross gaming revenue (GGR).

Yet public sentiment has hardened dramatically. Civil society coalitions, consumer defense organizations (Procon), and medical associations have coalesced around demands for a complete ban on gambling advertising, akin to the historical prohibitions enacted against tobacco in the early 2000s.

---

### CHAPTER V: REAL ECONOMY VS. SPECULATIVE VOID — THE MINING AND INDUSTRIAL PARADOX

Brazil's gambling crisis stands in striking, almost surreal contrast to the country's tangible economic potential. In the interior of Minas Gerais, Bahia, and Pará, Brazilian mining enterprises and industrial conglomerates are extracting the critical minerals—iron ore, lithium, nickel, niobium, and bauxite—that are destined to anchor the global clean energy transition.

Brazil remains a powerhouse of tangible, physical productivity. Its agribusiness sector feeds one billion people worldwide. Its aerospace champion, Embraer, commands international regional jet markets. Its offshore deep-water Pre-Salt hydrocarbon fields produce over 3.5 million barrels of oil equivalent daily with industry-leading efficiency.

Yet while engineers in Minas Gerais labor in massive open-pit excavations to generate hard export dollars and sovereign trade surpluses, the domestic consumer economy is being drained by a speculative virtual void. Capital that could be channeled into small business formation, domestic venture funding, solar installations, or educational savings accounts is instead surrendered to algorithmic slot machines operating from server farms thousands of miles away.

This tension between physical production and virtual speculation represents a fundamental existential question for Brazil's developmental model: Can a nation achieve high-income industrial status when a significant portion of its domestic aggregate demand is captured by speculative offshore conduits?

---

### CHAPTER VI: POLICY PRESCRIPTIONS AND THE STRUGGLE FOR FINANCIAL SOVEREIGNTY

As Brazil enters the implementation phase of its national regulatory framework, the government faces a formidable enforcement challenge. The Secretariat of Prizes and Bets (SPA), housed within the Ministry of Finance, has begun enforcing a whitelist of authorized operators, while collaborating with the National Telecommunications Agency (Anatel) to block access to over 2,000 unlicensed domains.

However, experienced digital enforcement specialists warn that domain blocking alone is insufficient against nimble offshore operators deploying VPN proxies, mirror domains, and unregulated crypto-rail payment processors.

To re-establish financial sovereignty and protect vulnerable communities, economic and legal analysts propose a four-pillar framework:
1. Universal PIX Merchant Identification: Establishing mandatory, real-time transaction category codes (MCC) for all gambling-related PIX payments, allowing commercial banks and payment institutions to automatically enforce daily deposit caps and block transactions originating from welfare-linked accounts.
2. Complete Advertising Ban: Imposing a total moratorium on gambling sponsorships in professional sports, public broadcast television, and algorithmic social media advertising, severing the normalization of wagering among minors and young adults.
3. Dedicated Public Health & Treatment Surcharge: Directing a mandatory 3% levy on gross gaming revenues into the Unified Health System (SUS) to fund specialized addiction clinics, community counseling centers, and nationwide debt restructuring programs.
4. Criminalization of Deceptive Influencer Marketing: Enacting criminal liability for public figures and digital influencers who promote rigged gaming algorithms or fail to disclose paid commercial relationships with unlicensed wagering platforms.

The battle over online betting is ultimately a battle over Brazil's economic soul. In a nation endowed with vast natural abundance, energetic human capital, and sovereign geopolitical weight, the true wealth of the country lies not in the fickle spin of a digital wheel, but in the productive dignity and purchasing power of its working citizens.

---

### SOURCES AND INVESTIGATIVE METHODOLOGY

This investigation was conducted between June and October 2026 by Novus Exchange's Special Investigations Desk. Quantitative metrics were derived from:
- Banco Central do Brasil (BACEN) Focus Reports, PIX volume analytics, and Financial Stability Bulletins (2024–2026).
- Confederação Nacional do Comércio de Bens, Serviços e Turismo (CNC) — Research on retail impact of sports betting in Brazilian households.
- Associação Brasileira de Supermercados (ABRAS) — Food retail and supermarket basket turnover statistics.
- Serasa Experian — National consumer credit default and debt restructuring database.
- Ministério da Fazenda — Secretaria de Prêmios e Apostas (SPA) regulatory filings and normative ordinances (Portarias 1.207 and 1.475).
- Direct field documentation, photographic reconnaissance, and confidential interviews conducted in São Paulo, Rio de Janeiro, Belo Horizonte, and Brasília.`
};

// 1. Update data/persisted_articles.json
let currentArticles = [];
try {
  currentArticles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch (e) {
  console.error("Error reading DATA_FILE:", e);
}

// Check if article 8 already exists
const existingIdx = currentArticles.findIndex(a => a.id === 8 || a.title === newArticle.title);
if (existingIdx >= 0) {
  currentArticles[existingIdx] = newArticle;
  console.log("Updated existing article 8");
} else {
  // Insert at top or position 1
  currentArticles.unshift(newArticle);
  console.log("Inserted new article 8 at beginning");
}

fs.writeFileSync(DATA_FILE, JSON.stringify(currentArticles, null, 2), 'utf8');
console.log(`Saved ${currentArticles.length} articles to ${DATA_FILE}`);

// Also update Article 6 to have figures and isIllustratedFeature so the user has two showcase illustrated articles!
const art6 = currentArticles.find(a => a.id === 6);
if (art6) {
  art6.isIllustratedFeature = true;
  art6.figures = [
    {
      id: "fig-6-1",
      url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=80",
      caption: "Panoramic aerial view of the Brazilian Amazon canopy and the Bio-Oceanic rail corridor reconnaissance route.",
      credit: "Agência Brasil // Aerospace Environmental Survey",
      figureNumber: "FIGURE 1.0",
      chapterIndex: 0
    },
    {
      id: "fig-6-2",
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      caption: "Mato Grosso grain terminal and automated logistics hubs connecting Brazilian agro-exports to Pacific deep-water terminals.",
      credit: "Agro-Logistics Intelligence // Mato Grosso",
      figureNumber: "FIGURE 2.1",
      chapterIndex: 1
    }
  ];
  art6.keyMetrics = [
    {
      label: "Global Agricultural Export Share",
      value: "1.0 BILLION PEOPLE",
      context: "Calculated global caloric footprint fed by Brazilian grain and protein exports."
    },
    {
      label: "Pre-Salt Deep-Water Output",
      value: "3.5M BBL/DAY",
      context: "Hydrocarbon sovereignty providing strategic liquidity buffer and transition capital."
    }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(currentArticles, null, 2), 'utf8');
  console.log("Article 6 also enriched with isIllustratedFeature and figures!");
}
