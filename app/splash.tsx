import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from './SplashScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Splash() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <SplashScreen onFinish={() => router.replace('/')} />
    </ScreenWrapper>
  );
}
