import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { PositionCallout } from "@/components/position-callout";
import { TableOfContents } from "@/components/toc";
import { ShareLinks } from "@/components/share-links";
import { AuthorBio } from "@/components/author-bio";
import { FaqSection } from "@/components/faq-section";
import { KeyTakeaways } from "@/components/key-takeaways";
import { PostCard } from "@/components/post-card";
import { mdxComponents } from "@/components/mdx-components";
import { formatDate, getAllPosts, getHeadings, getPost, getRelatedPosts, tagLabel } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";

type Params = { slug: string };

// Every post is generated at build time; unknown slugs 404.
export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

/** Dynamic OG image by default; frontmatter `image` overrides it. */
const ogImage = (slug: string, image?: string) => (image ? absoluteUrl(image) : absoluteUrl(`/og/${slug}/`));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = absoluteUrl(`/research/${slug}/`);
  const image = { url: ogImage(slug, post.image), width: 1200, height: 630, alt: post.title };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author, url: absoluteUrl("/about/") }],
    alternates: { canonical: url },
    publisher: site.name,
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: site.locale,
      title: post.title,
      description: post.summary,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      section: post.sector,
      tags: post.tags,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, images: [image.url] },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/research/${slug}/`);
  const headings = getHeadings(post.content);
  const related = getRelatedPosts(post);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated,
      author: { "@type": "Person", name: post.author, url: absoluteUrl("/about/") },
      image: [ogImage(slug, post.image)],
      publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/og/site/` } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.keywords.join(", "),
      articleSection: post.sector,
      inLanguage: "en-GB",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Research", item: absoluteUrl("/archive/") },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  // FAQPage schema, built from the same frontmatter that renders the FAQ section.
  if (post.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
      <JsonLd data={jsonLd} />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/archive/" className="hover:underline">Research</Link></li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-[minmax(0,42.5rem)_14rem] lg:justify-between lg:gap-12">
        <article>
          <header>
            <p className="text-sm font-medium text-primary">{post.sector}</p>
            <h1 className="mt-2 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>By {post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
              {post.updated !== post.date && (
                <>
                  <span aria-hidden>·</span>
                  <span>Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>
                </>
              )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t}>
                  <Badge variant="outline" className="h-7 px-3 text-muted-foreground hover:border-primary hover:text-primary" render={<Link href={`/tags/${t}/`} />}>
                    {tagLabel(t)}
                  </Badge>
                </li>
              ))}
            </ul>
          </header>

          {/* Freshness: shown only when the post has been updated since publication. */}
          {post.updated !== post.date && (
            <p className="mt-6 text-sm">
              <span className="font-semibold">Last updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>.</span>{" "}
              {post.whatChanged && <span className="text-muted-foreground">What changed: {post.whatChanged}</span>}
            </p>
          )}
          <div className="mt-8"><PositionCallout company={post.company} position={post.position} /></div>
          <div className="mt-4"><KeyTakeaways items={post.takeaways} /></div>
          <div className="mt-6 lg:hidden"><TableOfContents headings={headings} /></div>

          <div className="prose-research mt-10">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                  remarkRehypeOptions: { footnoteLabel: "Notes", footnoteLabelProperties: {} },
                },
              }}
            />
          </div>

          <FaqSection items={post.faq} />
          <div className="mt-12"><ShareLinks url={url} title={post.title} /></div>
          <AuthorBio />

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-16">
              <h2 id="related-heading" className="border-b border-foreground pb-3 text-sm font-semibold uppercase tracking-wider">
                Related research
              </h2>
              {related.map((p) => <PostCard key={p.slug} post={p} showMeta={false} />)}
            </section>
          )}
        </article>

        <aside className="hidden lg:block" aria-label="Table of contents">
          <div className="sticky top-8"><TableOfContents headings={headings} /></div>
        </aside>
      </div>
    </div>
  );
}
