export type CurriculumSource = {
  name: string;
  url?: string;
  version?: string;
  lastVerified?: string;
};

export type CurriculumTopicData = {
  id: string;
  title: string;
  name: string;
  description: string;
  subtopics: string[];
  objectives: string[];
  formulas: string[];
  practicals?: string[];
  commonMistakes?: string[];
  examTips?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  minutes: number;
  estimatedMinutes: number;
  examRelevance: 'Low' | 'Medium' | 'High';
};

export type CurriculumSubjectData = {
  id: string;
  name: string;
  code: string;
  category: string;
  topics: CurriculumTopicData[];
  sources: CurriculumSource[];
};

export type ClassCurriculumData = {
  classLevel: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
  curriculumName: string;
  curriculumVersion: string;
  subjects: CurriculumSubjectData[];
  sources: CurriculumSource[];
};
