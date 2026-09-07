import type {
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
  subjects: CurriculumSubject[];
};

export const CLASS_LEVELS = [
  'JSS1',
  'JSS2',
  'JSS3',
  'SS1',
  'SS2',
  'SS3',
] as const;

type SubjectDefinition = [string, string, string];

const JSS_SUBJECTS: SubjectDefinition[] = [
  ['English Studies', 'english', 'Languages'],
  ['Mathematics', 'mathematics', 'Mathematics'],
  ['Basic Science and Technology', 'bst', 'Science'],
  ['Social Studies', 'social-studies', 'Social Science'],
  ['Civic Education', 'civic', 'National Values'],
  ['Cultural and Creative Arts', 'cca', 'Creative Arts'],
  ['Business Studies', 'business', 'Business'],
  ['Computer Studies', 'computer', 'Technology'],
  ['Agricultural Science', 'agriculture', 'Pre-Vocational'],
  ['Home Economics', 'home-economics', 'Pre-Vocational'],
  ['French', 'french', 'Languages'],
  ['Christian Religious Studies', 'crs', 'Religion'],
  ['Islamic Studies', 'islamic-studies', 'Religion'],
  ['History', 'history', 'Humanities'],
  ['Yoruba', 'yoruba', 'Languages'],
  ['Igbo', 'igbo', 'Languages'],
  ['Hausa', 'hausa', 'Languages'],
];

const SCIENCE_SUBJECTS: SubjectDefinition[] = [
  ['English Language', 'english', 'Core'],
  ['General Mathematics', 'mathematics', 'Core'],
  ['Physics', 'physics', 'Science'],
  ['Chemistry', 'chemistry', 'Science'],
  ['Biology', 'biology', 'Science'],
  ['Agricultural Science', 'agriculture', 'Science'],
  ['Further Mathematics', 'further-mathematics', 'Science'],
  ['Geography', 'geography', 'Science'],
  ['Digital Technologies', 'digital-technologies', 'Technology'],
  ['Physical Education', 'physical-education', 'Science'],
  ['Health Education', 'health-education', 'Science'],
  ['Foods and Nutrition', 'foods-nutrition', 'Science'],
  ['Technical Drawing', 'technical-drawing', 'Technology'],
];

const HUMANITIES_SUBJECTS: SubjectDefinition[] = [
  ['English Language', 'english', 'Core'],
  ['General Mathematics', 'mathematics', 'Core'],
  ['Nigerian History', 'history', 'Humanities'],
  ['Government', 'government', 'Humanities'],
  ['Christian Religious Studies', 'crs', 'Humanities'],
  ['Islamic Studies', 'islamic-studies', 'Humanities'],
  ['Literature in English', 'literature', 'Humanities'],
  ['French', 'french', 'Languages'],
  ['Arabic', 'arabic', 'Languages'],
  ['Visual Arts', 'visual-arts', 'Creative Arts'],
  ['Music', 'music', 'Creative Arts'],
];

const BUSINESS_SUBJECTS: SubjectDefinition[] = [
  ['English Language', 'english', 'Core'],
  ['General Mathematics', 'mathematics', 'Core'],
  ['Economics', 'economics', 'Business'],
  ['Accounting', 'accounting', 'Business'],
  ['Commerce', 'commerce', 'Business'],
  ['Marketing', 'marketing', 'Business'],
];

function createSubject(
  name: string,
  code: string,
  category: string
): CurriculumSubject {
  return {
    id: code,
    name,
    code,
    category,
    topics: [],
    sources: [],
  };
}

function createCurriculum(
  id: string,
  name: string,
  version: string,
  source: string,
  classes: string[],
  definitions: SubjectDefinition[]
): Curriculum {
  return {
    id,
    name,
    version,
    source,
    classes,
    subjects: definitions.map(([name, code, category]) =>
      createSubject(name, code, category)
    ),
  };
}

export const CURRICULUMS: Curriculum[] = [
  createCurriculum(
    'nerdc-basic',
    'NERDC Basic Education Curriculum',
    '2025 Revised',
    'NERDC',
    ['JSS1', 'JSS2', 'JSS3'],
    JSS_SUBJECTS
  ),
  createCurriculum(
    'nerdc-science',
    'NERDC Senior Secondary — Science',
    '2025 Revised',
    'NERDC',
    ['SS1', 'SS2', 'SS3'],
    SCIENCE_SUBJECTS
  ),
  createCurriculum(
    'nerdc-humanities',
    'NERDC Senior Secondary — Humanities',
    '2025 Revised',
    'NERDC',
    ['SS1', 'SS2', 'SS3'],
    HUMANITIES_SUBJECTS
  ),
  createCurriculum(
    'nerdc-business',
    'NERDC Senior Secondary — Business',
    '2025 Revised',
    'NERDC',
    ['SS1', 'SS2', 'SS3'],
    BUSINESS_SUBJECTS
  ),
];

export function getCurriculumsForClass(classLevel: string): Curriculum[] {
  return CURRICULUMS.filter((curriculum) =>
    curriculum.classes.includes(classLevel)
  );
}

