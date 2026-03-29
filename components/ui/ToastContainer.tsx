'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { CircleCheck, CircleAlert, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useFinanceStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: any; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <CircleCheck className="w-5 h-5 text-emerald-500" />,
    error: <CircleAlert className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 p-4 rounded-2xl border shadow-lg max-w-sm w-full ${bgColors[toast.type as keyof typeof bgColors]}`}
    >
      {icons[toast.type as keyof typeof icons]}
      <p className="flex-1 text-sm font-bold text-slate-800">{toast.message}</p>
      <button onClick={onRemove} className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </motion.div>
  );
}
