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
    src: "/images/stock/hero-baptism.jpg",
    alt: "Community baptism gathering outdoors",
    credit: "AMONWAT DUMKRUT / Unsplash",
  },
  {
    src: "/images/stock/hero-worship.jpg",
    alt: "Small congregation in worship",
    credit: "Elianna Gill / Unsplash",
  },
  {
    src: "/images/stock/hero-potluck.jpg",
    alt: "Church community sharing a fellowship meal",
    credit: "DJ Paine / Unsplash",
  },
  {
    src: "/images/stock/hero-community-gather.jpg",
    alt: "Community gathering outdoors",
    credit: "Priscilla Du Preez / Unsplash",
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

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://www.sendnetwork.com/plant/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Planters Start Here
          </Link>
          <Link
            href="https://www.sendnetwork.com/send/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Churches Start Here
          </Link>
        </div>
      </div>
    </section>
  );
}
