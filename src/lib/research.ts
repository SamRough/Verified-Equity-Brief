import type {
  Article,
  BriefLanguage,
  Citation,
  EventCluster,
  InvestmentImplications,
  KeyNewsItem,
  ResearchBrief,
  SourceCategory,
  SearchDiagnostic,
  SourceTier,
  SummaryBullet,
  TimeRange,
} from "./types";

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  raw_content?: string;
  published_date?: string;
  score?: number;
};

type SerpApiResult = {
  title?: string;
  link?: string;
  url?: string;
  snippet?: string;
  summary?: string;
  date?: string;
  date_published?: string;
  published_date?: string;
  published_at?: string;
  displayed_date?: string;
  source?: string | { name?: string };
  source_name?: string;
  stories?: SerpApiResult[];
};

type MarketauxArticle = {
  title?: string;
  url?: string;
  description?: string;
  snippet?: string;
  published_at?: string;
  source?: string;
  language?: string;
  entities?: Array<{
    symbol?: string;
    name?: string;
    exchange?: string | null;
    match_score?: number;
  }>;
};

type AlphaVantageArticle = {
  title?: string;
  url?: string;
  time_published?: string;
  summary?: string;
  source?: string;
  source_domain?: string;
  overall_sentiment_label?: string;
  ticker_sentiment?: Array<{
    ticker?: string;
    relevance_score?: string;
    ticker_sentiment_label?: string;
  }>;
};

type SearchPlan = {
  query: string;
  category: SourceCategory;
  includeDomains?: string[];
  maxResults?: number;
  topic?: "general" | "news";
  mode: Article["searchMode"];
  provider: "marketaux" | "alphavantage" | "serpapi" | "tavily" | "sina" | "yahoo" | "googleRss";
  symbols?: string[];
  locale?: BriefLanguage;
};

type CompanyContext = {
  input: string;
  displayName: string;
  aliases: string[];
  isTencent: boolean;
  usTicker?: string;
  hkTicker?: string;
  cnTicker?: string;
  resolutionSource: "profile" | "input" | "llm" | "profile+llm";
  resolutionConfidence?: number;
  expansionTerms: string[];
};

type RawResult = {
  title: string;
  url: string;
  publisherUrl?: string;
  snippet: string;
  content: string;
  publishedDate: string | null;
  category: SourceCategory;
  searchProvider: string;
  searchMode: Article["searchMode"];
  searchQuery: string;
};

type GoogleNewsRssItem = {
  title: string;
  googleUrl: string;
  publisherUrl: string | null;
  snippet: string;
  publishedDate: string | null;
};

type GoogleNewsDecodeResult = {
  status?: boolean;
  source_url?: string;
  decoded_url?: string;
  message?: string;
};

type DateSource = Article["dateSource"];

type DateEvidence = {
  value: string;
  source: Exclude<DateSource, "unavailable">;
};

type NormalizedResults = {
  articlesRetrieved: number;
  duplicatesRemoved: number;
  articles: Article[];
  sourceMix: Record<string, number>;
  rejectedLowQualitySources: number;
  dateUnverifiedSources: number;
  rejectedIrrelevantSources: number;
  tierCounts: Record<SourceTier, number>;
  eventClusters: EventCluster[];
  searchDiagnostics: SearchDiagnostic[];
  company: CompanyContext;
};

type ProviderFailures = Partial<Record<SearchPlan["provider"], string>>;

const OFFICIAL_EXCHANGE_DOMAINS = [
  "hkexnews.hk",
  "hkex.com.hk",
  "nyse.com",
  "nasdaq.com",
  "tencent.com",
  "tencent.com.cn",
];

const REGULATOR_DOMAINS = [
  "samr.gov.cn",
  "cac.gov.cn",
  "miit.gov.cn",
  "csrc.gov.cn",
  "npaa.gov.cn",
  "gov.cn",
  "sec.gov",
  "justice.gov",
  "ftc.gov",
];

const CHINESE_FINANCIAL_DOMAINS = [
  "caixin.com",
  "yicai.com",
  "cls.cn",
  "stcn.com",
  "cnstock.com",
  "cs.com.cn",
  "21jingji.com",
  "m.21jingji.com",
  "nbd.com.cn",
  "jiemian.com",
  "thepaper.cn",
  "eeo.com.cn",
  "bjnews.com.cn",
  "m.bjnews.com.cn",
  "finance.sina.com.cn",
  "finance.sina.cn",
  "cj.sina.cn",
  "sina.cn",
  "finance.eastmoney.com",
  "wap.eastmoney.com",
  "finance.qq.com",
  "stock.qq.com",
  "finance.sohu.com",
  "m.sohu.com",
  "finance.ifeng.com",
  "ifeng.com",
  "jrj.com.cn",
  "zhitongcaijing.com",
  "wallstreetcn.com",
  "gelonghui.com",
  "news.futunn.com",
  "moomoo.com",
  "egsea.com",
  "zqrb.cn",
  "zaobao.com.sg",
];

const HK_FINANCIAL_DOMAINS = [
  "aastocks.com",
  "aastocks.com.hk",
  "etnet.com.hk",
  "hkej.com",
  "hk01.com",
  "economictimes.com.hk",
  "scmp.com",
  "on.cc",
  "thestandard.com.hk",
];

const INTERNATIONAL_FINANCIAL_DOMAINS = [
  "reuters.com",
  "bloomberg.com",
  "wsj.com",
  "ft.com",
  "cnbc.com",
  "barrons.com",
  "investors.com",
  "investing.com",
  "benzinga.com",
  "zacks.com",
  "fool.com",
  "nasdaq.com",
  "nikkei.com",
  "marketwatch.com",
  "morningstar.com",
  "finance.yahoo.com",
  "businessinsider.com",
  "businesswire.com",
  "globenewswire.com",
  "prnewswire.com",
  "techcrunch.com",
  "theverge.com",
  "tomshardware.com",
  "anandtech.com",
  "theregister.com",
  "zdnet.com",
  "businesstimes.com.sg",
  "straitstimes.com",
  "fortune.com",
  "gamesindustry.biz",
];

const TIER_1_DOMAINS = [
  "reuters.com",
  "bloomberg.com",
  "wsj.com",
  "ft.com",
  "nikkei.com",
  "sec.gov",
  "caixin.com",
  "yicai.com",
  "cls.cn",
  "stcn.com",
  "cnstock.com",
  "cs.com.cn",
  "hkexnews.hk",
  "hkex.com.hk",
  "tencent.com",
  "tencent.com.cn",
];

const TIER_2_DOMAINS = [
  "cnbc.com",
  "barrons.com",
  "investors.com",
  "marketwatch.com",
  "morningstar.com",
  "finance.yahoo.com",
  "fortune.com",
  "businessinsider.com",
  "businesswire.com",
  "globenewswire.com",
  "prnewswire.com",
  "techcrunch.com",
  "theverge.com",
  "tomshardware.com",
  "anandtech.com",
  "theregister.com",
  "zdnet.com",
  "21jingji.com",
  "m.21jingji.com",
  "nbd.com.cn",
  "jiemian.com",
  "thepaper.cn",
  "eeo.com.cn",
  "bjnews.com.cn",
  "m.bjnews.com.cn",
  "finance.sina.com.cn",
  "finance.sina.cn",
  "cj.sina.cn",
  "sina.cn",
  "finance.eastmoney.com",
  "wap.eastmoney.com",
  "finance.qq.com",
  "stock.qq.com",
  "finance.sohu.com",
  "m.sohu.com",
  "finance.ifeng.com",
  "ifeng.com",
  "jrj.com.cn",
  "zhitongcaijing.com",
  "wallstreetcn.com",
  "gelonghui.com",
  "scmp.com",
  "hkej.com",
  "thestandard.com.hk",
  "businesstimes.com.sg",
  "straitstimes.com",
  "gamesindustry.biz",
];

const TIER_3_DOMAINS = [
  "investing.com",
  "benzinga.com",
  "zacks.com",
  "fool.com",
  "nasdaq.com",
  "news.futunn.com",
  "moomoo.com",
  "aastocks.com",
  "aastocks.com.hk",
  "etnet.com.hk",
  "on.cc",
];

const REPUTABLE_SOURCE_HINTS = [
  "reuters",
  "bloomberg",
  "wsj",
  "financial times",
  "ft.com",
  "cnbc",
  "marketwatch",
  "nikkei",
  "scmp",
  "south china morning post",
  "yahoo finance",
  "morningstar",
  "investing.com",
  "hong kong exchange",
  "hkex",
  "tencent",
  "prnewswire",
  "businesswire",
  "seeking alpha",
  "caixin",
  "财新",
  "yicai",
  "第一财经",
  "stcn",
  "证券时报",
  "cnstock",
  "上海证券报",
  "cls.cn",
  "财联社",
  "hkexnews",
  "披露易",
  "samr.gov.cn",
  "cac.gov.cn",
  "miit.gov.cn",
  "csrc.gov.cn",
  "npaa.gov.cn",
  "国家新闻出版署",
  "国家市场监督管理总局",
  "网信办",
  "工信部",
  "证监会",
  "aastocks",
  "etnet",
  "经济通",
  "信报",
  "hkej",
];

const LOW_QUALITY_HINTS = [
  "baijiahao",
  "baidu.com",
  "coupon",
  "eastmoney.com/guba",
  "guba.eastmoney",
  "login",
  "community/feed",
  "mp.weixin.qq.com",
  "netease",
  "163.com",
  "qq.com/a/",
  "reddit",
  "toutiao",
  "pinterest",
  "youtube",
  "facebook",
  "instagram",
  "tiktok",
  "medium.com",
  "blogspot",
  "wordpress",
  "kotaku",
  "xueqiu",
  "tradingview",
  "simplywall",
  "britannica",
  "marketscreener",
];

const NON_NEWS_HINTS = [
  ".pdf",
  "annual report",
  "interim report",
  "results announcement",
  "stock price",
  "share price",
  "share price today",
  "stock moves",
  "statement of changes",
  "beneficial ownership",
  "form 4",
  "持股变动",
  "持股變動",
  "高管持股",
  "officer ",
  "options",
  "option chain",
  "期权",
  "期權",
  "新闻动态 - moomoo",
  "technical indicator",
  "technical indicators",
  "反弹信号",
  "技术指标",
  "price target",
  "raises pt",
  "lowers pt",
  "pt on",
  "moves pdd holdings",
  "moves .* to hold",
  "maintains hold",
  "downgrade",
  "upgrade",
  "initiates",
  "price targets",
  "target split",
  "stock.finance",
  "quote, history",
  "quotes/",
  "/quotes/",
  "/history/",
  "历史交易",
  "实时行情",
  "走势图",
  "今日股价",
  "etf",
  "资金面",
  "震荡上行",
  "company profile",
  "company dividend",
  "dividend history",
  "analyst blog",
  "zacks analyst",
  "zacks.com",
  "broker ratings",
  "broker",
  "newsletter",
  "newsletters",
  "could skyrocket",
  "better buy",
  "worth buying",
  "stock is the better",
  "which stock",
  "which ai",
  "hidden way to trade",
  "trade it",
  "更值得买入",
  "值得买入",
  "签名皮夹克",
  "皮夹克将拍卖",
  "拍卖",
  "according to analysts",
  "jim cramer",
  "cramer",
  "price direction",
  "what's ahead",
  "what is ahead",
  "if you invested",
  "how much it'd be worth",
  "stock tracker",
  "overthinking stock picks",
  "best non-tech stocks",
  "<research>",
  "research>",
  "research report",
  "research reports",
  "top picks",
  "target price",
  "target prices",
  "upgrade",
  "downgrade",
  "rating",
  "outperform",
  "underperform",
  "大行",
  "目標價",
  "目标价",
  "上调",
  "下调",
  "评级",
  "跑赢",
  "跑输",
  "增持",
  "减持",
  "公司派息",
  "公司資料",
  "公司资料",
  "業績公布",
  "业绩公布",
  "financial news - tencent",
  "latest news",
  "最新新闻",
  "股市新聞",
  "股市新闻",
  "stock news",
  "/stock-aafn/00700/0/research-report",
];

const IRRELEVANT_CONTEXT_HINTS = [
  "剑南春",
  "志愿填报",
  "高考",
  "名家讲坛",
  "家长学子",
  "济南站",
  "报考之道",
  "腾讯新闻《",
  "腾讯新闻《志愿",
  "礼来亚洲基金押注",
  "上市首日股价翻倍",
  "grey market intelligence",
  "airlines are installing",
  "luxury seats",
  "cafeteria",
  "culture of frugality",
  "爱上拼多多包邮",
  "包邮",
  "老手艺",
  "家纺",
  "新国货逆袭",
  "数智新国货",
];

const STRICT_CHINESE_SOURCE_DOMAINS: Record<SourceCategory, string[]> = {
  "Official / Exchange": OFFICIAL_EXCHANGE_DOMAINS,
  Regulator: REGULATOR_DOMAINS,
  "Chinese financial media": CHINESE_FINANCIAL_DOMAINS,
  "HK financial media": HK_FINANCIAL_DOMAINS,
  "International financial media": INTERNATIONAL_FINANCIAL_DOMAINS,
  "General news": [],
};

type CompanyProfile = {
  displayName: string;
  aliases: string[];
  usTicker?: string;
  hkTicker?: string;
  cnTicker?: string;
  isTencent?: boolean;
};

const COMPANY_PROFILES: CompanyProfile[] = [
  {
    displayName: "Tencent",
    aliases: ["Tencent", "Tencent Holdings", "0700.HK", "00700", "TCEHY", "腾讯", "腾讯控股", "騰訊", "騰訊控股", "微信", "WeChat"],
    usTicker: "TCEHY",
    hkTicker: "0700.HK",
    isTencent: true,
  },
  {
    displayName: "PDD",
    aliases: ["PDD", "PDD Holdings", "Pinduoduo", "拼多多", "拼多多集团", "拼多多集團", "Temu"],
    usTicker: "PDD",
  },
  {
    displayName: "Alibaba",
    aliases: ["BABA", "Alibaba", "Alibaba Group", "阿里巴巴", "阿里", "阿里巴巴集团", "9988.HK"],
    usTicker: "BABA",
    hkTicker: "9988.HK",
  },
  {
    displayName: "JD.com",
    aliases: ["JD", "JD.com", "京东", "京東", "京东集团", "9618.HK"],
    usTicker: "JD",
    hkTicker: "9618.HK",
  },
  {
    displayName: "Meituan",
    aliases: ["Meituan", "美团", "美團", "3690.HK"],
    hkTicker: "3690.HK",
  },
  {
    displayName: "Xiaomi",
    aliases: ["Xiaomi", "小米", "小米集团", "小米集團", "1810.HK"],
    hkTicker: "1810.HK",
  },
  {
    displayName: "Kuaishou",
    aliases: ["Kuaishou", "快手", "1024.HK"],
    hkTicker: "1024.HK",
  },
  {
    displayName: "Pop Mart",
    aliases: [
      "Pop Mart",
      "POP MART",
      "Pop Mart International",
      "Pop Mart International Group",
      "泡泡玛特",
      "泡泡瑪特",
      "9992.HK",
      "9992",
      "LABUBU",
      "THE MONSTERS",
      "HIRONO",
    ],
    hkTicker: "9992.HK",
  },
  {
    displayName: "Baidu",
    aliases: ["BIDU", "Baidu", "百度", "9888.HK"],
    usTicker: "BIDU",
    hkTicker: "9888.HK",
  },
  {
    displayName: "NetEase",
    aliases: ["NTES", "NetEase", "网易", "網易", "9999.HK"],
    usTicker: "NTES",
    hkTicker: "9999.HK",
  },
  {
    displayName: "Bilibili",
    aliases: ["BILI", "Bilibili", "哔哩哔哩", "嗶哩嗶哩", "9626.HK"],
    usTicker: "BILI",
    hkTicker: "9626.HK",
  },
  {
    displayName: "NIO",
    aliases: ["NIO", "蔚来", "蔚來", "9866.HK"],
    usTicker: "NIO",
    hkTicker: "9866.HK",
  },
  {
    displayName: "Li Auto",
    aliases: ["LI", "Li Auto", "理想汽车", "理想汽車", "2015.HK"],
    usTicker: "LI",
    hkTicker: "2015.HK",
  },
  {
    displayName: "XPeng",
    aliases: ["XPEV", "XPeng", "小鹏汽车", "小鵬汽車", "9868.HK"],
    usTicker: "XPEV",
    hkTicker: "9868.HK",
  },
  {
    displayName: "NVIDIA",
    aliases: ["NVDA", "NVIDIA", "Nvidia", "NVIDIA Corporation", "英伟达", "輝達", "辉达"],
    usTicker: "NVDA",
  },
  {
    displayName: "AMD",
    aliases: ["AMD", "Advanced Micro Devices", "超威半导体", "超微半导体"],
    usTicker: "AMD",
  },
  {
    displayName: "TSMC",
    aliases: ["TSM", "TSMC", "Taiwan Semiconductor", "台积电", "台積電", "2330.TW"],
    usTicker: "TSM",
  },
  {
    displayName: "BYD",
    aliases: ["BYD", "比亚迪", "比亞迪", "002594", "1211.HK"],
    hkTicker: "1211.HK",
    cnTicker: "002594",
  },
  {
    displayName: "CATL",
    aliases: ["CATL", "宁德时代", "寧德時代", "300750"],
    cnTicker: "300750",
  },
  {
    displayName: "Kweichow Moutai",
    aliases: ["Kweichow Moutai", "贵州茅台", "貴州茅台", "600519"],
    cnTicker: "600519",
  },
];

