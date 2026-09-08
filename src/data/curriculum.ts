import type {
  ClassCurriculumData,
  CurriculumSubjectData,
  CurriculumTopicData,
} from './curriculum-data/shared/types';

export type CurriculumTopic = CurriculumTopicData;
export type CurriculumSubject = CurriculumSubjectData;

export type Curriculum = {
  id: string;
  name: string;
  version: string;
  source: string;
  classes: string[];
  subjects: string[];
};

export const CLASS_LEVELS = [
  'JSS1',
  'JSS2',
  'JSS3',
  'SS1',
  'SS2',
  'SS3',
] as const;

export type ClassLevel = (typeof CLASS_LEVELS)[number];

export const CURRICULUMS: Curriculum[] = [
  {
    id: 'nerdc-basic-education',
    name: 'NERDC Basic Education Curriculum',
    version: '2025 Revised',
    source: 'NERDC',
    classes: ['JSS1', 'JSS2', 'JSS3'],
    subjects: [],
  },
  {
    id: 'nerdc-senior-secondary',
    name: 'NERDC Senior Secondary Education Curriculum',
    version: '2025 Revised',
    source: 'NERDC',
    classes: ['SS1', 'SS2', 'SS3'],
    subjects: [],
  },
];

const EXTERNAL_CURRICULA: Curriculum[] = [
  {
    id: 'junior-waec-bece',
    name: 'Junior WAEC / BECE',
    version: 'Current',
    source: 'External Examination',
    classes: ['JSS3'],
    subjects: [],
  },
  {
    id: 'neco-bece',
    name: 'NECO BECE',
    version: 'Current',
    source: 'External Examination',
    classes: ['JSS3'],
    subjects: [],
  },
  {
    id: 'lagos-state-bece',
    name: 'Lagos State BECE',
    version: 'Current',
    source: 'External Examination',
    classes: ['JSS3'],
    subjects: [],
  },
  {
    id: 'waec',
    name: 'WAEC',
    version: 'Current',
    source: 'External Examination',
    classes: ['SS3'],
    subjects: [],
  },
  {
    id: 'neco-ssce',
    name: 'NECO',
    version: 'Current',
    source: 'External Examination',
    classes: ['SS3'],
    subjects: [],
  },
  {
    id: 'gce',
    name: 'GCE',
    version: 'Current',
    source: 'External Examination',
    classes: ['SS3'],
    subjects: [],
  },
  {
    id: 'jamb-utme',
    name: 'JAMB / UTME',
    version: 'Current',
    source: 'External Examination',
    classes: ['SS3'],
    subjects: [],
  },
  {
    id: 'nabteb',
    name: 'NABTEB',
    version: 'Current',
    source: 'External Examination',
    classes: ['SS3'],
    subjects: [],
  },
];

export function getCurriculumsForClass(classLevel: string): Curriculum[] {
  return [...CURRICULUMS, ...EXTERNAL_CURRICULA].filter((curriculum) =>
    curriculum.classes.includes(classLevel)
  );
}

export function getCurricula(classLevel?: string): Curriculum[] {
  const allCurricula = [...CURRICULUMS, ...EXTERNAL_CURRICULA];

  if (!classLevel) return allCurricula;

  return allCurricula.filter((curriculum) =>
    curriculum.classes.includes(classLevel)
  );
}

export function getDepartments(classLevel: string): string[] {
  if (classLevel.startsWith('JSS')) {
    return ['Basic Education'];
  }

  return ['Science', 'Humanities', 'Business'];
}

export function definitionsForDepartment(
  classLevel: string,
  department: string
): string[] {
  if (classLevel.startsWith('JSS')) {
    return ['Basic Education'];
  }

  return [department];
}

/*
 * These legacy synchronous helpers are kept temporarily so existing
 * parts of the application continue to compile while pages migrate
 * to the Supabase curriculum service.
 *
 * New curriculum-aware pages should use:
 *   fetchClassCurriculum()
 *   fetchCurriculumSubjects()
 *   fetchCurriculumTopics()
 */

