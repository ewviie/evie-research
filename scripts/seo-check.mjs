#!/usr/bin/env node
/**
 * On-page SEO linter for posts. Run: npm run seo:check
 * Advisory only (always exits 0): it flags the things that actually affect ranking so you can
 * decide what to fix. Rules mirror the SEO plan: length, keyword placement, internal links, FAQ shape.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content", "research");
const words = (s) => s.trim().split(/\s+/).filter(Boolean);
const strip = (md) => md.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#>*_`|\[\]^-]/g, " ");

let issues = 0;
for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
  const slug = file.replace(/\.mdx?$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  const text = strip(content);
  const wc = words(text).length;
  const out = [];
  const warn = (msg) => out.push(`  ✗ ${msg}`);
  const ok = (msg) => out.push(`  ✓ ${msg}`);
  const check = (cond, good, bad) => (cond ? ok(good) : warn(bad));

  if (wc < 800) warn(`${wc} words — under 800; thin for ranking`);
  else ok(wc > 1500 ? `${wc} words (long; fine if every section earns its place)` : `${wc} words`);

  const kw = (data.keyword || "").toLowerCase();
  if (!kw) warn('no `keyword` in frontmatter — add a primary keyword to check placement');
  else {
    const h2s = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].toLowerCase());
    const alts = [...content.matchAll(/!\[([^\]]*)\]/g)].map((m) => m[1].toLowerCase());
    const first100 = words(text).slice(0, 100).join(" ").toLowerCase();
    const slugText = slug.replace(/-/g, " ");
    const checks = {
      title: (data.title || "").toLowerCase().includes(kw),
      "meta description": (data.description || "").toLowerCase().includes(kw),
      "first 100 words": first100.includes(kw),
      "an H2": h2s.some((h) => h.includes(kw)),
      "image alt text": alts.some((a) => a.includes(kw)),
      slug: kw.split(" ").every((w) => slugText.includes(w)),
    };
    const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
    check(!missing.length, `keyword "${kw}" placed everywhere`, `keyword "${kw}" missing from: ${missing.join(", ")}`);
    const hits = text.toLowerCase().split(kw).length - 1;
    const density = wc ? ((hits * words(kw).length) / wc) * 100 : 0;
    check(density <= 2, `keyword density ${density.toFixed(1)}% (${hits} uses)`, `keyword density ${density.toFixed(1)}% — looks stuffed`);
  }

  const internal = new Set([...content.matchAll(/\]\((\/research\/[^)\s]+)\)/g)].map((m) => m[1]));
  check(internal.size >= 2, `${internal.size} inline links to other posts`, `${internal.size} inline links to other posts — aim for 2+`);
  check((data.tags || []).length > 0, `${(data.tags || []).length} tags (each links to a tag page)`, "no tags");

  const faq = data.faq || [];
  if (faq.length < 3 || faq.length > 5) warn(`${faq.length} FAQ items — aim for 3–5`);
  else ok(`${faq.length} FAQ items`);
  for (const f of faq) {
    const n = words(f.a).length;
    if (n < 40 || n > 60) warn(`FAQ "${f.q}" answer is ${n} words (aim 40–60)`);
  }
  check((data.takeaways || []).length > 0, "has Key takeaways", "no Key takeaways");
  const desc = (data.description || "").length;
  check(desc >= 150 && desc <= 160, `description ${desc} chars`, `description ${desc} chars (aim 150–160)`);
  if (data.updated && data.updated !== data.date && !data.whatChanged) warn("updated without a `whatChanged` note");

  const bad = out.filter((l) => l.includes("✗")).length;
  issues += bad;
  console.log(`\n${slug}  (${bad} to fix)\n${out.join("\n")}`);
}
console.log(`\n${issues} issue(s) across all posts. Advisory only.`);
