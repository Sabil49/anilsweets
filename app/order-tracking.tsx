import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useOrder } from '../constants/OrderContext';

export interface Order {
  id: string;
  orderId: string;
  date: number;
  total: number;
  paymentMethod: string;
  status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  items: OrderItem[];
  deliveryAddress?: string;
  estimatedDelivery?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderTrackingScreenProps {
  order: Order;
  onGoHome: () => void;
}

const statusSteps = [
  { status: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' as const },
  { status: 'preparing', label: 'Preparing', icon: 'chef-hat' as const },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: 'truck-fast' as const },
  { status: 'delivered', label: 'Delivered', icon: 'home-circle' as const },
];

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ order, onGoHome }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const currentStepIndex_ = statusSteps.findIndex((s) => s.status === order.status);

  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < currentStepIndex_) return theme.colors.success;
    if (stepIndex === currentStepIndex_) return theme.colors.warning;
    return theme.colors.muted;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.lg }}>
        {/* Header */}
        <Text style={styles.header}>Order Tracking</Text>

        {/* Order Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderCardHeader}>
            <View>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderId}>{order.orderId}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' as const }}>
              <Text style={styles.orderLabel}>Amount</Text>
              <Text style={styles.amount}>₹{order.total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.orderCardDivider} />

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(order.date).toLocaleDateString('en-IN')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment:</Text>
              <Text style={styles.detailValue}>
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : order.paymentMethod === 'paytm'
                    ? 'Paytm UPI'
                    : 'UPI (Google Pay/PhonePe)'}
              </Text>
            </View>
            {order.estimatedDelivery && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Est. Delivery:</Text>
                <Text style={styles.detailValue}>
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Status Timeline */}
        <Text style={styles.sectionTitle}>Delivery Status</Text>
        <View style={styles.statusContainer}>
          {statusSteps.map((step, index) => (
            <View key={step.status} style={{ alignItems: 'center' as const }}>
              {/* Status Circle */}
              <View
                style={[
                  styles.statusCircle,
                  {
                    backgroundColor:
                      index <= currentStepIndex_
                        ? getStatusColor(index)
                        : theme.colors.background,
                    borderColor: getStatusColor(index),
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={step.icon}
                  size={24}
                  color={index <= currentStepIndex_ ? theme.colors.card : theme.colors.muted}
                />
              </View>

              {/* Connecting Line */}
              {index < statusSteps.length - 1 && (
                <View
                  style={[
                    styles.statusLine,
                    {
                      backgroundColor:
                        index < currentStepIndex_ ? theme.colors.success : theme.colors.border,
                    },
                  ]}
                />
              )}

              {/* Status Label */}
              <Text
                style={[
                  styles.statusLabel,
                  {
                    color:
                      index <= currentStepIndex_ ? theme.colors.primary : theme.colors.muted,
                  },
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Items Section */}
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.itemsCard}>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={theme.colors.primary}
                style={{ marginRight: theme.spacing.md }}
              />
              <Text style={styles.addressText}>{order.deliveryAddress}</Text>
            </View>
          </>
        )}

        {/* Contact Support */}
        <View style={styles.supportCard}>
          <MaterialCommunityIcons
            name="help-circle"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.supportText}>
            Need help? Contact our support team
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onGoHome}
        >
          <Text style={styles.continueButtonText}>
            {order.status === 'delivered' ? 'Order Again' : 'Continue Shopping'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function OrderTrackingRoute() {
  const router = useRouter();
  const { currentOrder } = useOrder();

  if (!currentOrder) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            No active order yet
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.radius.button,
            }}
            onPress={() => router.push('/')}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Browse Sweets</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return <OrderTrackingScreen order={currentOrder} onGoHome={() => router.push('/')} />;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  orderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  orderCardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  orderLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.success,
    marginTop: theme.spacing.xs,
  },
  orderCardDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  orderDetails: {
    gap: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  detailLabel: {
    fontSize: 13,
    color: theme.colors.muted,
    fontWeight: '600' as const,
  },
  detailValue: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500' as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
    position: 'relative' as const,
  },
  statusCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.card,
  },
  statusLine: {
    position: 'absolute' as const,
    height: 3,
    top: 28,
  },
  statusLabel: {
    fontSize: 11,
    marginTop: theme.spacing.sm,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
    maxWidth: 70,
  },
  itemsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  itemRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  itemQuantity: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  addressCard: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500' as const,
  },
  supportCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    gap: theme.spacing.md,
  },
  supportText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500' as const,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  continueButtonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});
