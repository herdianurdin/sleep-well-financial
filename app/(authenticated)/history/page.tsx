'use client';

import { TransactionList } from '@/components/history/TransactionList';
import { useFinanceStore } from '@/lib/store';

export default function HistoryPage() {
  const { isLoading } = useFinanceStore();

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-1/3 mb-8"></div>
        <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Riwayat Transaksi</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">Daftar seluruh aktivitas keuangan Anda</p>
      </header>

      <TransactionList />
    </div>
  );
}
