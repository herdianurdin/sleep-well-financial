'use client';

import { useState, useMemo } from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Search, Filter, Calendar, ChevronRight, ChevronDown } from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function TransactionList() {
  const { transactions, currentYear, currentMonth, setCurrentDate, availablePeriods } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Semua');
  
  // Date Filtering State
  const selectedMonth = currentMonth - 1; // 0-indexed for UI
  const selectedYear = currentYear;
  
  // Available Years and Months from Data
  const availableYears = useMemo(() => {
    const years = Object.keys(availablePeriods || {}).map(Number);
    if (years.length === 0) return [new Date().getFullYear()];
    // Ensure current year is included if it's the first time
    if (!years.includes(new Date().getFullYear())) {
      years.push(new Date().getFullYear());
    }
    return years.sort((a, b) => b - a);
  }, [availablePeriods]);

  const availableMonths = useMemo(() => {
    const months = (availablePeriods || {})[selectedYear.toString()] || [];
    if (months.length === 0) {
      // If it's current year, at least show current month
      if (selectedYear === new Date().getFullYear()) {
        return [new Date().getMonth() + 1];
      }
      return [];
    }
    return months.map(Number).sort((a, b) => a - b);
  }, [availablePeriods, selectedYear]);
  
  // Pagination State
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pemasukan':
        return <ArrowDownRight className="w-5 h-5 text-emerald-500" />;
      case 'pengeluaran':
        return <ArrowUpRight className="w-5 h-5 text-rose-500" />;
      case 'mutasi kas':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Filter and Search Logic
  const filteredTransactions = useMemo(() => {
    return (transactions || [])
      .filter(trx => {
        const trxDate = new Date(trx.date);
        const matchesDate = trxDate.getMonth() === selectedMonth && trxDate.getFullYear() === selectedYear;
        
        const matchesSearch = 
          (trx.notes?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (trx.posAsal.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (trx.posTujuan.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (trx.type.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = filterType === 'Semua' || trx.type === filterType;
        
        return matchesDate && matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, selectedMonth, selectedYear]);

  // Paginated List
  const paginatedTransactions = filteredTransactions.slice(0, itemsPerPage);
  const hasMore = filteredTransactions.length > itemsPerPage;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const transactionTypes = [
    'Semua',
    'Pemasukan',
    'Pengeluaran',
    'Mutasi Kas',
    'Pemberian Piutang',
    'Pelunasan Piutang',
    'Penerimaan Pinjaman',
    'Pembayaran Pinjaman',
    'Beli Aset',
    'Jual Aset'
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text"
              placeholder="Cari catatan, kategori, atau tipe..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all text-sm text-slate-900 dark:text-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <select 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all text-sm appearance-none bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {transactionTypes.map(type => (
                <option key={type} value={type} className="bg-white dark:bg-slate-900">{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select 
              className="text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none bg-transparent cursor-pointer"
              value={selectedMonth}
              onChange={(e) => {
                setCurrentDate(selectedYear, parseInt(e.target.value) + 1);
                setItemsPerPage(10);
              }}
            >
              {availableMonths.length > 0 ? (
                availableMonths.map((m) => (
                  <option key={m} value={m - 1} className="bg-white dark:bg-slate-900">
                    {months[m - 1]}
                  </option>
                ))
              ) : (
                <option value={selectedMonth} className="bg-white dark:bg-slate-900">
                  {months[selectedMonth]}
                </option>
              )}
            </select>
            <select 
              className="text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none bg-transparent cursor-pointer"
              value={selectedYear}
              onChange={(e) => {
                const newYear = parseInt(e.target.value);
                // When year changes, check if current month is available in new year
                const monthsInNewYear = (availablePeriods || {})[newYear.toString()] || [];
                let newMonth = currentMonth;
                if (monthsInNewYear.length > 0 && !monthsInNewYear.includes(currentMonth.toString().padStart(2, '0'))) {
                  newMonth = parseInt(monthsInNewYear[monthsInNewYear.length - 1]);
                }
                setCurrentDate(newYear, newMonth);
                setItemsPerPage(10);
              }}
            >
              {availableYears.map(year => (
                <option key={year} value={year} className="bg-white dark:bg-slate-900">{year}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium self-center">
            Menampilkan {paginatedTransactions.length} dari {filteredTransactions.length} transaksi
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {paginatedTransactions.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence mode="popLayout">
              {paginatedTransactions.map((trx) => (
                <motion.div 
                   layout
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   key={trx.id} 
                   className="p-4 md:p-6 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0 mt-1 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      {getIcon(trx.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{trx.type}</p>
                        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {trx.type === 'Mutasi Kas' 
                          ? `${trx.posAsal} → ${trx.posTujuan}`
                          : trx.type === 'Pemasukan'
                          ? `Ke: ${trx.posTujuan}`
                          : `Dari: ${trx.posAsal} (Untuk: ${trx.posTujuan})`}
                      </p>
                      {trx.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic">&quot;{trx.notes}&quot;</p>
                      )}
                      {trx.profitOrLoss !== undefined && trx.profitOrLoss !== 0 && (
                        <p className={`text-xs font-bold mt-1 ${trx.profitOrLoss > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {trx.profitOrLoss > 0 ? 'Untung' : 'Rugi'}: {formatCurrency(Math.abs(trx.profitOrLoss))}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(trx.date)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold ${trx.type === 'Pengeluaran' ? 'text-rose-600 dark:text-rose-400' : trx.type === 'Pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {trx.type === 'Pengeluaran' ? '-' : trx.type === 'Pemasukan' ? '+' : ''}{formatCurrency(trx.nominal)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Tidak ada transaksi ditemukan</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Untuk periode {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setItemsPerPage(prev => prev + 10)}
              className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <span>Muat Lebih Banyak</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
