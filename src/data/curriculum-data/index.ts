import type {
  ClassCurriculumData,
  CurriculumSubjectData,
  CurriculumTopicData,
} from './shared/types';

export type { 
  ClassCurriculumData,
  CurriculumSubjectData,
  CurriculumTopicData,
};

export const curriculumDatabase: Record<
  ClassCurriculumData['classLevel'],
  ClassCurriculumData
> = {
  JSS1: {
    classLevel: 'JSS1',
    curriculumName: 'NERDC Basic Education Curriculum',
    curriculumVersion: '2025 Revised',
    subjects: [],
    sources: [],
  },

  JSS2: {
    classLevel: 'JSS2',
    curriculumName: 'NERDC Basic Education Curriculum',
    curriculumVersion: '2025 Revised',
    subjects: [],
    sources: [],
  },

  JSS3: {
    classLevel: 'JSS3',
    curriculumName: 'NERDC Basic Education Curriculum',
    curriculumVersion: '2025 Revised',
    subjects: [],
    sources: [],
  },

  SS1: {
    classLevel: 'SS1',
    curriculumName: 'NERDC Senior Secondary Curriculum',
    curriculumVersion: '2025 Revised',
    subjects: [],
    sources: [],
  },

  SS2: {
    classLevel: 'SS2',
    curriculumName: 'NERDC Senior Secondary Curriculum',
    curriculumVersion: '2025 Revised',
    subjects: [],
    sources: [],
  },

  SS3: {
    classLevel: 'SS3',
    curriculumName: 'NERDC Senior Secondary Curriculum',
    curriculumVersion: '2025 Revised',
    subjects: [],
    sources: [],
  },
};

export function getClassCurriculum(
  classLevel: ClassCurriculumData['classLevel']
): ClassCurriculumData {
  return curriculumDatabase[classLevel];
}

export function getCurriculumSubjects(
  classLevel: ClassCurriculumData['classLevel']
): CurriculumSubjectData[] {
  return curriculumDatabase[classLevel].subjects;
}

export function getCurriculumSubject(
  classLevel: ClassCurriculumData['classLevel'],
  subject: string
): CurriculumSubjectData | undefined {
  const target = subject.trim().toLowerCase();

  return getCurriculumSubjects(classLevel).find(
    (item) =>
      item.name.toLowerCase() === target ||
      item.code.toLowerCase() === target
  );
}

export function getCurriculumTopics(
  classLevel: ClassCurriculumData['classLevel'],
  subject: string
): CurriculumTopicData[] {
  return getCurriculumSubject(classLevel, subject)?.topics ?? [];
}

export function findCurriculumTopic(
  classLevel: ClassCurriculumData['classLevel'],
  subject: string,
  topic: string
): CurriculumTopicData | undefined {
  const target = topic.trim().toLowerCase();

  return getCurriculumTopics(classLevel, subject).find(
    (item) =>
      item.title.toLowerCase() === target ||
      item.name.toLowerCase() === target ||
      item.id.toLowerCase() === target
  );
}
