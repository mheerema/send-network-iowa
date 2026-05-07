"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    src: "/images/stock/hero-church-welcome.jpg",
    alt: "A welcoming church community greeting newcomers",
    credit: "Kristina Paparo / Unsplash",
  },
  {
    src: "/images/stock/hero-community-gather.jpg",
    alt: "Community gathering outdoors",
    credit: "Priscilla Du Preez / Unsplash",
  },
  {
    src: "/images/stock/hero-worship.jpg",
    alt: "Small congregation in worship",
    credit: "Elianna Gill / Unsplash",
  },
  {
    src: "/images/stock/hero-chapel-interior.jpg",
    alt: "Small chapel interior with congregation",
    credit: "Josh Applegate / Unsplash",
  },
  {
    src: "/images/stock/hero-small-group.jpg",
    alt: "Small group community connection",
    credit: "Unsplash",
  },
];

export default function HeroPathwaySplit() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background slideshow */}
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          className={`object-cover object-center absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
          sizes="100vw"
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-navy/70" />

      {/* Photo credit */}
      <p className="absolute bottom-2 right-3 z-10 text-white/30 text-[10px]">
        {slides[activeIndex].credit}
      </p>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        {/* Headline */}
        <div className="text-center mb-16">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
            Send Network Iowa
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Every Church Can Help
            <br />
            Plant Churches
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            You are part of a larger kingdom movement, and your church can make
            an impact beyond your neighborhood. Whether you are new to church
            planting or have planted dozens of churches, we want to help.
          </p>
        </div>

        {/* Dual pathway cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Planter card */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-brand-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-navy tracking-tight">
              Considering planting?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed flex-1">
              We walk with you from initial calling through assessment, training,
              coaching, and launch. Iowa needs you.
            </p>
            <Link
              href="/plant"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Learn about planting
            </Link>
          </div>

          {/* Sending church card */}
          <div className="bg-brand-amber/10 border border-brand-amber/30 rounded-2xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-amber/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-brand-amber"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-navy tracking-tight">
              Want to support planting?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed flex-1">
              Your church can pray, give, and send. Four tiers of partnership,
              designed for churches of any size.
            </p>
            <Link
              href="/partner"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
