import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const OWNER_EMAIL = 'embelmpk@gmail.com';
export const SUPER_ADMIN_EMAIL = 'embelmpk@gmail.com';
export const SUPER_ADMIN_EMAILS = [
  'uceebel@gmail.com',
  'emblemcreativeservices@gmail.com',
];

export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  picture: string;
  studentClass?: string;
  department?: string;
  age?: number;
  role?: 'user' | 'admin' | 'superadmin';
  password?: string;
}

export interface BanRecord {
  userId: string;
  email: string;
  reason: string;
  bannedAt: string;
  bannedBy?: string;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  client_id?: string;
}

export interface GoogleJwtPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  locale?: string;
}

export type AuthInput = Partial<User> & {
  email: string;
  password?: string;
};

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isBanned: boolean;
  banRecord: BanRecord | null;
  bannedList: BanRecord[];
  adminList: string[];
  login: (userData: AuthInput) => void;
  logout: () => void;
  googleLogin: (credentialResponse: GoogleCredentialResponse) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  toggleAdminRole: (email: string) => void;
  getBannedUsers: () => BanRecord[];
  updateUserProfile: (updatedFields: Partial<User>) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredBans = (): BanRecord[] => {
  try {
    return JSON.parse(localStorage.getItem('studyai_banned_users') || '[]');
  } catch {
    return [];
  }
};

const getStoredAdmins = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('studyai_admin_list') || '[]');
  } catch {
    return [];
  }
};

const roleForEmail = (email: string, role?: string): User['role'] => {
  const normalized = email.toLowerCase();

  if (normalized === OWNER_EMAIL) return 'superadmin';
  if (SUPER_ADMIN_EMAILS.includes(normalized)) return 'superadmin';
  if (role === 'admin' || role === 'superadmin') return role;
  return 'user';
};

const profileToUser = (profile: any, authUser: any): User => ({
  id: authUser.id,
  email: authUser.email || profile?.email || '',
  name:
    profile?.display_name ||
    authUser.user_metadata?.name ||
    authUser.email?.split('@')[0] ||
    'Student',
  nickname:
    authUser.user_metadata?.nickname ||
    profile?.display_name ||
    undefined,
  picture:
    profile?.avatar_url ||
    authUser.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      authUser.email || authUser.id
    )}`,
  studentClass:
    profile?.class_level ||
    authUser.user_metadata?.studentClass ||
    'SS3',
  department:
    authUser.user_metadata?.department ||
    'Science',
  age: authUser.user_metadata?.age || undefined,
  role: roleForEmail(authUser.email || '', profile?.role),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [bannedList, setBannedList] = useState<BanRecord[]>(getStoredBans);
  const [adminList, setAdminList] = useState<string[]>(getStoredAdmins);
  const [banRecord, setBanRecord] = useState<BanRecord | null>(null);
  const [error, setErrorState] = useState<string | null>(null);

  const setError = (err: string | null = null) => {
    setErrorState(err);
  };

  const isSuperAdmin =
    Boolean(user) &&
    (user?.role === 'superadmin' ||
      user?.email.toLowerCase() === OWNER_EMAIL ||
      SUPER_ADMIN_EMAILS.includes(user?.email?.toLowerCase() || ''));

  const isAdmin =
    isSuperAdmin ||
    adminList.includes(user?.email?.toLowerCase() || '') ||
    user?.role === 'admin';

  const currentBan = user
    ? bannedList.find(
        (ban) => ban.userId === user.id || ban.email === user.email
      ) || null
    : null;

  const isBanned = Boolean(currentBan);

  useEffect(() => {
    setBanRecord(currentBan);

    if (user) {
      localStorage.setItem('studyai_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studyai_current_user');
    }
  }, [user, currentBan]);

  useEffect(() => {
    localStorage.setItem('studyai_banned_users', JSON.stringify(bannedList));
  }, [bannedList]);

  useEffect(() => {
    localStorage.setItem('studyai_admin_list', JSON.stringify(adminList));
  }, [adminList]);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted || !data.session?.user) return;

      await loadProfile(data.session.user);
    };

    const loadProfile = async (authUser: any) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (mounted) {
        setUser(profileToUser(profile, authUser));
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        if (mounted) setUser(null);
        return;
      }

      await loadProfile(session.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: AuthInput) => {
    // Login is performed by Login.tsx through Supabase Auth.
    // This keeps compatibility with existing app code.
    if (userData?.id) {
      setUser({
        id: userData.id,
        email: userData.email.toLowerCase(),
        name: userData.name || userData.email.split('@')[0],
        nickname: userData.nickname,
        picture:
          userData.picture ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
            userData.email
          )}`,
        studentClass: userData.studentClass || 'SS3',
        department: userData.department || 'Science',
        age: userData.age,
        role: roleForEmail(userData.email, userData.role),
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBanRecord(null);
  };

  const googleLogin = (credentialResponse: GoogleCredentialResponse) => {
    setError(
      'Google sign-in is being connected to Supabase Auth. Please use email and password for now.'
    );
  };

  const banUser = (userId: string, reason: string) => {
    const target = bannedList.find((ban) => ban.userId === userId);

    const targetBan: BanRecord = {
      userId,
      email: target?.email || `${userId}@placeholder.com`,
      reason,
      bannedAt: new Date().toISOString(),
      bannedBy: user?.name || 'Administrator',
    };

    setBannedList((prev) => [
      ...prev.filter((ban) => ban.userId !== userId),
      targetBan,
    ]);
  };

  const unbanUser = (userId: string) => {
    if (!isSuperAdmin) {
      setError('Only the Owner and Super Admins can unban users.');
      return;
    }

    setBannedList((prev) =>
      prev.filter((ban) => ban.userId !== userId && ban.email !== userId)
    );
  };

  const toggleAdminRole = (email: string) => {
    if (!isSuperAdmin) {
      setError('Only the Owner and Super Admins can manage admin roles.');
      return;
    }

    const normalized = email.toLowerCase();

    setAdminList((prev) =>
      prev.includes(normalized)
        ? prev.filter((entry) => entry !== normalized)
        : [...prev, normalized]
    );
  };

  const getBannedUsers = () => bannedList;

  const updateUserProfile = async (updatedFields: Partial<User>) => {
    if (!user) return;

    const updated = { ...user, ...updatedFields };
    setUser(updated);

    const profileUpdate: Record<string, any> = {};

    if (updatedFields.name !== undefined) {
      profileUpdate.display_name = updatedFields.name;
    }

    if (updatedFields.picture !== undefined) {
      profileUpdate.avatar_url = updatedFields.picture;
    }

    if (updatedFields.studentClass !== undefined) {
      profileUpdate.class_level = updatedFields.studentClass;
    }

    if (Object.keys(profileUpdate).length) {
      await supabase.from('profiles').update(profileUpdate).eq('id', user.id);
    }

    await supabase.auth.updateUser({
      data: {
        name: updated.name,
        nickname: updated.nickname,
        department: updated.department,
        age: updated.age,
      },
    });
  };

  const value: AuthContextType = {
    user,
    isAdmin,
    isSuperAdmin,
    isBanned,
    banRecord,
    bannedList,
    adminList,
    login,
    logout,
    googleLogin,
    banUser,
    unbanUser,
    toggleAdminRole,
    getBannedUsers,
    updateUserProfile,
    error,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (config: any) => void;
          prompt: (cb?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}
