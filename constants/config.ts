import { Platform } from 'react-native';

import Constants from 'expo-constants';

const getHost = () => {
  const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const debuggerHost =
    (Constants.manifest as any)?.debuggerHost ||
    (Constants.manifest as any)?.hostUri ||
    '';
  const hostFromManifest = debuggerHost.split(':')[0];
  return hostFromManifest || defaultHost;
};

export const API_URL = `http://${getHost()}:3000`; // Update with your backend port if needed
