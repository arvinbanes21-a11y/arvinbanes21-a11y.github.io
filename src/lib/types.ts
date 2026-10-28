export interface SkillItem {
  name: string;
  level: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface SkillCategoryItem {
  category: string;
  skills: string[];
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  heroHeadline: string;
  heroSubtext: string;
  portraitUrl: string;
  resumeUrl?: string;
  aboutHeadline?: string;
  philosophy?: string;
  skills?: SkillItem[];
  skillCategories?: SkillCategoryItem[];
  experiences?: ExperienceItem[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  theme: 'light' | 'dark';
  coverImage: string;
  description: string;
  images: string[];
  order: number;
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  tags?: string[];
  year?: string;
  createdAt?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  projectBrief: string;
  createdAt: string;
}

export const INITIAL_LIGHT_PROFILE: Profile = {
  name: "Arvin F. Bañes",
  title: "Computer Science Student • Freelance Web & Mobile Developer",
  heroHeadline: "Hi, I'm Arvin F. Bañes",
  heroSubtext: "I’m a fourth-year Computer Science student at the University of San Agustin with hands-on experience building functional, launch-ready web and mobile projects. Willing to help individuals and small businesses turn their ideas into practical, user-friendly websites and apps. I bring care, curiosity, and a willingness to learn to every project.",
  bio: "Hi! I'm a Computer Science student who loves turning ideas into apps people actually enjoy using. I've built web and mobile apps, AI-powered study tools, a class scheduling system, and an online tutoring platform. Right now I'm researching how to estimate food portions from a single photo using AR and computer vision.\n\nI like being part of the whole journey: sketching the idea, designing the screens, connecting the APIs and databases, and adding the smart features at the end. Along the way I picked up data science and cybersecurity too, because I'm curious about how things work under the hood.\n\nWhat I care about most: building things that work well, look good, and feel easy to use.",
  portraitUrl: "/profile-light.png",
  resumeUrl: "/resume.pdf",
  aboutHeadline: "Computer Science Student & Innovator.",
  philosophy: "The quality that makes you go to great effort to reduce overall energy expenditure. It makes you write labour-saving programs that other people will find useful, and document what you wrote so you don't have to answer so many questions about it. Hence the first great virtue of a programmer.\n— Larry Wall, 1992",
  skills: [
    { name: 'AI Engineering', level: '95%' },
    { name: 'Computer Vision', level: '95%' },
    { name: 'Software Engineering', level: '95%' },
    { name: 'Full-Stack Development', level: '95%' },
    { name: 'Mobile Development', level: '95%' },
    { name: 'AR & Spatial Computing', level: '90%' },
    { name: 'Data Science', level: '85%' },
    { name: 'Cybersecurity', level: '90%' },
    { name: 'Machine Learning', level: '90%' },
    { name: 'System Design', level: '90%' },
    { name: 'API Integration', level: '95%' },
    { name: 'Technical Leadership', level: '95%' },
    { name: 'Team Collaboration', level: '95%' },
    { name: 'Project Management', level: '90%' }
  ],
  skillCategories: [
    {
      category: 'Core Skills',
      skills: [
        'AI Engineering',
        'Computer Vision',
        'Software Engineering',
        'Full-Stack Development',
        'Mobile Development',
        'AR & Spatial Computing'
      ]
    },
    {
      category: 'Additional Technical Skills',
      skills: [
        'Data Science',
        'Cybersecurity',
        'Machine Learning',
        'System Design',
        'API Integration'
      ]
    },
    {
      category: 'Leadership',
      skills: [
        'Technical Leadership',
        'Team Collaboration',
        'Project Management'
      ]
    }
  ],
  experiences: [
    {
      period: 'June 2023',
      role: 'Earned TESDA Computer Systems Servicing NC II',
      company: 'Technical Education and Skills Development Authority (TESDA)',
      description: 'Earned the National Certificate II in Computer Systems Servicing, demonstrating hands-on competency in computer hardware, system configuration, networking, server setup, troubleshooting, and maintenance.'
    },
    {
      period: 'August 2023',
      role: 'Began My Computer Science Journey',
      company: 'University of San Agustin • BS Computer Science',
      description: 'Started pursuing a Bachelor of Science in Computer Science at the University of San Agustin, marking the beginning of my formal journey in software development, problem-solving, and computing.'
    },
    {
      period: 'March 2025',
      role: 'Java System Developer',
      company: 'Automated Class Scheduling System',
      description: 'Built my first Java-based automated class scheduling system that generates valid class schedules based on teacher availability, subjects, classrooms, class sections, and scheduling conflicts. The system reduces manual timetable creation by allowing administrators to enter the necessary information and automatically generate a schedule that satisfies the defined constraints.'
    },
    {
      period: 'December 2025',
      role: 'AI-Powered Application Developer',
      company: 'Programming 2 Project • AI Note-Taking & Quiz Engine',
      description: 'Developed an AI-powered web-based note-taking application that transforms students’ notes and learning modules into automatically generated quizzes and flashcards. The application integrates an external AI API to help students review and reinforce their learning through personalized study materials.'
    },
    {
      period: 'April 2026',
      role: 'Developer — Software Engineering Capstone Group',
      company: 'Web-Based Online Tutoring Hub',
      description: 'Served as a developer role for a Software Engineering capstone project, building a web-based online tutoring hub that connects tutors and tutees. The platform allows students to offer tutoring services or find and hire tutors based on their academic needs.'
    },
    {
      period: '2026 — 2027',
      role: 'Thesis Group Leader',
      company: 'University of San Agustin • Senior Capstone Thesis',
      description: 'Led a thesis project titled “AR-Anchored Monocular Depth Fusion for Single-Image Food Volume Estimation on Cross-Platform Mobile.” Focused on developing a Flutter-based mobile application that estimates food volume and macronutrient content from a single overhead photograph to reduce inaccuracies in manual portion logging.'
    }
  ],
  socialLinks: {
    github: "https://github.com/abanes-creator",
    twitter: "https://x.com/banes_arvin",
    email: "arvinbanes21@gmail.com"
  }
};

export const INITIAL_DARK_PROFILE: Profile = {
  name: "Arvin",
  title: "Chief Chaos Architect & Midnight Coder",
  heroHeadline: "Breaking Things Beautifully.",
  heroSubtext: "Built on caffeine, bad decisions, 3 AM epiphanies, and a yearner at 10pm.",
  bio: "Hi, I'm Arvin Bañes, and I'm the fastest man alive. I was bitten by a radioactive bug from my computer, and for the last 2 years I have never touched a code editor.",
  portraitUrl: "/profile-dark.png",
  resumeUrl: "/resume.pdf",
  aboutHeadline: "Professional Vibe Coder",
  philosophy: "I believe software should be fast, sharp, and slightly unpredictable. If a user interface feels like every other SaaS boilerplate, it lacks soul. We test boundaries, break constraints, and fix them before anyone notices.",
  skills: [
    { name: 'Midnight Caffeination', level: '100%' },
    { name: 'Chaos Engineering', level: '98%' },
    { name: 'WebGL Synthesizers', level: '90%' },
    { name: 'Bug Creation & Extermination', level: '95%' }
  ],
  skillCategories: [
    {
      category: 'Skills',
      skills: [
        'One Prompting Everything',
        'Loop Engineering',
        'Professional Kamote at Night',
        'Elite Ball Knowledge',
        '72 Hours Doomscrolling Knowledge',
        'Yearning'
      ]
    }
  ],
  experiences: [
    {
      period: '2023 — 2024',
      role: 'Hardware Hacker & Foundation Builder',
      company: 'TESDA Hardware Systems & CS Genesis',
      description: 'Mastered hardware diagnosis, server rack setups, and low-level computer architecture from the ground up.'
    },
    {
      period: '2025 — 2026',
      role: 'Rogue System Developer',
      company: 'AI Quiz Engines & Class Scheduling Automations',
      description: 'Crafting automated Java constraint solvers and AI-driven prompt synthesis engines for instant quiz and flashcard generation.'
    },
    {
      period: '2026 — 2027',
      role: 'Lead Architect & Thesis Group Leader',
      company: 'AR Depth Fusion & Monocular Estimation Protocol',
      description: 'Leading research on AR-anchored monocular depth fusion for single-image food volume estimation on cross-platform mobile apps with Flutter and computer vision.'
    }
  ],
  socialLinks: {
    github: "https://github.com/abanes-creator",
    twitter: "https://x.com/banes_arvin",
    email: "arvinbanes21@gmail.com"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "AR-Anchored Monocular Depth Fusion",
    slug: "ar-depth-fusion",
    category: "AR & Spatial Computing",
    theme: "light",
    coverImage: "https://images.unsplash.com/photo-1633493106185-8884948a313b?auto=format&fit=crop&q=80&w=1200",
    description: "Senior Capstone Thesis developing a Flutter-based mobile system utilizing Depth Anything V2 and computer vision to estimate food volume and macronutrients from a single overhead photo.",
    images: [
      "https://images.unsplash.com/photo-1633493106185-8884948a313b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200"
    ],
    order: 1,
    featured: true,
    tags: ["Flutter", "Python", "Depth Anything V2", "ARKit / ARCore", "Computer Vision"],
    year: "2026 — 2027",
    liveUrl: "https://github.com",
    githubUrl: "https://github.com"
  },
  {
    id: "proj-2",
    title: "AI Note-Taking & Quiz Synthesis Engine",
    slug: "ai-quiz-engine",
    category: "AI Engineering",
    theme: "light",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    description: "Intelligent web platform transforming student lecture notes and learning modules into automatically generated quizzes for students to practice and for personalized study guides via LLM APIs.",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
    ],
    order: 2,
    featured: true,
    tags: ["Next.js", "TypeScript", "LLM API", "Prisma", "Tailwind CSS"],
    year: "2025",
    liveUrl: "https://noter-steel.vercel.app/",
    githubUrl: "https://github.com/arvinbanes21-a11y/noter"
  },
  {
    id: "proj-3",
    title: "Automated Class Scheduling System",
    slug: "java-class-scheduler",
    category: "Systems & Algorithms",
    theme: "light",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    description: "Automated class timetable solver that factors teacher availability, classrooms, student sections, and scheduling constraints to generate clash-free school timetables instantly.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
    ],
    order: 3,
    featured: true,
    tags: ["Java", "Constraint Solver", "Algorithms", "SQLite", "JavaFX"],
    year: "2025",
    liveUrl: "https://github.com",
    githubUrl: "https://github.com"
  },
  {
    id: "proj-4",
    title: "Web-Based Online Tutoring Hub",
    slug: "online-tutoring-hub",
    category: "Full-Stack Capstone",
    theme: "light",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    description: "Software Engineering capstone platform connecting peer tutors and students with real-time appointment booking, direct messaging, and verified academic subject reviews.",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
    ],
    order: 4,
    featured: true,
    tags: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "Tailwind CSS"],
    year: "2026",
    liveUrl: "https://arvinbanes21-a11y.github.io/spts/",
    githubUrl: "https://github.com/arvinbanes21-a11y/spts"
  },
  {
    id: "proj-5",
    title: "Aura Digital Wealth Platform",
    slug: "aura-digital-wealth",
    category: "Fintech App",
    theme: "light",
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200",
    description: "High-performance financial analytics and portfolio tracking engine with real-time asset valuation graphs, transaction history, and PayMongo payment gateway integration.",
    images: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200"
    ],
    order: 5,
    featured: true,
    tags: ["Next.js", "PostgreSQL (Neon)", "PayMongo API", "Chart.js", "UI/UX"],
    year: "2025",
    liveUrl: "https://github.com",
    githubUrl: "https://github.com"
  }
];

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  image: string;
  showcaseImage?: string;
  skills: string[];
  category: string;
  description: string;
  order: number;
}

