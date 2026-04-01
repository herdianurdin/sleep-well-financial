import { ref, set, push, onValue, update, remove, get } from 'firebase/database';
import { db } from './firebase';

// Helper to remove undefined values recursively
const cleanData = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(cleanData);
  if (typeof obj !== 'object') return obj;
  
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, cleanData(v)])
  );
};

export const firebaseService = {
  // --- Users ---
  initUser: async (userId: string, initialData: any) => {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, cleanData({
        settings: {
          threshold: initialData.threshold || 0,
          monthlyLivingCost: initialData.monthlyLivingCost || 0,
          livingCondition: initialData.livingCondition || 'parents_no_demands',
          mainWalletId: initialData.mainWalletId || '',
          privacyMode: initialData.privacyMode || false,
          sessionTimeout: initialData.sessionTimeout || '30 Menit',
        },
        receivableCategories: initialData.receivableCategories || [
          { type: 'B2B', limit: 0 },
          { type: 'Keluarga', limit: 0 },
          { type: 'Rekan Kerja', limit: 0 },
          { type: 'Ikut Transaksi', limit: 0 },
        ],
        createdAt: Date.now(),
      }));
    }
  },

  updateUserSettings: async (userId: string, settings: any) => {
    const settingsRef = ref(db, `users/${userId}/settings`);
    await update(settingsRef, cleanData(settings));
  },

  updateReceivableCategories: async (userId: string, categories: any) => {
    const categoriesRef = ref(db, `users/${userId}/receivableCategories`);
    await set(categoriesRef, cleanData(categories));
  },

  // --- Cash Positions ---
  addCashPosition: async (userId: string, data: any) => {
    const itemRef = ref(db, `cashPositions/${userId}/${data.id}`);
    await set(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
    return data.id;
  },
  updateCashPosition: async (userId: string, cashId: string, data: any) => {
    const itemRef = ref(db, `cashPositions/${userId}/${cashId}`);
    await update(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
  },
  deleteCashPosition: async (userId: string, cashId: string) => {
    const itemRef = ref(db, `cashPositions/${userId}/${cashId}`);
    await remove(itemRef);
  },

  // --- Assets ---
  addAsset: async (userId: string, data: any) => {
    const itemRef = ref(db, `assets/${userId}/${data.id}`);
    await set(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
    return data.id;
  },
  updateAsset: async (userId: string, assetId: string, data: any) => {
    const itemRef = ref(db, `assets/${userId}/${assetId}`);
    await update(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
  },
  deleteAsset: async (userId: string, assetId: string) => {
    const itemRef = ref(db, `assets/${userId}/${assetId}`);
    await remove(itemRef);
  },

  // --- Receivables ---
  addReceivable: async (userId: string, data: any) => {
    const itemRef = ref(db, `receivables/${userId}/${data.id}`);
    await set(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
    return data.id;
  },
  updateReceivable: async (userId: string, receivableId: string, data: any) => {
    const itemRef = ref(db, `receivables/${userId}/${receivableId}`);
    await update(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
  },
  deleteReceivable: async (userId: string, receivableId: string) => {
    const itemRef = ref(db, `receivables/${userId}/${receivableId}`);
    await remove(itemRef);
  },

  // --- Loans ---
  addLoan: async (userId: string, data: any) => {
    const itemRef = ref(db, `loans/${userId}/${data.id}`);
    await set(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
    return data.id;
  },
  updateLoan: async (userId: string, loanId: string, data: any) => {
    const itemRef = ref(db, `loans/${userId}/${loanId}`);
    await update(itemRef, cleanData({ ...data, updatedAt: Date.now() }));
  },
  deleteLoan: async (userId: string, loanId: string) => {
    const itemRef = ref(db, `loans/${userId}/${loanId}`);
    await remove(itemRef);
  },

  // --- Transactions ---
  addTransaction: async (userId: string, year: string, month: string, data: any) => {
    const itemRef = ref(db, `transactions/${userId}/${year}/${month}/${data.id}`);
    await set(itemRef, cleanData({ ...data, timestamp: Date.now() }));
    return data.id;
  },

  updateAvailablePeriods: async (userId: string, periods: any) => {
    const periodsRef = ref(db, `users/${userId}/availablePeriods`);
    await set(periodsRef, cleanData(periods));
  },

  wipeAllData: async (userId: string) => {
    const updates: any = {};
    updates[`users/${userId}`] = null;
    updates[`cashPositions/${userId}`] = null;
    updates[`assets/${userId}`] = null;
    updates[`receivables/${userId}`] = null;
    updates[`loans/${userId}`] = null;
    updates[`transactions/${userId}`] = null;
    
    await update(ref(db), updates);
  },

  syncBalances: async (userId: string, state: any) => {
    const updates: any = {};
    
    const toObject = (arr: any[]) => {
      if (!arr || arr.length === 0) return null;
      return arr.reduce((acc, item) => {
        acc[item.id] = cleanData(item);
        return acc;
      }, {});
    };

    updates[`cashPositions/${userId}`] = toObject(state.cashPositions);
    updates[`assets/${userId}`] = toObject(state.assets);
    updates[`receivables/${userId}`] = toObject(state.receivables);
    updates[`loans/${userId}`] = toObject(state.loans);

    await update(ref(db), updates);
  },

  // --- Sync Listeners ---
  syncFullState: async (userId: string, state: any) => {
    const updates: any = {};
    
    updates[`users/${userId}/settings`] = cleanData({
      threshold: state.threshold,
      monthlyLivingCost: state.monthlyLivingCost,
      livingCondition: state.livingCondition,
      mainWalletId: state.mainWalletId,
      privacyMode: state.privacyMode,
      sessionTimeout: state.sessionTimeout,
    });
    updates[`users/${userId}/receivableCategories`] = cleanData(state.receivableCategories);
    
    // Convert arrays to objects for Firebase
    const toObject = (arr: any[]) => {
      if (!arr || arr.length === 0) return null;
      return arr.reduce((acc, item) => {
        acc[item.id] = cleanData(item);
        return acc;
      }, {});
    };

    updates[`cashPositions/${userId}`] = toObject(state.cashPositions);
    updates[`assets/${userId}`] = toObject(state.assets);
    updates[`receivables/${userId}`] = toObject(state.receivables);
    updates[`loans/${userId}`] = toObject(state.loans);
    updates[`users/${userId}/availablePeriods`] = cleanData(state.availablePeriods);
    
    // Sync transactions with bucketing
    if (state.transactions && state.transactions.length > 0) {
      state.transactions.forEach((t: any) => {
        const d = new Date(t.date);
        const year = d.getFullYear().toString();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        updates[`transactions/${userId}/${year}/${month}/${t.id}`] = cleanData({
          ...t,
          timestamp: t.timestamp || Date.now()
        });
      });
    }

    await update(ref(db), updates);
  },

  listenToUserData: (userId: string, callback: (data: any) => void) => {
    const userRef = ref(db, `users/${userId}`);
    return onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  },
  listenToCashPositions: (userId: string, callback: (data: any[]) => void) => {
    const listRef = ref(db, `cashPositions/${userId}`);
    return onValue(listRef, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((child) => {
        data.push({ id: child.key, ...child.val() });
      });
      callback(data);
    });
  },
  listenToAssets: (userId: string, callback: (data: any[]) => void) => {
    const listRef = ref(db, `assets/${userId}`);
    return onValue(listRef, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((child) => {
        data.push({ id: child.key, ...child.val() });
      });
      callback(data);
    });
  },
  listenToReceivables: (userId: string, callback: (data: any[]) => void) => {
    const listRef = ref(db, `receivables/${userId}`);
    return onValue(listRef, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((child) => {
        data.push({ id: child.key, ...child.val() });
      });
      callback(data);
    });
  },
  listenToLoans: (userId: string, callback: (data: any[]) => void) => {
    const listRef = ref(db, `loans/${userId}`);
    return onValue(listRef, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((child) => {
        data.push({ id: child.key, ...child.val() });
      });
      callback(data);
    });
  },
  listenToTransactions: (userId: string, year: string, month: string, callback: (data: any[]) => void) => {
    const listRef = ref(db, `transactions/${userId}/${year}/${month}`);
    return onValue(listRef, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((child) => {
        data.push({ id: child.key, ...child.val() });
      });
      // Sort by timestamp descending
      data.sort((a, b) => b.timestamp - a.timestamp);
      callback(data);
    });
  },
  reconstructAvailablePeriods: async (userId: string) => {
    const txRef = ref(db, `transactions/${userId}`);
    const periodsRef = ref(db, `users/${userId}/availablePeriods`);
    
    try {
      const snapshot = await get(txRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reconstructed: { [year: string]: string[] } = {};
        
        Object.keys(data).forEach(year => {
          reconstructed[year] = Object.keys(data[year]).sort();
        });
        
        await set(periodsRef, reconstructed);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error reconstructing periods:", error);
      return false;
    }
  },

  listenToAvailablePeriods: (userId: string, callback: (data: any) => void) => {
    const periodsRef = ref(db, `users/${userId}/availablePeriods`);
    
    return onValue(periodsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback({});
      }
    });
  },
};
