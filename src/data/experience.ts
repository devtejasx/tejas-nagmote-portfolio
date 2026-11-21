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
  /** Usage figures for the client's system, shown as small chips. */
  scale: string[]
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
        scale: ['50–100 registered users', '~40 active students'],
        summary:
          'Developed the backend of the learning portal: login, lecture access, the student and instructor dashboards, and the APIs for progress, assignments, grading and quizzes.',
      },
      {
        client: 'Garamshala Café',
        about: '24/7 café and coworking space, Nagpur',
        site: 'https://garamshalacafe.in',
        area: 'Billing system',
        scale: ['~120 orders a day'],
        summary:
          "Built the billing system for the café's QR table-ordering platform, turning every order into an itemised bill with taxes and totals, consistent from the kitchen feed to checkout.",
      },
    ],
  },
]
