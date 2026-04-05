'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  CircleAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function RoutinesPage() {
  const state = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', estimatedAmount: '' });
  const [displayLimit, setDisplayLimit] = useState(10);
  
  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

  const handleSave = () => {
    if (!formData.title.trim()) {
      state.showToast('Nama kewajiban tidak boleh kosong', 'error');
      return;
    }

    const amount = parseInt(formData.estimatedAmount.replace(/\D/g, ''), 10) || 0;

    if (editingId) {
      state.editChecklist(editingId, formData.title, amount);
      state.showToast('Kewajiban berhasil diperbarui', 'success');
    } else {
      state.addChecklist(formData.title, amount);
      state.showToast('Kewajiban baru ditambahkan', 'success');
    }

    closeModal();
  };

  const handleEdit = (item: any) => {
    setFormData({ 
      title: item.title, 
      estimatedAmount: item.estimatedAmount ? item.estimatedAmount.toLocaleString('id-ID') : '' 
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete({ id: item.id, name: item.title });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      state.deleteChecklist(itemToDelete.id);
      state.showToast('Kewajiban dihapus', 'success');
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      setFormData({ ...formData, estimatedAmount: parseInt(value, 10).toLocaleString('id-ID') });
    } else {
      setFormData({ ...formData, estimatedAmount: '' });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', estimatedAmount: '' });
  };

  const currentMonthStr = `${state.currentYear}-${state.currentMonth.toString().padStart(2, '0')}`;

  return (
    <div className="p-3 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 sm:pb-32">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 sm:px-0">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Rutinitas Bulanan</h1>
          <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 sm:mt-1">
            Daftar pengingat kewajiban dan alokasi dana setiap bulan
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kewajiban</span>
        </button>
      </header>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start space-x-3">
        <CircleAlert className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
          Checklist ini murni sebagai <strong>pengingat visual</strong>. Mencentang item di sini tidak akan otomatis memotong saldo Anda. Anda tetap harus mencatat pengeluaran/mutasi secara manual di menu Transaksi. Checklist akan otomatis di-reset setiap berganti bulan.
        </p>
      </div>

      <div className="space-y-3">
        {state.checklists.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
            <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Belum ada daftar rutinitas</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tambahkan kewajiban bulanan Anda di sini</p>
          </div>
        ) : (
          <>
            {state.checklists.slice(0, displayLimit).map((item) => {
              const isCompleted = item.lastCompletedMonth === currentMonthStr;
              
              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isCompleted 
                      ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <button
                      onClick={() => state.toggleChecklist(item.id, currentMonthStr)}
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors border ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-transparent hover:border-blue-500'
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm sm:text-base font-bold truncate transition-all ${
                        isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {item.title}
                      </p>
                      {item.estimatedAmount > 0 && (
                        <p className={`text-xs font-medium mt-0.5 ${
                          isCompleted ? 'text-slate-400/70 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          Est: Rp {item.estimatedAmount.toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            
            {displayLimit < state.checklists.length && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 10)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold rounded-xl transition-colors"
                >
                  Muat Lebih Banyak
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Kewajiban' : 'Kewajiban Baru'}
                </h3>
                <button 
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Nama Kewajiban
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Bayar Listrik, Topup Dompet"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Estimasi Nominal (Opsional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input
                      type="text"
                      value={formData.estimatedAmount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        type="delete"
        data={itemToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
