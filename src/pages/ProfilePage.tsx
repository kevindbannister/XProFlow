import type { FormEvent } from 'react';
import { useState } from 'react';
import { AvatarUploadModal } from '../components/profile/AvatarUploadModal';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageHeader } from '../components/ui/PageHeader';
import { getUserInitials, useUser } from '../context/UserContext';
import { supabase } from '../lib/supabaseClient';

const AVATAR_BUCKET = 'avatars';

const ProfilePage = () => {
  const { user, updateAvatar, updateProfile } = useUser();
  const [name, setName] = useState(user.name);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });

    if (error) {
      setStatusMessage('Unable to update your profile. Please try again.');
    } else {
      updateProfile({ name });
      setStatusMessage('Profile updated.');
    }

    setIsSaving(false);
  };

  const handleAvatarSave = async (dataUrl: string) => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const extension = blob.type === 'image/png' ? 'png' : 'jpg';
      const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        throw updateError;
      }

      updateAvatar(publicUrl);
      setStatusMessage('Photo updated.');
    } catch (error) {
      setStatusMessage('Unable to update your photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Profile"
        subtitle="Manage your account details and update your avatar."
      />

      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              fallback={getUserInitials(user.name)}
              className="h-20 w-20 rounded-full bg-gray-200 text-lg font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {user.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPhotoModalOpen(true)}
          >
            Change photo
          </Button>
        </div>

        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleProfileSave}>
          <div className="space-y-2">
            <label
              htmlFor="full-name"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Full name
            </label>
            <Input
              id="full-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Email
            </label>
            <Input id="email" value={user.email} readOnly className="bg-gray-100 text-slate-500" />
          </div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button type="submit" disabled={isSaving}>
              Save changes
            </Button>
            {statusMessage && (
              <span className="text-sm font-medium text-slate-500">{statusMessage}</span>
            )}
          </div>
        </form>
      </Card>

      <AvatarUploadModal
        open={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSave={handleAvatarSave}
      />
    </div>
  );
};

export default ProfilePage;
