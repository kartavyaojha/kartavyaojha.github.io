import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SelectedWork } from '@/components/SelectedWork';
import { SkillMarquee } from '@/components/SkillMarquee';
import { AboutSection } from '@/components/AboutSection';
import { ContactFooter } from '@/components/ContactFooter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CustomCursor } from '@/components/CustomCursor';

export default function HomePage() {
  return (
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
  );
}