function buildCompanyContext(query: string): CompanyContext {
  const normalized = query.trim();
  const lower = normalized.toLowerCase();
  const compact = lower.replace(/\s+/g, "");
  const profile = COMPANY_PROFILES.find((item) =>
    item.aliases.some((alias) => {
      const aliasLower = alias.toLowerCase();
      return lower === aliasLower || compact === aliasLower.replace(/\s+/g, "") || normalized.includes(alias);
    }),
  );

  if (profile) {
    return {
      input: normalized,
      displayName: profile.displayName,
      aliases: profile.aliases,
      isTencent: Boolean(profile.isTencent),
      usTicker: profile.usTicker,
      hkTicker: profile.hkTicker,
      cnTicker: profile.cnTicker,
      resolutionSource: "profile",
      resolutionConfidence: 1,
      expansionTerms: [],
    };
  }

  const looksLikeUsTicker = /^[A-Z]{1,6}(?:\.[A-Z])?$/i.test(normalized);
  const looksLikeCnTicker = /^(?:60|68|00|30)\d{4}$/.test(normalized);
  const looksLikeHkTicker = /^\d{3,5}(?:\.HK)?$/i.test(normalized);

  return {
    input: normalized,
    displayName: normalized,
    aliases: [normalized],
    isTencent: false,
    usTicker: looksLikeUsTicker ? normalized.toUpperCase() : undefined,
    hkTicker: looksLikeHkTicker ? normalized.replace(/\.HK$/i, "").padStart(4, "0") + ".HK" : undefined,
    cnTicker: looksLikeCnTicker ? normalized : undefined,
    resolutionSource: "input",
    resolutionConfidence: 0,
    expansionTerms: [],
  };
}

export function rangeDays(range: TimeRange) {
  if (range === "today") return 1;
  if (range === "last7") return 7;
  if (range === "last30") return 30;
  const now = startOfUtcDay();
  return Math.round((now.getTime() - cutoffForRange("week").getTime()) / 86_400_000) + 1;
}

function rangeWhen(range: TimeRange) {
  return `${rangeDays(range)}d`;
}

function googleRecentFilter(range: TimeRange) {
  if (range === "today") return "qdr:d";
  if (range === "week" || range === "last7") return "qdr:w";
  return "qdr:m";
}

function cutoffForRange(range: TimeRange) {
  const cutoff = startOfUtcDay();
  if (range === "today") return cutoff;
  if (range === "week") {
    const daysSinceMonday = (cutoff.getUTCDay() + 6) % 7;
    cutoff.setUTCDate(cutoff.getUTCDate() - daysSinceMonday);
    return cutoff;
  }
  cutoff.setUTCDate(cutoff.getUTCDate() - (range === "last30" ? 29 : 6));
  return cutoff;
}

function startOfUtcDay() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function briefPeriodDescription(range: TimeRange, language: BriefLanguage) {
  const start = formatIsoDate(cutoffForRange(range));
  const end = formatIsoDate(new Date());
  if (language === "zh") return `所选时间范围（${start} 至 ${end}）`;
  return `the selected time window (${start} through ${end})`;
}

function aiKeyNewsAnnotationLimit(range: TimeRange) {
  return range === "last30" ? 6 : range === "today" ? 3 : 4;
}

function sourceFromUrl(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const canonicalPublishers = [
      { name: "Sina Finance", domains: ["sina.com.cn", "sina.cn"] },
      { name: "Eastmoney", domains: ["eastmoney.com"] },
      { name: "Tencent Finance", domains: ["qq.com"] },
      { name: "Sohu Finance", domains: ["sohu.com"] },
      { name: "Yahoo Finance", domains: ["yahoo.com"] },
      { name: "HKEX", domains: ["hkex.com.hk", "hkexnews.hk"] },
    ];
    const publisher = canonicalPublishers.find((group) =>
      group.domains.some((domain) => host === domain || host.endsWith(`.${domain}`)),
    );
    if (publisher) return publisher.name;
    return host.split(".").slice(-3).join(".");
  } catch {
    return "Unknown";
  }
}

function hostFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function matchesDomain(url: string, domains: string[]) {
  const host = hostFromUrl(url);
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function categoryForUrl(url: string, fallback: SourceCategory): SourceCategory {
  if (matchesDomain(url, OFFICIAL_EXCHANGE_DOMAINS)) return "Official / Exchange";
  if (matchesDomain(url, REGULATOR_DOMAINS)) return "Regulator";
  if (matchesDomain(url, CHINESE_FINANCIAL_DOMAINS)) return "Chinese financial media";
  if (matchesDomain(url, HK_FINANCIAL_DOMAINS)) return "HK financial media";
  if (matchesDomain(url, INTERNATIONAL_FINANCIAL_DOMAINS)) return "International financial media";
  return fallback;
}

function sourceTierForUrl(url: string): { tier: SourceTier; label: string } {
  if (matchesDomain(url, TIER_1_DOMAINS)) {
    return { tier: 1, label: "Tier 1 - primary financial / official" };
  }
  if (matchesDomain(url, TIER_2_DOMAINS)) {
    return { tier: 2, label: "Tier 2 - reputable financial / tech media" };
  }
  if (matchesDomain(url, TIER_3_DOMAINS)) {
    return { tier: 3, label: "Tier 3 - market data / aggregation" };
  }
  return { tier: 3, label: "Tier 3 - allowed secondary source" };
}

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.forEach((_, key) => {
      if (key.startsWith("utm_") || key === "ref" || key === "guccounter") {
        parsed.searchParams.delete(key);
      }
    });
    return parsed.toString();
  } catch {
    return url;
  }
}

function isTencentRelated(article: Article, company = buildCompanyContext("Tencent")) {
  return companyRelevanceScore(article, company) >= 3;
}

function isDirectTencentMention(article: Article, company = buildCompanyContext("Tencent")) {
  return companyRelevanceScore(article, company) >= 4;
}

function aliasRegex(alias: string) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (/^[a-z0-9.:-]+$/i.test(alias)) return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return new RegExp(escaped, "i");
}

export function companyRelevanceScore(
  article: Pick<Article, "title" | "snippet" | "content" | "url">,
  company = buildCompanyContext("Tencent"),
) {
  const title = article.title.toLowerCase();
  const text = `${article.title} ${article.snippet} ${article.content}`.toLowerCase();
  const url = article.url.toLowerCase();
  let score = 0;

  for (const alias of company.aliases) {
    if (aliasRegex(alias).test(text)) score += alias.length <= 4 ? 5 : 7;
  }

  if (company.isTencent) {
    if (/tencent holdings|腾讯控股|騰訊控股|00700|0700\.hk|tcehy|hk700|sehk:700/.test(text)) score += 8;
    if (/\btencent\b|腾讯|騰訊/.test(text)) score += 2;
    if (/wechat|weixin|微信|企业微信|企微/.test(text)) score += 1;
  }

  const companyEventTerms = [
    /回购|repurchase|buyback/,
    /港股|港元|市值|股份|持股|股票|股价|股價|sehk|hkex|nasdaq|nyse|shares|stock/,
    /业绩|業績|财报|財報|营收|收入|利润|盈利|earnings|revenue|profit/,
    /ai|人工智能|大模型|deepseek|agent|小微|云|cloud|data center|chip|gpu|semiconductor/,
    /游戏|gaming|game studios|marvelous|海外|投资|出售|退出|offload|divest|stake|acquisition/,
    /监管|审批|合规|regulation|approval/,
  ];
  score += companyEventTerms.reduce((sum, pattern) => sum + (pattern.test(text) ? 2 : 0), 0);

  const publisherOnlySignals = [
    /腾讯新闻/,
    /騰訊新聞/,
    /news\.qq\.com/,
    /view\.inews\.qq\.com/,
  ];
  const unrelatedSignals = [
    /志愿填报|高考|家长|学子|讲坛|济南站|剑南春/,
    /体育|娱乐|社会新闻|天气|地震|警方|总理辞职/,
  ];

  if (company.isTencent && publisherOnlySignals.some((pattern) => pattern.test(title) || pattern.test(url)) && score < 5) {
    score -= 6;
  }
  if (unrelatedSignals.some((pattern) => pattern.test(text))) score -= 6;

  return score;
}

function directCompanyMentionInTitleOrSnippet(
  article: Pick<Article, "title" | "snippet" | "url">,
  company = buildCompanyContext("Tencent"),
) {
  const text = `${article.title} ${article.snippet}`.toLowerCase();
  return company.aliases.some((alias) => aliasRegex(alias).test(text)) ||
    (company.isTencent && /\btencent\b|腾讯|騰訊|00700|0700\.hk|tcehy/.test(text));
}

function directCompanyMentionInTitle(article: Pick<Article, "title">, company = buildCompanyContext("Tencent")) {
  const title = article.title.toLowerCase();
  return company.aliases.some((alias) => aliasRegex(alias).test(title)) ||
    (company.isTencent && /\btencent\b|腾讯|騰訊|00700|0700\.hk|tcehy/.test(title));
}

function isGenericSourcePage(article: Article) {
  const title = article.title.toLowerCase();
  const url = article.url.toLowerCase();
  return (
    NON_NEWS_HINTS.some((hint) => title.includes(hint) || url.includes(hint)) ||
    IRRELEVANT_CONTEXT_HINTS.some((hint) => article.title.includes(hint) || article.snippet.includes(hint)) ||
    title === "投资者- tencent 腾讯" ||
    title === "investors - tencent 腾讯" ||
    title === "搜索" ||
    /^[a-z .,&-]+\([a-z.]{1,8}\)$/.test(title) ||
    /^[a-z .,&-]+ inc\.?\s*\([a-z.]{1,8}\)$/.test(title) ||
    title.includes("搜尋結果") ||
    title.includes("搜索结果") ||
    title.includes("公司資料") ||
    title.includes("公司资料") ||
    title.includes("公司背景") ||
    url.includes("/search?") ||
    url.includes("newsearch/search") ||
    url.endsWith("/investors.html") ||
    url.endsWith("/investors/announcements.html")
  );
}

function isNonCoreFinancialNoise(article: Article) {
  const text = `${article.title} ${article.snippet} ${article.url}`.toLowerCase();
  return [
    /statement of changes.*beneficial ownership/,
    /\bform\s*4\b/,
    /持股变动|持股變動|高管持股/,
    /\boptions?\b|期权|期權/,
    /price target|target price|raises pt|lowers pt|cuts pt|maintains hold|moves .* to hold|initiates .* at/,
    /upgrade|downgrade|评级|評級|目标价|目標價|大行/,
    /zacks analyst blog|analyst blog|highlights .* and |what'?s ahead/,
    /jim cramer|cramer|price direction/,
    /if you invested|invested \$?\d+.*decade|how much it'?d be worth/,
    /stock tracker|overthinking stock picks/,
    /融资买入|融資買入|融资余额|融資餘額|融资融券|融資融券|主力资金|主力資金|资金净流|資金淨流|北向资金|北向資金/,
    /margin financing|margin balance|northbound funds|fund flows?/,
    /为什么.*便宜|核心原因|深度解析|实用技巧|實用技巧|避坑|攻略|\bfaq\b|高仿/,
    /大摩|德银|德銀|摩根士丹利|morgan stanley|deutsche bank/,
    /weighs in on .*intel.*fed|takes aim at .*fed/i,
    /best .*stocks?|better buy|which .*stock|worth buying|according to analysts|hidden way to trade|trade it/,
    /签名皮夹克|皮夹克.*拍卖|拍卖/,
    /community\/feed|guba|股吧|雪球/,
    /(?:tencent|腾讯|騰訊).*(?:backed|backing|投资|投資|连续投|參投|参投).*(?:ipo|上市|递表|遞表|冲击ipo|衝擊ipo)/,
    /(?:tencent|腾讯|騰訊).*(?:都投了|融资|融資).*?(?:阿里|百度|快手|startup|start-up)/,
    /(?:tencent|腾讯|騰訊).*(?:阿里|百度).*?(?:快手|可灵|可靈|kling|融资|融資|联盟|聯盟)/,
    /(?:阿里|百度).*?(?:tencent|腾讯|騰訊).*?(?:快手|可灵|可靈|kling|融资|融資|联盟|聯盟)/,
    /ai视频最大单笔融资|ai視頻最大單筆融資/,
    /(?:backed by|backed).*?(?:tencent|腾讯|騰訊).*?(?:ipo|上市|递表|遞表)/,
    /^[\u4e00-\u9fa5A-Za-z0-9 .-]{2,24}[：:][\s\S]*(?:英特尔|intel)[\s\S]*(?:amd|超威|超微)/i,
  ].some((pattern) => pattern.test(text));
}

function isLowQuality(article: Article) {
  const haystack = `${article.source} ${article.url} ${article.title}`.toLowerCase();
  return LOW_QUALITY_HINTS.some((hint) => haystack.includes(hint));
}

