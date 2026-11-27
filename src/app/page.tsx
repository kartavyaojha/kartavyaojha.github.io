import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SelectedWork } from '@/components/SelectedWork';
import { SkillMarquee } from '@/components/SkillMarquee';
import { AboutSection } from '@/components/AboutSection';
import { ContactFooter } from '@/components/ContactFooter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CustomCursor } from '@/components/CustomCursor';
import { PortfolioDataProvider } from '@/components/PortfolioDataContext';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://kartavyaojha.github.io/',
  },
};

export default function HomePage() {
  return (
    <PortfolioDataProvider>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <CustomCursor />
        <Header />
        <ThemeToggle />
        <main>
          <Hero />
          <SelectedWork />
          <SkillMarquee />
          <AboutSection />
        </main>
        <ContactFooter />
      </div>
    </PortfolioDataProvider>
  );
}