export const DARK_MODE_MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "mock-cert-kamote-fundamentals",
    title: "Kamote Fundamentals",
    issuer: "Kamote Academy",
    issueDate: "Oct 26, 2023",
    credentialId: "KA-KF-23001",
    image: "/certs/mock-kamote-fundamentals.jpeg",
    skills: ["Urban Maneuverability", "Defensive Riding", "Potato Avoidance"],
    category: "Motorcycle Training",
    description: "A mock certificate recognizing completion of the Kamote Fundamentals program.",
    order: 1
  },
  {
    id: "mock-cert-selena-god",
    title: "Certified Selena God",
    issuer: "Institute of Mobile Legends",
    issueDate: "Nov 23, 2023",
    credentialId: "MLBB-C-SG-23005",
    image: "/certs/mock-selena-god.jpeg",
    skills: ["Roam Core", "Map Awareness", "Team Strategy"],
    category: "Mobile Gaming",
    description: "A mock certificate recognizing exceptional dedication to the Selena roam role.",
    order: 2
  },
  {
    id: "mock-cert-vibe-coding",
    title: "Vibe Coding",
    issuer: "YouTube University",
    issueDate: "2023",
    credentialId: "YTU-VIBE-001",
    image: "/certs/mock-vibe-coding.jpeg",
    skills: ["Creative Coding", "Digital Building", "Problem Solving"],
    category: "Creative Technology",
    description: "A mock certificate for completing a course in purposeful vibe coding.",
    order: 3
  },
  {
    id: "mock-cert-computer-sayangs",
    title: "Computer Sayangs",
    issuer: "Enchong Dee University",
    issueDate: "2023",
    credentialId: "EDU-ACHV-BANES-001",
    image: "/certs/mock-computer-sayangs.jpeg",
    skills: ["Loyal sa hindi kami", "Continuous Yearning", "Ako nalang"],
    category: "Computer Studies",
    description: "A mock certificate celebrating dedication to computer studies.",
    order: 4
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "cert-intro-data-science",
    title: "Introduction to Data Science",
    issuer: "Cisco Networking Academy",
    issueDate: "Aug 11, 2026",
    credentialId: "CISCO-IDS-2026-AB",
    verificationUrl: "/certs/intro-to-data-science.pdf",
    image: "/certs/intro-to-data-science.png",
    showcaseImage: "/certs/showcase-data-science.png",
    skills: ["Data Analytics", "AI & Machine Learning", "Data Exploration", "Statistical Modeling", "Python Basics"],
    category: "Data Science & AI",
    description: "Successfully achieved student level credential from Cisco Networking Academy covering data analytics fundamentals, exploring career paths, and understanding the role of data in modern AI and Machine Learning.",
    order: 1
  },
  {
    id: "cert-js-essentials-1",
    title: "JavaScript Essentials 1",
    issuer: "Cisco Networking Academy & OpenEDG JS Institute",
    issueDate: "Aug 07, 2026",
    credentialId: "CISCO-JSE1-2026-AB",
    verificationUrl: "/certs/javascript-essentials-1.pdf",
    image: "/certs/javascript-essentials-1.png",
    showcaseImage: "/certs/showcase-javascript-essentials.png",
    skills: ["JavaScript (ES6+)", "Core Algorithms", "Data Types & Scope", "Functions & Control Flow", "Debugging & Error Handling"],
    category: "Web Development & Programming",
    description: "Statement of Achievement in collaboration with OpenEDG JavaScript Institute. Demonstrates proficiency in JavaScript core syntax, algorithmic problem solving, primitive/complex data types, and runtime program execution.",
    order: 2
  },
  {
    id: "cert-networking-basics",
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    issueDate: "Sep 28, 2026",
    verificationUrl: "/certs/networking-basics.pdf",
    image: "/certs/networking-basics.png",
    showcaseImage: "/certs/showcase-networking.svg",
    skills: ["Network Communication", "IPv4 & IPv6 Addressing", "Ethernet", "Routers & Wireless", "Network Troubleshooting"],
    category: "Networking",
    description: "Certificate of Course Completion (student level credential) from Cisco Networking Academy covering network concepts, protocols and standards, IP addressing, how routers connect networks, connectivity troubleshooting, and configuring a secure wireless router.",
    order: 3
  }
];