function financialNewsScore(article: Article, company: CompanyContext) {
  const title = article.title.toLowerCase();
  const text = `${article.title} ${article.snippet} ${article.content}`.toLowerCase();
  let score = 0;

  const hardNewsPatterns = [
    /财报|財報|业绩|業績|营收|營收|收入|利润|利潤|盈利|亏损|虧損|earnings|revenue|profit|loss|guidance|指引/,
    /订单|訂單|合同|合约|合約|采购|採購|供应|供應|supply|deal|contract|order|partnership|合作|客户|客戶/,
    /回购|回購|repurchase|buyback|分红|分紅|dividend|派息|配股|增发|增發|convertible|可转债|可轉債/,
    /收购|收購|并购|併購|出售|剥离|剝離|退出|投资|投資|融资|融資|acquisition|merger|divest|stake|investment|funding/,
    /监管|監管|调查|調查|审批|審批|罚款|罰款|诉讼|訴訟|反垄断|反壟斷|regulation|regulator|probe|antitrust|lawsuit|approval/,
    /发布|發布|推出|上线|上線|测试|測試|launch|release|rollout|unveil|ship|deliver|exhibition|展览|展覽|store|stores|retail|flagship|开店|開店|关店|關店|门店|門店|概念店|旗艦店|旗舰店|乐园|樂園|主题公园|主題公園|家电|家電/,
    /ai|人工智能|大模型|模型|芯片|晶片|算力|gpu|cloud|云|雲|data center|robot|机器人|機器人|semiconductor/,
    /门店|門店|产能|產能|交付|销量|銷量|价格战|價格戰|补贴|補貼|供应链|供應鏈|logistics|delivery|supply chain/,
    /战略|戰略|布局|落子|落地|擴張|扩张|园区|園區|入职|入職|重组|重組|组织调整|組織調整|高管|ceo|cfo|management|layoff|裁员|招聘|office|offices|campus|headcount|hiring|办公楼|辦公樓|写字楼|寫字樓|购楼|購樓|购入|購入|置业|置業|办公|總部|总部|经营任务|經營任務|经营会议|經營會議|营销工作会|營銷工作會|渠道改革|渠道調整|渠道调整|产品管线|產品管線|新ip|\bip\b|手游|手遊|甜品店/,
  ];

  for (const pattern of hardNewsPatterns) {
    if (pattern.test(text)) score += 2;
  }

  if (article.category === "Official / Exchange" || article.category === "Regulator") score += 3;
  if (article.sourceTier === 1) score += 3;
  if (article.sourceTier === 2) score += 1;
  if (directCompanyMentionInTitle(article, company)) score += 2;
  if (directCompanyMentionInTitleOrSnippet(article, company)) score += 1;

  const weakOrMarketOnlyPatterns = [
    /股价|股價|上涨|上漲|下跌|涨超|漲超|跌超|盘中|盤中|尾盘|尾盤|premarket|after-hours|shares (?:rise|fall|slip|jump)/,
    /jump \d+%|jumps \d+%|stock jumps|stocks? catch .*bid|risk-on bid|technical|indicator|技术指标|技術指標|反弹信号|反彈信號|what'?s going on|why .*stock|stock moved/,
    /price target|target price|raises pt|lowers pt|评级|評級|大行|broker|analyst|according to analysts/,
    /better buy|worth buying|best .*stocks?|which .*stock|值得买入|更值得买入|最值得/,
    /quote|股價、新聞、報價|股价、新闻、报价|share price|stock price/,
  ];

  for (const pattern of weakOrMarketOnlyPatterns) {
    if (pattern.test(title) || pattern.test(text)) score -= 4;
  }

  if (matchesDomain(article.url, TIER_3_DOMAINS) && score < 7) score -= 2;
  return score;
}

function isFinancialNewsEvent(article: Article, company: CompanyContext) {
  const score = financialNewsScore(article, company);
  if (article.sourceTier === 1) return score >= 4;
  if (article.sourceTier === 2) return score >= 5;
  return score >= 7;
}

function sourcePriority(article: Article, _language: BriefLanguage, company: CompanyContext) {
  const haystack = `${article.source} ${article.url} ${article.title}`.toLowerCase();
  const categoryPriority: Record<SourceCategory, number> = {
    "Official / Exchange": 6,
    Regulator: 6,
    "Chinese financial media": 6,
    "HK financial media": 6,
    "International financial media": 6,
    "General news": 1,
  };

  const trustedBoost = REPUTABLE_SOURCE_HINTS.some((hint) => haystack.includes(hint)) ? 2 : 0;
  const relevanceBoost = Math.min(8, Math.max(0, companyRelevanceScore(article, company)));
  const tierBoost = article.sourceTier === 1 ? 4 : article.sourceTier === 2 ? 2 : 0;
  const financialBoost = Math.min(10, Math.max(0, financialNewsScore(article, company)));

  return categoryPriority[article.category] + trustedBoost + relevanceBoost + tierBoost + financialBoost;
}

function eventKey(article: Pick<Article, "title" | "snippet" | "content">) {
  const text = `${article.title} ${article.snippet} ${article.content}`.toLowerCase();

  if (/cxmt|长鑫|長鑫|memory supply|内存|dram|存储芯片/.test(text)) return "cxmt-memory-supply";
  if (/雄安|xiong.?an|陆家嘴|lōjiāzuǐ|办公楼|辦公樓|office building|购楼|購樓|大厦|大廈/.test(text)) {
    return "office-expansion";
  }
  if (/小微|xiaowei|wechat ai|微信.*ai|ai.*微信|ai assistant/.test(text)) return "wechat-ai-xiaowei";
  if (/marvelous|japanese game|japan gaming|game studios|游戏工作室|海外游戏|日本游戏/.test(text)) {
    return "overseas-gaming-investments";
  }
  if (/回购|repurchase|buyback/.test(text)) return "share-buyback";
  if (/监管|regulation|approval|审批|版号|未成年|防沉迷/.test(text)) return "regulation";
  if (/cloud|云|模型|deepseek|agent/.test(text)) return "ai-cloud";
  if (/earnings|revenue|profit|业绩|财报|收入|利润/.test(text)) return "earnings";

  return article.title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !["tencent", "腾讯", "控股", "news", "报道"].includes(word))
    .slice(0, 4)
    .join("-");
}

const EVENT_STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "news",
  "stock",
  "shares",
  "company",
  "latest",
  "报道",
  "财经",
  "新闻",
  "公司",
  "集团",
  "控股",
  "最新",
]);

function headlineEventTerms(title: string, company: CompanyContext) {
  let text = title.toLowerCase().replace(/\s+-\s+[^-]{1,60}$/, " ");
  for (const alias of company.aliases) {
    if (alias.length >= 2) text = text.replace(aliasRegex(alias), " ");
  }

  const terms = new Set<string>();
  for (const word of text.match(/[a-z][a-z0-9.-]{2,}/g) ?? []) {
    if (!EVENT_STOP_WORDS.has(word)) terms.add(word);
  }

  for (const phrase of text.match(/[\u3400-\u9fff]{2,}/g) ?? []) {
    for (let index = 0; index < phrase.length - 1; index += 1) {
      const bigram = phrase.slice(index, index + 2);
      if (!EVENT_STOP_WORDS.has(bigram)) terms.add(bigram);
    }
  }

  return terms;
}

function headlineEventSimilarity(left: Article, right: Article, company: CompanyContext) {
  const leftTerms = headlineEventTerms(left.title, company);
  const rightTerms = headlineEventTerms(right.title, company);
  if (leftTerms.size === 0 || rightTerms.size === 0) return 0;

  let overlap = 0;
  for (const term of leftTerms) {
    if (rightTerms.has(term)) overlap += 1;
  }

  const containsCjkHeadline = containsCjk(left.title) || containsCjk(right.title);
  const minimumOverlap = containsCjkHeadline ? 2 : 1;
  if (overlap < minimumOverlap) return 0;

  return overlap / Math.min(leftTerms.size, rightTerms.size);
}

function assignEventClusters(articles: Article[], language: BriefLanguage, company: CompanyContext) {
  type EventGroup = { id: string; representative: Article; articles: Article[] };
  const groups: EventGroup[] = [];
  const ranked = [...articles].sort((a, b) => sourcePriority(b, language, company) - sourcePriority(a, language, company));

  for (const article of ranked) {
    const baseId = eventKey(article) || "company-news";
    const matchedByKey = groups.find((group) => group.id === baseId);
    const matchedByHeadline = groups.find((group) => {
      const similarity = headlineEventSimilarity(article, group.representative, company);
      const threshold = containsCjk(article.title) || containsCjk(group.representative.title) ? 0.16 : 0.28;
      return similarity >= threshold;
    });
    const matched = matchedByKey ?? matchedByHeadline;

    if (matched) {
      matched.articles.push(article);
      continue;
    }

    const duplicateCount = groups.filter((group) => group.id === baseId || group.id.startsWith(`${baseId}-`)).length;
    groups.push({
      id: duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`,
      representative: article,
      articles: [article],
    });
  }

  return groups
    .flatMap((group) => group.articles.map((article) => ({ ...article, eventClusterId: group.id })))
    .sort((a, b) => sourcePriority(b, language, company) - sourcePriority(a, language, company));
}

function eventLabelForKey(key: string, language: BriefLanguage) {
  const labels: Record<string, Record<BriefLanguage, string>> = {
    "wechat-ai-xiaowei": { en: "WeChat / AI assistant", zh: "微信 / AI 助手" },
    "cxmt-memory-supply": { en: "CXMT memory supply", zh: "长鑫存储 / 内存供应" },
    "office-expansion": { en: "Office footprint expansion", zh: "办公布局" },
    "overseas-gaming-investments": { en: "Overseas gaming investments", zh: "海外游戏投资" },
    "share-buyback": { en: "Share buyback", zh: "股份回购" },
    regulation: { en: "Regulatory development", zh: "监管动态" },
    "ai-cloud": { en: "AI / cloud infrastructure", zh: "AI / 云基础设施" },
    earnings: { en: "Earnings / financials", zh: "业绩 / 财务" },
  };
  return labels[key]?.[language] ?? key.split("-").filter(Boolean).slice(0, 5).join(" ");
}

function compareDateDesc(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return b.localeCompare(a);
}

function buildEventClusters(articles: Article[], language: BriefLanguage): EventCluster[] {
  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    const key = article.eventClusterId || eventKey(article);
    groups.set(key, [...(groups.get(key) ?? []), article]);
  }

  return Array.from(groups.entries())
    .map(([id, groupedArticles]) => {
      const sorted = [...groupedArticles].sort((a, b) => {
        const tierDelta = a.sourceTier - b.sourceTier;
        if (tierDelta !== 0) return tierDelta;
        return compareDateDesc(a.publishedDate, b.publishedDate);
      });
      const latestDate = groupedArticles
        .map((article) => article.publishedDate)
        .filter((date): date is string => Boolean(date))
        .sort((a, b) => b.localeCompare(a))[0] ?? null;
      return {
        id,
        label: eventLabelForKey(id, language),
        articleIds: sorted.map((article) => article.id),
        sourceCount: new Set(groupedArticles.map((article) => article.source)).size,
        tier1Count: groupedArticles.filter((article) => article.sourceTier === 1).length,
        tier2Count: groupedArticles.filter((article) => article.sourceTier === 2).length,
        tier3Count: groupedArticles.filter((article) => article.sourceTier === 3).length,
        latestDate,
        representativeSource: sorted[0]?.source ?? "",
      };
    })
    .sort((a, b) => {
      const qualityDelta = b.tier1Count * 3 + b.tier2Count * 2 - (a.tier1Count * 3 + a.tier2Count * 2);
      if (qualityDelta !== 0) return qualityDelta;
      return compareDateDesc(a.latestDate, b.latestDate);
    });
}

function retainDistinctArticleCoverage(articles: Article[]) {
  const retained: Article[] = [];
  const seenEventPublisher = new Set<string>();

  for (const article of articles) {
    const event = article.eventClusterId || eventKey(article);
    const key = `${event}|${article.source.toLowerCase()}`;
    if (seenEventPublisher.has(key)) continue;
    seenEventPublisher.add(key);
    retained.push(article);
  }

  return retained;
}

function selectEditorialArticles(articles: Article[], limit: number) {
  const selected: Article[] = [];
  const eventCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();

  function maybeAdd(article: Article, maxPerEvent: number, maxPerSource: number) {
    const key = article.eventClusterId || eventKey(article);
    const eventCount = eventCounts.get(key) ?? 0;
    const sourceCount = sourceCounts.get(article.source) ?? 0;
    if (selected.some((selectedArticle) => selectedArticle.url === article.url)) return false;
    if (selected.some((selectedArticle) => selectedArticle.eventClusterId === key && selectedArticle.source === article.source)) {
      return false;
    }
    if (eventCount >= maxPerEvent) return false;
    if (sourceCount >= maxPerSource) return false;
    selected.push(article);
    eventCounts.set(key, eventCount + 1);
    sourceCounts.set(article.source, sourceCount + 1);
    return true;
  }

  for (const article of articles) {
    maybeAdd(article, 2, 3);
    if (selected.length >= limit) return selected;
  }

  for (const article of articles) {
    maybeAdd(article, 2, 4);
    if (selected.length >= limit) return selected;
  }

  return selected;
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateEvaluation(article: Pick<Article, "publishedDate" | "url">, range: TimeRange) {
  const dateText = article.publishedDate ?? inferDateFromUrl(article.url)?.value;
  if (!dateText) return { verified: false, insideRange: false };
  const published = parsePublishedDate(dateText);
  if (!published) return { verified: false, insideRange: false };
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return { verified: true, insideRange: published >= cutoffForRange(range) && published <= tomorrow };
}

function inferDateFromUrl(url: string): DateEvidence | null {
  const match = url.match(/(20\d{2})[/-](\d{2})[/-](\d{2})/);
  if (!match) return null;
  return {
    value: `${match[1]}-${match[2]}-${match[3]}`,
    source: "url",
  };
}

function normalizeDateEvidence(evidence: DateEvidence | null) {
  if (!evidence) return null;
  const parsed = parsePublishedDate(evidence.value);
  if (!parsed) return null;
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  if (parsed > tomorrow) return null;
  return {
    ...evidence,
    value: formatIsoDate(parsed),
  };
}

function parsePublishedDate(dateText: string) {
  const normalized = dateText.trim().toLowerCase();
  const now = new Date();
  const relativeMatch = normalized.match(/(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\s+ago/);
  if (relativeMatch) {
    const amount = Number(relativeMatch[1]);
    const unit = relativeMatch[2];
    const date = new Date(now);
    if (unit.startsWith("minute")) date.setMinutes(date.getMinutes() - amount);
    if (unit.startsWith("hour")) date.setHours(date.getHours() - amount);
    if (unit.startsWith("day")) date.setDate(date.getDate() - amount);
    if (unit.startsWith("week")) date.setDate(date.getDate() - amount * 7);
    return date;
  }

  const zhRelativeMatch = normalized.match(/(\d+)\s*(分钟|小時|小时|天|日|周|星期)前/);
  if (zhRelativeMatch) {
    const amount = Number(zhRelativeMatch[1]);
    const unit = zhRelativeMatch[2];
    const date = new Date(now);
    if (unit === "分钟") date.setMinutes(date.getMinutes() - amount);
    if (unit === "小時" || unit === "小时") date.setHours(date.getHours() - amount);
    if (unit === "天" || unit === "日") date.setDate(date.getDate() - amount);
    if (unit === "周" || unit === "星期") date.setDate(date.getDate() - amount * 7);
    return date;
  }

  if (normalized.includes("昨天")) {
    const date = new Date(now);
    date.setDate(date.getDate() - 1);
    return date;
  }

  if (normalized.includes("前天")) {
    const date = new Date(now);
    date.setDate(date.getDate() - 2);
    return date;
  }

  const zhDateMatch = normalized.match(/(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
  if (zhDateMatch) {
    return new Date(`${zhDateMatch[1]}-${zhDateMatch[2].padStart(2, "0")}-${zhDateMatch[3].padStart(2, "0")}`);
  }

  const fullDateMatch = normalized.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (fullDateMatch) {
    return new Date(
      `${fullDateMatch[1]}-${fullDateMatch[2].padStart(2, "0")}-${fullDateMatch[3].padStart(2, "0")}`,
    );
  }

  const monthDayMatch = normalized.match(/(?:^|\s)(\d{1,2})-(\d{1,2})(?:\s|$)/);
  if (monthDayMatch) {
    return new Date(`${now.getFullYear()}-${monthDayMatch[1].padStart(2, "0")}-${monthDayMatch[2].padStart(2, "0")}`);
  }

  const parsed = new Date(dateText);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function evidenceFromSearchDate(dateText: string | null): DateEvidence | null {
  if (!dateText) return null;
  return normalizeDateEvidence({ value: dateText, source: "search-api" });
}

function isRelevantForCategory(article: Article, company = buildCompanyContext("Tencent")) {
  if (isGenericSourcePage(article)) return false;
  if (isNonCoreFinancialNoise(article)) return false;
  const titleMention = directCompanyMentionInTitle(article, company);
  // A company mentioned only in the article deck is commonly a passive investor,
  // customer, or comparison point. That is not reliable enough for an issuer feed.
  if (!titleMention) return false;
  if (companyRelevanceScore(article, company) < 4) return false;
  if (!isFinancialNewsEvent(article, company)) return false;
  return true;
}

function isAllowedSource(article: Article, _language: BriefLanguage) {
  return isAllowedUrl(article.url, article.category, _language);
}

function isAllowedUrl(url: string, category: SourceCategory, _language: BriefLanguage) {
  const allowedDomains = STRICT_CHINESE_SOURCE_DOMAINS[category];
  if (allowedDomains.length === 0) return false;
  return matchesDomain(url, allowedDomains);
}

function makePlan(
  query: string,
  category: SourceCategory,
  mode: Article["searchMode"],
  maxResults: number,
  includeDomains?: string[],
  symbols?: string[],
): SearchPlan {
  return {
    query,
    category,
    includeDomains,
    maxResults,
    topic: mode === "Google Web" ? "general" : "news",
    symbols,
    mode,
    provider:
      mode === "Marketaux"
        ? "marketaux"
        : mode === "Alpha Vantage"
          ? "alphavantage"
          : mode === "Google News RSS"
            ? "googleRss"
          : mode === "Tavily"
            ? "tavily"
            : mode === "Sina Finance"
              ? "sina"
              : mode === "Yahoo Finance"
                ? "yahoo"
                : "serpapi",
  };
}

function siteQuery(query: string, domains: string[]) {
  return `${query} (${domains.map((domain) => `site:${domain}`).join(" OR ")})`;
}

function dedupePlans(plans: SearchPlan[]) {
  const seen = new Set<string>();
  return plans.filter((plan) => {
    const key = `${plan.provider}|${plan.mode}|${plan.category}|${plan.locale ?? "shared"}|${plan.query}|${plan.symbols?.join(",") ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function tickerSymbolsForFinanceApis(company: CompanyContext) {
  return [company.usTicker, company.hkTicker, company.cnTicker]
    .filter((item): item is string => Boolean(item))
    .map((item) => item.toUpperCase());
}

function alphaVantageTicker(company: CompanyContext) {
  return company.usTicker?.toUpperCase() ?? null;
}

function yahooFinanceQueries(company: CompanyContext) {
  const queries = [
    company.usTicker,
    company.displayName,
    company.hkTicker,
    company.cnTicker,
  ].filter((item): item is string => Boolean(item));
  return [...new Set(queries)];
}

function containsCjk(text: string) {
  return /[\u3400-\u9fff]/.test(text);
}

type CompanyResolution = {
  displayName?: string;
  canonicalEnglishName?: string;
  canonicalChineseName?: string;
  aliases: string[];
  productAliases: string[];
  usTicker?: string;
  hkTicker?: string;
  cnTicker?: string;
  confidence: number;
};

const companyResolutionCache = new Map<string, Promise<CompanyContext>>();

const GENERIC_EXPANSION_TERMS = new Set([
  "ai",
  "cloud",
  "gaming",
  "news",
  "stock",
  "stocks",
  "company",
  "group",
  "holdings",
  "inc",
  "corp",
  "corporation",
  "core",
  "atom",
  "arc",
  "international",
  "limited",
  "ltd",
  "plc",
  "科技",
  "公司",
  "集团",
  "集團",
  "控股",
  "股份",
  "新闻",
  "新聞",
  "财经",
  "財經",
  "股票",
  "证券",
  "證券",
]);

function cleanExpansionTerm(value: unknown) {
  if (typeof value !== "string") return null;
  const term = value.replace(/\s+/g, " ").trim();
  if (term.length < 2 || term.length > 60) return null;
  const lower = term.toLowerCase();
  if (GENERIC_EXPANSION_TERMS.has(lower)) return null;
  if (/https?:|www\.|site:|\bafter:|\bor\b/i.test(term)) return null;
  if (!/[\p{L}\p{N}]/u.test(term)) return null;
  return term;
}

function cleanTermList(values: unknown, limit = 24) {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const value of values) {
    const term = cleanExpansionTerm(value);
    if (!term) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push(term);
    if (terms.length >= limit) break;
  }
  return terms;
}

function uniqueTerms(values: unknown[], limit = 28) {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const value of values) {
    const term = cleanExpansionTerm(value);
    if (!term) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push(term);
    if (terms.length >= limit) break;
  }
  return terms;
}

function normalizeUsTicker(value: unknown) {
  const term = cleanExpansionTerm(value)?.toUpperCase();
  if (!term) return undefined;
  return /^[A-Z]{1,6}(?:\.[A-Z])?$/.test(term) ? term : undefined;
}

function normalizeHkTicker(value: unknown) {
  const term = cleanExpansionTerm(value)?.toUpperCase();
  if (!term) return undefined;
  const match = term.match(/^(\d{1,5})(?:\.HK)?$/);
  if (!match) return undefined;
  return `${match[1].padStart(4, "0")}.HK`;
}

function normalizeCnTicker(value: unknown) {
  const term = cleanExpansionTerm(value);
  if (!term) return undefined;
  return /^(?:60|68|00|30)\d{4}$/.test(term) ? term : undefined;
}

async function resolveCompanyExpansionWithDeepSeek(
  query: string,
  language: BriefLanguage,
  base: CompanyContext,
): Promise<CompanyResolution | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: deepSeekModel(),
        temperature: 0,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You resolve public-company search aliases for equity news retrieval. Return JSON only. Do not invent news, events, dates, or sources. If a ticker or alias is uncertain, omit it.",
          },
          {
            role: "user",
            content: JSON.stringify({
              input: query,
              userLanguage: language,
              existingContext: {
                displayName: base.displayName,
                aliases: base.aliases,
                usTicker: base.usTicker ?? null,
                hkTicker: base.hkTicker ?? null,
                cnTicker: base.cnTicker ?? null,
              },
              task:
                "Return conservative aliases, exchange tickers, and major brand/product terms that are useful for retrieving company-specific finance news.",
              rules: [
                "Use common public-company names only.",
                "Include product or IP names only when they are strongly associated with the company and likely to appear in news headlines.",
                "Do not include generic industry terms such as AI, cloud, gaming, chips, ecommerce, retail, or finance.",
                "Do not include search operators, URLs, news topics, dates, or claims.",
                "If the input is ambiguous, keep confidence below 0.55 and return only the original input.",
              ],
              schema: {
                displayName: "string or null",
                canonicalEnglishName: "string or null",
                canonicalChineseName: "string or null",
                aliases: ["company aliases, legal names, ADR names"],
                productAliases: ["major brands, products, IP names"],
                usTicker: "NASDAQ/NYSE ticker or null",
                hkTicker: "Hong Kong ticker like 9992.HK or null",
                cnTicker: "A-share ticker or null",
                confidence: "0 to 1",
              },
            }),
          },
        ],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;
    const json = await response.json();
    const raw = json.choices?.[0]?.message?.content;
    if (typeof raw !== "string" || !raw.trim()) return null;
    const parsed = safeParseJson(raw) as Record<string, unknown>;
    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence ?? 0)));
    if (confidence < 0.55) return null;

    return {
      displayName: cleanExpansionTerm(parsed.displayName) ?? undefined,
      canonicalEnglishName: cleanExpansionTerm(parsed.canonicalEnglishName) ?? undefined,
      canonicalChineseName: cleanExpansionTerm(parsed.canonicalChineseName) ?? undefined,
      aliases: cleanTermList(parsed.aliases, 14),
      productAliases: cleanTermList(parsed.productAliases, 10),
      usTicker: normalizeUsTicker(parsed.usTicker),
      hkTicker: normalizeHkTicker(parsed.hkTicker),
      cnTicker: normalizeCnTicker(parsed.cnTicker),
      confidence,
    };
  } catch {
    return null;
  }
}

