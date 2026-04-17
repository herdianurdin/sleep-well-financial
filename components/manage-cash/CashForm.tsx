'use client';

import { useState } from 'react';
import { Plus, Check, ShieldAlert, Zap, Layers } from 'lucide-react';

interface CashFormProps {
  onAdd: (name: string, type: string, tags: ('Dana Darurat' | 'Uang Bebas' | 'Operasional')[]) => void;
}

export function CashForm({ onAdd }: CashFormProps) {
  const [newCashName, setNewCashName] = useState('');
  const [newCashType, setNewCashType] = useState('bank');
  const [selectedTags, setSelectedTags] = useState<('Dana Darurat' | 'Uang Bebas' | 'Operasional')[]>([]);

  const toggleTag = (tag: 'Dana Darurat' | 'Uang Bebas' | 'Operasional') => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCashName.trim();
    if (!name) return;

    onAdd(name, newCashType, selectedTags);
    setNewCashName('');
    setNewCashType('bank');
    setSelectedTags([]);
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <select
              value={newCashType}
              onChange={(e) => setNewCashType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/10 text-sm text-slate-700 dark:text-slate-300"
            >
              <option value="bank" className="bg-white dark:bg-slate-900">Bank</option>
              <option value="ewallet" className="bg-white dark:bg-slate-900">Dompet Digital</option>
              <option value="fisik" className="bg-white dark:bg-slate-900">Kas Fisik</option>
            </select>
            <input 
              type="text" 
              value={newCashName}
              onChange={(e) => setNewCashName(e.target.value)}
              placeholder="Nama kas (Cth: Bank BRI)"
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/10 text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Tag Selection */}
        <div className="flex flex-col space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Peruntukan Kas (Pilih bisa lebih dari 1)</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleTag('Dana Darurat')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedTags.includes('Dana Darurat') 
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Dana Darurat</span>
              {selectedTags.includes('Dana Darurat') && <Check className="w-3 h-3 ml-1" />}
            </button>
            <button
              type="button"
              onClick={() => toggleTag('Uang Bebas')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedTags.includes('Uang Bebas') 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Uang Bebas</span>
              {selectedTags.includes('Uang Bebas') && <Check className="w-3 h-3 ml-1" />}
            </button>
            <button
              type="button"
              onClick={() => toggleTag('Operasional')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedTags.includes('Operasional') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Operasional</span>
              {selectedTags.includes('Operasional') && <Check className="w-3 h-3 ml-1" />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={!newCashName.trim()}
          className="w-full lg:w-fit self-end px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors flex items-center justify-center space-x-1 font-medium text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Simpan Kas Baru</span>
        </button>
      </form>
    </div>
  );
}
