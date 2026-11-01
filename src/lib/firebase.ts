import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB24z1qA6FMYbF5JoMiGAWMDuwIDwzgU-k',
  authDomain: 'preptoplace-ef380.firebaseapp.com',
  projectId: 'preptoplace-ef380',
  storageBucket: 'preptoplace-ef380.firebasestorage.app',
  messagingSenderId: '896640559116',
  appId: '1:896640559116:web:71b6afb985e48fbf026629',
  measurementId: 'G-2KTFEG2QQ0'
};

// Initialize Firebase (reuse existing instance if already initialized)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);

// Initialize Analytics only when supported (async)
let analyticsPromise: Promise<any> | null = null;

export async function getAnalyticsInstance() {
  if (analyticsPromise) return analyticsPromise;
  
  if (await isSupported()) {
    analyticsPromise = Promise.resolve(getAnalytics(app));
  } else {
    analyticsPromise = Promise.resolve(null);
  }
  
  return analyticsPromise;
}

export default app;
