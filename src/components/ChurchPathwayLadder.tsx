import Link from "next/link";

export default function ChurchPathwayLadder() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
          Church Engagement
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy mb-4">
          Where Does Your Church Fit?
        </h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed mb-8">
          Iowa churches are part of a national Send Network movement. Find your
          place and take your next step at Send Network.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="https://www.sendnetwork.com/send/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center px-7 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Explore Send Network
          </Link>
          <Link
            href="/events"
            className="focus-ring inline-flex items-center px-7 py-3 rounded-full border border-brand-navy text-brand-navy text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors"
          >
            Attend a Sending Lab
          </Link>
        </div>
      </div>
    </section>
  );
}
