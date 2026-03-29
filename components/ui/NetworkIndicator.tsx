'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';

export function NetworkIndicator() {
  const { isOnline, setOnlineStatus } = useFinanceStore();

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center"
        >
          <div className="bg-rose-500 text-white px-4 py-2 rounded-b-2xl shadow-lg flex items-center gap-2 text-sm font-bold">
            <WifiOff className="w-4 h-4" />
            <span>Koneksi Terputus. Bekerja dalam mode Offline.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
