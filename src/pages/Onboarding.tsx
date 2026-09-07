import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Calendar, BookOpen, ArrowRight } from 'lucide-react';

export const Onboarding = () => {
  const { user, updateUserProfile } = useAuth();
  const [studentClass, setStudentClass] = useState('SS 1');
  const [department, setDepartment] = useState('Science');
  const [age, setAge] = useState<number>(15);
  const navigate = useNavigate();

  const isSenior = studentClass.startsWith('SS');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      studentClass,
      department: isSenior ? department : undefined,
      age,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 mx-auto">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Setup Your Profile</h1>
          <p className="text-xs text-slate-400">Welcome {user?.nickname || user?.name || 'Student'}! Select your class and age.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <Calendar size={15} className="text-teal-400" /> Pick Your Age
            </label>
            <input
              type="number"
              min={8}
              max={25}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <GraduationCap size={15} className="text-teal-400" /> Pick Class
            </label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 text-sm"
            >
              <option value="JSS 1">JSS 1</option>
              <option value="JSS 2">JSS 2</option>
              <option value="JSS 3">JSS 3</option>
              <option value="SS 1">SS 1</option>
              <option value="SS 2">SS 2</option>
              <option value="SS 3">SS 3</option>
            </select>
          </div>

          {isSenior && (
            <div className="space-y-2 animate-fadeIn">
              <label className="text-xs font-semibold uppercase text-amber-400 flex items-center gap-1.5">
                <BookOpen size={15} className="text-amber-400" /> Pick Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-amber-300 font-semibold focus:outline-none focus:border-amber-500 text-sm"
              >
                <option value="Science">Science Department</option>
                <option value="Arts">Arts Department</option>
                <option value="Commercial">Commercial Department</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            Start Learning <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Onboarding;
