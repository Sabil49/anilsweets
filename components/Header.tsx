import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, theme } from '../constants/theme';
import { useCart } from '../constants/CartContext';

interface HomeHeaderProps {
  onCartPress: () => void;
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  compact?: boolean;
}

export function HomeHeader({ onCartPress }: HomeHeaderProps) {
  const { totalItems } = useCart();

  return (
    <View style={styles.homeHeader}>
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <Ionicons name="storefront" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.logoTitle}>Anil Sweets</Text>
          <Text style={styles.logoSub}>Corner</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onCartPress} style={styles.cartBtn} activeOpacity={0.8}>
        <Ionicons name="bag-outline" size={22} color={Colors.text} />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function ScreenHeader({ title, subtitle, onBack, rightIcon, onRightPress, compact }: ScreenHeaderProps) {
  const { totalItems } = useCart();

  return (
    <View style={[styles.screenHeader, compact && styles.screenHeaderCompact]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.titleWrap}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
      </View>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightBtn} activeOpacity={0.8}>
          <Ionicons name={rightIcon as any} size={22} color={Colors.text} />
          {rightIcon === 'bag-outline' && totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
  },
  logoSub: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 16,
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  screenHeaderCompact: {
    paddingVertical: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  rightBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  placeholder: {
    width: 38,
    height: 38,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
  },
  screenSubtitle: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 16,
  },
});
