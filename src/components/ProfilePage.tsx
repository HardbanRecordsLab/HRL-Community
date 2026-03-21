import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit, Shield, Crown, MapPin, ChevronRight, LogOut, Zap, Check, X, Plus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import SettingsPage from '@/components/SettingsPage';
import DonationPage from '@/components/DonationPage';
import FaceVerify from '@/components/FaceVerify';
import ProfilePhotoGallery from '@/components/ProfilePhotoGallery';

const moodOptions = ['Available for projects', 'Networking', 'Learning', 'Busy'];

const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'Node.js', 'UI/UX Design', 'Python', 'AWS',
  'Marketing', 'SEO', 'Product Management', 'Solidity', 'Music Production', 'Video Editing',
];

// ─── Inline editable field ────────────────────────────────────────────────────
function EditableField({
  label,
  value,
  onSave,
  multiline = false,
  type = 'text',
  maxLength,
}: {
  label: string;
  value: string;
  onSave: (v: string) => Promise<void>;
  multiline?: boolean;
  type?: string;
  maxLength?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold">{label}</p>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCancel}
              className="w-7 h-7 glass rounded-full flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-7 h-7 gradient-fire rounded-full flex items-center justify-center"
            >
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="w-7 h-7 glass rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {multiline ? (
              <textarea
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                maxLength={maxLength}
                rows={3}
                className="w-full bg-secondary/60 rounded-xl px-3 py-2 text-sm outline-none border border-primary/30 resize-none"
              />
            ) : (
              <input
                autoFocus
                type={type}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                maxLength={maxLength}
                className="w-full bg-secondary/60 rounded-xl px-3 py-2 text-sm outline-none border border-primary/30"
              />
            )}
            {maxLength && (
              <p className="text-xs text-muted-foreground text-right mt-1">{draft.length}/{maxLength}</p>
            )}
          </motion.div>
        ) : (
          <motion.p
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {value || <span className="italic opacity-50">Tap ✏️ to add {label.toLowerCase()}</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skills editor ─────────────────────────────────────────────────────────
function SkillsEditor({
  skills,
  onSave,
}: {
  skills: string[];
  onSave: (tags: string[]) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(skills);
  const [custom, setCustom] = useState('');
  const [saving, setSaving] = useState(false);

  const toggle = (tag: string) => {
    setDraft(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustom = () => {
    const t = custom.trim();
    if (!t || draft.includes(t) || draft.length >= 10) return;
    setDraft(prev => [...prev, t]);
    setCustom('');
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => { setDraft(skills); setEditing(false); };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">Skills & Expertise</p>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <button onClick={handleCancel} className="w-7 h-7 glass rounded-full flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={handleSave} disabled={saving} className="w-7 h-7 gradient-fire rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setDraft(skills); setEditing(true); }}
            className="w-7 h-7 glass rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {editing ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-wrap gap-2 mb-3">
            {SKILL_SUGGESTIONS.map(tag => (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all border ${
                  draft.includes(tag)
                    ? 'gradient-fire text-primary-foreground border-transparent'
                    : 'glass border-border text-muted-foreground'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="Add custom skill..."
              maxLength={20}
              className="flex-1 bg-secondary/60 rounded-xl px-3 py-2 text-xs outline-none border border-primary/30"
            />
            <button
              onClick={addCustom}
              className="w-9 h-9 gradient-fire rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <Plus className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{draft.length}/10 selected</p>
        </motion.div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.length > 0
            ? skills.map(tag => (
                <span key={tag} className="glass text-xs px-3 py-1.5 rounded-full border border-primary/20 text-foreground/70">{tag}</span>
              ))
            : <span className="text-sm text-muted-foreground italic opacity-50">Tap ✏️ to add skills</span>
          }
        </div>
      )}
    </div>
  );
}

// ─── Main profile page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { currentUser, setView, addCoins } = useAppStore();
  const { user } = useAuth();
  const { profile, updateProfile, refetch } = useProfile(user);
  const [activeSection, setActiveSection] = useState<'main' | 'coins' | 'settings' | 'donate'>('main');
  const [showFaceVerify, setShowFaceVerify] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);

  // Merge real profile data with appStore fallback
  const displayName = profile?.display_name || currentUser?.displayName || 'You';
  const role = profile?.role || currentUser?.role || 'Member';
  const bio = profile?.bio || currentUser?.bio || '';
  const city = profile?.city || currentUser?.location?.city || '';
  const reputationScore = profile?.reputation_score ?? currentUser?.reputationScore ?? 1250;
  const isVerified = profile?.is_verified || currentUser?.isVerified || false;
  const donorBadge = profile?.donor_badge || currentUser?.donorBadge || false;
  const skills = profile?.interests?.length ? profile.interests : (currentUser?.skills || []);
  const activeMood = profile?.mood_status || currentUser?.moodStatus || 'Networking';

  const avatarUrl = profile?.avatar_url ||
    (profile?.photos?.[0]) ||
    currentUser?.avatarUrl ||
    (currentUser?.photos?.[0]) ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80';

  const stats = [
    { label: 'Reputation', value: reputationScore.toString(), emoji: '⭐' },
    { label: 'Projects', value: '4', emoji: '📁' },
    { label: 'Contributions', value: '12', emoji: '🛠️' },
  ];

  const handleVerified = async () => {
    setShowFaceVerify(false);
    await updateProfile({ is_verified: true });
    // Sync rep to DB
    await updateProfile({ coin_balance: (profile?.coin_balance ?? 0) + 50 });
    addReputation(50);
  };

  const handleMoodChange = async (mood: string) => {
    await updateProfile({ mood_status: mood });
  };

  // photos managed by ProfilePhotoGallery component
  const rawPhotos = profile?.photos ?? currentUser?.photos ?? [];
  const displayPhotos = rawPhotos.filter((p: string) => !p.startsWith('video:'));

  const handlePhotosChange = () => { refetch(); };

  if (activeSection === 'settings') {
    return (
      <div className="h-full">
        <SettingsPage onClose={() => setActiveSection('main')} />
      </div>
    );
  }

  if (activeSection === 'donate') {
    return (
      <div className="h-full">
        <DonationPage onClose={() => setActiveSection('main')} />
      </div>
    );
  }

  if (activeSection === 'coins') {
    return (
      <div className="h-full overflow-y-auto scrollbar-hidden px-5 pb-8">
        <div className="flex items-center gap-3 py-4">
          <button onClick={() => setActiveSection('main')} className="text-sm text-muted-foreground">← Back</button>
          <h1 className="text-xl font-bold">Reputation & Support</h1>
        </div>

        <div className="glass rounded-2xl p-5 mb-6 text-center neon-border">
          <div className="text-5xl mb-2">⭐</div>
          <p className="text-4xl font-black text-accent">{reputationScore}</p>
          <p className="text-sm text-muted-foreground mt-1">Reputation Points</p>
        </div>

        {/* Profile Boost */}
        <div className="glass rounded-2xl p-4 mb-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-fire flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Talent Boost</p>
                <p className="text-xs text-muted-foreground">Show up first in member directory for 24h</p>
              </div>
            </div>
            {isBoosted ? (
              <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-primary">Active!</span>
              </div>
            ) : (
              <button
                onClick={() => { addReputation(-200); setIsBoosted(true); }}
                className="flex items-center gap-1.5 gradient-fire text-primary-foreground text-xs px-3 py-1.5 rounded-full"
              >
                <span>⭐</span><span>200</span>
              </button>
            )}
          </div>
        </div>

        <h3 className="font-bold mb-3">Earn Reputation</h3>
        <div className="space-y-2 mb-6">
          {[
            { action: 'Daily community check-in', coins: '+10', done: true, onClick: undefined },
            { action: 'Verify identity', coins: '+50', done: isVerified, onClick: () => { setActiveSection('main'); setShowFaceVerify(true); } },
            { action: 'Invite a creator', coins: '+100', done: false, onClick: undefined },
            { action: 'Support HRL (Donate)', coins: '+500', done: false, onClick: () => setActiveSection('donate') },
          ].map(item => (
            <div key={item.action} className="glass flex items-center justify-between px-4 py-3 rounded-xl">
              <span className="text-sm">{item.action}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-accent">{item.coins}</span>
                {item.done ? (
                  <span className="text-xs glass px-2 py-0.5 rounded-full text-foreground/60">Done ✓</span>
                ) : (
                  <button onClick={item.onClick} className="text-xs gradient-fire text-primary-foreground px-2 py-0.5 rounded-full">Go</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <h3 className="font-bold mb-3">Support the Community</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { coins: 100, price: '0.99€', popular: false },
            { coins: 500, price: '3.99€', popular: true },
            { coins: 2000, price: '12.99€', popular: false },
          ].map(pkg => (
            <motion.button
              key={pkg.coins}
              whileTap={{ scale: 0.95 }}
              className={`relative glass rounded-2xl p-4 text-center flex flex-col items-center gap-2 ${pkg.popular ? 'neon-border' : 'border border-border'}`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 gradient-fire text-primary-foreground text-xs px-2 py-0.5 rounded-full">🔥 Top</span>
              )}
              <span className="text-2xl font-black text-accent">{pkg.coins}</span>
              <span className="text-xs text-muted-foreground">rep</span>
              <span className="text-sm font-bold">{pkg.price}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hidden pb-8">
      {/* Hero */}
      <div className="relative h-64">
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-card-overlay" />
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-primary-foreground">{displayName}</h2>
                {isVerified && <Shield className="w-5 h-5 text-primary" />}
                {donorBadge && <Crown className="w-5 h-5 text-accent" />}
              </div>
              <div className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-1">
                <span className="font-medium text-primary">{role}</span>
              </div>
              <div className="flex items-center gap-1 text-primary-foreground/70 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>{city || 'Add your city'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Verification prompt */}
        {!isVerified && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowFaceVerify(true)}
            className="w-full glass border border-primary/30 rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm text-primary">Verify Your Account 🔵</p>
              <p className="text-xs text-muted-foreground">Verify identity to earn +50 rep & build trust</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary" />
          </motion.button>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center">
              <div className="text-xl">{stat.emoji}</div>
              <div className="text-lg font-black">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Current Status */}
        <div className="glass rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Work Status</p>
          <div className="flex gap-2 flex-wrap">
            {moodOptions.map(mood => (
              <button
                key={mood}
                onClick={() => handleMoodChange(mood)}
                className={`text-sm px-3 py-1.5 rounded-full transition-all ${
                  activeMood === mood
                    ? 'gradient-fire text-primary-foreground font-medium'
                    : 'glass text-muted-foreground'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Editable: Role */}
        <EditableField
          label="Professional Role"
          value={role}
          maxLength={50}
          onSave={async v => { await updateProfile({ role: v }); }}
        />

        {/* Editable: Bio */}
        <EditableField
          label="About Me"
          value={bio}
          multiline
          maxLength={300}
          onSave={async v => { await updateProfile({ bio: v }); }}
        />

        {/* Editable: Skills */}
        <SkillsEditor
          skills={skills}
          onSave={async tags => { await updateProfile({ interests: tags }); }}
        />

        {/* Reputation Button */}
        <button
          onClick={() => setActiveSection('coins')}
          className="w-full glass rounded-2xl p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Reputation & Support</p>
              <p className="text-xs text-muted-foreground">Manage your rep points and donations</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setActiveSection('settings')}
          className="w-full glass rounded-2xl p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm">Account Settings</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Logout */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full glass rounded-2xl p-4 flex items-center justify-between group text-destructive hover:bg-destructive/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <p className="font-semibold text-sm">Sign Out</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {showFaceVerify && (
          <FaceVerify
            onComplete={handleVerified}
            onClose={() => setShowFaceVerify(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

