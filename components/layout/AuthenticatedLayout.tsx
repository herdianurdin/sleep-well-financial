'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFinanceStore } from '@/lib/store';
import Sidebar from '@/components/layout/Sidebar';
import { TriangleAlert, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { NetworkIndicator } from '@/components/ui/NetworkIndicator';
import { firebaseService } from '@/lib/firebase-service';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { 
    isLoggedIn, 
    userId,
    cashPositions, 
    threshold, 
    mainWalletId, 
    setLoading, 
    hasHydrated,
    setLoggedIn,
    setUserData,
    setCashPositions,
    setAssets,
    setReceivables,
    setLoans,
    setTransactions,
    setChecklists,
    setAvailablePeriods,
    currentYear,
    currentMonth
  } = useFinanceStore();
  
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  let primaryBalance = 0;
  const defenseWallets = cashPositions.filter(p => p.tags?.includes('Dana Darurat') && p.isActive !== false);
  
  if (defenseWallets.length > 0) {
    primaryBalance = defenseWallets.reduce((sum, p) => sum + p.balance, 0);
  } else {
    const mainWallet = cashPositions.find(p => p.id === mainWalletId) || cashPositions[0];
    primaryBalance = mainWallet?.isActive !== false ? (mainWallet?.balance || 0) : 0;
  }

  const isThresholdBreached = threshold > 0 && primaryBalance < threshold;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true, user.uid);
      } else {
        setLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [setLoggedIn]);

  // Sync with Firebase Realtime Database
  useEffect(() => {
    if (isLoggedIn && userId) {
      const handleData = (setter: any) => (data: any) => {
        setter(data);
      };

      const unsubUser = firebaseService.listenToUserData(userId, handleData(setUserData));
      const unsubCash = firebaseService.listenToCashPositions(userId, handleData(setCashPositions));
      const unsubAssets = firebaseService.listenToAssets(userId, handleData(setAssets));
      const unsubReceivables = firebaseService.listenToReceivables(userId, handleData(setReceivables));
      const unsubLoans = firebaseService.listenToLoans(userId, handleData(setLoans));
      const unsubChecklists = firebaseService.listenToChecklists(userId, handleData(setChecklists));
      const unsubPeriods = firebaseService.listenToAvailablePeriods(userId, handleData(setAvailablePeriods));

      return () => {
        unsubUser();
        unsubCash();
        unsubAssets();
        unsubReceivables();
        unsubLoans();
        unsubChecklists();
        unsubPeriods();
      };
    }
  }, [isLoggedIn, userId, setUserData, setCashPositions, setAssets, setReceivables, setLoans, setChecklists, setAvailablePeriods]);

  // Sync Transactions (Depends on currentYear and currentMonth)
  useEffect(() => {
    if (isLoggedIn && userId) {
      const handleData = (setter: any) => (data: any) => {
        setter(data);
      };

      const yearStr = currentYear.toString();
      const monthStr = String(currentMonth).padStart(2, '0');
      const unsubTransactions = firebaseService.listenToTransactions(userId, yearStr, monthStr, handleData(setTransactions));

      return () => {
        unsubTransactions();
      };
    }
  }, [isLoggedIn, userId, currentYear, currentMonth, setTransactions]);

  useEffect(() => {
    if (isMounted && hasHydrated) {
      setLoading(false);
      if (!isLoggedIn && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
    }
  }, [isLoggedIn, router, pathname, isMounted, hasHydrated, setLoading]);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted || !hasHydrated) return null;
  if (!isLoggedIn && pathname !== '/login') return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
      <NetworkIndicator />
      <ToastContainer />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Sleep-Well</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AnimatePresence>
          {isThresholdBreached && showBanner && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-sm font-medium z-50 shrink-0"
            >
              <div className="flex items-center space-x-2">
                <TriangleAlert className="w-4 h-4" />
                <span>Peringatan: Saldo uang pertahanan (Dana Darurat) Anda di bawah batas aman (Threshold)!</span>
              </div>
              <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
