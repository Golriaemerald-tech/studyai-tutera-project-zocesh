import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface ExamCountdownProps {
  examName: string;
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({ examName, targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{examName}</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          Target Exam
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100 dark:border-slate-700/50">
            <span className="block text-2xl font-bold text-slate-900 dark:text-slate-50">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
