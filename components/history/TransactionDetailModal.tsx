'use client';

import { X, Calendar, Wallet, Tag, FileText, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Transaction } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pemasukan': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'pengeluaran': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400';
      case 'mutasi kas': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mx-4"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Detail Transaksi</h2>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Amount & Type */}
            <div className="text-center space-y-2">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(transaction.type)}`}>
                {transaction.type}
              </span>
              <h3 className={`text-3xl font-black tracking-tighter ${
                transaction.type === 'Pengeluaran' ? 'text-rose-600 dark:text-rose-400' : 
                transaction.type === 'Pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 
                'text-slate-900 dark:text-white'
              }`}>
                {transaction.type === 'Pengeluaran' ? '-' : transaction.type === 'Pemasukan' ? '+' : ''}
                {formatCurrency(transaction.nominal)}
              </h3>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-5">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Waktu Transaksi</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold">{formatDate(transaction.date)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Alur Kas</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300">
                      {transaction.posAsal}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300">
                      {transaction.posTujuan}
                    </span>
                  </div>
                </div>
              </div>

              {transaction.notes && (
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Catatan</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-0.5">&quot;{transaction.notes}&quot;</p>
                  </div>
                </div>
              )}

              {transaction.profitOrLoss !== undefined && transaction.profitOrLoss !== 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {transaction.profitOrLoss > 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {transaction.profitOrLoss > 0 ? 'Keuntungan' : 'Kerugian'}
                    </p>
                    <p className={`text-sm font-bold ${transaction.profitOrLoss > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(Math.abs(transaction.profitOrLoss))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md text-sm"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
