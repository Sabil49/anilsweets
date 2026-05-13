import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../constants/CartContext';
import { theme } from '../constants/theme';
import { DODO_CONFIG } from '../config/firebase';

interface PaymentScreenProps {
  cartTotal: number;
  deliveryFee: number;
  taxes: number;
  onPaymentSuccess: (orderId: string, paymentMethod: string) => void;
  onCancel: () => void;
}

type PaymentMethod = 'paytm' | 'upi' | 'dodo' | 'cod';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: any;
  details?: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'paytm',
    name: 'Paytm UPI',
    description: 'Open Paytm to complete the payment',
    icon: 'bank-transfer',
  },
  {
    id: 'upi',
    name: 'Google Pay / PhonePe',
    description: 'Pay using any UPI-enabled app',
    icon: 'qrcode-scan',
  },
  {
    id: 'dodo',
    name: 'Dodo Payment',
    description: 'Pay using Dodo payment system',
    icon: 'credit-card',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when the order is delivered',
    icon: 'cash',
  },
];

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  cartTotal,
  deliveryFee,
  taxes,
  onPaymentSuccess,
  onCancel,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);
    const total = cartTotal + deliveryFee + taxes;

  const getPaymentUrl = (method: PaymentMethod) => {
    const transactionRef = `ASC-${Date.now()}`;
    const amount = total.toFixed(2);
    const note = encodeURIComponent('Payment for Anil Sweets Corner order');
    const name = encodeURIComponent('Anil Sweets Corner');

    if (method === 'paytm') {
      const vpa = encodeURIComponent('anilsweets@paytm');
      return `upi://pay?pa=${vpa}&pn=${name}&tn=${note}&am=${amount}&cu=INR&tr=${transactionRef}`;
    }

    if (method === 'upi') {
      const vpa = encodeURIComponent('anilsweets@okaxis');
      return `upi://pay?pa=${vpa}&pn=${name}&tn=${note}&am=${amount}&cu=INR&tr=${transactionRef}`;
    }

    if (method === 'dodo') {
      const secret = DODO_CONFIG.environment === 'test' ? DODO_CONFIG.testSecret : DODO_CONFIG.liveSecret;
      const baseUrl = DODO_CONFIG.environment === 'test' 
        ? 'https://test.dodo-payment.com/pay' 
        : 'https://dodo-payment.com/pay';
      return `${baseUrl}?productId=${DODO_CONFIG.productId}&amount=${amount}&transactionRef=${transactionRef}&webhookKey=${DODO_CONFIG.webhookKey}&secret=${secret}`;
    }

    return '';
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setLoading(true);

      if (selectedPayment === 'cod') {
        const orderId = `ASC-${Date.now()}`;
        onPaymentSuccess(orderId, 'cod');
        return;
      }

      const url = getPaymentUrl(selectedPayment);
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert(
          'Payment App Not Found',
          'No UPI app is installed on your device. Please install Paytm, Google Pay, PhonePe or another UPI app.'
        );
        return;
      }

      await Linking.openURL(url);
      const orderId = `ASC-${Date.now()}`;
      onPaymentSuccess(orderId, selectedPayment);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.lg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.lg,
          }}
        >
          <Text style={styles.header}>Select Payment Method</Text>
          <TouchableOpacity onPress={onCancel} disabled={loading}>
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Order Total</Text>
          <Text style={styles.summaryAmount}>₹{total.toFixed(2)}</Text>

          <View style={styles.summaryBreakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal:</Text>
              <Text style={styles.breakdownAmount}>₹{cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Delivery Fee:</Text>
              <Text style={styles.breakdownAmount}>
                {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Taxes & Charges:</Text>
              <Text style={styles.breakdownAmount}>₹{taxes.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Options */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        <FlatList
          data={paymentOptions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.paymentOption,
                selectedPayment === item.id && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(item.id)}
              disabled={loading}
            >
              <View style={styles.paymentIconContainer}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={28}
                  color={selectedPayment === item.id ? theme.colors.primary : theme.colors.muted}
                />
              </View>

              <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                <Text style={styles.paymentName}>{item.name}</Text>
                <Text style={styles.paymentDescription}>{item.description}</Text>
              </View>

              <View
                style={[
                  styles.radioButton,
                  selectedPayment === item.id && styles.radioButtonSelected,
                ]}
              >
                {selectedPayment === item.id && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={theme.colors.card}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <MaterialCommunityIcons name="shield-check" size={18} color={theme.colors.primary} />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && { opacity: 0.6 }]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="lock-check" size={20} color={theme.colors.card} />
              <Text style={styles.payButtonText}>Pay ₹{total.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  summaryCard: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
    marginVertical: theme.spacing.sm,
  },
  summaryBreakdown: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + '30',
  },
  breakdownRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: theme.spacing.sm,
  },
  breakdownLabel: {
    fontSize: 13,
    color: theme.colors.primary,
  },
  breakdownAmount: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  paymentOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  paymentOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  paymentIconContainer: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.background,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  paymentDescription: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  radioButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  securityNotice: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  securityText: {
    fontSize: 12,
    color: theme.colors.primary,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  payButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
  },
  payButtonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});
