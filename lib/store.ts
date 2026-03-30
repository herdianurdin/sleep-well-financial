import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';
import { firebaseService } from './firebase-service';

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type CashPosition = {
  id: string;
  name: string;
  balance: number;
  type?: string;
  isActive?: boolean;
};

export type Asset = {
  id: string;
  name: string;
  value: number;
  type: string;
  subType?: string;
  isActive?: boolean;
};

export type Transaction = {
  id: string;
  type: 'Pemasukan' | 'Pengeluaran' | 'Pemberian Piutang' | 'Pelunasan Piutang' | 'Penerimaan Pinjaman' | 'Pembayaran Pinjaman' | 'Beli Aset' | 'Jual Aset' | 'Mutasi Kas';
  posAsal: string; // Cash position name or "External"
  posTujuan: string; // Cash position name or "Expense Category"
  nominal: number;
  relatedId?: string; // ID of Receivable, Loan, or Asset
  date: string;
  notes?: string;
  profitOrLoss?: number;
};

export type Receivable = {
  id: string;
  name: string; // Borrower name
  type: 'B2B' | 'Keluarga' | 'Rekan Kerja' | 'Ikut Transaksi';
  amount: number;
  isActive?: boolean;
};

export type ReceivableCategory = {
  type: 'B2B' | 'Keluarga' | 'Rekan Kerja' | 'Ikut Transaksi';
  limit: number;
};

