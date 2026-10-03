import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

// Pre-rendered at build time: one 1200x630 PNG per post, plus /og/site/ for everything else.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "site" }, ...getAllPosts().map((p) => ({ slug: p.slug }))];
}

// Satori needs raw font bytes (woff/ttf, not woff2). Fontsource ships Newsreader as woff.
const fontDir = path.join(process.cwd(), "node_modules/@fontsource/newsreader/files");
const font = (weight: number) => fs.readFileSync(path.join(fontDir, `newsreader-latin-${weight}-normal.woff`));

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = slug === "site" ? undefined : getPost(slug);

  const eyebrow = post ? `${post.sector.toUpperCase()}  ·  ${post.company.toUpperCase()}` : "EQUITY & SECTOR RESEARCH";
  const title = post ? post.title : site.tagline;
  const footer = post ? `${post.company} — ${post.position}` : "Monthly research, with real positions behind it.";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FAFAF8", color: "#0A0A0A" }}>
        <div style={{ width: 16, background: "#1E3A5F", display: "flex" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, color: "#1E3A5F", fontFamily: "Newsreader", fontWeight: 600 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: title.length > 60 ? 64 : 76, lineHeight: 1.08, fontFamily: "Newsreader", fontWeight: 600, letterSpacing: -1 }}>
            {title}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28, fontFamily: "Newsreader", fontWeight: 400, color: "#55554F" }}>
            <div style={{ display: "flex", maxWidth: 760 }}>{footer}</div>
            <div style={{ display: "flex", color: "#0A0A0A", fontWeight: 600 }}>{site.name}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Newsreader", data: font(400), weight: 400, style: "normal" },
        { name: "Newsreader", data: font(600), weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
