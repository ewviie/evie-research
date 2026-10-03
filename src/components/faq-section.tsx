import type { FaqItem } from "@/lib/posts";

/**
 * FAQ section at the bottom of a post. Plain headings + paragraphs (no accordion JS):
 * the answers stay visible to readers and crawlers. The matching FAQPage JSON-LD is
 * built in the post page from the same data.
 */
export function FaqSection({ items }: { items?: FaqItem[] }) {
  if (!items?.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2 id="faq-heading" className="border-b border-foreground pb-3 text-sm font-semibold uppercase tracking-wider">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-border">
        {items.map((f) => (
          <div key={f.q} className="py-5">
            <h3 className="text-lg font-semibold leading-snug">{f.q}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
