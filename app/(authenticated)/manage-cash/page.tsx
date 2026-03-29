'use client';

import { useState, useEffect } from 'react';
import { Landmark, PowerOff } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { CashForm } from '@/components/manage-cash/CashForm';
import { CashList } from '@/components/manage-cash/CashList';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function ManageCashPage() {
  const state = useFinanceStore();
  const { addCashPosition, deleteCashPosition, editCashPosition, setMainWallet, toggleCashPositionStatus, showToast, isLoading } = state;
  
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'edit' | 'delete' | 'deactivate' | 'setMain';
    data: any;
  }>({ isOpen: false, type: 'add', data: null });

  const isNameUnique = (name: string, list: any[], excludeId: string | null = null) => {
    return !list.some(item => item.name.toLowerCase() === name.toLowerCase() && item.id !== excludeId);
  };

  const isCashUsed = (name: string) => {
    return state.transactions.some((t: any) => t.posAsal === name || t.posTujuan === name);
  };

  const handleAddCash = (name: string, type: string) => {
    if (!isNameUnique(name, state.cashPositions)) {
      setErrorMsg(`Nama kas "${name}" sudah digunakan!`);
      return;
    }
    
    setErrorMsg('');
    setConfirmModal({
      isOpen: true,
      type: 'add',
      data: { name, type }
    });
  };

  const handleEditCash = (id: string, newName: string) => {
    const name = newName.trim();
    if (!name) return;

    if (!isNameUnique(name, state.cashPositions, id)) {
      setErrorMsg(`Nama kas "${name}" sudah digunakan!`);
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'edit',
      data: { id, name }
    });
    setErrorMsg('');
  };

  const handleSetMainWallet = (id: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'setMain',
      data: { id }
    });
  };

  const handleDeleteClick = (id: string) => {
    const pos = state.cashPositions.find((p: any) => p.id === id);
    if (!pos) return;
    
    const used = isCashUsed(pos.name);
    
    if (used) {
      if (pos.balance > 0) {
        setErrorMsg(`Kas "${pos.name}" tidak dapat dihapus atau dinonaktifkan karena masih memiliki saldo dan riwayat transaksi.`);
        return;
      }
      // If balance is 0 and has history, allow deactivation
      setConfirmModal({
        isOpen: true,
        type: 'deactivate',
        data: pos
      });
    } else {
      // No history, allow full deletion
      setConfirmModal({
        isOpen: true,
        type: 'delete',
        data: pos
      });
    }
    setErrorMsg('');
  };

  const executeAction = () => {
    const { type, data } = confirmModal;

    if (type === 'add') {
      addCashPosition(data.name, data.type);
      showToast(`Kas "${data.name}" berhasil ditambahkan`, 'success');
    } else if (type === 'edit') {
      editCashPosition(data.id, data.name);
      showToast(`Nama kas berhasil diubah menjadi "${data.name}"`, 'success');
    } else if (type === 'delete') {
      deleteCashPosition(data.id);
      showToast(`Kas "${data.name}" berhasil dihapus permanen`, 'success');
    } else if (type === 'deactivate') {
      toggleCashPositionStatus(data.id, false);
      showToast(`Kas "${data.name}" berhasil dinonaktifkan`, 'success');
    } else if (type === 'setMain') {
      setMainWallet(data.id);
      showToast(`Kas utama berhasil diubah`, 'success');
    }

    setConfirmModal({ isOpen: false, type: 'add', data: null });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-32 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-1/3 mb-8"></div>
        <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-8 max-w-7xl mx-auto pb-32">
      <header className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Kelola Kas</h1>
        <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 mt-1">Atur daftar posisi kas dan rekening (Aset Likuid) Anda</p>
      </header>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Landmark className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Daftar Posisi Kas</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <CashList 
            cashPositions={state.cashPositions}
            mainWalletId={state.mainWalletId}
            isCashUsed={isCashUsed}
            onSetMainWallet={handleSetMainWallet}
            onEdit={handleEditCash}
            onDelete={handleDeleteClick}
            onToggleStatus={toggleCashPositionStatus}
          />
          <CashForm onAdd={handleAddCash} />
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {confirmModal.type === 'add' && 'Tambah Kas Baru'}
              {confirmModal.type === 'edit' && 'Ubah Nama Kas'}
              {confirmModal.type === 'delete' && 'Hapus Posisi Kas'}
              {confirmModal.type === 'deactivate' && 'Hapus Posisi Kas'}
              {confirmModal.type === 'setMain' && 'Ubah Kas Utama'}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {confirmModal.type === 'add' && `Anda akan menambahkan ${confirmModal.data.name} sebagai ${confirmModal.data.type === 'bank' ? 'Bank' : confirmModal.data.type === 'ewallet' ? 'Dompet Digital' : 'Kas Fisik'}. Lanjutkan?`}
              {confirmModal.type === 'edit' && `Anda yakin ingin mengubah nama kas menjadi ${confirmModal.data.name}?`}
              {confirmModal.type === 'delete' && `Anda yakin ingin menghapus kas ${confirmModal.data.name} secara permanen? Tindakan ini tidak dapat dibatalkan.`}
              {confirmModal.type === 'deactivate' && `Kas ${confirmModal.data.name} sudah memiliki riwayat transaksi. Menghapus kas ini akan merusak data historis. Anda hanya dapat menonaktifkan kas ini agar tidak muncul lagi di pilihan transaksi.`}
              {confirmModal.type === 'setMain' && 'Anda yakin ingin mengubah Kas Utama (Uang Dingin) ke kas ini? Perhitungan surplus akan menggunakan saldo kas ini.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, type: 'add', data: null })}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors order-2 sm:order-1"
              >
                Batal
              </button>
              <button 
                onClick={executeAction}
                className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2 order-1 sm:order-2 ${
                  confirmModal.type === 'delete' ? 'bg-rose-600 hover:bg-rose-700' :
                  confirmModal.type === 'deactivate' ? 'bg-orange-500 hover:bg-orange-600' :
                  confirmModal.type === 'setMain' ? 'bg-blue-600 hover:bg-blue-700' :
                  'bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                }`}
              >
                {confirmModal.type === 'deactivate' && <PowerOff className="w-4 h-4" />}
                <span>
                  {confirmModal.type === 'add' && 'Tambah'}
                  {confirmModal.type === 'edit' && 'Simpan'}
                  {confirmModal.type === 'delete' && 'Hapus Permanen'}
                  {confirmModal.type === 'deactivate' && 'Nonaktifkan'}
                  {confirmModal.type === 'setMain' && 'Ya, Ubah'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
