import Link from "next/link";
import { site } from "@/lib/site";

/** Author block shown at the bottom of every post. */
export function AuthorBio() {
  return (
    <aside aria-labelledby="author-heading" className="mt-16 border-t border-border pt-8">
      <h2 id="author-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        About the author
      </h2>
      <p className="mt-3 font-serif text-xl font-semibold">{site.name}</p>
      <p className="mt-1 max-w-xl text-muted-foreground">
        I write monthly equity and sector research and hold positions in the companies I cover, disclosed at the top of
        every note. <Link href="/about/" className="text-primary underline underline-offset-4">More about me</Link>.
      </p>
    </aside>
  );
}
