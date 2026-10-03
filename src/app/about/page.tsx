import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, site } from "@/lib/site";

const title = "About";
const description =
  "Evie Mae writes monthly equity and sector research with real money behind it, and is building SubSentry, a mobile app that finds forgotten subscriptions.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/about/", ogTitle: `About ${site.name}`, type: "profile" });

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: absoluteUrl("/about/"),
    description,
    jobTitle: "Independent investment researcher",
    email: `mailto:${site.email}`,
    sameAs: [site.github, site.instagram],
    knowsAbout: ["Equity research", "Semiconductors", "Payments", "Personal finance"],
    mainEntityOfPage: absoluteUrl("/about/"),
  };

  // TODO: this is draft copy — rewrite in your own voice and add real specifics.
  const h2 = "mt-12 text-2xl font-semibold tracking-tight";
  return (
    <div className="mx-auto max-w-3xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-14">
      <JsonLd data={jsonLd} />
      <header>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About</h1>
        <p className="mt-4 text-lg text-muted-foreground">{site.tagline}</p>
      </header>

      <div className="mt-10 max-w-[42.5rem] space-y-5 text-[1.0625rem] leading-relaxed">
        <p>
          I&apos;m {site.name}. I write about companies and sectors and put real money behind the conclusions, so that
          the work is tested by outcomes rather than opinions.
        </p>
        <h2 className={h2}>Why markets</h2>
        <p>
          Markets are the most honest feedback loop I know. A thesis is either right or wrong, and the price tells you
          which, eventually. I want to get better at the part before the price moves: working out what a business is
          worth, what could break it, and how confident I should be.
        </p>
        <h2 className={h2}>What I&apos;m working on</h2>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>This portfolio.</strong> A monthly research note on one company or sector, with the position I hold
            disclosed at the top and any later changes dated.
          </li>
          <li>
            <strong>SubSentry.</strong> A mobile app that finds forgotten subscriptions, shows their true annual cost, and
            helps people take back control of recurring spending.
          </li>
        </ul>
        <h2 className={h2}>Contact</h2>
        <p>
          Email <a className="text-primary underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>{" "}
          or find me on{" "}
          <a className="text-primary underline underline-offset-4" href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>{" "}
          and{" "}
          <a className="text-primary underline underline-offset-4" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>.
        </p>
        <p className="text-sm text-muted-foreground">
          Nothing on this site is investment advice. I may hold positions in companies I write about; these are
          disclosed in each note.
        </p>
      </div>
    </div>
  );
}
