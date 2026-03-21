import { motion, AnimatePresence } from 'framer-motion';
import { Users, Folder, MessageCircle, Calendar, User, Bell, ShieldCheck } from 'lucide-react';
import { useAppStore, type AppTab } from '@/store/appStore';
import { useState } from 'react';
import DiscoverPage from './DiscoverPage';
import ProjectsPage from './ProjectsPage';
import ChatsPage from './ChatsPage';
import LivePage from './LivePage';
import ProfilePage from './ProfilePage';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useConversations } from '@/hooks/useConversations';

const tabs: { id: AppTab; icon: React.ComponentType<any>; label: string; emoji: string }[] = [
  { id: 'members', icon: Users, label: 'Members', emoji: '👥' },
  { id: 'projects', icon: Folder, label: 'Projects', emoji: '📁' },
  { id: 'chats', icon: MessageCircle, label: 'Chats', emoji: '💬' },
  { id: 'events', icon: Calendar, label: 'Events', emoji: '📅' },
  { id: 'profile', icon: User, label: 'Profile', emoji: '👤' },
];

const NOTIFICATIONS = [
  { id: 'n1', emoji: '🚀', text: 'New project posted in Projects', time: '2m ago', unread: true },
  { id: 'n2', emoji: '🤝', text: "Alex wants to collaborate!", time: '15m ago', unread: true },
  { id: 'n3', emoji: '💬', text: 'Zara sent you a message', time: '1h ago', unread: true },
  { id: 'n4', emoji: '📢', text: 'System update: V2.0 is live', time: '2h ago', unread: false },
  { id: 'n5', emoji: '🎁', text: 'You received a community badge!', time: '3h ago', unread: false },
];

export default function AppLayout() {
  const { activeTab, setActiveTab, currentUser } = useAppStore();
  const { user } = useAuth();
  const { profile } = useProfile(user);
  const { conversations } = useConversations(user?.id ?? null);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifsSeen, setNotifsSeen] = useState(false);
  const unreadNotifs = notifsSeen ? 0 : NOTIFICATIONS.filter(n => n.unread).length;

  // Use real coin balance from profile, fall back to store
  const coinBalance = profile?.coin_balance ?? currentUser?.coinBalance ?? 350;

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe pt-4 pb-3 glass-strong sticky top-0 z-40">
        <div className="flex items-center gap-2.5 group transition-all duration-300">
          <div className="relative">
            <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter text-white leading-none group-hover:text-primary transition-colors">HRL</span>
            <span className="text-[10px] font-medium text-white/40 leading-none uppercase tracking-[0.2em]">Community</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Verification Badge */}
          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Verified Hub</span>
          </div>

          {/* Rep Points (Repurposed from Coins) */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full"
          >
            <span className="text-sm">⭐</span>
            <span className="text-sm font-semibold text-accent">{coinBalance} Rep</span>
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(v => !v); setNotifsSeen(true); }}
              className="relative w-9 h-9 glass rounded-full flex items-center justify-center"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-bold">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Notif dropdown */}
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-11 right-0 w-72 glass-strong rounded-2xl border border-border overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-bold text-sm">Notifications</p>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div
                      key={n.id}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/40 ${n.unread ? 'bg-primary/5' : ''}`}
                    >
                      <span className="text-xl">{n.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{n.text}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Backdrop for notifications */}
      {showNotifs && (
        <div className="fixed inset-0 z-30" onClick={() => setShowNotifs(false)} />
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'members' && <DiscoverPage />}
            {activeTab === 'projects' && <ProjectsPage />}
            {activeTab === 'chats' && <ChatsPage />}
            {activeTab === 'events' && <LivePage />}
            {activeTab === 'profile' && <ProfilePage />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav-blur flex items-center justify-around px-2 pb-safe pb-4 pt-2 sticky bottom-0 z-40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 gradient-fire rounded-2xl opacity-20"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                />
              )}
              <span className="text-xl">{tab.emoji}</span>
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
              {tab.id === 'chats' && totalUnread > 0 && (
                <span className="absolute -top-0.5 right-2 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-bold">
                  {totalUnread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
