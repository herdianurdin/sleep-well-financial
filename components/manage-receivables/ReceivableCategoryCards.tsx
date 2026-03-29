'use client';

import { useState } from 'react';
import { Pencil, Check, X, Briefcase, Users, UserPlus, Handshake } from 'lucide-react';
import { Receivable } from '@/lib/store';
import { formatCurrency, formatInputNumber } from '@/lib/utils';

interface ReceivableCategoryCardsProps {
  receivables: Receivable[];
  receivableCategories: any[];
  onUpdateLimit: (type: string, limit: number) => void;
}

export function ReceivableCategoryCards({ receivables, receivableCategories, onUpdateLimit }: ReceivableCategoryCardsProps) {
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<string>('');

  const getIcon = (type: Receivable['type']) => {
    switch (type) {
      case 'B2B': return <Briefcase className="w-6 h-6" />;
      case 'Keluarga': return <Users className="w-6 h-6" />;
      case 'Rekan Kerja': return <UserPlus className="w-6 h-6" />;
      case 'Ikut Transaksi': return <Handshake className="w-6 h-6" />;
      default: return <Handshake className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: Receivable['type']) => {
    switch (type) {
      case 'B2B': return 'bg-blue-500';
      case 'Keluarga': return 'bg-emerald-500';
      case 'Rekan Kerja': return 'bg-amber-500';
      case 'Ikut Transaksi': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const handleUpdateLimit = (type: string) => {
    const val = parseInt(editLimit.replace(/\D/g, '')) || 0;
    onUpdateLimit(type, val);
    setEditingType(null);
  };

  const getCategoryStats = (type: Receivable['type']) => {
    const category = receivableCategories.find(c => c.type === type);
    const totalOwed = receivables
      .filter(r => r.type === type)
      .reduce((sum, r) => sum + r.amount, 0);
    const limit = category?.limit || 0;
    const remaining = limit - totalOwed;
    const percentage = limit > 0 ? (totalOwed / limit) * 100 : 0;
    
    return { totalOwed, limit, remaining, percentage };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {(['B2B', 'Keluarga', 'Rekan Kerja', 'Ikut Transaksi'] as const).map((type) => {
        const stats = getCategoryStats(type);
        return (
          <div key={type} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${getTypeColor(type)}`}>
                {getIcon(type)}
              </div>
              {editingType === type ? (
                <div className="flex items-center space-x-1">
                  <input 
                    type="text"
                    value={editLimit}
                    onChange={(e) => setEditLimit(formatInputNumber(e.target.value))}
                    className="w-24 px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none font-bold text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <button onClick={() => handleUpdateLimit(type)} className="text-emerald-500 dark:text-emerald-400"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingType(null)} className="text-slate-400 dark:text-slate-500"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setEditingType(type);
                    setEditLimit(formatInputNumber(stats.limit.toString()));
                  }}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{type === 'B2B' ? 'Bisnis (B2B)' : type}</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(stats.totalOwed)}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-400 dark:text-slate-500">Sisa Limit</span>
                <span className={stats.remaining < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}>
                  {stats.limit === 0 ? 'Tanpa Limit' : formatCurrency(stats.remaining)}
                </span>
              </div>
              {stats.limit > 0 && (
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${stats.percentage > 90 ? 'bg-rose-500' : 'bg-slate-900 dark:bg-white'}`}
                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
