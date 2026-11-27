'use client';

import React, { useRef, useState } from 'react';
import { usePortfolioData } from './PortfolioDataContext';
import { FluidInkCanvas } from './InkCanvas';
import { useTheme } from './ThemeContext';
import { RollingText } from './RollingText';

export function ContactFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const { data } = usePortfolioData();
  const [copied, setCopied] = useState(false);
  const [stirSignal, setStirSignal] = useState(0);
  const { darkMode } = useTheme();
  const { profile } = data;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = profile.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative overflow-hidden border-t border-[var(--border)] px-5 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-14"
    >
      {/* Subtle interactive ink / champagne ripple canvas across the footer */}
      <FluidInkCanvas containerRef={footerRef} ambientCount={10} stirSignal={stirSignal} />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1320px] flex-col justify-between">
        {/* Top Row: Name on left, Back to top ↑ on right */}
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          <span className="text-[var(--ink)]">{profile.name}</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="rolling-trigger text-[var(--ink)]"
          >
            <RollingText>Back to top ↑</RollingText>
          </button>
        </div>

        {/* Centerpiece: Massive "Let's connect!" + Hairline Rows */}
        <div className="my-auto py-16">
          <h2 className="editorial-tracking font-serif text-[clamp(3.6rem,11vw,9.5rem)] leading-[0.88] text-[var(--ink)]">
            <span className="rolling-trigger inline-block cursor-default">
              <RollingText>Let&apos;s connect!</RollingText>
            </span>
          </h2>

          <div className="mt-12 max-w-2xl divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {/* Email Row */}
            <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                Email
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="truncate text-sm text-[var(--ink)] hover:underline sm:text-base"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="rolling-trigger rounded-full border border-[var(--border-strong)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                <RollingText>{copied ? 'Copied ✓' : 'Copy'}</RollingText>
              </button>
            </div>

            {/* LinkedIn Row */}
            <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                LinkedIn
              </span>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm text-[var(--ink)] hover:underline sm:text-base"
              >
                {profile.linkedinDisplay}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rolling-trigger rounded-full border border-[var(--border-strong)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                <RollingText>Open ↗</RollingText>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: City on left, "One more stir before you go?" in center, © 2026 on right */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)] sm:flex-row sm:items-center">
          <span>{profile.location}</span>

          <button
            type="button"
            onClick={() => setStirSignal((s) => s + 1)}
            className="text-[var(--ink)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--ink)]"
            style={{ color: darkMode ? '#D8B98A' : 'var(--ink)' }}
          >
            One more stir before you go?
          </button>

          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
