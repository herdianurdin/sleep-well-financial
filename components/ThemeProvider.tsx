'use client';

import { useEffect, useState } from 'react';
import { useFinanceStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, hasHydrated } = useFinanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !hasHydrated) return;
    
    // Force dark mode
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, [mounted, hasHydrated]);

  if (!mounted || !hasHydrated) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
