import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Conversation, Profile } from '@/store/appStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useConversations(userId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Get matches involving current user
    const { data: matches } = await db
      .from('matches')
      .select('id, user1_id, user2_id, created_at')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (!matches?.length) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // For each match get the conversation and the other user's profile
    const convos: Conversation[] = [];

    for (const match of matches) {
      const otherId = match.user1_id === userId ? match.user2_id : match.user1_id;

      const [{ data: convo }, { data: otherProfile }] = await Promise.all([
        db.from('conversations')
          .select('id, last_message, last_message_at')
          .eq('match_id', match.id)
          .single(),
        db.from('profiles')
          .select('id, display_name, avatar_url, photos, city, bio, interests, is_verified, donor_badge, mood_status, role, reputation_score, status')
          .eq('id', otherId)
          .single(),
      ]);

      if (!convo || !otherProfile) continue;

      // Count unread messages
      const { count } = await db
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', convo.id)
        .eq('is_read', false)
        .neq('sender_id', userId);

      const profilePhotos = (otherProfile.photos?.filter((p: string) => !p.startsWith('video:')) ?? []);
      const userProfile: Profile = {
        id: otherProfile.id,
        displayName: otherProfile.display_name || 'User',
        city: otherProfile.city ?? '',
        bio: otherProfile.bio ?? '',
        photos: profilePhotos.length > 0
          ? profilePhotos
          : [otherProfile.avatar_url ?? 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80'],
        skills: otherProfile.interests ?? [],
        moodStatus: otherProfile.mood_status ?? 'Networking',
        isVerified: otherProfile.is_verified ?? false,
        donorBadge: otherProfile.donor_badge ?? false,
        reputationScore: otherProfile.reputation_score ?? 1000,
        role: otherProfile.role ?? 'Member',
        currentProjects: [],
        status: otherProfile.status ?? 'offline',
      };

      convos.push({
        id: convo.id,
        matchId: match.id,
        user: userProfile,
        lastMessage: convo.last_message ?? '',
        lastMessageAt: convo.last_message_at
          ? new Date(convo.last_message_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : '',
        unreadCount: count ?? 0,
        messages: [],
        isOnline: false,
        isTyping: false,
      });
    }

    setConversations(convos);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime: refresh when new messages arrive
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('conversations-watch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, () => {
        fetchConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}
