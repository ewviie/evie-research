import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";

const POSTS_DIR = path.join(process.cwd(), "content", "research");

/** Frontmatter schema for every MDX post. */
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  updated: string; // ISO yyyy-mm-dd
  company: string;
  sector: string;
  position: string;
  tags: string[];
  keywords: string[];
  summary: string;
  author: string;
  /** Optional custom OG image path; otherwise generated at /og/[slug]/. */
  image?: string;
  /** Primary target keyword — used only by `npm run seo:check`, never rendered. */
  keyword?: string;
  /** Show on the /start/ page. */
  featured: boolean;
  /** Scannable summary bullets shown in the "Key takeaways" box. */
  takeaways?: string[];
  /** Q&A pairs rendered as an FAQ section and FAQPage JSON-LD. */
  faq?: FaqItem[];
  /** One line describing what changed in the latest update. */
  whatChanged?: string;
  readingMinutes: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

// Core fields a post cannot do without. SEO fields (description, summary, keywords) fall back below.
const REQUIRED = ["title", "date", "company", "sector"] as const;

function parseFile(file: string): Post {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  // Fail the build loudly when a core field is missing rather than shipping a broken page.
  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`Post "${slug}" is missing frontmatter field "${key}"`);
  }
  // gray-matter parses bare YAML dates into Date objects; normalise to strings.
  const iso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v));

  if (!data.description && !data.summary) {
    throw new Error(`Post "${slug}" needs a "description" or a "summary"`);
  }

  return {
    slug,
    title: data.title,
    // description and summary stand in for each other; keywords default to the tags.
    description: data.description ?? data.summary,
    date: iso(data.date),
    updated: iso(data.updated ?? data.date),
    company: data.company,
    sector: data.sector,
    position: data.position ?? "",
    tags: (data.tags ?? []).map((t: string) => t.toLowerCase()),
    keywords: data.keywords ?? data.tags ?? [],
    summary: data.summary ?? data.description,
    author: data.author ?? "Evie Mae",
    image: data.image,
    keyword: data.keyword,
    featured: Boolean(data.featured),
    takeaways: data.takeaways,
    faq: data.faq,
    whatChanged: data.whatChanged,
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  };
}

/** All posts, newest first. Cached per build process. */
let cache: Post[] | null = null;
export function getAllPosts(): Post[] {
  if (cache) return cache;
  cache = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Tag -> posts, sorted by tag name. */
export function getTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

/** Related posts, ranked by shared tags (+ same sector bonus). */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => post.tags.includes(t)).length * 2 + (p.sector === post.sector ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.p);
}

/**
 * Extract h2/h3 headings for the table of contents. Slugs use github-slugger,
 * the same algorithm rehype-slug applies, so anchors line up with the rendered ids.
 */
export function getHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    // Strip inline markdown so the slug matches the rendered text.
    const text = m[2].replace(/[*_`]|\[([^\]]+)\]\([^)]+\)/g, "$1");
    out.push({ id: slugger.slug(text), text, level: m[1].length as 2 | 3 });
  }
  return out;
}

// Pure formatting helpers live in ./format so client components can use them without bundling node:fs.
export { formatDate, tagLabel } from "./format";
