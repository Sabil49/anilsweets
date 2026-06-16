import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';

import { CartProvider } from './constants/CartContext';
import { AuthProvider, useAuth } from './constants/AuthContext';
import { OrderProvider } from './constants/OrderContext';
import { theme } from './constants/theme';

import SplashScreen from './app/SplashScreen';
import HomeScreen from './app/HomeScreen';
import ProductListScreen from './app/ProductListScreen';
import ProductDetailScreen from './app/ProductDetailScreen';
import CartScreen from './app/CartScreen';
import CheckoutScreen from './app/CheckoutScreen';
import OrderSuccessScreen from './app/OrderSuccessScreen';
import { LoginScreen } from './app/auth/login';
import { RegisterScreen } from './app/auth/register';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <StatusBar style="dark" />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
