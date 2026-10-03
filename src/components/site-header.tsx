import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/archive/", label: "Archive" },
  { href: "/about/", label: "About" },
];

/** Top navigation: wordmark + Archive, About, SubSentry. */
export function SiteHeader() {
  const item = cn(buttonVariants({ variant: "ghost" }), "min-h-11 px-2.5 text-muted-foreground hover:text-foreground sm:min-h-8");
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={item}>
              {l.label}
            </Link>
          ))}
          <a href={site.subsentryUrl} target="_blank" rel="noopener noreferrer" className={item}>
            SubSentry
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
