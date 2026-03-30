'use client';

import { useState, useEffect } from 'react';
import { Wallet, CircleAlert, Eye, EyeOff } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const { isLoggedIn, setLoggedIn, hasHydrated, showToast } = useFinanceStore();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router, mounted, hasHydrated]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.toLowerCase());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username && password) {
      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        setLoggedIn(true, userCredential.user.uid);
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Login error:', err);
        setError('Email atau password salah. Silakan coba lagi.');
        showToast('Gagal masuk. Periksa kembali kredensial Anda.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!mounted) return null;
  if (isLoggedIn) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Wallet className="w-8 h-8 text-white dark:text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Sleep-Well Finance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Masuk untuk mengelola keuangan Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start space-x-2">
              <CircleAlert className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={username}
                onChange={handleUsernameChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm text-slate-900 dark:text-slate-50"
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm text-slate-900 dark:text-slate-50 pr-12"
                  placeholder="password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Masuk'
            )}
          </button>
          
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Belum punya akun? <Link href="/register" className="font-bold text-slate-900 dark:text-white hover:underline">Daftar di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
