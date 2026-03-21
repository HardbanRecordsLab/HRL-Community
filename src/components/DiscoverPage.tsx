import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Shield, Crown, MessageCircle, UserPlus, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { Profile } from '@/store/appStore';
import { StoriesBar, mockUserStories } from '@/components/StoriesSystem';
import AdBanner from '@/components/AdBanner';
import { useAuth } from '@/hooks/useAuth';
import { useDiscoverProfiles } from '@/hooks/useDiscoverProfiles';

function MemberCard({ profile, onMessage }: { profile: Profile; onMessage: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl overflow-hidden border border-white/5 group hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-[4/5]">
        <img
          src={profile.photos[0]}
          alt={profile.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {profile.isVerified && (
            <div className="w-6 h-6 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
              <Shield className="w-3 h-3 text-primary" />
            </div>
          )}
          {profile.donorBadge && (
            <div className="w-6 h-6 rounded-full bg-accent/20 backdrop-blur-md flex items-center justify-center border border-accent/30">
              <Crown className="w-3 h-3 text-accent" />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${profile.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{profile.status}</span>
          </div>
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {profile.displayName}
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-tighter">{profile.role}</span>
          </h3>
          <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
            <MapPin className="w-3 h-3" />
            <span>{profile.city}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {profile.skills.slice(0, 3).map(skill => (
              <span key={skill} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/60">
                {skill}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="text-[9px] text-white/30 self-center">+{profile.skills.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 grid grid-cols-2 gap-2 bg-white/5">
        <button
          onClick={onMessage}
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Message
        </button>
        <button className="flex items-center justify-center gap-2 py-2 rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground text-xs font-semibold transition-colors shadow-lg shadow-primary/20">
          <UserPlus className="w-3.5 h-3.5" />
          Connect
        </button>
      </div>
    </motion.div>
  );
}

export default function DiscoverPage() {
  const { setActiveTab } = useAppStore();
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { profiles, loading } = useDiscoverProfiles(user?.id ?? null);

  const filteredProfiles = profiles.filter(p => 
    p.displayName.toLowerCase().includes(search.toLowerCase()) ||
    p.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Search Header */}
      <div className="px-4 py-4 space-y-4 glass-strong sticky top-0 z-20 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search members, skills, roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button className="w-10 h-10 flex items-center justify-center glass rounded-2xl text-white/60 hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Stories bar - rebranded as 'Member Updates' */}
        <div className="pt-2">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 ml-1">Member Updates</p>
          <StoriesBar userStories={mockUserStories} showAddButton={true} />
        </div>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white">Community Directory</h2>
            <p className="text-white/40 text-xs">Connect with {profiles.length} HRL members</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 4, 5].map(i => (
              <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-20">
            {filteredProfiles.map(profile => (
              <MemberCard
                key={profile.id}
                profile={profile}
                onMessage={() => setActiveTab('chats')}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="text-lg font-bold text-white/60">No members found</h3>
            <p className="text-sm text-white/30 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

        <AdBanner placement="discover" />
      </div>
    </div>
  );
}
