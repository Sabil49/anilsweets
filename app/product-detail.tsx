import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import ProductDetailScreen from './ProductDetailScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ProductDetail() {
  const { product } = useLocalSearchParams();

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <ProductDetailScreen />
    </ScreenWrapper>
  );
}
