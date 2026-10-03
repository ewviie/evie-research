import { Separator } from "@/components/ui/separator";
import { site } from "@/lib/site";

/** Footer: email, GitHub, Instagram, copyright. */
export function SiteFooter() {
  const link = "underline-offset-4 transition-colors hover:text-foreground hover:underline";
  return (
    <footer className="mt-24">
      <Separator />
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}. Research for information only — not investment advice.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li><a className={link} href={`mailto:${site.email}`}>Email</a></li>
          <li><a className={link} href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a className={link} href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
      </div>
    </footer>
  );
}
