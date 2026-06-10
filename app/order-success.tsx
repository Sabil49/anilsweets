import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import OrderSuccessScreen from './OrderSuccessScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function OrderSuccess() {
  const [finished, setFinished] = useState(false);

  return (
    <ScreenWrapper>
      <StatusBar style="dark" backgroundColor="#FFF8F0" />
      <OrderSuccessScreen onFinish={() => setFinished(true)} />
    </ScreenWrapper>
  );
}