function mergeCompanyResolution(base: CompanyContext, resolution: CompanyResolution | null): CompanyContext {
  if (!resolution) return base;

  const displayName = base.resolutionSource === "profile" ? base.displayName : (resolution.displayName ?? base.displayName);
  const tickers = [resolution.usTicker, resolution.hkTicker, resolution.cnTicker].filter((item): item is string => Boolean(item));
  const aliases = uniqueTerms(
    [
      displayName,
      ...base.aliases,
      resolution.displayName,
      resolution.canonicalEnglishName,
      resolution.canonicalChineseName,
      ...resolution.aliases,
      ...tickers,
      ...resolution.productAliases,
    ],
    32,
  );
  const baseKeys = new Set(base.aliases.map((alias) => alias.toLowerCase()));
  const expansionTerms = aliases.filter((alias) => !baseKeys.has(alias.toLowerCase()) && alias !== displayName).slice(0, 16);

  return {
    ...base,
    displayName,
    aliases: aliases.length ? aliases : base.aliases,
    usTicker: base.usTicker ?? resolution.usTicker,
    hkTicker: base.hkTicker ?? resolution.hkTicker,
    cnTicker: base.cnTicker ?? resolution.cnTicker,
    resolutionSource: base.resolutionSource === "profile" ? "profile+llm" : "llm",
    resolutionConfidence: resolution.confidence,
    expansionTerms,
  };
}

async function resolveCompanyContext(query: string) {
  const key = query.trim().toLowerCase();
  const cached = companyResolutionCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const base = buildCompanyContext(query);
    const entityLanguage: BriefLanguage = containsCjk(query) ? "zh" : "en";
    const resolution = await resolveCompanyExpansionWithDeepSeek(query, entityLanguage, base);
    return mergeCompanyResolution(base, resolution);
  })();

  companyResolutionCache.set(key, promise);
  return promise;
}

function companyResolutionNote(company: CompanyContext, language: BriefLanguage) {
  if (company.resolutionSource !== "llm" && company.resolutionSource !== "profile+llm") return null;
  const terms = company.expansionTerms.slice(0, 10).join(", ");
  if (!terms) return null;
  return language === "zh"
    ? `检索实体扩展: ${company.input} -> ${terms}。这些词只用于检索和过滤，不作为新闻事实。`
    : `Search entity expansion: ${company.input} -> ${terms}. These terms are used only for retrieval and filtering, not as news facts.`;
}

function compactNotes(notes: Array<string | null | undefined>) {
  return notes.filter((note): note is string => Boolean(note));
}

