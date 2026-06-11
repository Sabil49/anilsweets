import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, theme } from '../constants/theme';
import { ScreenHeader } from '../components/Header';
import CartItemComponent from '../components/CartItem';
import PrimaryButton from '../components/PrimaryButton';
import { useCart } from '../constants/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems, totalItems, subtotal, deliveryFee, taxes, total } = useCart();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ScreenHeader title="Your Cart" subtitle="Anil Sweets Corner" onBack={handleBack} />
        <View style={[styles.emptyContent, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}> 
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some sweets to get started!</Text>
          <PrimaryButton
            title="Browse Sweets"
            onPress={() => router.push('/')}
            style={{ marginTop: theme.spacing.xl, paddingHorizontal: theme.spacing.xxl }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Your Cart"
        subtitle="Anil Sweets Corner"
        onBack={handleBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.lg * 11 + insets.bottom }}
      >
        {/* Cart Items */}
        <View style={{ marginTop: theme.spacing.xs }}>
          {cartItems.map((item) => (
            <CartItemComponent key={item.id} item={item} />
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Price Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWrap}>
              <Ionicons name="bag-outline" size={14} color={Colors.muted} />
              <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            </View>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWrap}>
              <Ionicons name="car-outline" size={14} color={Colors.muted} />
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
            </View>
            <View style={styles.deliveryWrap}>
              {deliveryFee === 0 && (
                <Text style={styles.originalDelivery}>₹40</Text>
              )}
              <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeDelivery]}>
                {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWrap}>
              <Ionicons name="receipt-outline" size={14} color={Colors.muted} />
              <Text style={styles.summaryLabel}>Taxes & Charges</Text>
            </View>
            <Text style={styles.summaryValue}>₹{taxes}</Text>
          </View>

          {deliveryFee === 0 && (
            <View style={styles.savingsBanner}>
              <Ionicons name="pricetag-outline" size={14} color="#16A34A" />
              <Text style={styles.savingsBannerText}>You're saving on this order!</Text>
              <Text style={styles.savingsAmount}>₹40</Text>
            </View>
          )}

          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <View>
              <Text style={styles.totalValue}>₹{total}</Text>
              <Text style={styles.inclTax}>Incl. all taxes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) }]}> 
        <PrimaryButton title="Proceed to Checkout" onPress={() => router.push('/checkout')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.card,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: Radius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
    minWidth: 0,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.muted,
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 64,
    textAlign: 'right',
  },
  deliveryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  originalDelivery: {
    fontSize: 11,
    color: Colors.muted,
    textDecorationLine: 'line-through',
    marginRight: theme.spacing.xxs,
  },
  freeDelivery: {
    color: Colors.success,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: Radius.chip,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginVertical: theme.spacing.sm,
    gap: theme.spacing.xs - 2,
  },
  savingsBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#16A34A',
  },
  savingsAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'right',
  },
  inclTax: {
    fontSize: 11,
    color: Colors.muted,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