export type Loan = {
  id: string;
  name: string; // Creditor name
  type: 'Bank' | 'Personal' | 'CC/Paylater' | 'Lainnya';
  amount: number;
  dueDate?: string;
  interest?: number; // Percentage
  interestType?: 'Tunggal' | 'Majemuk';
  tenor?: number; // In months
  totalEstimate?: number;
  isActive?: boolean;
};

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface FinanceState {
  threshold: number;
  monthlyLivingCost: number;
  livingCondition: string;
  mainWalletId: string;
  cashPositions: CashPosition[];
  stats: {
    income: number;
    expense: number;
  };
  receivableCategories: ReceivableCategory[];
  receivables: Receivable[];
  loans: Loan[];
  assets: Asset[];
  transactions: Transaction[];
  availablePeriods: { [year: string]: string[] };
  isLoggedIn: boolean;
  userId: string | null;
  privacyMode: boolean;
  sessionTimeout: string;
  currentYear: number;
  currentMonth: number;
  
  // UI States
  toasts: ToastMessage[];
  isOnline: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  isSidebarCollapsed: boolean;
  hasHydrated: boolean;
  isSyncingFromFirebase: boolean;
  isSyncingToFirebase: boolean;
  lastSync: string | null;
  setHasHydrated: (val: boolean) => void;
  setIsSyncingFromFirebase: (val: boolean) => void;
  setIsSyncingToFirebase: (val: boolean) => void;
  setLastSync: (val: string) => void;

  // Sync Actions
  setUserData: (data: any) => void;
  setCashPositions: (data: any[]) => void;
  setAssets: (data: any[]) => void;
  setReceivables: (data: any[]) => void;
  setLoans: (data: any[]) => void;
  setTransactions: (data: any[]) => void;
  setAvailablePeriods: (data: { [year: string]: string[] }) => void;

  // Actions
  setLoggedIn: (val: boolean, uid?: string) => void;
  togglePrivacyMode: () => void;
  setSessionTimeout: (val: string) => void;
  setCurrentDate: (year: number, month: number) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setOnlineStatus: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  addTransaction: (data: any) => void;
  addCashPosition: (name: string, type?: string) => void;
  deleteCashPosition: (id: string) => void;
  editCashPosition: (id: string, newName: string) => void;
  toggleCashPositionStatus: (id: string, isActive: boolean) => void;
  setMainWallet: (id: string) => void;
  addAsset: (name: string, type: string, subType?: string) => void;
  deleteAsset: (id: string) => void;
  editAsset: (id: string, newName: string) => void;
  toggleAssetStatus: (id: string, isActive: boolean) => void;
  updateAssetValue: (name: string) => void;
  updateCategoryLimit: (type: string, newLimit: number) => void;
  addReceivable: (name: string, type: 'B2B' | 'Keluarga' | 'Rekan Kerja' | 'Ikut Transaksi') => void;
  deleteReceivable: (id: string) => void;
  toggleReceivableStatus: (id: string, isActive: boolean) => void;
  addLoan: (data: Omit<Loan, 'id'>, targetCashId?: string) => void;
  deleteLoan: (id: string) => void;
  toggleLoanStatus: (id: string, isActive: boolean) => void;
  updateLoanAmount: (id: string, newAmount: number) => void;
  setThreshold: (val: number) => void;
  setThresholdCalculator: (cost: number, condition: string) => void;
  logout: () => void;
  toggleSidebarCollapse: () => void;
  resetData: () => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      threshold: 0,
      monthlyLivingCost: 0,
      livingCondition: 'parents_no_demands',
      mainWalletId: '',
      cashPositions: [],
      stats: {
        income: 0,
        expense: 0,
      },
      receivableCategories: [
        { type: 'B2B', limit: 0 },
        { type: 'Keluarga', limit: 0 },
        { type: 'Rekan Kerja', limit: 0 },
        { type: 'Ikut Transaksi', limit: 0 },
      ],
      receivables: [],
      loans: [],
      assets: [],
      transactions: [],
      availablePeriods: {},
      isLoggedIn: false,
      userId: null,
      privacyMode: false,
      sessionTimeout: '30 Menit',
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      toasts: [],
      isOnline: true,
      isLoading: true, // Initially true until hydrated
      theme: 'dark',
      isSidebarCollapsed: false,
      hasHydrated: false,
      isSyncingFromFirebase: false,
      isSyncingToFirebase: false,
      lastSync: null,
      setHasHydrated: (val) => set({ hasHydrated: val }),
      setIsSyncingFromFirebase: (val) => set({ isSyncingFromFirebase: val }),
      setIsSyncingToFirebase: (val) => set({ isSyncingToFirebase: val }),
      setLastSync: (val) => set({ lastSync: val }),

      setUserData: (data) => {
        const inflowTypes = ['Pemasukan', 'Pelunasan Piutang', 'Penerimaan Pinjaman', 'Jual Aset'];
        const outflowTypes = ['Pengeluaran', 'Pemberian Piutang', 'Pembayaran Pinjaman', 'Beli Aset'];
        
        let income = 0;
        let expense = 0;
        const transactions = data?.transactions || [];
        const availablePeriods: { [year: string]: string[] } = {};
        
        transactions.forEach((t: any) => {
          if (inflowTypes.includes(t.type)) income += t.nominal;
          if (outflowTypes.includes(t.type)) expense += t.nominal;
          
          // Reconstruct available periods
          const d = new Date(t.date);
          const year = d.getFullYear().toString();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          if (!availablePeriods[year]) availablePeriods[year] = [];
          if (!availablePeriods[year].includes(month)) {
            availablePeriods[year].push(month);
            availablePeriods[year].sort();
          }
        });

        set((state) => ({
          threshold: data?.settings?.threshold ?? data?.threshold ?? state.threshold,
          monthlyLivingCost: data?.settings?.monthlyLivingCost ?? data?.monthlyLivingCost ?? state.monthlyLivingCost,
          livingCondition: data?.settings?.livingCondition ?? data?.livingCondition ?? state.livingCondition,
          mainWalletId: data?.settings?.mainWalletId ?? data?.mainWalletId ?? state.mainWalletId,
          privacyMode: data?.settings?.privacyMode ?? data?.privacyMode ?? state.privacyMode,
          sessionTimeout: data?.settings?.sessionTimeout ?? data?.sessionTimeout ?? state.sessionTimeout,
          receivableCategories: data?.receivableCategories ?? state.receivableCategories,
          cashPositions: data?.cashPositions ?? state.cashPositions,
          assets: data?.assets ?? state.assets,
          receivables: data?.receivables ?? state.receivables,
          loans: data?.loans ?? state.loans,
          transactions: transactions,
          availablePeriods: availablePeriods,
          stats: { income, expense }
        }));
      },
      setCashPositions: (data) => set({ cashPositions: data }),
      setAssets: (data) => set({ assets: data }),
      setReceivables: (data) => set({ receivables: data }),
      setLoans: (data) => set({ loans: data }),
      setTransactions: (data) => {
        // Calculate stats based on transactions
        let income = 0;
        let expense = 0;
        
        const inflowTypes = ['Pemasukan', 'Pelunasan Piutang', 'Penerimaan Pinjaman', 'Jual Aset'];
        const outflowTypes = ['Pengeluaran', 'Pemberian Piutang', 'Pembayaran Pinjaman', 'Beli Aset'];

        data.forEach(t => {
          if (inflowTypes.includes(t.type)) income += t.nominal;
          if (outflowTypes.includes(t.type)) expense += t.nominal;
        });
        set({ transactions: data, stats: { income, expense } });
      },
      setAvailablePeriods: (data) => set({ availablePeriods: data }),

      setLoggedIn: (val, uid) => set({ isLoggedIn: val, userId: uid || null }),

      togglePrivacyMode: () => {
        set((state) => ({ privacyMode: !state.privacyMode }));
        const { userId, privacyMode } = useFinanceStore.getState();
        if (userId) firebaseService.updateUserSettings(userId, { privacyMode });
      },

      setSessionTimeout: (val) => {
        set({ sessionTimeout: val });
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateUserSettings(userId, { sessionTimeout: val });
      },

      setCurrentDate: (year, month) => set({ currentYear: year, currentMonth: month }),

      showToast: (message, type) => set((state) => {
        const id = Date.now().toString();
        return { toasts: [...state.toasts, { id, message, type }] };
      }),

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      setOnlineStatus: (status) => set({ isOnline: status }),
      
      setLoading: (status) => set({ isLoading: status }),
      
      toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      addTransaction: async (data) => {
        const state = useFinanceStore.getState();
        const { type, nominal, posAsal, posTujuan, relatedId, date, notes, profitOrLoss } = data;
        const transactionDate = date || new Date().toISOString();
        const d = new Date(transactionDate);
        const year = d.getFullYear().toString();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        
        const newTransaction = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type,
          posAsal,
          posTujuan,
          nominal,
          relatedId,
          date: transactionDate,
          notes,
          profitOrLoss
        };

        if (state.userId) {
          // Push to Firebase first
          await firebaseService.addTransaction(state.userId, year, month, newTransaction);
          // Also update available periods
          const currentPeriods = state.availablePeriods[year] || [];
          if (!currentPeriods.includes(month)) {
            const updatedPeriods = {
              ...state.availablePeriods,
              [year]: [...currentPeriods, month].sort()
            };
            await firebaseService.updateAvailablePeriods(state.userId, updatedPeriods);
          }
        }

        set((state) => {
          const newState = {
            stats: { ...state.stats },
            cashPositions: state.cashPositions.map(p => ({ ...p })),
            transactions: [...state.transactions],
            receivables: state.receivables.map(r => ({ ...r })),
            loans: state.loans.map(l => ({ ...l })),
            assets: state.assets.map(a => ({ ...a }))
          };

          // 1. Update Stats (only if it matches current month being viewed)
          if (parseInt(year) === state.currentYear && parseInt(month) === state.currentMonth) {
            const inflowTypes = ['Pemasukan', 'Pelunasan Piutang', 'Penerimaan Pinjaman', 'Jual Aset'];
            const outflowTypes = ['Pengeluaran', 'Pemberian Piutang', 'Pembayaran Pinjaman', 'Beli Aset'];

            if (inflowTypes.includes(type)) newState.stats.income += nominal;
            if (outflowTypes.includes(type)) newState.stats.expense += nominal;
          }

          // 2. Update Cash Positions
          // Decrease from posAsal if it's a cash position
          const asalIndex = newState.cashPositions.findIndex(p => p.name === posAsal);
          if (asalIndex !== -1) {
            newState.cashPositions[asalIndex].balance -= nominal;
          }

          // Increase to posTujuan if it's a cash position
          const tujuanIndex = newState.cashPositions.findIndex(p => p.name === posTujuan);
          if (tujuanIndex !== -1) {
            newState.cashPositions[tujuanIndex].balance += nominal;
          }

          // 3. Update Related Entities
          if (relatedId) {
            if (type === 'Pemberian Piutang') {
              const rIndex = newState.receivables.findIndex(r => r.id === relatedId);
              if (rIndex !== -1) newState.receivables[rIndex].amount += nominal;
            } else if (type === 'Pelunasan Piutang') {
              const rIndex = newState.receivables.findIndex(r => r.id === relatedId);
              if (rIndex !== -1) newState.receivables[rIndex].amount -= nominal;
            } else if (type === 'Penerimaan Pinjaman') {
              const lIndex = newState.loans.findIndex(l => l.id === relatedId);
              if (lIndex !== -1) newState.loans[lIndex].amount += nominal;
            } else if (type === 'Pembayaran Pinjaman') {
              const lIndex = newState.loans.findIndex(l => l.id === relatedId);
              if (lIndex !== -1) newState.loans[lIndex].amount -= nominal;
            } else if (type === 'Beli Aset') {
              const aIndex = newState.assets.findIndex(a => a.id === relatedId);
              if (aIndex !== -1) newState.assets[aIndex].value += nominal;
            } else if (type === 'Jual Aset') {
              const aIndex = newState.assets.findIndex(a => a.id === relatedId);
              if (aIndex !== -1) {
                const decreaseAmount = profitOrLoss !== undefined ? nominal - profitOrLoss : nominal;
                newState.assets[aIndex].value -= decreaseAmount;
              }
            }
          }

          // 4. Record Transaction (only if it matches current month being viewed)
          if (parseInt(year) === state.currentYear && parseInt(month) === state.currentMonth) {
            // Check if it already exists to avoid duplicates from listener
            const exists = newState.transactions.some(t => t.id === newTransaction.id);
            if (!exists) {
              newState.transactions.push(newTransaction);
            }
          }

          return newState;
        });

        // Explicitly sync the updated balances to Firebase to avoid race conditions
        // with the automatic sync listener which might be blocked by isSyncingFromFirebase
        const finalState = useFinanceStore.getState();
        if (finalState.userId) {
          finalState.setIsSyncingToFirebase(true);
          try {
            await firebaseService.syncBalances(finalState.userId, finalState);
          } finally {
            setTimeout(() => {
              useFinanceStore.getState().setIsSyncingToFirebase(false);
            }, 1000);
          }
        }
      },

      addCashPosition: (name, type = 'bank') => {
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newData = { id, name, balance: 0, type, isActive: true };
        set((state) => ({ cashPositions: [...state.cashPositions, newData] }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.addCashPosition(userId, newData);
      },

      deleteCashPosition: (id) => {
        set((state) => ({ cashPositions: state.cashPositions.filter(p => p.id !== id) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.deleteCashPosition(userId, id);
      },

      editCashPosition: (id, newName) => {
        set((state) => ({ cashPositions: state.cashPositions.map(p => p.id === id ? { ...p, name: newName } : p) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateCashPosition(userId, id, { name: newName });
      },

      toggleCashPositionStatus: (id, isActive) => {
        set((state) => ({ cashPositions: state.cashPositions.map(p => p.id === id ? { ...p, isActive } : p) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateCashPosition(userId, id, { isActive });
      },

      setMainWallet: (id) => {
        set({ mainWalletId: id });
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateUserSettings(userId, { mainWalletId: id });
      },

      addAsset: (name, type, subType) => {
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newData = { id, name, value: 0, type, subType, isActive: true };
        set((state) => ({ assets: [...state.assets, newData] }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.addAsset(userId, newData);
      },

      deleteAsset: (id) => {
        set((state) => ({ assets: state.assets.filter(a => a.id !== id) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.deleteAsset(userId, id);
      },

      editAsset: (id, newName) => {
        set((state) => ({ assets: state.assets.map(a => a.id === id ? { ...a, name: newName } : a) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateAsset(userId, id, { name: newName });
      },

      toggleAssetStatus: (id, isActive) => {
        set((state) => ({ assets: state.assets.map(a => a.id === id ? { ...a, isActive } : a) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateAsset(userId, id, { isActive });
      },

      updateAssetValue: (name) => {
        set((state) => {
          const newState = {
            assets: state.assets.map(a => ({ ...a }))
          };
          const assetIndex = newState.assets.findIndex(a => a.name === name);
          if (assetIndex !== -1) {
            const increase = 1 + (Math.random() * 0.04 + 0.01);
            newState.assets[assetIndex].value = Math.round(newState.assets[assetIndex].value * increase);
            
            // Sync to firebase
            const { userId } = useFinanceStore.getState();
            if (userId) {
              firebaseService.updateAsset(userId, newState.assets[assetIndex].id, { value: newState.assets[assetIndex].value });
            }
          }
          return newState;
        });
      },

      updateCategoryLimit: (type, newLimit) => {
        set((state) => ({
          receivableCategories: state.receivableCategories.map(c => c.type === type ? { ...c, limit: newLimit } : c)
        }));
        const { userId, receivableCategories } = useFinanceStore.getState();
        if (userId) firebaseService.updateReceivableCategories(userId, receivableCategories);
      },

      addReceivable: (name, type) => {
        set((state) => {
          if (state.receivables.some(r => r.name.toLowerCase() === name.toLowerCase())) {
            return state;
          }
          const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const newData = { id, name, type, amount: 0, isActive: true };
          
          const { userId } = useFinanceStore.getState();
          if (userId) firebaseService.addReceivable(userId, newData);
          
          return {
            receivables: [
              ...state.receivables,
              newData
            ]
          };
        });
      },

      deleteReceivable: (id) => {
        set((state) => ({ receivables: state.receivables.filter(r => r.id !== id) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.deleteReceivable(userId, id);
      },

      toggleReceivableStatus: (id, isActive) => {
        set((state) => ({ receivables: state.receivables.map(r => r.id === id ? { ...r, isActive } : r) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateReceivable(userId, id, { isActive });
      },

      addLoan: (data, targetCashId) => {
        set((state) => {
          const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const newData = { ...data, id, isActive: true };
          const newLoans = [...state.loans, newData];

          let newCashPositions = state.cashPositions;
          if (targetCashId) {
            newCashPositions = state.cashPositions.map(p => 
              p.id === targetCashId ? { ...p, balance: p.balance + data.amount } : p
            );
          }

          const { userId } = useFinanceStore.getState();
          if (userId) {
            firebaseService.addLoan(userId, newData);
            if (targetCashId) {
              const updatedCash = newCashPositions.find(p => p.id === targetCashId);
              if (updatedCash) firebaseService.updateCashPosition(userId, targetCashId, { balance: updatedCash.balance });
            }
          }

          return {
            loans: newLoans,
            cashPositions: newCashPositions
          };
        });
      },

      deleteLoan: (id) => {
        set((state) => ({ loans: state.loans.filter(l => l.id !== id) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.deleteLoan(userId, id);
      },

      toggleLoanStatus: (id, isActive) => {
        set((state) => ({ loans: state.loans.map(l => l.id === id ? { ...l, isActive } : l) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateLoan(userId, id, { isActive });
      },

      updateLoanAmount: (id, newAmount) => {
        set((state) => ({ loans: state.loans.map(l => l.id === id ? { ...l, amount: newAmount } : l) }));
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateLoan(userId, id, { amount: newAmount });
      },

      setThreshold: (val) => {
        set({ threshold: val });
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateUserSettings(userId, { threshold: val });
      },

      setThresholdCalculator: (cost, condition) => {
        set({ monthlyLivingCost: cost, livingCondition: condition });
        const { userId } = useFinanceStore.getState();
        if (userId) firebaseService.updateUserSettings(userId, { monthlyLivingCost: cost, livingCondition: condition });
      },

      logout: () => {
        set({ isLoggedIn: false, userId: null });
        import('./firebase').then(({ auth }) => {
          import('firebase/auth').then(({ signOut }) => {
            signOut(auth);
          });
        });
      },

      resetData: () => set({
        threshold: 0,
        monthlyLivingCost: 0,
        livingCondition: 'parents_no_demands',
        mainWalletId: '',
        cashPositions: [],
        stats: { income: 0, expense: 0 },
        receivableCategories: [
          { type: 'B2B', limit: 0 },
          { type: 'Keluarga', limit: 0 },
          { type: 'Rekan Kerja', limit: 0 },
          { type: 'Ikut Transaksi', limit: 0 },
        ],
        receivables: [],
        loans: [],
        assets: [],
        transactions: [],
        availablePeriods: {},
      }),
    }),
    {
      name: 'sleepwell-finance-storage',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
