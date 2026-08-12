import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, loadLogoSrc } from "@/lib/og";

export const alt = "Articles — Send Network Iowa";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoSrc();

  return new ImageResponse(
    (
      <OgCard
        logoSrc={logoSrc}
        title="Articles"
        byline="News and commentary for the work in Iowa"
        bylineColor="rgba(255,255,255,0.85)"
      />
    ),
    {
      ...size,
    },
  );
}
