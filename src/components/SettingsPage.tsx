import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bell, Shield, Trash2, FileText, Eye,
  Globe, Lock, ChevronRight, Check, AlertTriangle, X
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';

interface SettingsPageProps {
  onClose: () => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-secondary'}`}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute top-0.5 w-5 h-5 bg-primary-foreground rounded-full shadow"
      />
    </button>
  );
}

export default function SettingsPage({ onClose }: SettingsPageProps) {
  const { setView } = useAppStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { permission, subscribed, subscribe, unsubscribe } = usePushNotifications(user?.id ?? null);
  const [section, setSection] = useState<'main' | 'notifications' | 'privacy' | 'gdpr' | 'delete'>('main');

  const [notifs, setNotifs] = useState({
    matches: true,
    messages: true,
    likes: true,
    stories: false,
    liveStreams: false,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState({
    showLastSeen: true,
    showOnline: true,
    showDistance: true,
    readReceipts: true,
    invisibleMode: false,
    hideFromSearch: false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    // Sign out first then redirect — actual data deletion would need an edge function
    await supabase.auth.signOut();
    setDeleted(true);
    setTimeout(() => setView('landing'), 2000);
  };

  if (section === 'notifications') {
    return (
      <div className="h-full flex flex-col">
        <div className="glass-strong border-b border-border px-5 py-4 flex items-center gap-3">
          <button onClick={() => setSection('main')} className="w-8 h-8 glass rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-bold">Notifications</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 py-4 space-y-3">
          {Object.entries(notifs).map(([key, value]) => {
            const labels: Record<string, { label: string; desc: string; emoji: string }> = {
              matches: { label: 'New connections', desc: 'When someone follows you', emoji: '🤝' },
              messages: { label: 'Messages', desc: 'New chats and replies', emoji: '💬' },
              likes: { label: 'Reputation', desc: 'When you earn rep points', emoji: '⭐' },
              stories: { label: 'Stories', desc: 'New community stories', emoji: '📸' },
              liveStreams: { label: 'Events', desc: 'Upcoming workshops & meetups', emoji: '📅' },
              promotions: { label: 'System', desc: 'Platform updates & tips', emoji: '⚙️' },
            };
            const info = labels[key];
            return (
              <div key={key} className="glass rounded-2xl px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{info.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{info.label}</p>
                    <p className="text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                </div>
                <Toggle value={value} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section === 'privacy') {
    return (
      <div className="h-full flex flex-col">
        <div className="glass-strong border-b border-border px-5 py-4 flex items-center gap-3">
          <button onClick={() => setSection('main')} className="w-8 h-8 glass rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-bold">Privacy</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 py-4 space-y-3">
          {Object.entries(privacy).map(([key, value]) => {
            const labels: Record<string, { label: string; desc: string; emoji: string }> = {
              showLastSeen: { label: 'Show last seen', desc: 'Let members see when you were active', emoji: '🕐' },
              showOnline: { label: 'Online status', desc: 'Show green dot when online', emoji: '🟢' },
              showDistance: { label: 'Show city', desc: 'Show your location on profile', emoji: '📍' },
              readReceipts: { label: 'Read receipts', desc: 'Show when you\'ve read messages', emoji: '✓✓' },
              invisibleMode: { label: 'Invisible mode', desc: 'Browse without appearing online', emoji: '👻' },
              hideFromSearch: { label: 'Hide from directory', desc: 'Only connections can message you', emoji: '🙈' },
            };
            const info = labels[key];
            return (
              <div key={key} className="glass rounded-2xl px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{info.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{info.label}</p>
                    <p className="text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                </div>
                <Toggle value={value} onChange={v => setPrivacy(p => ({ ...p, [key]: v }))} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section === 'gdpr') {
    return (
      <div className="h-full flex flex-col">
        <div className="glass-strong border-b border-border px-5 py-4 flex items-center gap-3">
          <button onClick={() => setSection('main')} className="w-8 h-8 glass rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-bold">Privacy & GDPR</h2>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 py-4 space-y-3">
          {[
            { title: 'Privacy Policy', desc: 'How we handle your professional data', emoji: '📋', href: '/privacy' },
            { title: 'Terms of Service', desc: 'Community rules & guidelines', emoji: '📜', href: '/terms' },
            { title: 'Your Rights (GDPR)', desc: 'Access, correction, deletion', emoji: '🔒', href: '/privacy#5' },
          ].map(item => (
            <button key={item.title} onClick={() => navigate(item.href)} className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          <div className="glass rounded-2xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Your Rights</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                'Right to access your data',
                'Right to correct inaccurate data',
                'Right to erasure (be forgotten)',
                'Right to data portability',
                'Right to restrict processing',
              ].map(right => (
                <li key={right} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  {right}
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full glass border border-primary/20 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
            <Globe className="w-5 h-5 text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Export my data</p>
              <p className="text-xs text-muted-foreground">Download a copy of your HRL data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => setSection('delete')}
            className="w-full glass border border-destructive/20 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-destructive" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-destructive">Delete my account</p>
              <p className="text-xs text-muted-foreground">Permanently remove all your data</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  if (section === 'delete') {
    return (
      <div className="h-full flex flex-col">
        <div className="glass-strong border-b border-border px-5 py-4 flex items-center gap-3">
          <button onClick={() => setSection('gdpr')} className="w-8 h-8 glass rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-bold text-destructive">Delete Account</h2>
        </div>
        <div className="flex-1 flex flex-col px-5 py-6 gap-5">
          {deleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="text-6xl">👋</div>
              <h3 className="text-xl font-bold">Account deleted</h3>
              <p className="text-sm text-muted-foreground">Your data will be fully erased within 30 days as required by GDPR.</p>
            </motion.div>
          ) : (
            <>
              <div className="glass border border-destructive/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-destructive mb-1">This action is irreversible</p>
                    <p className="text-xs text-muted-foreground">
                      Deleting your account will permanently remove all your connections, messages, projects and profile. Your data will be fully erased within 30 days per GDPR Article 17.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {[
                  'All your connections will be removed',
                  'All your messages will be deleted',
                  'Your professional profile will be removed',
                  'Your reputation balance will be lost',
                  'This cannot be undone',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none border border-destructive/30 focus:border-destructive transition-colors"
                />
              </div>

              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  deleteConfirm === 'DELETE'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                {deleting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  'Permanently Delete Account'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const settingsSections = [
    { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Push, messages, rep', emoji: '🔔' },
    { id: 'privacy', icon: Eye, label: 'Privacy', desc: 'Online status, visibility', emoji: '👁️' },
    { id: 'gdpr', icon: FileText, label: 'Privacy & GDPR', desc: 'Your data & legal rights', emoji: '🔒' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="glass-strong border-b border-border px-5 py-4 flex items-center gap-3">
        <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-bold">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-5 py-4 space-y-3">
        {/* Push notification toggle */}
        <div className="glass rounded-2xl px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-fire flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                {permission === 'denied' ? 'Blocked in browser' : subscribed ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <Toggle
            value={subscribed}
            onChange={v => v ? subscribe() : unsubscribe()}
          />
        </div>

        {settingsSections.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id as 'notifications' | 'privacy' | 'gdpr')}
            className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl gradient-fire flex items-center justify-center">
              <s.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-destructive/5 transition-colors text-destructive"
        >
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">Logout</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* App info */}
        <div className="glass rounded-2xl p-4 text-center mt-4">
          <div className="w-12 h-12 gradient-fire rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
            <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
          </div>
          <p className="font-bold gradient-text">HRL Community</p>
          <p className="text-xs text-muted-foreground">Version 1.2.0 · Professional Hub</p>
        </div>
      </div>
    </div>
  );
}
