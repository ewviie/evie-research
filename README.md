# Evie Mae — Investment Research

Static research blog: Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, MDX.
No CMS, no database — posts are Markdown files in `content/research/`.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + sitemap.xml/robots.txt (postbuild)
npm start          # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com`) in `.env.local` and in Vercel. It drives canonicals,
Open Graph URLs, JSON-LD, feeds and the sitemap.

**Before launch**, edit `src/lib/site.ts` (SubSentry URL, if it changes) and rewrite the draft copy in
`src/app/about/page.tsx`. `content/research/` starts empty. `docs/post-template.mdx` is a ready-to-copy post template.

## Add a post (only you can: it needs push access to the repo)

There is no login or admin page on the site. A post goes live when you push it to GitHub and Vercel redeploys,
so the lock is your GitHub account.

```bash
npm run new-post -- "Nvidia — The Moat Behind the Moat" --company Nvidia --sector Semiconductors
# edit content/research/nvidia-the-moat-behind-the-moat-2026.mdx, check it locally with npm run dev, then:
git add -A && git commit -m "Add nvidia post" && git push
```

`docs/post-template.mdx` shows every frontmatter field. Keep the GitHub repo's write access to yourself and turn
on two-factor authentication on the account. The frontmatter looks like this:

```mdx
---
title: "Company — Angle"
description: "150–160 chars for search results."
date: "2026-11-01"
updated: "2026-11-01"
company: "Company"
sector: "Sector"
position: "Small position — entered 2026-11-01"
tags: ["sector", "equity-research"]
keywords: ["company analysis"]
summary: "One line for cards and the OG description."
author: "Evie Mae"
# Optional, used for ranking features:
keyword: "primary target keyword"   # only read by `npm run seo:check`
featured: true                       # lists the post on /start/ (max 5)
takeaways: ["Bullet 1", "Bullet 2"]  # "Key takeaways" box
faq:                                 # FAQ section + FAQPage JSON-LD (3–5, answers 40–60 words)
  - q: "Question?"
    a: "Answer."
whatChanged: "One line"              # shown with "Last updated" when updated differs from date
---
```

The build fails if `title`, `date`, `company` or `sector` is missing, or if both `description` and `summary` are.
Available in MDX: `##`/`###` headings (feed the table of contents), blockquotes, GFM tables, footnotes `[^1]`,
code fences, images `![alt](/images/x.png)` (put files in `public/images/`), and
`<Callout type="note|thesis|risk" title="...">`. Reading time, related posts, OG image, JSON-LD, sitemap and RSS
entries are all automatic. Set `image:` in frontmatter only to override the generated OG image.

Run `npm run seo:check` for an advisory on-page SEO report (length, keyword placement, links, FAQ shape);
see `docs/SEO-STRATEGY.md` for what to target and what is realistic.

Tag pages with fewer than 3 posts are `noindex` and left out of the sitemap.

## Moved content

Add a 301 to `redirects()` in `next.config.ts` when you rename a slug.

## Deploy

Push to GitHub, import the repo in Vercel, set `NEXT_PUBLIC_SITE_URL`, deploy. Vercel runs `npm run build`,
which also runs `next-sitemap`. HTTPS is automatic.

## Verify after deploy

Google Rich Results Test and Search Console (submit `/sitemap.xml`), opengraph.xyz for share cards,
PageSpeed Insights, and a validator such as validator.w3.org/feed for `/rss.xml`.
