'use client';

import { Wallet, TrendingUp, TrendingDown, Landmark, CreditCard, Handshake, TriangleAlert, CircleCheck, Info } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'motion/react';

export function SummaryCard() {
  const state = useFinanceStore();
  
  const mainWallet = state.cashPositions.find((p: any) => p.id === state.mainWalletId) || state.cashPositions[0];
  const mainWalletBalance = mainWallet ? mainWallet.balance : 0;
  const surplus = mainWalletBalance - state.threshold;

  // Calculate Health Score (0-100) based on Main Wallet
  let healthScore = 0;
  if (state.threshold > 0) {
    if (mainWalletBalance >= state.threshold) {
      // If balance is at threshold, score is 50. If balance is 2x threshold, score is 100.
      const surplusRatio = (mainWalletBalance - state.threshold) / state.threshold;
      healthScore = Math.min(100, 50 + (surplusRatio * 50));
    } else {
      // If balance is 0, score is 0. If balance is at threshold, score is 50.
      healthScore = (mainWalletBalance / state.threshold) * 50;
    }
  } else if (mainWalletBalance > 0) {
    healthScore = 100;
  } else {
    healthScore = 0;
  }

  const isWarning = mainWalletBalance <= state.threshold;
  const isNearWarning = mainWalletBalance <= state.threshold * 1.1 && mainWalletBalance > state.threshold;

  const getStatusTheme = () => {
    if (isWarning) return {
      color: 'text-rose-400',
      icon: <TriangleAlert className="w-4 h-4" />,
      message: 'Zona Bahaya'
    };
    if (isNearWarning) return {
      color: 'text-amber-400',
      icon: <Info className="w-4 h-4" />,
      message: 'Waspada'
    };
    return {
      color: 'text-emerald-400',
      icon: <CircleCheck className="w-4 h-4" />,
      message: 'Sehat'
    };
  };

  const theme = getStatusTheme();
  const totalPiutang = state.receivables.filter(r => r.isActive !== false).reduce((acc, curr) => acc + curr.amount, 0);
  const totalPinjaman = state.loans.filter(l => l.isActive !== false).reduce((acc, curr) => acc + curr.amount, 0);

  const mask = (val: number) => state.privacyMode ? 'Rp ••••••••' : formatCurrency(val);

  return (
    <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <Landmark className="w-48 h-48 sm:w-64 sm:h-64" />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between mb-8 gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Health Score Circle */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-800"
                  style={{ cx: '50%', cy: '50%', r: '40%' }}
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={263.8}
                  initial={{ strokeDashoffset: 263.8 }}
                  animate={{ strokeDashoffset: 263.8 - (263.8 * healthScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={healthScore < 50 ? 'text-rose-500' : healthScore < 75 ? 'text-amber-500' : 'text-emerald-500'}
                  style={{ cx: '50%', cy: '50%', r: '40%' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-white leading-none">{Math.round(healthScore)}</span>
                <span className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Health</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Surplus (Amunisi)
                </h2>
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/5 ${theme.color} border border-white/5`}>
                  {theme.icon}
                  <span>{theme.message}</span>
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter break-all ${surplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {mask(surplus)}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                Saldo <span className="text-slate-300">{mainWallet?.name || 'Kas Utama'}</span> dikurangi Threshold
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:flex gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-white/5 flex-1 lg:min-w-[140px] overflow-hidden">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">Pemasukan</span>
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight truncate">{mask(state.stats.income)}</div>
            </div>
            <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm border border-white/5 flex-1 lg:min-w-[140px] overflow-hidden">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">Pengeluaran</span>
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight truncate">{mask(state.stats.expense)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 overflow-hidden">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 shrink-0">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Saldo Utama</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white ml-2 shrink-0">{mask(mainWalletBalance)}</span>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 overflow-hidden">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/10 shrink-0">
                <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Total Piutang</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white ml-2 shrink-0">{mask(totalPiutang)}</span>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 overflow-hidden">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-rose-500/10 shrink-0">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Total Pinjaman</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white ml-2 shrink-0">{mask(totalPinjaman)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
