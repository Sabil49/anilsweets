import { StatusBar } from 'expo-status-bar';
import CartScreen from './CartScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Cart() {
  return (
    <ScreenWrapper>
      <StatusBar style="dark" backgroundColor="#FFF8F0" />
      <CartScreen />
    </ScreenWrapper>
  );
}
