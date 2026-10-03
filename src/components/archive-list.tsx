"use client";

import { useEffect, useMemo, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { tagLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCard } from "./post-card";

const PAGE_SIZE = 10;

/**
 * Archive with client-side tag filter + text search (no reload) and a
 * "Show more" pager. The first page is server-rendered so crawlers see real links.
 */
export function ArchiveList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Support ?q= (used by the WebSite SearchAction) and ?tag=.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get("q");
    const t = p.get("tag");
    // One-time sync from the URL on mount (external state), so initial HTML stays static.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q);
    if (t && tags.includes(t)) setActive(t);
  }, [tags]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (!active || p.tags.includes(active)) &&
        (!q || [p.title, p.company, p.sector, p.summary, ...p.keywords].join(" ").toLowerCase().includes(q)),
    );
  }, [posts, active, query]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="sr-only">Search research</span>
          <Input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            placeholder="Search companies, sectors, topics"
            className="h-11 text-base sm:max-w-sm"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <Button type="button" size="lg" variant={active === null ? "default" : "outline"} className="min-h-11 cursor-pointer rounded-full px-3.5 sm:min-h-8" aria-pressed={active === null} onClick={() => { setActive(null); setVisible(PAGE_SIZE); }}>
            All
          </Button>
          {tags.map((t) => (
            <Button key={t} type="button" size="lg" variant={active === t ? "default" : "outline"} className="min-h-11 cursor-pointer rounded-full px-3.5 sm:min-h-8" aria-pressed={active === t} onClick={() => { setActive(active === t ? null : t); setVisible(PAGE_SIZE); }}>
              {tagLabel(t)}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "note" : "notes"}
      </p>

      <div className="mt-2 border-t border-border">
        {filtered.slice(0, visible).map((p) => (
          <PostCard key={p.slug} post={p} as="h2" />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-muted-foreground">
            {posts.length === 0 ? "No research has been published yet. The first note is coming soon." : "No notes match. Try clearing the filter."}
          </p>
        )}
      </div>

      {visible < filtered.length && (
        <Button type="button" variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="mt-4 min-h-11 cursor-pointer px-4">
          Show more
        </Button>
      )}
    </div>
  );
}
