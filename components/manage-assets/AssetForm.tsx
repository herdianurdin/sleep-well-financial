'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

const INVESTMENT_TYPES = ['Emas', 'Deposito', 'Reksadana', 'SBN', 'Obligasi', 'Saham'];
const REKSADANA_SUBTYPES = ['Pasar Uang', 'Obligasi', 'Saham', 'Lainnya'];

interface AssetFormProps {
  onAdd: (name: string, type: string, subType?: string) => void;
}

export function AssetForm({ onAdd }: AssetFormProps) {
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState('Emas');
  const [newAssetSubType, setNewAssetSubType] = useState('Pasar Uang');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newAssetName.trim();
    if (!name) return;

    onAdd(name, newAssetType, newAssetType === 'Reksadana' ? newAssetSubType : undefined);
    setNewAssetName('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tambah Instrumen Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-widest">Jenis Investasi</label>
          <select 
            value={newAssetType}
            onChange={(e) => setNewAssetType(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
          >
            {INVESTMENT_TYPES.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>)}
          </select>
        </div>

        {newAssetType === 'Reksadana' ? (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-widest">Sub-Jenis Reksadana</label>
            <select 
              value={newAssetSubType}
              onChange={(e) => setNewAssetSubType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
            >
              {REKSADANA_SUBTYPES.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>)}
            </select>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-widest">Nama Instrumen (Wajib Unik)</label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Cth: Emas Antam / Deposito Bank ABC / Saham BBCA"
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!newAssetName.trim()}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-all flex items-center space-x-2 font-bold text-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
