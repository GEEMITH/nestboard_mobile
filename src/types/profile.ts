export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  avatarUrl: string | null;
  bioTag: string | null;
};

export type UpdateProfilePayload = {
  displayName?: string;
  avatarUrl?: string | null;
};