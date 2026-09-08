import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, GraduationCap, Play, Send, XCircle } from 'lucide-react';
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
  const [curriculum, setCurriculum] = useState(
    getCurricula(initialClass)[0]?.id ?? ''
  );
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState(10);
  const [minutes, setMinutes] = useState(30);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionType, setQuestionType] = useState<'objectives' | 'theory' | 'mixed'>('objectives');
  const [studyMode, setStudyMode] = useState<'test' | 'exam'>('test');

  const [studyQuestions, setStudyQuestions] = useState<{
    question: string;
    type: 'objective' | 'theory';
    options?: string[];
  }[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<{
    correct: boolean;
    feedback: string;
    correctAnswer?: string;
    strengths?: string;
    improvements?: string;
  } | null>(null);
  const [results, setResults] = useState<{
    correct: boolean;
    feedback: string;
    correctAnswer?: string;
    strengths?: string;
    improvements?: string;
  }[]>([]);
  const [finished, setFinished] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

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
    setCurriculum(nextCurricula[0]?.id ?? '');
  }

  async function startStudy() {
    if (!topic.trim() || loading) return;

    setLoading(true);
    setStarted(false);
    setFinished(false);
    setResults([]);

    const effectiveType = studyMode === 'exam' ? 'objectives' : questionType;

    try {
      const typeInstruction =
        effectiveType === 'objectives'
          ? 'Create multiple-choice objective questions. Every question must have exactly four options labelled A, B, C and D.'
          : effectiveType === 'theory'
            ? 'Create theory questions requiring students to type their own answers. Do not provide multiple-choice options.'
            : 'Create a mixture of objective and theory questions. Alternate between objective and theory where possible. Objective questions must have four options labelled A, B, C and D.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create ${questions} ${effectiveType} questions about "${topic}" in ${subject} for ${classLevel}, ${department}, following ${curriculum}.

${typeInstruction}

Do not provide answers.
Number every question.
Put objective options on separate lines.`,
          systemInstruction: `You are Zocesh Study AI Study Mode.
Create accurate Nigerian secondary-school questions.
Class: ${classLevel}
Department: ${department}
Subject: ${subject}
Curriculum: ${curriculum}
Topic: ${topic}
Question type: ${effectiveType}
Mode: ${studyMode}
Return exactly ${questions} questions.
Never include the answer key.`,
          maxOutputTokens: 8192,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Could not generate study questions.');
      }

      const text = String(data?.text || '');

      const blocks = text
        .split(/\n(?=\s*(?:\d+[\.\)]|Q(?:uestion)?\s*\d+))/i)
        .map((item) => item.trim())
        .filter(Boolean);

      const parsed = blocks.map((block, index) => {
        const cleaned = block.replace(
          /^\s*(?:\d+[\.\)]|Q(?:uestion)?\s*\d+[:\.\)]?)\s*/i,
          ''
        );

        const matches = cleaned.match(
          /(?:^|\n)\s*[A-D][\.\)]\s*.+?(?=\n\s*[A-D][\.\)]|\s*$)/gis
        );

        const options = matches
          ? matches.map((item) => item.replace(/\n/g, ' ').trim())
          : [];

        const mixedTheory = effectiveType === 'mixed' && index % 2 === 1;
        const isTheory = effectiveType === 'theory' || mixedTheory;

        let question = cleaned;

        if (!isTheory && options.length) {
          const optionStart = cleaned.search(/\n?\s*[A-D][\.\)]\s*/i);
          if (optionStart >= 0) question = cleaned.slice(0, optionStart).trim();
        }

        return {
          question,
          type: isTheory ? 'theory' as const : 'objective' as const,
          options: isTheory ? undefined : options,
        };
      });

      if (!parsed.length) {
        throw new Error('No usable questions were generated.');
      }

      setStudyQuestions(parsed);
      setCurrentQuestion(0);
      setSelectedAnswer('');
      setWrittenAnswer('');
      setEvaluation(null);
      setStarted(true);
    } catch (error) {
      console.error('Study Mode error:', error);
      setStudyQuestions([{
        question: 'Sorry sir, Study Mode could not generate the questions right now. Please try again.',
        type: 'theory',
      }]);
      setStarted(true);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateAnswer(answer: string) {
    const current = studyQuestions[currentQuestion];

    if (!current || !answer.trim() || evaluating) return;

    setEvaluating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: current.type === 'objective'
            ? `Evaluate this student's objective answer.

Question:
${current.question}

Options:
${current.options?.join('\n')}

Student selected:
${answer}

Explain whether it is correct, why, and give the correct answer.`
            : `Evaluate this student's theory answer.

Question:
${current.question}

Student answer:
${answer}

Explain what is correct, what is incorrect or missing, the correct answer, and what the student should work on.`,
          systemInstruction: `You are the answer evaluator for Zocesh Study AI.
Evaluate a ${classLevel} ${subject} answer accurately and fairly.
Return JSON only:
{
  "correct": true,
  "feedback": "explanation",
  "correctAnswer": "correct answer",
  "strengths": "what was done well",
  "improvements": "what needs work"
}`,
          maxOutputTokens: 2048,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Could not evaluate the answer.');
      }

      let result;

      try {
        result = JSON.parse(
          String(data?.text || '')
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim()
        );
      } catch {
        result = {
          correct: false,
          feedback: data?.text || 'The AI could not evaluate this answer.',
        };
      }

      setEvaluation(result);
      setResults((previous) => [...previous, result]);
    } catch (error) {
      console.error('Answer evaluation error:', error);
      setEvaluation({
        correct: false,
        feedback: 'Sorry sir, I could not evaluate this answer right now.',
      });
    } finally {
      setEvaluating(false);
    }
  }

  function submitAnswer() {
    const answer =
      studyQuestions[currentQuestion]?.type === 'objective'
        ? selectedAnswer
        : writtenAnswer;

    if (answer.trim()) void evaluateAnswer(answer);
  }

  function nextQuestion() {
    if (currentQuestion >= studyQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((value) => value + 1);
    setSelectedAnswer('');
    setWrittenAnswer('');
    setEvaluation(null);
  }

  function resetSession() {
    setStarted(false);
    setFinished(false);
    setStudyQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setWrittenAnswer('');
    setEvaluation(null);
    setResults([]);
  }

  if (started && finished) {
    const score = results.filter((item) => item.correct).length;
    const percentage = results.length
      ? Math.round((score / results.length) * 100)
      : 0;

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <GraduationCap className="mx-auto mb-3" size={34} />
          <h1 className="text-2xl font-bold text-white">
            {studyMode === 'exam' ? 'Exam Complete' : 'Test Complete'}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {subject} • {classLevel} • {topic}
          </p>
          <div className="mt-6 text-5xl font-bold text-white">{percentage}%</div>
          <p className="mt-2 text-white/60">
            {score} correct out of {results.length} answered
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-bold text-white">Performance Summary</h2>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Review the questions you missed and practise the areas where you
            had difficulty before starting another session.
          </p>
        </div>

        <button
          onClick={resetSession}
          className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black"
        >
          Start Another Session
        </button>
      </div>
    );
  }

  if (started && studyQuestions[currentQuestion]) {
    const current = studyQuestions[currentQuestion];
    const answerProvided =
      current.type === 'objective' ? selectedAnswer : writtenAnswer;

    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">
                {studyMode === 'exam' ? 'Exam Mode' : 'Test Mode'}
              </h1>
              <p className="text-sm text-white/60">
                {subject} • {classLevel} • {topic}
              </p>
            </div>
            <div className="text-right text-sm text-white/60">
              Question {currentQuestion + 1} of {studyQuestions.length}
              <div className="mt-1 flex items-center justify-end gap-1">
                <Clock size={15} />
                {minutes} min
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            {current.type === 'objective' ? 'Objective' : 'Theory'}
          </span>

          <h2 className="mt-5 text-lg font-semibold leading-7 text-white">
            {current.question}
          </h2>

          {current.type === 'objective' ? (
            <div className="mt-6 space-y-3">
              {(current.options ?? []).map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const value = option.replace(
                  new RegExp(`^${letter}[.)]\\s*`, 'i'),
                  ''
                );

                return (
                  <button
                    key={`${letter}-${index}`}
                    onClick={() => !evaluation && setSelectedAnswer(value)}
                    disabled={Boolean(evaluation)}
                    className={`flex w-full gap-3 rounded-xl border p-4 text-left transition ${
                      selectedAnswer === value
                        ? 'border-white/40 bg-white/10'
                        : 'border-white/10 bg-black/10 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-bold">{letter}</span>
                    <span className="text-sm text-white/80">{value}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              disabled={Boolean(evaluation)}
              rows={7}
              placeholder="Type your answer here..."
              className="mt-6 w-full resize-y rounded-xl border border-white/10 bg-black/10 p-4 text-white outline-none placeholder:text-white/30"
            />
          )}

          {evaluation && studyMode === 'test' && (
            <div className={`mt-6 rounded-xl border p-5 ${
              evaluation.correct
                ? 'border-green-400/20 bg-green-400/5'
                : 'border-red-400/20 bg-red-400/5'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {evaluation.correct
                  ? <CheckCircle2 size={19} />
                  : <XCircle size={19} />}
                {evaluation.correct ? 'Correct' : 'Needs Improvement'}
              </div>

              <p className="mt-3 text-sm leading-6 text-white/75">
                {evaluation.feedback}
              </p>

              {evaluation.correctAnswer && (
                <div className="mt-4 rounded-lg bg-black/10 p-3">
                  <p className="text-xs font-semibold text-white/40">
                    Correct answer
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    {evaluation.correctAnswer}
                  </p>
                </div>
              )}

              {evaluation.strengths && (
                <p className="mt-4 text-sm text-white/70">
                  <b>What you did well:</b> {evaluation.strengths}
                </p>
              )}

              {evaluation.improvements && (
                <p className="mt-3 text-sm text-white/70">
                  <b>What to work on:</b> {evaluation.improvements}
                </p>
              )}
            </div>
          )}

          <button
            onClick={evaluation ? nextQuestion : submitAnswer}
            disabled={!evaluation && (!answerProvided.trim() || evaluating)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {evaluation
              ? currentQuestion >= studyQuestions.length - 1
                ? studyMode === 'exam'
                  ? 'Finish Exam & View Results'
                  : 'Finish Test'
                : 'Next Question'
              : evaluating
                ? 'AI is evaluating...'
                : <><Send size={17} />Submit Answer</>}
          </button>
        </div>

        <p className="text-center text-xs text-white/40">
          {studyMode === 'exam'
            ? 'Exam Mode hides correctness and explanations until the exam is complete.'
            : 'Test Mode gives immediate AI feedback after each answer.'}
        </p>
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
                <option key={item.id} value={item.id}>
                  {item.name}
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
          <span className="text-sm text-white/70">Study Mode</span>
          <select
            value={studyMode}
            onChange={(e) => {
              const value = e.target.value as 'test' | 'exam';
              setStudyMode(value);
              if (value === 'exam') setQuestionType('objectives');
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white"
          >
            <option value="test">Test Mode</option>
            <option value="exam">Exam Mode</option>
          </select>
          <span className="text-xs text-white/40">
            Test gives immediate feedback. Exam reveals results only after completion.
          </span>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-white/70">Question Type</span>
          <select
            value={questionType}
            disabled={studyMode === 'exam'}
            onChange={(e) =>
              setQuestionType(e.target.value as 'objectives' | 'theory' | 'mixed')
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white disabled:opacity-50"
          >
            <option value="objectives">Objectives</option>
            <option value="theory">Theory</option>
            <option value="mixed">Objectives + Theory</option>
          </select>
          <span className="text-xs text-white/40">
            {studyMode === 'exam'
              ? 'Exam Mode uses objectives only.'
              : 'Choose objective, theory, or a mixture.'}
          </span>
        </label>
      </div>

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
