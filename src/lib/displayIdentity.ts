export type IdentityProfile = {
  nickname?: string | null;
  display_name?: string | null;
  role?: string | null;
};

export function getRankLabel(role?: string | null): string | null {
  switch ((role || "").toLowerCase()) {
    case "owner":
      return "Owner";
    case "superadmin":
      return "Super Admin";
    case "admin":
      return "Admin";
    default:
      return null;
  }
}

export function getDisplayIdentity(profile?: IdentityProfile | null): string {
  const rank = getRankLabel(profile?.role);

  // Staff identities always use their rank, never their nickname.
  if (rank) return rank;

  return (
    profile?.nickname?.trim() ||
    profile?.display_name?.trim() ||
    "Student"
  );
}
