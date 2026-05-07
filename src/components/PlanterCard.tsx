import Image from "next/image";
import Link from "next/link";

interface PlanterCardProps {
  image?: string;
  name: string;
  city: string;
  quote: string;
  href?: string;
}

export default function PlanterCard({
  image,
  name,
  city,
  quote,
  href = "/plant",
}: PlanterCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {/* Photo */}
      <div className="relative h-56 bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={`${name}, church planter in ${city}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-navy/10 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-brand-navy/20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-brand-amber text-xs font-semibold uppercase tracking-wider mb-1">
          {city}
        </p>
        <h3 className="text-lg font-bold text-brand-navy tracking-tight mb-3">
          {name}
        </h3>
        <blockquote className="text-sm text-gray-600 leading-relaxed italic flex-1">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <Link
          href={href}
          className="mt-5 text-sm font-semibold text-brand-navy hover:text-brand-amber transition-colors"
        >
          Read their story &rarr;
        </Link>
      </div>
    </div>
  );
}
