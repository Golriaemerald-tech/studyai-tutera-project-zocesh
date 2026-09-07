import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPER_ADMIN_EMAIL = 'embelmpklet@gmail.com';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('studyai_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [bannedList, setBannedList] = useState<BanRecord[]>([]);
  const [adminList, setAdminList] = useState<string[]>([SUPER_ADMIN_EMAIL]);
  const [banRecord, setBanRecord] = useState<BanRecord | null>(null);
  const [error, setErrorState] = useState<string | null>(null);

  const setError = (err: string | null = null) => {
    setErrorState(err);
  };

  const isSuperAdmin = user?.role === 'superadmin' || user?.email === SUPER_ADMIN_EMAIL;
  const isAdmin = isSuperAdmin || adminList.includes(user?.email || '') || user?.role === 'admin';
  
  const currentBan = user ? bannedList.find(b => b.userId === user.id || b.email === user.email) || null : null;
  const isBanned = Boolean(currentBan);

  useEffect(() => {
    setBanRecord(currentBan);
    if (user) {
      try {
        localStorage.setItem('studyai_current_user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to save user session:', e);
      }
    } else {
      localStorage.removeItem('studyai_current_user');
    }
  }, [user, currentBan]);

  const decodeJwtResponse = (token: string): GoogleJwtPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as GoogleJwtPayload;
    } catch (e) {
      console.error('Failed to parse Google JWT token:', e);
      return null;
    }
  };

  const login = (userData: AuthInput) => {
    if (!userData || (typeof userData === 'object' && 'nativeEvent' in userData)) {
      return;
    }

    if (!userData.email) {
      setError('Invalid authentication data received.');
      return;
    }

    const emailVal = userData.email.toLowerCase();
    const generatedId = userData.id || 'user-' + Math.random().toString(36).substring(2, 9);

    const enrichedUser: User = {
      studentClass: userData.studentClass || 'SS 3',
      department: userData.department || 'Science',
      age: userData.age || 17,
      picture: userData.picture || `https://api.dicebar.com/7.x/bottts/svg?seed=${emailVal}`,
      ...userData,
      id: generatedId,
      email: emailVal,
      name: userData.name || emailVal.split('@')[0],
      password: userData.password,
      role: emailVal === SUPER_ADMIN_EMAIL ? 'superadmin' : (userData.role || 'user'),
    };

    setUser(enrichedUser);
    setError(null);
    try {
      const allUsers = JSON.parse(localStorage.getItem('studyai_all_users') || '{}') as Record<string, User>;
      allUsers[enrichedUser.email] = enrichedUser;
      localStorage.setItem('studyai_all_users', JSON.stringify(allUsers));
    } catch (e) {
      console.error('Failed to update all_users storage:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setBanRecord(null);
    localStorage.removeItem('studyai_current_user');
  };

  const googleLogin = (credentialResponse: GoogleCredentialResponse) => {
    const payload = decodeJwtResponse(credentialResponse.credential);
    if (!payload) {
      setError('Invalid Google sign-in credential.');
      return;
    }
    login({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
  };

  const banUser = (userId: string, reason: string) => {
    const targetBan: BanRecord = {
      userId,
      email: `${userId}@placeholder.com`,
      reason,
      bannedAt: new Date().toISOString(),
      bannedBy: user?.name || 'Administrator'
    };
    setBannedList(prev => [...prev, targetBan]);
  };

  const unbanUser = (userId: string) => {
    setBannedList(prev => prev.filter(b => b.userId !== userId && b.email !== userId));
  };

  const toggleAdminRole = (email: string) => {
    setAdminList(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const getBannedUsers = (): BanRecord[] => {
    return bannedList;
  };

  const updateUserProfile = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
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
