"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import type {
  Article,
  BriefLanguage,
  EventCluster,
  KeyNewsItem,
  ResearchBrief,
  SourceCategory,
  SummaryBullet,
  TimeRange,
} from "@/lib/types";

const ranges: { value: TimeRange; label: Record<BriefLanguage, string> }[] = [
  { value: "today", label: { en: "Today", zh: "今日" } },
  { value: "week", label: { en: "This week", zh: "本周" } },
  { value: "last7", label: { en: "Last 7 days", zh: "过去 7 天" } },
  { value: "last30", label: { en: "Last 30 days", zh: "过去 30 天" } },
];

const languages: { value: BriefLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

const copy = {
  en: {
    eyebrow: "Verified news intelligence",
    subtitle: "Date-qualified, source-linked news for public-equity research.",
    evidenceFirst: "Evidence first",
    company: "Company or ticker",
    timeRange: "Time range",
    language: "Brief language",
    generate: "Find verified news",
    generating: "Verifying sources...",
    result: "Research result",
    citedBrief: "Cited Brief",
    noCitedClaims: "No cited summary was available from the verified source set.",
    insufficient: "Insufficient verified sources found.",
    verifiedFeed: "Verified News Feed",
    noKeyNews: "No verified news was retained for this period.",
    source: "Source",
    sourceLink: "Open source",
    dateVerified: "date verified",
    dateNotProvided: "Date unavailable",
    evidence: "Evidence",
    articles: "articles",
    events: "events",
    citedClaims: "cited claims",
    confidence: "confidence",
    singleSource: "single-source",
    publishers: "publishers",
    audit: "Retrieval Audit",
    rawCandidates: "raw candidates",
    duplicatesRemoved: "duplicates removed",
    excludedClaims: "uncited claims removed",
    rejectedSources: "low-quality sources rejected",
    irrelevantRemoved: "irrelevant results removed",
    dateUnverified: "dates not verified",
    sourceMix: "Source quality",
    eventMap: "Event coverage",
    providerStatus: "Provider status",
    noEvents: "No event clusters were retained.",
    noDiagnostics: "No provider diagnostics were returned.",
    status: "status",
    results: "results",
    verifiedPeriod: "Verified period",
    languageLabel: "Brief",
    coverage: "coverage",
    tier1: "Tier 1",
    tier2: "Tier 2",
    tier3: "Tier 3",
    category: "Source type",
    dateEvidence: "Date evidence",
    footer: "News summaries are limited to the retrieved source set. This tool does not provide investment advice.",
  },
  zh: {
    eyebrow: "可信新闻情报",
    subtitle: "面向股票研究的日期验证、来源直达新闻工具。",
    evidenceFirst: "证据优先",
    company: "公司或股票代码",
    timeRange: "时间范围",
    language: "简报语言",
    generate: "查找可信新闻",
    generating: "正在验证来源...",
    result: "检索结果",
    citedBrief: "带引用简报",
    noCitedClaims: "已验证来源中暂无可引用的摘要。",
    insufficient: "未找到足够的可验证来源。",
    verifiedFeed: "已验证新闻流",
    noKeyNews: "该时间范围内没有保留下来的已验证新闻。",
    source: "来源",
    sourceLink: "打开来源",
    dateVerified: "日期已验证",
    dateNotProvided: "日期不可用",
    evidence: "证据",
    articles: "篇文章",
    events: "个事件",
    citedClaims: "条带引用结论",
    confidence: "置信度",
    singleSource: "单一来源",
    publishers: "家媒体",
    audit: "检索审计",
    rawCandidates: "原始候选",
    duplicatesRemoved: "去重数量",
    excludedClaims: "移除无引用结论",
    rejectedSources: "拒绝低质量来源",
    irrelevantRemoved: "移除无关结果",
    dateUnverified: "日期未验证",
    sourceMix: "来源质量",
    eventMap: "事件覆盖",
    providerStatus: "接口状态",
    noEvents: "没有保留下来的事件聚类。",
    noDiagnostics: "没有返回接口诊断信息。",
    status: "状态",
    results: "条结果",
    verifiedPeriod: "验证范围",
    languageLabel: "简报",
    coverage: "覆盖",
    tier1: "一级",
    tier2: "二级",
    tier3: "三级",
    category: "来源类型",
    dateEvidence: "日期依据",
    footer: "新闻摘要仅限于检索到的来源集合；本工具不提供投资建议。",
  },
};

function displayTier(tier: number, language: BriefLanguage) {
  if (language === "zh") {
    if (tier === 1) return "一级";
    if (tier === 2) return "二级";
    return "三级";
  }
  return `Tier ${tier}`;
}

function displayCategory(category: SourceCategory, language: BriefLanguage) {
  if (language === "en") return category;
  const labels: Record<SourceCategory, string> = {
    "Official / Exchange": "公司 / 交易所",
    Regulator: "监管机构",
    "Chinese financial media": "中文财经媒体",
    "HK financial media": "香港财经媒体",
    "International financial media": "国际财经媒体",
    "General news": "综合新闻",
  };
  return labels[category];
}

function displayDateEvidence(source: Article["dateSource"], language: BriefLanguage) {
  const labels: Record<Article["dateSource"], Record<BriefLanguage, string>> = {
    "search-api": { en: "search feed", zh: "检索接口" },
    "page-metadata": { en: "page metadata", zh: "页面元数据" },
    url: { en: "source URL", zh: "来源链接" },
    unavailable: { en: "unavailable", zh: "不可用" },
  };
  return labels[source][language];
}

function displaySearchStatus(status: ResearchBrief["searchDiagnostics"][number]["status"], language: BriefLanguage) {
  if (!status || language === "en") return status;
  if (status === "used") return "已返回结果";
  if (status === "empty") return "无结果";
  if (status === "skipped") return "未配置";
  return "失败";
}

function tierClassName(tier: number) {
  if (tier === 1) return "border-teal-300/35 bg-teal-300/10 text-teal-100";
  if (tier === 2) return "border-sky-300/35 bg-sky-300/10 text-sky-100";
  return "border-amber-300/35 bg-amber-300/10 text-amber-100";
}

function CitationLinks({ bullet, language }: { bullet: SummaryBullet; language: BriefLanguage }) {
  const t = copy[language];
  return (
    <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
      {bullet.citations.map((citation) => (
        <a
          key={citation.articleId}
          href={citation.url}
          target="_blank"
          rel="noreferrer"
          className="border border-teal-300/35 bg-teal-300/10 px-1.5 py-0.5 text-[11px] font-semibold text-teal-100 transition hover:bg-teal-300/20"
          title={citation.title}
        >
          S{citation.articleId}
        </a>
      ))}
      {bullet.singleSource ? (
        <span className="border border-amber-300/35 bg-amber-300/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-100">
          {t.singleSource}
        </span>
      ) : null}
    </span>
  );
}

function CitedBrief({ items, language }: { items: SummaryBullet[]; language: BriefLanguage }) {
  const t = copy[language];
  return (
    <section className="border-t border-slate-700 pt-4">
      <SectionHeading title={t.citedBrief} />
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{t.noCitedClaims}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={`${item.text}-${index}`} className="text-[15px] leading-7 text-slate-200">
              <span className="mr-2 text-teal-200">{String(index + 1).padStart(2, "0")}</span>
              {item.text}
              <CitationLinks bullet={item} language={language} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SectionHeading({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      {aside ? <div className="text-xs text-slate-500">{aside}</div> : null}
    </div>
  );
}

function EvidenceStat({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="min-w-0 border-l border-slate-700 pl-3 first:border-l-0 first:pl-0">
      <dt className="text-[11px] font-medium text-slate-500">{label}</dt>
      <dd className={`mt-1 text-xl font-semibold ${accent ? "text-teal-100" : "text-slate-100"}`}>{value}</dd>
    </div>
  );
}

function AuditStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-t border-slate-800 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

type FeedEntry = {
  item: KeyNewsItem;
  source: Article | undefined;
  event: EventCluster | undefined;
};

function groupNewsByDate(entries: FeedEntry[], language: BriefLanguage) {
  const groups = new Map<string, FeedEntry[]>();
  for (const entry of entries) {
    const key = entry.item.date ?? entry.source?.publishedDate ?? "unavailable";
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    label: date === "unavailable" ? copy[language].dateNotProvided : date,
    items,
  }));
}

function renderSourceSnippet(text: string) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function NewsFeed({ brief, language }: { brief: ResearchBrief; language: BriefLanguage }) {
  const t = copy[language];
  const groups = useMemo(() => {
    const sourceByUrl = new Map(brief.sources.map((source) => [source.url, source]));
    const eventById = new Map(brief.eventClusters.map((event) => [event.id, event]));
    const entries = brief.keyNews.map((item) => {
      const source = sourceByUrl.get(item.sourceLink);
      return { item, source, event: source ? eventById.get(source.eventClusterId) : undefined };
    });
    return groupNewsByDate(entries, language);
  }, [brief, language]);

  return (
    <section className="border-t border-slate-700 pt-4">
      <SectionHeading title={t.verifiedFeed} aside={`${brief.keyNews.length} ${t.articles}`} />
      {groups.length === 0 ? (
        <p className="text-sm text-slate-400">{t.noKeyNews}</p>
      ) : (
        <div>
          {groups.map((group) => (
            <div key={group.date} className="grid gap-3 border-t border-slate-800 py-5 md:grid-cols-[108px_1fr] md:gap-6">
              <p className="text-xs font-semibold text-slate-400">{group.label}</p>
              <div className="divide-y divide-slate-800 border-t border-slate-800">
                {group.items.map(({ item, source, event }) => (
                  <article key={item.sourceLink} className="py-5 first:pt-4 last:pb-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-300">{item.source}</span>
                      {source ? (
                        <span className={`border px-1.5 py-0.5 font-semibold ${tierClassName(source.sourceTier)}`}>
                          {displayTier(source.sourceTier, language)}
                        </span>
                      ) : null}
                      {source ? <span>{displayCategory(source.category, language)}</span> : null}
                      {event ? (
                        <span className={event.sourceCount === 1 ? "text-amber-100" : "text-teal-100"}>
                          {event.sourceCount === 1 ? t.singleSource : `${event.sourceCount} ${t.publishers}`}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
                      <a
                        href={item.sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-semibold leading-6 text-slate-100 transition hover:text-teal-100"
                      >
                        {item.title}
                      </a>
                      <a
                        href={item.sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit shrink-0 text-xs font-semibold text-teal-200 hover:text-teal-100"
                      >
                        {t.sourceLink}
                      </a>
                    </div>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                      {renderSourceSnippet(source?.snippet || item.summary)}
                    </p>
                    {source ? (
                      <p className="mt-3 text-xs text-slate-500">
                        {t.dateVerified}: {displayDateEvidence(source.dateSource, language)}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RetrievalAudit({ brief, language }: { brief: ResearchBrief; language: BriefLanguage }) {
  const t = copy[language];
  const verification = brief.sourceVerification;
  return (
    <details className="border-t border-slate-700 pt-4">
      <summary className="cursor-pointer text-sm font-semibold text-slate-200 hover:text-teal-100">{t.audit}</summary>
      <div className="mt-5 grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <dl className="grid grid-cols-2 gap-x-5">
          <AuditStat label={t.rawCandidates} value={verification.articlesRetrieved} />
          <AuditStat label={t.duplicatesRemoved} value={verification.duplicatesRemoved} />
          <AuditStat label={t.excludedClaims} value={verification.unverifiedClaimsRemoved} />
          <AuditStat label={t.rejectedSources} value={verification.rejectedLowQualitySources ?? 0} />
          <AuditStat label={t.irrelevantRemoved} value={verification.rejectedIrrelevantSources ?? 0} />
          <AuditStat label={t.dateUnverified} value={verification.dateUnverifiedSources ?? 0} />
        </dl>
        <div className="grid gap-7">
          <div>
            <SectionHeading title={t.sourceMix} />
            <div className="flex flex-wrap gap-2">
              {([1, 2, 3] as const).map((tier) => (
                <span key={tier} className={`border px-2 py-1 text-xs font-semibold ${tierClassName(tier)}`}>
                  {displayTier(tier, language)} {verification[`tier${tier}Sources` as const] ?? 0}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading title={t.eventMap} />
            {brief.eventClusters.length === 0 ? (
              <p className="text-sm text-slate-500">{t.noEvents}</p>
            ) : (
              <div className="divide-y divide-slate-800 border-y border-slate-800">
                {brief.eventClusters.map((event) => (
                  <div key={event.id} className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 py-3 text-sm">
                    <p className="font-medium text-slate-200">{event.label}</p>
                    <p className="text-xs text-slate-500">
                      {event.latestDate ?? t.dateNotProvided} · {event.sourceCount} {t.publishers} · {event.representativeSource}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <SectionHeading title={t.providerStatus} />
            {brief.searchDiagnostics.length === 0 ? (
              <p className="text-sm text-slate-500">{t.noDiagnostics}</p>
            ) : (
              <div className="divide-y divide-slate-800 border-y border-slate-800">
                {brief.searchDiagnostics.map((item, index) => (
                  <div key={`${item.provider}-${item.mode}-${item.query}-${index}`} className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 py-3 text-xs">
                    <p className="font-medium text-slate-300">{item.provider} · {item.mode}</p>
                    <p className={item.status === "failed" ? "text-amber-100" : "text-slate-500"}>
                      {displaySearchStatus(item.status, language) ?? t.status}
                      {typeof item.resultCount === "number" ? ` · ${item.resultCount} ${t.results}` : ""}
                      {item.error ? ` · ${item.error}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </details>
  );
}

export default function Home() {
  const [query, setQuery] = useState("Tencent");
  const [submittedQuery, setSubmittedQuery] = useState("Tencent");
  const [range, setRange] = useState<TimeRange>("last7");
  const [briefRange, setBriefRange] = useState<TimeRange | null>(null);
  const [language, setLanguage] = useState<BriefLanguage>("en");
  const [brief, setBrief] = useState<ResearchBrief | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = copy[language];
  const selectedRange = ranges.find((item) => item.value === (briefRange ?? range));

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setBrief(null);
    setBriefRange(null);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, range, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to generate brief.");
      setBrief(data);
      setSubmittedQuery(query.trim() || "Tencent");
      setBriefRange(range);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080c12] text-slate-100">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-200">{t.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Verified Equity Brief</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{t.subtitle}</p>
          </div>
          <span className="w-fit border border-teal-300/25 bg-teal-300/10 px-2.5 py-1 text-xs font-semibold text-teal-100">
            {t.evidenceFirst}
          </span>
        </header>

        <form
          onSubmit={generate}
          className="mt-6 grid gap-3 border-y border-slate-700 bg-[#0c131c] px-4 py-4 md:grid-cols-[minmax(0,1fr)_150px_125px_auto] md:items-end"
        >
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-400">{t.company}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 border border-slate-600 bg-[#080c12] px-3 text-sm text-white outline-none transition focus:border-teal-300"
              placeholder="Tencent, 0700.HK, AMD..."
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-400">{t.timeRange}</span>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as TimeRange)}
              className="h-11 border border-slate-600 bg-[#080c12] px-3 text-sm text-white outline-none transition focus:border-teal-300"
            >
              {ranges.map((item) => (
                <option key={item.value} value={item.value}>{item.label[language]}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-400">{t.language}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as BriefLanguage)}
              className="h-11 border border-slate-600 bg-[#080c12] px-3 text-sm text-white outline-none transition focus:border-teal-300"
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="h-11 whitespace-nowrap bg-teal-300 px-5 text-sm font-semibold leading-none text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {loading ? t.generating : t.generate}
          </button>
        </form>

        {error ? <div className="mt-6 border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-100">{error}</div> : null}

        {loading ? (
          <div className="mt-8 animate-pulse border-y border-slate-800 py-5">
            <div className="h-3 w-32 bg-slate-800" />
            <div className="mt-4 h-5 max-w-2xl bg-slate-800" />
            <div className="mt-3 h-5 max-w-xl bg-slate-800" />
          </div>
        ) : null}

        {brief ? (
          <div className="mt-8 space-y-10">
            <section className="border-y border-slate-700 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{t.result}</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">{submittedQuery}</h2>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>{t.verifiedPeriod}: {selectedRange?.label[language]}</span>
                  <span>{t.languageLabel}: {language === "zh" ? "中文" : "English"}</span>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-y-4 sm:grid-cols-4">
                <EvidenceStat label={t.articles} value={brief.sourceVerification.articlesUsed} accent />
                <EvidenceStat label={t.events} value={brief.sourceVerification.eventsFound ?? brief.eventClusters.length} />
                <EvidenceStat label={t.citedClaims} value={brief.sourceVerification.claimsWithCitations} />
                <EvidenceStat label={t.confidence} value={`${brief.sourceVerification.confidenceScore}%`} />
              </dl>
            </section>

            {brief.status === "insufficient" ? (
              <section className="border-l-2 border-amber-300 bg-amber-300/5 px-4 py-4 text-sm leading-6 text-amber-100">
                {brief.message ?? t.insufficient}
              </section>
            ) : (
              <>
                <CitedBrief items={brief.executiveSummary} language={language} />
                <NewsFeed brief={brief} language={language} />
              </>
            )}

            <RetrievalAudit brief={brief} language={language} />
          </div>
        ) : null}

        <footer className="mt-10 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">{t.footer}</footer>
      </div>
    </main>
  );
}