export function getCurricula(classLevel: string): string[] {
  if (classLevel === 'JSS3') {
    return [
      'NERDC Basic Education Curriculum',
      'Junior WAEC / NECO',
      'BECE — Lagos State',
    ];
  }

  if (classLevel === 'SS3') {
    return [
      'NERDC Senior Secondary Curriculum',
      'WAEC',
      'JAMB',
      'NECO',
      'GCE',
    ];
  }

  return getCurriculumsForClass(classLevel).map(
    (curriculum) => curriculum.name
  );
}

export function getDepartments(classLevel: string): string[] {
  if (classLevel.startsWith('JSS')) {
    return ['General'];
  }

  return ['Science', 'Humanities', 'Business'];
}

function definitionsForDepartment(
  department: string
): SubjectDefinition[] {
  if (department === 'Humanities') return HUMANITIES_SUBJECTS;
  if (department === 'Business') return BUSINESS_SUBJECTS;
  return SCIENCE_SUBJECTS;
}

export function getSubjects(
  classLevel: string,
  department = 'Science'
): string[] {
  if (classLevel.startsWith('JSS')) {
    return JSS_SUBJECTS.map(([name]) => name);
  }

  return definitionsForDepartment(department).map(([name]) => name);
}

/**
 * Returns every subject available to a class.
 * For senior secondary this merges Science, Humanities and Business
 * instead of accidentally returning only the first department.
 */
export function getSubjectsForClass(
  classLevel: string,
  curriculumId?: string
): CurriculumSubject[] {
  if (curriculumId) {
    const curriculum = CURRICULUMS.find(
      (item) => item.id === curriculumId
    );

    if (curriculum) {
      return curriculum.subjects;
    }
  }

  const curricula = getCurriculumsForClass(classLevel);

  const merged = new Map<string, CurriculumSubject>();

  for (const curriculum of curricula) {
    for (const subject of curriculum.subjects) {
      if (!merged.has(subject.code)) {
        merged.set(subject.code, subject);
      }
    }
  }

  return Array.from(merged.values());
}

export function getSubject(
  subjectName: string,
  classLevel = 'SS3'
): CurriculumSubject | undefined {
  const target = subjectName.trim().toLowerCase();

  return getSubjectsForClass(classLevel).find(
    (subject) =>
      subject.name.toLowerCase() === target ||
      subject.code.toLowerCase() === target
  );
}

export function getTopics(
  classLevel: string,
  subject: string,
  curriculumId?: string
): CurriculumTopic[] {
  return (
    getSubjectsForClass(classLevel, curriculumId).find(
      (item) => item.name.toLowerCase() === subject.trim().toLowerCase()
    )?.topics ?? []
  );
}

export function findTopic(
  subjectName: string,
  topicName: string,
  classLevel = 'SS3'
): CurriculumTopic | undefined {
  const target = topicName.trim().toLowerCase();

  return getSubject(subjectName, classLevel)?.topics.find(
    (topic) =>
      topic.title.toLowerCase() === target ||
      topic.id.toLowerCase() === target
  );
}

export function allSubjectNames(classLevel = 'SS3'): string[] {
  return getSubjectsForClass(classLevel).map((subject) => subject.name);
}

export const allSubjects = allSubjectNames;

export function subjectCategory(subjectName: string): string {
  const subject = getSubject(subjectName);

  if (subject) return subject.category;

  const lower = subjectName.toLowerCase();

  if (
    ['physics', 'chemistry', 'biology', 'agriculture', 'geography'].some(
      (item) => lower.includes(item)
    )
  ) {
    return 'Science';
  }

  if (
    ['economics', 'accounting', 'commerce', 'marketing'].some(
      (item) => lower.includes(item)
    )
  ) {
    return 'Business';
  }

  if (
    ['government', 'history', 'literature', 'religious', 'french', 'arabic'].some(
      (item) => lower.includes(item)
    )
  ) {
    return 'Humanities';
  }

  return 'Core';
}

export function subjectIcon(subjectName: string): string {
  const name = subjectName.toLowerCase();

  if (name.includes('math')) return 'Calculator';
  if (name.includes('physics')) return 'Atom';
  if (name.includes('chemistry')) return 'FlaskConical';
  if (name.includes('biology')) return 'Dna';
  if (name.includes('english')) return 'Languages';
  if (name.includes('computer') || name.includes('digital')) return 'Monitor';
  if (name.includes('geography')) return 'Globe';
  if (name.includes('history')) return 'Landmark';
  if (name.includes('government')) return 'Landmark';
  if (name.includes('economics')) return 'TrendingUp';
  if (name.includes('account')) return 'Calculator';
  if (name.includes('commerce') || name.includes('business')) {
    return 'BriefcaseBusiness';
  }
  if (name.includes('literature')) return 'BookOpen';
  if (name.includes('agric')) return 'Sprout';

  return 'BookOpen';
}

export const classes: Record<
  string,
  Record<string, CurriculumSubject>
> = {};

for (const level of CLASS_LEVELS) {
  classes[level] = {};

  for (const subject of getSubjectsForClass(level)) {
    classes[level][subject.name] = subject;
  }
}
