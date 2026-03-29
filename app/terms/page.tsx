'use client';

import Link from 'next/link';
import { ChevronLeft, Wallet } from 'lucide-react';

export default function TermsPage() {
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
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Syarat & Ketentuan</h1>
            <p className="text-slate-500 dark:text-slate-400">Terakhir diperbarui: 29 Maret 2026</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Penerimaan Layanan</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Dengan menggunakan Sleep-Well Finance, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">2. Akun Pengguna</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda juga bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">3. Penggunaan yang Sah</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anda setuju untuk menggunakan layanan Sleep-Well Finance hanya untuk tujuan yang sah dan tidak melanggar hukum yang berlaku.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">4. Batasan Tanggung Jawab</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Sleep-Well Finance adalah alat bantu pencatatan keuangan. Kami tidak bertanggung jawab atas keputusan finansial yang Anda ambil berdasarkan data di dalam aplikasi ini.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
