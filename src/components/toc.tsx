"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Heading } from "@/lib/posts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

/**
 * Table of contents. Sticky sidebar on desktop (with scroll-spy), collapsible
 * <details> on mobile. Both render server-side so the links are crawlable.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    // Highlight the last heading that has scrolled past the top third of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const list = (
    <ol className="space-y-1 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : undefined}>
          <a
            href={`#${h.id}`}
            aria-current={active === h.id ? "location" : undefined}
            className={cn(
              "block rounded py-1.5 leading-snug text-muted-foreground transition-colors hover:text-foreground",
              active === h.id && "font-medium text-primary",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label="Table of contents">
      {/* Mobile: collapsible (shadcn Collapsible) */}
      <Collapsible className="group rounded-md border border-border px-4 lg:hidden">
        <CollapsibleTrigger className="flex min-h-11 w-full cursor-pointer items-center justify-between text-sm font-medium">
          On this page
          <ChevronDown className="size-4 transition-transform group-data-[open]:rotate-180" aria-hidden />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-3">{list}</CollapsibleContent>
      </Collapsible>
      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
        {list}
      </div>
    </nav>
  );
}
