'use client';

import { useState } from 'react';
import { TrendingUp, Pencil, Trash2, Check, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AssetListProps {
  assets: any[];
  onEdit: (id: string, newName: string) => void;
  onDelete: (asset: any) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function AssetList({ assets, onEdit, onDelete, onToggleStatus }: AssetListProps) {
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editAssetName, setEditAssetName] = useState('');

  const activeAssets = assets.filter(a => a.isActive !== false);
  const inactiveAssets = assets.filter(a => a.isActive === false);

  const handleEditClick = (id: string) => {
    onEdit(id, editAssetName);
    setEditingAssetId(null);
  };

  return (
    <div className="space-y-8">
      {/* Active Assets */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Daftar Instrumen Aktif</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {activeAssets.length === 0 ? (
            <div className="md:col-span-2 py-12 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-1 px-4">
                <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">Belum ada instrumen investasi aktif</p>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 max-w-[250px]">Mulai catat aset beku Anda seperti Emas, Saham, atau Properti menggunakan form di atas.</p>
              </div>
            </div>
          ) : (
            activeAssets.map((asset: any) => {
              const isEditing = editingAssetId === asset.id;

              return (
                <div key={asset.id} className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] md:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate">
                          {asset.type} {asset.subType ? `• ${asset.subType}` : ''}
                        </p>
                        {isEditing ? (
                          <div className="flex items-center space-x-1 mt-1">
                            <input 
                              type="text" 
                              value={editAssetName}
                              onChange={(e) => setEditAssetName(e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs md:text-sm font-bold text-slate-900 dark:text-white"
                              autoFocus
                            />
                            <button onClick={() => handleEditClick(asset.id)} className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg shrink-0">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingAssetId(null)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shrink-0">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">{asset.name}</h3>
                        )}
                      </div>
                    </div>
                    
                    {!isEditing && (
                      <div className="flex items-center space-x-1 shrink-0">
                        <button 
                          onClick={() => {
                            setEditingAssetId(asset.id);
                            setEditAssetName(asset.name);
                          }}
                          className="p-1.5 md:p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg md:rounded-xl transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(asset)}
                          className="p-1.5 md:p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg md:rounded-xl transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-[10px] md:text-xs font-medium text-slate-400 dark:text-slate-500">Nilai Saat Ini</span>
                    <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate ml-2">{formatCurrency(asset.value)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inactive Assets */}
      {inactiveAssets.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 opacity-50">
            <X className="w-4 h-4 md:w-5 md:h-5 text-slate-400 dark:text-slate-500" />
            <h2 className="text-[10px] md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Instrumen Nonaktif</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 opacity-60 grayscale">
            {inactiveAssets.map((asset: any) => (
              <div key={asset.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{asset.type}</p>
                    <h3 className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 truncate">{asset.name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => onToggleStatus(asset.id, true)}
                  className="text-[8px] md:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline shrink-0"
                >
                  Aktifkan Kembali
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
