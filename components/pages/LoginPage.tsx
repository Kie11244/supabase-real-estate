import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (typeof err === 'string') {
          errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String(err.message);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90" aria-hidden />
      <div className="relative z-10 grid w-full max-w-5xl gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.1fr,1fr]">
        <div className="flex flex-col justify-between gap-10 text-white">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
              Estato Portal
            </span>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">ยินดีต้อนรับสู่แดชบอร์ดผู้ดูแล</h2>
            <p className="text-sm text-white/70">
              จัดการประกาศอสังหาริมทรัพย์ได้อย่างมืออาชีพ อัปเดตข้อมูลแบบเรียลไทม์ เชื่อมต่อกับลูกค้าได้ทุกที่ ทุกเวลา
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold text-white">Analytics</p>
              <p className="mt-1 text-white/60">ติดตามผลการขายและการเข้าชม</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold text-white">Automation</p>
              <p className="mt-1 text-white/60">แจ้งเตือนลูกค้าอัตโนมัติ</p>
            </div>
          </div>
        </div>

        <form className="space-y-6 rounded-3xl border border-white/10 bg-white p-8 shadow-xl shadow-black/20" onSubmit={handleLogin}>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold text-slate-900">เข้าสู่ระบบ</h3>
            <p className="text-sm text-slate-500">กรอกอีเมลและรหัสผ่านที่ได้รับจากทีมงาน</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email-address" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="rounded-2xl bg-rose-50/90 py-3 text-center text-sm font-semibold text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-blue-600/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;