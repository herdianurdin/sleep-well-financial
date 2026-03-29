'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/store';
import { CircleAlert } from 'lucide-react';
import { AssetForm } from '@/components/manage-assets/AssetForm';
import { AssetList } from '@/components/manage-assets/AssetList';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function ManageAssetsPage() {
  const state = useFinanceStore();
  const { addAsset, deleteAsset, editAsset, toggleAssetStatus, showToast, isLoading } = state;
  
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'edit' | 'delete' | 'deactivate';
    data: any;
  }>({ isOpen: false, type: 'add', data: null });

  const isNameUnique = (name: string, list: any[], excludeId: string | null = null) => {
    return !list.some(item => item.name.toLowerCase() === name.toLowerCase() && item.id !== excludeId);
  };

  const hasTransactionHistory = (assetName: string) => {
    return state.transactions.some(t => 
      t.posAsal.toLowerCase() === assetName.toLowerCase() || 
      t.posTujuan.toLowerCase() === assetName.toLowerCase()
    );
  };

  const handleAddAsset = (name: string, type: string, subType?: string) => {
    if (!isNameUnique(name, state.assets)) {
      setErrorMsg(`Nama instrumen "${name}" sudah digunakan!`);
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'add',
      data: { name, type, subType }
    });
    setErrorMsg('');
  };

  const handleEditAsset = (id: string, newName: string) => {
    const name = newName.trim();
    if (!name) return;

    if (!isNameUnique(name, state.assets, id)) {
      setErrorMsg(`Nama instrumen "${name}" sudah digunakan!`);
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'edit',
      data: { id, name }
    });
    setErrorMsg('');
  };

  const handleDeleteClick = (asset: any) => {
    if (asset.value > 0) {
      setErrorMsg(`Instrumen "${asset.name}" tidak dapat dihapus karena masih memiliki saldo/nominal. Silakan jual atau nolkan saldo terlebih dahulu.`);
      return;
    }

    const hasHistory = hasTransactionHistory(asset.name);
    
    if (hasHistory) {
      // If value is 0 and has history, allow deactivation
      setConfirmModal({
        isOpen: true,
        type: 'deactivate',
        data: asset
      });
    } else {
      // No history, allow full deletion
      setConfirmModal({
        isOpen: true,
        type: 'delete',
        data: asset
      });
    }
    setErrorMsg('');
  };

  const executeAction = () => {
    const { type, data } = confirmModal;

    if (type === 'add') {
      addAsset(data.name, data.type, data.subType);
      showToast(`Instrumen "${data.name}" berhasil ditambahkan`, 'success');
    } else if (type === 'edit') {
      editAsset(data.id, data.name);
      showToast(`Nama instrumen berhasil diubah menjadi "${data.name}"`, 'success');
    } else if (type === 'delete') {
      deleteAsset(data.id);
      showToast(`Instrumen "${data.name}" berhasil dihapus permanen`, 'success');
    } else if (type === 'deactivate') {
      toggleAssetStatus(data.id, false);
      showToast(`Instrumen "${data.name}" berhasil dinonaktifkan`, 'success');
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
    <div className="p-5 md:p-8 space-y-6 max-w-7xl mx-auto pb-32">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kelola Investasi</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Atur daftar instrumen investasi (Aset Beku) Anda</p>
      </header>

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2">
          <CircleAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <section className="space-y-6">
        <AssetForm onAdd={handleAddAsset} />
        <AssetList 
          assets={state.assets} 
          onEdit={handleEditAsset} 
          onDelete={handleDeleteClick} 
          onToggleStatus={toggleAssetStatus} 
        />
      </section>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        data={confirmModal.data}
        onConfirm={executeAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'add', data: null })}
      />
    </div>
  );
}
