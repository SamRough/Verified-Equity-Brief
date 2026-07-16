# Verified Equity Brief

A verified news intelligence tool for equity research workflows. Enter a company name or ticker such as `Tencent`, `0700.HK`, `AMD`, or `PDD`, select a time range and language, and the app retrieves source-qualified finance news before generating a cited brief.

## Why this exists

AI research tools can hallucinate: they may invent news, mix old stories into a recent window, cite weak sources, or treat content farms as evidence. That is especially risky in equity research workflows, where users need to inspect the evidence before reading any AI summary.

## How the demo reduces hallucination

- Uses finance-first retrieval: Marketaux and Alpha Vantage are the preferred news APIs; Yahoo Finance, Sina Finance, Google News RSS discovery (local personal demo only), Chinese/HK financial media searches, Tavily, and SerpAPI are fallback or supplemental sources.
- Uses source-bucketed retrieval for official/exchange announcements, regulators, Chinese financial media, HK financial media, international financial media, and finance API feeds.
- Chinese-source discovery uses a strict serious-source allowlist and rejects Baijiahao, portals, forums, social posts, search pages, and content-farm reposts.
- Normalizes and filters results for company relevance, duplicate URLs, low-quality sources, event duplication, and selected time range.
- The language selector controls brief presentation only. Every request builds one evidence pool from official, Chinese/HK, and international finance sources before rendering the brief in English or Simplified Chinese.
- Shows a cited brief, every retained verified news source, event coverage, provider diagnostics, and evidence quality in one auditable result.
- Keeps the working view focused on a cited brief, a complete date-grouped verified news feed, and a collapsible retrieval audit. Every distinct verified publisher/event pair remains in the feed; only the smaller LLM editorial sample is capped. It intentionally omits ratings, target prices, and investment implications.
- Sends only verified, claim-usable article data to the language model.
- Requires structured JSON with article ID citations.
- Removes any rendered claim that has no valid citation.
- Labels single-source claims and reports source verification metrics.
- Returns `Insufficient verified sources found.` when there is not enough verified news evidence.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

With the local server running, verify the source and citation invariants across A-share, Hong Kong, and US examples:

```bash
npm run verify:retrieval
```

## Required environment variables

```bash
DEEPSEEK_API_KEY=sk-your-deepseek-key
MARKETAUX_API_KEY=your-marketaux-key
ALPHAVANTAGE_API_KEY=your-alpha-vantage-key
SERPAPI_API_KEY=your-serpapi-key
TAVILY_API_KEY=tvly-your-tavily-key
SEARCH_API_KEY=tvly-your-tavily-key
DEEPSEEK_MODEL=deepseek-chat
# Optional: local personal-demo only; do not use in shared or commercial deployment.
GOOGLE_NEWS_RSS_PERSONAL_DEMO=true
```

`MARKETAUX_API_KEY` and `ALPHAVANTAGE_API_KEY` are the preferred finance-news sources. `SERPAPI_API_KEY`, `TAVILY_API_KEY`, and `SEARCH_API_KEY` are optional fallback search providers. `GOOGLE_NEWS_RSS_PERSONAL_DEMO=true` enables an experimental local discovery route: it decodes Google News RSS links to original publishers and admits only original URLs that pass the normal source, relevance, date, and tier checks. It should remain off for shared or commercial use. `DEEPSEEK_MODEL` is optional and defaults to `deepseek-chat` unless set to `deepseek-reasoner`.

## Limitations

- No database, login, watchlist, alerts, or PDF export.
- Search quality depends on live finance/news API availability and provider quotas.
- Google News RSS is optional, experimental, and intended only for this local personal demo; it is not a licensed commercial news feed.
- Chinese news still needs strong upstream source coverage. The app intentionally rejects low-quality Chinese sources; if strict sources are insufficient, it will say so instead of filling the brief with content-farm results.
- The current source stack is a demo stack, not a licensed all-market news feed. See [News Quality Standard](docs/NEWS_QUALITY.md) for the live acceptance snapshot, commercial-use boundary, and paid-launch gates.
- The app prefers regulatory, exchange, company, and mainstream financial media sources, but some paywalled or blocked sources may only provide snippets.
- Article full text may be incomplete when the search provider cannot retrieve it.
- The demo is not investment advice and does not produce buy, sell, or hold recommendations.

## Future improvements

- Add more direct adapters for exchange announcements, company IR pages, and Chinese vertical finance pages.
- Add recorded retrieval regression tests for common A/H/US equity cases.
- Add stricter date validation and article-level quote extraction.
