import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// Firebase is initialized automatically with native configuration
// The config is set via google-services.json (Android) and GoogleService-Info.plist (iOS)

const app = getApp();
export const authInstance = getAuth(app);
export const db = getFirestore(app);

// Dodo payment configuration
export const DODO_CONFIG = {
  testSecret: 'UqHBJ0E-caVpuaaB.rFBvTIMQxrgUibcxnMrkOA4A8iHbZM6ijXK_t8LNCl8xvMm-',
  liveSecret: 'ZK1dKyRrkOzR5TKH.Zg2R_uU8mApW4x2sOTPtn1RntFU6EVVPrmFi-ZEw-XwQOQii',
  webhookKey: 'whsec_VAs0NPSapLuwBIuXn2TNvCJtV5EVHK3F',
  productId: 'pdt_0NXgG1Abo7Esjd8sBznXB',
  environment: 'live',
};
