'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Settings, 
  CirclePlus, 
  Wallet, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  History, 
  ReceiptText, 
  Banknote, 
  Handshake, 
  CreditCard, 
  Menu,
  CheckSquare
} from 'lucide-react';
import { useFinanceStore } from '@/lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebarCollapse } = useFinanceStore();
  const [isTransaksiOpen, setIsTransaksiOpen] = useState(pathname === '/transactions' || pathname === '/history');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only collapse on desktop if the state is set to collapsed
  const isCollapsed = isSidebarCollapsed && !isMobile;

  const navItemClass = (isActive: boolean) => 
    `w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`;

  const iconClass = (isActive: boolean) => 
    `w-5 h-5 shrink-0 ${isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400 dark:text-slate-500'}`;

  if (!mounted) return null;

  return (
    <div className={`flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 shrink-0 transition-all duration-300 z-50`}>
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'p-4 justify-center' : 'p-6 justify-between'}`}>
        <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3 overflow-hidden'}`}>
          <div className="w-10 h-10 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-md shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight whitespace-nowrap">
              Sleep-Well
            </h1>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={toggleSidebarCollapse} 
            className="hidden md:block p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Collapse Toggle for Minimalist Mode */}
      {isCollapsed && (
        <div className="px-4 pb-4 flex justify-center hidden md:flex">
          <button 
            onClick={toggleSidebarCollapse} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Navigation */}
      <nav className={`flex-1 px-4 py-2 space-y-2 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
        <Link 
          href="/dashboard" 
          className={navItemClass(pathname === '/dashboard')}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <Home className={iconClass(pathname === '/dashboard')}/>
            {!isCollapsed && <span>Dashboard</span>}
          </div>
        </Link>
        
        {/* Dropdown Transaksi */}
        <div className="relative group">
          <button 
            onClick={() => !isCollapsed && setIsTransaksiOpen(!isTransaksiOpen)} 
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-colors ${pathname === '/transactions' || pathname === '/history' ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <ReceiptText className={iconClass(pathname === '/transactions' || pathname === '/history')}/>
              {!isCollapsed && <span>Transaksi</span>}
            </div>
            {!isCollapsed && (
              <div className={`transition-transform duration-200 ${isTransaksiOpen ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </button>
          
          {/* Sub-menu for Expanded State */}
          {!isCollapsed && isTransaksiOpen && (
            <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
              <Link 
                href="/transactions" 
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors text-sm ${pathname === '/transactions' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
              >
                <CirclePlus className={`w-4 h-4 shrink-0 ${pathname === '/transactions' ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400 dark:text-slate-500'}`}/>
                <span className="whitespace-nowrap">Kelola Transaksi</span>
              </Link>
              <Link 
                href="/history" 
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors text-sm ${pathname === '/history' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
              >
                <History className={`w-4 h-4 shrink-0 ${pathname === '/history' ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400 dark:text-slate-500'}`}/>
                <span className="whitespace-nowrap">Riwayat Transaksi</span>
              </Link>
            </div>
          )}

          {/* Floating Sub-menu for Collapsed State (Desktop Only) */}
          {isCollapsed && (
            <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-[100]">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 min-w-[200px] animate-in fade-in slide-in-from-left-2 duration-200">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 mb-1">
                  Transaksi
                </p>
                <Link 
                  href="/transactions" 
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${pathname === '/transactions' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
                >
                  <CirclePlus className="w-4 h-4 shrink-0" />
                  <span>Kelola Transaksi</span>
                </Link>
                <Link 
                  href="/history" 
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${pathname === '/history' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'}`}
                >
                  <History className="w-4 h-4 shrink-0" />
                  <span>Riwayat Transaksi</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link 
          href="/manage-cash" 
          className={navItemClass(pathname === '/manage-cash')}
          title={isCollapsed ? "Kelola Kas" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <Banknote className={iconClass(pathname === '/manage-cash')}/>
            {!isCollapsed && <span className="whitespace-nowrap">Kelola Kas</span>}
          </div>
        </Link>

        <Link 
          href="/manage-receivables" 
          className={navItemClass(pathname === '/manage-receivables')}
          title={isCollapsed ? "Kelola Piutang" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <Handshake className={iconClass(pathname === '/manage-receivables')}/>
            {!isCollapsed && <span className="whitespace-nowrap">Kelola Piutang</span>}
          </div>
        </Link>

        <Link 
          href="/manage-loans" 
          className={navItemClass(pathname === '/manage-loans')}
          title={isCollapsed ? "Kelola Pinjaman" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <CreditCard className={iconClass(pathname === '/manage-loans')}/>
            {!isCollapsed && <span className="whitespace-nowrap">Kelola Pinjaman</span>}
          </div>
        </Link>

        <Link 
          href="/manage-assets" 
          className={navItemClass(pathname === '/manage-assets')}
          title={isCollapsed ? "Kelola Investasi" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <TrendingUp className={iconClass(pathname === '/manage-assets')}/>
            {!isCollapsed && <span className="whitespace-nowrap">Kelola Investasi</span>}
          </div>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link 
          href="/routines" 
          className={navItemClass(pathname === '/routines')}
          title={isCollapsed ? "Rutinitas" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <CheckSquare className={iconClass(pathname === '/routines')}/>
            {!isCollapsed && <span>Rutinitas</span>}
          </div>
        </Link>
        <Link 
          href="/settings" 
          className={navItemClass(pathname === '/settings')}
          title={isCollapsed ? "Pengaturan" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <Settings className={iconClass(pathname === '/settings')}/>
            {!isCollapsed && <span>Pengaturan</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}