export function getSubjects(
  classLevel?: string,
  department?: string
): string[] {
  if (!classLevel) return [];

  if (classLevel.startsWith('JSS')) {
    return [];
  }

  if (department === 'Science') {
    return [
      'English Language',
      'General Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Agricultural Science',
      'Further Mathematics',
      'Geography',
      'Digital Technologies',
      'Physical Education',
      'Health Education',
      'Foods & Nutrition',
      'Technical Drawing',
    ];
  }

  if (department === 'Humanities') {
    return [
      'English Language',
      'General Mathematics',
      'Nigerian History',
      'Government',
      'Christian Religious Studies',
      'Islamic Studies',
      'Literature in English',
      'French',
      'Arabic',
      'Visual Arts',
      'Music',
    ];
  }

  if (department === 'Business') {
    return [
      'English Language',
      'General Mathematics',
      'Economics',
      'Accounting',
      'Commerce',
      'Marketing',
    ];
  }

  return [];
}

export function getSubjectsForClass(classLevel: string): string[] {
  return getSubjects(classLevel);
}

export function getSubject(
  subjectName: string,
  classLevel?: string
): CurriculumSubject | undefined {
  const subjects = getSubjects(classLevel);
  if (!subjects.includes(subjectName)) return undefined;

  return {
    id: subjectName.toLowerCase().replace(/\s+/g, '-'),
    name: subjectName,
    code: subjectName.toUpperCase().replace(/\s+/g, '_'),
    category: classLevel?.startsWith('JSS')
      ? 'Basic Education'
      : 'Senior Secondary',
    topics: [],
    sources: [],
  };
}

export function getTopics(
  subjectName: string,
  classLevel?: string
): CurriculumTopic[] {
  return getSubject(subjectName, classLevel)?.topics ?? [];
}

export function findTopic(
  subjectName: string,
  topicName: string,
  classLevel?: string
): CurriculumTopic | undefined {
  return getTopics(subjectName, classLevel).find(
    (topic) =>
      topic.name.toLowerCase() === topicName.toLowerCase() ||
      topic.title.toLowerCase() === topicName.toLowerCase()
  );
}

export function allSubjectNames(): string[] {
  return [];
}

export function allSubjects(): CurriculumSubject[] {
  return [];
}

export function subjectCategory(subject: string): string {
  const lower = subject.toLowerCase();

  if (
    [
      'physics',
      'chemistry',
      'biology',
      'agricultural science',
      'further mathematics',
      'geography',
      'technical drawing',
    ].includes(lower)
  ) {
    return 'Science';
  }

  if (
    [
      'government',
      'nigerian history',
      'christian religious studies',
      'islamic studies',
      'literature in english',
      'french',
      'arabic',
      'visual arts',
      'music',
    ].includes(lower)
  ) {
    return 'Humanities';
  }

  if (
    ['economics', 'accounting', 'commerce', 'marketing'].includes(lower)
  ) {
    return 'Business';
  }

  return 'Core / Other';
}

export function subjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    'English Language': '📖',
    'General Mathematics': '📐',
    Mathematics: '📐',
    Physics: '⚛️',
    Chemistry: '🧪',
    Biology: '🧬',
    'Agricultural Science': '🌱',
    'Further Mathematics': '📊',
    Geography: '🌍',
    'Digital Technologies': '💻',
    'Technical Drawing': '📏',
    Economics: '💰',
    Accounting: '🧾',
    Commerce: '🏪',
    Marketing: '📣',
    Government: '🏛️',
    'Nigerian History': '📜',
    'Literature in English': '📚',
    'Christian Religious Studies': '✝️',
    'Islamic Studies': '☪️',
    French: '🇫🇷',
    Arabic: 'ع',
    'Visual Arts': '🎨',
    Music: '🎵',
  };

  return icons[subject] ?? '📚';
}

export const classes = [...CLASS_LEVELS];

export type CurriculumData = ClassCurriculumData;
