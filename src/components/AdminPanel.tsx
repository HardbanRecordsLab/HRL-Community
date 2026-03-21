import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Flag, BarChart3, Shield, Ban, CheckCircle, Clock,
  TrendingUp, MessageSquare, Calendar, Coins, Folder, ArrowLeft,
  Search, Filter, Eye, XCircle, AlertTriangle, Activity
} from 'lucide-react';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockUsers = [
  { id: '1', name: 'Sofia Kowalska', email: 'sofia@example.com', age: 26, status: 'active', verified: true, donorBadge: true, joinedAt: '2024-01-15', reports: 0, coins: 320 },
  { id: '2', name: 'Mia Nowak', email: 'mia@example.com', age: 24, status: 'active', verified: true, donorBadge: false, joinedAt: '2024-02-03', reports: 1, coins: 90 },
  { id: '3', name: 'Elena Wiśniewska', email: 'elena@example.com', age: 29, status: 'banned', verified: false, donorBadge: false, joinedAt: '2024-01-28', reports: 5, coins: 0 },
  { id: '4', name: 'Zara Dąbrowska', email: 'zara@example.com', age: 23, status: 'active', verified: true, donorBadge: false, joinedAt: '2024-03-10', reports: 0, coins: 450 },
  { id: '5', name: 'Alex Jankowski', email: 'alex@example.com', age: 28, status: 'suspended', verified: true, donorBadge: true, joinedAt: '2024-02-20', reports: 2, coins: 150 },
  { id: '6', name: 'Marco Rossi', email: 'marco@example.com', age: 31, status: 'active', verified: false, donorBadge: false, joinedAt: '2024-04-05', reports: 0, coins: 60 },
];

const mockReports = [
  { id: 'r1', reporterId: 'u2', reporterName: 'Mia Nowak', reportedId: 'u3', reportedName: 'Elena Wiśniewska', reason: 'Inappropriate content', status: 'pending', createdAt: '2 hours ago', priority: 'high' },
  { id: 'r2', reporterId: 'u1', reporterName: 'Sofia Kowalska', reportedId: 'u5', reportedName: 'Alex Jankowski', reason: 'Spam messages', status: 'pending', createdAt: '5 hours ago', priority: 'medium' },
  { id: 'r3', reporterId: 'u4', reporterName: 'Zara Dąbrowska', reportedId: 'u6', reportedName: 'Marco Rossi', reason: 'Fake profile', status: 'reviewed', createdAt: '1 day ago', priority: 'low' },
  { id: 'r4', reporterId: 'u5', reporterName: 'Alex Jankowski', reportedId: 'u3', reportedName: 'Elena Wiśniewska', reason: 'Harassment', status: 'resolved', createdAt: '2 days ago', priority: 'high' },
];

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<any>; label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 flex items-start gap-3"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </motion.div>
  );
}

// ── Users tab ─────────────────────────────────────────────────────────────────

function UsersTab() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
    ));
  };

  const statusColor: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400/10',
    banned: 'text-destructive bg-destructive/10',
    suspended: 'text-accent bg-accent/10',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search members..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 gradient-fire rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{user.name}</span>
                {user.verified && <span className="text-xs text-primary">✓</span>}
                {user.donorBadge && <span className="text-xs">💎</span>}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[user.status]}`}>
                  {user.status}
                </span>
                {user.reports > 0 && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{user.reports} reports
                  </span>
                )}
                <span className="text-xs text-accent">⭐ {user.coins} Rep</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-secondary/50 transition-colors">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => toggleBan(user.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  user.status === 'banned'
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                    : 'bg-destructive/20 hover:bg-destructive/30'
                }`}
              >
                {user.status === 'banned'
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  : <Ban className="w-3.5 h-3.5 text-destructive" />
                }
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Reports tab ───────────────────────────────────────────────────────────────

