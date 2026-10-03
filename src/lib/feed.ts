import { Feed } from "feed";
import { getAllPosts } from "./posts";
import { absoluteUrl, site } from "./site";

/** Build the Feed object once; RSS 2.0 and JSON Feed are both rendered from it. */
export function buildFeed(): Feed {
  const feed = new Feed({
    id: absoluteUrl("/"),
    link: absoluteUrl("/"),
    title: site.title,
    description: site.description,
    language: "en-GB",
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    updated: new Date(getAllPosts()[0]?.updated ?? Date.now()),
    feedLinks: { rss2: `${site.url}/rss.xml`, json: `${site.url}/feed.json` },
    author: { name: site.name, link: absoluteUrl("/about/") },
  });
  for (const p of getAllPosts()) {
    const url = absoluteUrl(`/research/${p.slug}/`);
    feed.addItem({
      id: url,
      link: url,
      title: p.title,
      description: p.summary,
      date: new Date(p.updated),
      published: new Date(p.date),
      author: [{ name: p.author }],
      category: p.tags.map((name) => ({ name })),
      image: p.image ? absoluteUrl(p.image) : absoluteUrl(`/og/${p.slug}/`),
    });
  }
  return feed;
}
