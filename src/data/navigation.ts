/** Home-page sections, in page order. The nav links to these. */
export const sections = [
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'activity', label: 'Activity' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']
