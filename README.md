# Equity Research Copilot

A verified news intelligence tool for equity research workflows. Enter `Tencent` or `0700.HK`, select a time range and language, and the app filters candidate news into verified, source-qualified items before generating an optional cited brief.

## Why this exists

AI research tools can hallucinate: they may invent news, mix old stories into a recent window, cite weak sources, or treat content farms as evidence. That is especially risky in equity research workflows, where users need to inspect the evidence before reading any AI summary.

## How the demo reduces hallucination

- Retrieves real articles through SerpAPI as the primary search provider, with Tavily as an optional fallback.
- Uses source-bucketed retrieval for official/exchange announcements, regulators, Chinese financial media, HK financial media, and international financial media.
- Chinese mode uses a strict serious-source allowlist and rejects Baijiahao, portals, forums, social posts, search pages, and content-farm reposts.
- Normalizes and filters results for Tencent relevance, duplicate URLs, low-quality sources, and selected time range.
- Supports English and Simplified Chinese brief generation. Chinese mode prioritizes SerpAPI Baidu News for Chinese financial media.
- Shows the news candidates and evidence quality before the generated brief.
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

## Required environment variables

```bash
DEEPSEEK_API_KEY=sk-your-deepseek-key
SERPAPI_API_KEY=your-serpapi-key
TAVILY_API_KEY=tvly-your-tavily-key
DEEPSEEK_MODEL=deepseek-v4-pro
```

`SERPAPI_API_KEY` is the primary search key. `TAVILY_API_KEY` is optional and used only as fallback. `DEEPSEEK_MODEL` is optional and defaults to `deepseek-v4-pro`.

## Limitations

- No database, login, watchlist, alerts, or PDF export.
- Search quality depends on SerpAPI, Tavily fallback availability, and live web/news availability.
- Chinese news uses SerpAPI Baidu News first, but the app intentionally rejects low-quality Chinese sources. If strict sources are insufficient, the app will say so instead of filling the brief with content-farm results.
- The app prefers regulatory, exchange, company, and mainstream financial media sources, but some paywalled or blocked sources may only provide snippets.
- Article full text may be incomplete when the search provider cannot retrieve it.
- The demo is not investment advice and does not produce buy, sell, or hold recommendations.

## Future improvements

- Add official exchange announcements and filings as a preferred retrieval source.
- Add source reputation scoring and better clustering of syndicated articles.
- Add stricter date validation and article-level quote extraction.
- Add regression tests with recorded search fixtures for development only.
