'use client';

import Link from 'next/link';
import { Wallet, ShieldCheck, TrendingUp, Handshake, ChevronRight, Moon, Sun, Cloud } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isLoggedIn, hasHydrated } = useFinanceStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router, mounted, hasHydrated]);

  if (!mounted || !hasHydrated) return null;
  if (isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Wallet className="w-4 h-4 text-white dark:text-slate-900" />
            </div>
            <span className="text-lg font-bold tracking-tight">Sleep-Well</span>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link href="/login" className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="text-xs sm:text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 sm:px-5 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md shadow-slate-900/10 dark:shadow-none">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Sistem Pertahanan Kas Pribadi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] sm:leading-[1.1] max-w-3xl">
              Kuasai Arus Kas Anda, <br className="hidden sm:block" />
              <span className="text-slate-400 dark:text-slate-500">Bukan Sekadar Mencatat.</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium px-2">
              Sleep-Well Finance menerapkan metodologi &quot;Uang Dingin&quot; untuk memastikan Anda selalu memiliki bantalan kas yang aman sebelum memutuskan untuk berbelanja.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 w-full sm:w-auto px-4 sm:px-0">
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 dark:shadow-none">
                <span>Mulai Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Filosofi &quot;Sleep-Well&quot;</h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kebanyakan aplikasi keuangan hanya memberi tahu ke mana uang Anda pergi. Kami memberi tahu Anda apakah Anda <strong>aman</strong> untuk menghabiskannya.
                </p>
              </div>
              
              <div className="space-y-5 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">01</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Uang Dingin (Threshold)</h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Batas saldo psikologis yang tidak boleh disentuh. Ini adalah benteng pertahanan terakhir Anda.</p>
                  </div>
                </div>
                
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">02</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Amunisi Surplus</h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Hasil dari Saldo Utama dikurangi Threshold. Inilah uang yang benar-benar &quot;bebas digunakan&quot; tanpa rasa bersalah.</p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400">03</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Peta Kas & Mutasi</h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Alokasikan uang Anda ke berbagai pos (dompet/bank) agar tidak menumpuk di satu tempat. Pantau mutasi dengan presisi.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 flex flex-col justify-center space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo Utama</span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Aman</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">Rp 12.500.000</p>
                </div>
                <div className="p-4 sm:p-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold opacity-60 uppercase tracking-widest">Threshold</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold">Rp 10.000.000</p>
                </div>
                <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl border border-blue-100 dark:border-blue-800">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Surplus (Amunisi)</span>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">Rp 2.500.000</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-32 sm:h-32 bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:init-16 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Fitur Unggulan</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Dirancang untuk kecepatan dan ketepatan pengambilan keputusan finansial.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 sm:mb-6">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Pagu Piutang</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Batasi &quot;kebaikan hati&quot; Anda. Tetapkan pagu maksimal untuk pinjaman ke keluarga atau teman agar tidak mengganggu operasional harian.
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 sm:mb-6">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Manajemen Aset</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Pantau pertumbuhan kekayaan bersih Anda melalui pencatatan aset fisik dan investasi yang terintegrasi dengan arus kas.
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 dark:bg-amber-900/30 rounded-lg sm:rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 sm:mb-6">
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Cloud Sync</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Data tersinkronisasi secara real-time ke Firebase. Akses dari perangkat mana saja dengan keamanan tingkat tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-6 sm:space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white dark:text-slate-900 tracking-tight">Siap untuk Tidur Nyenyak?</h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 dark:text-slate-500 max-w-lg mx-auto">Bergabunglah dengan sistem yang memprioritaskan keamanan finansial Anda di atas segalanya.</p>
            <div className="pt-4">
              <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:scale-105 transition-transform">
                <span>Daftar Gratis Sekarang</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
          {/* Decorative background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white dark:bg-slate-900 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white dark:bg-slate-900 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span className="font-bold text-slate-600 dark:text-slate-300">Sleep-Well Finance</span>
          </div>
          <p>© {new Date().getFullYear()} Sistem Pertahanan Kas Pribadi. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

