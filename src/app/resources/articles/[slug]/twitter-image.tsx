// Twitter card image mirrors the OG image — one design, two meta tags.
export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from "./opengraph-image";

// Must be a literal here — Next parses `revalidate` statically and rejects a
// re-export. Keep in step with the value in ./opengraph-image.
export const revalidate = 3600;
