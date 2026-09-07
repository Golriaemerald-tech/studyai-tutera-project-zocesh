import { useMemo, useState } from 'react';
import { BookOpen, Clock, GraduationCap, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  CLASS_LEVELS,
  getCurricula,
  getDepartments,
  getSubjects,
} from '../data/curriculum';

export const StudyMode = () => {
  const { user } = useAuth();

  const initialClass =
    user?.studentClass && CLASS_LEVELS.includes(user.studentClass as typeof CLASS_LEVELS[number])
      ? user.studentClass
      : 'SS3';

  const initialDepartment =
    user?.department && getDepartments(initialClass).includes(user.department)
      ? user.department
      : getDepartments(initialClass)[0];

  const [classLevel, setClassLevel] = useState(initialClass);
  const [department, setDepartment] = useState(initialDepartment);
  const [subject, setSubject] = useState(getSubjects(initialClass, initialDepartment)[0]);
  const [curriculum, setCurriculum] = useState(getCurricula(initialClass)[0]);
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState(10);
  const [minutes, setMinutes] = useState(30);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studyQuestions, setStudyQuestions] = useState<string[]>([]);

  const departments = useMemo(
    () => getDepartments(classLevel),
    [classLevel]
  );

  const subjects = useMemo(
    () => getSubjects(classLevel, department),
    [classLevel, department]
  );

  const curricula = useMemo(
    () => getCurricula(classLevel),
    [classLevel]
  );

  function changeClass(value: string) {
    const nextDepartments = getDepartments(value);
    const nextDepartment = nextDepartments[0];
    const nextSubjects = getSubjects(value, nextDepartment);
    const nextCurricula = getCurricula(value);

    setClassLevel(value);
    setDepartment(nextDepartment);
    setSubject(nextSubjects[0]);
    setCurriculum(nextCurricula[0]);
  }

  async function startStudy() {
    if (!topic.trim() || loading) return;

    setLoading(true);
    setStarted(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create ${questions} study questions about "${topic}" in ${subject} for ${classLevel}, ${department} department, following ${curriculum}. Number each question. Do not provide the answers yet.`,
          systemInstruction: `You are Zocesh Study AI Study Mode.
Create accurate Nigerian secondary-school study questions.
Student class: ${classLevel}
Department: ${department}
Subject: ${subject}
Curriculum: ${curriculum}
Topic: ${topic}
Return exactly ${questions} numbered questions.
Keep them appropriate for the student's level.`,
          maxOutputTokens: 4096,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Could not generate study questions.');
      }

      const text = data?.text || 'No questions were generated.';
      setStudyQuestions(
        text
          .split(/\n(?=\s*\d+[\.\)])/)
          .map((item: string) => item.trim())
          .filter(Boolean)
      );
    } catch (error) {
      console.error('Study Mode error:', error);
      setStudyQuestions([
        'Sorry sir, Study Mode could not generate the questions right now. Please try again.',
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (started) {
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Study Session</h1>
              <p className="text-sm text-white/60">
                {subject} • {classLevel} • {curriculum}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock size={17} />
              {minutes} min
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {studyQuestions.map((question, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white"
            >
              {question}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setStarted(false);
            setStudyQuestions([]);
          }}
          className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/15"
        >
          Start Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={25} />
          <h1 className="text-2xl font-bold">Study Mode</h1>
        </div>
        <p className="text-sm text-white/60">
          Build a focused study session with questions matched to your class and curriculum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-white/70">Class</span>
          <select
            value={classLevel}
            onChange={(e) => changeClass(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          >
            {CLASS_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Department</span>
          <select
            value={department}
            onChange={(e) => {
              const value = e.target.value;
              setDepartment(value);
              setSubject(getSubjects(classLevel, value)[0]);
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Subject</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          >
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Curriculum / Examination</span>
          <select
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          >
            {curricula.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-white/70">Topic</span>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Quadratic equations"
          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none placeholder:text-white/30"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-white/70">
            Number of questions: {questions}
          </span>
          <input
            type="range"
            min="1"
            max="50"
            value={questions}
            onChange={(e) => setQuestions(Number(e.target.value))}
            className="w-full"
          />
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm text-white/70">
            <Clock size={16} />
            Study time: {minutes} minutes
          </span>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-white/40">Maximum: 2 hours 30 minutes</span>
        </label>
      </div>

      <button
        onClick={startStudy}
        disabled={!topic.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          'Generating Study Session...'
        ) : (
          <>
            <Play size={18} />
            Start Study Session
          </>
        )}
      </button>

      <div className="flex items-center gap-2 text-xs text-white/40">
        <GraduationCap size={15} />
        Questions are generated according to your selected class, department and curriculum.
      </div>
    </div>
  );
};


export default StudyMode;
