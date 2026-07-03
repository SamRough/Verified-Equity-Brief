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

type SearchPlan = {
  query: string;
  category: SourceCategory;
  includeDomains?: string[];
  maxResults?: number;
  topic?: "general" | "news";
  mode: Article["searchMode"];
  provider: "serpapi" | "tavily" | "sina" | "yahoo";
};

type CompanyContext = {
  input: string;
  displayName: string;
  aliases: string[];
  isTencent: boolean;
  usTicker?: string;
  hkTicker?: string;
  cnTicker?: string;
};

type RawResult = {
  title: string;
  url: string;
  snippet: string;
  content: string;
  publishedDate: string | null;
  category: SourceCategory;
  searchProvider: string;
  searchMode: Article["searchMode"];
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
};

const OFFICIAL_EXCHANGE_DOMAINS = [
  "hkexnews.hk",
  "hkex.com.hk",
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
  "finance.sina.com.cn",
  "cj.sina.cn",
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
  "finance.sina.com.cn",
  "cj.sina.cn",
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
  "爱上拼多多包邮",
  "包邮",
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
  };
}

export function rangeDays(range: TimeRange) {
  if (range === "today") return 1;
  if (range === "week" || range === "last7") return 7;
  return 30;
}

function rangeWhen(range: TimeRange) {
  if (range === "today") return "1d";
  if (range === "week" || range === "last7") return "7d";
  return "30d";
}

function googleRecentFilter(range: TimeRange) {
  if (range === "today") return "qdr:d";
  if (range === "week" || range === "last7") return "qdr:w";
  return "qdr:m";
}

function cutoffForRange(range: TimeRange) {
  const cutoff = new Date();
  cutoff.setUTCHours(0, 0, 0, 0);
  cutoff.setUTCDate(cutoff.getUTCDate() - (rangeDays(range) - 1));
  return cutoff;
}

