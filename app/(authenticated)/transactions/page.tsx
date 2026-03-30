'use client';

import { useState } from 'react';
import { useFinanceStore, Transaction } from '@/lib/store';
import { CircleAlert } from 'lucide-react';
import { TransactionCategorySelector } from '@/components/manage-transactions/TransactionCategorySelector';
import { TransactionForm } from '@/components/manage-transactions/TransactionForm';

export default function ManageTransactionsPage() {
  const { cashPositions, receivables, loans, assets, addTransaction, showToast, isLoading } = useFinanceStore();
  const [type, setType] = useState<Transaction['type']>('Pengeluaran');

  const handleTypeChange = (newType: Transaction['type']) => {
    setType(newType);
  };

  const handleSubmit = (data: { nominal: number; posAsal: string; posTujuan: string; relatedId?: string; date: string; notes?: string; profitOrLoss?: number }) => {
    addTransaction({
      type,
      nominal: data.nominal,
      posAsal: data.posAsal,
      posTujuan: data.posTujuan,
      relatedId: data.relatedId,
      date: data.date,
      notes: data.notes,
      profitOrLoss: data.profitOrLoss
    });
    showToast(`Transaksi ${type} berhasil dicatat`, 'success');
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-1/3 mb-8"></div>
        <div className="h-24 bg-slate-200 rounded-3xl w-full mb-8"></div>
        <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Catat Transaksi</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Integrasi otomatis dengan Kas, Piutang, Pinjaman, dan Aset</p>
      </header>

      <TransactionCategorySelector 
        selectedType={type} 
        onSelectType={handleTypeChange} 
      />

      <TransactionForm 
        key={type} // Force re-render and state reset when type changes
        type={type}
        cashPositions={cashPositions}
        receivables={receivables}
        loans={loans}
        assets={assets}
        onSubmit={handleSubmit}
      />

      <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start space-x-3 transition-colors">
        <CircleAlert className="w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
        <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <p className="font-bold text-slate-700 dark:text-slate-300 mb-0.5">Sistem Auto-Sync Aktif</p>
          Setiap transaksi yang Anda simpan akan langsung memperbarui saldo di menu terkait. 
          Misal: Membayar hutang akan otomatis mengurangi saldo kas Anda dan mengurangi sisa hutang di menu Kelola Pinjaman.
        </div>
      </div>
    </div>
  );
}
