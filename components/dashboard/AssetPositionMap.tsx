'use client';

import { TrendingUp, Briefcase } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export function AssetPositionMap() {
  const state = useFinanceStore();
  const activeAssets = state.assets.filter(a => a.isActive !== false);

  const totalAssets = activeAssets.reduce((acc: number, curr: any) => acc + curr.value, 0);
  const mask = (val: number) => state.privacyMode ? 'Rp ••••••••' : formatCurrency(val);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Peta Posisi Investasi</h2>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Total Investasi</span>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{mask(totalAssets)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {activeAssets.length === 0 ? (
          <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic font-medium">Belum ada posisi investasi aktif.</p>
          </div>
        ) : (
          activeAssets.map((asset: any, idx: number) => (
            <div 
              key={asset.id || idx} 
              className="group flex items-center justify-between p-4 rounded-2xl border bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-md overflow-hidden"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {asset.name}
                  </span>
                  <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-tighter mt-0.5 w-fit shrink-0">
                    {asset.type}
                  </span>
                </div>
              </div>
              <div className="text-right ml-2 shrink-0">
                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  {mask(asset.value)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
