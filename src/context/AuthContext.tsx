import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

export const OWNER_EMAIL = 'embelmpklet@gmail.com';

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
  role?: 'user' | 'student' | 'teacher' | 'admin' | 'superadmin' | 'owner';
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
};

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean;
  isTeacher: boolean;
  isBanned: boolean;
  banRecord: BanRecord | null;
  bannedList: BanRecord[];
  adminList: string[];
  login: (userData: AuthInput) => void;
  logout: () => void;
  googleLogin: (
    credentialResponse?: GoogleCredentialResponse
  ) => void;
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  toggleAdminRole: (email: string) => void;
  getBannedUsers: () => BanRecord[];
  updateUserProfile: (
    updatedFields: Partial<User>
  ) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const roleForEmail = (
  email: string,
  role?: string
): User['role'] => {
  const normalized = email.toLowerCase();

  if (normalized === OWNER_EMAIL) {
    return 'owner';
  }

  if (SUPER_ADMIN_EMAILS.includes(normalized)) {
    return 'superadmin';
  }

  if (
    role === 'owner' ||
    role === 'superadmin' ||
    role === 'admin' ||
    role === 'teacher' ||
    role === 'student'
  ) {
    return role;
  }

  return 'user';
};

const profileToUser = (
  profile: any,
  authUser: any
): User => {
  const email = (
    authUser?.email ||
    profile?.email ||
    ''
  ).toLowerCase();

  return {
    id: authUser.id,
    email,
    name:
      profile?.display_name ||
      authUser?.user_metadata?.name ||
      email.split('@')[0] ||
      'Student',
    nickname:
      authUser?.user_metadata?.nickname ||
      profile?.display_name ||
      undefined,
    picture:
      profile?.avatar_url ||
      authUser?.user_metadata?.picture ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
        email || authUser.id
      )}`,
    studentClass:
      profile?.class_level ||
      authUser?.user_metadata?.studentClass ||
      'SS3',
    department:
      authUser?.user_metadata?.department ||
      'Science',
    age:
      authUser?.user_metadata?.age ||
      undefined,
    role: roleForEmail(
      email,
      profile?.role
    ),
  };
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bannedList, setBannedList] = useState<
    BanRecord[]
  >([]);
  const [adminList, setAdminList] = useState<
    string[]
  >([]);
  const [banRecord, setBanRecord] =
    useState<BanRecord | null>(null);
  const [error, setErrorState] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(true);

  const setError = (
    err: string | null = null
  ) => {
    setErrorState(err);
  };

  const loadProfile = async (
    authUser: any
  ) => {
    const { data: profile } =
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

    if (!profile) {
      const { data: createdProfile } =
        await supabase
          .from('profiles')
          .upsert(
            {
              id: authUser.id,
              email: authUser.email,
              display_name:
                authUser.user_metadata?.name ||
                authUser.email?.split('@')[0] ||
                'Student',
              avatar_url:
                authUser.user_metadata?.picture ||
                null,
              class_level:
                authUser.user_metadata?.studentClass ||
                'SS3',
            },
            {
              onConflict: 'id',
            }
          )
          .select()
          .maybeSingle();

      return profileToUser(
        createdProfile,
        authUser
      );
    }

    return profileToUser(
      profile,
      authUser
    );
  };

  const loadBans = async () => {
    const { data, error: bansError } =
      await supabase
        .from('bans')
        .select(
          'user_id,email,reason,banned_at,banned_by'
        )
        .order('banned_at', {
          ascending: false,
        });

    if (bansError) {
      console.error(
        'Failed to load bans:',
        bansError
      );
      return;
    }

    setBannedList(
      (data || []).map((ban: any) => ({
        userId: ban.user_id,
        email: ban.email,
        reason: ban.reason,
        bannedAt: ban.banned_at,
        bannedBy: ban.banned_by || undefined,
      }))
    );
  };

  const loadAdmins = async () => {
    const { data, error: adminsError } =
      await supabase
        .from('admins')
        .select('email');

    if (adminsError) {
      console.error(
        'Failed to load admins:',
        adminsError
      );
      return;
    }

    setAdminList(
      (data || []).map(
        (admin: any) =>
          String(admin.email).toLowerCase()
      )
    );
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const currentUser =
            await loadProfile(
              session.user
            );

          if (mounted) {
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }

        await Promise.all([
          loadBans(),
          loadAdmins(),
        ]);
      } catch (err) {
        console.error(
          'Auth initialization error:',
          err
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!mounted) return;

          if (!session?.user) {
            setUser(null);
            setBanRecord(null);
            return;
          }

          const currentUser =
            await loadProfile(
              session.user
            );

          if (mounted) {
            setUser(currentUser);
            await loadBans();
            await loadAdmins();
          }
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const normalizedUserEmail =
    user?.email.toLowerCase() || '';

  const isOwner =
    Boolean(user) &&
    (
      user?.role === 'owner' ||
      normalizedUserEmail === OWNER_EMAIL
    );

  const isSuperAdmin =
    Boolean(user) &&
    (
      isOwner ||
      user?.role === 'superadmin' ||
      SUPER_ADMIN_EMAILS.includes(normalizedUserEmail)
    );

  const isAdmin =
    isSuperAdmin ||
    adminList.includes(normalizedUserEmail) ||
    user?.role === 'admin';

  const isTeacher =
    Boolean(user) &&
    user?.role === 'teacher';

  const currentBan = user
    ? bannedList.find(
        (ban) =>
          ban.userId === user.id ||
          ban.email.toLowerCase() ===
            user.email.toLowerCase()
      ) || null
    : null;

  const isBanned =
    Boolean(currentBan);

  useEffect(() => {
    setBanRecord(currentBan);
  }, [currentBan]);

  const login = (
    userData: AuthInput
  ) => {
    /*
     * Authentication is handled exclusively
     * by Supabase Auth.
     *
     * Login.tsx should call:
     *
     * supabase.auth.signInWithPassword(...)
     *
     * This function only keeps compatibility
     * with existing components that call login()
     * after a successful Supabase session.
     */
    if (!userData?.id) return;

    setUser({
      id: userData.id,
      email:
        userData.email.toLowerCase(),
      name:
        userData.name ||
        userData.email.split('@')[0],
      nickname:
        userData.nickname,
      picture:
        userData.picture ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
          userData.email
        )}`,
      studentClass:
        userData.studentClass ||
        'SS3',
      department:
        userData.department ||
        'Science',
      age: userData.age,
      role: roleForEmail(
        userData.email,
        userData.role
      ),
    });
  };

  const logout = async () => {
    setError(null);

    const { error: signOutError } =
      await supabase.auth.signOut();

    if (signOutError) {
      setError(
        signOutError.message
      );
      return;
    }

    setUser(null);
    setBanRecord(null);
  };

  const googleLogin = async () => {
    setError(null);

    const {
      error: oauthError,
    } =
      await supabase.auth.signInWithOAuth(
        {
          provider: 'google',
          options: {
            redirectTo:
              window.location.origin,
          },
        }
      );

    if (oauthError) {
      setError(
        oauthError.message
      );
    }
  };

  const banUser = async (
    userId: string,
    reason: string
  ) => {
    if (!isSuperAdmin) {
      setError(
        'Only the Owner and Super Admins can ban users.'
      );
      return;
    }

    const { data: targetProfile } =
      await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .maybeSingle();

    const email =
      targetProfile?.email ||
      user?.email ||
      '';

    const { error: banError } =
      await supabase
        .from('bans')
        .upsert(
          {
            user_id: userId,
            email,
            reason,
            banned_at:
              new Date().toISOString(),
            banned_by:
              user?.id || null,
          },
          {
            onConflict:
              'user_id',
          }
        );

    if (banError) {
      setError(
        banError.message
      );
      return;
    }

    await loadBans();
  };

  const unbanUser = async (
    userId: string
  ) => {
    if (!isSuperAdmin) {
      setError(
        'Only the Owner and Super Admins can unban users.'
      );
      return;
    }

    const { error: unbanError } =
      await supabase
        .from('bans')
        .delete()
        .eq('user_id', userId);

    if (unbanError) {
      setError(
        unbanError.message
      );
      return;
    }

    await loadBans();
  };

  const toggleAdminRole = async (
    email: string
  ) => {
    if (!isSuperAdmin) {
      setError(
        'Only the Owner and Super Admins can manage administrators.'
      );
      return;
    }

    const normalized =
      email.trim().toLowerCase();

    if (
      !normalized ||
      normalized === OWNER_EMAIL ||
      SUPER_ADMIN_EMAILS.includes(
        normalized
      )
    ) {
      setError(
        'This account already has protected administrator access.'
      );
      return;
    }

    const exists =
      adminList.includes(normalized);

    if (exists) {
      const { error: deleteError } =
        await supabase
          .from('admins')
          .delete()
          .eq(
            'email',
            normalized
          );

      if (deleteError) {
        setError(
          deleteError.message
        );
        return;
      }
    } else {
      const { error: insertError } =
        await supabase
          .from('admins')
          .insert({
            email: normalized,
            created_by:
              user?.id || null,
          });

      if (insertError) {
        setError(
          insertError.message
        );
        return;
      }
    }

    await loadAdmins();
  };

  const getBannedUsers =
    () => bannedList;

  const updateUserProfile = async (
    updatedFields: Partial<User>
  ) => {
    if (!user) return;

    const profileUpdate: Record<
      string,
      any
    > = {};

    if (
      updatedFields.name !==
      undefined
    ) {
      profileUpdate.display_name =
        updatedFields.name;
    }

    if (
      updatedFields.picture !==
      undefined
    ) {
      profileUpdate.avatar_url =
        updatedFields.picture;
    }

    if (
      updatedFields.studentClass !==
      undefined
    ) {
      profileUpdate.class_level =
        updatedFields.studentClass;
    }

    if (
      Object.keys(profileUpdate)
        .length === 0
    ) {
      setUser({
        ...user,
        ...updatedFields,
      });
      return;
    }

    const { data, error: updateError } =
      await supabase
        .from('profiles')
        .update(
          profileUpdate
        )
        .eq('id', user.id)
        .select()
        .maybeSingle();

    if (updateError) {
      setError(
        updateError.message
      );
      return;
    }

    if (data) {
      const {
        data: { user: authUser },
      } =
        await supabase.auth.getUser();

      if (authUser) {
        setUser(
          profileToUser(
            data,
            authUser
          )
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mb-3 text-2xl">
            Zocesh StudyAI
          </div>
          <div className="text-sm opacity-70">
            Loading your account...
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isSuperAdmin,
        isOwner,
        isTeacher,
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

export const useAuth =
  (): AuthContextType => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        'useAuth must be used within an AuthProvider'
      );
    }

    return context;
  };

export default AuthContext;
