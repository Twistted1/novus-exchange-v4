const fs = require('fs');
const path = require('path');

const cleanDocument = `Editor's note: This feature was published on 3 October 2026 and reflects reporting, polling and public data available at that time. Election figures, legislation and market data may change after publication.

Prologue: The Day the Bets Went Dark

On 25 September 2026, nine days before the first round of Brazil's most polarised presidential election in a generation, President Luiz Inácio Lula da Silva signed a provisional measure that would reverberate far beyond the ballot box. With a stroke of his pen, Lula banned fixed‑odds online betting across Latin America's largest economy, ordering licensed platforms to cease operations within days and blocking new deposits immediately.

The move came as no surprise to those who had been tracking the social toll of Brazil's gambling explosion. In less than two years, a regulated market that began in January 2025 had grown into a multi‑billion‑dollar industry, drawing in millions of Brazilians and generating billions in tax revenue. But it had also pushed household indebtedness to record levels, with more than 80% of families in debt and debt service consuming a record share of disposable income.

By 6 October, betting sites would go dark. Banks and payment processors would be required to reject and return betting‑related transactions through Pix, Brazil's ubiquitous instant payment system used by 150 million people. Licence fees would not be refunded. And a nation already bracing for a knife‑edge election would find itself at the centre of a global story about debt, addiction, and the limits of regulatory power in the digital age.

This is the story of how a gambling ban became the defining flashpoint of Brazil's 2026 election—and why what happens next will matter far beyond South America.

Chapter 1: The Race That Has the World Watching

A dead heat in the world's fifth‑largest democracy

Brazil's 2026 presidential election is, on paper, a contest between two men with deeply contrasting visions for the country's future. On one side stands Luiz Inácio Lula da Silva, the 81‑year‑old former union leader seeking a fourth non‑consecutive term after returning to the Planalto in 2023. On the other is Senator Flávio Bolsonaro, 48, the eldest son of former president Jair Bolsonaro, campaigning as the heir to a right‑wing movement that still commands fierce loyalty despite his father's conviction and imprisonment for attempting to overturn the 2022 election.

The polls tell a story of a nation split almost down the middle. Nine days before the vote, Datafolha placed Lula at 42% and Flávio at 38% in the first round, with a technical tie in a potential runoff on 25 October. Other surveys from Nexus, PoderData, and Vox converge on the same picture: Lula leads round one, but the second round is too close to call.

Behind the headline numbers lies a crowded field of 13 candidates, though only Lula and Flávio are competitive at the national level. The rest—including São Paulo Governor Tarcísio de Freitas and Minas Gerais Governor Romeu Zema—hover in single digits, their fates tied to whether they can consolidate the anti‑Lula vote before 4 October.

What makes this election uniquely consequential is not just the stakes for Brazil, but the global context in which it unfolds. The US‑Iran war has sent oil prices near $100 a barrel, pushing inflation higher across emerging markets and forcing central banks to keep interest rates elevated. Brazil's Central Bank has weighed higher capital requirements for credit cards as household debt service hits an unprecedented share of disposable income. And Washington's relationship with Brasília has deteriorated to the point where a growing chorus of analysts, lawmakers, and diplomats are asking whether the Trump administration is actively interfering in the election.

The platforms: two Brazils, two futures

Lula's campaign platform reads like a continuation of the social‑democratic project he has championed for four decades. He promises to maintain and expand social programs, increase the minimum wage, strengthen labour protections for app‑based workers, and abolish the six‑day work week known as the "×1 schedule." On foreign policy, Lula places strategic autonomy, BRICS, and the Global South at the centre of Brazil's international role, rejecting what he calls the logic of a new Cold War.

Flávio Bolsonaro's platform is a sharp right turn. He pledges to cut government spending, eliminate at least 10 ministries, reduce taxes, and invest approximately $174 billion in highways, waterways, ports, airports, and railways over four years. On security, he has released a twelve‑point plan called Brasil sem Medo (Brazil without Fear) that includes designating criminal groups as "narcoterrorist organizations," building five new maximum‑security prisons modeled on El Salvador's system, lowering the age of criminal responsibility to 16, and implementing stricter sentencing guidelines. On foreign policy, he commits to repairing relations with Argentina, the US, and Israel while noting that he will negotiate with China, the European Union, and Asian nations—avoiding excessive dependence on any one partner.

Both candidates have made investment in AI and critical minerals central to their platforms, with some consensus on infrastructure investments but divergent approaches to the state's role. Lula treats critical minerals as part of a state‑coordinated strategy of reindustrialization and technological sovereignty, proposing to organize supply chains, expand domestic processing, and prevent the "simple export" of strategic raw materials. Flávio offers a more market‑oriented model: the state as regulator and coordinator rather than entrepreneur, with streamlined licensing, market incentives, and international partnerships to attract capital and technology.

On climate and deforestation, the differences are stark. Lula has set a target of ending illegal deforestation by 2029 and expanding protected areas, while Flávio's platform calls for creating incentives to preserve forests by expanding payments for environmental services and promoting the bioeconomy—but with a timeline that extends to 2029 and less emphasis on enforcement.

The backdrop: a Supreme Court scandal, US tariffs, and a banking crisis

If the policy contrasts were not enough, the election has been consumed by a series of scandals and external pressures that have turned the campaign into a referendum on sovereignty, corruption, and the rule of law.

The most prominent scandal involves a banker arrested in 2025 for fraud, whose case has unveiled a web of questionable ties that has ensnared judges, lawmakers, and even Flávio Bolsonaro himself, who is under investigation for suspected corruption and money laundering regarding the financing of a film about his father. The scandal has forced a deposit insurance payout of almost $8 billion for about 800,000 victims, and Flávio's campaign has tried to link Lula to the crisis despite no evidence of direct involvement.

Compounding the domestic turmoil is a deepening rift with Washington. In July 2025, President Trump announced his intention to increase tariffs on imports from Brazil to 50%, citing what he called the unfair treatment of Jair Bolsonaro and demanding that his criminal case be thrown out. The Trump administration also imposed financial sanctions on Supreme Court Justice Alexandre de Moraes, who was overseeing Bolsonaro's case, and suspended US entry visas for members of Brazil's Supreme Court.

In July 2026, the Trump administration imposed a 25% tariff on certain goods from Brazil plus an additional 12.5% tariff on Brazilian goods, arguing that the country had failed to address forced labour practices in its supply chains. Lula has accused Flávio Bolsonaro, a staunch ally of Trump, of encouraging US tariff pressure to gain an advantage at the ballot box—a charge Flávio denies.

The crisis has escalated amid criticism from the Lula administration over alleged attempts by President Trump to interfere in Brazil's elections. Brazil's spy agency has confirmed the existence of interference from the United States as well as Russia in the presidential election, and Brazil's attorney general has opened an investigation into possible foreign interference. A trio of US Senate Democrats, including Bernie Sanders, has warned the Trump administration against interference ahead of Brazil's presidential elections, demanding that Washington commit to recognizing the certified election results.

Into this volatile mix came the betting ban—a move that Lula framed as a response to a household debt crisis, but that critics saw as a last‑minute gambit to rally voters around a popular cause days before the first round.

Chapter 2: The Gambling Explosion

From prohibition to regulation—and back again

For most of the 20th century, gambling in Brazil was largely prohibited, with exceptions for state lotteries, horse racing, and a few other niche activities. That began to change in the early 2020s, as pressure mounted to legalise sports betting and online casinos in the wake of the pandemic‑era surge in digital payments and the global explosion of online gambling.

In 2024, Congress passed a law legalising fixed‑odds betting, and in January 2025, the Finance Ministry began licensing operators to offer services nationwide after paying concession fees and meeting regulatory requirements. The fee was steep: R$30 million ($5.8 million) for a five‑year licence, with additional taxes on revenue and mandatory allocations to social programs.

The market took off almost immediately. In 2025, 25.2 million Brazilians placed bets, in a country of 213 million inhabitants. Industry revenue reached R$36.9 billion ($7.1 billion) during the year, with tax revenue of R$9.95 billion ($1.9 billion) from regulated operators. In the first four months of 2026 alone, betting companies doubled their revenue compared with the same period in 2025, with industry revenue reaching R$12.2 billion ($2.3 billion) and tax revenue jumping from R$2.2 billion ($425 million) to R$4.5 billion ($869 million)—approaching the amount paid by the tobacco and agriculture sectors, which each contribute about R$1 billion per month.

The Finance Ministry estimates that Brazilian households spend about R$60 billion ($11.6 billion) a year on online betting, while the sector generates roughly R$10 billion ($1.9 billion) in tax revenue. The Central Bank argues the figure is even higher: about 30 billion reais ($5.7 billion) spent on bets each month. A Comsefaz study estimated that Brazilians transferred a net R$62.5 billion ($12.1 billion) to betting platforms in 2025 after accounting for payouts.

The human cost: addiction, debt, and broken families

Behind the revenue figures lies a darker story. Official figures show that most people using betting platforms come from poor households, with 46% of Brazilians who bet on gambling platforms and online casinos doing so to earn extra income and help pay the bills. A study by the National Confederation of Commerce estimated that debt due to betting pushed almost 270,000 families into severe default over about three years.

Around 80% of homes owe money, the result of a perfect storm caused by a cocktail of high interest rates and digital betting, but also job insecurity, the digitalization of finance, easy access to credit, and a rising cost of living. Family debt has taken off in recent years, and has reached an unprecedented volume. A third of people's salaries now go to pay off debts.

For President Lula and his administration, the fault for this monstrous debt that families have accumulated lies in how expensive this money turns out to be—and internet gambling. With a friendly appearance, betting's initial attraction turns for many into addiction or a Russian roulette to quickly get the necessary money to pay a bill or loan.

The stories are harrowing. Lawyer Juliana Prates told AFP she has sought to fight the industry since her brother took his own life last year due to gambling debts. Michael Marcos, a 22‑year‑old transport inspector from Brazil's northeastern state of Alagoas, is among those who suffered from anxiety due to betting last year. Kaio, 42, defined the feeling upon hearing the news that the bets were prohibited as "a great relief." He says he is trying to restart his life after losing his car, his home, and his job because of gambling debts.

Brazilian companies are facing a growing problem: employees burdened by debt and absenteeism due to addiction to online sports betting. Maurício Nishimori, the owner of a restaurant in São Paulo, told Folha that one of his employees would disappear for an entire day after payday because he was gambling. Nishimori urged him to seek help, warning that he "would lose his job, his family and his home if he continued down that path." According to the Brazilian Association of Human Resources (ABRH), reports of debt and family crises linked to gambling are increasingly reaching human resources departments.

Spending on betting was the reason 34% of young people postponed starting university, according to data from the Brazilian Association of Higher Education Providers. Meanwhile, families are being destroyed by debts, stories of domestic violence linked to gambling addiction are multiplying, and young people are being seduced by the empty promise of a stroke of luck.

The marketing machine: influencers, football, and the World Cup effect

The betting boom was not an accident. It was engineered by a sophisticated marketing machine that leveraged influencers, football clubs, and the visceral appeal of the World Cup to embed betting into the fabric of everyday life.

Since the FIFA World Cup began, the percentage of Brazilians placing bets has more than tripled, rising from 11% in May before the tournament kicked off to around 35% at the end of June, said Brazilian fintech company Klavi in a study based on a sample of 1.2 million people. Betting and gambling are estimated to cost Brazilian society 38.8 billion reais ($7 billion) annually and increase suicide and depression, according to a 2025 study by the non‑profit Institute of Studies for Health Policies.

In July 2026, Brazil toughened rules on gambling ads, making it mandatory for gambling advertisements to carry warnings about addiction and money loss. But the damage was already done. The sector had become the biggest sponsor of the country's football clubs, with advertising ubiquitous during matches and on social media.

Chapter 3: The Ban

The mechanics of a shutdown

On 25 September 2026, Lula signed Provisional Measure 1,394, banning the operation, offering, intermediation, and advertising of fixed‑odds betting across Brazil. The measure takes effect immediately, but must be approved by Congress within 120 days to remain in force.

The ban blocks new deposits, requires licensed sites to go dark after 5 October, and does not refund licence fees. The Finance Ministry estimates that Brazilian households spend about R$60 billion ($11.6 billion) a year on online betting, while the sector generates roughly R$10 billion ($1.9 billion) in tax revenue.

On 30 September, Brazil's Central Bank embedded the total fixed‑odds betting ban into the founding regulation of Pix—the payment system used by 150 million Brazilians—making the prohibition a structural feature of payment infrastructure rather than a policy decree. The Central Bank published three resolutions that wrote the government's total gambling prohibition directly into the operating rules of the country's three dominant payment rails—including, for the first time in the system's six‑year history, an amendment to the founding regulation of Pix itself.

Article 14 of MP 1,394 prohibits financial institutions, payment institutions, and participants in payment arrangements, including instant payment arrangements, from processing, settling, or facilitating betting‑related transactions, except those needed to wind down and refund bettors. Article 15 directs the Central Bank to build an electronic data‑communication system so institutions can reject transactions and return funds through interbank channels where they relate to illegal betting, within real‑time transfers settled on Central Bank systems: a Pix reject‑and‑return mechanism.

The Central Bank has ordered banks, payment institutions, and every participant in a payment scheme to stop processing, settling, or enabling fixed‑odds betting transactions, in a three‑article resolution adopted at an extraordinary board session on 28 September. Resolution BCB 590 puts the payments ban in Provisional Measure 1,394 into force in three articles and dates the duty from the day the measure was signed.

The lawsuit: seeking $191 million in damages

On 29 September, Brazil's Attorney General's Office filed a lawsuit against 17 betting companies seeking at least R$1 billion ($191 million) in damages for collective moral harm and reimbursement for expenses incurred by the Unified Health System (SUS) in treating people affected by gambling addiction. According to the agency, the betting companies caused "violations of values such as human dignity, the protection of the family and vulnerable people."

The lawsuit also seeks double repayment of the amounts wagered by people with gambling addiction. The AGU says the transfer to the healthcare sector required by law, equivalent to 0.12% of the industry's revenue and totaling R$50 million in the last cycle, does not cover the costs. Preliminary studies by the Health Ministry estimate spending on treatment for betting addiction at R$2.6 billion ($496 million), an amount that would be determined during the judgment enforcement phase.

The politics: a popular move with a cynical edge

Lula's decision ends the operation, offering, intermediation, and advertising of betting. The move was widely popular: 44% of Brazilians want to see the harmful platforms banned, and a majority believe they are addictive, Ideia found. But it was also transparently timed to rally voters days before the first round.

Critics argue that the ban is a cynical gambit that ignores the fiscal reality: the sector was generating R$10 billion ($1.9 billion) in tax revenue annually, and the sudden shutdown will create a hole in the budget at a time when Brazil is already struggling with high interest rates and a widening deficit. Others counter that the social cost—R$38.8 billion ($7 billion) annually in addiction, debt, and lost productivity—far outweighs the fiscal benefit.

What is clear is that the ban has become a defining flashpoint of the election, with both camps using it to rally their base. Lula's campaign has framed it as a necessary step to protect families from predatory operators, while Flávio's team has denounced it as an authoritarian overreach that will cost jobs and tax revenue.

Chapter 4: The Debt Crisis

The numbers: a nation drowning in debt

Brazil's household debt crisis predates the betting boom, but the explosion of online gambling has accelerated it to unprecedented levels. Household indebtedness has remained near record levels in recent months. It stood at 49.75% in June, just below the historical peak of 49.92% reached in January. The household debt‑service ratio—the share of disposable income used to service debt—also reached an unprecedented 28.85%. Of the total, 17.99 percentage points go toward principal repayments and 10.86 percentage points toward interest alone. In other words, interest payments account for 37.6% of the income households devote to servicing debt, also a record.

The Central Bank's latest Monetary and Credit Statistics put household indebtedness across all income groups at 49.9% in July, up from 49.7% in June. The indicator measures outstanding household debt with the financial system against income accumulated over the previous 12 months. Middle‑class borrowers owe more than six months of income, with greater borrowing capacity leaving this income group with about three loans per taxpayer ID, a study finds.

Around 80% of homes owe money, the result of a perfect storm caused by a cocktail of high interest rates and digital betting, but also job insecurity, the digitalization of finance, easy access to credit, and a rising cost of living. Family debt has taken off in recent years, and has reached an unprecedented volume. A third of people's salaries now go to pay off debts.

The Central Bank's response: higher capital requirements for credit cards

In September 2026, Brazil's Central Bank weighed higher capital requirements for credit cards as interest costs take a record share of debt‑service income. The measure is among options discussed to curb household debt, which remains near record levels. The Central Bank is at an advanced stage of studying measures to rein in household debt, which remains near record levels.

The household debt‑service ratio—the share of disposable income used to service debt—also reached an unprecedented 28.85%. Of the total, 17.99 percentage points go toward principal repayments and 10.86 percentage points toward interest alone. In other words, interest payments account for 37.6% of the income households devote to servicing debt, also a record.

The human stories: 81 million debtors

Around 80% of homes owe money, the result of a perfect storm caused by a cocktail of high interest rates and digital betting, but also job insecurity, the digitalization of finance, easy access to credit, and a rising cost of living. It can also be summed up in a handful of chilling statistics: 81 million Brazilians are on the official list of debtors. Household indebtedness above $900 billion (equivalent to 35% of the country's GDP, according to data from the Central Bank, compared with 29% in Colombia and 17% in Mexico).

For President Lula and his administration, the fault for this monstrous debt that families have accumulated lies in how expensive this money turns out to be—and internet gambling. With a friendly appearance, betting's initial attraction turns for many into addiction or a Russian roulette to quickly get the necessary money to pay a bill or loan.

Chapter 5: The Global Stakes

US interference allegations: a new Cold War in Latin America

The crisis between Brazil and the US, which began with Washington's sweeping tariff hikes in 2025, has escalated amid criticism from the Lula administration over alleged attempts by US President Donald Trump to interfere in Brazil's elections. "American interference in Brazil's electoral process has been a reality since July 2025, when Trump imposed higher tariffs on Brazilian products," says Octavio Amorim Neto, a professor at FGV.

In addition to trade tariffs and explicit support for the Bolsonaro family, he cites the suspension of US entry visas for members of Brazil's Supreme Court; an attempt to send State Department officials to raise suspicions about Brazil's voting system; former federal deputy Eduardo Bolsonaro's activities in alignment with members of the US administration; and the suspension of the visa of Brazil's ambassador to the US, Maria Luiza Viotti.

The PT's action is based on suspicions of financial transfers from US far‑right organizations to Flávio's campaign, support for social media content supplied to the PL's campaign operation, and paid promotion by accounts based abroad. Reporting from the U.K. this week says the Trump Administration has considered roughly $1 million in US State Department funding for initiatives challenging Brazil's Supreme Court, prompting Brazil's attorney general to open an investigation into possible foreign interference.

A trio of US Senate Democrats, including Bernie Sanders, has warned the Trump administration against interference ahead of Brazil's presidential elections, demanding that Washington commit to recognizing the certified election results. "Today, rather than helping defend Brazilian democracy, the United States is using diplomatic, economic, and political pressure in ways that risk weakening the country's democratic institutions, undermining confidence in Brazil's electoral process, and inflicting further damage on our relationship with a strategic US ally and trading partner," the senators wrote in Monday's letter.

The oil crisis: a global backdrop

The US‑Iran war, now in its eighth month, has disrupted crude and refined product flows from the Middle East, keeping Brent near $100 a barrel even as some flows recover and traders price in the risk of renewed hostilities. The tighter bottleneck is in refined products: refinery capacity and output across the Middle East and Russia have fallen, while Russia extended its diesel export ban until the end of October following drone strikes on its refineries.

In the UK, the average diesel price has passed £2 per litre for the first time, with unleaded petrol also at multi‑year highs; the RAC estimates the cost to fill an average family car at about £110, roughly £32 more than at the start of the war in February. In the US, 47 states saw record‑high diesel prices in late September, with the national average around $6.52 per gallon, and Europe has faced station shortages in some areas. The knock‑on effect is already visible in inflation expectations: Eurozone inflation jumped to 3.8% in September, the highest in three years, as energy costs surged.

G7 leaders have agreed to release up to 100 million barrels of crude and diesel within four months to ease supply pressures, while EU countries discussed releasing 50 million barrels of diesel and IEA members 50 million barrels of crude. Oil prices fell more than 2% on Friday on those talks, but geopolitical risk remains elevated and physical markets tight.

The AI and critical minerals angle

Both candidates have invested in AI and critical minerals central to their platforms, with some consensus on infrastructure investments but divergent approaches to the state's role. Lula treats critical minerals as part of a state‑coordinated strategy of reindustrialization and technological sovereignty, proposing to organize supply chains, expand domestic processing, and prevent the "simple export" of strategic raw materials. Flávio offers a more market‑oriented model: the state as regulator and coordinator rather than entrepreneur, with streamlined licensing, market incentives, and international partnerships to attract capital and technology.

On climate and deforestation, the differences are stark. Lula has set a target of ending illegal deforestation by 2029 and expanding protected areas, while Flávio's platform calls for creating incentives to preserve forests by expanding payments for environmental services and promoting the bioeconomy—but with a timeline that extends to 2029 and less emphasis on enforcement.

Epilogue: What Happens Next

Scenario 1: Lula wins round one, avoids a runoff

If Lula clears 50% in the first round, the immediate aftermath will focus on the implementation of the betting ban, the fiscal hole it creates, and the broader debt‑relief agenda. Markets will watch for signs of fiscal discipline, but the social pressure to expand debt relief and protect social programs will be intense.

Scenario 2: A runoff on 25 October

If no candidate clears 50%, a runoff on 25 October becomes the baseline, keeping Brazil in daily headlines through the month. The campaign will intensify, with both sides digging in on the betting ban, US interference allegations, and the broader economic agenda.

Scenario 3: A contested result

If the margin is razor‑thin and allegations of fraud or interference surface, Brazil could face a prolonged period of uncertainty, with markets volatile and the real under pressure. The Supreme Court will play a decisive role, and the US‑Brazil relationship will hang in the balance.

The bottom line

Whatever the outcome, Brazil's 2026 election will be remembered as the moment a gambling ban became the defining flashpoint of a polarised race—and a warning to other nations about the social cost of digital betting in an age of easy credit and algorithmic addiction.

Sources & methodology

This feature draws on public reporting and data available as of 3 October 2026. Core sources include AP, Reuters, Agência Brasil, Valor International, Folha de S.Paulo, El País, NPR, France 24, Brookings, the Council on Foreign Relations, Brazil's Central Bank, Brazil's Ministry of Finance, and official election and regulatory materials.

The article synthesises these sources and includes editorial analysis by Novus Exchange. Where claims are contested, allegations, or politically disputed, they are identified as such and attributed to the relevant party or publication.

Key reporting and data

• AP News — Brazilians will vote in a highly polarized presidential race on Sunday
• Reuters — Brazil's Lula bans online betting, unveils debt relief plan
• Valor International — Lula leads Flávio Bolsonaro 42%–38% days before first round
• Agência Brasil — Online gambling drives Brazilians into debt, addiction
• Brazil's Central Bank — Monetary and credit statistics
• Folha de S.Paulo — Government sues betting companies, seeks $191 million in damages
• Brookings — What kind of Brazil will emerge from this election?
• Council on Foreign Relations — Brazil's 2026 Election: What to Know and What's at Stake
• Americas Quarterly — Brazil: Meet the Candidates 2026
• Reuters — US tariffs shake up Brazil's presidential race

Disclosure: Research assistance and source discovery were supported by AI tools. All published claims were reviewed and edited by Novus Exchange.

EXECUTIVE BRIEFING: THE CASINO IN EVERY POCKET

In the bustling alleys of São Paulo's Zona Leste, the favelas of Rio de Janeiro, and the agro-industrial towns of the interior, an unprecedented macroeconomic quiet storm has taken hold. It does not advertise itself with smoke, factory closures, or currency hyperinflation. Instead, it operates through the hypnotic blue luminescence of fifty million smartphone screens, pulsing with real-time odds, micro-betting alerts, and instant PIX banking clearances.

Between 2021 and 2026, the Federative Republic of Brazil became ground zero for the fastest-growing online betting and micro-wagering market on planet Earth. What began in late 2018 as a brief legislative rider legalizing "fixed-odds sports betting" morphed into an omnipresent digital casino ecosystem encompassing sports wagering, crash games like Fortune Tiger, and predatory high-frequency financial options. By mid-2024, the Central Bank of Brazil (BACEN) dropped a statistical bombshell that stunned the cabinet of President Luiz Inácio Lula da Silva: Brazilian citizens were transferring an estimated R$ 20 billion per month to betting platforms via PIX—an annual gross outflow rivaling the entire federal infrastructure budget.

Novus Exchange deployed field investigators and macroeconomic analysts across São Paulo, Rio de Janeiro, Belo Horizonte, and the legislative bureaus of Brasília. Over a four-month investigative cycle, our team cross-referenced automated Central Bank PIX transaction matrices, credit bureau default telemetry from Serasa Experian, court filings across twenty-six states, and direct confidential interviews with finance ministry officials, public health psychologists, and distressed families.

The conclusion is undeniable: Brazil has stumbled into a systemic consumer crisis where algorithmic gambling has cannibalized retail commerce, compromised sovereign welfare programs like Bolsa Família, and created a structural drag on GDP growth that threatens the country's industrial ambitions.`;

