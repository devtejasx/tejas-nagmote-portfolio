export interface EducationEntry {
  institution: string
  place?: string
  credential: string
  /** Start year, when the entry is a range. */
  start?: number
  end: number
  coursework?: string[]
}

/** Newest first. The university entry is from the resume; the school entries were supplied by Tejas. */
export const education: EducationEntry[] = [
  {
    institution: 'PES University',
    place: 'Bangalore, India',
    credential: 'B.Tech — Computer Science and Engineering',
    start: 2023,
    end: 2027,
    coursework: [
      'Operating Systems',
      'DBMS',
      'Computer Architecture',
      'Computational Theory',
      'Learning Algorithms',
    ],
  },
  {
    institution: 'SSVPS Lt. Kr. Dr. P. R. Ghogrey Science College',
    credential: 'Higher Secondary Certificate (HSC) — Science',
    end: 2023,
  },
  {
    institution: 'North Point School',
    credential: 'ICSE — Science, Mathematics, Computer Applications',
    end: 2020,
  },
]

export const university = education[0]
