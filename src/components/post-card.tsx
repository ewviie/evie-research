import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/** Card used on the homepage, archive, tag and related-posts lists. */
export function PostCard({
  post,
  showMeta = true,
  as: Heading = "h3",
}: {
  post: PostMeta;
  showMeta?: boolean;
  /** Heading level for the title, so the page keeps a valid h1 > h2 > h3 outline. */
  as?: "h2" | "h3";
}) {
  return (
    <article className="group relative border-t border-border py-6 first:border-t-0 sm:py-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span className="font-medium text-primary">{post.sector}</span>
        {showMeta && (
          <>
            <span aria-hidden>·</span>
            <span>{post.company}</span>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </>
        )}
      </div>
      <Heading className="mt-2 text-2xl font-semibold leading-snug tracking-tight">
        {/* The stretched link makes the entire card clickable while keeping one real anchor. */}
        <Link
          href={`/research/${post.slug}/`}
          className="after:absolute after:inset-0 transition-colors group-hover:text-primary"
        >
          {post.title}
        </Link>
      </Heading>
      <p className="mt-2 max-w-2xl text-muted-foreground">{post.summary}</p>
    </article>
  );
}
