import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { subjectIcon } from "@/data/curriculum";
import { useCurriculum } from "@/hooks/useCurriculum";
import { stats as computeStats } from "@/lib/progress";

export default function Subjects() {
  const navigate = useNavigate();
  const { className, subjects: selectedSubjects } = useApp();

  const {
    subjects: curriculumSubjects,
    loading,
    error,
  } = useCurriculum(className as any);

  const availableSubjects = useMemo(() => {
    if (!curriculumSubjects.length) {
      return selectedSubjects ?? [];
    }

    if (!selectedSubjects?.length) {
      return curriculumSubjects.map((subject) => subject.name);
    }

    const selected = new Set(
      selectedSubjects.map((subject) => subject.toLowerCase())
    );

    const filtered = curriculumSubjects.filter((subject) =>
      selected.has(subject.name.toLowerCase())
    );

    return filtered.length
      ? filtered.map((subject) => subject.name)
      : curriculumSubjects.map((subject) => subject.name);
  }, [curriculumSubjects, selectedSubjects]);

  const progressStats = computeStats(className, availableSubjects);

  const groups = useMemo(() => {
    const result: Record<string, string[]> = {};

    availableSubjects.forEach((subjectName) => {
      const subject = curriculumSubjects.find(
        (item) => item.name.toLowerCase() === subjectName.toLowerCase()
      );

      const category = subject?.category || "Other";

      if (!result[category]) {
        result[category] = [];
      }

      result[category].push(subjectName);
    });

    return result;
  }, [availableSubjects, curriculumSubjects]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card">
          <span className="pill">{className} curriculum</span>
          <h2 className="mt-3 font-display text-2xl font-bold">
            Loading your subjects...
          </h2>
          <p className="mt-2 text-slate-400">
            Zocesh Study AI is loading the curriculum for your class.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="card h-24 animate-pulse bg-surface-raised/40"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card">
        <span className="pill">{className} curriculum</span>

        <h2 className="mt-3 font-display text-2xl font-bold">
          Learn by subject.
        </h2>

        <p className="mt-2 text-slate-400">
          Choose a subject to explore topics, practice questions and revision
          tools.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200">
            The latest curriculum could not be loaded. Showing the subjects
            currently available in your account.
          </div>
        )}
      </div>

      {Object.entries(groups).map(([category, subjectNames]) => (
        <div key={category}>
          <h2 className="mb-3 font-display text-lg font-bold">
            {category}
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            {subjectNames.map((subjectName) => {
              const subject = curriculumSubjects.find(
                (item) =>
                  item.name.toLowerCase() === subjectName.toLowerCase()
              );

              const topicCount = subject?.topics.length ?? 0;

              const stat = progressStats.subjectStats[subjectName] || {
                done: 0,
                total: topicCount,
              };

              const total = stat.total || topicCount;
              const pct = total
                ? Math.round((stat.done / total) * 100)
                : 0;

              return (
                <button
                  key={subjectName}
                  onClick={() =>
                    navigate(
                      `/subjects/${encodeURIComponent(subjectName)}`
                    )
                  }
                  className="card flex items-center gap-3 text-left transition hover:border-brand-400/50"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-raised text-lg">
                    {subjectIcon(subjectName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">
                      {subjectName}
                    </strong>

                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {stat.done}/{total} topics
                      </span>

                      <b className="text-brand-300">{pct}%</b>
                    </div>

                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!availableSubjects.length && (
        <div className="card text-center">
          <h3 className="font-semibold">No subjects found</h3>
          <p className="mt-2 text-sm text-slate-400">
            No curriculum subjects are currently available for {className}.
          </p>
        </div>
      )}
    </div>
  );
}