function buildSearchPlans(company: CompanyContext): SearchPlan[] {
  const primary = company.displayName;
  const zhPrimary = company.isTencent
    ? "腾讯"
    : company.aliases.find((alias) => containsCjk(alias)) ?? company.displayName;
  const expanded = company.aliases.join(" OR ");
  const tickerAliases = [company.usTicker, company.hkTicker, company.cnTicker].filter((item): item is string => Boolean(item));
  const financeApiSymbols = tickerSymbolsForFinanceApis(company);
  const marketauxEntities = [primary, ...company.aliases, ...tickerAliases].slice(0, 8).join(" OR ");
  const marketauxSearchZh = `${marketauxEntities} 财经 OR 业绩 OR 回购 OR 监管 OR AI OR 合作`;
  const marketauxSearchEn = `${marketauxEntities} earnings OR revenue OR buyback OR regulation OR AI OR deal`;
  const zhAliases = company.isTencent ? ["腾讯", "腾讯控股", "00700", "0700.HK"] : [primary, ...company.aliases, ...tickerAliases];
  const enAliases = company.isTencent ? ["Tencent", "Tencent Holdings", "0700.HK", "TCEHY"] : [primary, expanded];
  const zhNoiseExclusions = "-百家号 -搜狐号 -网易号 -腾讯新闻 -高考 -志愿 -剑南春";
  const alphaTicker = alphaVantageTicker(company);
  const yahooQueries = yahooFinanceQueries(company);

  const sharedPlans: SearchPlan[] = [
    ...(alphaTicker
      ? [makePlan(alphaTicker, "International financial media", "Alpha Vantage", 50, undefined, [alphaTicker])]
      : []),
    ...[company.usTicker, company.hkTicker, company.cnTicker]
      .filter((ticker): ticker is string => Boolean(ticker))
      .map((ticker) => makePlan(ticker, "Chinese financial media", "Sina Finance", 30, CHINESE_FINANCIAL_DOMAINS)),
    ...yahooQueries.map((item) =>
      makePlan(item, "International financial media", "Yahoo Finance", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
    ),
  ];

  const chineseDiscoveryPlans: SearchPlan[] = [
    makePlan(marketauxSearchZh, "Chinese financial media", "Marketaux", 50, undefined, financeApiSymbols),
    // Personal-demo discovery only: RSS links are decoded to original publishers,
    // then pass the same source, relevance, date, and tier gates as every result.
    makePlan(`${zhPrimary} 财经 新闻`, "Chinese financial media", "Google News RSS", 14, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 公司 业绩 回购 监管 产品 合作`, "Chinese financial media", "Google News RSS", 14, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 新闻`, "Chinese financial media", "Google News", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhAliases.join(" ")} 最新 新闻 ${zhNoiseExclusions}`, "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(siteQuery(`${zhPrimary} 最新 新闻`, ["stcn.com", "cls.cn", "yicai.com", "caixin.com", "cnstock.com"]), "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(siteQuery(`${zhPrimary} 财经 新闻`, ["finance.eastmoney.com", "finance.sina.com.cn", "cj.sina.cn", "finance.qq.com", "finance.sohu.com"]), "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(siteQuery(`${zhPrimary} 控股 新闻`, ["21jingji.com", "nbd.com.cn", "jiemian.com", "thepaper.cn", "wallstreetcn.com"]), "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 财经 证券时报 财新 第一财经 财联社`, "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 业绩 营收 利润 指引`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 监管 调查 处罚 合规`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 合作 订单 供应链 产品 发布`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 回购 分红 收购 投资 融资`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
    ...(company.isTencent ? [
      makePlan(`${zhPrimary} 长鑫存储 CXMT 内存 采购`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 长鑫存储 CXMT 内存 采购`, "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
    ] : []),
    makePlan(`${zhPrimary} 公司公告 交易所 回购`, "Official / Exchange", "Google Web", 12, OFFICIAL_EXCHANGE_DOMAINS),
    makePlan(`${zhPrimary} 监管 审批 游戏 AI`, "Regulator", "Google Web", 10, REGULATOR_DOMAINS),
    makePlan(`${zhPrimary} 股票 新闻`, "Chinese financial media", "Bing News", 20, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} ${company.hkTicker ?? ""} ${company.cnTicker ?? ""} ${company.usTicker ?? ""} 股票 新闻`, "HK financial media", "Google News", 16, HK_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 最新 财经 新闻`, "Chinese financial media", "Tavily", 12, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} 公司新闻 业绩 监管 产品 合作`, "Chinese financial media", "Tavily", 12, CHINESE_FINANCIAL_DOMAINS),
    makePlan(`${zhPrimary} ${company.hkTicker ?? ""} ${company.cnTicker ?? ""} ${company.usTicker ?? ""} 核心财经新闻`, "Chinese financial media", "Tavily", 12, CHINESE_FINANCIAL_DOMAINS),
  ];

  const internationalDiscoveryPlans: SearchPlan[] = [
    makePlan(marketauxSearchEn, "International financial media", "Marketaux", 50, undefined, financeApiSymbols),
    makePlan(`${primary} company news`, "International financial media", "Google News RSS", 14, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(
      `${primary} earnings deal product regulation`,
      "International financial media",
      "Google News RSS",
      14,
      INTERNATIONAL_FINANCIAL_DOMAINS,
    ),
    makePlan(expanded, "International financial media", "Google News", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(`${primary} stock news`, "International financial media", "Google News", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(`${primary} earnings revenue guidance`, "International financial media", "Google News", 14, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(`${primary} AI data center chip cloud gaming regulation`, "International financial media", "Google News", 16, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(`${primary} stock news earnings AI data center acquisition chip`, "International financial media", "Google Web", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(
      siteQuery(`${primary} latest news stock`, ["reuters.com", "bloomberg.com", "cnbc.com", "finance.yahoo.com", "marketwatch.com"]),
      "International financial media",
      "Google Web",
      20,
      INTERNATIONAL_FINANCIAL_DOMAINS,
    ),
    makePlan(
      siteQuery(`${primary} AI chip data center`, ["tomshardware.com", "theverge.com", "barrons.com", "investors.com", "benzinga.com"]),
      "International financial media",
      "Google Web",
      20,
      INTERNATIONAL_FINANCIAL_DOMAINS,
    ),
    makePlan(`${primary} latest company news`, "International financial media", "Bing News", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(`${primary} official investor relations news`, "Official / Exchange", "Google Web", 10, OFFICIAL_EXCHANGE_DOMAINS),
    makePlan(`${primary} latest stock news`, "International financial media", "Tavily", 12, INTERNATIONAL_FINANCIAL_DOMAINS),
    makePlan(`${primary} company news earnings regulation product deal`, "International financial media", "Tavily", 12, INTERNATIONAL_FINANCIAL_DOMAINS),
  ];

  return dedupePlans([
    ...sharedPlans,
    ...chineseDiscoveryPlans.map((plan) => ({ ...plan, locale: "zh" as const })),
    ...internationalDiscoveryPlans.map((plan) => ({ ...plan, locale: "en" as const })),
  ]);
}

function providerLabelForPlan(plan: SearchPlan) {
  if (plan.provider === "marketaux") return "Marketaux";
  if (plan.provider === "alphavantage") return "Alpha Vantage";
  if (plan.provider === "serpapi") return "SerpAPI";
  if (plan.provider === "googleRss") return "Google News RSS (personal demo)";
  if (plan.provider === "sina") return "Sina Finance";
  if (plan.provider === "yahoo") return "Yahoo Finance";
  return "Tavily";
}

function providerEnvName(provider: SearchPlan["provider"]) {
  if (provider === "marketaux") return "MARKETAUX_API_KEY";
  if (provider === "alphavantage") return "ALPHAVANTAGE_API_KEY";
  if (provider === "serpapi") return "SERPAPI_API_KEY";
  if (provider === "googleRss") return "GOOGLE_NEWS_RSS_PERSONAL_DEMO=true";
  if (provider === "tavily") return "TAVILY_API_KEY or SEARCH_API_KEY";
  return null;
}

function buildSearchDiagnostics(
  plans: SearchPlan[],
  raw: RawResult[],
  availableApiProviders: Partial<Record<SearchPlan["provider"], boolean>>,
  providerFailures: ProviderFailures = {},
): SearchDiagnostic[] {
  return plans.map((plan) => {
    const requiresKey = providerEnvName(plan.provider);
    const available = requiresKey ? Boolean(availableApiProviders[plan.provider]) : true;
    const resultCount = raw.filter((item) => item.searchMode === plan.mode && item.searchQuery === plan.query).length;
    const failure = providerFailures[plan.provider];
    return {
      provider: providerLabelForPlan(plan),
      mode: plan.mode,
      query: plan.query,
      category: plan.category,
      // A configured key is not evidence that the provider actually returned news.
      // Keep an empty response visible so coverage gaps cannot masquerade as success.
      status: !available ? "skipped" : failure ? "failed" : resultCount > 0 ? "used" : "empty",
      resultCount,
      error: !available ? `Missing ${requiresKey}` : failure ?? (resultCount === 0 ? "No results returned" : undefined),
    };
  });
}

function googleNewsRssEnabled() {
  return process.env.GOOGLE_NEWS_RSS_PERSONAL_DEMO === "true";
}

function providerFailureMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Provider request failed";
  return message.replace(/\s+/g, " ").trim().slice(0, 240);
}

export async function searchTencentNews(query: string, range: TimeRange, language: BriefLanguage) {
  const company = await resolveCompanyContext(query);
  const searches = buildSearchPlans(company);
  const marketauxApiKey = process.env.MARKETAUX_API_KEY;
  const alphaVantageApiKey = process.env.ALPHAVANTAGE_API_KEY;
  const serpApiKey = process.env.SERPAPI_API_KEY;
  const tavilyApiKey = process.env.TAVILY_API_KEY ?? process.env.SEARCH_API_KEY;
  const rssEnabled = googleNewsRssEnabled();
  const providerFailures: ProviderFailures = {};
  const recordFailure = (provider: SearchPlan["provider"], error: unknown) => {
    providerFailures[provider] ??= providerFailureMessage(error);
  };

  const marketauxSearches = searches.filter((plan) => plan.provider === "marketaux");
  const alphaVantageSearches = searches.filter((plan) => plan.provider === "alphavantage");
  const serpSearches = searches.filter((plan) => plan.provider === "serpapi");
  const tavilySearches = searches.filter((plan) => plan.provider === "tavily");
  const sinaSearches = searches.filter((plan) => plan.provider === "sina");
  const yahooSearches = searches.filter((plan) => plan.provider === "yahoo");
  const googleRssSearches = searches.filter((plan) => plan.provider === "googleRss");
  const [marketauxRaw, alphaVantageRaw, yahooRaw, sinaRaw, tavilyRaw, serpRaw, googleRssRaw] = await Promise.all([
    marketauxApiKey ? searchWithMarketaux(marketauxSearches, range, language, marketauxApiKey, company) : Promise.resolve([]),
    alphaVantageApiKey ? searchWithAlphaVantage(alphaVantageSearches, range, alphaVantageApiKey) : Promise.resolve([]),
    searchWithYahooFinance(yahooSearches),
    searchWithSinaFinance(sinaSearches),
    tavilyApiKey ? searchWithTavily(tavilySearches, range, tavilyApiKey) : Promise.resolve([]),
    serpApiKey ? searchWithSerpApi(serpSearches, range, language, serpApiKey, (error) => recordFailure("serpapi", error)) : Promise.resolve([]),
    rssEnabled ? searchWithGoogleNewsRss(googleRssSearches, range, language, (error) => recordFailure("googleRss", error)) : Promise.resolve([]),
  ]);

  const raw = [...marketauxRaw, ...alphaVantageRaw, ...yahooRaw, ...sinaRaw, ...tavilyRaw, ...serpRaw, ...googleRssRaw];
  const diagnostics = buildSearchDiagnostics(searches, raw, {
    marketaux: Boolean(marketauxApiKey),
    alphavantage: Boolean(alphaVantageApiKey),
    serpapi: Boolean(serpApiKey),
    tavily: Boolean(tavilyApiKey),
    googleRss: rssEnabled,
  }, providerFailures);

  return normalizeAndFilterResults(raw, range, language, company, diagnostics);
}

async function searchWithMarketaux(
  searches: SearchPlan[],
  range: TimeRange,
  language: BriefLanguage,
  apiKey: string,
  company: CompanyContext,
): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const requests = buildMarketauxUrls(plan, range, plan.locale ?? language, apiKey, company);
      const responses = await Promise.all(
        requests.map(async (url) => {
          const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 VerifiedEquityBrief/0.1" },
            cache: "no-store",
            signal: AbortSignal.timeout(15000),
          });
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Marketaux failed: ${response.status} ${text.slice(0, 240)}`);
          }
          return (await response.json()) as { data?: MarketauxArticle[] };
        }),
      );
      return { plan, data: responses.flatMap((response) => response.data ?? []) };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; data: MarketauxArticle[] }> =>
      result.status === "fulfilled",
    )
    .flatMap((result) =>
      result.value.data
        .filter((item): item is MarketauxArticle & { title: string; url: string } => Boolean(item.title && item.url))
        .map((item) => {
          const snippet = item.snippet || item.description || "";
          return {
            title: item.title.trim(),
            url: item.url,
            snippet: snippet.trim(),
            content: snippet.slice(0, 1000).trim(),
            publishedDate: item.published_at ?? null,
            category: categoryForUrl(item.url, result.value.plan.category),
            searchProvider: "Marketaux",
            searchMode: "Marketaux" as const,
            searchQuery: result.value.plan.query,
          };
        }),
    );
}

function buildMarketauxUrls(
  plan: SearchPlan,
  range: TimeRange,
  language: BriefLanguage,
  apiKey: string,
  company: CompanyContext,
) {
  const baseParams = {
    api_token: apiKey,
    language: language === "zh" ? "zh" : "en",
    published_after: formatIsoDate(cutoffForRange(range)),
    limit: String(plan.maxResults ?? 50),
    group_similar: "true",
  };
  const urls: string[] = [];

  if (plan.symbols?.length) {
    const params = new URLSearchParams({
      ...baseParams,
      symbols: plan.symbols.join(","),
      filter_entities: "true",
      must_have_entities: "true",
    });
    urls.push(`https://api.marketaux.com/v1/news/all?${params.toString()}`);
  }

  const search = marketauxSearchQuery(plan.query, company);
  if (search) {
    const params = new URLSearchParams({
      ...baseParams,
      search,
    });
    urls.push(`https://api.marketaux.com/v1/news/all?${params.toString()}`);
  }

  return urls;
}

function marketauxSearchQuery(query: string, company: CompanyContext) {
  const entityTerms = [company.displayName, ...company.aliases, company.usTicker, company.hkTicker, company.cnTicker]
    .filter((item): item is string => Boolean(item))
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
  const eventTerms = ["earnings", "revenue", "buyback", "regulation", "AI", "deal", "回购", "监管", "业绩", "合作"];
  const queryTerms = query
    .split(/\s+OR\s+|\s+/i)
    .map((item) => item.replace(/[()]/g, "").trim())
    .filter(Boolean)
    .slice(0, 8);
  const entities = [...new Set([...entityTerms, ...queryTerms])];
  return `(${entities.join("|")}) (${eventTerms.join("|")})`;
}

async function searchWithAlphaVantage(searches: SearchPlan[], range: TimeRange, apiKey: string): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const ticker = plan.symbols?.[0] ?? plan.query;
      const params = new URLSearchParams({
        function: "NEWS_SENTIMENT",
        tickers: ticker,
        time_from: formatAlphaVantageTime(cutoffForRange(range)),
        sort: "LATEST",
        limit: String(plan.maxResults ?? 50),
        apikey: apiKey,
      });
      const response = await fetch(`https://www.alphavantage.co/query?${params.toString()}`, {
        headers: { "User-Agent": "Mozilla/5.0 VerifiedEquityBrief/0.1" },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Alpha Vantage failed: ${response.status} ${text.slice(0, 240)}`);
      }
      const data = (await response.json()) as {
        feed?: AlphaVantageArticle[];
        Information?: string;
        Note?: string;
        "Error Message"?: string;
      };
      if (data["Error Message"] || data.Note || data.Information) {
        throw new Error(data["Error Message"] ?? data.Note ?? data.Information);
      }
      return { plan, data: data.feed ?? [] };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; data: AlphaVantageArticle[] }> =>
      result.status === "fulfilled",
    )
    .flatMap((result) =>
      result.value.data
        .filter((item): item is AlphaVantageArticle & { title: string; url: string } => Boolean(item.title && item.url))
        .map((item) => ({
          title: item.title.trim(),
          url: item.url,
          snippet: (item.summary ?? "").trim(),
          content: (item.summary ?? "").slice(0, 1000).trim(),
          publishedDate: parseAlphaVantageDate(item.time_published),
          category: categoryForUrl(item.url, result.value.plan.category),
          searchProvider: "Alpha Vantage News Sentiment",
          searchMode: "Alpha Vantage" as const,
          searchQuery: result.value.plan.query,
        })),
    );
}

function formatAlphaVantageTime(date: Date) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}T0000`;
}

function parseAlphaVantageDate(value?: string) {
  if (!value) return null;
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

async function searchWithYahooFinance(searches: SearchPlan[]): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const params = new URLSearchParams({
        q: plan.query,
        newsCount: String(plan.maxResults ?? 20),
        quotesCount: "0",
      });
      const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?${params}`, {
        headers: { "User-Agent": "Mozilla/5.0 EquityResearchCopilot/0.1" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Yahoo Finance failed: ${response.status} ${text.slice(0, 240)}`);
      }
      const data = (await response.json()) as {
        news?: Array<{
          title?: string;
          link?: string;
          publisher?: string;
          providerPublishTime?: number;
          summary?: string;
        }>;
      };
      return { plan, data };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; data: { news?: Array<Record<string, unknown>> } }> =>
      result.status === "fulfilled",
    )
    .flatMap((result) =>
      (result.value.data.news ?? [])
        .filter((item) => typeof item.title === "string" && typeof item.link === "string")
        .map((item) => ({
          title: String(item.title).trim(),
          url: String(item.link),
          snippet: typeof item.summary === "string" ? item.summary.trim() : "",
          content: typeof item.summary === "string" ? item.summary.slice(0, 800).trim() : "",
          publishedDate:
            typeof item.providerPublishTime === "number"
              ? new Date(item.providerPublishTime * 1000).toISOString().slice(0, 10)
              : null,
          category: categoryForUrl(String(item.link), result.value.plan.category),
          searchProvider: "Yahoo Finance",
          searchMode: "Yahoo Finance" as const,
          searchQuery: result.value.plan.query,
        })),
    );
}

async function searchWithSinaFinance(searches: SearchPlan[]): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const urls = sinaCompanyNewsUrls(plan.query);
      const htmls = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 VerifiedEquityBrief/0.1" },
            cache: "no-store",
            signal: AbortSignal.timeout(12000),
          });
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Sina Finance failed: ${response.status} ${text.slice(0, 240)}`);
          }
          const buffer = await response.arrayBuffer();
          return new TextDecoder("gb18030").decode(buffer);
        }),
      );
      return { plan, htmls };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; htmls: string[] }> => result.status === "fulfilled")
    .flatMap((result) => result.value.htmls.flatMap((html) => extractSinaStockPageNews(html, result.value.plan)));
}

function sinaCompanyNewsUrls(input: string) {
  const ticker = input.toUpperCase().trim();
  const hkMatch = ticker.match(/^(\d{1,5})(?:\.HK)?$/);
  if (hkMatch) {
    return [`https://stock.finance.sina.com.cn/hkstock/news/${hkMatch[1].padStart(5, "0")}.html`];
  }

  if (/^(?:60|68|00|30)\d{4}$/.test(ticker)) {
    const exchange = ticker.startsWith("60") || ticker.startsWith("68") ? "sh" : "sz";
    return [`https://vip.stock.finance.sina.com.cn/corp/go.php/vCB_AllNewsStock/symbol/${exchange}${ticker}.phtml`];
  }

  return [
    `https://biz.finance.sina.com.cn/usstock/usstock_news.php?symbol=${ticker}`,
    `https://stock.finance.sina.com.cn/usstock/quotes/${ticker}.html`,
  ];
}

function extractSinaStockPageNews(html: string, plan: SearchPlan): RawResult[] {
  const datedItems = [...html.matchAll(/<li>\s*<span[^>]+class=["']xb_list_r["'][^>]*>([^<]+)<\/span>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      const dateEvidence = normalizeDateEvidence(
        match[1] ? { value: match[1], source: "page-metadata" } : null,
      );
      return {
        title: match[3].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
        url: absolutizeUrl(match[2]),
        publishedDate: dateEvidence?.value ?? inferDateFromUrl(match[2])?.value ?? null,
      };
    })
    .filter((item) => item.title && item.url)
    .map((item) => ({
      title: item.title,
      url: item.url,
      snippet: item.title,
      content: item.title,
      publishedDate: item.publishedDate,
      category: categoryForUrl(item.url, plan.category),
      searchProvider: "Sina Finance Company News",
      searchMode: "Sina Finance" as const,
      searchQuery: plan.query,
    }));

  const hkNewsItems = [...html.matchAll(
    /<a[^>]+href=["']([^"']+)["'][^>]*title=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>\s*<span[^>]*class=["']rt["'][^>]*>(20\d{2}-\d{1,2}-\d{1,2})(?:\s+\d{1,2}:\d{2}:?\d{0,2})?<\/span>/gi,
  )]
    .map((match) => ({
      title: match[2].replace(/&nbsp;/g, " ").trim(),
      url: absolutizeUrl(match[1]),
      publishedDate: normalizeDateEvidence(match[3] ? { value: match[3], source: "page-metadata" } : null)?.value ?? null,
    }))
    .filter((item) => item.title && item.url);

  const cnNewsItems = [...html.matchAll(
    /(20\d{2}-\d{1,2}-\d{1,2})(?:&nbsp;|\s)+(?:\d{1,2}:\d{2})(?:&nbsp;|\s)+<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
  )]
    .map((match) => ({
      title: match[3].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
      url: absolutizeUrl(match[2]),
      publishedDate: normalizeDateEvidence(match[1] ? { value: match[1], source: "page-metadata" } : null)?.value ?? null,
    }))
    .filter((item) => item.title && item.url);

  const pageDatedItems = [...hkNewsItems, ...cnNewsItems].map((item) => ({
    title: item.title,
    url: item.url,
    snippet: item.title,
    content: item.title,
    publishedDate: item.publishedDate,
    category: categoryForUrl(item.url, plan.category),
    searchProvider: "Sina Finance Company News",
    searchMode: "Sina Finance" as const,
    searchQuery: plan.query,
  }));

  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      url: absolutizeUrl(match[1]),
      title: match[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
    }))
    .filter((item) => item.title && item.url);

  const seen = new Set<string>();
  const fallbackItems = links
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return /finance\.sina\.com\.cn|cj\.sina\.cn|t\.cj\.sina\.cn/.test(item.url);
    })
    .filter((item) => !/更多|公司新闻|公司资讯|研究报告|财经首页|美股首页|行情中心|中国概念股|添加自选|在APP中查看/.test(item.title))
    .slice(0, plan.maxResults ?? 20)
    .map((item) => ({
      title: item.title,
      url: item.url,
      snippet: item.title,
      content: item.title,
      publishedDate: inferDateFromUrl(item.url)?.value ?? null,
      category: categoryForUrl(item.url, plan.category),
      searchProvider: "Sina Finance Stock Page",
      searchMode: "Sina Finance" as const,
      searchQuery: plan.query,
    }));

  return [...datedItems, ...pageDatedItems, ...fallbackItems];
}

