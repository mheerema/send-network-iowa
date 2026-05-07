import Link from "next/link";

interface CTA {
  text: string;
  href: string;
}

interface Level {
  id: string;
  label: string;
  verb: string;
  body: string;
  ctas: CTA[];
}

const levels: Level[] = [
  {
    id: "cooperating",
    label: "Cooperating Church",
    verb: "Pray and Give",
    body: "Fuel church planting in Iowa by praying for planters and giving through the Cooperative Program and Annie Armstrong Easter Offering.",
    ctas: [
      { text: "Pray for Iowa Planters", href: "/iowa" },
      { text: "Learn about giving", href: "/partner" },
    ],
  },
  {
    id: "supporting",
    label: "Supporting Church",
    verb: "Partner",
    body: "Partner with an Iowa church plant by praying, participating, and providing for their practical needs.",
    ctas: [
      { text: "Find a plant to support", href: "/partner" },
      { text: "Talk to someone", href: "/contact" },
    ],
  },
  {
    id: "sending",
    label: "Sending Church",
    verb: "Send",
    body: "Take responsibility for an Iowa church plant by walking with a planter through preparation, coaching, and launch.",
    ctas: [
      { text: "Attend a Sending Lab", href: "/events" },
      { text: "Learn about sending", href: "/partner" },
    ],
  },
  {
    id: "multiplying",
    label: "Multiplying Church",
    verb: "Develop and Send",
    body: "Develop church planters from within your congregation and send them to Iowa's unreached communities.",
    ctas: [{ text: "Talk to someone", href: "/contact" }],
  },
  {
    id: "movement",
    label: "Movement Church",
    verb: "Multiply and Catalyze",
    body: "Radically multiply and catalyze other Iowa churches to plant churches — until there is a healthy, multiplying church in every Iowa community.",
    ctas: [{ text: "Talk to someone", href: "/contact" }],
  },
];

export default function ChurchPathwayLadder() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Church Engagement
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy">
            Where Does Your Church Fit?
          </h2>
          <p className="mt-4 text-gray-600 text-sm">
            Every church has a role. Find yours.
          </p>
        </div>

        {/* Ladder cards */}
        <div className="flex flex-col gap-0">
          {levels.map((level, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={level.id}
                className={`${isEven ? "bg-gray-50" : "bg-white"} border border-gray-100 first:rounded-t-2xl last:rounded-b-2xl px-6 py-8 lg:px-10`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: step number + identity */}
                  <div className="lg:w-56 shrink-0 flex flex-col gap-2">
                    <span className="text-5xl font-bold text-gray-200 leading-none select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-bold text-brand-navy leading-snug">
                      {level.label}
                    </p>
                    <span className="inline-block w-fit bg-brand-amber/10 text-brand-amber text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                      {level.verb}
                    </span>
                  </div>

                  {/* Right: body + CTAs */}
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {level.body}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {level.ctas.map((cta) => (
                        <Link
                          key={cta.href + cta.text}
                          href={cta.href}
                          className="inline-flex items-center px-4 py-2 rounded-lg border border-brand-navy text-brand-navy text-xs font-semibold hover:bg-brand-navy hover:text-white transition-colors"
                        >
                          {cta.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
