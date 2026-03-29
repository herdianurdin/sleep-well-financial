import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCr9eqNkwlXUFvNDU-nAPWAIJzsm2unBoo",
  authDomain: "sleep-well-finance.firebaseapp.com",
  databaseURL: "https://sleep-well-finance-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sleep-well-finance",
  storageBucket: "sleep-well-finance.firebasestorage.app",
  messagingSenderId: "571520320992",
  appId: "1:571520320992:web:60245b3534f71eab251785"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
