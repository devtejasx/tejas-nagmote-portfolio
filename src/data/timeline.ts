import { education } from './education'

export interface TimelineStop {
  id: string
  /** A year from the resume, or a label for undated, ongoing work. */
  when: string
  title: string
  place?: string
  points: string[]
  kind: 'education' | 'engineering' | 'future'
}

const [university, hsc, icse] = education

/**
 * Only dates the resume states. Current engineering work is shown as "Now"
 * rather than given dates the resume does not have.
 */
export const timeline: TimelineStop[] = [
  {
    id: 'icse',
    when: String(icse.end),
    title: 'ICSE completed',
    place: icse.institution,
    points: ['Science, Mathematics, Computer Applications'],
    kind: 'education',
  },
  {
    id: 'hsc',
    when: String(hsc.end),
    title: 'HSC completed',
    place: hsc.institution,
    points: ['Higher Secondary Certificate, Science'],
    kind: 'education',
  },
  {
    id: 'btech',
    when: String(university.start),
    title: 'B.Tech CSE begins',
    place: `${university.institution}, Bangalore`,
    points: ['Computer Science and Engineering'],
    kind: 'education',
  },
  {
    id: 'now',
    when: 'Now',
    title: 'Systems, backend and open source',
    points: [
      '41 merged pull requests across 8 external open-source projects',
      'Real-Time Chat Server in C++20, validated by 413 GoogleTest tests',
      'Building DeployX, a self-service deployment platform (in progress)',
    ],
    kind: 'engineering',
  },
  {
    id: 'graduation',
    when: String(university.end),
    title: 'B.Tech CSE completes',
    place: university.institution,
    points: ['End of the 2023–2027 programme'],
    kind: 'future',
  },
]
