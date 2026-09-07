import { Award, Trophy, Medal, Star } from 'lucide-react';

export const Leaderboard = () => {
  const leaders = [
    { rank: 1, name: 'EmbelPro (You)', score: 1450, streak: '12d' },
    { rank: 2, name: 'Amina Science', score: 1320, streak: '9d' },
    { rank: 3, name: 'Chinedu Maths', score: 1280, streak: '8d' },
    { rank: 4, name: 'Zainab Arts', score: 1150, streak: '6d' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-2">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="text-amber-400" /> Student Leaderboard
        </h1>
        <p className="text-xs text-slate-400">Top performing students across Zocesh Zocesh Study AI based on quiz scores and daily streaks.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        {leaders.map((l) => (
          <div key={l.rank} className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${l.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400'}`}>
                {l.rank}
              </span>
              <span className="font-bold text-slate-100">{l.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-teal-400 font-semibold">{l.score} pts</span>
              <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">{l.streak} streak</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Leaderboard;
