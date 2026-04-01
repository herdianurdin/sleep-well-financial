'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CircleCheck, TriangleAlert, X } from 'lucide-react';
import { Transaction } from '@/lib/store';
import { formatCurrency, formatInputNumber, parseInputNumber } from '@/lib/utils';

interface TransactionFormProps {
  type: Transaction['type'];
  cashPositions: any[];
  receivables: any[];
  loans: any[];
  assets: any[];
  onSubmit: (data: {
    nominal: number;
    posAsal: string;
    posTujuan: string;
    relatedId?: string;
    date: string;
    notes?: string;
    profitOrLoss?: number;
  }) => void;
}

export function TransactionForm({ type, cashPositions, receivables, loans, assets, onSubmit }: TransactionFormProps) {
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [nominal, setNominal] = useState('');
  const [posAsal, setPosAsal] = useState(type === 'Pemasukan' ? 'External' : '');
  const [posTujuan, setPosTujuan] = useState(type === 'Pengeluaran' ? 'Kebutuhan Pokok' : '');
  const [relatedId, setRelatedId] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [notes, setNotes] = useState('');
  
  // For Jual Aset
  const [saleStatus, setSaleStatus] = useState<'Impas' | 'Untung' | 'Rugi'>('Impas');
  const [profitOrLossNominal, setProfitOrLossNominal] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  let notesPlaceholder = "Catatan tambahan (opsional)";
  if (type === 'Pemberian Piutang') notesPlaceholder = "Contoh: Untuk biaya rumah sakit";
  if (type === 'Penerimaan Pinjaman') notesPlaceholder = "Contoh: Tambahan modal usaha";
  if (type === 'Beli Aset') notesPlaceholder = "Contoh: Emas Antam 1 gram";
  if (type === 'Jual Aset') notesPlaceholder = "Contoh: Butuh dana darurat";
  if (type === 'Mutasi Kas') notesPlaceholder = "Contoh: Pindah dana untuk tabungan";

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInputNumber(nominal);
    if (amount <= 0) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    const amount = parseInputNumber(nominal);
    
    let profitOrLossValue: number | undefined = undefined;
    if (type === 'Jual Aset') {
      const plAmount = parseInputNumber(profitOrLossNominal);
      if (saleStatus === 'Untung') profitOrLossValue = plAmount;
      else if (saleStatus === 'Rugi') profitOrLossValue = -plAmount;
      else profitOrLossValue = 0;
    }

    let finalDateIso = new Date().toISOString();
    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      const now = new Date();
      // Create a date object in the local timezone with the selected date and current time
      const localDate = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());
      finalDateIso = localDate.toISOString();
    }

    onSubmit({
      nominal: amount,
      posAsal: posAsal || 'Lainnya',
      posTujuan: posTujuan || 'Lainnya',
      relatedId: relatedId || undefined,
      date: finalDateIso,
      notes: notes || undefined,
      profitOrLoss: profitOrLossValue
    });

    setShowConfirmModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setNominal('');
    setPosAsal(type === 'Pemasukan' ? 'External' : '');
    setPosTujuan(type === 'Pengeluaran' ? 'Kebutuhan Pokok' : '');
    setRelatedId('');
    setNotes('');
    setSaleStatus('Impas');
    setProfitOrLossNominal('');
  };

  return (
    <>
      <form onSubmit={handlePreSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 md:space-y-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Nominal Input - Always Visible */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nominal Transaksi</label>
            <input 
              type="text"
              value={nominal}
              onChange={(e) => setNominal(formatInputNumber(e.target.value))}
              placeholder="Rp 0"
              required
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-base md:text-lg font-bold text-slate-900 dark:text-white transition-all"
            />
          </div>

          {/* Date Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tanggal Transaksi</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all"
            />
          </div>

          {/* Dynamic Fields based on Type */}
          
          {/* 1. Pemasukan */}
          {type === 'Pemasukan' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sumber Dana</label>
                <input 
                  type="text"
                  value={posAsal}
                  onChange={(e) => setPosAsal(e.target.value)}
                  placeholder="Contoh: Gaji Bulanan"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Masuk ke Kas</label>
                <select 
                  value={posTujuan}
                  onChange={(e) => setPosTujuan(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas Tujuan</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 2. Pengeluaran */}
          {type === 'Pengeluaran' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ambil dari Kas</label>
                <select 
                  value={posAsal}
                  onChange={(e) => setPosAsal(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas Asal</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Kategori Pengeluaran</label>
                <input 
                  type="text"
                  value={posTujuan}
                  onChange={(e) => setPosTujuan(e.target.value)}
                  placeholder="Contoh: Makan Siang"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all"
                />
              </div>
            </>
          )}

          {/* 3. Piutang (Pemberian & Pelunasan) */}
          {(type === 'Pemberian Piutang' || type === 'Pelunasan Piutang') && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pilih Peminjam</label>
                <select 
                  value={relatedId}
                  onChange={(e) => setRelatedId(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Nama Peminjam</option>
                  {receivables.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Saldo: {formatCurrency(r.amount)})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {type === 'Pemberian Piutang' ? 'Ambil dari Kas' : 'Masuk ke Kas'}
                </label>
                <select 
                  value={type === 'Pemberian Piutang' ? posAsal : posTujuan}
                  onChange={(e) => type === 'Pemberian Piutang' ? setPosAsal(e.target.value) : setPosTujuan(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 4. Pinjaman (Penerimaan & Pembayaran) */}
          {(type === 'Penerimaan Pinjaman' || type === 'Pembayaran Pinjaman') && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pilih Kreditur</label>
                <select 
                  value={relatedId}
                  onChange={(e) => setRelatedId(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Nama Kreditur</option>
                  {loans.map(l => (
                    <option key={l.id} value={l.id}>{l.name} (Saldo: {formatCurrency(l.amount)})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {type === 'Pembayaran Pinjaman' ? 'Ambil dari Kas' : 'Masuk ke Kas'}
                </label>
                <select 
                  value={type === 'Pembayaran Pinjaman' ? posAsal : posTujuan}
                  onChange={(e) => type === 'Pembayaran Pinjaman' ? setPosAsal(e.target.value) : setPosTujuan(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 5. Aset (Beli & Jual) */}
          {(type === 'Beli Aset' || type === 'Jual Aset') && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pilih Aset</label>
                <select 
                  value={relatedId}
                  onChange={(e) => setRelatedId(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Nama Aset</option>
                  {assets.filter(a => a.isActive).map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Nilai: {formatCurrency(a.value)})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {type === 'Beli Aset' ? 'Ambil dari Kas' : 'Masuk ke Kas'}
                </label>
                <select 
                  value={type === 'Beli Aset' ? posAsal : posTujuan}
                  onChange={(e) => type === 'Beli Aset' ? setPosAsal(e.target.value) : setPosTujuan(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 6. Mutasi Kas */}
          {type === 'Mutasi Kas' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dari Kas</label>
                <select 
                  value={posAsal}
                  onChange={(e) => setPosAsal(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas Asal</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ke Kas</label>
                <select 
                  value={posTujuan}
                  onChange={(e) => setPosTujuan(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="">Pilih Kas Tujuan</option>
                  {cashPositions.filter(p => p.isActive).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Profit/Loss for Jual Aset */}
          {type === 'Jual Aset' && (
            <>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status Penjualan</label>
                <select 
                  value={saleStatus}
                  onChange={(e) => setSaleStatus(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all appearance-none"
                >
                  <option value="Impas">Impas (Tidak Untung/Rugi)</option>
                  <option value="Untung">Untung (Profit)</option>
                  <option value="Rugi">Rugi (Loss)</option>
                </select>
              </div>
              {saleStatus !== 'Impas' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Nominal {saleStatus}
                  </label>
                  <input 
                    type="text"
                    value={profitOrLossNominal}
                    onChange={(e) => setProfitOrLossNominal(formatInputNumber(e.target.value))}
                    placeholder="Rp 0"
                    required
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all"
                  />
                </div>
              )}
            </>
          )}

          {/* Notes Input - Always Visible */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Catatan</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={notesPlaceholder}
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm font-medium text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold"
              >
                <CircleCheck className="w-3.5 h-3.5" />
                <span>Transaksi berhasil disimpan dan saldo otomatis terupdate!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm md:text-base font-black rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-100 dark:shadow-none active:scale-[0.98]"
          >
            Simpan Transaksi
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 max-w-sm md:max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                  <TriangleAlert className="w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="text-base md:text-lg font-bold">Konfirmasi</h3>
                </div>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Apakah Anda yakin ingin menyimpan transaksi ini?</p>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1.5 text-[10px] md:text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Tipe:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Nominal:</span>
                    <span className="font-bold text-slate-900 dark:text-white">Rp {formatInputNumber(nominal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Tanggal:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{date}</span>
                  </div>
                  {notes && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Catatan:</span>
                      <span className="font-bold text-slate-900 dark:text-white text-right max-w-[150px] md:max-w-[180px] truncate">{notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs md:text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="flex-1 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs md:text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Ya, Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
