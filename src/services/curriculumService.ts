import { supabase } from '@/lib/supabase';
import type {
  ClassCurriculumData,
  CurriculumSubjectData,
  CurriculumTopicData,
} from '@/data/curriculum-data/shared/types';

type CurriculumRow = {
  id: string;
  class_level: string;
  curriculum_version_id: string;
  curriculum_versions?: {
    curriculum_id: string;
    name: string;
    version: string;
    source: string;
    description: string | null;
  }[] | null;
};

type SubjectRow = {
  id: string;
  subject_code: string;
  name: string;
  category: string;
  description: string | null;
};

type TopicRow = {
  id: string;
  topic_code: string;
  title: string;
  description: string;
  subtopics: string[];
  objectives: string[];
  formulas: string[];
  practicals: string[];
  common_mistakes: string[];
  exam_tips: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimated_minutes: number;
  exam_relevance: 'Low' | 'Medium' | 'High';
  sort_order: number;
};

function mapTopic(row: TopicRow): CurriculumTopicData {
  return {
    id: row.topic_code,
    title: row.title,
    name: row.title,
    description: row.description,
    subtopics: row.subtopics ?? [],
    objectives: row.objectives ?? [],
    formulas: row.formulas ?? [],
    practicals: row.practicals ?? [],
    commonMistakes: row.common_mistakes ?? [],
    examTips: row.exam_tips ?? [],
    difficulty: row.difficulty,
    minutes: row.estimated_minutes,
    estimatedMinutes: row.estimated_minutes,
    examRelevance: row.exam_relevance,
  };
}

function mapSubject(
  row: SubjectRow,
  topics: CurriculumTopicData[]
): CurriculumSubjectData {
  return {
    id: row.id,
    name: row.name,
    code: row.subject_code,
    category: row.category,
    topics,
    sources: [],
  };
}

export async function fetchClassCurriculum(
  classLevel: ClassCurriculumData['classLevel']
): Promise<ClassCurriculumData | null> {
  const { data, error } = await supabase
    .from('curriculum_classes')
    .select(`
      id,
      class_level,
      curriculum_version_id,
      curriculum_versions (
        curriculum_id,
        name,
        version,
        source,
        description
      )
    `)
    .eq('class_level', classLevel);

  if (error) {
    console.error('Failed to load curriculum:', error);
    return null;
  }

  const classRows = (data ?? []) as CurriculumRow[];

  if (classRows.length === 0) {
    return null;
  }

  const subjects: CurriculumSubjectData[] = [];

  for (const classRow of classRows) {
    const { data: subjectRows, error: subjectError } = await supabase
      .from('curriculum_subjects')
      .select('id, subject_code, name, category, description')
      .eq('curriculum_class_id', classRow.id)
      .order('name');

    if (subjectError) {
      console.error('Failed to load curriculum subjects:', subjectError);
      continue;
    }

    for (const subject of (subjectRows ?? []) as SubjectRow[]) {
      const { data: topicRows, error: topicError } = await supabase
        .from('curriculum_topics')
        .select(`
          id,
          topic_code,
          title,
          description,
          subtopics,
          objectives,
          formulas,
          practicals,
          common_mistakes,
          exam_tips,
          difficulty,
          estimated_minutes,
          exam_relevance,
          sort_order
        `)
        .eq('subject_id', subject.id)
        .order('sort_order');

      if (topicError) {
        console.error('Failed to load curriculum topics:', topicError);
        continue;
      }

      subjects.push(
        mapSubject(
          subject,
          ((topicRows ?? []) as TopicRow[]).map(mapTopic)
        )
      );
    }
  }

  const firstVersion = classRows[0].curriculum_versions?.[0];

  return {
    classLevel,
    curriculumName:
      firstVersion?.name ?? 'Nigerian Secondary School Curriculum',
    curriculumVersion: firstVersion?.version ?? 'Current',
    subjects,
    sources: [],
  };
}

export async function fetchCurriculumSubjects(
  classLevel: ClassCurriculumData['classLevel']
): Promise<CurriculumSubjectData[]> {
  const curriculum = await fetchClassCurriculum(classLevel);
  return curriculum?.subjects ?? [];
}

export async function fetchCurriculumTopics(
  classLevel: ClassCurriculumData['classLevel'],
  subjectCodeOrName: string
): Promise<CurriculumTopicData[]> {
  const subjects = await fetchCurriculumSubjects(classLevel);
  const target = subjectCodeOrName.trim().toLowerCase();

  const subject = subjects.find(
    (item) =>
      item.name.toLowerCase() === target ||
      item.code.toLowerCase() === target
  );

  return subject?.topics ?? [];
}
