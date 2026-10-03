#!/usr/bin/env node
/**
 * Scaffold a new research post.
 *   npm run new-post -- "Nvidia — The Moat Behind the Moat" --company Nvidia --sector Semiconductors
 * Creates content/research/<slug>.mdx from docs/post-template.mdx with today's date filled in.
 * Never overwrites an existing file.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith("--"));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

if (!title) {
  console.error('Usage: npm run new-post -- "Post title" [--company Name] [--sector Name] [--slug custom-slug]');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const company = flag("company", "Company");
const sector = flag("sector", "Sector");
// Keyword-rich slug: lowercase words, accents and punctuation removed, plus the year.
const slug =
  flag("slug", "") ||
  `${title.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${today.slice(0, 4)}`;

const target = path.join(process.cwd(), "content", "research", `${slug}.mdx`);
if (fs.existsSync(target)) {
  console.error(`Already exists: ${target}`);
  process.exit(1);
}

const tpl = fs
  .readFileSync(path.join(process.cwd(), "docs", "post-template.mdx"), "utf8")
  .replace(/^# Copy this file.*\n# The filename.*\n/m, "")
  .replace('title: "Company — Angle"', `title: ${JSON.stringify(title)}`)
  .replace(/date: "2026-01-01"/, `date: "${today}"`)
  .replace(/updated: "2026-01-01"/, `updated: "${today}"`)
  .replace('company: "Company"', `company: ${JSON.stringify(company)}`)
  .replace('sector: "Sector"', `sector: ${JSON.stringify(sector)}`)
  .replace(/position: ".*"/, `position: "Small position — entered ${today}"`)
  .replace('keywords: ["company analysis"]', `keywords: [${JSON.stringify(`${company.toLowerCase()} analysis`)}]`);

fs.writeFileSync(target, tpl);
console.log(`Created ${path.relative(process.cwd(), target)}\nURL will be /research/${slug}/\nEdit it, then: git add -A && git commit -m "Add ${slug}" && git push`);
