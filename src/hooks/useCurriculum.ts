import { useEffect, useState } from 'react';
import type {
  ClassCurriculumData,
  CurriculumSubjectData,
  CurriculumTopicData,
} from '@/data/curriculum-data/shared/types';
import {
  fetchClassCurriculum,
  fetchCurriculumTopics,
} from '@/services/curriculumService';

export function useCurriculum(
  classLevel: ClassCurriculumData['classLevel'] | null
) {
  const [curriculum, setCurriculum] =
    useState<ClassCurriculumData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!classLevel) {
        setCurriculum(null);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await fetchClassCurriculum(classLevel);

      if (cancelled) return;

      if (!result) {
        setError('Unable to load curriculum.');
      }

      setCurriculum(result);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [classLevel]);

  return {
    curriculum,
    subjects: curriculum?.subjects ?? [],
    loading,
    error,
  };
}

export function useCurriculumTopics(
  classLevel: ClassCurriculumData['classLevel'] | null,
  subject: string | null
) {
  const [topics, setTopics] = useState<CurriculumTopicData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!classLevel || !subject) {
        setTopics([]);
        return;
      }

      setLoading(true);

      const result = await fetchCurriculumTopics(classLevel, subject);

      if (!cancelled) {
        setTopics(result);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [classLevel, subject]);

  return { topics, loading };
}

export type { CurriculumSubjectData, CurriculumTopicData };
