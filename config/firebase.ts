import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Dodo payment configuration
export const DODO_CONFIG = {
  testSecret: 'UqHBJ0E-caVpuaaB.rFBvTIMQxrgUibcxnMrkOA4A8iHbZM6ijXK_t8LNCl8xvMm-',
  liveSecret: 'ZK1dKyRrkOzR5TKH.Zg2R_uU8mApW4x2sOTPtn1RntFU6EVVPrmFi-ZEw-XwQOQii',
  webhookKey: 'whsec_VAs0NPSapLuwBIuXn2TNvCJtV5EVHK3F',
  productId: 'pdt_0NXgG1Abo7Esjd8sBznXB',
  environment: 'live',
};
