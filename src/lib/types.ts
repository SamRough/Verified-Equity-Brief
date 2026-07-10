export type TimeRange = "today" | "week" | "last7" | "last30";
export type BriefLanguage = "en" | "zh";
export type SourceCategory =
  | "Official / Exchange"
  | "Regulator"
  | "Chinese financial media"
  | "HK financial media"
  | "International financial media"
  | "General news";
export type SourceTier = 1 | 2 | 3;
export type SearchMode =
  | "Marketaux"
  | "Alpha Vantage"
  | "Google News"
  | "Google News RSS"
  | "Google Web"
  | "Bing News"
  | "Tavily"
  | "Sina Finance"
  | "Yahoo Finance";

export type Article = {
  id: number;
  title: string;
  url: string;
  source: string;
  sourceTier: SourceTier;
  sourceTierLabel: string;
  searchProvider: string;
  searchMode: SearchMode;
  eventClusterId: string;
  publishedDate: string | null;
  dateSource: "search-api" | "page-metadata" | "url" | "unavailable";
  dateStatus: "verified" | "unverified";
  usableForClaims: boolean;
  snippet: string;
  content: string;
  category: SourceCategory;
};

export type Citation = {
  articleId: number;
  url: string;
  title: string;
};

export type SummaryBullet = {
  text: string;
  citations: Citation[];
  singleSource: boolean;
};

export type KeyNewsItem = {
  title: string;
  date: string | null;
  source: string;
  summary: string;
  whyItMatters: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  sourceLink: string;
};

export type InvestmentImplications = {
  positiveFactors: SummaryBullet[];
  negativeFactors: SummaryBullet[];
  watchItems: SummaryBullet[];
};

export type SourceVerification = {
  articlesRetrieved: number;
  articlesUsed: number;
  duplicatesRemoved: number;
  claimsWithCitations: number;
  unverifiedClaimsRemoved: number;
  confidenceScore: number;
  notes: string[];
  dateUnverifiedSources?: number;
  rejectedLowQualitySources?: number;
  rejectedIrrelevantSources?: number;
  tier1Sources?: number;
  tier2Sources?: number;
  tier3Sources?: number;
  eventsFound?: number;
  searchQueriesRun?: number;
};

export type EventCluster = {
  id: string;
  label: string;
  articleIds: number[];
  sourceCount: number;
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  latestDate: string | null;
  representativeSource: string;
};

export type SearchDiagnostic = {
  provider: string;
  mode: SearchMode;
  query: string;
  category: SourceCategory;
  status?: "used" | "empty" | "skipped" | "failed";
  resultCount?: number;
  error?: string;
};

export type ResearchBrief = {
  status: "ok" | "insufficient";
  message?: string;
  executiveSummary: SummaryBullet[];
  keyNews: KeyNewsItem[];
  investmentImplications: InvestmentImplications;
  sourceVerification: SourceVerification;
  sources: Article[];
  eventClusters: EventCluster[];
  searchDiagnostics: SearchDiagnostic[];
};
