import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { getPostsByTag, getTags, tagLabel } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { tagDescriptions } from "@/lib/tag-descriptions";

/** Tag pages with fewer than this many posts are thin content: noindex them. */
const MIN_POSTS_TO_INDEX = 3;

type Params = { tag: string };

/** Written description if one exists, otherwise a generated fallback. */
function tagDescription(tag: string, count: number, latestTitle: string) {
  return (
    tagDescriptions[tag] ??
    `${count} research ${count === 1 ? "note" : "notes"} tagged ${tagLabel(tag)} by ${site.name}, including ${latestTitle}.`
  );
}

export function generateStaticParams(): Params[] {
  return getTags().map(({ tag }) => ({ tag }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (!posts.length) return {};
  const title = `${tagLabel(tag)} — Research Notes`;
  const description = tagDescription(tag, posts.length, posts[0].title);
  return pageMetadata({
    title,
    description,
    path: `/tags/${tag}/`,
    index: posts.length >= MIN_POSTS_TO_INDEX,
  });
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (!posts.length) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-14">
      <header className="mb-10">
        <p className="text-sm text-muted-foreground">
          <Link href="/archive/" className="underline-offset-4 hover:underline">Archive</Link> / Tag
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{tagLabel(tag)}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{tagDescription(tag, posts.length, posts[0].title)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length} research {posts.length === 1 ? "note" : "notes"}, newest first.
        </p>
      </header>
      <div className="border-t border-border">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} as="h2" />
        ))}
      </div>
    </div>
  );
}
