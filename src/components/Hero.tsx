'use client';

import React, { useRef } from 'react';
import { sanitizeUrl } from '@/data/portfolio';
import { usePortfolioData } from './PortfolioDataContext';
import { FluidInkCanvas } from './InkCanvas';
import { useTheme } from './ThemeContext';
import { RollingText } from './RollingText';
import { RotatingHeroTitle } from './RotatingHeroTitle';

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { data } = usePortfolioData();
  const { darkMode, motionEnabled } = useTheme();
  const { profile, heroTitles, resumeUrl } = data;
  const safeResumeHref = sanitizeUrl(resumeUrl, '');

  return (
    <>
      <section
        id="top"
        ref={sectionRef}
        className="relative flex h-[100svh] min-h-[560px] flex-col justify-between overflow-hidden px-[clamp(20px,4vw,56px)] pb-[clamp(20px,3vw,40px)] pt-[clamp(18px,3vw,40px)]"
      >
        <h1 className="sr-only">
          {profile.name}, {profile.currentFocus} in {profile.location}
        </h1>

        <FluidInkCanvas containerRef={sectionRef} ambientCount={3800} />

        <div className="h-14" aria-hidden="true" />

        <RotatingHeroTitle motionEnabled={motionEnabled} titles={heroTitles} />

        <div className="relative z-10 flex items-end justify-between gap-4 text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--ink)] sm:text-[12px]">
          <div className="leading-[1.65]">
            <div>{profile.currentFocus}</div>
            <div>{profile.location}</div>

            {safeResumeHref && (
              <div className="mt-3.5">
                <a
                  href={safeResumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-glass-pill font-sans text-[11px] uppercase tracking-[0.14em] sm:text-[12px]"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#D8B98A]"
                  />
                  <span>Resume</span>
                  <span aria-hidden="true" className="resume-arrow">
                    ↗
                  </span>
                </a>
              </div>
            )}
          </div>

          <div className="hidden text-center text-[12px] normal-case tracking-normal text-[var(--ink-muted)] md:block">
            {darkMode
              ? 'Move to stir the champagne. Click to drop more.'
              : 'Move to stir the ink. Click to drop more.'}
          </div>

          <a
            href="#intro"
            className="rolling-trigger inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] text-[var(--ink)] sm:text-[12px]"
          >
            <RollingText>Scroll</RollingText>
            <svg
              viewBox="0 0 14 14"
              aria-hidden="true"
              className="scroll-nudge h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]"
            >
              <path d="M7 1v12M2 8l5 5 5-5" />
            </svg>
          </a>
        </div>
      </section>

      <section
        id="intro"
        aria-label="Introduction"
        className="mx-auto max-w-[1320px] border-t border-[var(--border)] px-5 py-[110px] sm:px-10 md:py-[148px]"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="editorial-tracking font-serif text-[clamp(1.85rem,3.4vw,3.15rem)] leading-[1.2] text-[var(--ink)]">
            {profile.heroIntro}
          </p>
        </div>
      </section>
    </>
  );
}
