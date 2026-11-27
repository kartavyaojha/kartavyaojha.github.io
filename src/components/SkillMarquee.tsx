'use client';

import React from 'react';
import { usePortfolioData } from './PortfolioDataContext';
import { useTheme } from './ThemeContext';

export function SkillMarquee() {
  const { data } = usePortfolioData();
  const { motionEnabled } = useTheme();
  const items = data.skillsMarquee;

  const renderTrack = (prefix: string) => (
    <div className="flex shrink-0 items-center">
      {items.map((skill, idx) => (
        <span key={`${prefix}-${skill}-${idx}`} className="inline-flex items-center">
          <span className="px-5 font-serif text-3xl tracking-tight text-[var(--ink)] sm:px-7 sm:text-5xl">
            {skill}
          </span>
          <span
            aria-hidden="true"
            className="text-xs text-[var(--ink-muted)]"
          >
            ●
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Core cybersecurity and engineering skills"
      className="marquee-wrapper overflow-hidden border-y border-[var(--border)] py-6 sm:py-8"
    >
      <div
        className="marquee-track"
        style={{
          animationPlayState: motionEnabled ? 'running' : 'paused',
        }}
      >
        {renderTrack('a')}
        {renderTrack('b')}
      </div>
    </section>
  );
}
