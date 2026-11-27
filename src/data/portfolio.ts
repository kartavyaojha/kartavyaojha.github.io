export type ProjectCategory =
  | 'All'
  | 'SOC & Detection'
  | 'AppSec & Pentesting'
  | 'Security Research'
  | 'Mentorship & Leadership';

export type PreviewVariant =
  | 'soc-simlab'
  | 'appsec-suite'
  | 'vaf-guardian'
  | 'research-paper'
  | 'acs-outreach';

export interface RoleTitle {
  line1: string;
  line2: string;
  full: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  status?: string;
  roleBadge: string;
  organization: string;
  period: string;
  category: Exclude<ProjectCategory, 'All'>;
  summary: string;
  problem: string;
  solution: string;
  outcomes: string[];
  stack: string[];
  previewVariant: PreviewVariant;
  imageUrl?: string;
  links: { label: string; url: string }[];
}

export interface PlaygroundItem {
  title: string;
  kind: 'Article' | 'Lab' | 'Script';
  date: string;
  platform: string;
  summary: string;
  url?: string;
  tags: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  url: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    firstName: string;
    lastName: string;
    title: string;
    headlineLine1: string;
    headlineLine2: string;
    currentFocus: string;
    location: string;
    email: string;
    linkedin: string;
    linkedinDisplay: string;
    github: string;
    blog: string;
    resume: string;
    avatar: string;
    heroIntro: string;
  };
  heroTitles: RoleTitle[];
  categories: ProjectCategory[];
  projects: ProjectItem[];
  playground: {
    title: string;
    roleBadge: string;
    summary: string;
    items: PlaygroundItem[];
  };
  skillsMarquee: string[];
  about: {
    story: string[];
    stack: string[];
    certifications: CertificationItem[];
    awards: string[];
    hobbiesLine: string;
  };
}

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Kartavya Ojha',
    firstName: 'Kartavya',
    lastName: 'Ojha',
    title: 'Kartavya Ojha — Security Engineer & Cybersecurity Researcher',
    headlineLine1: 'Cybersecurity Researcher',
    headlineLine2: '& Security Engineer',
    currentFocus: 'Security Engineer & SOC Analyst',
    location: 'Indore, India',
    email: 'kartavya9977@gmail.com',
    linkedin: 'https://linkedin.com/in/kartavya-ojha-564726314',
    linkedinDisplay: 'linkedin.com/in/kartavya-ojha-564726314',
    github: 'https://github.com/kartavyaojha',
    blog: 'https://defencelogic.wordpress.com/',
    resume: '/Kartavya_Resume/index.pdf',
    avatar: '/images/avatar.png',
    heroIntro:
      'I build SOC triage simulations, security testing tools, and threat-detection workflows grounded in real incident response. Previously Technical Projects & Outreach Lead at ACS and Cybersecurity Intern at Albus Security, now studying BCA at Mandsaur University.',
  },
  heroTitles: [
    { line1: 'CYBERSECURITY', line2: 'ANALYST', full: 'CYBERSECURITY ANALYST' },
    { line1: 'SECURITY', line2: 'RESEARCHER', full: 'SECURITY RESEARCHER' },
    { line1: 'SOC', line2: 'ANALYST', full: 'SOC ANALYST' },
    { line1: 'THREAT', line2: 'HUNTER', full: 'THREAT HUNTER' },
    { line1: 'BLUE TEAM', line2: 'DEFENDER', full: 'BLUE TEAM DEFENDER' },
  ],
  categories: [
    'All',
    'SOC & Detection',
    'AppSec & Pentesting',
    'Security Research',
    'Mentorship & Leadership',
  ],
  projects: [
    {
      id: 'soc-l1-simlab',
      index: '01',
      title: 'SOC-L1 SimLab',
      status: 'In progress',
      roleBadge: 'Creator & SOC Engineer',
      organization: 'Open Source',
      period: '2025 – Present',
      category: 'SOC & Detection',
      summary:
        'Open-source SOC Level 1 triage simulator built with Python and Streamlit featuring a war-room dashboard, severity coding, and structured incident escalation.',
      problem:
        'Aspiring SOC analysts often study theory without experiencing realistic alert queues, contextual log enrichment, or structured L1-to-L2 escalation decisions.',
      solution:
        'Engineered a self-contained Streamlit war-room simulator that models realistic security events, pairs each alert with contextual telemetry, and guides analysts through severity triage and incident documentation.',
      outcomes: [
        'Provides repeatable hands-on Level 1 triage drills with severity classification and event context.',
        'Standardizes escalation notes and incident response documentation inside a single Python interface.',
        'Open-sourced on GitHub for students and junior defenders practicing alert workflows.',
      ],
      stack: ['Python', 'Streamlit', 'SOC Operations', 'Incident Response', 'Alert Triage'],
      previewVariant: 'soc-simlab',
      imageUrl: '',
      links: [
        {
          label: 'GitHub Repository',
          url: 'https://github.com/kartavyaojha/SOC-L1-SimLab',
        },
      ],
    },
    {
      id: 'albus-security-tooling',
      index: '02',
      title: 'RCE Detector & Pentest Suite',
      roleBadge: 'Cybersecurity Intern · Albus Security',
      organization: 'Albus Security',
      period: 'Feb 2024 – Sep 2024',
      category: 'AppSec & Pentesting',
      summary:
        'Developed a Remote Code Execution detector and pentest automation scripts while remediating open-redirect and web logic flaws—awarded a Certificate of Excellence.',
      problem:
        'Manual verification of recurring web vulnerabilities and exploit primitives slows down assessments and leaves subtle logic flaws or open redirects unchecked.',
      solution:
        'Built targeted Python tooling—including an RCE detector, brute-force and reverse-shell test harnesses, and an educational keylogger—alongside Burp Suite testing to diagnose and patch application flaws.',
      outcomes: [
        'Expanded penetration testing coverage through automated payload and detection scripts.',
        'Diagnosed and remediated web vulnerabilities including open redirections and business-logic flaws.',
        'Awarded Certificate of Excellence and Letter of Recommendation by Albus Security.',
      ],
      stack: ['Python', 'Burp Suite', 'Linux', 'Web Security', 'Penetration Testing'],
      previewVariant: 'appsec-suite',
      imageUrl: '',
      links: [
        {
          label: 'GitHub Profile',
          url: 'https://github.com/kartavyaojha',
        },
      ],
    },
    {
      id: 'team-guardian-vaf',
      index: '03',
      title: 'Team Guardian Framework',
      roleBadge: 'Project Mentor · ACS',
      organization: 'Association for Cyber Security (ACS)',
      period: 'Jul 2024 – Feb 2025',
      category: 'Mentorship & Leadership',
      summary:
        'Mentored a 13-member security engineering team from planning through secure code reviews to ship a Vulnerability Assessment Framework—earning a Certificate of Appreciation.',
      problem:
        'Student-led security builds frequently stall without clear architecture boundaries, threat-aware coding standards, and coordinated milestone reviews.',
      solution:
        'Led technical planning, established secure coding review checkpoints, and guided 13 contributors in designing and shipping a cohesive Python-based Vulnerability Assessment Framework.',
      outcomes: [
        'Guided a 13-member team to successful end-to-end delivery of the framework.',
        'Instituted peer and mentor secure-code reviews across modules.',
        'Recognized with a Certificate of Appreciation for leadership and mentorship.',
      ],
      stack: ['Python', 'Security Frameworks', 'Secure Code Review', 'Mentorship', 'Project Management'],
      previewVariant: 'vaf-guardian',
      imageUrl: '',
      links: [
        {
          label: 'LinkedIn Credentials',
          url: 'https://linkedin.com/in/kartavya-ojha-564726314',
        },
      ],
    },
    {
      id: 'reducing-soc-burnout',
      index: '04',
      title: 'Reducing SOC Analyst Burnout',
      roleBadge: 'Research Author · ICIECT',
      organization: 'Mandsaur University / ICIECT',
      period: '2025',
      category: 'Security Research',
      summary:
        'Published conference research at ICIECT analyzing alert fatigue, false-positive triage noise, and operational safeguards to keep SOC teams effective.',
      problem:
        'High false-positive volumes and repetitive Level 1 triage overwhelm SOC analysts, slowing response times and driving turnover.',
      solution:
        'Investigated operational bottlenecks across alert prioritization, context enrichment, and workflow ergonomics, synthesizing actionable improvements for modern security operations teams.',
      outcomes: [
        'Accepted and published at the International Conference on Innovative Engineering and Computational Technologies (ICIECT).',
        'Directly informed the triage workflow design inside SOC-L1 SimLab.',
      ],
      stack: ['SOC Operations', 'Alert Fatigue', 'Splunk & SIEM', 'Detection Engineering', 'Research'],
      previewVariant: 'research-paper',
      imageUrl: '',
      links: [
        {
          label: 'Read SOC School Guide',
          url: 'https://defencelogic.wordpress.com/2025/07/31/welcome-to-soc-school-your-cyber-mentors-guide/',
        },
      ],
    },
    {
      id: 'acs-outreach-program',
      index: '05',
      title: 'ACS Workshops & Outreach',
      roleBadge: 'Technical Projects & Outreach Lead · ACS',
      organization: 'Association for Cyber Security (ACS)',
      period: 'Jul 2024 – Jul 2025',
      category: 'Mentorship & Leadership',
      summary:
        'Spearheaded multi-university webinars, cybersecurity awareness campaigns, and structured training pipelines that strengthened community engagement across India.',
      problem:
        'Newcomers entering cybersecurity often lack structured onboarding paths and practical exposure beyond fragmented social posts.',
      solution:
        'Designed training and onboarding workflows, coordinated technical workshops with university participants, and directed educational content across ACS channels.',
      outcomes: [
        'Attracted participants from multiple universities to live technical workshops and webinars.',
        'Streamlined member onboarding and upskilling programs across ACS.',
        'Increased community engagement through sustained cybersecurity awareness campaigns.',
      ],
      stack: ['Cybersecurity Awareness', 'Technical Workshops', 'Team Leadership', 'Onboarding', 'Content Strategy'],
      previewVariant: 'acs-outreach',
      imageUrl: '',
      links: [
        {
          label: 'Connect on LinkedIn',
          url: 'https://linkedin.com/in/kartavya-ojha-564726314',
        },
      ],
    },
  ],
  playground: {
    title: 'Playground',
    roleBadge: 'Writeups, Exploit Labs & Splunk',
    summary:
      'DefenceLogic articles, educational exploit prototypes, and Splunk SPL threat-hunting sandboxes built outside client work.',
    items: [
      {
        title: 'How Hackers Use Your Social Media for OSINT and Why It Is an Information Goldmine',
        kind: 'Article',
        date: 'Aug 18, 2025',
        platform: 'DefenceLogic (WordPress)',
        summary:
          'Breaks down how attackers harvest open-source intelligence from Instagram, LinkedIn, and X to craft targeted social engineering—and practical steps to harden your digital footprint.',
        url: 'https://defencelogic.wordpress.com/2025/08/18/how-hackers-use-your-social-media-for-osint-and-why-it-is-an-information-goldmine/',
        tags: ['OSINT', 'OPSEC', 'Social Engineering'],
      },
      {
        title: 'The Journey from CTFs to Google: Real Lessons from a Cybersecurity Pro',
        kind: 'Article',
        date: 'Aug 28, 2025',
        platform: 'DefenceLogic (WordPress)',
        summary:
          'Lessons on how Capture The Flag (CTF) competitions build practical problem-solving habits, resilience, and career momentum in cybersecurity.',
        url: 'https://defencelogic.wordpress.com/2025/08/28/the-journey-from-ctfs-to-google-real-lessons-from-a-cybersecurity-pro/',
        tags: ['CTF', 'Career', 'Red & Blue Team'],
      },
      {
        title: 'Welcome to SOC School: Your Cyber Mentor’s Guide!',
        kind: 'Article',
        date: 'Jul 31, 2025',
        platform: 'DefenceLogic (WordPress)',
        summary:
          'An approachable primer on how Security Operations Centers detect, triage, and contain real-world threats.',
        url: 'https://defencelogic.wordpress.com/2025/07/31/welcome-to-soc-school-your-cyber-mentors-guide/',
        tags: ['SOC', 'Blue Team', 'Incident Triage'],
      },
      {
        title: 'Exploit Development & Detection Lab Notes',
        kind: 'Lab',
        date: '2024 – 2025',
        platform: 'Controlled Lab Environment',
        summary:
          'Python-based exploit proofs of concept (educational keylogger & RCE patterns) built strictly in isolated labs to study signature behavior and craft tighter detections.',
        url: 'https://github.com/kartavyaojha',
        tags: ['Python', 'Exploit Mechanics', 'Detection'],
      },
      {
        title: 'Splunk SPL Threat Hunting & Log Monitoring',
        kind: 'Script',
        date: 'Ongoing',
        platform: 'Splunk Lab',
        summary:
          'Writing SPL queries for authentication anomalies, process-creation telemetry, and alert noise reduction as part of ongoing SOC simulation work.',
        tags: ['Splunk', 'SPL', 'Threat Detection'],
      },
    ],
  },
  skillsMarquee: [
    'Penetration Testing',
    'Splunk & SIEM',
    'Incident Response',
    'Vulnerability Assessment',
    'Python',
    'Go',
    'Burp Suite',
    'Metasploit',
    'Red Team Operations',
    'Threat Detection',
    'Google Cloud Platform',
    'Kubernetes',
    'Docker',
    'Linux Administration',
  ],
  about: {
    story: [
      'I’m currently pursuing my Bachelor of Computer Applications (BCA, 2024–2027) at Mandsaur University, where I stay active in the Cybersecurity Club and published research at ICIECT on reducing SOC analyst burnout.',
      'Across my roles at the Association for Cyber Security (ACS) and Albus Security, I’ve worked on both sides of the security equation—building offensive testing tools like RCE detectors and automation scripts, while mentoring a 13-member team to ship a Vulnerability Assessment Framework.',
      'Right now, I’m focused on sharpening my blue-team engineering craft: building realistic SOC simulations, writing Splunk detection queries, and turning complex security topics into clear walkthroughs on DefenceLogic.',
    ],
    stack: [
      'Python',
      'Go',
      'Splunk (SPL)',
      'Burp Suite',
      'Metasploit',
      'Docker',
      'Kubernetes',
      'Google Cloud Platform',
      'Linux',
    ],
    certifications: [
      {
        title: 'Google Cybersecurity Professional',
        issuer: 'Google',
        year: '2025',
        url: 'https://coursera.org/verify/professional-cert/WZZRLA4CFJOG',
      },
      {
        title: 'Introduction to Splunk',
        issuer: 'Splunk',
        year: '2024',
        url: 'https://www.credly.com/badges/splunk-introduction',
      },
      {
        title: 'Cybersecurity Fundamentals',
        issuer: 'IBM',
        year: '2024',
        url: 'https://www.credly.com/badges/d378d1ee-4523-4f3c-bd41-f1c20dccab04/public_url',
      },
      {
        title: 'Ethical Hacking Essentials',
        issuer: 'EC-Council',
        year: '2023',
        url: 'https://learn.eccouncil.org/certificate/b17f1d33-feba-4a20-ac6f-ebb3fb1e0bb8',
      },
    ],
    awards: [
      'Certificate of Appreciation — ACS (2025)',
      'Certificate of Excellence & LOR — Albus Security (2024)',
    ],
    hobbiesLine:
      'When I’m away from logs and payloads, I’m playing football (former school vice-captain and district winner), solving CTFs, or writing security breakdowns on DefenceLogic.',
  },
};

