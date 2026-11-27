'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  ArrowUpRight,
  Check,
  Database,
  Download,
  LogOut,
  Save,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { ADMIN_EMAIL, auth, db, googleProvider } from '@/lib/firebase';
import {
  mergePortfolioData,
  PORTFOLIO_DATA,
  PortfolioData,
} from '@/data/portfolio';
import {
  AboutContactEditor,
  HeroTitlesEditor,
  ProjectsEditor,
  SkillsEditor,
} from './AdminEditors';

type AdminTab = 'hero' | 'projects' | 'skills' | 'about';

export function AdminDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [data, setData] = useState<PortfolioData>(PORTFOLIO_DATA);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbExists, setDbExists] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');

  // Ensure /admin always uses native crisp pointer and dark obsidian background
  useEffect(() => {
    document.documentElement.classList.remove('custom-cursor-active');
    document.documentElement.classList.add('dark');
  }, []);

  const showToast = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg });
    window.setTimeout(() => setToast(null), 3200);
  };

  const isAuthorizedAdmin = (candidate: FirebaseUser): boolean => {
    const emailMatches =
      candidate.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isGoogleProvider = candidate.providerData.some(
      (p) => p.providerId === 'google.com'
    );
    return emailMatches && candidate.emailVerified && isGoogleProvider;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        if (!isAuthorizedAdmin(nextUser)) {
          await signOut(auth);
          setUser(null);
          setAuthError('Access Denied — Unauthorized Account');
          setAuthLoading(false);
          return;
        }
        setAuthError(null);
        setUser(nextUser);
        setAuthLoading(false);

        setDbLoading(true);
        try {
          const snap = await getDoc(doc(db, 'portfolio', 'main'));
          if (snap.exists()) {
            setDbExists(true);
            setData(mergePortfolioData(snap.data() as Partial<PortfolioData>));
          } else {
            setDbExists(false);
            setData(PORTFOLIO_DATA);
          }
        } catch (err) {
          showToast(
            'err',
            err instanceof Error ? err.message : 'Failed to load Firestore document'
          );
        } finally {
          setDbLoading(false);
        }
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (!isAuthorizedAdmin(cred.user)) {
        await signOut(auth);
        setUser(null);
        setAuthError('Access Denied — Unauthorized Account');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Google Sign-In failed');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleInitializeDb = async () => {
    setSaving(true);
    try {
      const payload = JSON.parse(JSON.stringify(PORTFOLIO_DATA)) as PortfolioData;
      await setDoc(doc(db, 'portfolio', 'main'), payload);
      setData(payload);
      setDbExists(true);
      showToast('ok', 'Firestore initialized with your current portfolio data.');
    } catch (err) {
      showToast(
        'err',
        err instanceof Error ? err.message : 'Failed to initialize Firestore'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sanitized = mergePortfolioData(data);
      const payload = JSON.parse(JSON.stringify(sanitized)) as PortfolioData;
      await setDoc(doc(db, 'portfolio', 'main'), payload);
      setData(payload);
      setDbExists(true);
      showToast('ok', 'Saved changes to Firestore (portfolio/main).');
    } catch (err) {
      showToast(
        'err',
        err instanceof Error ? err.message : 'Failed to save changes to Firestore'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kartavya-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ok', 'Exported JSON backup.');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0D0C] text-[#F4EFE6]">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#9E988E]">
          Verifying session…
        </div>
      </div>
    );
  }

  // Minimal Dark Obsidian Google-Only Login Screen
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0D0C] px-5 text-[#F4EFE6]">
        <div className="w-full max-w-md rounded-2xl border border-[rgba(244,239,230,0.12)] bg-[#161615] p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D8B98A]">
            <ShieldCheck size={14} />
            <span>Private Admin</span>
          </div>

          <h1 className="mt-4 font-serif text-4xl tracking-tight text-[#F4EFE6]">
            Kartavya Portfolio CMS
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#9E988E]">
            Sign in with your authorized Google account to manage live portfolio content.
          </p>

          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 p-3.5 text-sm text-red-200">
              <ShieldAlert size={17} className="mt-0.5 shrink-0 text-red-300" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-[#D8B98A]/50 bg-[#D8B98A] px-5 py-3 text-sm font-medium text-[#0E0D0C] transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.92h5.27c-.45 2.38-2.55 4.02-5.27 4.02a5.88 5.88 0 0 1 0-11.76c1.5 0 2.86.56 3.9 1.49l2.18-2.18A8.93 8.93 0 0 0 12.18 3C7.2 3 3.16 7.04 3.16 12s4.04 9 9.02 9c5.2 0 8.65-3.65 8.65-8.8 0-.59-.07-1.05-.18-1.1Z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="mt-6 border-t border-[rgba(244,239,230,0.08)] pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E988E] hover:text-[#F4EFE6]"
            >
              <span>Return to public portfolio</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'hero', label: 'Hero & Rotating Titles' },
    { id: 'projects', label: 'Projects & Case Studies' },
    { id: 'skills', label: 'Skills Marquee' },
    { id: 'about', label: 'About & Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#F4EFE6]">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed right-5 top-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-xl ${
            toast.kind === 'ok'
              ? 'border-[#D8B98A]/45 bg-[#161615] text-[#F4EFE6]'
              : 'border-red-400/40 bg-[#221212] text-red-200'
          }`}
        >
          {toast.kind === 'ok' ? (
            <Check size={15} className="text-[#D8B98A]" />
          ) : (
            <ShieldAlert size={15} className="text-red-300" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="flex flex-col justify-between border-b border-[rgba(244,239,230,0.10)] bg-[#161615] p-6 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D8B98A]">
              <ShieldCheck size={14} />
              <span>Portfolio CMS</span>
            </div>
            <h1 className="mt-2 font-serif text-2xl text-[#F4EFE6]">
              {data.profile.name}
            </h1>
            <p className="mt-1 truncate font-mono text-[11px] text-[#9E988E]">
              {user.email}
            </p>

            {/* Navigation Tabs */}
            <nav aria-label="Admin sections" className="mt-8 space-y-1.5">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors ${
                      active
                        ? 'border border-[#D8B98A]/35 bg-[#D8B98A]/15 font-medium text-[#D8B98A]'
                        : 'border border-transparent text-[#9E988E] hover:bg-white/[0.03] hover:text-[#F4EFE6]'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="mt-8 space-y-2.5 border-t border-[rgba(244,239,230,0.10)] pt-6">
            <button
              type="button"
              disabled={saving || dbLoading}
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D8B98A] px-4 py-2.5 text-sm font-medium text-[#0E0D0C] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Saving…' : 'Save Changes'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(244,239,230,0.14)] px-4 py-2 text-xs font-medium text-[#F4EFE6] hover:border-[rgba(244,239,230,0.3)]"
            >
              <Download size={14} />
              <span>Export JSON Backup</span>
            </button>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[rgba(244,239,230,0.10)] px-4 py-2 text-xs text-[#9E988E] hover:text-[#F4EFE6]"
            >
              <span>View Live Site</span>
              <ArrowUpRight size={13} />
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs text-red-300 hover:bg-red-500/10"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="p-5 sm:p-8 lg:p-10">
          {dbLoading ? (
            <div className="rounded-xl border border-[rgba(244,239,230,0.10)] bg-[#161615] p-8 font-mono text-xs uppercase tracking-wider text-[#9E988E]">
              Loading Firestore document (portfolio/main)…
            </div>
          ) : (
            <div className="space-y-6">
              {dbExists === false && (
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#D8B98A]/40 bg-[#D8B98A]/10 p-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#D8B98A]">
                      <Database size={14} />
                      <span>Firestore Empty</span>
                    </div>
                    <p className="mt-1 text-sm text-[#F4EFE6]">
                      The document <code className="font-mono">portfolio/main</code> doesn&apos;t
                      exist yet. Initialize it with your current portfolio content in one click.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleInitializeDb}
                    className="shrink-0 rounded-lg bg-[#D8B98A] px-4 py-2.5 text-xs font-medium text-[#0E0D0C] hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Initializing…' : 'Initialize Database with Current Portfolio Data'}
                  </button>
                </div>
              )}

              {activeTab === 'hero' && (
                <HeroTitlesEditor data={data} onChange={setData} />
              )}
              {activeTab === 'projects' && (
                <ProjectsEditor data={data} onChange={setData} />
              )}
              {activeTab === 'skills' && (
                <SkillsEditor data={data} onChange={setData} />
              )}
              {activeTab === 'about' && (
                <AboutContactEditor data={data} onChange={setData} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
