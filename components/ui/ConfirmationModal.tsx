'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, CircleAlert } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'add' | 'edit' | 'delete' | 'deactivate';
  data: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ isOpen, type, data, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${
            type === 'delete' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400' : 
            type === 'deactivate' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400' :
            'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400'
          }`}>
            {type === 'add' && <Plus className="w-8 h-8" />}
            {type === 'edit' && <Pencil className="w-8 h-8" />}
            {type === 'delete' && <Trash2 className="w-8 h-8" />}
            {type === 'deactivate' && <CircleAlert className="w-8 h-8" />}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {type === 'add' && 'Tambah Item'}
            {type === 'edit' && 'Ubah Nama'}
            {type === 'delete' && 'Hapus Item'}
            {type === 'deactivate' && 'Nonaktifkan Item'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {type === 'add' && `Apakah Anda yakin ingin menambah "${data?.name}" ke dalam daftar?`}
            {type === 'edit' && `Apakah Anda yakin ingin mengubah nama menjadi "${data?.name}"?`}
            {type === 'delete' && `Apakah Anda yakin ingin menghapus "${data?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            {type === 'deactivate' && `"${data?.name}" memiliki riwayat transaksi. Item akan dinonaktifkan alih-alih dihapus agar riwayat tetap terjaga. Lanjutkan?`}
          </p>

          <div className="flex space-x-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 py-4 text-white rounded-2xl font-bold text-sm transition-colors ${
                type === 'delete' ? 'bg-rose-500 hover:bg-rose-600' : 
                type === 'deactivate' ? 'bg-amber-500 hover:bg-amber-600' :
                'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              Ya, Lanjutkan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
