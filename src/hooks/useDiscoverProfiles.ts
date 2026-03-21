import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/store/appStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useDiscoverProfiles(userId: string | null) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data: rows } = await db
      .from('profiles')
      .select('*')
      .neq('id', userId)
      .eq('profile_complete', true)
      .limit(50);

    if (rows && rows.length > 0) {
      const mapped: Profile[] = rows.map((p: any) => ({
        id: p.id,
        displayName: p.display_name || 'User',
        role: p.role ?? 'Member',
        city: p.city ?? '',
        bio: p.bio ?? '',
        photos: (p.photos?.filter((ph: string) => !ph.startsWith('video:')) ?? []).length > 0
          ? p.photos!.filter((ph: string) => !ph.startsWith('video:'))
          : [p.avatar_url ?? 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80'],
        skills: p.interests ?? [],
        currentProjects: [],
        status: p.mood_status ?? 'online',
        isVerified: p.is_verified ?? false,
        donorBadge: p.donor_badge ?? false,
        reputationScore: Math.floor(Math.random() * 500) + 100,
      }));
      setProfiles(mapped);
    } else {
      setProfiles([]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { profiles, loading, refetch: fetchProfiles };
}
