import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArchiveList } from "@/components/archive-list";
import { getAllPosts, getTags } from "@/lib/posts";

const title = "Research Archive";
const description =
  "Every equity and sector research note by Evie Mae, newest first. Filter by sector, company or theme, and see which position is held behind each analysis.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/archive/" });

export default function ArchivePage() {
  // Strip the MDX body before passing to the client component to keep the payload small.
  const posts = getAllPosts().map((p) => ({ ...p, content: undefined, faq: undefined, takeaways: undefined }));
  const tags = getTags().map((t) => t.tag);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-14">
      <header className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{description}</p>
      </header>
      <ArchiveList posts={posts} tags={tags} />
    </div>
  );
}
