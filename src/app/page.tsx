"use client";

import { FormEvent, useMemo, useState } from "react";
import type { BriefLanguage, ResearchBrief, SummaryBullet, TimeRange } from "@/lib/types";

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
    company: "Company or ticker",
    timeRange: "Time range",
    language: "Language",
    generate: "Find Verified News",
    generating: "Verifying news...",
    noCitedClaims: "No cited claims available.",
    insufficient: "Insufficient verified sources found.",
    executiveSummary: "Generated News Brief",
    sourceVerification: "Evidence Quality",
    keyNews: "Verified News Highlights",
    investmentImplications: "News Follow-up",
    positiveFactors: "Constructive developments",
    negativeFactors: "Pressure points",
    watchItems: "Watch items",
    sourceList: "News Candidates",
    eventClusters: "Event Clusters",
    searchStrategy: "Search Strategy",
    sources: "sources",
    latest: "latest",
    representative: "representative",
    category: "Category",
    searchMode: "Search mode",
    dateUnverified: "Date unverified",
    rejectedSources: "Rejected sources",
    rejectedIrrelevant: "Irrelevant removed",
    tier1Sources: "Tier 1 sources",
    tier2Sources: "Tier 2 sources",
    tier3Sources: "Tier 3 sources",
    eventsFound: "Events found",
    searchQueriesRun: "Search queries",
    sourceTier: "Source tier",
    tier1: "Tier 1",
    tier2: "Tier 2",
    tier3: "Tier 3",
    notUsedForClaims: "not used for claims",
    articlesRetrieved: "Raw candidates",
    articlesUsed: "Verified sources",
    duplicatesRemoved: "Duplicates removed",
    citedClaims: "Cited claims",
    unverifiedRemoved: "Unverified removed",
    confidence: "Confidence",
    dateNotProvided: "Date not provided",
    dateSource: "date source",
    whyItMatters: "Why it matters: ",
    noKeyNews: "No cited key news available.",
    disclaimer: "The brief is limited to verified news context. It does not provide investment advice, ratings, or target prices.",
    singleSource: "single-source",
    subtitle: "A verified news intelligence tool for equity research workflows",
    badge: "Strict source filtering, verified dates, no invented news",
    liveDemo: "Live Demo",
  },
  zh: {
    company: "公司或股票代码",
    timeRange: "时间范围",
    language: "语言",
    generate: "查找可信新闻",
    generating: "正在验证新闻...",
    noCitedClaims: "暂无带引用的结论。",
    insufficient: "未找到足够的可验证来源。",
    executiveSummary: "基于新闻生成的简报",
    sourceVerification: "证据质量",
    keyNews: "可信新闻重点",
    investmentImplications: "新闻跟踪要点",
    positiveFactors: "积极进展",
    negativeFactors: "压力因素",
    watchItems: "观察事项",
    sourceList: "新闻候选列表",
    eventClusters: "新闻事件簇",
    searchStrategy: "搜索策略",
    sources: "来源",
    latest: "最新日期",
    representative: "代表来源",
    category: "来源类型",
    searchMode: "搜索模式",
    dateUnverified: "日期未验证",
    rejectedSources: "已拒绝来源",
    rejectedIrrelevant: "无关剔除",
    tier1Sources: "一级来源",
    tier2Sources: "二级来源",
    tier3Sources: "三级来源",
    eventsFound: "事件数量",
    searchQueriesRun: "搜索查询数",
    sourceTier: "来源层级",
    tier1: "一级",
    tier2: "二级",
    tier3: "三级",
    notUsedForClaims: "不用于生成结论",
    articlesRetrieved: "原始候选数",
    articlesUsed: "通过验证来源",
    duplicatesRemoved: "去重数量",
    citedClaims: "有引用结论",
    unverifiedRemoved: "移除未验证结论",
    confidence: "置信度",
    dateNotProvided: "未提供日期",
    dateSource: "日期来源",
    whyItMatters: "为何重要：",
    noKeyNews: "暂无带引用的重点新闻。",
    disclaimer: "简报仅基于已验证新闻背景生成，不提供投资建议、评级或目标价。",
    singleSource: "单一来源",
    subtitle: "面向股票研究流程的可信新闻筛选与简报工具",
    badge: "严格来源过滤、验证日期、不编造新闻",
    liveDemo: "现场 Demo",
  },
};

