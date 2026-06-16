import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { ScreenHeader } from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { useCart } from '../constants/CartContext';
import { useAuth } from '../constants/AuthContext';
import { useOrder } from '../constants/OrderContext';
import { PaymentScreen } from './payment';
import { OrderTrackingScreen } from './order-tracking';
import type { Order } from './order-tracking';

interface CheckoutErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, subtotal, deliveryFee, taxes, total, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { createOrder, currentOrder } = useOrder();

  const [name, setName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '');
  const [address, setAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: CheckoutErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!address.trim()) {
      newErrors.address = 'Please enter your delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to continue');
      router.push('/auth/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = async (orderId: string, paymentMethod: string) => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const order = await createOrder(
        orderItems,
        total,
        paymentMethod,
        address,
        user.uid
      );

      clearCart();
      setShowPayment(false);
      setShowOrderTracking(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to create order. Please try again.');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    setShowOrderTracking(false);
    router.push('/');
  };

  if (showOrderTracking && currentOrder) {
    return (
      <View style={styles.container}>
        <OrderTrackingScreen
          orders={[currentOrder]}
          selectedOrderId={currentOrder.id}
          onSelectOrder={() => {}}
          order={currentOrder}
          onGoHome={handleGoHome}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showPayment ? (
        <>
          <ScreenHeader
            title="Checkout"
            subtitle="Anil Sweets Corner"
            onBack={() => router.back()}
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>
            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes & Charges</Text>
                <Text style={styles.summaryValue}>₹{taxes.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowFinal]}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotal}>₹{total.toFixed(2)}</Text>
              </View>
            </View>


            {/* Your Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Details</Text>

              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, ...(errors.name ? [styles.inputError] : [])]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.muted}
                editable={!loading}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.phoneInputWrapper}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.phoneInput, ...(errors.phone ? [styles.inputError] : [])]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="9876543210"
                  placeholderTextColor={theme.colors.muted}
                  keyboardType="phone-pad"
                  editable={!loading}
                  maxLength={10}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <>
                <Text style={styles.fieldLabel}>Delivery Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    ...(errors.address ? [styles.inputError] : []),
                  ]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your complete delivery address"
                  placeholderTextColor={theme.colors.muted}
                  multiline
                  numberOfLines={3}
                  editable={!loading}
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </>
            </View>

            {/* Special Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                placeholder="Add any special requests or dietary preferences"
                placeholderTextColor={theme.colors.muted}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.proceedButton, loading && { opacity: 0.6 }]}
              onPress={handleProceedToPayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.card} />
              ) : (
                <>
                  <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
                  <MaterialCommunityIcons name="arrow-right" size={18} color={theme.colors.card} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <PaymentScreen
          cartTotal={subtotal}
          deliveryFee={deliveryFee}
          taxes={taxes}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPayment(false);
            setLoading(false);
          }}
        />
      )}

      {/* Order Tracking Modal */}
      <Modal
        visible={showOrderTracking && !!currentOrder}
        animationType="slide"
        onRequestClose={() => {}}
      >
        {currentOrder && (
          <OrderTrackingScreen
            orders={[currentOrder]}
            selectedOrderId={currentOrder.id}
            onSelectOrder={() => {}}
            order={currentOrder}
            onGoHome={handleGoHome}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  summaryCard: {
    backgroundColor: theme.colors.primaryLight,
    margin: theme.spacing.lg,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryRowFinal: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary + '40',
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  inputError: {
    borderColor: '#FF6B63',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  phoneInputWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
    marginLeft: theme.spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    paddingLeft: theme.spacing.md,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  toggleWrap: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.muted,
  },
  toggleActiveText: {
    color: theme.colors.card,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B63',
    marginTop: -theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  proceedButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.spacing.sm,
  },
  proceedButtonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
