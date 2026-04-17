'use client';

import { useState, useEffect } from 'react';
import { Landmark, PowerOff, ShieldAlert, Zap, Layers, Check, Star } from 'lucide-react';
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
    type: 'add' | 'delete' | 'deactivate';
    data: any;
  }>({ isOpen: false, type: 'add', data: null });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    pos: any;
    editName: string;
    selectedTags: ('Dana Darurat' | 'Uang Bebas' | 'Operasional')[];
    isMainWallet: boolean;
    errorMsg?: string;
  }>({ isOpen: false, pos: null, editName: '', selectedTags: [], isMainWallet: false });

  const isNameUnique = (name: string, list: any[], excludeId: string | null = null) => {
    return !list.some(item => item.name.toLowerCase() === name.toLowerCase() && item.id !== excludeId);
  };

  const isCashUsed = (name: string) => {
    return state.transactions.some((t: any) => t.posAsal === name || t.posTujuan === name);
  };

  const handleAddCash = (name: string, type: string, tags?: ('Dana Darurat' | 'Uang Bebas' | 'Operasional')[]) => {
    if (!isNameUnique(name, state.cashPositions)) {
      setErrorMsg(`Nama kas "${name}" sudah digunakan!`);
      return;
    }
    
    setErrorMsg('');
    setConfirmModal({
      isOpen: true,
      type: 'add',
      data: { name, type, tags }
    });
  };

  const handleOpenEditModal = (pos: any) => {
    setEditModal({
      isOpen: true,
      pos,
      editName: pos.name,
      selectedTags: pos.tags || [],
      isMainWallet: pos.id === state.mainWalletId,
      errorMsg: ''
    });
  };

  const handleSaveEdit = () => {
    const { pos, editName, selectedTags, isMainWallet } = editModal;
    if (!pos) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setEditModal(prev => ({ ...prev, errorMsg: 'Nama kas tidak boleh kosong' }));
      return;
    }

    if (!isNameUnique(trimmedName, state.cashPositions, pos.id)) {
      setEditModal(prev => ({ ...prev, errorMsg: `Nama kas "${trimmedName}" sudah digunakan!` }));
      return;
    }

    editCashPosition(pos.id, trimmedName, selectedTags);
    if (isMainWallet && pos.id !== state.mainWalletId) {
      setMainWallet(pos.id);
    }
    showToast(`Kas "${trimmedName}" berhasil diperbarui`, 'success');
    setEditModal({ isOpen: false, pos: null, editName: '', selectedTags: [], isMainWallet: false, errorMsg: '' });
  };

  const toggleModalTag = (tag: 'Dana Darurat' | 'Uang Bebas' | 'Operasional') => {
    setEditModal(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag) 
        ? prev.selectedTags.filter(t => t !== tag) 
        : [...prev.selectedTags, tag]
    }));
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
      addCashPosition(data.name, data.type, data.tags);
      showToast(`Kas "${data.name}" berhasil ditambahkan`, 'success');
    } else if (type === 'delete') {
      deleteCashPosition(data.id);
      showToast(`Kas "${data.name}" berhasil dihapus permanen`, 'success');
    } else if (type === 'deactivate') {
      toggleCashPositionStatus(data.id, false);
      showToast(`Kas "${data.name}" berhasil dinonaktifkan`, 'success');
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
            onEdit={handleOpenEditModal}
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
              {confirmModal.type === 'delete' && 'Hapus Posisi Kas'}
              {confirmModal.type === 'deactivate' && 'Hapus Posisi Kas'}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {confirmModal.type === 'add' && `Anda akan menambahkan ${confirmModal.data.name} sebagai ${confirmModal.data.type === 'bank' ? 'Bank' : confirmModal.data.type === 'ewallet' ? 'Dompet Digital' : 'Kas Fisik'}. Lanjutkan?`}
              {confirmModal.type === 'delete' && `Anda yakin ingin menghapus kas ${confirmModal.data.name} secara permanen? Tindakan ini tidak dapat dibatalkan.`}
              {confirmModal.type === 'deactivate' && `Kas ${confirmModal.data.name} sudah memiliki riwayat transaksi. Menghapus kas ini akan merusak data historis. Anda hanya dapat menonaktifkan kas ini agar tidak muncul lagi di pilihan transaksi.`}
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
                  'bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                }`}
              >
                {confirmModal.type === 'deactivate' && <PowerOff className="w-4 h-4" />}
                <span>
                  {confirmModal.type === 'add' && 'Tambah'}
                  {confirmModal.type === 'delete' && 'Hapus Permanen'}
                  {confirmModal.type === 'deactivate' && 'Nonaktifkan'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[32px] p-5 md:p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4">
              Ubah Kas & Peruntukan
            </h3>

            {editModal.errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 px-3 py-2 rounded-xl text-[11px] font-medium">
                {editModal.errorMsg}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nama Kas</label>
              <input 
                type="text" 
                value={editModal.editName}
                onChange={e => setEditModal(prev => ({ ...prev, editName: e.target.value, errorMsg: '' }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-900 dark:text-white transition-all"
                placeholder="Misal: BCA Pribadi"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Label Peruntukan (Opsional)</label>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => toggleModalTag('Dana Darurat')}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border text-left transition-all ${
                    editModal.selectedTags.includes('Dana Darurat') 
                      ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/50 shadow-sm' 
                      : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${editModal.selectedTags.includes('Dana Darurat') ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm md:text-base font-bold truncate ${editModal.selectedTags.includes('Dana Darurat') ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>Dana Darurat</div>
                  </div>
                  {editModal.selectedTags.includes('Dana Darurat') && <Check className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
                <button
                  onClick={() => toggleModalTag('Uang Bebas')}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border text-left transition-all ${
                    editModal.selectedTags.includes('Uang Bebas') 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 shadow-sm' 
                      : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${editModal.selectedTags.includes('Uang Bebas') ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm md:text-base font-bold truncate ${editModal.selectedTags.includes('Uang Bebas') ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Uang Bebas</div>
                  </div>
                  {editModal.selectedTags.includes('Uang Bebas') && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
                </button>
                <button
                  onClick={() => toggleModalTag('Operasional')}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border text-left transition-all ${
                    editModal.selectedTags.includes('Operasional') 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 shadow-sm' 
                      : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${editModal.selectedTags.includes('Operasional') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm md:text-base font-bold truncate ${editModal.selectedTags.includes('Operasional') ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>Operasional</div>
                  </div>
                  {editModal.selectedTags.includes('Operasional') && <Check className="w-5 h-5 text-blue-500 shrink-0" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setEditModal(prev => ({ ...prev, isMainWallet: !prev.isMainWallet }))}
                disabled={editModal.pos?.id === state.mainWalletId}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  editModal.isMainWallet 
                    ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50 shadow-sm' 
                    : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                } disabled:opacity-80 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 ${editModal.isMainWallet ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <Star className={`w-5 h-5 ${editModal.isMainWallet ? 'fill-current' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className={`text-sm md:text-base font-bold truncate ${editModal.isMainWallet ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>Set Kas Utama</div>
                  </div>
                </div>
                <div className={`w-10 h-6 shrink-0 rounded-full transition-colors relative flex items-center ${editModal.isMainWallet ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${editModal.isMainWallet ? 'left-5' : 'left-1'}`} />
                </div>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button 
                onClick={() => setEditModal({ isOpen: false, pos: null, editName: '', selectedTags: [], isMainWallet: false, errorMsg: '' })}
                className="flex-1 px-4 py-3 md:py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors order-2 sm:order-1"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 md:py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm md:text-base rounded-2xl shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 order-1 sm:order-2"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
