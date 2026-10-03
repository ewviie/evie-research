import Image from "next/image";
import type { ComponentProps } from "react";
import { Callout } from "./callout";

/** True when a link points off-site and needs target/rel hardening. */
const isExternal = (href = "") => /^https?:\/\//.test(href);

/** Element overrides applied to every MDX post. */
export const mdxComponents = {
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
    ) : (
      <a href={href} {...rest}>{children}</a>
    ),
  // Wrap tables so wide ones scroll horizontally instead of breaking the layout.
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap"><table {...props} /></div>
  ),
  // Markdown images -> next/image. Local files only; width/height keep CLS at zero.
  img: ({ src = "", alt = "" }: ComponentProps<"img">) => (
    <Image src={String(src)} alt={alt} width={1200} height={675} sizes="(min-width: 768px) 680px, 100vw" className="h-auto w-full" />
  ),
  // <Figure src alt caption /> for images with captions.
  Figure: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure>
      <Image src={src} alt={alt} width={1200} height={675} sizes="(min-width: 768px) 680px, 100vw" className="h-auto w-full" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ),
  Callout,
};