function sourceFromUrl(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
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
    /best .*stocks?|better buy|which .*stock|worth buying|according to analysts|hidden way to trade|trade it/,
    /签名皮夹克|皮夹克.*拍卖|拍卖/,
    /community\/feed|guba|股吧|雪球/,
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
    /发布|發布|推出|上线|上線|测试|測試|launch|release|rollout|unveil|ship|deliver/,
    /ai|人工智能|大模型|模型|芯片|晶片|算力|gpu|cloud|云|雲|data center|robot|机器人|機器人|semiconductor/,
    /门店|門店|产能|產能|交付|销量|銷量|价格战|價格戰|补贴|補貼|供应链|供應鏈|logistics|delivery|supply chain/,
    /战略|戰略|重组|重組|组织调整|組織調整|高管|ceo|cfo|management|layoff|裁员|招聘|office|办公楼|總部|总部/,
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
    /technical|indicator|技术指标|技術指標|反弹信号|反彈信號|what'?s going on|why .*stock|stock moved/,
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

function sourcePriority(article: Article, language: BriefLanguage, company: CompanyContext) {
  const haystack = `${article.source} ${article.url} ${article.title}`.toLowerCase();
  const categoryPriority: Record<BriefLanguage, Record<SourceCategory, number>> = {
    zh: {
      "Official / Exchange": 6,
      Regulator: 6,
      "Chinese financial media": 7,
      "HK financial media": 6,
      "International financial media": 4,
      "General news": 1,
    },
    en: {
      "Official / Exchange": 6,
      Regulator: 6,
      "Chinese financial media": 4,
      "HK financial media": 5,
      "International financial media": 6,
      "General news": 1,
    },
  };

  const trustedBoost = REPUTABLE_SOURCE_HINTS.some((hint) => haystack.includes(hint)) ? 2 : 0;
  const relevanceBoost = Math.min(8, Math.max(0, companyRelevanceScore(article, company)));
  const tierBoost = article.sourceTier === 1 ? 4 : article.sourceTier === 2 ? 2 : 0;
  const financialBoost = Math.min(10, Math.max(0, financialNewsScore(article, company)));

  return categoryPriority[language][article.category] + trustedBoost + relevanceBoost + tierBoost + financialBoost;
}

function eventKey(article: Pick<Article, "title" | "snippet" | "content">) {
  const text = `${article.title} ${article.snippet} ${article.content}`.toLowerCase();

  if (/cxmt|长鑫|長鑫|memory supply|内存|dram|存储芯片/.test(text)) return "cxmt-memory-supply";
  if (/雄安|xiong.?an|办公楼|office building/.test(text)) return "xiongan-office-expansion";
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

function eventLabelForKey(key: string, language: BriefLanguage) {
  const labels: Record<string, Record<BriefLanguage, string>> = {
    "wechat-ai-xiaowei": { en: "WeChat / AI assistant", zh: "微信 / AI 助手" },
    "cxmt-memory-supply": { en: "CXMT memory supply", zh: "长鑫存储 / 内存供应" },
    "xiongan-office-expansion": { en: "Xiong'an office expansion", zh: "雄安办公布局" },
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

function diversifyArticlesByEvent(articles: Article[], limit: number) {
  const selected: Article[] = [];
  const eventCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();

  function maybeAdd(article: Article, maxPerEvent: number, maxPerSource: number) {
    const key = eventKey(article);
    const eventCount = eventCounts.get(key) ?? 0;
    const sourceCount = sourceCounts.get(article.source) ?? 0;
    if (selected.some((selectedArticle) => selectedArticle.url === article.url)) return false;
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
    maybeAdd(article, 4, 4);
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
  if (!company.isTencent && !directCompanyMentionInTitle(article, company)) return false;
  if (!directCompanyMentionInTitleOrSnippet(article, company)) return false;
  if (!isDirectTencentMention(article, company)) return false;
  if (!isFinancialNewsEvent(article, company)) return false;
  return true;
}

function isAllowedSource(article: Article, language: BriefLanguage) {
  const allowedDomains = STRICT_CHINESE_SOURCE_DOMAINS[article.category];
  if (allowedDomains.length === 0) return language !== "zh";
  return matchesDomain(article.url, allowedDomains);
}

function makePlan(
  query: string,
  category: SourceCategory,
  mode: Article["searchMode"],
  maxResults: number,
  includeDomains?: string[],
): SearchPlan {
  return {
    query,
    category,
    includeDomains,
    maxResults,
    topic: mode === "Google Web" ? "general" : "news",
    mode,
    provider:
      mode === "Tavily"
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
    const key = `${plan.provider}|${plan.mode}|${plan.category}|${plan.query}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildSearchPlans(query: string, language: BriefLanguage): SearchPlan[] {
  const company = buildCompanyContext(query);
  const primary = company.displayName;
  const expanded = company.aliases.join(" OR ");
  const tickerAliases = [company.usTicker, company.hkTicker, company.cnTicker].filter((item): item is string => Boolean(item));
  const zhAliases = company.isTencent ? ["腾讯", "腾讯控股", "00700", "0700.HK"] : [primary, ...company.aliases, ...tickerAliases];
  const enAliases = company.isTencent ? ["Tencent", "Tencent Holdings", "0700.HK", "TCEHY"] : [primary, expanded];
  const zhNoiseExclusions = "-百家号 -搜狐号 -网易号 -腾讯新闻 -高考 -志愿 -剑南春";

  if (language === "zh") {
    const zhPrimary = company.isTencent ? "腾讯" : primary;
    const plans: SearchPlan[] = [
      ...(company.usTicker
        ? [
            makePlan(company.usTicker, "Chinese financial media", "Sina Finance", 20, CHINESE_FINANCIAL_DOMAINS),
            makePlan(company.usTicker, "International financial media", "Yahoo Finance", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
          ]
        : []),
      makePlan(`${zhPrimary} 新闻`, "Chinese financial media", "Google News", 20, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhAliases.join(" ")} 最新 新闻 ${zhNoiseExclusions}`, "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
      makePlan(
        siteQuery(`${zhPrimary} 最新 新闻`, ["stcn.com", "cls.cn", "yicai.com", "caixin.com", "cnstock.com"]),
        "Chinese financial media",
        "Google Web",
        20,
        CHINESE_FINANCIAL_DOMAINS,
      ),
      makePlan(
        siteQuery(`${zhPrimary} 财经 新闻`, ["finance.eastmoney.com", "finance.sina.com.cn", "cj.sina.cn", "finance.qq.com", "finance.sohu.com"]),
        "Chinese financial media",
        "Google Web",
        20,
        CHINESE_FINANCIAL_DOMAINS,
      ),
      makePlan(
        siteQuery(`${zhPrimary} 控股 新闻`, ["21jingji.com", "nbd.com.cn", "jiemian.com", "thepaper.cn", "wallstreetcn.com"]),
        "Chinese financial media",
        "Google Web",
        20,
        CHINESE_FINANCIAL_DOMAINS,
      ),
      makePlan(`${zhPrimary} 财经 证券时报 财新 第一财经 财联社`, "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 业绩 营收 利润 指引`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 监管 调查 处罚 合规`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 合作 订单 供应链 产品 发布`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 回购 分红 收购 投资 融资`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
      ...(company.isTencent
        ? [
            makePlan(`${zhPrimary} 长鑫存储 CXMT 内存 采购`, "Chinese financial media", "Google News", 16, CHINESE_FINANCIAL_DOMAINS),
            makePlan(`${zhPrimary} 长鑫存储 CXMT 内存 采购`, "Chinese financial media", "Google Web", 20, CHINESE_FINANCIAL_DOMAINS),
          ]
        : []),
      makePlan(`${zhPrimary} 公司公告 交易所 回购`, "Official / Exchange", "Google Web", 12, OFFICIAL_EXCHANGE_DOMAINS),
      makePlan(`${zhPrimary} 监管 审批 游戏 AI`, "Regulator", "Google Web", 10, REGULATOR_DOMAINS),
      makePlan(`${zhPrimary} 股票 新闻`, "Chinese financial media", "Bing News", 20, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} ${company.hkTicker ?? ""} ${company.cnTicker ?? ""} ${company.usTicker ?? ""} 股票 新闻`, "HK financial media", "Google News", 16, HK_FINANCIAL_DOMAINS),
      makePlan(`${enAliases.join(" OR ")}`, "International financial media", "Google News", 16, INTERNATIONAL_FINANCIAL_DOMAINS),
      makePlan(
        siteQuery(`${primary} latest company news earnings regulation deal product`, ["bloomberg.com", "reuters.com", "cnbc.com", "finance.yahoo.com", "businesstimes.com.sg"]),
        "International financial media",
        "Google Web",
        20,
        INTERNATIONAL_FINANCIAL_DOMAINS,
      ),
      makePlan(`${primary} stock news earnings AI gaming regulation`, "International financial media", "Google Web", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 最新 财经 新闻`, "Chinese financial media", "Tavily", 12, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} 公司新闻 业绩 监管 产品 合作`, "Chinese financial media", "Tavily", 12, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${zhPrimary} ${company.hkTicker ?? ""} ${company.cnTicker ?? ""} ${company.usTicker ?? ""} 核心财经新闻`, "Chinese financial media", "Tavily", 12, CHINESE_FINANCIAL_DOMAINS),
      makePlan(`${primary} latest company news earnings regulation product deal`, "International financial media", "Tavily", 10, INTERNATIONAL_FINANCIAL_DOMAINS),
    ];
    return dedupePlans(plans);
  }

  return dedupePlans([
    ...(company.usTicker
      ? [
          makePlan(company.usTicker, "Chinese financial media", "Sina Finance", 20, CHINESE_FINANCIAL_DOMAINS),
          makePlan(company.usTicker, "International financial media", "Yahoo Finance", 20, INTERNATIONAL_FINANCIAL_DOMAINS),
        ]
      : []),
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
  ]);
}

export async function searchTencentNews(query: string, range: TimeRange, language: BriefLanguage) {
  const company = buildCompanyContext(query);
  const searches = buildSearchPlans(query, language);
  const serpApiKey = process.env.SERPAPI_API_KEY;
  const tavilyApiKey = process.env.TAVILY_API_KEY ?? process.env.SEARCH_API_KEY;

  if (!serpApiKey && !tavilyApiKey) {
    throw new Error("Missing SERPAPI_API_KEY or TAVILY_API_KEY. This demo needs a live search provider.");
  }

  const serpSearches = searches.filter((plan) => plan.provider === "serpapi");
  const tavilySearches = searches.filter((plan) => plan.provider === "tavily");
  const sinaSearches = searches.filter((plan) => plan.provider === "sina");
  const yahooSearches = searches.filter((plan) => plan.provider === "yahoo");
  const serpRaw = serpApiKey ? await searchWithSerpApi(serpSearches, range, language, serpApiKey) : [];
  const tavilyRaw = tavilyApiKey ? await searchWithTavily(tavilySearches, range, tavilyApiKey) : [];
  const sinaRaw = await searchWithSinaFinance(sinaSearches);
  const yahooRaw = await searchWithYahooFinance(yahooSearches);

  return normalizeAndFilterResults([...sinaRaw, ...yahooRaw, ...serpRaw, ...tavilyRaw], range, language, company, searches);
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
          category: result.value.plan.category,
          searchProvider: "Yahoo Finance",
          searchMode: "Yahoo Finance" as const,
        })),
    );
}