function absolutizeUrl(url: string) {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://finance.sina.com.cn${url}`;
  return url;
}

async function searchWithTavily(searches: SearchPlan[], range: TimeRange, apiKey: string): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: plan.query,
          search_depth: "advanced",
          topic: plan.topic ?? "news",
          ...(plan.topic === "news" || !plan.topic ? { days: rangeDays(range) } : {}),
          max_results: plan.maxResults ?? 6,
          include_raw_content: true,
          include_domains: plan.includeDomains,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Search API failed: ${response.status} ${text.slice(0, 240)}`);
      }

      return {
        plan,
        data: (await response.json()) as { results?: TavilyResult[] },
      };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; data: { results?: TavilyResult[] } }> =>
      result.status === "fulfilled",
    )
    .flatMap((result) =>
      (result.value.data.results ?? [])
        .filter((item): item is TavilyResult & { title: string; url: string } => Boolean(item.title && item.url))
        .map((item) => ({
          title: item.title.trim(),
          url: item.url,
          snippet: (item.content ?? "").trim(),
          content: (item.raw_content ?? item.content ?? "").slice(0, 800).trim(),
          publishedDate: item.published_date ?? null,
          category: categoryForUrl(item.url, result.value.plan.category),
          searchProvider: "Tavily",
          searchMode: "Tavily" as const,
          searchQuery: result.value.plan.query,
        })),
    );
}

async function searchWithSerpApi(
  searches: SearchPlan[],
  range: TimeRange,
  language: BriefLanguage,
  apiKey: string,
  onFailure?: (error: unknown) => void,
): Promise<RawResult[]> {
  const results: RawResult[] = [];
  let firstFailure: unknown = null;

  for (let index = 0; index < searches.length; index += 3) {
    const batch = searches.slice(index, index + 3);
    const responseSettled = await Promise.allSettled(
      batch.map(async (plan) => {
      const response = await fetch(buildSerpApiUrl(plan, range, plan.locale ?? language, apiKey), {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`SerpAPI failed: ${response.status} ${text.slice(0, 240)}`);
      }

      const data = (await response.json()) as Record<string, unknown>;
      const providerError = firstText(data.error, data.error_message, data.message);
      if (providerError) throw new Error(`SerpAPI: ${providerError}`);

      return {
        plan,
        data,
      };
      }),
    );

    const rejected = responseSettled.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    if (rejected) {
      firstFailure ??= rejected.reason;
      if (/run out of searches|quota|plan limit|account.*searches/i.test(providerFailureMessage(rejected.reason))) {
        onFailure?.(rejected.reason);
        break;
      }
    }

    results.push(
      ...responseSettled
        .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; data: Record<string, unknown> }> => result.status === "fulfilled")
        .flatMap((result) => extractSerpApiResults(result.value.data, result.value.plan)),
    );
  }

  if (results.length === 0 && firstFailure) onFailure?.(firstFailure);
  return results;
}

function rssText(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i, "$1")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rssTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return rssText(match?.[1]);
}

function parseGoogleNewsRss(xml: string): GoogleNewsRssItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const item = match[1];
      const sourceMatch = item.match(/<source[^>]*url=["']([^"']+)["'][^>]*>([\s\S]*?)<\/source>/i);
      const title = rssTag(item, "title");
      const googleUrl = rssTag(item, "link");
      return {
        title,
        googleUrl,
        publisherUrl: sourceMatch?.[1] ? rssText(sourceMatch[1]) : null,
        snippet: rssTag(item, "description"),
        publishedDate: rssTag(item, "pubDate") || null,
      };
    })
    .filter((item) => Boolean(item.title && item.googleUrl));
}

function isGoogleRssPublisherAllowed(item: GoogleNewsRssItem, plan: SearchPlan, language: BriefLanguage) {
  if (!item.publisherUrl) return false;
  const category = categoryForUrl(item.publisherUrl, plan.category);
  if (!isAllowedUrl(item.publisherUrl, category, language)) return false;
  return !plan.includeDomains?.length || matchesDomain(item.publisherUrl, plan.includeDomains);
}

async function decodeGoogleNewsUrls(urls: string[]) {
  // This package only transforms Google News redirect URLs to their publisher URLs.
  // It does not supply article content or bypass the downstream admission checks.
  const { GoogleDecoder } = require("google-news-url-decoder") as {
    GoogleDecoder: new () => {
      decodeBatch: (sourceUrls: string[]) => Promise<GoogleNewsDecodeResult[]>;
      decode: (sourceUrl: string) => Promise<GoogleNewsDecodeResult>;
    };
  };
  const decoder = new GoogleDecoder();
  return decoder.decodeBatch(urls);
}

function hostnameForUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function decodedUrlMatchesPublisher(decodedUrl: string, publisherUrl: string | null) {
  const decodedHost = hostnameForUrl(decodedUrl);
  const publisherHost = hostnameForUrl(publisherUrl);
  if (!decodedHost || !publisherHost) return false;
  return decodedHost === publisherHost || decodedHost.endsWith(`.${publisherHost}`) || publisherHost.endsWith(`.${decodedHost}`);
}

async function decodeGoogleNewsUrl(url: string) {
  const { GoogleDecoder } = require("google-news-url-decoder") as {
    GoogleDecoder: new () => { decode: (sourceUrl: string) => Promise<GoogleNewsDecodeResult> };
  };
  return new GoogleDecoder().decode(url);
}

async function searchWithGoogleNewsRss(
  searches: SearchPlan[],
  range: TimeRange,
  language: BriefLanguage,
  onFailure?: (error: unknown) => void,
): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan): Promise<RawResult[]> => {
      const searchLocale = plan.locale ?? language;
      const params = new URLSearchParams({
        q: `${plan.query} when:${rangeWhen(range)}`.trim(),
        hl: searchLocale === "zh" ? "zh-CN" : "en-US",
        gl: searchLocale === "zh" ? "CN" : "US",
        ceid: searchLocale === "zh" ? "CN:zh-Hans" : "US:en",
      });
      const response = await fetch(`https://news.google.com/rss/search?${params.toString()}`, {
        headers: { "User-Agent": "Mozilla/5.0 VerifiedEquityBrief/0.1" },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Google News RSS failed: ${response.status}`);

      const items = parseGoogleNewsRss(await response.text())
        .filter((item) => isGoogleRssPublisherAllowed(item, plan, searchLocale))
        .slice(0, plan.maxResults ?? 12);
      if (items.length === 0) return [];
      const decoded = await decodeGoogleNewsUrls(items.map((item) => item.googleUrl));
      const batchUrlByGoogleUrl = new Map(
        decoded.flatMap((result) =>
          result.status && result.source_url && result.decoded_url ? [[result.source_url, result.decoded_url] as const] : [],
        ),
      );
      const resolvedUrls = await runSettledInBatches(
        items,
        async (item) => {
          const batchUrl = batchUrlByGoogleUrl.get(item.googleUrl);
          if (batchUrl && decodedUrlMatchesPublisher(batchUrl, item.publisherUrl)) return batchUrl;

          // Google may return batch responses in an order that differs from the
          // request. Re-decode only mismatches; never pair a headline to a URL
          // whose original publisher disagrees with the RSS publisher record.
          const single = await decodeGoogleNewsUrl(item.googleUrl);
          return single.status && single.decoded_url && decodedUrlMatchesPublisher(single.decoded_url, item.publisherUrl)
            ? single.decoded_url
            : null;
        },
        2,
      );

      return items.flatMap((item, index) => {
        const result = resolvedUrls[index];
        const url = result.status === "fulfilled" ? result.value : null;
        if (!url) return [];
        const category = categoryForUrl(url, plan.category);
        if (!isAllowedUrl(url, category, searchLocale)) return [];
        if (plan.includeDomains?.length && !matchesDomain(url, plan.includeDomains)) return [];
        return [{
          title: item.title,
          url,
          publisherUrl: item.publisherUrl ?? undefined,
          snippet: item.snippet,
          content: item.snippet.slice(0, 800),
          publishedDate: item.publishedDate,
          category,
          searchProvider: "Google News RSS (personal demo)",
          searchMode: "Google News RSS" as const,
          searchQuery: plan.query,
        } satisfies RawResult];
      });
    },
    2,
  );

  const results = responseSettled
    .filter((result): result is PromiseFulfilledResult<RawResult[]> => result.status === "fulfilled")
    .flatMap((result) => result.value);
  const failure = responseSettled.find((result): result is PromiseRejectedResult => result.status === "rejected");
  if (results.length === 0 && failure) onFailure?.(failure.reason);
  return results;
}

async function runSettledInBatches<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  batchSize: number,
): Promise<PromiseSettledResult<R>[]> {
  const settled: PromiseSettledResult<R>[] = [];
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    settled.push(...(await Promise.allSettled(batch.map((item) => worker(item)))));
  }
  return settled;
}

function buildSerpApiUrl(plan: SearchPlan, range: TimeRange, language: BriefLanguage, apiKey: string) {
  const params = new URLSearchParams({
    api_key: apiKey,
    q: plan.query,
  });

  if (plan.mode === "Bing News") {
    params.set("engine", "bing_news");
    params.set("cc", language === "zh" ? "hk" : "us");
    params.set("count", String(plan.maxResults ?? 20));
    params.set("q", plan.query);
    return `https://serpapi.com/search.json?${params.toString()}`;
  }

  if (plan.mode === "Google News") {
    params.set("engine", "google_news");
    params.set("hl", language === "zh" ? "zh-CN" : "en");
    params.set("gl", language === "zh" ? "cn" : "us");
    params.set("q", `${plan.query} when:${rangeWhen(range)}`.trim());
    return `https://serpapi.com/search.json?${params.toString()}`;
  }

  params.set("engine", "google");
  params.set("hl", language === "zh" ? "zh-CN" : "en");
  params.set("gl", language === "zh" ? "hk" : "us");
  params.set("num", String(plan.maxResults ?? 10));
  params.set("tbs", googleRecentFilter(range));
  params.set("q", `${plan.query} after:${formatDate(cutoffForRange(range))}`.trim());
  return `https://serpapi.com/search.json?${params.toString()}`;
}

