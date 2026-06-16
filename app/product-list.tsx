import { StatusBar } from 'expo-status-bar';
import ProductListScreen from './ProductListScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ProductList() {
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <ProductListScreen />
    </ScreenWrapper>
  );
}
