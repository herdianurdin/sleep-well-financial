'use client';

import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Kebijakan Privasi</h1>
            <p className="text-slate-500 dark:text-slate-400">Terakhir diperbarui: 29 Maret 2026</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar, seperti nama dan alamat email. Kami juga menyimpan data transaksi keuangan yang Anda masukkan untuk keperluan fungsionalitas aplikasi.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">2. Penggunaan Informasi</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Informasi Anda digunakan semata-mata untuk menyediakan layanan Sleep-Well Finance, termasuk sinkronisasi data antar perangkat dan pengamanan akun Anda melalui Firebase Authentication.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">3. Keamanan Data</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Kami menggunakan layanan Firebase yang memiliki standar keamanan industri untuk melindungi data Anda. Data transaksi Anda disimpan secara terenkripsi dan hanya dapat diakses oleh Anda melalui akun yang sah.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">4. Hak Anda</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anda memiliki hak penuh untuk mengakses, mengubah, atau menghapus data Anda kapan saja melalui fitur pengaturan di dalam aplikasi.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
