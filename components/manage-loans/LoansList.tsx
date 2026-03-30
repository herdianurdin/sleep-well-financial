'use client';

import { Search, Trash2, Building2, User, CreditCard, MoreHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Loan } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

interface LoansListProps {
  loans: Loan[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDelete: (loan: Loan) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function LoansList({ loans, searchQuery, onSearchChange, onDelete, onToggleStatus }: LoansListProps) {
  const activeLoans = loans.filter(l => (l.isActive !== false));
  const inactiveLoans = loans.filter(l => (l.isActive === false));

  const filteredActive = activeLoans.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredInactive = inactiveLoans.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: Loan['type']) => {
    switch (type) {
      case 'Bank': return <Building2 className="w-6 h-6" />;
      case 'Personal': return <User className="w-6 h-6" />;
      case 'CC/Paylater': return <CreditCard className="w-6 h-6" />;
      case 'Lainnya': return <MoreHorizontal className="w-6 h-6" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: Loan['type']) => {
    switch (type) {
      case 'Bank': return 'bg-indigo-500';
      case 'Personal': return 'bg-emerald-500';
      case 'CC/Paylater': return 'bg-rose-500';
      case 'Lainnya': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Pinjaman</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text"
            placeholder="Cari nama kreditur..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white w-full md:w-64 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredActive.map((l) => (
            <motion.div 
              layout
              key={l.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4 md:mb-6 gap-2">
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${getTypeColor(l.type)}`}>
                    <span className="scale-75 md:scale-100">{getIcon(l.type)}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">{l.name}</h3>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate block">{l.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(l)}
                  className="p-2 text-slate-200 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-colors md:opacity-0 md:group-hover:opacity-100 shrink-0"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 shrink-0">Saldo Hutang</span>
                  <span className="text-base md:text-lg font-black text-slate-900 dark:text-white truncate">{formatCurrency(l.amount)}</span>
                </div>

                <div className="pt-3 md:pt-4 border-t border-slate-50 dark:border-slate-800">
                  <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic">
                    Kelola pembayaran dan penambahan saldo melalui menu transaksi.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredInactive.map((l) => (
            <motion.div 
              layout
              key={l.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-50 dark:bg-slate-950 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 dark:border-slate-800 opacity-60 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4 md:mb-6 gap-2">
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 shrink-0">
                    <span className="scale-75 md:scale-100">{getIcon(l.type)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-slate-500 dark:text-slate-600 line-through truncate">{l.name}</h3>
                      <span className="text-[8px] md:text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">Nonaktif</span>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate block">{l.type}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 md:space-y-2 shrink-0">
                  <button 
                    onClick={() => onToggleStatus(l.id, true)}
                    className="p-1.5 md:p-2 text-slate-400 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    title="Aktifkan Kembali"
                  >
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button 
                    onClick={() => onDelete(l)}
                    className="p-1.5 md:p-2 text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors md:opacity-0 md:group-hover:opacity-100 shrink-0"
                    title="Hapus Permanen"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs md:text-sm text-slate-400 dark:text-slate-600 shrink-0">Saldo Hutang</span>
                  <span className="text-base md:text-lg font-black text-slate-400 dark:text-slate-600 truncate">{formatCurrency(l.amount)}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredActive.length === 0 && filteredInactive.length === 0 && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CreditCard className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data pinjaman</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Klik tombol &quot;Tambah Pinjaman&quot; untuk mencatat hutang baru</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
