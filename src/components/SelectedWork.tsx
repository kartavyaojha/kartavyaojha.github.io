'use client';

import React, { useMemo, useState } from 'react';
import { ProjectCategory, ProjectItem } from '@/data/portfolio';
import { usePortfolioData } from './PortfolioDataContext';
import { WaterPreviewCanvas } from './WaterPreviewCanvas';
import { CaseStudyDrawer } from './CaseStudyDrawer';
import { RollingText } from './RollingText';

export function SelectedWork() {
  const { data } = usePortfolioData();
  const allProjects = data.projects;
  const categories = data.categories;

  const [spotlightId, setSpotlightId] = useState<string>(allProjects[0]?.id ?? '');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [drawerProject, setDrawerProject] = useState<ProjectItem | null>(null);
  const [playgroundOpen, setPlaygroundOpen] = useState(false);

  const spotlightIndex = useMemo(() => {
    const idx = allProjects.findIndex((p) => p.id === spotlightId);
    return idx >= 0 ? idx : 0;
  }, [allProjects, spotlightId]);

  const spotlightProject = allProjects[spotlightIndex] ?? allProjects[0];

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { All: allProjects.length };
    categories.forEach((cat) => {
      if (cat !== 'All') map[cat] = 0;
    });
    allProjects.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, [allProjects, categories]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return allProjects;
    return allProjects.filter((p) => p.category === selectedCategory);
  }, [allProjects, selectedCategory]);

  const padTwo = (n: number) => String(n).padStart(2, '0');

  if (!spotlightProject) return null;

  return (
    <section
      id="work"
      className="mx-auto max-w-[1320px] px-5 py-[120px] sm:px-10 md:py-[152px]"
    >
      {/* Part A — Interactive Spotlight Viewer */}
      <div>
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          <span>Selected work</span>
          <span className="tabular-index text-[var(--ink)]">
            {padTwo(spotlightIndex + 1)} / {padTwo(allProjects.length)}
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              <span>{spotlightProject.roleBadge}</span>
              <span>·</span>
              <span>{spotlightProject.period}</span>
            </div>

            <h2 className="editorial-tracking font-serif text-4xl leading-[0.98] text-[var(--ink)] sm:text-5xl lg:text-6xl">
              <button
                type="button"
                onClick={() => setDrawerProject(spotlightProject)}
                className="rolling-trigger text-left"
              >
                <RollingText>{spotlightProject.title}</RollingText>
              </button>
            </h2>

            <p className="max-w-md text-base leading-relaxed text-[var(--ink-muted)]">
              {spotlightProject.summary}
            </p>

            <div>
              <button
                type="button"
                onClick={() => setDrawerProject(spotlightProject)}
                className="rolling-trigger inline-flex items-center gap-2 border-b border-[var(--border-strong)] pb-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                <RollingText>View case study →</RollingText>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              onDoubleClick={() => setDrawerProject(spotlightProject)}
              className="overflow-hidden"
            >
              <WaterPreviewCanvas
                variant={spotlightProject.previewVariant}
                imageUrl={spotlightProject.imageUrl}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              <span>Move over the picture to stir the water</span>
              <button
                type="button"
                onClick={() => setDrawerProject(spotlightProject)}
                className="underline decoration-[var(--border-strong)] underline-offset-4 hover:text-[var(--ink)]"
              >
                Open details
              </button>
            </div>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-6">
          {allProjects.map((project, idx) => {
            const active = project.id === spotlightProject.id;
            return (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => setSpotlightId(project.id)}
                  className={`group flex w-full items-baseline gap-2.5 border-t pt-3.5 text-left font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? 'border-[var(--ink)] text-[var(--ink)]'
                      : 'border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span className="tabular-index opacity-60">{padTwo(idx + 1)}</span>
                  <span className="truncate">{project.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Part B — Filterable Project Index */}
      <div className="mt-[120px] md:mt-[148px]">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
          <p className="max-w-xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            A focused index of security engineering tools, SOC simulations, published research, and
            technical mentorship built between 2024 and 2026.
          </p>

          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="tabular-index opacity-60">{categoryCounts[cat] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="divide-y divide-[var(--border)] border-b border-[var(--border)]">
          {filteredProjects.map((project, idx) => (
            <article
              key={project.id}
              onMouseEnter={() => setSpotlightId(project.id)}
              className="grid items-baseline gap-4 py-8 md:grid-cols-12 md:gap-8"
            >
              <div className="font-mono text-xs text-[var(--ink-muted)] tabular-index md:col-span-1">
                {project.index || padTwo(idx + 1)}
              </div>

              <div className="md:col-span-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="editorial-tracking font-serif text-2xl text-[var(--ink)] sm:text-3xl">
                    <button
                      type="button"
                      onClick={() => setDrawerProject(project)}
                      className="rolling-trigger text-left"
                    >
                      <RollingText>{project.title}</RollingText>
                    </button>
                  </h3>

                  {project.status && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--accent-champagne)' }}
                      />
                      {project.status}
                    </span>
                  )}
                </div>

                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                  {project.roleBadge}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[var(--ink-muted)] md:col-span-5 sm:text-base">
                {project.summary}
              </p>

              <div className="md:col-span-2 md:text-right">
                <button
                  type="button"
                  onClick={() => setDrawerProject(project)}
                  className="rolling-trigger inline-flex items-center border-b border-[var(--border-strong)] pb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                >
                  <RollingText>View case study →</RollingText>
                </button>
              </div>
            </article>
          ))}

          {/* Final Row: Playground */}
          <article
            id="playground"
            className="grid scroll-mt-24 items-baseline gap-4 py-8 md:grid-cols-12 md:gap-8"
          >
            <div className="font-mono text-xs text-[var(--ink-muted)] tabular-index md:col-span-1">
              {padTwo(allProjects.length + 1)}
            </div>

            <div className="md:col-span-4">
              <h3 className="editorial-tracking font-serif text-2xl text-[var(--ink)] sm:text-3xl">
                <button
                  type="button"
                  onClick={() => setPlaygroundOpen(true)}
                  className="rolling-trigger text-left"
                >
                  <RollingText>{data.playground.title}</RollingText>
                </button>
              </h3>
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                {data.playground.roleBadge}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[var(--ink-muted)] md:col-span-5 sm:text-base">
              {data.playground.summary}
            </p>

            <div className="md:col-span-2 md:text-right">
              <button
                type="button"
                onClick={() => setPlaygroundOpen(true)}
                className="rolling-trigger inline-flex items-center border-b border-[var(--border-strong)] pb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                <RollingText>Open the playground →</RollingText>
              </button>
            </div>
          </article>
        </div>
      </div>

      <CaseStudyDrawer
        project={drawerProject}
        playgroundOpen={playgroundOpen}
        onClose={() => {
          setDrawerProject(null);
          setPlaygroundOpen(false);
        }}
      />
    </section>
  );
}
