'use client';

import { Landmark, Star, Banknote, Smartphone } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export function CashPositionMap() {
  const state = useFinanceStore();
  const activeCashPositions = state.cashPositions.filter(p => p.isActive !== false);

  const getIcon = (type: string) => {
    if (type === 'fisik') return <Banknote className="w-5 h-5" />;
    if (type === 'ewallet') return <Smartphone className="w-5 h-5" />;
    return <Landmark className="w-5 h-5" />;
  };

  const totalCash = activeCashPositions.reduce((acc: number, curr: any) => acc + curr.balance, 0);
  const mask = (val: number) => state.privacyMode ? 'Rp ••••••••' : formatCurrency(val);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Landmark className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Peta Posisi Kas</h2>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Total Kas</span>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{mask(totalCash)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {activeCashPositions.length === 0 ? (
          <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic font-medium">Belum ada posisi kas aktif.</p>
          </div>
        ) : (
          activeCashPositions.map((pos: any, idx: number) => {
            const isMain = pos.id === state.mainWalletId;
            return (
              <div 
                key={pos.id || idx} 
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                  isMain 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50' 
                    : 'bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 shrink-0 ${
                    isMain 
                      ? 'bg-blue-500 text-white shadow-blue-500/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isMain ? <Star className="w-5 h-5 fill-current" /> : getIcon(pos.type || 'bank')}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {pos.name}
                    </span>
                    {isMain && (
                      <span className="text-[9px] font-black bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md uppercase tracking-tighter mt-0.5 w-fit shrink-0">
                        Utama
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    {mask(pos.balance)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