function domainQuery(domains?: string[]) {
  if (!domains?.length) return "";
  return `(${domains.map((domain) => `site:${domain}`).join(" OR ")})`;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function extractSerpApiResults(data: Record<string, unknown>, plan: SearchPlan): RawResult[] {
  const resultGroups = [
    data.news_results,
    data.organic_results,
    data.top_stories,
    data.organic,
  ].filter(Array.isArray) as SerpApiResult[][];

  return resultGroups.flatMap((group) => flattenSerpApiItems(group))
      .filter((item) => Boolean(item.title && (item.link || item.url)))
      .map((item) => {
        const snippet = item.snippet ?? item.summary ?? "";
        return {
          title: String(item.title).trim(),
          url: String(item.link ?? item.url),
          snippet: String(snippet).trim(),
          content: String(snippet).slice(0, 800).trim(),
          publishedDate: firstText(
            item.date,
            item.date_published,
            item.published_date,
            item.published_at,
            item.displayed_date,
          ),
          category: categoryForUrl(String(item.link ?? item.url), plan.category),
          searchProvider: plan.mode === "Bing News" ? "SerpAPI Bing News" : `SerpAPI ${plan.mode}`,
          searchMode: plan.mode,
          searchQuery: plan.query,
        };
      });
}

function flattenSerpApiItems(items: SerpApiResult[]): SerpApiResult[] {
  return items.flatMap((item) => [item, ...(Array.isArray(item.stories) ? flattenSerpApiItems(item.stories) : [])]);
}

function firstText(...values: unknown[]) {
  const value = values.find((item) => typeof item === "string" && item.trim());
  return typeof value === "string" ? value : null;
}

function extractDateFromHtml(html: string): DateEvidence | null {
  const patterns: RegExp[] = [
    /property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i,
    /property=["']og:published_time["'][^>]*content=["']([^"']+)["']/i,
    /name=["']pubdate["'][^>]*content=["']([^"']+)["']/i,
    /name=["']publishdate["'][^>]*content=["']([^"']+)["']/i,
    /name=["']publish-date["'][^>]*content=["']([^"']+)["']/i,
    /name=["']date["'][^>]*content=["']([^"']+)["']/i,
    /itemprop=["']datePublished["'][^>]*content=["']([^"']+)["']/i,
    /<time[^>]+datetime=["']([^"']+)["'][^>]*>/i,
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /"dateCreated"\s*:\s*"([^"]+)"/i,
    /"pubDate"\s*:\s*"([^"]+)"/i,
    /发布时间[:：\s]*([0-9]{4}[-/年][0-9]{1,2}[-/月][0-9]{1,2}(?:[-/日][0-9]{1,2})?)/i,
    /发布日期[:：\s]*([0-9]{4}[-/年][0-9]{1,2}[-/月][0-9]{1,2}(?:[-/日][0-9]{1,2})?)/i,
    /发表时间[:：\s]*([0-9]{4}[-/年][0-9]{1,2}[-/月][0-9]{1,2}(?:[-/日][0-9]{1,2})?)/i,
    /来源[:：][^<]{0,40}([0-9]{4}\s*年\s*[0-9]{1,2}\s*月\s*[0-9]{1,2}\s*日)/i,
    /([0-9]{4}\s*年\s*[0-9]{1,2}\s*月\s*[0-9]{1,2}\s*日\s*[0-9]{0,2}:?[0-9]{0,2})/,
    /\b(20\d{2}-\d{1,2}-\d{1,2})(?:\s+\d{1,2}:\d{2})?\b/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const normalized = normalizeDateEvidence(match?.[1] ? { value: match[1], source: "page-metadata" } : null);
    if (normalized) return normalized;
  }

  return null;
}

async function extractPublishedDateFromPage(url: string): Promise<DateEvidence | null> {
  if (url.toLowerCase().endsWith(".pdf")) return null;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 EquityResearchCopilot/0.1",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const html = (await response.text()).slice(0, 120000);
    return extractDateFromHtml(html);
  } catch {
    return null;
  }
}

async function normalizeAndFilterResults(
  raw: RawResult[],
  range: TimeRange,
  language: BriefLanguage,
  company: CompanyContext,
  searchDiagnostics: SearchDiagnostic[],
): Promise<NormalizedResults> {
  const seen = new Set<string>();
  const seenTitles = new Set<string>();
  const articles: Article[] = [];
  let duplicatesRemoved = 0;

  for (const result of raw) {
    const url = normalizeUrl(result.url);
    const tier = sourceTierForUrl(url);
    const normalizedTitle = result.title.trim().toLowerCase().replace(/\s+/g, " ");
    if (seen.has(url) || seenTitles.has(normalizedTitle)) {
      duplicatesRemoved += 1;
      continue;
    }
    seen.add(url);
    seenTitles.add(normalizedTitle);
    articles.push({
      id: articles.length + 1,
      title: result.title.trim(),
      url,
      publisherUrl: result.publisherUrl ? normalizeUrl(result.publisherUrl) : undefined,
      source: sourceFromUrl(url),
      sourceTier: tier.tier,
      sourceTierLabel: tier.label,
      searchProvider: result.searchProvider,
      searchMode: result.searchMode,
      eventClusterId: "",
      publishedDate: evidenceFromSearchDate(result.publishedDate)?.value ?? null,
      dateSource: evidenceFromSearchDate(result.publishedDate)?.source ?? "unavailable",
      dateStatus: "unverified",
      usableForClaims: false,
      snippet: result.snippet,
      content: result.content,
      category: categoryForUrl(url, result.category),
    });
  }

  // Article pages are only used for date verification. Screen obvious noise first,
  // then bound page fetches so broad recall does not become a slow crawler.
  const dateCandidates = articles
    .filter((article) => isAllowedSource(article, language))
    .filter((article) => !isLowQuality(article) && !isGenericSourcePage(article) && !isNonCoreFinancialNoise(article))
    .filter((article) => directCompanyMentionInTitleOrSnippet(article, company))
    .sort((a, b) => sourcePriority(b, language, company) - sourcePriority(a, language, company))
    .slice(0, 36);
  const dateEnrichment = await runSettledInBatches(
    dateCandidates,
    async (article) => {
      if (!article.publishedDate && isAllowedSource(article, language)) {
        const pageDate = await extractPublishedDateFromPage(article.url);
        if (pageDate) {
          return {
            ...article,
            publishedDate: pageDate.value,
            dateSource: pageDate.source,
          };
        }
      }

      if (!article.publishedDate) {
        const urlDate = normalizeDateEvidence(inferDateFromUrl(article.url));
        if (urlDate) {
          return {
            ...article,
            publishedDate: urlDate.value,
            dateSource: urlDate.source,
          };
        }
      }

      return article;
    },
    6,
  );
  const enrichedByUrl = new Map<string, Article>();
  for (let index = 0; index < dateEnrichment.length; index += 1) {
    const result = dateEnrichment[index];
    const original = dateCandidates[index];
    enrichedByUrl.set(original.url, result.status === "fulfilled" ? result.value : original);
  }
  const enriched = articles.map((article) => enrichedByUrl.get(article.url) ?? article);

  let rejectedLowQualitySources = 0;
  let dateUnverifiedSources = 0;
  let rejectedIrrelevantSources = 0;

  const filteredBeforeDiversification = enriched
    .filter((article) => {
      const keep = isTencentRelated(article, company) && isRelevantForCategory(article, company);
      if (!keep) rejectedIrrelevantSources += 1;
      return keep;
    })
    .filter((article) => isAllowedSource(article, language))
    .filter((article) => {
      const keep = !isLowQuality(article);
      if (!keep) rejectedLowQualitySources += 1;
      return keep;
    })
    .map((article) => {
      const date = dateEvaluation(article, range);
      if (!date.verified) dateUnverifiedSources += 1;
      return {
        ...article,
        dateStatus: date.verified ? "verified" : "unverified",
        usableForClaims: date.verified && date.insideRange,
      } satisfies Article;
    })
    .filter((article) => article.usableForClaims)
    .sort((a, b) => sourcePriority(b, language, company) - sourcePriority(a, language, company));

  const clustered = assignEventClusters(filteredBeforeDiversification, language, company);
  // The feed retains every distinct publisher/event pair. Editorial selection
  // happens later, so an LLM context limit never hides verified source links.
  const filtered = retainDistinctArticleCoverage(clustered)
    .map((article, index) => ({ ...article, id: index + 1 }));
  const eventClusters = buildEventClusters(filtered, language);

  const sourceMix = filtered.reduce<Record<string, number>>((counts, article) => {
    counts[article.category] = (counts[article.category] ?? 0) + 1;
    return counts;
  }, {});
  const tierCounts = filtered.reduce<Record<SourceTier, number>>(
    (counts, article) => {
      counts[article.sourceTier] += 1;
      return counts;
    },
    { 1: 0, 2: 0, 3: 0 },
  );

  return {
    articlesRetrieved: raw.length,
    duplicatesRemoved,
    articles: filtered,
    sourceMix,
    rejectedLowQualitySources,
    dateUnverifiedSources,
    rejectedIrrelevantSources,
    tierCounts,
    eventClusters,
    searchDiagnostics,
    company,
  };
}

function safeParseJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function deepSeekModel() {
  const requestedModel = process.env.DEEPSEEK_MODEL?.trim();
  return requestedModel === "deepseek-chat" || requestedModel === "deepseek-reasoner" ? requestedModel : "deepseek-chat";
}

async function repairJson(raw: string, apiKey: string) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: deepSeekModel(),
      temperature: 0,
      max_tokens: 3000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You repair malformed JSON. Return valid JSON only. Do not add facts, sources, article IDs, or fields that are not present in the input.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Repair this malformed JSON into valid JSON. Preserve the same structure and wording as much as possible.",
            malformedJson: raw.slice(0, 12000),
          }),
        },
      ],
    }),
    cache: "no-store",
      signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek JSON repair failed: ${response.status} ${text.slice(0, 240)}`);
  }

  const json = await response.json();
  const repaired = json.choices?.[0]?.message?.content;
  if (!repaired) {
    throw new Error("DeepSeek JSON repair returned an empty response.");
  }

  return safeParseJson(repaired) as Record<string, unknown>;
}

function knownCitationMap(articles: Article[]) {
  return new Map(
    articles.map((article) => [
      article.id,
      {
        articleId: article.id,
        url: article.url,
        title: article.title,
      },
    ]),
  );
}

function cleanCitations(citations: unknown, articles: Article[]): Citation[] {
  const map = knownCitationMap(articles);
  if (!Array.isArray(citations)) return [];
  const cleaned: Citation[] = [];

  for (const citation of citations) {
    const id =
      typeof citation === "number"
        ? citation
        : typeof citation === "object" && citation && "articleId" in citation
          ? Number((citation as { articleId: unknown }).articleId)
          : Number.NaN;
    const known = map.get(id);
    if (known && !cleaned.some((item) => item.articleId === id)) {
      cleaned.push(known);
    }
  }

  return cleaned;
}

function cleanBullets(value: unknown, articles: Article[], limit?: number): SummaryBullet[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const object = item as { text?: unknown; citations?: unknown };
      const citations = cleanCitations(object.citations, articles);
      return {
        text: typeof object.text === "string" ? object.text.trim() : "",
        citations,
        singleSource: citations.length === 1,
      };
    })
    .filter((item) => item.text && item.citations.length > 0)
    .slice(0, limit ?? 8);
}

function cleanImplications(value: unknown, articles: Article[]): InvestmentImplications {
  const object = (value ?? {}) as Record<string, unknown>;
  return {
    positiveFactors: cleanBullets(object.positiveFactors, articles, 2),
    negativeFactors: cleanBullets(object.negativeFactors, articles, 2),
    watchItems: cleanBullets(object.watchItems, articles, 2),
  };
}

function countClaims(brief: Pick<ResearchBrief, "executiveSummary" | "investmentImplications">) {
  return (
    brief.executiveSummary.length +
    brief.investmentImplications.positiveFactors.length +
    brief.investmentImplications.negativeFactors.length +
    brief.investmentImplications.watchItems.length
  );
}

function citationFor(article: Article): Citation {
  return {
    articleId: article.id,
    url: article.url,
    title: article.title,
  };
}

function articleSummary(article: Article) {
  return article.snippet || article.content || article.title;
}

function conservativeKeyNewsItem(article: Article, company: CompanyContext, language: BriefLanguage): KeyNewsItem {
  return {
    title: article.title,
    date: article.publishedDate,
    source: article.source,
    summary: articleSummary(article),
    whyItMatters:
      language === "zh"
        ? `该条目是所选时间范围内与${companyLabel(company, language)}直接相关的已验证新闻；其后续影响仍需结合新增披露和独立来源判断。`
        : `This is a date-verified item directly related to ${company.displayName} in the selected window; its implications should be assessed with subsequent disclosures and independent reporting.`,
    sentiment: sentimentForTitle(article.title),
    sourceLink: article.url,
  };
}

function companyLabel(company: CompanyContext, language: BriefLanguage) {
  if (company.isTencent && language === "zh") return "腾讯";
  return company.displayName;
}

function sentimentForTitle(title: string): KeyNewsItem["sentiment"] {
  const text = title.toLowerCase();
  if (
    text.includes("exit") ||
    text.includes("offload") ||
    text.includes("sell") ||
    text.includes("regulation") ||
    text.includes("监管") ||
    text.includes("退出") ||
    text.includes("出售")
  ) {
    return "Negative";
  }
  if (
    text.includes("launch") ||
    text.includes("test") ||
    text.includes("ai") ||
    text.includes("wechat") ||
    text.includes("微信") ||
    text.includes("内测") ||
    text.includes("上线")
  ) {
    return "Positive";
  }
  return "Neutral";
}

function evidenceConfidenceScore(articles: Article[], eventClusters: EventCluster[], citedClaims: number) {
  if (articles.length === 0) return 0;

  const tier1 = articles.filter((article) => article.sourceTier === 1).length;
  const tier2 = articles.filter((article) => article.sourceTier === 2).length;
  const independentSources = new Set(articles.map((article) => article.source)).size;
  let score = 18;
  score += Math.min(35, tier1 * 14 + tier2 * 7 + (articles.length - tier1 - tier2) * 2);
  score += Math.min(18, independentSources * 6);
  score += Math.min(15, eventClusters.length * 4);
  score += Math.min(12, citedClaims * 2);

  // No Tier 1 coverage or a single publisher can still be useful, but should
  // never look equivalent to independently confirmed primary reporting.
  if (tier1 === 0) score = Math.min(score, 78);
  if (independentSources === 1) score = Math.min(score, 58);
  if (eventClusters.length === 1) score = Math.min(score, 65);
  return Math.max(20, Math.min(95, Math.round(score)));
}

function fallbackBriefFromArticles({
  articlesRetrieved,
  duplicatesRemoved,
  articles,
  sourceMix,
  language,
  dateUnverifiedSources,
  rejectedLowQualitySources,
  rejectedIrrelevantSources,
  tierCounts,
  eventClusters,
  searchDiagnostics,
  company,
  reason,
}: {
  articlesRetrieved: number;
  duplicatesRemoved: number;
  articles: Article[];
  sourceMix: Record<string, number>;
  language: BriefLanguage;
  dateUnverifiedSources: number;
  rejectedLowQualitySources: number;
  rejectedIrrelevantSources: number;
  tierCounts: Record<SourceTier, number>;
  eventClusters: EventCluster[];
  searchDiagnostics: SearchDiagnostic[];
  company: CompanyContext;
  reason: string;
}): ResearchBrief {
  const selected = articles;
  const label = companyLabel(company, language);
  const aiArticles = selected.filter((article) => /ai|wechat|weixin|微信|小微|data center|gpu|chip/i.test(article.title));
  const gamingArticles = selected.filter((article) => /game|gaming|studio|marvelous|游戏|工作室/i.test(article.title));
  const bullets: SummaryBullet[] = [];

  if (aiArticles.length > 0) {
    bullets.push({
      text:
        language === "zh"
          ? `多家来源报道${label}近期的 AI、芯片、云或相关产品进展，相关事实以检索来源为准。`
          : `Recent verified reports focus on ${label}'s AI, chip, cloud, or product developments.`,
      citations: aiArticles.slice(0, 2).map(citationFor),
      singleSource: aiArticles.length === 1,
    });
  }

  if (gamingArticles.length > 0) {
    bullets.push({
      text:
        language === "zh"
          ? `检索结果还显示${label}相关投资或业务调整受到媒体关注。`
          : `Verified reports also highlight ${label}'s investment or business adjustment news.`,
      citations: gamingArticles.slice(0, 2).map(citationFor),
      singleSource: gamingArticles.length === 1,
    });
  }

  for (const article of selected) {
    if (bullets.length >= 4) break;
    if (bullets.some((bullet) => bullet.citations.some((citation) => citation.articleId === article.id))) continue;
    bullets.push({
      text:
        language === "zh"
          ? `已验证新闻来源报道：${article.title}`
          : `A verified news source reported: ${article.title}`,
      citations: [citationFor(article)],
      singleSource: true,
    });
  }

  const keyNews: KeyNewsItem[] = selected.map((article) => ({
    title: article.title,
    date: article.publishedDate,
    source: article.source,
    summary: articleSummary(article),
    whyItMatters:
      language === "zh"
        ? `该条目来自已检索且日期可验证的新闻来源，可作为本期${label}新闻监测的事实依据。`
        : "This item comes from a retrieved source with a verified recency signal and can be used as factual news context.",
    sentiment: sentimentForTitle(article.title),
    sourceLink: article.url,
  }));

  const watchArticle = selected[0];
  const implications: InvestmentImplications = {
    positiveFactors: aiArticles[0]
      ? [
          {
            text:
              language === "zh"
                ? `若${label}相关 AI/产品进展继续推进，后续应关注产品落地、客户需求与监管节奏。`
                : `If ${label}'s AI or product developments continue, follow rollout, customer demand, and regulatory timing.`,
            citations: [citationFor(aiArticles[0])],
            singleSource: true,
          },
        ]
      : [],
    negativeFactors: gamingArticles[0]
      ? [
          {
            text:
              language === "zh"
                ? `相关投资或业务调整仍需观察是否代表${label}更广泛的资本配置变化。`
                : `Investment or business changes should be watched for broader capital allocation implications at ${label}.`,
            citations: [citationFor(gamingArticles[0])],
            singleSource: true,
          },
        ]
      : [],
    watchItems: watchArticle
      ? [
          {
            text:
              language === "zh"
                ? "后续跟踪同一事件是否获得更多主流媒体或公司层面确认。"
                : "Watch whether the same events receive further confirmation from major media or company-level updates.",
            citations: [citationFor(watchArticle)],
            singleSource: true,
          },
        ]
      : [],
  };

  const claimsWithCitations = countClaims({ executiveSummary: bullets, investmentImplications: implications });

  return {
    status: "ok",
    executiveSummary: bullets,
    keyNews,
    investmentImplications: implications,
    sourceVerification: {
      articlesRetrieved,
      articlesUsed: articles.length,
      duplicatesRemoved,
      claimsWithCitations,
      unverifiedClaimsRemoved: 0,
      confidenceScore: evidenceConfidenceScore(articles, eventClusters, claimsWithCitations),
      notes: compactNotes([
        companyResolutionNote(company, language),
        reason,
        language === "zh"
          ? "生成内容采用保守兜底：仅复述已检索新闻，不补充外部事实。"
          : "Fallback mode used: the brief only restates retrieved news and adds no external facts.",
        sourceMixNote(sourceMix, language),
      ]),
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tier1Sources: tierCounts[1],
      tier2Sources: tierCounts[2],
      tier3Sources: tierCounts[3],
      eventsFound: eventClusters.length,
      searchQueriesRun: searchDiagnostics.length,
    },
    sources: articles,
    eventClusters,
    searchDiagnostics,
  };
}

