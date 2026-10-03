# SEO strategy: what is realistic

Written 2026-10-03. Evidence = a handful of live web searches run that day; there is **no search-volume or
difficulty data** here (that needs a paid tool or Search Console). Everything in the keyword table is a
hypothesis to test against real impressions, not a forecast.

## The honest picture

- A brand-new domain starts with almost no authority. Expect first impressions 4–12 weeks after indexing,
  and very little traffic for the first 6 months whatever you do.
- Your goal is a site that admissions tutors find and trust. That needs: indexed, searchable by your name,
  fast, credible, linked from your application. It does **not** need to outrank Yahoo Finance.
- The keywords originally suggested are mostly not winnable. What the searches showed:

| Query | Who ranks | Verdict |
|---|---|---|
| "is Visa a good investment 2026" | Yahoo Finance, Motley Fool, Seeking Alpha | Not winnable. Drop it. |
| "student investment thesis example" | Mergers & Inquisitions, WSO, CareerPrinciples, a university PDF | 12+ months, and it is a "how to pitch" query, not what your notes are |
| "nvidia moat analysis cuda" | ~10 small blogs and Substacks, all saying the same thing | Contested but by small sites; 12+ months for a new domain. Only a clearly different angle or real data would stand out |
| "asml euv monopoly cyclicality" | Finimize, Simply Wall St, Substacks | Same: 12+ months, needs an original angle |

## Keyword hypotheses (test with Search Console)

| # | Query pattern | Timeline guess | Confidence |
|---|---|---|---|
| 1 | "Evie Mae investment research" (brand; add something distinctive, e.g. your handle) | weeks after indexing | high, if the name+phrase is not crowded |
| 2 | Exact titles of your own posts | weeks | high (long-tail by definition) |
| 3 | "student equity research portfolio example" / "investment research portfolio for university application" | 6–12 months | low-medium; fewer pages exist, but unverified |
| 4 | "ASML export controls revenue exposure" | 6–12 months | low; needs your own numbers |
| 5 | "is ASML cyclical despite its monopoly" (question form) | 6–12 months | low-medium |
| 6 | "Visa interchange regulation risk 2026" | 12+ months | low |
| 7 | "Visa vs Mastercard network effects moat" | 12+ months | low; crowded |
| 8 | "Nvidia CUDA switching costs" / "Nvidia moat 2026" | 12+ months | low; crowded |
| 9 | "[company] moat analysis" for **less-covered** mid-caps you actually research | 6–12 months | medium: fewer competing pages is the main lever you have |
| 10 | "[small sector] stocks explained" for niches big sites ignore | 12+ months | low |

**Best lever:** write about companies and angles that have *fewer than ~10 serious pages*, with numbers and
sources of your own. Big names are a losing fight; obscure-but-real is where a new site gets in.
After 6–8 weeks, open Search Console → Performance and let the **queries you already get impressions for**
decide what to write next. That beats any list I can give you today.

## On-page rules (what `npm run seo:check` enforces)

- 800–1,500 words of real analysis.
- Primary keyword in title, slug, description, first 100 words, one H2, image alt. Set `keyword:` in
  frontmatter. The check is exact-phrase, so "Nvidia moat" will not match "The Moat Behind the Moat".
- Answer the question in the first two sentences; phrase some H2s as questions if it reads naturally.
- 2+ inline links to your other posts. Tags and related posts are automatic.
- `takeaways:` (Key takeaways box) and `faq:` (3–5 items, answers 40–60 words) in frontmatter.

## FAQ schema: set expectations

Since August 2023 Google shows FAQ rich results only for well-known government and health sites. FAQPage
markup on this site will **not** produce a rich result and is not a ranking factor. It is still in place (it
costs nothing and the visible FAQ helps readers), but do not expect traffic from it. Write FAQ answers because
readers ask those questions, not for the markup.

## Freshness: only change dates when something changed

Set `updated:` and a one-line `whatChanged:` only when you actually revise a post. Bumping dates without
changes is a known way to lose trust with readers and search engines. A quarterly review is fine; a quarterly
re-date is not.

## Backlinks: realistic for a student

No buying links, no link swaps. Things that work slowly and honestly:

1. Link the site from your GitHub profile README and bio, and from your Instagram bio (nofollow, but it
   sends real readers).
2. Link it from SubSentry's site, and from any university investment society you belong to.
3. Reddit (r/investing, r/stocks, others): most subreddits restrict self-promotion; read each sub's rules
   first. Contribute to discussions with a genuine, sourced answer; link only where it is allowed and
   relevant. Spam gets you banned and the domain flagged.
4. Hacker News only for the rare technical piece with something new. Finance notes usually do not fit.
5. Newsletters and society blogs that feature student work: pitch one specific note, not the whole site.
6. Guest posts on student finance sites: only where the editorial standard matches yours.

Expect single-digit backlinks in the first 6 months. That is normal.

## Search Console / Bing setup (needs your accounts)

1. Search Console → Add property. Easiest for a custom domain: **Domain** property with a DNS TXT record.
   Without DNS access, use **URL prefix** and set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel to the
   token (the site emits the meta tag).
2. Sitemaps → submit `https://<your-domain>/sitemap.xml`.
3. Bing Webmaster Tools → import from Search Console, or set `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
4. Search Console emails the property owner about critical indexing and security issues by default once
   verified; check Settings → notifications that your address is right.
5. Weekly, 10 minutes: Performance (impressions, clicks, average position by query and page), Pages (any
   "not indexed" reasons), and whether new posts appear. Do not chase day-to-day position noise.

## What not to do

No keyword stuffing (the check warns above 2% density), no bought links, no generated filler posts, no
clickbait titles, no publishing for volume. Twelve deep posts in a year beat fifty thin ones, and monthly
publishing already gets you there.
