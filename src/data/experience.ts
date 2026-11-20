// Work experience, matching the Experience section of the resume.
// Client details were checked against 7xllabs.com, codeeraa.in and
// garamshalacafe.in on 2026-11-19.

export interface ClientWork {
  client: string
  /** What the client business is, in a few words. */
  about: string
  site: string
  /** The part of the client's product Tejas worked on. */
  area: string
  summary: string
}

export interface ExperienceEntry {
  id: string
  company: string
  companyAbout: string
  companySite: string
  role: string
  /** ISO month, for the <time> element. */
  start: string
  startLabel: string
  /** Undefined while the role is ongoing. */
  end?: string
  endLabel: string
  stack: string[]
  intro: string
  clients: ClientWork[]
}

export const experience: ExperienceEntry[] = [
  {
    id: '7xlabs',
    company: '7XLabs',
    companyAbout: 'Software studio in Nagpur and Bengaluru building web apps and ordering systems',
    companySite: 'https://7xllabs.com',
    role: 'Backend Developer Intern',
    start: '2026-08',
    startLabel: 'Aug 2026',
    endLabel: 'Present',
    stack: ['Node.js', 'Next.js', 'TypeScript', 'Firebase'],
    intro: 'Building backend systems for live client products, working with the founding team.',
    clients: [
      {
        client: 'Code Era Institute',
        about: 'Tech-training institute, Nagpur',
        site: 'https://codeeraa.in',
        area: 'LMS portal',
        summary:
          'Developed the backend of the learning portal: student authentication, recorded-lecture access, and APIs that track lecture progress, assignments, grading and quiz scores for the student and instructor dashboards.',
      },
      {
        client: 'Garamshala Café',
        about: '24/7 café and coworking space, Nagpur',
        site: 'https://garamshalacafe.in',
        area: 'Billing system',
        summary:
          "Built the billing system for the café's QR table-ordering platform, turning each table's orders into itemised bills with taxes and totals, consistent from the kitchen feed to checkout.",
      },
    ],
  },
]
