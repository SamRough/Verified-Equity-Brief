# News Quality Standard

## Product promise

Verified Equity Brief is a source-verifiable news intelligence workflow. It is not a general web search wrapper and it is not an investment-recommendation product. A rendered claim must be traceable to a retrieved, date-verified article. When the evidence does not meet the bar, the correct result is `Insufficient verified sources found.`

## Current retrieval policy

1. Finance APIs provide broad recall: Marketaux, Alpha Vantage, and Yahoo Finance.
2. Sina Finance individual-security pages provide a dated supplemental feed for US, Hong Kong, and A-share tickers.
3. Tavily, SerpAPI, and the optional Google News RSS discovery route are candidate-only retrieval layers. They do not establish article dates or claim eligibility by themselves. Google RSS is enabled only with an explicit local personal-demo flag; decoded URLs must be original publishers and pass all normal gates.
4. A source must pass the serious-source allowlist, company relevance test, article-level noise rules, and selected-date-window test before it can support a claim.
5. Similar headline events are clustered before the LLM sees them. Selection is capped per event and per publisher to reduce syndicated-news repetition.
6. Provider diagnostics distinguish `used`, `empty`, `skipped`, and `failed`; a configured API key never appears as a successful search when it returned no articles or the provider rejected the request.

## Admission rules

Articles are excluded when they are any of the following:

- Content farms, forums, social posts, search pages, quote pages, broker ratings, price targets, or stock-picking content.
- Market-flow items such as margin financing, northbound flows, technical indicators, or intraday price commentary.
- SEO explainers, purchase guides, FAQ pages, or unrelated stories that happen to mention the company name.
- Outside the requested time window, or missing a verifiable date when the article would otherwise be used for a claim.

Tier 3 aggregation sources may appear in the audit trail but are not a substitute for independent reporting. Evidence confidence is capped when the brief has no Tier 1 source, only one publisher, or only one event cluster.

## Acceptance snapshot

Live 7-day regression run on 2026-07-10, using the configured local providers:

| Case | Result | What it demonstrates |
| --- | --- | --- |
| Tencent, Chinese | 7 verified sources | Cross-publisher event selection removes repeated syndication while preserving dated business events. |
| AMD, English | 11 verified sources | US retrieval combines finance APIs and original-publisher discovery without retaining duplicate publisher/event pairs. |
| Pop Mart, Chinese | 2 verified sources | The Hong Kong stock connector and strict source gates retain dated business-event articles. |
| Kweichow Moutai, Chinese | 1 verified source | Single-source mode is used and confidence falls to 39. |
| PDD, Chinese | 2 verified sources | Google RSS discovery restored current-event recall; decoded links and publisher/event de-duplication remain enforced. |

This is a quality snapshot, not a permanent coverage claim. News volume changes by company and week.

## What is still required before a paid launch

The current demo is not ready to promise full A-share, Hong Kong, and US coverage for a $10/month subscription. The blocking issue is licensed Chinese news coverage, not LLM summarization.

Before charging for a broad-coverage product, the following gates must pass:

1. Add a commercial-use news provider with explicit redistribution rights and strong Chinese finance coverage. Do not use Google News RSS as a commercial source.
2. Introduce a security master that resolves exchange, legal issuer, aliases, brands, and subsidiaries without depending on hard-coded profiles or an LLM response.
3. Record a fixed weekly gold set across at least 20 A shares, 20 Hong Kong shares, and 20 US shares. Manually label material events and source quality.
4. Meet these thresholds for four consecutive weekly runs:
   - Top-five source precision at least 90%.
   - Recall at least 80% of gold-set material events from allowed sources.
   - Zero claims supported by an article outside the selected date window.
   - Zero briefs supported only by Tier 3 sources.
   - P95 retrieval plus validation latency under 15 seconds.
5. Preserve the article-level audit record: publisher, URL, retrieval provider, publication date evidence, source tier, rejection reason, and event cluster.

## Pricing conclusion

$10/month can be plausible for a personal research workflow only after the data cost is shared across a sufficiently large base and the product is explicit about its coverage universe. It is not plausible to promise institutional-grade global and Chinese news coverage on free search APIs alone. Until a commercially licensed Chinese data source is connected, this should remain a demo or a bring-your-own-data-key workflow.
