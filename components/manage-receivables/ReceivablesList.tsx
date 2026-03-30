'use client';

import { Search, Handshake, Briefcase, Users, UserPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Receivable } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

interface ReceivablesListProps {
  receivables: Receivable[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDelete: (receivable: Receivable) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function ReceivablesList({ receivables, searchQuery, onSearchChange, onDelete, onToggleStatus }: ReceivablesListProps) {
  const activeReceivables = receivables.filter(r => r.isActive !== false);
  const inactiveReceivables = receivables.filter(r => r.isActive === false);

  const filteredActive = activeReceivables.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInactive = inactiveReceivables.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: Receivable['type']) => {
    switch (type) {
      case 'B2B': return <Briefcase className="w-6 h-6" />;
      case 'Keluarga': return <Users className="w-6 h-6" />;
      case 'Rekan Kerja': return <UserPlus className="w-6 h-6" />;
      case 'Ikut Transaksi': return <Handshake className="w-6 h-6" />;
      default: return <Handshake className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: Receivable['type']) => {
    switch (type) {
      case 'B2B': return 'bg-blue-500';
      case 'Keluarga': return 'bg-emerald-500';
      case 'Rekan Kerja': return 'bg-amber-500';
      case 'Ikut Transaksi': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Peminjam</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text"
            placeholder="Cari nama peminjam..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white w-full md:w-64 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {(['B2B', 'Keluarga', 'Rekan Kerja', 'Ikut Transaksi'] as const).map((type) => {
        const borrowersInType = filteredActive.filter(r => r.type === type);
        if (borrowersInType.length === 0) return null;

        return (
          <div key={type} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getTypeColor(type)}`} />
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                {type === 'B2B' ? 'Bisnis (B2B)' : type}
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">({borrowersInType.length})</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {borrowersInType.map((r) => (
                  <motion.div 
                    layout
                    key={r.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${getTypeColor(r.type)}`}>
                          <span className="scale-75 md:scale-100">{getIcon(r.type)}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm md:text-base">{r.name}</h3>
                          <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate block">{r.type}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => onDelete(r)}
                        className="p-2 text-slate-200 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-colors md:opacity-0 md:group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-4 md:mt-6 flex items-center justify-between gap-2">
                      <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 shrink-0">Total Pinjaman</span>
                      <span className="text-base md:text-lg font-black text-slate-900 dark:text-white truncate">{formatCurrency(r.amount)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {filteredInactive.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 opacity-50">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Peminjam Nonaktif</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-60 grayscale">
            {filteredInactive.map((r) => (
              <div key={r.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${getTypeColor(r.type)} opacity-50`}>
                    <span className="scale-75 md:scale-100">{getIcon(r.type)}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-500 dark:text-slate-400 truncate text-sm md:text-base">{r.name}</h3>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate block">{r.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onToggleStatus(r.id, true)}
                  className="text-[9px] md:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline shrink-0"
                >
                  Aktifkan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredActive.length === 0 && filteredInactive.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Handshake className="w-8 h-8 text-slate-300 dark:text-slate-700" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data peminjam</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Klik tombol &quot;Tambah Peminjam&quot; untuk memulai</p>
          </div>
        </div>
      )}
    </div>
  );
}