async function searchWithSinaFinance(searches: SearchPlan[]): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const symbol = plan.query.toUpperCase();
      const response = await fetch(`https://stock.finance.sina.com.cn/usstock/quotes/${symbol}.html`, {
        headers: { "User-Agent": "Mozilla/5.0 EquityResearchCopilot/0.1" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Sina Finance failed: ${response.status} ${text.slice(0, 240)}`);
      }
      const buffer = await response.arrayBuffer();
      const html = new TextDecoder("gb18030").decode(buffer);
      return { plan, html };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; html: string }> => result.status === "fulfilled")
    .flatMap((result) => extractSinaStockPageNews(result.value.html, result.value.plan));
}

function extractSinaStockPageNews(html: string, plan: SearchPlan): RawResult[] {
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      url: absolutizeUrl(match[1]),
      title: match[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
    }))
    .filter((item) => item.title && item.url);

  const seen = new Set<string>();
  return links
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return /finance\.sina\.com\.cn|cj\.sina\.cn|t\.cj\.sina\.cn/.test(item.url);
    })
    .filter((item) => !/更多|公司新闻|公司资讯|研究报告|财经首页|美股首页|行情中心/.test(item.title))
    .slice(0, plan.maxResults ?? 20)
    .map((item) => ({
      title: item.title,
      url: item.url,
      snippet: item.title,
      content: item.title,
      publishedDate: inferDateFromUrl(item.url)?.value ?? null,
      category: plan.category,
      searchProvider: "Sina Finance Stock Page",
      searchMode: "Sina Finance" as const,
    }));
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
        category: plan.category,
        data: (await response.json()) as { results?: TavilyResult[] },
      };
    },
    2,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ category: SourceCategory; data: { results?: TavilyResult[] } }> =>
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
          category: result.value.category,
          searchProvider: "Tavily",
          searchMode: "Tavily",
        })),
    );
}

async function searchWithSerpApi(
  searches: SearchPlan[],
  range: TimeRange,
  language: BriefLanguage,
  apiKey: string,
): Promise<RawResult[]> {
  const responseSettled = await runSettledInBatches(
    searches,
    async (plan) => {
      const response = await fetch(buildSerpApiUrl(plan, range, language, apiKey), {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`SerpAPI failed: ${response.status} ${text.slice(0, 240)}`);
      }

      return {
        plan,
        data: (await response.json()) as Record<string, unknown>,
      };
    },
    3,
  );

  return responseSettled
    .filter((result): result is PromiseFulfilledResult<{ plan: SearchPlan; data: Record<string, unknown> }> =>
      result.status === "fulfilled",
    )
    .flatMap((result) => extractSerpApiResults(result.value.data, result.value.plan));
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
    params.set("engine", "google");
    params.set("tbm", "nws");
    params.set("hl", "zh-CN");
    params.set("gl", "hk");
    params.set("num", String(plan.maxResults ?? 10));
    params.set("hl", language === "zh" ? "zh-CN" : "en");
    params.set("gl", language === "zh" ? "hk" : "us");
    params.set("q", plan.query);
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
          category: plan.category,
          searchProvider: plan.mode === "Bing News" ? "SerpAPI Bing News" : `SerpAPI ${plan.mode}`,
          searchMode: plan.mode,
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
  searchPlans: SearchPlan[],
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
      category: result.category,
    });
  }

  const enriched = await Promise.all(
    articles.map(async (article) => {
      if (isAllowedSource(article, language)) {
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
    }),
  );

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
      if (!date.verified && language === "zh") dateUnverifiedSources += 1;
      return {
        ...article,
        dateStatus: date.verified ? "verified" : "unverified",
        usableForClaims: date.verified && date.insideRange,
      } satisfies Article;
    })
    .filter((article) => article.usableForClaims || (language === "zh" && article.dateStatus === "unverified"))
    .sort((a, b) => sourcePriority(b, language, company) - sourcePriority(a, language, company));

  const filtered = diversifyArticlesByEvent(filteredBeforeDiversification, 24)
    .map((article, index) => ({ ...article, id: index + 1, eventClusterId: eventKey(article) }));
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
    searchDiagnostics: searchPlans.map((plan) => ({
      provider:
        plan.provider === "serpapi"
          ? "SerpAPI"
          : plan.provider === "sina"
            ? "Sina Finance"
            : plan.provider === "yahoo"
              ? "Yahoo Finance"
              : "Tavily",
      mode: plan.mode,
      query: plan.query,
      category: plan.category,
    })),
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

async function repairJson(raw: string, apiKey: string) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-pro",
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
  const selected = articles.slice(0, 4);
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
      confidenceScore: Math.min(80, 45 + articles.length * 5),
      notes: [
        reason,
        language === "zh"
          ? "生成内容采用保守兜底：仅复述已检索新闻，不补充外部事实。"
          : "Fallback mode used: the brief only restates retrieved news and adds no external facts.",
        sourceMixNote(sourceMix, language),
      ],
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
      confidenceScore: Math.min(35, articles.length * 6),
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
  const company = buildCompanyContext(query);
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
  } = await searchTencentNews(query, range, language);
  const usableArticles = articles.filter((article) => article.usableForClaims);

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
        notes: [
          language === "zh"
            ? "过滤后少于两篇日期可验证的相关来源；系统不会编造新闻。"
            : "Fewer than two relevant articles were available after filtering.",
          sourceMixNote(sourceMix, language),
        ],
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
      sourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts,
      eventClusters,
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
  const requestedModel = process.env.DEEPSEEK_MODEL?.trim();
  const model =
    requestedModel === "deepseek-chat" || requestedModel === "deepseek-reasoner" ? requestedModel : "deepseek-chat";

  const articlePayload = usableArticles.map((article) => ({
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
        max_tokens: 2800,
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
                  ? `Create a concise verified news brief for ${company.displayName} in Simplified Chinese. Return only JSON.`
                  : `Create a concise verified news brief for ${company.displayName} in English. Return only JSON.`,
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
                "Return no more than 4 keyNews items.",
                "Return no more than 2 bullets for each follow-up bucket.",
                "Key news items must come directly from supplied articles and should cover different event clusters when possible.",
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
                investmentImplications: {
                  positiveFactors: [{ text: "string", citations: [1] }],
                  negativeFactors: [{ text: "string", citations: [1] }],
                  watchItems: [{ text: "string", citations: [1] }],
                },
              },
              articles: articlePayload,
              eventClusters,
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
        sourceMix,
        language,
        dateUnverifiedSources,
        rejectedLowQualitySources,
        rejectedIrrelevantSources,
        tierCounts,
        eventClusters,
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
      sourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts,
      eventClusters,
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
      sourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts,
      eventClusters,
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
        sourceMix,
        language,
        dateUnverifiedSources,
        rejectedLowQualitySources,
        rejectedIrrelevantSources,
        tierCounts,
        eventClusters,
        searchDiagnostics,
        company,
        reason:
          language === "zh"
            ? "DeepSeek 返回的 JSON 无法可靠修复；已切换为仅基于检索新闻的保守简报。"
            : "DeepSeek returned malformed JSON; switched to a conservative retrieved-news brief.",
      });
    }
  }
  const executiveSummary = cleanBullets(parsed.executiveSummary, usableArticles, 5).slice(0, 5);
  const implications = cleanImplications(parsed.investmentImplications, usableArticles);
  const articleById = new Map(usableArticles.map((article) => [article.id, article]));

  const keyNews: KeyNewsItem[] = Array.isArray(parsed.keyNews)
    ? parsed.keyNews
        .map((item) => {
          const object = item as Record<string, unknown>;
          const article = articleById.get(Number(object.articleId));
          if (!article) return null;
          const sentiment: KeyNewsItem["sentiment"] =
            object.sentiment === "Positive" || object.sentiment === "Negative" ? object.sentiment : "Neutral";
          return {
            title: typeof object.title === "string" && object.title.trim() ? object.title.trim() : article.title,
            date: typeof object.date === "string" ? object.date : article.publishedDate,
            source: article.source,
            summary: typeof object.summary === "string" ? object.summary.trim() : article.snippet,
            whyItMatters:
              typeof object.whyItMatters === "string"
                ? object.whyItMatters.trim()
                : `Relevant to ${company.displayName}'s operating outlook.`,
            sentiment,
            sourceLink: article.url,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .slice(0, 4)
    : [];

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
  const confidenceScore = Math.min(
    95,
    Math.max(25, Math.round(articles.length * 7 + claimsWithCitations * 6 - unverifiedClaimsRemoved * 10)),
  );

  if (executiveSummary.length === 0 || keyNews.length === 0) {
    return fallbackBriefFromArticles({
      articlesRetrieved,
      duplicatesRemoved,
      articles: usableArticles,
      sourceMix,
      language,
      dateUnverifiedSources,
      rejectedLowQualitySources,
      rejectedIrrelevantSources,
      tierCounts,
      eventClusters,
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
      notes: [
        language === "zh"
          ? "所有展示结论均已校验为引用了检索到的文章 ID。"
          : "All rendered claims were checked for citations against retrieved article IDs.",
        language === "zh" ? "单一来源结论会在界面标注。" : "Single-source claims are labeled in the UI.",
        sourceMixNote(sourceMix, language),
      ],
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