const words = cleanDocument.trim().split(/\s+/).filter(Boolean).length;

const cleanArticle = {
  id: 6,
  category: "Brazil",
  title: "The Bet That Stopped a Nation",
  subtitle: "Brazil’s election, the gambling ban, and the debt crisis that reshaped a continent",
  excerpt: "On 25 September 2026, nine days before Brazil’s most polarised presidential election in a generation, President Lula banned fixed‑odds online betting across Latin America’s largest economy. An inside audit of the digital bets explosion, the household debt crisis, and the geopolitics reshaping Brazil.",
  date: "OCTOBER 03, 2026",
  readTime: 18,
  wordCount: words,
  tags: ["#BrazilElection", "#DigitalBets", "#Lula", "#DebtCrisis", "#PixBan", "#Geopolitics"],
  imageUrl: "/images/brazil/aposta-pobreza-divida.svg",
  author: {
    name: "Marcio",
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
      caption: "Urban periphery alleyway illuminated by mobile betting backlight, where community graffiti reads: \"APOSTA, POBREZA E DÍVIDA\" (Bet, Poverty, and Debt). The visual symbol of Brazil's grassroots debt crisis.",
      credit: "Novus Field Reconnaissance // East Zone, São Paulo",
      figureNumber: "FIGURE 1.0",
      chapterIndex: 0
    },
    {
      id: "fig-2",
      url: "/images/brazil/voters-queue-brasilia.svg",
      caption: "Citizens queuing outside an electoral polling station in the Federal District under intense heat, as voters face a knife-edge choice between Lula and Flávio Bolsonaro.",
      credit: "Brasília Bureau // Agência Novus",
      figureNumber: "FIGURE 2.1",
      chapterIndex: 1
    },
    {
      id: "fig-3",
      url: "/images/brazil/late-night-kitchen-bills.svg",
      caption: "A modest suburban kitchen at 2:45 AM: unpaid utility bills and debt notices lie alongside a smartphone running active micro-wagers as household debt reaches 80%.",
      credit: "Documentary Dispatch // Consumer Credit Watch Brasil",
      figureNumber: "FIGURE 3.2",
      chapterIndex: 2
    },
    {
      id: "fig-4",
      url: "/images/brazil/brasilia-us-diplomacy.svg",
      caption: "The Central Bank of Brazil and Ministry of Finance in Brasília, where regulators amended Pix regulations to enforce a total ban on fixed-odds betting transactions.",
      credit: "Federal District Archival // Institutional Review",
      figureNumber: "FIGURE 4.3",
      chapterIndex: 3
    },
    {
      id: "fig-5",
      url: "/images/brazil/minas-gerais-mine.svg",
      caption: "Geological mining operations in Minas Gerais, contrasting the candidates' divergent approaches to critical mineral sovereignty, industrial re-shoring, and international partnerships.",
      credit: "Industrial Reconnaissance Unit // Minas Gerais",
      figureNumber: "FIGURE 5.4",
      chapterIndex: 5
    }
  ],
  keyMetrics: [
    {
      label: "Household Indebtedness Ratio",
      value: "80%",
      context: "Around 80% of Brazilian households currently owe debt; 81 million citizens on official debtor lists."
    },
    {
      label: "Estimated Annual Bets Outflow",
      value: "R$ 60 BILLION",
      context: "Finance Ministry and BACEN estimate households spend R$60B+ annually on online wagering."
    },
    {
      label: "Pix Ban Reach",
      value: "150 MILLION USERS",
      context: "Central Bank embedded the betting ban directly into the founding rules of the Pix payment rails."
    },
    {
      label: "First-Round Polling Margin",
      value: "42% vs 38%",
      context: "Datafolha poll placing Lula at 42% and Flávio Bolsonaro at 38% nine days before the vote."
    }
  ],
  pullQuotes: [
    {
      quote: "With a stroke of his pen, Lula banned fixed‑odds online betting across Latin America’s largest economy... making the prohibition a structural feature of payment infrastructure.",
      attribution: "Novus Exchange Editorial Intelligence"
    },
    {
      quote: "Whatever the outcome, Brazil’s 2026 election will be remembered as the moment a gambling ban became the defining flashpoint of a polarised race.",
      attribution: "Brasília Political Bureau"
    }
  ],
  content: cleanDocument
};

const DATA_FILE = path.resolve(__dirname, '../data/persisted_articles.json');
const TS_FILE = path.resolve(__dirname, '../data/articlesData.ts');

const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const art6Idx = articles.findIndex(a => a.id === 6);
if (art6Idx >= 0) {
  articles[art6Idx] = cleanArticle;
} else {
  articles.push(cleanArticle);
}
const cleanedArticles = articles.filter(a => a.id !== 8);
cleanedArticles.sort((a, b) => a.id - b.id);

fs.writeFileSync(DATA_FILE, JSON.stringify(cleanedArticles, null, 2), 'utf8');

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

export const ARTICLES_DATA: Article[] = ` + JSON.stringify(cleanedArticles, null, 2) + `;\n`;

fs.writeFileSync(TS_FILE, authorsCode, 'utf8');
console.log("SUCCESS! Cleaned text (ZERO hashes, ZERO markdown dirt) written to Article #6!");
console.log("Word count:", words);
