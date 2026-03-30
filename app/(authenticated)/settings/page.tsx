'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { firebaseService } from '@/lib/firebase-service';
import { 
  Lock, 
  LogOut, 
  RefreshCw, 
  Shield, 
  Database, 
  Download, 
  Upload,
  FileSpreadsheet,
  Trash2, 
  Eye, 
  EyeOff, 
  Clock, 
  Cloud, 
  User,
  CircleAlert,
  X,
  Save,
  KeyRound,
  ChevronRight,
  Calculator,
  Home,
  Users,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

type ModalType = 'threshold' | 'calc-threshold' | 'password' | 'logout' | 'sync' | 'backup' | 'backup-excel' | 'restore-json' | 'restore-excel' | 'wipe' | null;

export default function SettingsPage() {
  const state = useFinanceStore();
  const router = useRouter();
  const currentUser = auth.currentUser;
  
  // Local States
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [thresholdInput, setThresholdInput] = useState(state.threshold.toLocaleString('id-ID'));
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false, action: false });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);

  // Threshold Calculator State
  const [monthlyLivingCost, setMonthlyLivingCost] = useState(state.monthlyLivingCost.toLocaleString('id-ID'));
  const [livingCondition, setLivingCondition] = useState<'parents_no_demands' | 'parents_with_demands' | 'alone_no_demands' | 'alone_with_demands'>(state.livingCondition as any || 'parents_no_demands');

  // Handlers
  const handleThresholdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      const numValue = parseInt(value, 10);
      setThresholdInput(numValue.toLocaleString('id-ID'));
    } else {
      setThresholdInput('0');
    }
  };

  const handleMonthlyCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      const numValue = parseInt(value, 10);
      setMonthlyLivingCost(numValue.toLocaleString('id-ID'));
    } else {
      setMonthlyLivingCost('0');
    }
  };

  const calculateThreshold = () => {
    const cost = parseInt(monthlyLivingCost.replace(/\D/g, ''), 10) || 0;
    let multiplier = 3;
    if (livingCondition === 'parents_no_demands') multiplier = 3;
    else if (livingCondition === 'parents_with_demands') multiplier = 6;
    else if (livingCondition === 'alone_no_demands') multiplier = 6;
    else if (livingCondition === 'alone_with_demands') multiplier = 8;
    
    return cost * multiplier;
  };

  const applyCalculatedThreshold = () => {
    setActiveModal('calc-threshold');
  };

  const confirmCalculatedThreshold = () => {
    const result = calculateThreshold();
    setThresholdInput(result.toLocaleString('id-ID'));
    state.showToast('Threshold kalkulasi diterapkan ke input', 'success');
    setActiveModal(null);
  };

  const handlePasswordInputChange = (field: keyof typeof newPassword, value: string) => {
    setNewPassword(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const confirmThresholdSave = async () => {
    const numValue = parseInt(thresholdInput.replace(/\D/g, ''), 10);
    const livingCost = parseInt(monthlyLivingCost.replace(/\D/g, ''), 10) || 0;
    
    state.setThreshold(numValue);
    state.setThresholdCalculator(livingCost, livingCondition);
    
    if (state.userId) {
      try {
        await firebaseService.updateUserSettings(state.userId, {
          threshold: numValue,
          monthlyLivingCost: livingCost,
          livingCondition: livingCondition
        });
      } catch (err) {
        console.error('Failed to sync threshold to cloud:', err);
      }
    }
    
    state.showToast('Threshold dan Konfigurasi Finansial berhasil diperbarui', 'success');
    setActiveModal(null);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.current || !newPassword.new || !newPassword.confirm) {
      setError('Semua field harus diisi');
      return;
    }
    if (newPassword.new !== newPassword.confirm) {
      setError('Konfirmasi password baru tidak cocok');
      return;
    }
    if (newPassword.new.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, newPassword.current);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword.new);
        state.showToast('Password berhasil diperbarui', 'success');
        closeModal();
      }
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Password saat ini salah');
      } else {
        setError('Gagal memperbarui password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    state.logout();
    router.push('/login');
  };

  const handleForceSync = async () => {
    if (!state.userId) return;
    setIsSyncing(true);
    try {
      await firebaseService.syncFullState(state.userId, state);
      const now = new Date();
      const timeStr = `Hari ini, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      state.setLastSync(timeStr);
      state.showToast('Sinkronisasi cloud berhasil', 'success');
    } catch (err) {
      console.error('Sync error:', err);
      state.showToast('Gagal sinkronisasi cloud', 'error');
    } finally {
      setIsSyncing(false);
      setActiveModal(null);
    }
  };

  const handleExport = async () => {
    if (!confirmPassword) {
      setError('Password wajib diisi');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, confirmPassword);
        await reauthenticateWithCredential(user, credential);
        
        const dataStr = JSON.stringify(state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `sleepwell-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        setConfirmPassword('');
        setError('');
        setActiveModal(null);
        state.showToast('Data berhasil diekspor', 'success');
      }
    } catch (err: any) {
      console.error('Export error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Password salah');
      } else {
        setError('Gagal memverifikasi password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuclearOption = async () => {
    if (!confirmPassword) {
      setError('Password wajib diisi');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, confirmPassword);
        await reauthenticateWithCredential(user, credential);
        
        if (state.userId) {
          await firebaseService.wipeAllData(state.userId);
        }
        
        state.resetData();
        localStorage.clear();
        state.logout();
        router.push('/login');
      }
    } catch (err: any) {
      console.error('Wipe error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Password salah');
      } else {
        setError('Gagal memverifikasi password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!confirmPassword) {
      setError('Password wajib diisi');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, confirmPassword);
        await reauthenticateWithCredential(user, credential);
        
        const XLSX = await import('xlsx');
        // Prepare data for Excel
        const wb = XLSX.utils.book_new();
        
        // Settings Sheet
        const settingsData = [{
          Threshold: state.threshold,
          MonthlyLivingCost: state.monthlyLivingCost,
          LivingCondition: state.livingCondition,
          PrivacyMode: state.privacyMode,
          SessionTimeout: state.sessionTimeout
        }];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(settingsData), "Settings");
        
        // Cash Positions
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.cashPositions), "CashPositions");
        
        // Assets
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.assets), "Assets");
        
        // Receivables
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.receivables), "Receivables");
        
        // Loans
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.loans), "Loans");
        
        // Transactions
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.transactions), "Transactions");
        
        // Export
        XLSX.writeFile(wb, `sleepwell-finance-backup-${new Date().toISOString().split('T')[0]}.xlsx`);
        
        setConfirmPassword('');
        setError('');
        setActiveModal(null);
        state.showToast('Data berhasil diekspor ke Excel', 'success');
      }
    } catch (err: any) {
      console.error('Excel export error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Password salah');
      } else {
        setError('Gagal memverifikasi password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreJSON = async () => {
    if (!confirmPassword) {
      setError('Password wajib diisi');
      return;
    }
    if (!importFile) {
      setError('Pilih file JSON terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, confirmPassword);
        await reauthenticateWithCredential(user, credential);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);
            
            // Basic validation
            if (!data.cashPositions || !data.transactions) {
              throw new Error('Format file tidak valid');
            }
            
            // Update store
            state.setUserData(data);
            
            // Sync to Firebase if needed
            const latestState = useFinanceStore.getState();
            if (latestState.userId) {
              await firebaseService.wipeAllData(latestState.userId);
              await firebaseService.syncFullState(latestState.userId, latestState);
            }
            
            setConfirmPassword('');
            setImportFile(null);
            setError('');
            setActiveModal(null);
            state.showToast('Data berhasil di-restore dari JSON', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (err) {
            setError('Gagal membaca file JSON: ' + (err as Error).message);
          }
        };
        reader.readAsText(importFile);
      }
    } catch (err: any) {
      console.error('JSON restore error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Password salah');
      } else {
        setError('Gagal memverifikasi password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreExcel = async () => {
    if (!confirmPassword) {
      setError('Password wajib diisi');
      return;
    }
    if (!importFile) {
      setError('Pilih file Excel terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, confirmPassword);
        await reauthenticateWithCredential(user, credential);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const XLSX = await import('xlsx');
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const restoredData: any = {};
            
            // Helper to get sheet data
            const getSheetData = (name: string) => {
              const sheet = workbook.Sheets[name];
              return sheet ? XLSX.utils.sheet_to_json(sheet) : [];
            };
            
            const settings = getSheetData("Settings")[0] as any;
            if (settings) {
              restoredData.settings = {
                threshold: settings.Threshold,
                monthlyLivingCost: settings.MonthlyLivingCost,
                livingCondition: settings.LivingCondition,
                privacyMode: settings.PrivacyMode === true || settings.PrivacyMode === "true",
                sessionTimeout: settings.SessionTimeout
              };
            }
            
            restoredData.cashPositions = getSheetData("CashPositions");
            restoredData.assets = getSheetData("Assets");
            restoredData.receivables = getSheetData("Receivables");
            restoredData.loans = getSheetData("Loans");
            restoredData.transactions = getSheetData("Transactions");
            
            // Basic validation
            if (restoredData.cashPositions.length === 0 && restoredData.transactions.length === 0) {
              throw new Error('File Excel kosong atau format tidak sesuai');
            }
            
            // Update store
            state.setUserData(restoredData);
            
            // Sync to Firebase if needed
            const latestState = useFinanceStore.getState();
            if (latestState.userId) {
              await firebaseService.wipeAllData(latestState.userId);
              await firebaseService.syncFullState(latestState.userId, latestState);
            }
            
            setConfirmPassword('');
            setImportFile(null);
            setError('');
            setActiveModal(null);
            state.showToast('Data berhasil di-restore dari Excel', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (err) {
            setError('Gagal membaca file Excel: ' + (err as Error).message);
          }
        };
        reader.readAsArrayBuffer(importFile);
      }
    } catch (err: any) {
      console.error('Excel restore error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Password salah');
      } else {
        setError('Gagal memverifikasi password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePrivacy = async () => {
    state.togglePrivacyMode();
    if (state.userId) {
      try {
        await firebaseService.updateUserSettings(state.userId, {
          privacyMode: !state.privacyMode
        });
      } catch (err) {
        console.error('Failed to sync privacy mode:', err);
      }
    }
  };

  const handleSetTimeout = async (val: string) => {
    state.setSessionTimeout(val);
    if (state.userId) {
      try {
        await firebaseService.updateUserSettings(state.userId, {
          sessionTimeout: val
        });
      } catch (err) {
        console.error('Failed to sync session timeout:', err);
      }
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setConfirmPassword('');
    setError('');
    setNewPassword({ current: '', new: '', confirm: '' });
    setShowPasswords({ current: false, new: false, confirm: false, action: false });
    setImportFile(null);
  };

  if (state.isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 pb-32 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-1/3 mb-8"></div>
        <div className="space-y-6">
          <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
          <div className="h-48 bg-slate-200 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-12 pb-24 sm:pb-32">
      <header className="px-1 sm:px-0">
        <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Pengaturan</h1>
        <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 sm:mt-1">Kelola identitas, sistem, dan kedaulatan data Anda</p>
      </header>

      {/* 1. Akun & Keamanan */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Akun & Keamanan</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-3 sm:p-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm shrink-0">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Pemilik Akun</p>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">{currentUser?.email || 'herdianurdin@gmail.com'}</p>
              </div>
            </div>
            <div className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[8px] sm:text-[10px] font-bold uppercase rounded-full border border-emerald-100 dark:border-emerald-800 shrink-0 ml-2">
              Verified
            </div>
          </div>
          
          <div className="p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <button 
              onClick={() => setActiveModal('password')}
              className="flex items-center justify-between p-2.5 sm:p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-1.5 sm:p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-sm font-bold text-slate-800 dark:text-slate-200">Ubah Password</p>
                  <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">Amankan akses akun Anda</p>
                </div>
              </div>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600" />
            </button>
            
            <button 
              onClick={() => setActiveModal('logout')}
              className="flex items-center justify-between p-2.5 sm:p-4 bg-rose-50/30 dark:bg-rose-900/10 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-100/50 dark:border-rose-900/30 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-1.5 sm:p-2.5 bg-rose-100 dark:bg-rose-900/50 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] sm:text-sm font-bold text-rose-600 dark:text-rose-400">Keluar Sesi</p>
                  <p className="text-[8px] sm:text-[10px] font-medium text-rose-400 dark:text-slate-500">Akhiri sesi aktif saat ini</p>
                </div>
              </div>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-rose-300 dark:text-rose-700" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Konfigurasi Finansial */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Konfigurasi Finansial</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors space-y-6">
          {/* Main Threshold Input */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Threshold (Uang Dingin)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-lg">Rp</span>
                  <input
                    type="text"
                    value={thresholdInput}
                    onChange={handleThresholdInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white transition-all outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('threshold')}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/10 dark:shadow-none"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Konfigurasi</span>
              </button>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start space-x-3">
              <CircleAlert className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                Batas aman saldo yang harus dijaga di Kas Utama. Jika saldo turun di bawah angka ini, sistem akan memberikan peringatan visual di Dashboard.
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Calculator Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Kalkulator Threshold</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Biaya Hidup Bulanan
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-base">Rp</span>
                  <input
                    type="text"
                    value={monthlyLivingCost}
                    onChange={handleMonthlyCostChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-base font-bold text-slate-900 dark:text-white transition-all outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Kondisi & Tanggungan
                  </label>
                  <div className="group relative">
                    <CircleAlert className="w-3 h-3 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl border border-slate-800">
                      <p className="font-bold mb-1 border-b border-slate-800 pb-1">Panduan Kondisi:</p>
                      <ul className="space-y-1 list-disc pl-3 text-slate-300">
                        <li><span className="text-white font-bold">3 Bln:</span> Tinggal dengan ortu, tanpa tanggungan.</li>
                        <li><span className="text-white font-bold">6 Bln:</span> Tinggal dengan ortu + bantu biaya keluarga/adik.</li>
                        <li><span className="text-white font-bold">6 Bln:</span> Tinggal sendiri (kost/kontrak), tanpa tanggungan.</li>
                        <li><span className="text-white font-bold">8 Bln:</span> Tinggal sendiri + bantu biaya keluarga.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <select 
                    value={livingCondition}
                    onChange={(e) => setLivingCondition(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white transition-all outline-none appearance-none cursor-pointer pr-10"
                  >
                    <option value="parents_no_demands">Tinggal dengan Orang Tua (Tanpa Tuntutan) - 3 Bln</option>
                    <option value="parents_with_demands">Tinggal dengan Orang Tua (Banyak Tuntutan) - 6 Bln</option>
                    <option value="alone_no_demands">Tinggal Sendiri (Tanpa Tuntutan) - 6 Bln</option>
                    <option value="alone_with_demands">Tinggal Sendiri (Dengan Tuntutan) - 8 Bln</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium px-1">
                  *Pilih kondisi yang paling sesuai untuk menentukan multiplier dana darurat (3x, 6x, atau 8x biaya hidup).
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Estimasi Kebutuhan</p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                  Rp {calculateThreshold().toLocaleString('id-ID')}
                </p>
              </div>
              <button 
                onClick={applyCalculatedThreshold}
                disabled={monthlyLivingCost === '0'}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="text-xs">Gunakan Hasil Kalkulasi</span>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 3. Preferensi & Privasi */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Preferensi & Privasi</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-800">
          <div className="p-3 sm:p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className={`p-2 sm:p-3 rounded-xl transition-all ${state.privacyMode ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                {state.privacyMode ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
              <div>
                <p className="text-[13px] sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">Privacy Mode</p>
                <p className="text-[9px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">Sembunyikan angka nominal di seluruh aplikasi</p>
              </div>
            </div>
            <button 
              onClick={handleTogglePrivacy}
              className={`w-9 h-5.5 sm:w-10 sm:h-6 rounded-full transition-all relative shrink-0 ${state.privacyMode ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <motion.div 
                animate={{ x: state.privacyMode ? 18 : 4 }}
                className="absolute top-0.75 sm:top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white dark:bg-slate-200 rounded-full shadow-sm"
              />
            </button>
          </div>
          
          <div className="p-3 sm:p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <p className="text-[13px] sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">Session Timeout</p>
                <p className="text-[9px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">Logout otomatis untuk keamanan ekstra</p>
              </div>
            </div>
            <select 
              value={state.sessionTimeout}
              onChange={(e) => handleSetTimeout(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-slate-200 dark:focus:border-slate-700 text-[10px] sm:text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl px-2 sm:px-4 py-1 sm:py-2 outline-none cursor-pointer shrink-0 ml-2"
            >
              <option value="30 Menit">30 Menit</option>
              <option value="1 Jam">1 Jam</option>
              <option value="Tidak Pernah">Tidak Pernah</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Konektivitas Cloud */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
            <Cloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Konektivitas Cloud</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Cloud className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-[13px] sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">Firebase Realtime</p>
                <p className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Connected & Secure</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('sync')}
              disabled={isSyncing}
              className="flex items-center justify-center space-x-2 px-5 py-2 sm:py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[9px] sm:text-[10px] font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10 dark:shadow-none w-full sm:w-auto"
            >
              <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1">Status Server</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                {isSyncing ? 'Syncing...' : 'Optimal (12ms)'}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1">Last Updated</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                {state.lastSync || 'Belum pernah'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Manajemen Data */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
            <Database className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Manajemen Data</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          <button 
            onClick={() => setActiveModal('backup')}
            className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-1.5 sm:p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:text-blue-500 transition-colors">
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-sm font-bold text-slate-800 dark:text-slate-200">Export to JSON</p>
                <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">Backup data lokal Anda</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600" />
          </button>

          <button 
            onClick={() => setActiveModal('backup-excel')}
            className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-1.5 sm:p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:text-emerald-500 transition-colors">
                <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-sm font-bold text-slate-800 dark:text-slate-200">Export to Excel</p>
                <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">Backup data ke file Excel</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600" />
          </button>

          <button 
            onClick={() => setActiveModal('restore-json')}
            className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-1.5 sm:p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:text-purple-500 transition-colors">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-sm font-bold text-slate-800 dark:text-slate-200">Restore JSON</p>
                <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">Pulihkan data dari file JSON</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600" />
          </button>

          <button 
            onClick={() => setActiveModal('restore-excel')}
            className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-1.5 sm:p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:text-emerald-600 transition-colors">
                <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-sm font-bold text-slate-800 dark:text-slate-200">Restore Excel</p>
                <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">Pulihkan data dari file Excel</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600" />
          </button>
          
          <button 
            onClick={() => setActiveModal('wipe')}
            className="flex items-center justify-between p-3 sm:p-4 bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-100/50 dark:border-rose-900/30 rounded-xl transition-all group lg:col-span-2"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-1.5 sm:p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:text-rose-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-300 dark:text-rose-700 group-hover:text-rose-600" />
              </div>
              <div className="text-left">
                <p className="text-[11px] sm:text-sm font-bold text-rose-600 dark:text-rose-400">Nuclear Option</p>
                <p className="text-[8px] sm:text-[10px] font-medium text-rose-400 dark:text-slate-500">Hapus seluruh data permanen</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-300 dark:text-rose-700" />
          </button>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'threshold' && (
          <Modal 
            title="Simpan Threshold?"
            description="Perubahan ini akan langsung mempengaruhi perhitungan kesehatan finansial di Dashboard."
            onConfirm={confirmThresholdSave}
            onClose={closeModal}
            confirmText="Simpan"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Threshold Baru</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Rp {thresholdInput}</p>
            </div>
          </Modal>
        )}

        {activeModal === 'calc-threshold' && (
          <Modal 
            title="Gunakan Hasil Kalkulasi?"
            description="Angka hasil kalkulasi akan menggantikan input threshold saat ini. Anda tetap harus menekan tombol 'Simpan Konfigurasi' untuk menyimpan secara permanen."
            onConfirm={confirmCalculatedThreshold}
            onClose={closeModal}
            confirmText="Gunakan"
          >
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
              <p className="text-[9px] sm:text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-2">Hasil Kalkulasi</p>
              <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">Rp {calculateThreshold().toLocaleString('id-ID')}</p>
            </div>
          </Modal>
        )}

        {activeModal === 'password' && (
          <Modal 
            title="Ubah Password"
            description="Masukkan password lama dan baru Anda untuk melanjutkan."
            onConfirm={handleUpdatePassword}
            onClose={closeModal}
            confirmText={isLoading ? "Memproses..." : "Update Password"}
          >
            <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <input 
                    type={showPasswords.current ? "text" : "password"} 
                    value={newPassword.current}
                    onChange={(e) => handlePasswordInputChange('current', e.target.value)}
                    placeholder="Password Saat Ini"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-purple-500 rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPasswords.new ? "text" : "password"} 
                    value={newPassword.new}
                    onChange={(e) => handlePasswordInputChange('new', e.target.value)}
                    placeholder="Password Baru"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-purple-500 rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"} 
                    value={newPassword.confirm}
                    onChange={(e) => handlePasswordInputChange('confirm', e.target.value)}
                    placeholder="Konfirmasi Password Baru"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-purple-500 rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-[10px] text-rose-500 font-bold px-2">{error}</p>}
            </div>
          </Modal>
        )}

        {activeModal === 'logout' && (
          <Modal 
            title="Keluar Sesi?"
            description="Anda akan diarahkan kembali ke halaman login. Pastikan data Anda telah tersinkron."
            onConfirm={handleLogout}
            onClose={closeModal}
            confirmText="Keluar Sekarang"
            confirmVariant="danger"
          />
        )}

        {activeModal === 'sync' && (
          <Modal 
            title="Sinkronisasi Manual"
            description="Sistem akan melakukan rekonsiliasi data lokal dengan Firebase Cloud."
            onConfirm={handleForceSync}
            onClose={closeModal}
            confirmText="Mulai Sinkron"
          />
        )}

        {activeModal === 'backup' && (
          <Modal 
            title="Konfirmasi Backup"
            description="Masukkan password Anda untuk mengunduh file backup JSON."
            onConfirm={handleExport}
            onClose={closeModal}
            confirmText={isLoading ? "Memproses..." : "Download JSON"}
          >
            <div className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type={showPasswords.action ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Masukkan Password"
                  className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, action: !prev.action }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPasswords.action ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-[9px] sm:text-[10px] text-rose-500 font-bold px-2">{error}</p>}
            </div>
          </Modal>
        )}

        {activeModal === 'wipe' && (
          <Modal 
            title="Tindakan Nuklir!"
            description="Seluruh data lokal dan cache akan dihapus bersih. Aksi ini tidak dapat dibatalkan."
            onConfirm={handleNuclearOption}
            onClose={closeModal}
            confirmText={isLoading ? "Memproses..." : "Hapus Permanen"}
            confirmVariant="danger"
          >
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800">
                <p className="text-[9px] sm:text-[10px] text-rose-600 dark:text-rose-400 font-bold leading-relaxed">
                  Peringatan: Anda akan kehilangan akses ke seluruh histori transaksi jika data belum tersinkron ke cloud.
                </p>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type={showPasswords.action ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Konfirmasi Password"
                  className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-rose-500 rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, action: !prev.action }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPasswords.action ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-[9px] sm:text-[10px] text-rose-500 font-bold px-2">{error}</p>}
            </div>
          </Modal>
        )}

        {activeModal === 'backup-excel' && (
          <Modal 
            title="Export ke Excel"
            description="Seluruh data aplikasi akan diekspor ke dalam satu file Excel (.xlsx)."
            onConfirm={handleExportExcel}
            onClose={closeModal}
            confirmText={isLoading ? "Mengekspor..." : "Export Sekarang"}
          >
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <p className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed">
                  Data yang diekspor meliputi: Posisi Kas, Aset, Piutang, Transaksi, dan Pengaturan.
                </p>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type={showPasswords.action ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Konfirmasi Password"
                  className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-slate-900 dark:focus:border-white rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, action: !prev.action }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPasswords.action ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-[9px] sm:text-[10px] text-rose-500 font-bold px-2">{error}</p>}
            </div>
          </Modal>
        )}

        {activeModal === 'restore-json' && (
          <Modal 
            title="Restore dari JSON"
            description="Pulihkan data aplikasi dari file backup JSON sebelumnya."
            onConfirm={handleRestoreJSON}
            onClose={closeModal}
            confirmText={isLoading ? "Memulihkan..." : "Restore Sekarang"}
          >
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <p className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-relaxed">
                  Peringatan: Data saat ini akan ditimpa sepenuhnya oleh data dari file backup.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Pilih File JSON</label>
                <input 
                  type="file" 
                  accept=".json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type={showPasswords.action ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Konfirmasi Password"
                  className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-slate-900 dark:focus:border-white rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, action: !prev.action }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPasswords.action ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-[9px] sm:text-[10px] text-rose-500 font-bold px-2">{error}</p>}
            </div>
          </Modal>
        )}

        {activeModal === 'restore-excel' && (
          <Modal 
            title="Restore dari Excel"
            description="Pulihkan data aplikasi dari file backup Excel (.xlsx)."
            onConfirm={handleRestoreExcel}
            onClose={closeModal}
            confirmText={isLoading ? "Memulihkan..." : "Restore Sekarang"}
          >
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <p className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-relaxed">
                  Peringatan: Data saat ini akan ditimpa sepenuhnya oleh data dari file backup Excel.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Pilih File Excel (.xlsx)</label>
                <input 
                  type="file" 
                  accept=".xlsx"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                <input 
                  type={showPasswords.action ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Konfirmasi Password"
                  className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-slate-900 dark:focus:border-white rounded-xl outline-none font-bold text-slate-900 dark:text-white text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, action: !prev.action }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPasswords.action ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-[9px] sm:text-[10px] text-rose-500 font-bold px-2">{error}</p>}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Component
const Modal = ({ title, description, children, onConfirm, onClose, confirmText, confirmVariant = 'primary' }: any) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
    >
      <div className="p-5 sm:p-6">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="min-w-0 pr-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">{title}</h3>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 leading-relaxed">{description}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0">
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {children}
        </div>

        <div className="flex gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-all text-xs sm:text-sm"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-2.5 sm:py-3 font-bold rounded-xl transition-all shadow-lg shadow-opacity-20 text-xs sm:text-sm ${
              confirmVariant === 'danger' 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30' 
                : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-slate-900/30 dark:shadow-none'
            }`}
          >
            {confirmText || 'Konfirmasi'}
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
