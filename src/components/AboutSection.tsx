'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { useTheme } from './ThemeContext';
import { RollingText } from './RollingText';

function DarkroomPortrait() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { darkMode, motionEnabled } = useTheme();
  const [imgError, setImgError] = useState(false);
  const motionRef = useRef(motionEnabled);
  const darkRef = useRef(darkMode);
  const ripplesRef = useRef<{ x: number; y: number; r: number; maxR: number; a: number }[]>([]);

  useEffect(() => {
    motionRef.current = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    darkRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let rafId = 0;

    const paintUnderexposedVeil = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = 'source-over';
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.08, w * 0.5, h * 0.5, w * 0.9);
      if (darkRef.current) {
        grad.addColorStop(0, 'rgba(14, 13, 12, 0.55)');
        grad.addColorStop(0.55, 'rgba(14, 13, 12, 0.86)');
        grad.addColorStop(1, 'rgba(14, 13, 12, 0.96)');
      } else {
        grad.addColorStop(0, 'rgba(54, 46, 36, 0.48)');
        grad.addColorStop(0.55, 'rgba(34, 29, 23, 0.82)');
        grad.addColorStop(1, 'rgba(20, 20, 19, 0.94)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    };

    paintUnderexposedVeil();
    window.addEventListener('resize', paintUnderexposedVeil);

    const developAt = (x: number, y: number, r: number, strength: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${strength})`);
      g.addColorStop(0.55, `rgba(0,0,0,${strength * 0.55})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      developAt(x, y, 62, motionRef.current ? 0.2 : 0.45);
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      developAt(x, y, 92, 0.65);
      if (motionRef.current) {
        ripplesRef.current.push({ x, y, r: 10, maxR: 150, a: 0.5 });
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);

    const tick = () => {
      if (motionRef.current && ripplesRef.current.length > 0) {
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const item = ripplesRef.current[i];
          item.r += (item.maxR - item.r) * 0.08;
          item.a *= 0.92;
          developAt(item.x, item.y, item.r * 0.6, 0.06);
          if (item.a <= 0.03) ripplesRef.current.splice(i, 1);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', paintUnderexposedVeil);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
    };
  }, [darkMode]);

  return (
    <figure className="space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-[4/5] w-full cursor-crosshair overflow-hidden border border-[var(--border)] select-none"
      >
        {!imgError ? (
          <Image
            src={PORTFOLIO_DATA.profile.avatar}
            alt="Portrait of Kartavya Ojha"
            fill
            sizes="(max-width: 1024px) 100vw, 460px"
            onError={() => setImgError(true)}
            className="object-cover grayscale contrast-110"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#1A1815] text-[#F4EFE6]">
            <span className="font-serif text-7xl italic text-[#D8B98A]">KO</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          aria-label="Interactive darkroom developing tray"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        Stir the tray. It develops again.
      </figcaption>
    </figure>
  );
}

export function AboutSection() {
  const { profile, about } = PORTFOLIO_DATA;

  return (
    <section
      id="about"
      className="mx-auto max-w-[1320px] px-5 py-[120px] sm:px-10 md:py-[156px]"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        About
      </p>

      <h2 className="editorial-tracking mt-4 font-serif text-[clamp(3.2rem,8vw,7.4rem)] leading-[0.94] text-[var(--ink)]">
        Hi, I&apos;m <span className="italic">{profile.firstName}.</span>
      </h2>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Darkroom Developing Portrait */}
        <div className="lg:col-span-5">
          <DarkroomPortrait />
        </div>

        {/* Right Column: Background story, stack, certifications, hobbies, RollingText links */}
        <div className="flex flex-col justify-between space-y-10 lg:col-span-7">
          <div className="space-y-5 text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* Technical Stack */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              Technical Stack
            </h3>
            <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--ink)] sm:text-sm">
              {about.stack.join(' · ')}
            </p>
          </div>

          {/* Certifications & Recognition (pure hairline list) */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              Certifications &amp; Recognition
            </h3>
            <ul className="mt-3 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {about.certifications.map((cert) => (
                <li key={cert.title}>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rolling-trigger flex items-center justify-between gap-4 py-3 text-sm text-[var(--ink)]"
                  >
                    <RollingText>{cert.title}</RollingText>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                      {cert.issuer} · {cert.year} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[11px] text-[var(--ink-muted)]">
              {about.awards.join('  ·  ')}
            </p>
          </div>

          {/* Casual Hobbies */}
          <p className="border-t border-[var(--border)] pt-6 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
            {about.hobbiesLine}
          </p>

          {/* Direct Links with RollingText */}
          <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink)]">
            <a
              href={`mailto:${profile.email}`}
              className="rolling-trigger border-b border-[var(--border-strong)] pb-1 hover:border-[var(--ink)]"
            >
              <RollingText>Email ↗</RollingText>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rolling-trigger border-b border-[var(--border-strong)] pb-1 hover:border-[var(--ink)]"
            >
              <RollingText>LinkedIn ↗</RollingText>
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rolling-trigger border-b border-[var(--border-strong)] pb-1 hover:border-[var(--ink)]"
            >
              <RollingText>GitHub ↗</RollingText>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
