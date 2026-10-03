"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Share on X, LinkedIn, or copy the link. Plain anchors for social — no SDK scripts. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const item = cn(buttonVariants({ variant: "outline" }), "min-h-11 cursor-pointer px-3 text-muted-foreground hover:text-primary sm:min-h-8");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (e.g. insecure context) — fail silently */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this note">
      <span className="mr-1 text-sm text-muted-foreground">Share</span>
      <a className={item} target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}>
        X
      </a>
      <a className={item} target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}>
        LinkedIn
      </a>
      <Button type="button" variant="outline" className="min-h-11 cursor-pointer px-3 text-muted-foreground hover:text-primary sm:min-h-8" onClick={copy}>
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </Button>
    </div>
  );
}
