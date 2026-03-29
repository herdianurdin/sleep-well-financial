'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface CashFormProps {
  onAdd: (name: string, type: string) => void;
}

export function CashForm({ onAdd }: CashFormProps) {
  const [newCashName, setNewCashName] = useState('');
  const [newCashType, setNewCashType] = useState('bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCashName.trim();
    if (!name) return;

    onAdd(name, newCashType);
    setNewCashName('');
    setNewCashType('bank');
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-3">
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
            placeholder="Nama kas (Cth: BCA)"
            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white/10 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <button 
          type="submit"
          disabled={!newCashName.trim()}
          className="w-full lg:w-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors flex items-center justify-center space-x-1 font-medium text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kas</span>
        </button>
      </form>
    </div>
  );
}