function CitationLinks({ bullet, singleSourceLabel }: { bullet: SummaryBullet; singleSourceLabel: string }) {
  return (
    <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
      {bullet.citations.map((citation) => (
        <a
          key={citation.articleId}
          href={citation.url}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-teal-400/30 bg-teal-400/10 px-1.5 py-0.5 text-[11px] font-semibold text-teal-200 hover:bg-teal-400/20"
          title={citation.title}
        >
          S{citation.articleId}
        </a>
      ))}
      {bullet.singleSource ? (
        <span className="rounded border border-amber-300/30 bg-amber-300/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-100">
          {singleSourceLabel}
        </span>
      ) : null}
    </span>
  );
}

function BulletList({
  items,
  emptyLabel,
  singleSourceLabel,
}: {
  items: SummaryBullet[];
  emptyLabel: string;
  singleSourceLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item.text}-${index}`} className="text-sm leading-6 text-slate-200">
          <span className="text-slate-500">- </span>
          {item.text}
          <CitationLinks bullet={item} singleSourceLabel={singleSourceLabel} />
        </li>
      ))}
    </ul>
  );
}

function displaySentiment(sentiment: ResearchBrief["keyNews"][number]["sentiment"], language: BriefLanguage) {
  if (language === "en") return sentiment;
  if (sentiment === "Positive") return "正面";
  if (sentiment === "Negative") return "负面";
  return "中性";
}

function displayTier(tier: number, language: BriefLanguage) {
  if (language === "zh") {
    if (tier === 1) return "一级";
    if (tier === 2) return "二级";
    return "三级";
  }
  return `Tier ${tier}`;
}

function tierClassName(tier: number) {
  if (tier === 1) return "border-teal-300/40 bg-teal-300/10 text-teal-100";
  if (tier === 2) return "border-sky-300/35 bg-sky-300/10 text-sky-100";
  return "border-amber-300/35 bg-amber-300/10 text-amber-100";
}

function displayTierDescription(tier: number, language: BriefLanguage) {
  if (language === "zh") {
    if (tier === 1) return "主流财经 / 官方来源";
    if (tier === 2) return "可信财经 / 科技媒体";
    return "行情数据 / 聚合与辅助来源";
  }
  if (tier === 1) return "Primary financial / official source";
  if (tier === 2) return "Reputable financial / tech media";
  return "Market data / aggregation source";
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-slate-700 bg-slate-900/70 p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  const [query, setQuery] = useState("Tencent");
  const [range, setRange] = useState<TimeRange>("last7");
  const [language, setLanguage] = useState<BriefLanguage>("en");
  const [brief, setBrief] = useState<ResearchBrief | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const confidenceColor = useMemo(() => {
    const score = brief?.sourceVerification.confidenceScore ?? 0;
    if (score >= 70) return "text-teal-200";
    if (score >= 40) return "text-amber-100";
    return "text-red-200";
  }, [brief]);

  const t = copy[language];

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setBrief(null);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, range, language }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate brief.");
      }
      setBrief(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#071019] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-slate-800 pb-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">{t.liveDemo}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Equity Research Copilot
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                {t.subtitle}
              </p>
            </div>
            <div className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
              {t.badge}
            </div>
          </div>
        </header>

        <form
          onSubmit={generate}
          className="grid gap-3 rounded-lg border border-slate-700 bg-slate-900/80 p-4 shadow-sm md:grid-cols-[1fr_170px_150px_160px]"
        >
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{t.company}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded border border-slate-600 bg-slate-950 px-3 text-sm text-white outline-none ring-0 transition focus:border-teal-300"
              placeholder="Tencent, 0700.HK, AMD..."
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{t.timeRange}</span>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as TimeRange)}
              className="h-11 rounded border border-slate-600 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-teal-300"
            >
              {ranges.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label[language]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{t.language}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as BriefLanguage)}
              className="h-11 rounded border border-slate-600 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-teal-300"
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-auto h-11 rounded bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {loading ? t.generating : t.generate}
          </button>
        </form>

        {error ? (
          <div className="rounded border border-red-400/40 bg-red-950/50 p-4 text-sm text-red-100">{error}</div>
        ) : null}

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="h-64 animate-pulse rounded-lg border border-slate-800 bg-slate-900" />
            <div className="h-64 animate-pulse rounded-lg border border-slate-800 bg-slate-900" />
          </div>
        ) : null}

        {brief ? (
          <>
            {brief.status === "insufficient" ? (
              <div className="rounded border border-amber-300/40 bg-amber-950/30 p-4 text-sm text-amber-100">
                {brief.message ?? t.insufficient}
              </div>
            ) : null}

            <Panel title={t.sourceList}>
              <div className="grid gap-3 md:grid-cols-2">
                {brief.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-slate-700 bg-slate-950 p-3 text-sm hover:border-teal-300/50"
                  >
                    <p className="font-semibold text-slate-100">
                      S{source.id}: {source.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {source.publishedDate ?? t.dateNotProvided} | {source.source}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.dateSource}: {source.dateSource}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.searchMode}: {source.searchMode}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${tierClassName(source.sourceTier)}`}>
                        {displayTier(source.sourceTier, language)}
                      </span>
                      <span className="text-xs text-slate-500">{displayTierDescription(source.sourceTier, language)}</span>
                    </div>
                    {source.dateStatus === "unverified" || !source.usableForClaims ? (
                      <p className="mt-2 text-xs text-amber-100">
                        {source.dateStatus === "unverified" ? t.dateUnverified : null}
                        {!source.usableForClaims ? ` | ${t.notUsedForClaims}` : null}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-slate-400">
                      {t.category}: {source.category}
                    </p>
                  </a>
                ))}
              </div>
            </Panel>

            <Panel title={t.eventClusters}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {brief.eventClusters.map((cluster) => (
                  <div key={cluster.id} className="rounded border border-slate-700 bg-slate-950 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-100">{cluster.label}</h3>
                      <span className="rounded border border-slate-600 px-2 py-0.5 text-[11px] text-slate-300">
                        {cluster.sourceCount} {t.sources}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {t.latest}: {cluster.latestDate ?? t.dateNotProvided}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t.representative}: {cluster.representativeSource}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded border border-teal-300/30 bg-teal-300/10 px-2 py-0.5 text-teal-100">
                        {displayTier(1, language)} {cluster.tier1Count}
                      </span>
                      <span className="rounded border border-sky-300/30 bg-sky-300/10 px-2 py-0.5 text-sky-100">
                        {displayTier(2, language)} {cluster.tier2Count}
                      </span>
                      <span className="rounded border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-amber-100">
                        {displayTier(3, language)} {cluster.tier3Count}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cluster.articleIds.slice(0, 6).map((articleId) => (
                        <span
                          key={articleId}
                          className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-300"
                        >
                          S{articleId}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
              <Panel title={t.executiveSummary}>
                <BulletList
                  items={brief.executiveSummary}
                  emptyLabel={t.noCitedClaims}
                  singleSourceLabel={t.singleSource}
                />
              </Panel>

              <Panel title={t.sourceVerification}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Metric label={t.articlesRetrieved} value={brief.sourceVerification.articlesRetrieved} />
                  <Metric label={t.articlesUsed} value={brief.sourceVerification.articlesUsed} />
                  <Metric label={t.duplicatesRemoved} value={brief.sourceVerification.duplicatesRemoved} />
                  <Metric label={t.citedClaims} value={brief.sourceVerification.claimsWithCitations} />
                  <Metric label={t.unverifiedRemoved} value={brief.sourceVerification.unverifiedClaimsRemoved} />
                  {typeof brief.sourceVerification.dateUnverifiedSources === "number" ? (
                    <Metric label={t.dateUnverified} value={brief.sourceVerification.dateUnverifiedSources} />
                  ) : null}
                  {typeof brief.sourceVerification.rejectedLowQualitySources === "number" ? (
                    <Metric label={t.rejectedSources} value={brief.sourceVerification.rejectedLowQualitySources} />
                  ) : null}
                  {typeof brief.sourceVerification.rejectedIrrelevantSources === "number" ? (
                    <Metric label={t.rejectedIrrelevant} value={brief.sourceVerification.rejectedIrrelevantSources} />
                  ) : null}
                  {typeof brief.sourceVerification.tier1Sources === "number" ? (
                    <Metric label={t.tier1Sources} value={brief.sourceVerification.tier1Sources} />
                  ) : null}
                  {typeof brief.sourceVerification.tier2Sources === "number" ? (
                    <Metric label={t.tier2Sources} value={brief.sourceVerification.tier2Sources} />
                  ) : null}
                  {typeof brief.sourceVerification.tier3Sources === "number" ? (
                    <Metric label={t.tier3Sources} value={brief.sourceVerification.tier3Sources} />
                  ) : null}
                  {typeof brief.sourceVerification.eventsFound === "number" ? (
                    <Metric label={t.eventsFound} value={brief.sourceVerification.eventsFound} />
                  ) : null}
                  {typeof brief.sourceVerification.searchQueriesRun === "number" ? (
                    <Metric label={t.searchQueriesRun} value={brief.sourceVerification.searchQueriesRun} />
                  ) : null}
                  <div className="rounded border border-slate-700 bg-slate-950 p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t.confidence}</p>
                    <p className={`mt-1 text-2xl font-semibold ${confidenceColor}`}>
                      {brief.sourceVerification.confidenceScore}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-xs leading-5 text-slate-400">
                  {brief.sourceVerification.notes.map((note) => (
                    <li key={note}>- {note}</li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel title={t.keyNews}>
              <div className="grid gap-4">
                {brief.keyNews.length > 0 ? (
                  brief.keyNews.map((item) => (
                    <article key={`${item.title}-${item.sourceLink}`} className="rounded border border-slate-700 bg-slate-950 p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <a
                            href={item.sourceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-base font-semibold text-white hover:text-teal-200"
                          >
                            {item.title}
                          </a>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.date ?? t.dateNotProvided} | {item.source}
                          </p>
                        </div>
                        <span
                          className={`w-fit rounded border px-2 py-1 text-xs font-semibold ${
                            item.sentiment === "Positive"
                              ? "border-teal-300/30 bg-teal-300/10 text-teal-100"
                              : item.sentiment === "Negative"
                                ? "border-red-300/30 bg-red-300/10 text-red-100"
                                : "border-slate-500/40 bg-slate-700/40 text-slate-200"
                          }`}
                        >
                          {displaySentiment(item.sentiment, language)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        <span className="font-semibold text-slate-300">{t.whyItMatters}</span>
                        {item.whyItMatters}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">{t.noKeyNews}</p>
                )}
              </div>
            </Panel>

            <Panel title={t.investmentImplications}>
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-teal-100">{t.positiveFactors}</h3>
                  <BulletList
                    items={brief.investmentImplications.positiveFactors}
                    emptyLabel={t.noCitedClaims}
                    singleSourceLabel={t.singleSource}
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-red-100">{t.negativeFactors}</h3>
                  <BulletList
                    items={brief.investmentImplications.negativeFactors}
                    emptyLabel={t.noCitedClaims}
                    singleSourceLabel={t.singleSource}
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-amber-100">{t.watchItems}</h3>
                  <BulletList
                    items={brief.investmentImplications.watchItems}
                    emptyLabel={t.noCitedClaims}
                    singleSourceLabel={t.singleSource}
                  />
                </div>
              </div>
              <p className="mt-5 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">
                {t.disclaimer}
              </p>
            </Panel>

            <Panel title={t.searchStrategy}>
              <div className="grid gap-2 md:grid-cols-2">
                {brief.searchDiagnostics.map((item, index) => (
                  <div key={`${item.provider}-${item.mode}-${item.query}-${index}`} className="rounded border border-slate-800 bg-slate-950 p-3">
                    <p className="text-xs font-semibold text-slate-300">
                      {item.provider} | {item.mode}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.query}</p>
                  </div>
                ))}
              </div>
            </Panel>

          </>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-slate-700 bg-slate-950 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
