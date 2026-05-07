interface Stat {
  value: string;
  label: string;
  context: string;
}

const stats: Stat[] = [
  {
    value: "3.2M",
    label: "Iowans",
    context:
      "A state that is largely overlooked by church planting efforts despite significant population.",
  },
  {
    value: "930+",
    label: "Communities without a church",
    context:
      "More than half of Iowa's incorporated towns have no evangelical congregation.",
  },
  {
    value: "1:2,800",
    label: "Church-to-resident ratio",
    context:
      "Iowa's SBC church planting rate lags far behind the national average.",
  },
  {
    value: "77%",
    label: "Counties considered unreached",
    context:
      "The evangelical presence in rural Iowa is thin and declining without new church plants.",
  },
];

export default function OpportunityStats() {
  return (
    <section className="bg-brand-navy py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            The Iowa Opportunity
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The numbers tell the story
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-6xl font-bold text-brand-amber leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                {stat.label}
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                {stat.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
