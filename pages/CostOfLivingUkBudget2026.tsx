import { useEffect } from "react";
import { CircleDashed, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import ChatWidget from "../components/ChatWidget";
import { FacebookLogo, OFFICIAL_SOCIALS, XLogo } from "../components/SocialMediaIcons";

/**
 * COST OF LIVING FILM EMBED
 * Paste the final iframe `src` here when the premiere file is published.
 * Leave this as an empty string until then.
 * Do not guess a Facebook watch URL, a Rumble watch URL, or a file path.
 */
export const COST_OF_LIVING_FILM_EMBED_URL = "";

/** PLACEHOLDER: no TikTok account URL is in the repo. Replace with the account URL. */
export const TIKTOK_ACCOUNT_URL = "";

/** PLACEHOLDER: no Rumble channel URL is in the repo. Replace with the channel URL. */
export const RUMBLE_CHANNEL_URL = "";

const PAGE_TITLE = "Cost of living: UK Budget 2026 | Novus Exchange";
const PAGE_DESCRIPTION =
  "Premiere times and sources for Novus Exchange's UK Budget 2026 cost-of-living posts, including the film on Facebook and Rumble. Information only, not financial advice.";

const META_TAGS: ReadonlyArray<readonly [string, string]> = [
  ['meta[name="description"]', PAGE_DESCRIPTION],
  ['meta[property="og:title"]', PAGE_TITLE],
  ['meta[property="og:description"]', PAGE_DESCRIPTION],
  ['meta[name="twitter:title"]', PAGE_TITLE],
  ['meta[name="twitter:description"]', PAGE_DESCRIPTION],
];

const X_ACCOUNT = OFFICIAL_SOCIALS.find((social) => social.id === "x");
const FACEBOOK_ACCOUNT = OFFICIAL_SOCIALS.find((social) => social.id === "fb");

type SourceLink = {
  label: string;
  href: string;
};

type SourceEntry = {
  id: string;
  title: string;
  cited: string;
  links: SourceLink[];
  linkNeeded: boolean;
};

const SOURCES: SourceEntry[] = [
  {
    id: "ap-norc",
    title: "AP-NORC poll, 15 October 2026",
    cited:
      "Tuesday's post cites this poll for the figure that 84% of voters call the cost of living one of the most important issues.",
    links: [],
    linkNeeded: true,
  },
  {
    id: "obr-efo",
    title: "Office for Budget Responsibility, Economic and Fiscal Outlook, paragraph 2.32",
    cited:
      "Wednesday's post cites paragraph 2.32 for the forecast that, by 2029-30, living standards per person are just 1% above the pre-pandemic level. The outlook is the one published with Budget 2026 (28 October 2026). No document URL is in this week's source files.",
    links: [],
    linkNeeded: true,
  },
  {
    id: "reuters-boe",
    title: "Reuters reporting on the Bank of England",
    cited:
      "Thursday's post (5 November 2026) cites Reuters for markets fully pricing a Bank of England rise from 3.75% to 4%, the first since August 2023. The publication date and URL are not in this week's source files.",
    links: [],
    linkNeeded: true,
  },
  {
    id: "govuk-100",
    title: "GOV.UK, £100 payment for council tax bands A–D",
    cited:
      "From January 2027, households in council tax bands A–D in England receive a one-off £100 Household Energy Payment. The devolved governments receive funding for similar support.",
    links: [
      {
        label: "What the Autumn Budget 2026 means for your energy bills",
        href: "https://www.gov.uk/government/news/what-the-autumn-budget-2026-means-for-your-energy-bills",
      },
      {
        label: "Budget 2026 (HTML)",
        href: "https://www.gov.uk/government/publications/budget-2026-document/budget-2026-html",
      },
    ],
    linkNeeded: false,
  },
  {
    id: "uswitch",
    title: "Uswitch energy price cap forecast",
    cited:
      "The week's posts cite Uswitch's average of supplier forecasts for a January rise of about 27%. The Friday post uses roughly £2,181. Drafts checked on 2 November 2026 record two figures on the same guide: a summary box of £2,181 (supplier predictions as of 26 October) and a forecast table of £2,186 (as of 29 October). Those are forecasts, not bills. The posts say Ofgem announces the cap on or before 25 November 2026.",
    links: [
      {
        label: "Uswitch energy price cap guide",
        href: "https://www.uswitch.com/gas-electricity/guides/price-cap/",
      },
    ],
    linkNeeded: false,
  },
  {
    id: "resolution-foundation",
    title: "Resolution Foundation, £1,050 figure",
    cited:
      "The posts cite a £1,050 fall (3%) between 2026-27 and 2028-29. The 29 October 2026 press release is quoted for typical incomes. The Reels drafts describe the same figure as typical non-pensioner incomes and also cite the Spread thin publication.",
    links: [
      {
        label: "Britain braced for painful second half of the Parliament (29 October 2026)",
        href: "https://www.resolutionfoundation.org/press-releases/britain-braced-for-painful-second-half-of-the-parliament/",
      },
      {
        label: "Spread thin",
        href: "https://www.resolutionfoundation.org/publications/spread-thin/",
      },
    ],
    linkNeeded: false,
  },
];

function useBudgetPageMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const previousMeta = META_TAGS.map(([selector, value]) => {
      const element = document.querySelector(selector);
      const prior = element?.getAttribute("content") ?? null;
      element?.setAttribute("content", value);
      return { element, prior };
    });

    return () => {
      document.title = previousTitle;
      previousMeta.forEach(({ element, prior }) => {
        if (!element || prior === null) return;
        element.setAttribute("content", prior);
      });
    };
  }, []);
}

