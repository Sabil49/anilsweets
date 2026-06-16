import { StatusBar } from 'expo-status-bar';
import CheckoutScreen from './CheckoutScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Checkout() {
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <CheckoutScreen />
    </ScreenWrapper>
  );
}
