// The resume's "Technical Skills" block, one category per line.

export interface SkillCategory {
  id: string
  title: string
  /** Short mono-font tag shown on the card. */
  tag: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    tag: 'lang',
    skills: ['C++20', 'JavaScript ES6+', 'SQL'],
  },
  {
    id: 'systems',
    title: 'Systems & Concurrency',
    tag: 'sys',
    skills: [
      'Multithreading',
      'Synchronization & Thread Safety',
      'Memory Management / RAII',
      'Linux',
      'CMake',
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    tag: 'api',
    skills: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'API Design',
      'WebSockets',
      'JWT Authentication',
    ],
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    tag: 'dist',
    skills: ['Redis Pub/Sub', 'Prometheus', 'Distributed Tracing'],
  },
  {
    id: 'databases',
    title: 'Databases',
    tag: 'db',
    skills: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL'],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    tag: 'ops',
    skills: ['Docker', 'GitHub Actions', 'AWS EC2', 'AWS RDS'],
  },
  {
    id: 'testing',
    title: 'Testing & Tools',
    tag: 'test',
    skills: ['GoogleTest', 'Postman', 'Git', 'GitHub'],
  },
  {
    id: 'fundamentals',
    title: 'CS Fundamentals',
    tag: 'cs',
    skills: [
      'Data Structures & Algorithms',
      'OOP',
      'Operating Systems',
      'DBMS',
      'Computer Networks',
      'System Design',
    ],
  },
]
