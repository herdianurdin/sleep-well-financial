'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/store';
import { CheckSquare, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export function RoutineWidget() {
  const { checklists, currentYear, currentMonth } = useFinanceStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentMonthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  
  const pendingItems = checklists.filter(item => item.lastCompletedMonth !== currentMonthStr);

  if (pendingItems.length === 0) {
    return null; // Don't show anything if all done
  }

  const displayedItems = isExpanded ? pendingItems : pendingItems.slice(0, 3);
  const hasMore = pendingItems.length > 3;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 dark:bg-amber-500"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
            <CheckSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Kewajiban Belum Selesai
            </h3>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              Ada {pendingItems.length} rutinitas bulan ini yang belum dicentang
            </p>
          </div>
        </div>
        <Link 
          href="/routines"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center space-x-1 transition-colors"
        >
          <span>Lihat Daftar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {displayedItems.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate pr-4">
                {item.title}
              </p>
              {item.estimatedAmount > 0 && (
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">
                  Est: Rp {item.estimatedAmount.toLocaleString('id-ID')}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {hasMore && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 pt-2 flex items-center justify-center space-x-1 text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <span>{isExpanded ? 'Sembunyikan' : `Tampilkan semua (${pendingItems.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
