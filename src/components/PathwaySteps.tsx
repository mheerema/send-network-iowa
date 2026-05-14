"use client";

import { useState } from "react";

interface Step {
  letter: string;
  title: string;
  description: string;
  detail: string;
}

const steps: Step[] = [
  {
    letter: "P",
    title: "Prepare",
    description: "Lay the personal and spiritual foundation for planting.",
    detail:
      "Before you plant a church, we help you examine your calling, your character, and your context. This stage involves prayer, self-assessment, and conversations with your home church and network leaders to confirm whether church planting is your next step.",
  },
  {
    letter: "A",
    title: "Assess",
    description: "Evaluate your gifting, health, and readiness objectively.",
    detail:
      "Send Network's assessment process includes psychological evaluations, spiritual gift inventories, and in-person interviews. The goal is not to filter people out but to place every planter on the right path — whether that is lead planting, team planting, or another form of ministry multiplication.",
  },
  {
    letter: "C",
    title: "Care",
    description: "Receive ongoing coaching and community throughout the journey.",
    detail:
      "Planting is hard. Send Network Iowa matches every planter with an experienced coach for regular one-on-one support. You will also connect with a cohort of other Iowa planters so you are never doing this alone. Care is not a stage you pass through — it continues through launch and beyond.",
  },
  {
    letter: "E",
    title: "Equip",
    description: "Train in the skills and strategies that healthy churches require.",
    detail:
      "Through Sending Labs, regional intensives, and Send Network's online training library, you will develop competency in disciple-making, team building, generosity culture, and contextualized ministry. Send Network Iowa adapts national training resources specifically to Iowa's urban, suburban, and rural contexts.",
  },
];

export default function PathwaySteps() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            The Planter Pathway
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy">
            The PACE Framework
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
            Every Send Network Iowa planter moves through four stages. Each step builds on the
            last. Click any stage to learn more.
          </p>
        </div>

        {/* Step indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <button
                key={step.letter}
                onClick={() => setActiveStep(isActive ? null : index)}
                className={`text-left rounded-2xl p-6 border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber ${
                  isActive
                    ? "border-brand-amber bg-brand-amber/5"
                    : "border-gray-100 bg-white hover:border-brand-amber/40"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold mb-4 ${
                    isActive
                      ? "bg-brand-amber text-white"
                      : "bg-brand-navy/10 text-brand-navy"
                  }`}
                >
                  {step.letter}
                </span>
                <h3 className="font-bold text-brand-navy tracking-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        {activeStep !== null && (
          <div className="mt-6 bg-brand-navy/5 rounded-2xl p-8 border border-brand-navy/10">
            <h4 className="font-bold text-brand-navy text-lg mb-2 tracking-tight">
              {steps[activeStep].letter} — {steps[activeStep].title}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">
              {steps[activeStep].detail}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
