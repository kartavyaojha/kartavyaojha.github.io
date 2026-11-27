'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { useTheme } from './ThemeContext';
import { RollingText } from './RollingText';

const NAV_ITEMS = [
  { index: '01', label: 'Work', href: '#work' },
  { index: '02', label: 'About', href: '#about' },
  { index: '03', label: 'Playground', href: '#playground' },
  { index: '04', label: 'Contact', href: '#contact' },
];

export function Header() {
  const { darkMode, motionEnabled, toggleDarkMode, toggleMotion } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.65);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setDockOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Transparent editorial top header sitting cleanly over the hero canvas */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-[clamp(20px,4vw,56px)] pt-[clamp(18px,3vw,40px)]">
        <div className="flex items-start justify-between">
          {/* Left: Stacked 2-line uppercase name */}
          <a
            href="#top"
            className="pointer-events-auto rolling-trigger inline-flex flex-col text-[clamp(17px,1.45vw,22px)] font-normal uppercase leading-[1.12] tracking-[0.02em] text-[var(--ink)]"
          >
            <RollingText>{PORTFOLIO_DATA.profile.firstName}</RollingText>
            <RollingText>Ojha</RollingText>
          </a>

          {/* Right: Desktop uppercase nav links + Motion switch */}
          <nav
            aria-label="Primary"
            className="pointer-events-auto hidden items-center gap-[clamp(20px,2.5vw,40px)] text-[13px] font-normal uppercase tracking-[0.12em] text-[var(--ink)] md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rolling-trigger inline-flex min-h-[44px] items-center"
              >
                <RollingText>{item.label}</RollingText>
              </a>
            ))}

            <button
              type="button"
              onClick={toggleMotion}
              aria-pressed={motionEnabled}
              aria-label={motionEnabled ? 'Pause motion animations' : 'Enable motion animations'}
              className="rolling-trigger inline-flex min-h-[44px] items-center gap-2.5 uppercase tracking-[0.12em]"
            >
              <RollingText>Motion</RollingText>
              <span
                aria-hidden="true"
                className="relative inline-block h-[16px] w-[30px] rounded-full border border-current"
              >
                <span
                  className={`absolute top-[2px] h-[10px] w-[10px] rounded-full bg-current transition-transform duration-300 ${
                    motionEnabled ? 'left-[16px]' : 'left-[2px] opacity-45'
                  }`}
                />
              </span>
            </button>
          </nav>

          {/* Mobile two-line bars button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="pointer-events-auto relative h-11 w-12 md:hidden"
          >
            <span className="absolute left-1 right-1 top-[14px] h-[1.5px] bg-[var(--ink)]" />
            <span className="absolute left-1 right-1 top-[26px] h-[1.5px] bg-[var(--ink)]" />
          </button>
        </div>
      </header>

      {/* Floating frosted "Menu" pill after scrolling past the hero */}
      <div
        className={`fixed right-[clamp(20px,4vw,56px)] top-[clamp(14px,2.2vw,28px)] z-40 hidden items-center rounded-full border px-5 py-2.5 backdrop-blur-xl transition-all duration-500 md:flex ${
          scrolledPastHero
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-8 opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: darkMode ? 'rgba(22, 21, 19, 0.72)' : 'rgba(246, 243, 236, 0.75)',
          borderColor: 'var(--border-strong)',
        }}
      >
        {dockOpen && (
          <nav
            aria-label="Floating navigation"
            className="mr-6 flex items-center gap-6 text-[12px] uppercase tracking-[0.12em] text-[var(--ink)]"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setDockOpen(false)}
                className="rolling-trigger"
              >
                <RollingText>{item.label}</RollingText>
              </a>
            ))}
            <button
              type="button"
              onClick={toggleMotion}
              className="rolling-trigger uppercase tracking-[0.12em] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              <RollingText>{motionEnabled ? 'Motion: On' : 'Motion: Off'}</RollingText>
            </button>
          </nav>
        )}

        <button
          type="button"
          onClick={() => setDockOpen((v) => !v)}
          aria-expanded={dockOpen}
          className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.12em] text-[var(--ink)]"
        >
          <span>{dockOpen ? 'Close' : 'Menu'}</span>
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 right-0 h-[1px] bg-current transition-all duration-300 ${
                dockOpen ? 'top-[5.5px] rotate-[22deg]' : 'top-[2px]'
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1px] bg-current transition-all duration-300 ${
                dockOpen ? 'top-[5.5px] -rotate-[22deg]' : 'top-[9px]'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Editorial Mobile Full-Screen Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto px-6 py-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{ backgroundColor: 'var(--bg)' }}
        >
          <div className="flex items-start justify-between">
            <a
              href="#top"
              onClick={() => setMobileOpen(false)}
              className="inline-flex flex-col text-lg font-normal uppercase leading-[1.12] tracking-[0.02em] text-[var(--ink)]"
            >
              <span>{PORTFOLIO_DATA.profile.firstName}</span>
              <span>Ojha</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center text-[var(--ink)]"
            >
              <X size={20} />
            </button>
          </div>

          <nav aria-label="Site" className="my-auto py-8">
            <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rolling-trigger flex items-baseline gap-5 py-4 text-[clamp(30px,8vw,48px)] uppercase leading-[1.1] text-[var(--ink)]"
                  >
                    <span className="font-mono text-xs text-[var(--ink-muted)] tabular-index">
                      {item.index}
                    </span>
                    <RollingText>{item.label}</RollingText>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-6 border-t border-[var(--border)] pt-6">
            <div className="flex flex-wrap gap-6 text-sm text-[var(--ink-muted)]">
              <button
                type="button"
                onClick={toggleMotion}
                aria-pressed={motionEnabled}
                className="inline-flex items-center gap-3 text-[var(--ink)]"
              >
                <span className="relative h-5 w-9 rounded-full border border-current">
                  <span
                    className={`absolute top-[3px] h-3 w-3 rounded-full bg-current transition-transform ${
                      motionEnabled ? 'left-[19px]' : 'left-[3px] opacity-40'
                    }`}
                  />
                </span>
                <span>Animations</span>
              </button>

              <button
                type="button"
                onClick={toggleDarkMode}
                aria-pressed={darkMode}
                className="inline-flex items-center gap-3 text-[var(--ink)]"
              >
                <span className="relative h-5 w-9 rounded-full border border-current">
                  <span
                    className={`absolute top-[3px] h-3 w-3 rounded-full bg-current transition-transform ${
                      darkMode ? 'left-[19px]' : 'left-[3px] opacity-40'
                    }`}
                  />
                </span>
                <span>{darkMode ? 'Back to paper' : 'Add some sparkle'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                className="rolling-trigger rounded-full border border-[var(--border-strong)] px-4 py-2 text-[var(--ink)]"
              >
                <RollingText>Email ↗</RollingText>
              </a>
              <a
                href={PORTFOLIO_DATA.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rolling-trigger rounded-full border border-[var(--border-strong)] px-4 py-2 text-[var(--ink)]"
              >
                <RollingText>LinkedIn ↗</RollingText>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