function sourceMixNote(sourceMix: Record<string, number>, language: BriefLanguage) {
  const mix = Object.entries(sourceMix)
    .map(([category, count]) => `${category} ${count}`)
    .join(", ");
  return `${language === "zh" ? "来源分布" : "Source mix"}: ${mix || "none"}`;
}

function insufficientGeneratedBrief({
  articlesRetrieved,
  duplicatesRemoved,
  articles,
  usableArticleCount,
  sourceMix,
  language,
  reason,
  dateUnverifiedSources,
  rejectedLowQualitySources,
  rejectedIrrelevantSources,
  tierCounts,
  eventClusters,
  searchDiagnostics,
}: {
  articlesRetrieved: number;
  duplicatesRemoved: number;
  articles: Article[];
  usableArticleCount: number;
  sourceMix: Record<string, number>;
  language: BriefLanguage;
  reason: string;
  dateUnverifiedSources: number;
  rejectedLowQualitySources: number;
  rejectedIrrelevantSources: number;
  tierCounts: Record<SourceTier, number>;
  eventClusters: EventCluster[];
  searchDiagnostics: SearchDiagnostic[];
}): ResearchBrief {
  return {
    status: "insufficient",
    message: language === "zh" ? "未找到足够的可验证来源。" : "Insufficient verified sources found.",
    executiveSummary: [],
    keyNews: [],
    investmentImplications: {
      positiveFactors: [],
      negativeFactors: [],
      watchItems: [],
    },
    sourceVerification: {
      articlesRetrieved,
      articlesUsed: usableArticleCount,
      duplicatesRemoved,
      claimsWithCitations: 0,
      unverifiedClaimsRemoved: 0,
      confidenceScore: evidenceConfidenceScore(articles, eventClusters, 0),
      notes: [reason, sourceMixNote(sourceMix, language)],
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tier1Sources: tierCounts[1],
      tier2Sources: tierCounts[2],
      tier3Sources: tierCounts[3],
      eventsFound: eventClusters.length,
      searchQueriesRun: searchDiagnostics.length,
    },
    sources: articles,
    eventClusters,
    searchDiagnostics,
  };
}

export async function generateBrief(query: string, range: TimeRange, language: BriefLanguage): Promise<ResearchBrief> {
  const {
    articlesRetrieved,
    duplicatesRemoved,
    articles,
    sourceMix,
    rejectedLowQualitySources,
    dateUnverifiedSources,
    rejectedIrrelevantSources,
    tierCounts,
    eventClusters,
    searchDiagnostics,
    company,
  } = await searchTencentNews(query, range, language);
  // Tier 3 sources are useful leads for the audit trail, but an equity brief
  // cannot be built solely on aggregation or market-data pages.
  const usableArticles = articles.filter((article) => article.usableForClaims && article.sourceTier <= 2);
  const usableEventClusters = buildEventClusters(usableArticles, language);
  const usableTierCounts = usableArticles.reduce<Record<SourceTier, number>>(
    (counts, article) => {
      counts[article.sourceTier] += 1;
      return counts;
    },
    { 1: 0, 2: 0, 3: 0 },
  );
  const usableSourceMix = usableArticles.reduce<Record<string, number>>((counts, article) => {
    counts[article.category] = (counts[article.category] ?? 0) + 1;
    return counts;
  }, {});
  const editorialArticles = selectEditorialArticles(usableArticles, 20);
  const editorialEventClusters = buildEventClusters(editorialArticles, language);

  if (usableArticles.length === 0) {
    return {
      status: "insufficient",
      message: language === "zh" ? "未找到足够的可验证来源。" : "Insufficient verified sources found.",
      executiveSummary: [],
      keyNews: [],
      investmentImplications: {
        positiveFactors: [],
        negativeFactors: [],
        watchItems: [],
      },
      sourceVerification: {
        articlesRetrieved,
        articlesUsed: usableArticles.length,
        duplicatesRemoved,
        claimsWithCitations: 0,
        unverifiedClaimsRemoved: 0,
        confidenceScore: 0,
        notes: compactNotes([
          companyResolutionNote(company, language),
          language === "zh"
            ? "过滤后少于两篇日期可验证的相关来源；系统不会编造新闻。"
            : "Fewer than two relevant articles were available after filtering.",
          sourceMixNote(sourceMix, language),
        ]),
        dateUnverifiedSources,
        rejectedLowQualitySources,
        rejectedIrrelevantSources,
        tier1Sources: tierCounts[1],
        tier2Sources: tierCounts[2],
        tier3Sources: tierCounts[3],
        eventsFound: eventClusters.length,
        searchQueriesRun: searchDiagnostics.length,
      },
      sources: articles,
      eventClusters,
      searchDiagnostics,
    };
  }

  if (usableArticles.length === 1) {
    return fallbackBriefFromArticles({
      articlesRetrieved,
      duplicatesRemoved,
      articles: usableArticles,
      sourceMix: usableSourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts: usableTierCounts,
      eventClusters: usableEventClusters,
      searchDiagnostics,
      company,
      reason:
        language === "zh"
          ? "仅找到一条日期可验证的核心财经新闻；系统以单一来源模式展示，不补充外部事实。"
          : "Only one date-verified core finance news item was found; single-source mode is used with no added facts.",
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY.");
  }
  const model = deepSeekModel();
  const selectedPeriod = briefPeriodDescription(range, language);
  const aiKeyNewsLimit = aiKeyNewsAnnotationLimit(range);

  const articlePayload = editorialArticles.map((article) => ({
    id: article.id,
    title: article.title,
    source: article.source,
    sourceTier: article.sourceTier,
    sourceTierLabel: article.sourceTierLabel,
    category: article.category,
    eventClusterId: article.eventClusterId,
    publishedDate: article.publishedDate,
    url: article.url,
    snippet: article.snippet,
    content: article.content.slice(0, 1200),
  }));

  let raw: string | undefined;
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 2200,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a verified equity news intelligence assistant. Return valid JSON only. Use only the provided verified news articles. Do not invent news, facts, dates, sources, or URLs. Every factual claim must include articleId citations. Do not provide investment advice, ratings, or target prices.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task:
                language === "zh"
                  ? `Create a concise verified news brief for ${company.displayName} in Simplified Chinese covering ${selectedPeriod}. Return only JSON.`
                  : `Create a concise verified news brief for ${company.displayName} in English covering ${selectedPeriod}. Return only JSON.`,
              company: {
                displayName: company.displayName,
                aliases: company.aliases,
              },
              rules: [
                language === "zh"
                  ? "Write all natural-language brief fields in Simplified Chinese. Keep sentiment labels exactly as Positive, Neutral, or Negative."
                  : "Write all natural-language brief fields in English.",
                "Executive summary must have 3 to 5 bullets, each with citations.",
                "Keep the brief concise: executive bullets under 35 words, key news summaries under 55 words, why-it-matters under 45 words.",
                `Return no more than ${aiKeyNewsLimit} editorial keyNews annotations. The application will display every verified article separately.`,
                "Key news items must come directly from supplied articles, cover different event clusters when possible, and represent earlier as well as later material events when the selected window is longer than seven days.",
                "Prefer Tier 1 and Tier 2 sources when selecting key news. Use Tier 3 only when the item is clearly relevant and no stronger source covers the same event.",
                "Focus on newsworthy events reported by financial media. Do not treat filings, PDFs, stock quote pages, company profile pages, or broker target-price tables as news.",
                "Separate facts from interpretation.",
                "Mark single-source claims by relying on one citation only; the app will label them.",
                "Do not cite article IDs that are not supplied.",
                "Avoid recommendations such as buy/sell/hold, price targets, valuation calls, or portfolio actions.",
              ],
              schema: {
                executiveSummary: [{ text: "string", citations: [1] }],
                keyNews: [
                  {
                    articleId: 1,
                    title: "string",
                    date: "YYYY-MM-DD or null",
                    source: "string",
                    summary: "string",
                    whyItMatters: "string",
                    sentiment: "Positive | Neutral | Negative",
                  },
                ],
              },
              articles: articlePayload,
              eventClusters: editorialEventClusters,
            }),
          },
        ],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return fallbackBriefFromArticles({
        articlesRetrieved,
        duplicatesRemoved,
        articles: usableArticles,
        sourceMix: usableSourceMix,
        language,
        dateUnverifiedSources,
        rejectedLowQualitySources,
        rejectedIrrelevantSources,
        tierCounts: usableTierCounts,
        eventClusters: usableEventClusters,
        searchDiagnostics,
        company,
        reason:
          language === "zh"
            ? "DeepSeek API 返回错误；已切换为仅基于检索新闻的保守简报。"
            : "DeepSeek API returned an error; switched to a conservative retrieved-news brief.",
      });
    }

    const json = await response.json();
    raw = json.choices?.[0]?.message?.content;
  } catch {
    return fallbackBriefFromArticles({
      articlesRetrieved,
      duplicatesRemoved,
      articles: usableArticles,
      sourceMix: usableSourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts: usableTierCounts,
      eventClusters: usableEventClusters,
      searchDiagnostics,
      company,
      reason:
        language === "zh"
          ? "DeepSeek 生成请求超时或失败；已切换为仅基于检索新闻的保守简报。"
          : "DeepSeek generation timed out or failed; switched to a conservative retrieved-news brief.",
    });
  }

  if (!raw) {
    return fallbackBriefFromArticles({
      articlesRetrieved,
      duplicatesRemoved,
      articles: usableArticles,
      sourceMix: usableSourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts: usableTierCounts,
      eventClusters: usableEventClusters,
      searchDiagnostics,
      company,
      reason:
        language === "zh"
          ? "DeepSeek 返回空内容；已切换为仅基于检索新闻的保守简报。"
          : "DeepSeek returned an empty response; switched to a conservative retrieved-news brief.",
    });
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = safeParseJson(raw) as Record<string, unknown>;
  } catch {
    try {
      parsed = await repairJson(raw, apiKey);
    } catch {
      return fallbackBriefFromArticles({
        articlesRetrieved,
        duplicatesRemoved,
        articles: usableArticles,
        sourceMix: usableSourceMix,
        language,
        dateUnverifiedSources,
        rejectedLowQualitySources,
        rejectedIrrelevantSources,
        tierCounts: usableTierCounts,
        eventClusters: usableEventClusters,
        searchDiagnostics,
        company,
        reason:
          language === "zh"
            ? "DeepSeek 返回的 JSON 无法可靠修复；已切换为仅基于检索新闻的保守简报。"
            : "DeepSeek returned malformed JSON; switched to a conservative retrieved-news brief.",
      });
    }
  }
  const executiveSummary = cleanBullets(parsed.executiveSummary, editorialArticles, 5).slice(0, 5);
  const implications = cleanImplications(parsed.investmentImplications, editorialArticles);
  const articleById = new Map(editorialArticles.map((article) => [article.id, article]));

  const annotatedKeyNews = new Map<number, KeyNewsItem>();
  if (Array.isArray(parsed.keyNews)) {
    for (const item of parsed.keyNews) {
      const object = item as Record<string, unknown>;
      const article = articleById.get(Number(object.articleId));
      if (!article || annotatedKeyNews.has(article.id)) continue;
      const fallback = conservativeKeyNewsItem(article, company, language);
      annotatedKeyNews.set(article.id, {
        ...fallback,
        summary: typeof object.summary === "string" && object.summary.trim() ? object.summary.trim() : fallback.summary,
        whyItMatters:
          typeof object.whyItMatters === "string" && object.whyItMatters.trim()
            ? object.whyItMatters.trim()
            : fallback.whyItMatters,
        sentiment: object.sentiment === "Positive" || object.sentiment === "Negative" ? object.sentiment : fallback.sentiment,
      });
    }
  }
  const keyNews = [...usableArticles]
    .sort((left, right) => compareDateDesc(left.publishedDate, right.publishedDate))
    .map((article) => annotatedKeyNews.get(article.id) ?? conservativeKeyNewsItem(article, company, language));

  const claimsWithCitations = countClaims({
    executiveSummary,
    investmentImplications: implications,
  });
  const implicationValues = Object.values(
    (parsed.investmentImplications ?? {}) as Record<string, unknown>,
  );
  const originalClaimEstimate =
    (Array.isArray(parsed.executiveSummary) ? parsed.executiveSummary.length : 0) +
    implicationValues.reduce<number>(
      (sum, value) => sum + (Array.isArray(value) ? value.length : 0),
      0,
    );
  const unverifiedClaimsRemoved = Math.max(0, originalClaimEstimate - claimsWithCitations);
  const confidenceScore = Math.max(
    0,
    evidenceConfidenceScore(usableArticles, usableEventClusters, claimsWithCitations) - unverifiedClaimsRemoved * 8,
  );

  if (executiveSummary.length === 0 || keyNews.length === 0) {
    return fallbackBriefFromArticles({
      articlesRetrieved,
      duplicatesRemoved,
      articles: usableArticles,
      sourceMix: usableSourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts: usableTierCounts,
      eventClusters: usableEventClusters,
      searchDiagnostics,
      company,
      reason:
        language === "zh"
          ? "模型无法从检索文章中生成足够的带引用结论；已切换为保守简报。"
          : "The model could not produce enough cited claims; switched to a conservative brief.",
    });
  }

  return {
    status: "ok",
    executiveSummary,
    keyNews,
    investmentImplications: implications,
    sourceVerification: {
      articlesRetrieved,
      articlesUsed: usableArticles.length,
      duplicatesRemoved,
      claimsWithCitations,
      unverifiedClaimsRemoved,
      confidenceScore,
      notes: compactNotes([
        companyResolutionNote(company, language),
        language === "zh"
          ? "所有展示结论均已校验为引用了检索到的文章 ID。"
          : "All rendered claims were checked for citations against retrieved article IDs.",
        language === "zh" ? "单一来源结论会在界面标注。" : "Single-source claims are labeled in the UI.",
        sourceMixNote(usableSourceMix, language),
      ]),
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tier1Sources: usableTierCounts[1],
      tier2Sources: usableTierCounts[2],
      tier3Sources: usableTierCounts[3],
      eventsFound: usableEventClusters.length,
      searchQueriesRun: searchDiagnostics.length,
    },
    sources: usableArticles,
    eventClusters: usableEventClusters,
    searchDiagnostics,
  };
}
