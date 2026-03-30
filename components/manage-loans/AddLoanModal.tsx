'use client';

import { useState } from 'react';
import { X, CircleAlert, Building2, User, CreditCard, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Loan } from '@/lib/store';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, type: Loan['type']) => void;
}

export function AddLoanModal({ isOpen, onClose, onAdd }: AddLoanModalProps) {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Loan['type']>('Bank');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!newName) {
      setError('Nama kreditur wajib diisi');
      return;
    }
    
    onAdd(newName, newType);
    setNewName('');
    setNewType('Bank');
    setError('');
  };

  const handleClose = () => {
    setNewName('');
    setNewType('Bank');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] p-5 md:p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Tambah Pinjaman Baru</h2>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          <div className="space-y-4 md:space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-900 rounded-xl flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-[10px] md:text-xs font-medium">
                <CircleAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">Nama Kreditur</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setError(''); }}
                placeholder="Contoh: Bank BRI / Nama Teman"
                className="w-full px-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-sm md:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">Jenis Pinjaman</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Bank', 'Personal', 'CC/Paylater', 'Lainnya'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`p-2.5 md:p-3 rounded-xl border text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      newType === type 
                        ? 'bg-rose-600 border-rose-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className={`shrink-0 ${newType === type ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                      {type === 'Bank' && <Building2 className="w-3 h-3" />}
                      {type === 'Personal' && <User className="w-3 h-3" />}
                      {type === 'CC/Paylater' && <CreditCard className="w-3 h-3" />}
                      {type === 'Lainnya' && <MoreHorizontal className="w-3 h-3" />}
                    </span>
                    <span className="truncate">{type === 'CC/Paylater' ? 'Kartu Kredit' : type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <button 
                onClick={handleAdd}
                className="w-full py-3.5 md:py-4 bg-rose-600 dark:bg-rose-500 text-white font-bold rounded-xl md:rounded-2xl hover:bg-rose-700 dark:hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 dark:shadow-none text-sm md:text-base"
              >
                Simpan Pinjaman
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