function SourceAnchor({ link }: { link: SourceLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-start gap-1.5 text-sm text-[#E8C99A] hover:text-white underline decoration-[#A36E3C]/50 underline-offset-4"
    >
      <span>{link.label}</span>
      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

function PremiereCard({
  when,
  time,
  network,
  href,
  placeholder,
}: {
  when: string;
  time: string;
  network: string;
  href: string;
  placeholder: string | null;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#07090D] p-5 flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#A36E3C] font-bold">{network}</p>
        <h3 className="font-brand text-xl text-white mt-2">{when}</h3>
        <p className="font-mono text-sm text-[#D4D7DC] mt-1">{time}</p>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#E8C99A]"
        >
          <span>{network === "Facebook" ? "Novus on Facebook" : "Novus on Rumble"}</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      ) : (
        <p className="text-sm text-[#E7C27A] border border-dashed border-[#A36E3C]/50 rounded-lg px-3 py-2">
          {placeholder}
        </p>
      )}
    </article>
  );
}

function AccountCard({
  name,
  href,
  handle,
  icon,
}: {
  name: string;
  href: string;
  handle: string;
  icon: "x" | "facebook" | "placeholder";
}) {
  const body = (
    <>
      <span className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        {icon === "x" ? <XLogo className="w-4 h-4" /> : null}
        {icon === "facebook" ? <FacebookLogo className="w-5 h-5" /> : null}
        {icon === "placeholder" ? <CircleDashed className="w-4 h-4 text-[#A36E3C]" aria-hidden="true" /> : null}
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-semibold text-white">{name}</span>
        <span className="block text-[11px] font-mono text-[#A1A5AB] truncate">{handle}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#A36E3C]/50 bg-[#07090D] px-3 py-3">
        {body}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#07090D] px-3 py-3 hover:border-[#A36E3C]/50 transition-colors"
    >
      {body}
    </a>
  );
}

export default function CostOfLivingUkBudget2026() {
  useBudgetPageMeta();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filmEmbedUrl = COST_OF_LIVING_FILM_EMBED_URL.trim();
  const showFilmEmbed = filmEmbedUrl.startsWith("https://");

  return (
    <div className="relative min-h-screen bg-[#06080C] text-white selection:bg-[#C92A35] selection:text-white">
      <Navbar activeSection="" onNavigate={() => undefined} />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <header className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center space-x-1" aria-hidden="true">
                <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#A36E3C] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#A1A5AB] rounded-xs" />
              </span>
              <p className="text-[10px] font-mono text-[#A36E3C] uppercase tracking-[0.25em] font-bold">
                UK Budget 2026 · Sources
              </p>
            </div>
            <h1 className="font-brand text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mt-4">
              Cost of living: <br />
              UK Budget 2026
            </h1>
            <p className="mt-4 text-[#D4D7DC] text-base leading-relaxed border-l-2 border-[#A36E3C]/60 pl-3.5">
              Sources for this week's Novus Exchange posts on the UK Budget and the cost of living, and where the film premieres.
            </p>
            <p
              role="note"
              className="mt-6 rounded-xl border border-[#A36E3C]/50 bg-[#A36E3C]/10 px-4 py-3 text-sm sm:text-base text-[#F6E7D2] font-medium"
            >
              This page is for information only and is not financial advice.
            </p>
          </header>

          <section className="mt-12" aria-labelledby="film-heading">
            <h2 id="film-heading" className="font-brand text-2xl sm:text-3xl tracking-wide">
              The film
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-[#A1A5AB] leading-relaxed">
              Nine minutes on energy, food, bills and who carries the cost. Final video URLs are not published yet. Both premiere times are London time.
            </p>

            {showFilmEmbed ? (
              <div className="mt-6 rounded-xl border border-white/10 bg-black overflow-hidden">
                <iframe
                  src={filmEmbedUrl}
                  title="Cost of living: UK Budget 2026"
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <PremiereCard
                network="Facebook"
                when="Tuesday 3 November 2026"
                time="17:00 (London)"
                href={FACEBOOK_ACCOUNT?.url ?? ""}
                placeholder="Facebook page link needed"
              />
              <PremiereCard
                network="Rumble"
                when="Wednesday 4 November 2026"
                time="17:00 (London)"
                href={RUMBLE_CHANNEL_URL.trim()}
                placeholder="Rumble channel — link needed. No Rumble URL is in the site yet."
              />
            </div>

            {showFilmEmbed ? null : (
              <div className="mt-4 rounded-xl border border-dashed border-white/15 bg-[#07090D] px-6 py-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A36E3C]">Premiere player</p>
                <p className="mt-2 font-editorial text-xl text-white italic">
                  The film will play here once its embed URL is published.
                </p>
                <p className="mt-2 text-sm text-[#A1A5AB]">Nothing is embedded yet. Watch the premieres above.</p>
                {filmEmbedUrl ? (
                  <p className="mt-2 text-sm text-[#F0B4B8]">
                    The embed setting is filled in, but the player only loads an https URL.
                  </p>
                ) : null}
              </div>
            )}
          </section>

          <section className="mt-14" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="font-brand text-2xl sm:text-3xl tracking-wide">
              Sources
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-[#A1A5AB] leading-relaxed">
              These are the sources behind the claims in this week's posts. Where a URL was in the week's drafts, it is linked. Where it was not, the source is named with no invented link.
            </p>
            <ol className="mt-6 space-y-4">
              {SOURCES.map((source, index) => (
                <li key={source.id} className="rounded-xl border border-white/10 bg-[#07090D] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-sans text-base sm:text-lg font-semibold text-white">
                      <span className="font-mono text-[#A36E3C] mr-2" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {source.title}
                    </h3>
                    {source.linkNeeded ? (
                      <span className="shrink-0 rounded-full border border-dashed border-[#C92A35]/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#F0B4B8]">
                        Link needed
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-[#D4D7DC] leading-relaxed">{source.cited}</p>
                  {source.links.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {source.links.map((link) => (
                        <li key={link.href}>
                          <SourceAnchor link={link} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14" aria-labelledby="accounts-heading">
            <h2 id="accounts-heading" className="font-brand text-2xl sm:text-3xl tracking-wide">
              Novus on social
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-[#A1A5AB] leading-relaxed">
              X and Facebook use the accounts already confirmed for Novus. TikTok and Rumble are marked until those URLs are added.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <AccountCard
                name="X"
                href={X_ACCOUNT?.url ?? ""}
                handle={X_ACCOUNT ? X_ACCOUNT.handle : "Link needed"}
                icon="x"
              />
              <AccountCard
                name="TikTok"
                href={TIKTOK_ACCOUNT_URL.trim()}
                handle={TIKTOK_ACCOUNT_URL.trim() ? TIKTOK_ACCOUNT_URL : "Link needed — placeholder"}
                icon="placeholder"
              />
              <AccountCard
                name="Rumble"
                href={RUMBLE_CHANNEL_URL.trim()}
                handle={RUMBLE_CHANNEL_URL.trim() ? RUMBLE_CHANNEL_URL : "Link needed — placeholder"}
                icon="placeholder"
              />
              <AccountCard
                name="Facebook"
                href={FACEBOOK_ACCOUNT?.url ?? ""}
                handle={FACEBOOK_ACCOUNT ? FACEBOOK_ACCOUNT.handle : "Link needed"}
                icon="facebook"
              />
            </div>
          </section>
        </div>
      </main>

      <FooterSection />
      <ChatWidget />
    </div>
  );
}
