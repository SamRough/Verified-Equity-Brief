const baseUrl = process.env.BRIEF_BASE_URL ?? "http://127.0.0.1:3000";
const cases = [
  { query: "Tencent", language: "zh" },
  { query: "AMD", language: "en" },
  { query: "泡泡玛特", language: "zh" },
  { query: "拼多多", language: "zh" },
  { query: "贵州茅台", language: "zh" },
];

function inLastSevenDays(date) {
  if (!date || !/^20\d{2}-\d{2}-\d{2}$/.test(date)) return false;
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const value = new Date(`${date}T00:00:00Z`);
  return value >= start && value < end;
}

function allClaims(brief) {
  return [
    ...brief.executiveSummary,
    ...brief.investmentImplications.positiveFactors,
    ...brief.investmentImplications.negativeFactors,
    ...brief.investmentImplications.watchItems,
  ];
}

function validateBrief(brief) {
  const failures = [];
  const invalidSuccessDiagnostic = brief.searchDiagnostics.some(
    (item) => item.status === "used" && item.resultCount === 0,
  );
  if (invalidSuccessDiagnostic) failures.push("provider marked used with zero results");
  const failedWithoutReason = brief.searchDiagnostics.some(
    (item) => item.status === "failed" && !item.error,
  );
  if (failedWithoutReason) failures.push("failed provider has no error reason");

  if (brief.status === "insufficient") {
    if (brief.executiveSummary.length || brief.keyNews.length) failures.push("insufficient brief rendered news claims");
    return failures;
  }

  const sourceIds = new Set(brief.sources.map((source) => source.id));
  if (brief.sources.length === 0) failures.push("successful brief has no sources");
  if (brief.sources.some((source) => !source.usableForClaims)) failures.push("successful brief contains unusable source");
  if (brief.sources.some((source) => source.sourceTier > 2)) failures.push("successful brief relies on Tier 3 source");
  if (brief.sources.some((source) => !inLastSevenDays(source.publishedDate))) failures.push("successful brief contains out-of-window date");
  if (brief.sources.some((source) => source.searchMode === "Google News RSS" && /(^|\.)google\.com\b/i.test(new URL(source.url).hostname))) {
    failures.push("Google RSS source was not decoded to the original publisher");
  }
  const eventPublisherPairs = brief.sources.map((source) => `${source.eventClusterId}|${source.source}`);
  if (new Set(eventPublisherPairs).size !== eventPublisherPairs.length) {
    failures.push("same publisher was retained twice for one event");
  }

  for (const claim of allClaims(brief)) {
    if (!Array.isArray(claim.citations) || claim.citations.length === 0) failures.push("claim has no citation");
    if (claim.citations?.some((citation) => !sourceIds.has(citation.articleId))) {
      failures.push("claim cites an unknown source ID");
    }
  }
  if (brief.keyNews.some((item) => !brief.sources.some((source) => source.url === item.sourceLink))) {
    failures.push("key news link is not a retrieved source");
  }
  if (brief.sources.some((source) => !brief.keyNews.some((item) => item.sourceLink === source.url))) {
    failures.push("verified source was omitted from the news list");
  }
  return failures;
}

let failed = false;
const completedBriefs = new Map();
for (const testCase of cases) {
  const response = await fetch(`${baseUrl}/api/brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...testCase, range: "last7" }),
    signal: AbortSignal.timeout(120000),
  });
  const brief = await response.json();
  const failures = response.ok ? validateBrief(brief) : [brief.error ?? `HTTP ${response.status}`];
  const outcome = failures.length === 0 ? "PASS" : "FAIL";
  console.log(`${outcome} | ${testCase.query} | ${brief.status} | ${brief.sourceVerification?.articlesUsed ?? 0} verified sources`);
  completedBriefs.set(`${testCase.query}:${testCase.language}`, brief);
  if (failures.length) {
    failed = true;
    for (const failure of [...new Set(failures)]) console.log(`  - ${failure}`);
  }
}

// Brief language changes wording, not the underlying evidence policy. Live search
// can reorder a small number of results between calls, so require a meaningful
// overlap rather than byte-for-byte equality.
const chineseTencent = completedBriefs.get("Tencent:zh");
let englishTencent = completedBriefs.get("Tencent:en");
if (!englishTencent) {
  const response = await fetch(`${baseUrl}/api/brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "Tencent", language: "en", range: "last7" }),
    signal: AbortSignal.timeout(120000),
  });
  englishTencent = await response.json();
  if (!response.ok) {
    failed = true;
    console.log("FAIL | Tencent language parity | English request failed");
  }
}

if (chineseTencent?.status === "ok" && englishTencent?.status === "ok") {
  const zhUrls = new Set(chineseTencent.sources.map((source) => source.url));
  const enUrls = new Set(englishTencent.sources.map((source) => source.url));
  const sharedUrls = [...zhUrls].filter((url) => enUrls.has(url));
  const overlap = sharedUrls.length / Math.max(zhUrls.size, enUrls.size, 1);
  if (overlap < 0.5) {
    failed = true;
    console.log(`FAIL | Tencent language parity | ${(overlap * 100).toFixed(0)}% shared original URLs`);
  } else {
    console.log(`PASS | Tencent language parity | ${(overlap * 100).toFixed(0)}% shared original URLs`);
  }
}

if (failed) process.exitCode = 1;
