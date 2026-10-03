/**
 * Central site configuration. Every URL, name and contact detail used for
 * metadata, JSON-LD and feeds comes from here — edit once, applied everywhere.
 */

// Canonical origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in Vercel.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://evie-research.vercel.app"
).replace(/\/$/, "");

export const site = {
  name: "Evie Mae",
  title: "Evie Mae — Investment Research",
  tagline: "Investment research and analysis.",
  description:
    "Monthly equity and sector research by Evie Mae, published alongside the real positions behind it all. A public, multi-year investment research portfolio.",
  url: SITE_URL,
  locale: "en_GB",
  // Contact and profile links (used in the footer, About page and JSON-LD).
  email: "ewviiee@outlook.com",
  github: "https://github.com/ewviie",
  instagram: "https://www.instagram.com/ewviiee/",
  subsentryUrl: "https://subsentrywaitlist.netlify.app/",
  twitter: "", // optional, e.g. "@handle" — leave empty to omit twitter:creator
} as const;

/** Build an absolute URL with the site's trailing-slash convention. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = /\.[a-z0-9]+$/i.test(clean) || clean.endsWith("/") ? clean : `${clean}/`;
  return `${SITE_URL}${withSlash}`;
}
