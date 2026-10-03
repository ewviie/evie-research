import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({ title: site.title, description: site.description, path: "/" }),
  title: { absolute: site.title },
};

export default function HomePage() {
  const latest = getAllPosts().slice(0, 3);

  // WebSite (with SearchAction pointing at the archive's ?q= search) + Organization.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: absoluteUrl("/"),
      name: site.title,
      description: site.description,
      inLanguage: "en-GB",
      publisher: { "@id": `${site.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${site.url}/archive/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: absoluteUrl("/"),
      logo: `${site.url}/og/site/`,
      sameAs: [site.github, site.instagram],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section className="pb-14 pt-10 sm:pb-20 sm:pt-[4.5rem]">
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            {site.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Monthly equity and sector research, written with real positions behind it. Each note states the thesis,
            what would prove it wrong, and what I own — so the reasoning can be checked against the outcome.
          </p>
        </section>

        <section aria-labelledby="latest-heading">
          <div className="flex items-baseline justify-between border-b border-foreground pb-3">
            <h2 id="latest-heading" className="text-sm font-semibold uppercase tracking-wider">
              Latest research
            </h2>
            <Link href="/archive/" className="text-sm text-primary underline-offset-4 hover:underline">
              All research →
            </Link>
          </div>
          <div>
            {latest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
            {latest.length === 0 && <p className="py-8 text-muted-foreground">The first research note is coming soon.</p>}
          </div>
        </section>

        <section aria-labelledby="about-site-heading" className="mt-20 max-w-2xl">
          <h2 id="about-site-heading" className="text-sm font-semibold uppercase tracking-wider">
            About this site
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This is a public record of my investment research: a multi-year body of written stock and sector
            analyses, published as I write them and never edited to hide a wrong call. Updates are dated, and every
            note discloses my position.
          </p>
          <p className="mt-3">
            <Link href="/about/" className="text-primary underline underline-offset-4">
              About me and this project
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
