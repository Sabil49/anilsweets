import { StatusBar } from 'expo-status-bar';
import ProductDetailScreen from './ProductDetailScreen';
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ProductDetail() {
  const { product } = useLocalSearchParams();

  return (
    <ScreenWrapper>
      <StatusBar style="dark" backgroundColor="#FFF8F0" />
      <ProductDetailScreen />
    </ScreenWrapper>
  );
}
