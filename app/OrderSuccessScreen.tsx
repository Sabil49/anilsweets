import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius, theme } from '../constants/theme';
import PrimaryButton from '../components/PrimaryButton';

const ORDER_ID = '#ASC-20847';

const confettiColors = ['#FF6B00', '#22C55E', '#FBBF24', '#EC4899', '#8B5CF6'];

interface ConfettiDotProps {
  color: string;
  style: any;
}

function ConfettiDot({ color, style }: ConfettiDotProps) {
  return <View style={[styles.confettiDot, { backgroundColor: color }, style]} />;
}

const nextSteps = [
  {
    icon: 'checkmark',
    bg: Colors.success,
    title: 'Order Confirmed',
    sub: 'Your order has been successfully confirmed',
  },
  {
    icon: 'storefront',
    bg: Colors.primary,
    title: 'Order is being prepared',
    sub: 'Freshly made with love at our store',
  },
  {
    icon: 'bag',
    bg: '#FBBF24',
    title: 'Ready for pickup / delivery',
    sub: 'Come collect or we\'ll bring it to you',
  },
];

const activeStepIndex = 0;

type RootStackParamList = {
  OrderSuccess: undefined;
  Home: undefined;
};

interface OrderSuccessScreenProps {
  onFinish?: () => void;
}

export default function OrderSuccessScreen({ onFinish }: OrderSuccessScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = typeof params.orderId === 'string' ? params.orderId : undefined;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.spacing.xl * 5 }}>
        {/* Confetti dots */}
        <ConfettiDot color="#FF6B00" style={{ top: 60, left: 30 }} />
        <ConfettiDot color="#FBBF24" style={{ top: 80, left: 80 }} />
        <ConfettiDot color="#22C55E" style={{ top: 50, right: 80 }} />
        <ConfettiDot color="#EC4899" style={{ top: 90, right: 30 }} />
        <ConfettiDot color="#8B5CF6" style={{ top: 40, left: '45%' }} />
        <ConfettiDot color="#FBBF24" style={{ top: 120, right: 110 }} />
        <ConfettiDot color="#FF6B00" style={{ top: 110, left: 140 }} />

        {/* Success Icon */}
        <View style={styles.successSection}>
          <Animated.View
            style={[styles.successRing, { transform: [{ scale: scaleAnim }, { translateY: bounceAnim }] }]}
          >
            <View style={styles.successInner}>
              <Ionicons name="checkmark" size={60} color="#fff" />
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successSub}>Thank you for your order</Text>
          </Animated.View>
        </View>

        {/* Order ID */}
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <View style={styles.orderIdWrap}>
            <Text style={styles.orderId}>{orderId ?? ORDER_ID}</Text>
            <TouchableOpacity>
              <Ionicons name="copy-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsTitle}>What's Next?</Text>
          {nextSteps.map((step, index) => {
            const isActive = index === activeStepIndex;
            return (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepPoint}>
                  <View
                    style={[
                      styles.stepIcon,
                      { backgroundColor: isActive ? step.bg : Colors.border },
                    ]}
                  >
                    <Ionicons
                      name={step.icon as any}
                      size={20}
                      color={isActive ? '#fff' : Colors.muted}
                    />
                  </View>
                  {index < nextSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        { backgroundColor: Colors.border },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepItemTitle,
                      !isActive && styles.stepItemTitleInactive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepItemSub,
                      !isActive && styles.stepItemSubInactive,
                    ]}
                  >
                    {step.sub}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaLabel}>You can track and manage your order in the app</Text>
          <PrimaryButton
            title="Continue Shopping"
            onPress={() => router.push('/')}
            style={{ marginBottom: theme.spacing.md }}
          />
          <PrimaryButton
            title="View Your Orders"
            onPress={() => router.push('/order-tracking')}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  successSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  successRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  successInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  successSub: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  orderIdCard: {
    backgroundColor: Colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: Radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  orderIdLabel: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  orderIdWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1,
  },
  stepsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: theme.spacing.md,
  },
  stepItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: theme.spacing.md,
  },
  stepPoint: {
    width: 50,
    alignItems: 'center' as const,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  stepContent: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  stepItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  stepItemTitleInactive: {
    color: Colors.muted,
  },
  stepItemSub: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: theme.spacing.xs,
  },
  stepItemSubInactive: {
    color: '#B0B0B0',
  },
  stepLine: {
    width: 2,
    height: 60,
    backgroundColor: Colors.border,
  },
  confettiDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ctaSection: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  ctaLabel: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});
