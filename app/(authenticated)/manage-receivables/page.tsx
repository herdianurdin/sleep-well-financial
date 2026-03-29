'use client';

import { useState } from 'react';
import { Plus, CircleAlert } from 'lucide-react';
import { useFinanceStore, Receivable } from '@/lib/store';
import { ReceivableCategoryCards } from '@/components/manage-receivables/ReceivableCategoryCards';
import { ReceivablesList } from '@/components/manage-receivables/ReceivablesList';
import { AddReceivableModal } from '@/components/manage-receivables/AddReceivableModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function ManageReceivablesPage() {
  const state = useFinanceStore();
  const { receivables, receivableCategories, updateCategoryLimit, addReceivable, deleteReceivable, toggleReceivableStatus, showToast, isLoading } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'edit' | 'delete' | 'deactivate';
    data: any;
  }>({ isOpen: false, type: 'add', data: null });

  const hasTransactionHistory = (name: string) => {
    return state.transactions.some(t => 
      t.posAsal.toLowerCase() === name.toLowerCase() || 
      t.posTujuan.toLowerCase() === name.toLowerCase()
    );
  };

  const handleAddReceivable = (name: string, type: Receivable['type']) => {
    addReceivable(name, type);
    showToast(`Peminjam "${name}" berhasil ditambahkan`, 'success');
    setIsAdding(false);
  };

  const handleDeleteReceivable = (receivable: Receivable) => {
    if (receivable.amount > 0) {
      setErrorMsg(`Peminjam "${receivable.name}" tidak dapat dihapus karena masih memiliki saldo piutang. Silakan lunasi terlebih dahulu.`);
      return;
    }

    const hasHistory = hasTransactionHistory(receivable.name);
    
    if (hasHistory) {
      // If amount is 0 and has history, allow deactivation
      setConfirmModal({
        isOpen: true,
        type: 'deactivate',
        data: receivable
      });
    } else {
      // No history, allow full deletion
      setConfirmModal({
        isOpen: true,
        type: 'delete',
        data: receivable
      });
    }
    setErrorMsg('');
  };

  const executeAction = () => {
    const { type, data } = confirmModal;

    if (type === 'delete') {
      deleteReceivable(data.id);
      showToast(`Peminjam "${data.name}" berhasil dihapus permanen`, 'success');
    } else if (type === 'deactivate') {
      toggleReceivableStatus(data.id, false);
      showToast(`Peminjam "${data.name}" berhasil dinonaktifkan`, 'success');
    }

    setConfirmModal({ isOpen: false, type: 'add', data: null });
  };

  const handleUpdateCategoryLimit = (type: string, newLimit: number) => {
    updateCategoryLimit(type, newLimit);
    showToast(`Pagu kategori ${type} berhasil diperbarui`, 'success');
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-4 w-1/2">
            <div className="h-10 bg-slate-200 rounded-xl w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
          </div>
          <div className="h-12 bg-slate-200 rounded-2xl w-40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-3xl w-full"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-3xl w-full mt-8"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Kelola Piutang</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">Pantau pagu dan daftar peminjam berdasarkan kategori</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-200 dark:shadow-none font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Peminjam</span>
        </button>
      </header>

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2">
          <CircleAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <ReceivableCategoryCards 
        receivables={receivables}
        receivableCategories={receivableCategories}
        onUpdateLimit={handleUpdateCategoryLimit}
      />

      <ReceivablesList 
        receivables={receivables}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onDelete={handleDeleteReceivable}
        onToggleStatus={toggleReceivableStatus}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        data={confirmModal.data}
        onConfirm={executeAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'add', data: null })}
      />

      <AddReceivableModal 
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAddReceivable}
        existingNames={receivables.map(r => r.name)}
      />
    </div>
  );
}
