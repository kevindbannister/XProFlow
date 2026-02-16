import type { User } from '@supabase/supabase-js';

type UserMetadata = Record<string, unknown>;

const getStringValue = (value: unknown) => (typeof value === 'string' ? value : '');

export const getEmailAvatarUrl = (email: string) => {
  const initial = email.trim().charAt(0).toUpperCase() || 'U';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initial
  )}&background=0D8ABC&color=fff&size=128`;
};

export const getUserProfile = (user: User) => {
  const rawMetadata =
    (user as { raw_user_meta_data?: UserMetadata }).raw_user_meta_data ?? user.user_metadata;
  const metadata = rawMetadata ?? {};
  const firstName = getStringValue(metadata.given_name);
  const lastName = getStringValue(metadata.family_name);
  const fullNameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim();

  const name =
    getStringValue(metadata.full_name) ||
    getStringValue(metadata.name) ||
    fullNameFromParts ||
    '';
  const email = getStringValue(user.email) || getStringValue(metadata.email);
  const avatarUrl =
    getStringValue(metadata.avatar_url) ||
    getStringValue(metadata.picture) ||
    getEmailAvatarUrl(email);

  return {
    id: user.id ?? '',
    name: name || (email ? email.split('@')[0] : 'User'),
    email,
    avatarUrl
  };
};
