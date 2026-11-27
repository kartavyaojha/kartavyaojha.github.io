import type { Metadata } from 'next';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://kartavyaojha.github.io'),
  title: 'Kartavya Ojha — Cybersecurity Researcher & Security Engineer',
  description:
    'Portfolio of Kartavya Ojha — Cybersecurity Analyst, Security Researcher, and Blue Team Defender in Indore, India.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    url: 'https://kartavyaojha.github.io/',
    title: 'Kartavya Ojha — Cybersecurity Researcher & Security Engineer',
    description:
      'Portfolio of Kartavya Ojha — Cybersecurity Analyst, Security Researcher, and Blue Team Defender in Indore, India.',
    images: [
      {
        url: 'https://kartavyaojha.github.io/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Kartavya Ojha — Cybersecurity & SOC Analyst',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kartavya Ojha — Cybersecurity Researcher & Security Engineer',
    description:
      'Portfolio of Kartavya Ojha — Cybersecurity Analyst, Security Researcher, and Blue Team Defender in Indore, India.',
    images: ['https://kartavyaojha.github.io/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <div className="paper-grain-overlay" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
