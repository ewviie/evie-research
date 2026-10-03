/**
 * next-sitemap runs after `next build` (see "postbuild" in package.json) and writes
 * sitemap.xml + robots.txt into /public. It reads post frontmatter directly so that
 * lastmod matches each post's `updated` date and thin tag pages stay out of the sitemap.
 */
const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://evie-research.vercel.app").replace(/\/$/, "");
const MIN_POSTS_TO_INDEX = 3; // keep in sync with src/app/tags/[tag]/page.tsx

const dir = path.join(__dirname, "content", "research");
const posts = fs
  .readdirSync(dir)
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v));
    return { slug: f.replace(/\.mdx?$/, ""), updated: iso(data.updated || data.date), tags: (data.tags || []).map((t) => t.toLowerCase()) };
  });

const tagCounts = {};
posts.forEach((p) => p.tags.forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1)));
const thinTags = Object.keys(tagCounts).filter((t) => tagCounts[t] < MIN_POSTS_TO_INDEX);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  trailingSlash: true,
  changefreq: "monthly",
  priority: 0.7,
  exclude: ["/og/*", "/rss.xml", "/feed.json", ...thinTags.flatMap((t) => [`/tags/${t}`, `/tags/${t}/`])],
  transform: async (config, loc) => {
    const post = posts.find((p) => loc.startsWith(`/research/${p.slug}`));
    return {
      loc,
      changefreq: config.changefreq,
      priority: loc === "/" ? 1 : post ? 0.9 : config.priority,
      lastmod: post ? new Date(post.updated).toISOString() : new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
