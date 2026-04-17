'use client';

import { useState } from 'react';
import { Landmark, Trash2, Pencil, Check, X, Star, Banknote, Smartphone, Power } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CashListProps {
  cashPositions: any[];
  mainWalletId: string | null;
  isCashUsed: (name: string) => boolean;
  onEdit: (pos: any) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function CashList({ 
  cashPositions, 
  mainWalletId, 
  isCashUsed, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: CashListProps) {
  const getIcon = (type: string) => {
    if (type === 'fisik') return <Banknote className="w-4 h-4" />;
    if (type === 'ewallet') return <Smartphone className="w-4 h-4" />;
    return <Landmark className="w-4 h-4" />;
  };

  return (
    <div className="p-4 space-y-3">
      {cashPositions.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
            <Landmark className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Belum ada posisi kas</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">Tambahkan rekening bank, e-wallet, atau kas fisik pertama Anda di bawah.</p>
          </div>
        </div>
      ) : (
        cashPositions.map((pos: any) => {
          const isMain = mainWalletId === pos.id;
          const isActive = pos.isActive !== false; // default true

          return (
            <div key={pos.id} className={`flex items-center justify-between p-3 rounded-2xl border ${isMain ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : !isActive ? 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    (pos.tags && pos.tags.length > 0) || isMain 
                      ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isMain ? <Star className="w-4 h-4 fill-current text-white" /> : getIcon(pos.type || 'bank')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col mb-0.5">
                    <div className="flex items-center space-x-2 min-w-0">
                      <p className={`text-sm font-bold truncate ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-600 line-through'}`}>{pos.name}</p>
                      {isMain && <span className="shrink-0 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Kas Utama Lama</span>}
                      {!isActive && <span className="shrink-0 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Nonaktif</span>}
                    </div>
                    
                    {/* Display Tags */}
                    {pos.tags && pos.tags.length > 0 && isActive && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pos.tags.includes('Dana Darurat') && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-[4px] text-[9px] font-bold uppercase tracking-wider">Darurat</span>
                        )}
                        {pos.tags.includes('Uang Bebas') && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-[4px] text-[9px] font-bold uppercase tracking-wider">Amunisi</span>
                        )}
                        {pos.tags.includes('Operasional') && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-[4px] text-[9px] font-bold uppercase tracking-wider">Operasional</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{formatCurrency(pos.balance)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-2 shrink-0">
                {isActive ? (
                  <>
                    <button 
                      onClick={() => onEdit(pos)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                      title="Ubah & Atur Label Kas"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(pos.id)}
                      disabled={isMain}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title={isMain ? "Tidak dapat menghapus Kas Utama" : "Hapus/Nonaktifkan Kas"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => onToggleStatus(pos.id, true)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-colors"
                    title="Aktifkan Kembali"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
