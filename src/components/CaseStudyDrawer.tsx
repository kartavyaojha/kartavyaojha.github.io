'use client';

import React, { useEffect } from 'react';
import { X, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ProjectItem, PlaygroundItem } from '@/data/portfolio';
import { usePortfolioData } from './PortfolioDataContext';
import { RollingText } from './RollingText';

interface CaseStudyDrawerProps {
  project: ProjectItem | null;
  playgroundOpen: boolean;
  onClose: () => void;
}

export function CaseStudyDrawer({
  project,
  playgroundOpen,
  onClose,
}: CaseStudyDrawerProps) {
  const { data } = usePortfolioData();
  const isOpen = Boolean(project) || playgroundOpen;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={project ? project.title : data.playground.title}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
      />

      {/* Slide-over Panel */}
      <aside
        className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-[var(--border)] p-6 sm:p-10"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            {project ? `Case Study · ${project.index}` : 'Playground · Labs & Writing'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rolling-trigger inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-3.5 py-1.5 font-mono text-xs text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            <RollingText>Close</RollingText>
            <X size={14} />
          </button>
        </div>

        {project ? (
          <div className="mt-8 flex-1 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--ink-muted)]">
                <span className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-[var(--ink)]">
                  {project.roleBadge}
                </span>
                <span>·</span>
                <span>{project.period}</span>
                <span>·</span>
                <span>{project.category}</span>
              </div>

              <h3 className="mt-4 font-serif text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
                {project.title}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)]">
                {project.summary}
              </p>
            </div>

            <div className="grid gap-6 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  Challenge
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                  {project.problem}
                </p>
              </div>
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  Approach
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
                  {project.solution}
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                Key Outcomes &amp; Impact
              </h4>
              <ul className="mt-3 space-y-2.5">
                {project.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: 'var(--accent)' }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                Tools &amp; Stack
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 font-mono text-xs text-[var(--ink)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
                {project.links.map((link) => (
                  <a
                    key={link.url + link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 flex-1 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-3 py-1 font-mono text-xs">
                <Sparkles size={12} style={{ color: 'var(--accent)' }} />
                <span>{data.playground.roleBadge}</span>
              </div>
              <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                {data.playground.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                {data.playground.summary}
              </p>
            </div>

            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {data.playground.items.map((item: PlaygroundItem) => (
                <article key={item.title} className="py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
                    <span>
                      {item.kind} · {item.platform}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="mt-2 font-serif text-2xl leading-snug text-[var(--ink)]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {item.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--border)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--ink-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rolling-trigger inline-flex items-center gap-1 font-mono text-xs font-medium text-[var(--ink)] underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--ink)]"
                      >
                        <RollingText>Open ↗</RollingText>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={data.profile.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
              >
                <span>Visit DefenceLogic Blog</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
