'use client';

import { 
  CircleArrowUp, 
  CircleArrowDown, 
  Handshake, 
  CreditCard, 
  Repeat, 
  Landmark 
} from 'lucide-react';
import { Transaction } from '@/lib/store';

interface TransactionCategorySelectorProps {
  selectedType: Transaction['type'];
  onSelectType: (type: Transaction['type']) => void;
}

export function TransactionCategorySelector({ selectedType, onSelectType }: TransactionCategorySelectorProps) {
  const categories = [
    { id: 'Pemasukan', label: 'Pemasukan', icon: CircleArrowUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'Pengeluaran', label: 'Pengeluaran', icon: CircleArrowDown, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'Pemberian Piutang', label: 'Kasih Pinjam', icon: Handshake, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'Pelunasan Piutang', label: 'Terima Piutang', icon: Handshake, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Penerimaan Pinjaman', label: 'Terima Hutang', icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'Pembayaran Pinjaman', label: 'Bayar Hutang', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'Beli Aset', label: 'Beli Aset', icon: Landmark, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'Jual Aset', label: 'Jual Aset', icon: Landmark, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'Mutasi Kas', label: 'Mutasi Kas', icon: Repeat, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectType(cat.id as any)}
          className={`p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
            selectedType === cat.id 
              ? `${cat.bg} dark:bg-slate-800 border-slate-900 dark:border-white shadow-sm` 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
          }`}
        >
          <cat.icon className={`w-5 h-5 ${selectedType === cat.id ? cat.color : 'text-slate-300 dark:text-slate-700'}`} />
          <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedType === cat.id ? 'text-slate-900 dark:text-white' : ''}`}>
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}
