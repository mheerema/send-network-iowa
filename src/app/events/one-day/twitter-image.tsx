// X / Twitter share image for the One Day event page.
//
// Next.js treats `opengraph-image` and `twitter-image` as independent file
// conventions: a route's `twitter:image` tag is only emitted when a
// `twitter-image` file exists. To guarantee X (and any consumer that reads
// `twitter:image` specifically) renders the branded card rather than falling
// back to the site default, we re-export the same generator and metadata as
// the Open Graph image. One source of truth, two emitted tags.
export { default, alt, size, contentType } from "./opengraph-image";
