export type Speaker = {
  id: string;
  name: string;
  bio?: string;
  title?: string;
  company?: string;
  avatar?: string;
};

export type Session = {
  id: string;
  title: string;
  abstract?: string;
  track?: string;
  room?: string;
  speakers: Speaker[];
  startAt: string;
  endAt: string;
  day: string;
  type?: 'keynote' | 'talk' | 'workshop' | 'panel' | 'networking';
  level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
};

// Generate realistic dates for the next conference
const baseDate = new Date('2025-03-15T09:00:00');
const day1 = '2025-03-15';
const day2 = '2025-03-16';
const day3 = '2025-03-17';

export const mockSessions: Session[] = [
  // Day 1 - Opening & Community
  {
    id: 's1',
    title: 'Opening Keynote: The Future of Open Event Management',
    abstract: 'Join us as we explore the evolving landscape of event management technology, community building, and the role of open-source solutions in creating more inclusive and accessible events.',
    track: 'Keynote',
    room: 'Main Hall',
    speakers: [{ id: 'p1', name: 'Dr. Aisha Khan', title: 'Director of Technology', company: 'Open Events Foundation' }],
    startAt: `${day1}T09:00:00`,
    endAt: `${day1}T10:00:00`,
    day: 'Day 1',
    type: 'keynote',
    level: 'beginner',
    tags: ['opening', 'vision', 'community']
  },
  {
    id: 's2',
    title: 'Building Resilient Communities with Federated Tools',
    abstract: 'Discover how Mobilizon, Matrix, and other federated technologies are revolutionizing community organization and event coordination across distributed networks.',
    track: 'Community',
    room: 'Room A',
    speakers: [{ id: 'p2', name: 'Bilal Ahmed', title: 'Community Architect', company: 'Federated Networks' }],
    startAt: `${day1}T10:30:00`,
    endAt: `${day1}T11:30:00`,
    day: 'Day 1',
    type: 'talk',
    level: 'intermediate',
    tags: ['federation', 'community', 'networks']
  },
  {
    id: 's3',
    title: 'Digital Signage Workshop: From Indico to Screens',
    abstract: 'Hands-on workshop on creating elegant digital signage solutions using Indico feeds and Screenly OSE for real-time event information display.',
    track: 'Technical',
    room: 'Workshop Room',
    speakers: [{ id: 'p3', name: 'Zara Imran', title: 'UX Engineer', company: 'Digital Displays Co.' }],
    startAt: `${day1}T14:00:00`,
    endAt: `${day1}T16:00:00`,
    day: 'Day 1',
    type: 'workshop',
    level: 'intermediate',
    tags: ['signage', 'indico', 'displays']
  },
  {
    id: 's4',
    title: 'Panel: Accessibility in Event Technology',
    abstract: 'A diverse panel discussing how to make event platforms more accessible and inclusive for attendees with different abilities and needs.',
    track: 'Accessibility',
    room: 'Room B',
    speakers: [
      { id: 'p4', name: 'Sarah Chen', title: 'Accessibility Consultant', company: 'Inclusive Design' },
      { id: 'p5', name: 'Ahmed Hassan', title: 'Assistive Tech Developer', company: 'AccessTech' },
      { id: 'p6', name: 'Maria Rodriguez', title: 'UX Researcher', company: 'Universal Design Lab' }
    ],
    startAt: `${day1}T16:30:00`,
    endAt: `${day1}T17:30:00`,
    day: 'Day 1',
    type: 'panel',
    level: 'beginner',
    tags: ['accessibility', 'inclusion', 'design']
  },

  // Day 2 - Technical Deep Dives
  {
    id: 's5',
    title: 'Microservices Architecture for Event Platforms',
    abstract: 'Learn how to design scalable event management systems using microservices, containerization, and cloud-native technologies.',
    track: 'Technical',
    room: 'Room A',
    speakers: [{ id: 'p7', name: 'David Kim', title: 'Senior Architect', company: 'CloudEvents Inc.' }],
    startAt: `${day2}T09:00:00`,
    endAt: `${day2}T10:00:00`,
    day: 'Day 2',
    type: 'talk',
    level: 'advanced',
    tags: ['microservices', 'architecture', 'scalability']
  },
  {
    id: 's6',
    title: 'Real-time Analytics for Event Insights',
    abstract: 'Implementing real-time analytics dashboards to track attendee engagement, session popularity, and event success metrics.',
    track: 'Analytics',
    room: 'Room B',
    speakers: [{ id: 'p8', name: 'Lisa Wang', title: 'Data Scientist', company: 'EventMetrics' }],
    startAt: `${day2}T10:30:00`,
    endAt: `${day2}T11:30:00`,
    day: 'Day 2',
    type: 'talk',
    level: 'intermediate',
    tags: ['analytics', 'data', 'insights']
  },
  {
    id: 's7',
    title: 'Security Best Practices for Event Platforms',
    abstract: 'Comprehensive guide to securing event management platforms, protecting attendee data, and ensuring privacy compliance.',
    track: 'Security',
    room: 'Room A',
    speakers: [{ id: 'p9', name: 'Alex Thompson', title: 'Security Engineer', company: 'SecureEvents' }],
    startAt: `${day2}T14:00:00`,
    endAt: `${day2}T15:00:00`,
    day: 'Day 2',
    type: 'talk',
    level: 'advanced',
    tags: ['security', 'privacy', 'compliance']
  },
  {
    id: 's8',
    title: 'Networking Break & Coffee Chat',
    abstract: 'Informal networking session with coffee and light refreshments. Great opportunity to connect with fellow attendees and speakers.',
    track: 'Networking',
    room: 'Lobby',
    speakers: [],
    startAt: `${day2}T15:30:00`,
    endAt: `${day2}T16:00:00`,
    day: 'Day 2',
    type: 'networking',
    level: 'beginner',
    tags: ['networking', 'coffee', 'social']
  },

  // Day 3 - Future & Innovation
  {
    id: 's9',
    title: 'AI and Machine Learning in Event Management',
    abstract: 'Exploring how artificial intelligence and machine learning can enhance event experiences through personalization, recommendations, and automation.',
    track: 'Innovation',
    room: 'Main Hall',
    speakers: [{ id: 'p10', name: 'Dr. Priya Patel', title: 'AI Research Lead', company: 'FutureEvents AI' }],
    startAt: `${day3}T09:00:00`,
    endAt: `${day3}T10:00:00`,
    day: 'Day 3',
    type: 'keynote',
    level: 'intermediate',
    tags: ['ai', 'ml', 'automation']
  },
  {
    id: 's10',
    title: 'Virtual and Hybrid Event Technologies',
    abstract: 'Best practices for creating engaging virtual and hybrid events, including platform selection, audience engagement, and technical considerations.',
    track: 'Virtual Events',
    room: 'Room A',
    speakers: [{ id: 'p11', name: 'Michael Brown', title: 'Virtual Events Specialist', company: 'HybridTech' }],
    startAt: `${day3}T10:30:00`,
    endAt: `${day3}T11:30:00`,
    day: 'Day 3',
    type: 'talk',
    level: 'intermediate',
    tags: ['virtual', 'hybrid', 'engagement']
  },
  {
    id: 's11',
    title: 'Closing Keynote: Building the Event Community of Tomorrow',
    abstract: 'Reflecting on the conference insights and looking ahead to the future of event management, community building, and technological innovation.',
    track: 'Keynote',
    room: 'Main Hall',
    speakers: [{ id: 'p12', name: 'Jennifer Lee', title: 'CEO', company: 'Global Events Network' }],
    startAt: `${day3}T16:00:00`,
    endAt: `${day3}T17:00:00`,
    day: 'Day 3',
    type: 'keynote',
    level: 'beginner',
    tags: ['closing', 'future', 'community']
  }
];
