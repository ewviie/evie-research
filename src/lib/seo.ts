import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

/**
 * Metadata for non-post pages. Page-level openGraph/twitter replace (not merge with)
 * the layout's, so the default share image is re-applied here.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  type?: "website" | "profile";
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = { url: absoluteUrl("/og/site/"), width: 1200, height: 630, alt: site.title };
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: { index: opts.index ?? true, follow: true },
    openGraph: {
      type: opts.type ?? "website",
      title: opts.ogTitle ?? opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: site.locale,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: opts.ogTitle ?? opts.title, description: opts.description, images: [image.url] },
  };
}
