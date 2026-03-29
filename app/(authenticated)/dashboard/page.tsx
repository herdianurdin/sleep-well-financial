'use client';

import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { CashPositionMap } from '@/components/dashboard/CashPositionMap';
import { AssetPositionMap } from '@/components/dashboard/AssetPositionMap';
import { useFinanceStore } from '@/lib/store';

export default function DashboardPage() {
  const { isLoading } = useFinanceStore();

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-1/3 mb-8"></div>
        <div className="space-y-6">
          <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
          <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">
            Pantau kesehatan finansial Anda secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
          <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-6 sm:space-y-8">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SummaryCard />
        </section>
        
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <CashPositionMap />
        </section>
        
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <AssetPositionMap />
        </section>
      </div>
    </div>
  );
}
