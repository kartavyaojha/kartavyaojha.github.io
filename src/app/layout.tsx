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

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kartavya Ojha',
  url: 'https://kartavyaojha.github.io/',
  jobTitle: 'Cybersecurity & SOC Analyst',
  image: 'https://kartavyaojha.github.io/og-image.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Indore',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://github.com/kartavyaojha',
    'https://linkedin.com/in/kartavya-ojha-564726314',
    'https://defencelogic.wordpress.com/',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kartavyaojha.github.io'),
  title: 'Kartavya Ojha — Cybersecurity & SOC Analyst',
  description:
    'Portfolio of Kartavya Ojha — Cybersecurity Analyst, SOC Blue Team defender, and security researcher based in Indore, India.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    url: 'https://kartavyaojha.github.io/',
    title: 'Kartavya Ojha — Cybersecurity & SOC Analyst',
    description:
      'Portfolio of Kartavya Ojha — Cybersecurity Analyst, SOC Blue Team defender, and security researcher based in Indore, India.',
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
    title: 'Kartavya Ojha — Cybersecurity & SOC Analyst',
    description:
      'Portfolio of Kartavya Ojha — Cybersecurity Analyst, SOC Blue Team defender, and security researcher based in Indore, India.',
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="paper-grain-overlay" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
