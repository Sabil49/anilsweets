import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

// Auth Navigation
function AuthNavigator() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        animationEnabled: true,
      }}
    >
      {authMode === 'login' ? (
        <Stack.Screen
          name="Login"
          options={{ animationEnabled: false }}
        >
          {(props) => (
            <LoginScreen
              {...props}
              onNavigateToRegister={() => setAuthMode('register')}
              onLoginSuccess={() => setAuthMode('login')}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen
          name="Register"
          options={{ animationEnabled: false }}
        >
          {(props) => (
            <RegisterScreen
              {...props}
              onNavigateToLogin={() => setAuthMode('login')}
              onRegisterSuccess={() => setAuthMode('login')}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

// App Navigation
function AppNavigator() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator Component
function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <StatusBar style="dark" backgroundColor={theme.colors.background} />
            <RootNavigator />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
