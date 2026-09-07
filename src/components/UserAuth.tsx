import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const UserAuth = () => {
  const { user, googleLogin, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <img
          src={user.picture}
          alt={user.name}
          className="w-8 h-8 rounded-full border border-teal-500/30"
        />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-200">{user.name}</p>
          <p className="text-[10px] text-slate-400">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={(response) => {
        if (response.credential) {
          googleLogin({ credential: response.credential });
        }
      }}
      onError={() => console.error('Google Sign-In Failed')}
      shape="pill"
      theme="filled_black"
      size="medium"
    />
  );
};
