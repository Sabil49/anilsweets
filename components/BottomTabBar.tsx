import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '../constants/theme';
import { useCart } from '../constants/CartContext';

interface Tab {
  key: string;
  label: string;
  icon: string;
  activeIcon: string;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs: Tab[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'categories', label: 'Categories', icon: 'help-circle-outline', activeIcon: 'help-circle' },
  { key: 'cart', label: 'Cart', icon: 'bag-outline', activeIcon: 'bag' },
  { key: 'orders', label: 'Orders', icon: 'document-text-outline', activeIcon: 'document-text' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const { totalItems } = useCart();

  const router = useRouter();

  const navigateTab = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'categories') router.push('/product-list');
    else if (tab === 'cart') router.push('/cart');
    else if (tab === 'orders') router.push('/order-tracking');
    else if (tab === 'profile') router.push('/profile');
    onTabPress(tab);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const isCart = tab.key === 'cart';

        if (isCart) {
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => navigateTab(tab.key)}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <View style={styles.cartCenter}>
                <Ionicons name={isActive ? (tab.activeIcon as any) : (tab.icon as any)} size={24} color="#fff" />
                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => navigateTab(tab.key)}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
              size={22}
              color={isActive ? Colors.primary : Colors.muted}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.muted,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  cartCenter: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