export function sanitizeUrl(url: unknown, fallback = ''): string {
  if (typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  // Allow clean relative paths starting with single '/' (not '//')
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === 'https:' ||
      parsed.protocol === 'http:' ||
      parsed.protocol === 'mailto:'
    ) {
      return trimmed;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

export function mergePortfolioData(raw: Partial<PortfolioData> | null | undefined): PortfolioData {
  if (!raw) return PORTFOLIO_DATA;
  const mergedProfile = { ...PORTFOLIO_DATA.profile, ...(raw.profile ?? {}) };
  mergedProfile.resume = sanitizeUrl(mergedProfile.resume, PORTFOLIO_DATA.profile.resume);
  mergedProfile.avatar = sanitizeUrl(mergedProfile.avatar, PORTFOLIO_DATA.profile.avatar);
  mergedProfile.linkedin = sanitizeUrl(mergedProfile.linkedin, PORTFOLIO_DATA.profile.linkedin);
  mergedProfile.github = sanitizeUrl(mergedProfile.github, PORTFOLIO_DATA.profile.github);
  mergedProfile.blog = sanitizeUrl(mergedProfile.blog, PORTFOLIO_DATA.profile.blog);

  const projects = (Array.isArray(raw.projects) ? raw.projects : PORTFOLIO_DATA.projects).map(
    (proj, idx) => ({
      ...proj,
      index: String(idx + 1).padStart(2, '0'),
      imageUrl: sanitizeUrl(proj.imageUrl, ''),
      links: Array.isArray(proj.links)
        ? proj.links
            .map((l) => ({ ...l, url: sanitizeUrl(l.url, '') }))
            .filter((l) => l.url !== '')
        : [],
    })
  );

  const playgroundItems = (
    Array.isArray(raw.playground?.items)
      ? raw.playground.items
      : PORTFOLIO_DATA.playground.items
  ).map((item) => ({
    ...item,
    url: item.url ? sanitizeUrl(item.url, '') : undefined,
  }));

  const certs = (
    Array.isArray(raw.about?.certifications)
      ? raw.about.certifications
      : PORTFOLIO_DATA.about.certifications
  ).map((c) => ({
    ...c,
    url: sanitizeUrl(c.url, '#'),
  }));

  return {
    profile: mergedProfile,
    heroTitles:
      Array.isArray(raw.heroTitles) && raw.heroTitles.length > 0
        ? raw.heroTitles
        : PORTFOLIO_DATA.heroTitles,
    categories:
      Array.isArray(raw.categories) && raw.categories.length > 0
        ? raw.categories
        : PORTFOLIO_DATA.categories,
    projects,
    playground: {
      ...PORTFOLIO_DATA.playground,
      ...(raw.playground ?? {}),
      items: playgroundItems,
    },
    skillsMarquee:
      Array.isArray(raw.skillsMarquee) && raw.skillsMarquee.length > 0
        ? raw.skillsMarquee
        : PORTFOLIO_DATA.skillsMarquee,
    about: {
      ...PORTFOLIO_DATA.about,
      ...(raw.about ?? {}),
      story: Array.isArray(raw.about?.story) ? raw.about.story : PORTFOLIO_DATA.about.story,
      stack: Array.isArray(raw.about?.stack) ? raw.about.stack : PORTFOLIO_DATA.about.stack,
      certifications: certs,
      awards: Array.isArray(raw.about?.awards) ? raw.about.awards : PORTFOLIO_DATA.about.awards,
    },
  };
}
