import { Platform } from 'react-native';

import Constants from 'expo-constants';

const LOCAL_API_PORT = 3000;
const DEFAULT_REMOTE_API_URL = 'https://anilsweetbackend.vercel.app';

const getHostFromConstants = () => {
  const manifest = (Constants.manifest as any) || {};
  const manifest2 = (Constants as any).manifest2 || {};
  const expoConfig = (Constants as any).expoConfig || {};

  const debuggerHost =
    manifest.debuggerHost ||
    manifest.hostUri ||
    manifest2.debuggerHost ||
    manifest2.hostUri ||
    expoConfig.debuggerHost ||
    expoConfig.hostUri ||
    '';

  const bundleUrl =
    manifest.bundleUrl || manifest2.bundleUrl || expoConfig.bundleUrl || '';
  const bundleHost = bundleUrl ? new URL(bundleUrl).hostname : '';

  return debuggerHost.split(':')[0] || bundleHost;
};

const getLocalApiUrl = () => {
  const hostFromConstants = getHostFromConstants();
  const host =
    Platform.OS === 'android' && !Constants.isDevice
      ? hostFromConstants === 'localhost' || hostFromConstants === '127.0.0.1'
        ? '10.0.2.2'
        : hostFromConstants
      : hostFromConstants || 'localhost';

  return `http://${host}:${LOCAL_API_PORT}`;
};

const getRemoteApiUrl = () => {
  const extra =
    (Constants.expoConfig as any)?.extra ||
    (Constants.manifest as any)?.extra ||
    {};

  return extra.API_URL || DEFAULT_REMOTE_API_URL;
};

const isExplicitEmulator = Constants.isDevice === false;
const hasResolvedLocalHost = !!getHostFromConstants();

export const API_URL = isExplicitEmulator && hasResolvedLocalHost
  ? getLocalApiUrl()
  : getRemoteApiUrl();
