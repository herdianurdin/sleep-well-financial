'use client';

import { useState } from 'react';
import { Plus, X, CircleAlert, Briefcase, Users, User, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Receivable } from '@/lib/store';

interface AddReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, type: Receivable['type']) => void;
  existingNames: string[];
}

export function AddReceivableModal({ isOpen, onClose, onAdd, existingNames }: AddReceivableModalProps) {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Receivable['type']>('Keluarga');
  const [error, setError] = useState('');

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'B2B': return <Briefcase className="w-3 h-3" />;
      case 'Keluarga': return <Users className="w-3 h-3" />;
      case 'Rekan Kerja': return <User className="w-3 h-3" />;
      case 'Ikut Transaksi': return <ArrowRightLeft className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleAdd = () => {
    if (!newName) {
      setError('Nama peminjam wajib diisi');
      return;
    }
    
    if (existingNames.some(name => name.toLowerCase() === newName.toLowerCase())) {
      setError('Nama peminjam sudah ada, gunakan nama yang unik');
      return;
    }
    
    onAdd(newName, newType);
    setNewName('');
    setNewType('Keluarga');
    setError('');
  };

  const handleClose = () => {
    setNewName('');
    setNewType('Keluarga');
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
          className="bg-white dark:bg-slate-900 rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Peminjam Baru</h2>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          <div className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-900 rounded-xl flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
                <CircleAlert className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nama Peminjam</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setError(''); }}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Kategori Piutang</label>
              <div className="grid grid-cols-2 gap-2">
                {(['B2B', 'Keluarga', 'Rekan Kerja', 'Ikut Transaksi'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                      newType === type 
                        ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-md' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {getCategoryIcon(type)}
                    <span>{type === 'B2B' ? 'Bisnis' : type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleAdd}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
              >
                Simpan Peminjam
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
