import React from 'react';
import { Flame, CheckCircle2, Circle } from 'lucide-react';

interface DayActivity {
  day: string;
  date: string;
  completed: boolean;
  isToday?: boolean;
}

interface WeeklyStreakProps {
  currentStreak: number;
  weekDays: DayActivity[];
}

export const WeeklyStreak: React.FC<WeeklyStreakProps> = ({ currentStreak, weekDays }) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Study Streak</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Keep learning daily to extend your streak</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-amber-500">{currentStreak}</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">DAYS</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 pt-2">
        {weekDays.map((item) => (
          <div
            key={item.day}
            className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
              item.isToday
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {item.day}
            </span>
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
