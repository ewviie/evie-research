import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";

const title = "Start Here";
const description =
  "New to Evie Mae's research? Start with these notes: the strongest work from a monthly equity and sector portfolio, each with its thesis, risks and position.";

// Stays out of search results until there is at least one post to show.
export function generateMetadata(): Metadata {
  return pageMetadata({ title, description, path: "/start/", index: getAllPosts().length > 0 });
}

/** Curated entry point: posts marked `featured: true` in frontmatter (max 5), else the latest five. */
export default function StartPage() {
  const all = getAllPosts();
  const featured = all.filter((p) => p.featured);
  const picks = (featured.length ? featured : all).slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-14">
      <header className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Every note follows the same shape: a thesis, what would prove it wrong, and the position I hold. These are the
          best places to begin. The full list is in the <Link href="/archive/" className="text-primary underline underline-offset-4">archive</Link>.
        </p>
      </header>
      <div className="border-t border-border">
        {picks.map((p) => (
          <PostCard key={p.slug} post={p} as="h2" />
        ))}
        {picks.length === 0 && <p className="py-8 text-muted-foreground">The first research note is coming soon.</p>}
      </div>
    </div>
  );
}
