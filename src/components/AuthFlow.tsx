import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff, Loader2, AlertCircle, Camera, Upload } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { User } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useNavigate } from 'react-router-dom';

type AuthStep = 'landing' | 'register' | 'login' | 'onboarding' | 'verify';

// ── Apple SVG icon ───────────────────────────────────────────
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.15 3.8.02 3.02 2.65 4.03 2.68 4.04l-.09.28zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

// ── Google SVG icon ───────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ── Error alert ───────────────────────────────────────────────
function ErrorAlert({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 glass border border-destructive/40 rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
      <span className="text-sm text-destructive">{msg}</span>
    </motion.div>
  );
}

// ── LANDING ───────────────────────────────────────────────────
function LandingView({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) {
  const navigate = useNavigate();
  const profiles = [
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  ];
  const features = [
    { emoji: '🤝', title: 'Networking', desc: 'Connect with top industry experts' },
    { emoji: '📁', title: 'Project Board', desc: 'Collaborate on real-world projects' },
    { emoji: '📅', title: 'Events', desc: 'Join workshops, webinars & meetups' },
    { emoji: '⭐', title: 'Reputation', desc: 'Build your professional standing' },
  ];

  return (
    <div className="min-h-screen bg-radial-glow overflow-y-auto scrollbar-hidden">
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {profiles.map((src, i) => (
            <motion.div key={i} className="absolute rounded-2xl overflow-hidden"
              style={{ width: 80 + (i % 3) * 20, height: 100 + (i % 3) * 25, left: `${(i % 3) * 33 + 3}%`, top: `${Math.floor(i / 3) * 35 + 5}%`, opacity: 0.15 + (i % 4) * 0.05 }}
              animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut' }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, hsl(240 15% 4% / 0.3) 0%, hsl(240 15% 4% / 0.95) 70%)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="mb-6">
            <div className="w-20 h-20 gradient-fire rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 glow-red">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-6xl font-black mb-3 gradient-text">HRL</h1>
            <p className="text-xl text-foreground/80 font-medium mb-2">HardbanRecords Lab Community</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">The ultimate hub for creators, developers, and experts to collaborate and grow together.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-2 my-8 flex-wrap justify-center">
            {['🚀 Professional Hub', '✓ Verified Members', '⭐ Rep System'].map((tag, i) => (
              <span key={i} className="text-xs glass px-3 py-1.5 rounded-full text-foreground/70">{tag}</span>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full max-w-xs space-y-3">
            <button onClick={onRegister} className="w-full gradient-fire text-primary-foreground font-bold text-lg py-4 rounded-2xl glow-red flex items-center justify-center gap-2 active:scale-95 transition-transform">
              Join the Community <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={onLogin} className="w-full glass text-foreground font-semibold py-4 rounded-2xl active:scale-95 transition-transform">
              Member Login
            </button>
          </motion.div>
          <p className="text-xs text-muted-foreground mt-4">By joining, you agree to our{' '}
            <button onClick={() => navigate('/terms')} className="text-primary underline">Terms</button>
            {' & '}
            <button onClick={() => navigate('/privacy')} className="text-primary underline">Privacy Policy</button>
          </p>
        </div>
      </div>

      <div className="px-6 pb-16 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Why HRL Community? 🚀</h2>
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 gradient-fire rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{f.emoji}</div>
            <div><h3 className="font-bold">{f.title}</h3><p className="text-sm text-muted-foreground">{f.desc}</p></div>
          </motion.div>
        ))}
        <div className="glass rounded-2xl p-5 text-center mt-6">
          <p className="text-4xl mb-3">🤝</p>
          <h3 className="font-bold mb-1">Built for Collaboration</h3>
          <p className="text-sm text-muted-foreground">Supported by the HardbanRecords Lab ecosystem. Core features are free for all members.</p>
        </div>
      </div>
    </div>
  );
}

// ── REGISTER ─────────────────────────────────────────────────
function RegisterView({ onSuccess, onLogin }: { onSuccess: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('You must agree to the Terms of Service'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep('verify');
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (result.error) { setError(String(result.error)); setLoading(false); }
  };

  const handleApple = async () => {
    setLoading(true); setError('');
    const result = await lovable.auth.signInWithOAuth('apple', { redirect_uri: window.location.origin });
    if (result.error) { setError(String(result.error)); setLoading(false); }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-radial-glow">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}>
          <div className="text-6xl mb-4">📧</div>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Check your inbox</h2>
        <p className="text-muted-foreground text-sm mb-2">We sent a verification link to</p>
        <p className="font-semibold text-primary mb-8">{email}</p>
        <button onClick={onSuccess} className="gradient-fire text-primary-foreground font-bold px-8 py-4 rounded-2xl glow-red">
          I verified my email ✓
        </button>
        <button onClick={() => setStep('form')} className="mt-4 text-sm text-muted-foreground">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-radial-glow px-6 pt-12 pb-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 gradient-fire rounded-xl flex items-center justify-center">
          <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
        </div>
        <span className="font-bold text-xl gradient-text">HRL Community</span>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black mb-1">Join HRL 🚀</h1>
        <p className="text-muted-foreground mb-8">Professional hub for creators and experts.</p>

        {/* Social auth buttons */}
        <div className="space-y-3 mb-4">
          <button onClick={handleGoogle} disabled={loading} className="w-full glass border border-border py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-3 text-sm hover:bg-secondary/50 transition-colors disabled:opacity-50">
            <GoogleIcon /> Continue with Google
          </button>
          <button onClick={handleApple} disabled={loading} className="w-full glass border border-border py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-3 text-sm hover:bg-secondary/50 transition-colors disabled:opacity-50">
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">or email</span><div className="flex-1 h-px bg-border" />
        </div>

        {error && <ErrorAlert msg={error} />}

        <form onSubmit={handleRegister} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="your@email.com"
              className="w-full glass rounded-2xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} required minLength={8} placeholder="Min. 8 characters"
                className="w-full glass rounded-2xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-colors pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="button" onClick={() => setAgreed(v => !v)}
            className={`w-full flex items-start gap-3 glass rounded-xl p-3 text-left transition-all ${agreed ? 'border border-primary/40' : 'border border-border'}`}>
            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed ? 'gradient-fire' : 'border border-border'}`}>
              {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Mam 18+ lat i akceptuję{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline" onClick={e => e.stopPropagation()}>Regulamin</a>
              {' oraz '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline" onClick={e => e.stopPropagation()}>Politykę Prywatności</a>
            </p>
          </button>
          <button type="submit" disabled={loading} className="w-full gradient-fire text-primary-foreground font-bold py-4 rounded-2xl glow-red text-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account Free'}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <button onClick={onLogin} className="text-primary font-semibold">Sign in</button>
        </p>
      </motion.div>
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────────
function LoginView({ onSuccess, onRegister }: { onSuccess: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onSuccess();
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (result.error) { setError(String(result.error)); setLoading(false); }
  };

  const handleApple = async () => {
    setLoading(true); setError('');
    const result = await lovable.auth.signInWithOAuth('apple', { redirect_uri: window.location.origin });
    if (result.error) { setError(String(result.error)); setLoading(false); }
  };

  const handleReset = async () => {
    if (!resetEmail) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false); setResetSent(true);
  };

  if (showReset) {
    return (
      <div className="min-h-screen flex flex-col bg-radial-glow px-6 pt-12 pb-8">
        <button onClick={() => setShowReset(false)} className="text-muted-foreground mb-8 flex items-center gap-1 text-sm">← Back to login</button>
        <h1 className="text-2xl font-black mb-2">Reset password 🔑</h1>
        <p className="text-muted-foreground text-sm mb-6">Enter your email and we'll send a reset link.</p>
        {resetSent ? (
          <div className="glass border border-primary/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-semibold">Check your inbox</p>
            <p className="text-sm text-muted-foreground mt-1">Reset link sent to {resetEmail}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <input value={resetEmail} onChange={e => setResetEmail(e.target.value)} type="email" placeholder="your@email.com"
              className="w-full glass rounded-2xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-colors" />
            <button onClick={handleReset} disabled={loading || !resetEmail} className="w-full gradient-fire text-primary-foreground font-bold py-4 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-radial-glow px-6 pt-12 pb-8">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 gradient-fire rounded-xl flex items-center justify-center">
          <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
        </div>
        <span className="font-bold text-xl gradient-text">HRL Community</span>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black mb-1">Welcome back 🚀</h1>
        <p className="text-muted-foreground mb-8">Ready to collaborate with the lab?</p>

        <div className="space-y-3 mb-4">
          <button onClick={handleGoogle} disabled={loading} className="w-full glass border border-border py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-3 text-sm hover:bg-secondary/50 transition-colors disabled:opacity-50">
            <GoogleIcon /> Continue with Google
          </button>
          <button onClick={handleApple} disabled={loading} className="w-full glass border border-border py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-3 text-sm hover:bg-secondary/50 transition-colors disabled:opacity-50">
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">or email</span><div className="flex-1 h-px bg-border" />
        </div>

        {error && <ErrorAlert msg={error} />}

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="your@email.com"
              className="w-full glass rounded-2xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} required placeholder="Your password"
                className="w-full glass rounded-2xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-colors pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <button type="button" onClick={() => setShowReset(true)} className="text-xs text-primary">Forgot password?</button>
          </div>
          <button type="submit" disabled={loading} className="w-full gradient-fire text-primary-foreground font-bold py-4 rounded-2xl glow-red text-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          No account?{' '}
          <button onClick={onRegister} className="text-primary font-semibold">Join free</button>
        </p>
      </motion.div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────
function OnboardingView({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    display_name: '',
    role: '',
    bio: '',
    interests: [] as string[],
    city: '',
  });

  const allSkills = ['React', 'TypeScript', 'Node.js', 'UI/UX', 'Python', 'ML/AI', 'Music Production', 'Video Editing', 'Marketing', 'SEO', 'Web3', 'Project Management', 'Business Dev', 'Content Strategy'];
  const roles = ['Developer', 'Designer', 'Creator', 'Producer', 'Manager', 'Expert', 'Investor', 'Other'];
  const cities = ['Warsaw 🏙️','Kraków 🏰','Gdańsk ⚓','Wrocław 🌉','Poznań 🎺','Łódź 🏭','Katowice ⛏️','Remote 🌍'];
  const toggleSkill = (i: string) => setData(d => ({ ...d, interests: d.interests.includes(i) ? d.interests.filter(x => x !== i) : [...d.interests, i] }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (userId: string): Promise<string> => {
    if (!avatarFile) return '';
    setUploadingAvatar(true);
    const ext = avatarFile.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
    setUploadingAvatar(false);
    if (error) return '';
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    return publicUrl;
  };

  const handleComplete = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const avatarUrl = await uploadAvatar(user.id);
      await db.from('profiles').update({
        display_name: data.display_name,
        role: data.role,
        bio: data.bio,
        interests: data.interests,
        city: data.city.replace(/ .*/g, ''),
        profile_complete: true,
        ...(avatarUrl && { avatar_url: avatarUrl, photos: [avatarUrl] }),
      }).eq('id', user.id);
    }
    setLoading(false);
    onComplete();
  };

  const steps = [
    {
      title: 'Profile Photo 📸',
      subtitle: 'First impressions matter in the community',
      valid: true,
      content: (
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => photoInputRef.current?.click()}
            className="relative w-40 h-40 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-primary/50 hover:border-primary transition-all flex items-center justify-center bg-secondary/30"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Tap to add photo</p>
              </div>
            )}
            <div className="absolute bottom-2 right-2 w-8 h-8 gradient-fire rounded-full flex items-center justify-center">
              <Upload className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />
          {avatarPreview && (
            <button
              onClick={() => { setAvatarFile(null); setAvatarPreview(''); }}
              className="text-xs text-muted-foreground underline"
            >
              Change photo
            </button>
          )}
        </div>
      ),
    },
    {
      title: "What's your name? 👋",
      subtitle: 'This is how other members will see you',
      valid: data.display_name.trim().length >= 2,
      content: (
        <input value={data.display_name} onChange={e => setData({ ...data, display_name: e.target.value })} placeholder="Full name or nickname"
          className="w-full glass rounded-2xl px-4 py-4 text-lg outline-none border border-border focus:border-primary transition-colors" autoFocus />
      ),
    },
    {
      title: "What's your role? 💼",
      subtitle: 'Select your primary expertise',
      valid: !!data.role,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {roles.map(r => (
            <button key={r} onClick={() => setData({ ...data, role: r })}
              className={`py-4 rounded-2xl font-semibold text-sm transition-all ${data.role === r ? 'gradient-fire text-primary-foreground' : 'glass border border-border text-foreground'}`}>
              {r}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Skills & Expertise 🎨',
      subtitle: 'Pick at least 3 skills',
      valid: data.interests.length >= 3,
      content: (
        <div className="flex flex-wrap gap-2">
          {allSkills.map(i => (
            <button key={i} onClick={() => toggleSkill(i)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${data.interests.includes(i) ? 'gradient-fire text-primary-foreground' : 'glass border border-border text-foreground'}`}>
              {i}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'About you 📝',
      subtitle: 'A short professional bio',
      valid: true,
      content: (
        <textarea value={data.bio} onChange={e => setData({ ...data, bio: e.target.value })} placeholder="Tell the community what you're working on..."
          className="w-full glass rounded-2xl px-4 py-3.5 text-sm outline-none border border-border focus:border-primary transition-colors resize-none h-32" />
      ),
    },
    {
      title: 'Your Location 📍',
      subtitle: 'Connect with local members',
      valid: !!data.city,
      content: (
        <div className="grid grid-cols-2 gap-2">
          {cities.map(c => (
            <button key={c} onClick={() => setData({ ...data, city: c })}
              className={`py-3 rounded-2xl text-sm font-medium transition-all ${data.city === c ? 'gradient-fire text-primary-foreground' : 'glass border border-border text-foreground'}`}>
              {c}
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-radial-glow flex flex-col px-6 pt-12 pb-8">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'gradient-fire' : 'bg-border'}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
          <h2 className="text-2xl font-black mb-1">{current.title}</h2>
          <p className="text-muted-foreground text-sm mb-6">{current.subtitle}</p>
          {current.content}
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-3 pt-4">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="px-6 py-4 glass rounded-2xl font-semibold">← Back</button>
        )}
        <button
          onClick={isLast ? handleComplete : () => setStep(s => s + 1)}
          disabled={!current.valid || loading}
          className="flex-1 gradient-fire text-primary-foreground font-bold py-4 rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLast ? 'Enter Community 🚀' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

// ── MAIN AUTH FLOW ───────────────────────────────────────────
export default function AuthFlow() {
  const { setView, setCurrentUser } = useAppStore();
  const [step, setStep] = useState<AuthStep>('landing');
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth changes (handles OAuth redirect too)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabase as any;
        const { data: profile } = await db.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          const appUser: User = {
            id: profile.id,
            displayName: profile.display_name || session.user.email?.split('@')[0] || 'User',
            age: profile.age || 25,
            gender: profile.gender || '',
            orientation: profile.orientation || '',
            bio: profile.bio || '',
            avatarUrl: profile.avatar_url || '',
            isVerified: profile.is_verified,
            donorBadge: profile.donor_badge,
            coinBalance: profile.coin_balance,
            moodStatus: profile.mood_status,
            location: { city: profile.city || 'Warsaw' },
            interests: profile.interests || [],
            photos: profile.photos?.length ? profile.photos : [profile.avatar_url || ''],
            relationshipType: profile.relationship_type || 'both',
            profileComplete: profile.profile_complete,
          };
          setCurrentUser(appUser);
          if (!profile.profile_complete) {
            setStep('onboarding');
          } else {
            setView('app');
          }
        }
      }
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [setView, setCurrentUser]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-radial-glow flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 gradient-fire rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 glow-red">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'landing' && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LandingView onRegister={() => setStep('register')} onLogin={() => setStep('login')} />
        </motion.div>
      )}
      {step === 'register' && (
        <motion.div key="register" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
          <RegisterView onSuccess={() => setStep('onboarding')} onLogin={() => setStep('login')} />
        </motion.div>
      )}
      {step === 'login' && (
        <motion.div key="login" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
          <LoginView onSuccess={() => setStep('onboarding')} onRegister={() => setStep('register')} />
        </motion.div>
      )}
      {step === 'onboarding' && (
        <motion.div key="onboarding" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
          <OnboardingView onComplete={() => setView('app')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
