'use client';

import { useState } from 'react';
import { Plus, CreditCard, CircleAlert } from 'lucide-react';
import { useFinanceStore, Loan } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { LoansList } from '@/components/manage-loans/LoansList';
import { AddLoanModal } from '@/components/manage-loans/AddLoanModal';

export default function ManageLoansPage() {
  const { loans, transactions, addLoan, deleteLoan, toggleLoanStatus, showToast, isLoading } = useFinanceStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'deactivate';
    data: Loan | null;
  }>({
    isOpen: false,
    type: 'delete',
    data: null
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLoanUsed = (name: string) => {
    return transactions.some(t => t.posAsal === name || t.posTujuan === name);
  };

  const handleAddLoan = (name: string, type: Loan['type']) => {
    addLoan({
      name,
      type,
      amount: 0,
    });
    showToast(`Pinjaman "${name}" berhasil ditambahkan`, 'success');
    setIsAdding(false);
  };

  const handleDeleteClick = (loan: Loan) => {
    if (loan.amount > 0) {
      setErrorMsg(`Pinjaman "${loan.name}" tidak dapat dihapus karena masih memiliki saldo/nominal. Silakan lunasi terlebih dahulu.`);
      return;
    }

    const used = isLoanUsed(loan.name);
    
    if (used) {
      // If amount is 0 and has history, allow deactivation
      setConfirmModal({
        isOpen: true,
        type: 'deactivate',
        data: loan
      });
    } else {
      // No history and amount is 0, allow full deletion
      setConfirmModal({
        isOpen: true,
        type: 'delete',
        data: loan
      });
    }
    setErrorMsg(null);
  };

  const executeAction = () => {
    if (!confirmModal.data) return;

    if (confirmModal.type === 'deactivate') {
      toggleLoanStatus(confirmModal.data.id, false);
      showToast(`Pinjaman "${confirmModal.data.name}" telah dinonaktifkan`, 'success');
    } else {
      deleteLoan(confirmModal.data.id);
      showToast('Data pinjaman berhasil dihapus', 'success');
    }
    setConfirmModal({ isOpen: false, type: 'delete', data: null });
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    toggleLoanStatus(id, isActive);
    const loan = loans.find(l => l.id === id);
    showToast(`Pinjaman "${loan?.name}" ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`, 'success');
  };

  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);

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
        <div className="h-32 bg-slate-200 rounded-3xl w-full mb-8"></div>
        <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-8 max-w-7xl mx-auto pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="px-1 md:px-0">
          <h1 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Kelola Pinjaman</h1>
          <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 mt-1">Pantau kewajiban dan hutang Anda</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-rose-600 dark:bg-rose-500 text-white px-6 py-3 rounded-2xl hover:bg-rose-700 dark:hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 dark:shadow-none font-medium text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pinjaman</span>
        </button>
      </header>

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 md:p-4 rounded-xl md:rounded-2xl text-rose-600 dark:text-rose-400 text-xs md:text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center space-x-2">
          <CircleAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-50 dark:bg-rose-900/30 rounded-xl md:rounded-[24px] flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner shrink-0">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">Total Kewajiban</p>
            <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white truncate">{formatCurrency(totalLoans)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-left md:text-right">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Jumlah Pinjaman Aktif</p>
            <p className="text-sm md:text-lg font-bold text-slate-900 dark:text-white">{loans.length} Kreditur</p>
          </div>
        </div>
      </div>

      <LoansList 
        loans={loans}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-3 md:space-y-4">
              <div className={`w-12 h-12 md:w-16 md:h-16 ${confirmModal.type === 'deactivate' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'} rounded-xl md:rounded-[24px] flex items-center justify-center mx-auto shadow-inner`}>
                <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {confirmModal.type === 'deactivate' ? 'Nonaktifkan Pinjaman?' : 'Hapus Pinjaman?'}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {confirmModal.type === 'deactivate' 
                    ? `Pinjaman "${confirmModal.data?.name}" pernah tercatat di riwayat transaksi. Pinjaman akan dinonaktifkan dan tidak akan muncul di dashboard.`
                    : `Apakah Anda yakin ingin menghapus "${confirmModal.data?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                </p>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pt-4">
                <button 
                  onClick={() => setConfirmModal({ isOpen: false, type: 'delete', data: null })}
                  className="order-2 sm:order-1 px-6 py-3 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={executeAction}
                  className={`order-1 sm:order-2 px-6 py-3 rounded-xl md:rounded-2xl ${confirmModal.type === 'deactivate' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold transition-colors shadow-lg shadow-rose-100 dark:shadow-none text-sm`}
                >
                  {confirmModal.type === 'deactivate' ? 'Nonaktifkan' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddLoanModal 
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAddLoan}
      />
    </div>
  );
}
