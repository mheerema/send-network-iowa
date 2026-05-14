import Link from "next/link";

interface TalkCTAProps {
  variant?: "sticky" | "inline";
}

export default function TalkCTA({ variant = "inline" }: TalkCTAProps) {
  if (variant === "sticky") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-700 font-medium">
          Not sure where to start?
        </p>
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center px-5 py-2.5 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Talk to someone
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-brand-amber/10 border-y border-brand-amber/20 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-brand-navy tracking-tight">
            Not sure where to start?
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Talk to someone on the Send Network Iowa team. No pressure, no forms. Just a
            conversation.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center px-7 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Talk to someone
        </Link>
      </div>
    </section>
  );
}
