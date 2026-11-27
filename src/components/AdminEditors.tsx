'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  PortfolioData,
  PreviewVariant,
  ProjectCategory,
  ProjectItem,
  sanitizeUrl,
} from '@/data/portfolio';

const inputCls =
  'w-full rounded-lg border border-[rgba(244,239,230,0.14)] bg-[#0E0D0C] px-3.5 py-2.5 text-sm text-[#F4EFE6] placeholder-[#7C776E] focus:border-[#D8B98A] focus:outline-none';
const labelCls =
  'mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-[#9E988E]';
const cardCls =
  'rounded-xl border border-[rgba(244,239,230,0.10)] bg-[#161615] p-5 sm:p-6';

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function HeroTitlesEditor({
  data,
  onChange,
}: {
  data: PortfolioData;
  onChange: (next: PortfolioData) => void;
}) {
  const { profile, heroTitles } = data;

  const updateProfile = (patch: Partial<PortfolioData['profile']>) => {
    onChange({
      ...data,
      profile: {
        ...profile,
        ...patch,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className={cardCls}>
        <h2 className="text-lg font-medium text-[#F4EFE6]">Hero Identity &amp; Intro</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                updateProfile({
                  firstName: e.target.value,
                  name: `${e.target.value} ${profile.lastName}`.trim(),
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                updateProfile({
                  lastName: e.target.value,
                  name: `${profile.firstName} ${e.target.value}`.trim(),
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Current Role / Focus (Bottom-Left)</label>
            <input
              type="text"
              value={profile.currentFocus}
              onChange={(e) => updateProfile({ currentFocus: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateProfile({ location: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Resume PDF URL</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                value={data.resumeUrl}
                placeholder="https://drive.google.com/file/d/.../view"
                onChange={(e) => {
                  const resumeUrl = e.target.value;
                  onChange({
                    ...data,
                    resumeUrl,
                    profile: { ...profile, resume: resumeUrl },
                  });
                }}
                className={inputCls}
              />
              {sanitizeUrl(data.resumeUrl, '') ? (
                <a
                  href={sanitizeUrl(data.resumeUrl, '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#D8B98A]/45 bg-[#D8B98A]/10 px-4 py-2.5 font-mono text-xs text-[#D8B98A] transition-colors hover:bg-[#D8B98A]/20"
                >
                  <span>Test Link</span>
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <span className="inline-flex shrink-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-[rgba(244,239,230,0.08)] px-4 py-2.5 font-mono text-xs text-[#7C776E]">
                  <span>Test Link ↗</span>
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-[#9E988E]">
              Leave empty to hide the RESUME ↗ link on your Hero automatically.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Intro Statement (Shown Below Hero)</label>
            <textarea
              rows={3}
              value={profile.heroIntro}
              onChange={(e) => updateProfile({ heroIntro: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className={cardCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-[#F4EFE6]">Rotating Hero Titles</h2>
            <p className="mt-1 text-xs text-[#9E988E]">
              Two-line asymmetric uppercase titles displayed across the full-bleed Hero canvas.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                heroTitles: [
                  ...heroTitles,
                  { line1: 'NEW', line2: 'ROLE', full: 'NEW ROLE' },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8B98A]/40 bg-[#D8B98A]/10 px-3 py-1.5 font-mono text-xs text-[#D8B98A] hover:bg-[#D8B98A]/20"
          >
            <Plus size={14} />
            <span>Add Title</span>
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {heroTitles.map((item, idx) => (
            <div
              key={idx}
              className="grid items-center gap-3 rounded-lg border border-[rgba(244,239,230,0.10)] bg-[#0E0D0C] p-3.5 sm:grid-cols-12"
            >
              <div className="font-mono text-xs text-[#9E988E] sm:col-span-1">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={item.line1}
                  placeholder="Line 1 (Left)"
                  onChange={(e) => {
                    const next = [...heroTitles];
                    const line1 = e.target.value.toUpperCase();
                    next[idx] = {
                      ...item,
                      line1,
                      full: `${line1} ${item.line2}`.trim(),
                    };
                    onChange({ ...data, heroTitles: next });
                  }}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={item.line2}
                  placeholder="Line 2 (Right)"
                  onChange={(e) => {
                    const next = [...heroTitles];
                    const line2 = e.target.value.toUpperCase();
                    next[idx] = {
                      ...item,
                      line2,
                      full: `${item.line1} ${line2}`.trim(),
                    };
                    onChange({ ...data, heroTitles: next });
                  }}
                  className={inputCls}
                />
              </div>
              <div className="flex items-center justify-end gap-1.5 sm:col-span-3">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() =>
                    onChange({ ...data, heroTitles: moveItem(heroTitles, idx, idx - 1) })
                  }
                  aria-label="Move up"
                  className="rounded-md border border-[rgba(244,239,230,0.12)] p-2 text-[#9E988E] hover:text-[#F4EFE6] disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === heroTitles.length - 1}
                  onClick={() =>
                    onChange({ ...data, heroTitles: moveItem(heroTitles, idx, idx + 1) })
                  }
                  aria-label="Move down"
                  className="rounded-md border border-[rgba(244,239,230,0.12)] p-2 text-[#9E988E] hover:text-[#F4EFE6] disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  disabled={heroTitles.length <= 1}
                  onClick={() =>
                    onChange({
                      ...data,
                      heroTitles: heroTitles.filter((_, i) => i !== idx),
                    })
                  }
                  aria-label="Delete title"
                  className="rounded-md border border-red-400/25 p-2 text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PROJECT_CATEGORIES: Exclude<ProjectCategory, 'All'>[] = [
  'SOC & Detection',
  'AppSec & Pentesting',
  'Security Research',
  'Mentorship & Leadership',
];

const PREVIEW_VARIANTS: PreviewVariant[] = [
  'soc-simlab',
  'appsec-suite',
  'vaf-guardian',
  'research-paper',
  'acs-outreach',
];

export function ProjectsEditor({
  data,
  onChange,
}: {
  data: PortfolioData;
  onChange: (next: PortfolioData) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const projects = data.projects;
  const activeProject = projects[selectedIdx] ?? projects[0];

  const reindex = (list: ProjectItem[]): ProjectItem[] =>
    list.map((p, i) => ({ ...p, index: String(i + 1).padStart(2, '0') }));

  const updateProject = (idx: number, patch: Partial<ProjectItem>) => {
    const next = [...projects];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...data, projects: next });
  };

  const handleAddProject = () => {
    const newItem: ProjectItem = {
      id: `project-${Date.now()}`,
      index: String(projects.length + 1).padStart(2, '0'),
      title: 'New Security Project',
      status: 'In progress',
      roleBadge: 'Security Engineer',
      organization: 'Independent',
      period: '2026',
      category: 'SOC & Detection',
      summary: 'Brief 1–2 sentence impact summary.',
      problem: 'Describe the core security problem solved.',
      solution: 'Describe the architecture and implementation.',
      outcomes: ['Quantifiable outcome or milestone.'],
      stack: ['Python', 'Splunk'],
      previewVariant: 'soc-simlab',
      imageUrl: '',
      links: [{ label: 'GitHub Repository', url: 'https://github.com/kartavyaojha' }],
    };
    const next = reindex([...projects, newItem]);
    onChange({ ...data, projects: next });
    setSelectedIdx(next.length - 1);
  };

  const handleDelete = (idx: number) => {
    const next = reindex(projects.filter((_, i) => i !== idx));
    onChange({ ...data, projects: next });
    setConfirmDeleteIdx(null);
    setSelectedIdx(Math.max(0, Math.min(selectedIdx, next.length - 1)));
  };

  return (
    <div className="space-y-6">
      <div className={cardCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-[#F4EFE6]">Projects &amp; Case Studies</h2>
            <p className="mt-1 text-xs text-[#9E988E]">
              Reorder items (01–0{Math.max(5, projects.length)}), edit details, or add new case
              studies.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8B98A]/40 bg-[#D8B98A]/10 px-3.5 py-2 font-mono text-xs text-[#D8B98A] hover:bg-[#D8B98A]/20"
          >
            <Plus size={14} />
            <span>Add Project</span>
          </button>
        </div>

        {/* Project selector list */}
        <div className="mt-5 space-y-2">
          {projects.map((p, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <div
                key={p.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${
                  isSelected
                    ? 'border-[#D8B98A]/60 bg-[#0E0D0C]'
                    : 'border-[rgba(244,239,230,0.08)] bg-[#0E0D0C]/50 hover:border-[rgba(244,239,230,0.2)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="font-mono text-xs text-[#D8B98A]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium text-[#F4EFE6]">{p.title}</span>
                  <span className="hidden rounded-full border border-[rgba(244,239,230,0.12)] px-2.5 py-0.5 font-mono text-[10px] text-[#9E988E] sm:inline">
                    {p.category}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      onChange({
                        ...data,
                        projects: reindex(moveItem(projects, idx, idx - 1)),
                      });
                      setSelectedIdx(idx - 1);
                    }}
                    aria-label="Move project up"
                    className="rounded border border-[rgba(244,239,230,0.12)] p-1.5 text-[#9E988E] hover:text-[#F4EFE6] disabled:opacity-30"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => {
                      onChange({
                        ...data,
                        projects: reindex(moveItem(projects, idx, idx + 1)),
                      });
                      setSelectedIdx(idx + 1);
                    }}
                    aria-label="Move project down"
                    className="rounded border border-[rgba(244,239,230,0.12)] p-1.5 text-[#9E988E] hover:text-[#F4EFE6] disabled:opacity-30"
                  >
                    <ArrowDown size={13} />
                  </button>

                  {confirmDeleteIdx === idx ? (
                    <div className="flex items-center gap-1.5 pl-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="rounded bg-red-500/20 px-2.5 py-1 font-mono text-[11px] text-red-300 hover:bg-red-500/30"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteIdx(null)}
                        className="rounded px-2 py-1 font-mono text-[11px] text-[#9E988E] hover:text-[#F4EFE6]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={projects.length <= 1}
                      onClick={() => setConfirmDeleteIdx(idx)}
                      aria-label="Delete project"
                      className="rounded border border-red-400/25 p-1.5 text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Project Editor */}
      {activeProject && (
        <div className={cardCls}>
          <div className="flex items-center justify-between border-b border-[rgba(244,239,230,0.1)] pb-4">
            <h3 className="text-base font-medium text-[#F4EFE6]">
              Editing #{String(selectedIdx + 1).padStart(2, '0')} — {activeProject.title}
            </h3>
            <span className="font-mono text-xs text-[#D8B98A]">{activeProject.id}</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Project Title</label>
              <input
                type="text"
                value={activeProject.title}
                onChange={(e) => updateProject(selectedIdx, { title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status Pill (optional, e.g. In progress)</label>
              <input
                type="text"
                value={activeProject.status ?? ''}
                placeholder="Leave empty for no pill"
                onChange={(e) =>
                  updateProject(selectedIdx, { status: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Role Badge</label>
              <input
                type="text"
                value={activeProject.roleBadge}
                onChange={(e) => updateProject(selectedIdx, { roleBadge: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <input
                type="text"
                value={activeProject.period}
                onChange={(e) => updateProject(selectedIdx, { period: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={activeProject.category}
                onChange={(e) =>
                  updateProject(selectedIdx, {
                    category: e.target.value as Exclude<ProjectCategory, 'All'>,
                  })
                }
                className={inputCls}
              >
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Fallback Graphic Style</label>
              <select
                value={activeProject.previewVariant}
                onChange={(e) =>
                  updateProject(selectedIdx, {
                    previewVariant: e.target.value as PreviewVariant,
                  })
                }
                className={inputCls}
              >
                {PREVIEW_VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Preview Image URL (optional, overrides graphic)</label>
              <input
                type="url"
                value={activeProject.imageUrl ?? ''}
                placeholder="https://... or /images/..."
                onChange={(e) => updateProject(selectedIdx, { imageUrl: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Impact Summary (1–2 sentences)</label>
              <textarea
                rows={2}
                value={activeProject.summary}
                onChange={(e) => updateProject(selectedIdx, { summary: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Case Study — Challenge</label>
              <textarea
                rows={3}
                value={activeProject.problem}
                onChange={(e) => updateProject(selectedIdx, { problem: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Case Study — Approach</label>
              <textarea
                rows={3}
                value={activeProject.solution}
                onChange={(e) => updateProject(selectedIdx, { solution: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Key Outcomes (one per line)</label>
              <textarea
                rows={3}
                value={activeProject.outcomes.join('\n')}
                onChange={(e) =>
                  updateProject(selectedIdx, {
                    outcomes: e.target.value.split('\n').filter((line) => line.trim() !== ''),
                  })
                }
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Tech Stack Tags (comma-separated)</label>
              <input
                type="text"
                value={activeProject.stack.join(', ')}
                onChange={(e) =>
                  updateProject(selectedIdx, {
                    stack: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className={labelCls + ' mb-0'}>External / GitHub / Live Links</label>
                <button
                  type="button"
                  onClick={() =>
                    updateProject(selectedIdx, {
                      links: [
                        ...activeProject.links,
                        { label: 'Live Demo', url: 'https://' },
                      ],
                    })
                  }
                  className="font-mono text-[11px] text-[#D8B98A] hover:underline"
                >
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {activeProject.links.map((lnk, lIdx) => (
                  <div key={lIdx} className="grid gap-2 sm:grid-cols-12">
                    <input
                      type="text"
                      value={lnk.label}
                      placeholder="Label (e.g. GitHub)"
                      onChange={(e) => {
                        const nextLinks = [...activeProject.links];
                        nextLinks[lIdx] = { ...lnk, label: e.target.value };
                        updateProject(selectedIdx, { links: nextLinks });
                      }}
                      className={inputCls + ' sm:col-span-4'}
                    />
                    <input
                      type="url"
                      value={lnk.url}
                      placeholder="https://..."
                      onChange={(e) => {
                        const nextLinks = [...activeProject.links];
                        nextLinks[lIdx] = { ...lnk, url: e.target.value };
                        updateProject(selectedIdx, { links: nextLinks });
                      }}
                      className={inputCls + ' sm:col-span-7'}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateProject(selectedIdx, {
                          links: activeProject.links.filter((_, i) => i !== lIdx),
                        })
                      }
                      aria-label="Remove link"
                      className="flex items-center justify-center rounded-lg border border-red-400/25 p-2 text-red-300 hover:bg-red-500/10 sm:col-span-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SkillsEditor({
  data,
  onChange,
}: {
  data: PortfolioData;
  onChange: (next: PortfolioData) => void;
}) {
  const [newSkill, setNewSkill] = useState('');
  const skills = data.skillsMarquee;

  const handleAdd = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    onChange({ ...data, skillsMarquee: [...skills, trimmed] });
    setNewSkill('');
  };

  return (
    <div className={cardCls}>
      <h2 className="text-lg font-medium text-[#F4EFE6]">Skills Marquee Ticker</h2>
      <p className="mt-1 text-xs text-[#9E988E]">
        Displayed continuously between hairline borders separated by ●.
      </p>

      <div className="mt-5 flex gap-2">
        <input
          type="text"
          value={newSkill}
          placeholder="Add a skill (e.g. Threat Intelligence)"
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          className={inputCls}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#D8B98A]/40 bg-[#D8B98A]/10 px-4 py-2 font-mono text-xs text-[#D8B98A] hover:bg-[#D8B98A]/20"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {skills.map((skill, idx) => (
          <div
            key={`${skill}-${idx}`}
            className="flex items-center gap-3 rounded-lg border border-[rgba(244,239,230,0.1)] bg-[#0E0D0C] px-3.5 py-2.5"
          >
            <span className="w-6 font-mono text-xs text-[#9E988E]">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <input
              type="text"
              value={skill}
              onChange={(e) => {
                const next = [...skills];
                next[idx] = e.target.value;
                onChange({ ...data, skillsMarquee: next });
              }}
              className="flex-1 bg-transparent text-sm text-[#F4EFE6] focus:outline-none"
            />
            <button
              type="button"
              disabled={idx === 0}
              onClick={() =>
                onChange({ ...data, skillsMarquee: moveItem(skills, idx, idx - 1) })
              }
              aria-label="Move skill up"
              className="rounded border border-[rgba(244,239,230,0.12)] p-1.5 text-[#9E988E] hover:text-[#F4EFE6] disabled:opacity-30"
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              disabled={idx === skills.length - 1}
              onClick={() =>
                onChange({ ...data, skillsMarquee: moveItem(skills, idx, idx + 1) })
              }
              aria-label="Move skill down"
              className="rounded border border-[rgba(244,239,230,0.12)] p-1.5 text-[#9E988E] hover:text-[#F4EFE6] disabled:opacity-30"
            >
              <ArrowDown size={13} />
            </button>
            <button
              type="button"
              disabled={skills.length <= 1}
              onClick={() =>
                onChange({
                  ...data,
                  skillsMarquee: skills.filter((_, i) => i !== idx),
                })
              }
              aria-label="Remove skill"
              className="rounded border border-red-400/25 p-1.5 text-red-300 hover:bg-red-500/10 disabled:opacity-30"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutContactEditor({
  data,
  onChange,
}: {
  data: PortfolioData;
  onChange: (next: PortfolioData) => void;
}) {
  const { profile, about } = data;

  return (
    <div className="space-y-6">
      <div className={cardCls}>
        <h2 className="text-lg font-medium text-[#F4EFE6]">About Section &amp; Portrait</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className={labelCls}>Portrait Image URL (Darkroom Tray)</label>
            <input
              type="text"
              value={profile.avatar}
              onChange={(e) =>
                onChange({ ...data, profile: { ...profile, avatar: e.target.value } })
              }
              className={inputCls}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={labelCls + ' mb-0'}>Bio Paragraphs</label>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    about: { ...about, story: [...about.story, 'New bio paragraph...'] },
                  })
                }
                className="font-mono text-[11px] text-[#D8B98A] hover:underline"
              >
                + Add Paragraph
              </button>
            </div>
            <div className="space-y-3">
              {about.story.map((para, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const next = [...about.story];
                      next[idx] = e.target.value;
                      onChange({ ...data, about: { ...about, story: next } });
                    }}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    disabled={about.story.length <= 1}
                    onClick={() =>
                      onChange({
                        ...data,
                        about: {
                          ...about,
                          story: about.story.filter((_, i) => i !== idx),
                        },
                      })
                    }
                    aria-label="Remove paragraph"
                    className="h-fit rounded-lg border border-red-400/25 p-2 text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Technical Stack List (comma-separated)</label>
            <input
              type="text"
              value={about.stack.join(', ')}
              onChange={(e) =>
                onChange({
                  ...data,
                  about: {
                    ...about,
                    stack: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                })
              }
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Hobbies / Casual Line</label>
            <textarea
              rows={2}
              value={about.hobbiesLine}
              onChange={(e) =>
                onChange({ ...data, about: { ...about, hobbiesLine: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-medium text-[#F4EFE6]">Contact &amp; Social Links</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                onChange({ ...data, profile: { ...profile, email: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) =>
                onChange({ ...data, profile: { ...profile, linkedin: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn Display Handle</label>
            <input
              type="text"
              value={profile.linkedinDisplay}
              onChange={(e) =>
                onChange({
                  ...data,
                  profile: { ...profile, linkedinDisplay: e.target.value },
                })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>GitHub URL</label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) =>
                onChange({ ...data, profile: { ...profile, github: e.target.value } })
              }
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Blog URL (DefenceLogic)</label>
            <input
              type="url"
              value={profile.blog}
              onChange={(e) =>
                onChange({ ...data, profile: { ...profile, blog: e.target.value } })
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
