import { StatusBar } from 'expo-status-bar';
import HomeScreen from './HomeScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Index() {
  return (
    <ScreenWrapper>
      <StatusBar style="dark" backgroundColor="#FFF8F0" />
      <HomeScreen />
    </ScreenWrapper>
  );
}
