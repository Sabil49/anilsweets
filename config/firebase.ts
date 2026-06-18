// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Dodo payment configuration
export const DODO_CONFIG = {
  testSecret: process.env.EXPO_PUBLIC_DODO_TEST_SECRET,
  liveSecret: process.env.EXPO_PUBLIC_DODO_LIVE_SECRET,
  webhookKey: process.env.EXPO_PUBLIC_DODO_WEBHOOK_KEY,
  productId: process.env.EXPO_PUBLIC_DODO_PRODUCT_ID,
  environment: process.env.EXPO_PUBLIC_DODO_ENVIRONMENT ?? 'test',
};