function ReportsTab() {
  const [reports, setReports] = useState(mockReports);

  const resolve = (id: string) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));

  const priorityColor: Record<string, string> = {
    high: 'text-destructive bg-destructive/10 border-destructive/20',
    medium: 'text-accent bg-accent/10 border-accent/20',
    low: 'text-muted-foreground bg-muted/30 border-border',
  };
  const statusColor: Record<string, string> = {
    pending: 'text-primary',
    reviewed: 'text-accent',
    resolved: 'text-emerald-400',
  };

  const pending = reports.filter(r => r.status === 'pending');
  const rest = reports.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
          <AlertTriangle className="w-4 h-4" />
          {pending.length} pending reports require action
        </div>
      )}

      <div className="space-y-2">
        {[...pending, ...rest].map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glass rounded-2xl p-4 border ${priorityColor[report.priority].split(' ')[2]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${priorityColor[report.priority]}`}>
                    {report.priority}
                  </span>
                  <span className={`text-xs font-medium ${statusColor[report.status]}`}>
                    {report.status}
                  </span>
                </div>
                <div className="text-sm font-semibold">{report.reason}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  <span className="text-foreground/70">{report.reporterName}</span>
                  {' reported '}
                  <span className="text-foreground/70">{report.reportedName}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{report.createdAt}</div>
              </div>
              {report.status === 'pending' && (
                <button
                  onClick={() => resolve(report.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs gradient-fire text-primary-foreground px-3 py-1.5 rounded-xl font-medium"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Resolve
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Stats tab ─────────────────────────────────────────────────────────────────

function StatsTab() {
  const stats = [
    { icon: Activity, label: 'Active Today', value: 847, sub: '+12% vs yesterday', color: 'gradient-fire' },
    { icon: Users, label: 'Active (7 days)', value: 3241, sub: '↑ growing steadily', color: 'gradient-fire' },
    { icon: Folder, label: 'Projects Today', value: 42, sub: '85% active rate', color: 'bg-primary/80' },
    { icon: MessageSquare, label: 'Messages Today', value: '12.4k', sub: 'Avg 14.6 per user', color: 'bg-accent/80' },
    { icon: Calendar, label: 'Events Hosted', value: 12, sub: 'Avg 45 attendees', color: 'bg-primary/80' },
    { icon: Coins, label: 'Revenue (Today)', value: '€148', sub: 'Rep + donations', color: 'gradient-fire' },
  ];

  const chartData = [
    { day: 'Mon', users: 620, matches: 180, revenue: 95 },
    { day: 'Tue', users: 710, matches: 210, revenue: 118 },
    { day: 'Wed', users: 680, matches: 195, revenue: 102 },
    { day: 'Thu', users: 790, matches: 225, revenue: 131 },
    { day: 'Fri', users: 920, matches: 268, revenue: 156 },
    { day: 'Sat', users: 1050, matches: 312, revenue: 189 },
    { day: 'Sun', users: 847, matches: 234, revenue: 148 },
  ];

  const maxUsers = Math.max(...chartData.map(d => d.users));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Weekly chart */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Weekly Active Users</span>
        </div>
        <div className="flex items-end gap-1.5 h-24">
          {chartData.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.users / maxUsers) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                className="w-full rounded-t-lg gradient-fire min-h-[4px]"
                style={{ height: `${(d.users / maxUsers) * 80}px` }}
              />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Coins className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold">Revenue Breakdown (Today)</span>
        </div>
        {[
          { label: 'Reputation purchases', amount: '€89', pct: 60 },
          { label: 'Donations', amount: '€42', pct: 28 },
          { label: 'Boost purchases', amount: '€17', pct: 12 },
        ].map((item, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold">{item.amount}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                className="h-full gradient-fire rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'stats', icon: BarChart3, label: 'Stats' },
  { id: 'users', icon: Users, label: 'Members' },
  { id: 'reports', icon: Flag, label: 'Reports' },
];

export default function AdminPanel() {
  const [tab, setTab] = useState<'stats' | 'users' | 'reports'>('stats');
  const pendingReports = mockReports.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="glass-strong sticky top-0 z-40 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="w-8 h-8 glass rounded-xl flex items-center justify-center hover:bg-secondary/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-fire flex items-center justify-center text-sm">🛡️</div>
            <div>
              <div className="font-bold text-sm gradient-text">Admin Panel</div>
              <div className="text-xs text-muted-foreground">HRL Dashboard</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 max-w-2xl mx-auto">
        {/* Quick summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-5"
        >
          {[
            { label: 'Total Members', value: '6,142', icon: '👥' },
            { label: 'Online Now', value: '847', icon: '🟢' },
            { label: 'Open Reports', value: pendingReports.toString(), icon: '🚨' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-3 text-center">
              <div className="text-xl mb-0.5">{s.icon}</div>
              <div className="font-bold text-base">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-2 glass rounded-2xl p-1.5 mb-5">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                tab === t.id ? 'gradient-fire text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === 'reports' && pendingReports > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-xs flex items-center justify-center text-primary-foreground font-bold">
                  {pendingReports}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {tab === 'stats' && <StatsTab />}
            {tab === 'users' && <UsersTab />}
            {tab === 'reports' && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
