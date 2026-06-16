import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../store';
import { CartProvider } from '../constants/CartContext';
import { AuthProvider } from '../constants/AuthContext';
import { OrderProvider } from '../constants/OrderContext';
import { WishlistProvider } from '../constants/WishlistContext';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <WishlistProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right', 'bottom']}>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  />
                </SafeAreaView>
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
