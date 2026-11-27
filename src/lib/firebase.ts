import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDgABAcxpaG07buu3i9rNwFfd48A4v9q_k',
  authDomain: 'portfolio-e7dce.firebaseapp.com',
  projectId: 'portfolio-e7dce',
  storageBucket: 'portfolio-e7dce.firebasestorage.app',
  messagingSenderId: '612929399250',
  appId: '1:612929399250:web:8ad0219750f4a142fe800b',
  measurementId: 'G-3W8J7M3G1K',
};

export const ADMIN_EMAIL = 'kartavya9977@gmail.com';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
