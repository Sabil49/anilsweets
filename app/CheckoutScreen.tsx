import { AddressCard } from "../components/checkout/AddressCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { API_URL } from "../constants/config";
import { COLORS, theme } from "../constants/theme";
import { useCart } from "../constants/CartContext";
import { useAuth } from "../constants/AuthContext";
import { useOrder } from "../constants/OrderContext";
import { useCreateOrderMutation } from "../store/services/ordersApi";
import { useGetAddressesQuery, type Address } from "../store/services/addressesApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { ScreenHeader } from "../components/Header";
import { getUserFriendlyErrorMessage } from "../constants/utils";

// helper to parse return URLs from the payment provider (web or custom scheme)
function extractOrderId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Handle dev-client wrapping: ?url=<original_url>
    const nested = parsed.searchParams.get("url");
    if (nested) return extractOrderId(decodeURIComponent(nested));
    const id =
      parsed.searchParams.get("orderId") ??
      parsed.searchParams.get("order_id");
    if (id) return id;
  } catch {}
  // Fallback for myzo:// custom scheme URLs
  const match = url.match(/[?&](?:orderId|order_id)=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems } = useCart();

  // Keep a ref copy of cartItems — even if Redux clears them after an error,
  // this ref lets us keep showing the screen instead of the blank empty-cart view.
  const cartItemsRef = useRef(cartItems);
  if (cartItems.length > 0) cartItemsRef.current = cartItems; // only update when non-empty

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [showingError, setShowingError] = useState(false); // prevents blank-screen flash

  const { userProfile, loading: authLoading, user } = useAuth();
  const { setCurrentOrder, addOrder } = useOrder();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: addressData, isLoading: addressQueryLoading } = useGetAddressesQuery(user?.uid ?? '', {
    skip: !user?.uid,
  });
  const redirectingRef = useRef(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/cart');
    }
  };

  const addresses: Address[] = addressData?.addresses ?? [];
  const addressesLoading = authLoading || addressQueryLoading;

  // If auth finished loading and there's no user, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login?next=/checkout' as any);
    }
  }, [authLoading, user, router]);

  // Decide which cart items to show — use ref fallback if Redux was cleared
  const displayItems = cartItems.length > 0 ? cartItems : cartItemsRef.current;

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const def =
        addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddress(def);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    console.log("[Checkout] Resolved API_URL:", API_URL);
    console.log("[Checkout] Device info:", { isDevice: Constants.isDevice, platform: Constants.platform?.android?.model || Constants.platform?.ios?.model || 'unknown' });
  }, []);

  // Deep link handler
  const handlePaymentReturn = (url: string) => {
    if (
      url.includes("checkout/success") ||
      url.includes("/return") ||
      url.includes("order-success") ||
      url.startsWith("anilsweets://") ||
      url.includes("error=")
    ) {
      if (redirectingRef.current) return;
      redirectingRef.current = true;
      setWebViewUrl(null);

      console.log("[Checkout] Deep link received:", url);

      if (
        url.includes("checkout/success") ||
        url.includes("/return") ||
        url.includes("order-success") ||
        url.startsWith("anilsweets://")
      ) {
        const orderId = extractOrderId(url);
        console.log("[Checkout] Extracted orderId:", orderId);

        if (orderId && orderId !== "" && orderId !== "success") {
          router.replace(`/order-success?orderId=${encodeURIComponent(orderId)}` as any);
        } else {
          console.warn("[Checkout] No valid orderId, staying on checkout");
          Alert.alert(
            "Payment Redirect Error",
            "We received a payment return URL but could not parse an order ID. Please check your orders or try again."
          );
          router.replace("/");
        }
        return;
      }

      if (url.includes("error=")) {
        const errorMatch = url.match(/[?&]error=([^&]+)/);
        const errorParam = errorMatch ? decodeURIComponent(errorMatch[1]) : "";
        const messages: Record<string, string> = {
          payment_failed: "Your payment was declined. Please try again.",
          payment_cancelled: "Payment was cancelled.",
          missing_order_id: "Something went wrong. Please contact support.",
          order_not_found: "Order not found. Please try again.",
        };
        Alert.alert(
          "Payment Issue",
          messages[errorParam] ?? "An unexpected error occurred.",
        );
      }
    }
  };

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => handlePaymentReturn(url);
    const sub = Linking.addEventListener("url", handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handlePaymentReturn(url);
    });
    return () => sub.remove();
  }, [router]);

  const subtotal = displayItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const buttonText = useMemo(
    () => `Continue to Payment · ${formatCurrency(total)}`,
    [total],
  );

  // ── Empty cart guard — ONLY shown when no error is active ─────────────────
  if (displayItems.length === 0 && !showingError) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="Checkout" onBack={() => router.back()} compact />
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={COLORS.espresso[300]} />
          <Typography variant="h3" style={{ marginTop: theme.spacing.lg }}>
            Your cart is empty
          </Typography>
          <Button
            style={{ marginTop: theme.spacing.xl, minWidth: 200 }}
            onPress={() => router.push("/(tabs)")}
          >
            Continue Shopping
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // ── Place order ───────────────────────────────────────────────────────────
  const proceedPlaceOrder = async () => {
    setInlineError(null);
    setShowingError(false);

    if (!selectedAddress) {
      Alert.alert("Address Required", "Please select a delivery address.");
      return;
    }

    const streetAddress =
      selectedAddress.address?.trim() ||
      selectedAddress.addressLine1?.trim() ||
      '';
    const postalCode =
      selectedAddress.zipCode?.trim() ||
      selectedAddress.pincode?.trim() ||
      '';
    const addressLines = [
      selectedAddress.fullName?.trim(),
      selectedAddress.phone?.trim()
        ? `Phone: ${selectedAddress.phone.trim()}`
        : '',
      [streetAddress, selectedAddress.addressLine2?.trim()]
        .filter(Boolean)
        .join(', '),
      [
        selectedAddress.city?.trim(),
        selectedAddress.state?.trim(),
        postalCode,
      ]
        .filter(Boolean)
        .join(', '),
    ].filter(Boolean);

    if (!streetAddress) {
      Alert.alert(
        "Address Incomplete",
        "Please update your delivery address before continuing.",
      );
      return;
    }

    setPaymentStarted(true);

    try {
      console.log("[Checkout] Starting order creation with address:", {
        id: selectedAddress.id,
        fullName: selectedAddress.fullName,
      });

      const result = await createOrder({
        addressId: selectedAddress.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          productName: item.name ?? item.product?.name ?? null,
          quantity: item.quantity,
          price: (item.price ?? item.product?.price ?? 0),
        })),
        paymentMethod: "dodo",
        userId: user?.uid, // Firebase user ID (may be undefined for guests)
        userName: userProfile?.displayName || user?.displayName || "Customer",
        userEmail: user?.email ?? undefined,
      }).unwrap();

      const backendStatus = String(result.order.status ?? 'PLACED').toLowerCase();
      const normalizedStatus = backendStatus === 'placed' ? 'confirmed' : backendStatus;
      const mappedCurrentOrder = {
        id: result.order.id,
        orderId: result.order.orderNumber ?? result.order.id,
        date: Date.now(),
        total: result.order.total ?? 0,
        paymentMethod: (result.order.paymentMethod ?? 'dodo').toLowerCase(),
        status: normalizedStatus as 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered',
        items: (result.order.items ?? []).map((item: any, index: number) => ({
          id: item.productId ? String(item.productId) : String(index),
          name: item.productName ?? item.productId ?? 'Item',
          quantity: item.quantity ?? 1,
          price: item.price ?? 0,
        })),
        deliveryAddress: addressLines.join('\n'),
        estimatedDelivery: Date.now() + 3 * 24 * 60 * 60 * 1000,
      };
      addOrder(mappedCurrentOrder);
      setCurrentOrder(mappedCurrentOrder);

      if (user?.uid) {
        const firestoreOrder = { ...mappedCurrentOrder };
        delete (firestoreOrder as any).id;
        try {
          await addDoc(collection(doc(db, 'users', user.uid), 'orders'), firestoreOrder);
          console.log('[Checkout] Order also saved to Firestore for user', user.uid);
        } catch (firestoreError) {
          console.warn('[Checkout] Failed to save order to Firestore:', firestoreError);
        }
      }

      console.log("[Checkout] Order created successfully:", result.order.id);
      console.log("[Checkout] Order response:", JSON.stringify(result, null, 2));
      console.log("[Checkout] Selected address:", selectedAddress);
      console.log("[Checkout] User ID:", user?.uid);
      console.log("[Checkout] Checkout request URL:", `${API_URL}/api/payments/dodo/create-checkout`);

      const response = await fetch(
        `${API_URL}/api/payments/dodo/create-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: result.order.id }),
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.error ?? "Failed to create checkout session");

      const checkoutUrl: string | undefined =
        data?.checkoutUrl ?? data?.checkout_url ?? data?.url;
      if (!checkoutUrl) throw new Error("No checkout URL returned from server");

      const canOpen = await Linking.canOpenURL(checkoutUrl);
      if (canOpen) {
        await Linking.openURL(checkoutUrl);
        return;
      }
      setWebViewUrl(checkoutUrl);
    } catch (err: any) {
      console.error("[Checkout] Error:", err);
      setPaymentStarted(false);

      const raw = getUserFriendlyErrorMessage(
        err?.data?.error ?? err,
        'Unable to start payment. Please try again.',
      );

      // Show inline for stock errors — keeps the user on this screen
      const isStock = /stock|insufficient|only has/i.test(raw);
      setInlineError(raw);
      setShowingError(true);

      if (!isStock) {
        // For non-stock errors, also show an alert
        Alert.alert("Payment Error", raw);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentStarted) return;

    // If still loading auth, do nothing
    if (authLoading) return;

    // If not signed in, redirect to login (preserves next)
    if (!user) {
      router.replace('/auth/login?next=/checkout' as any);
      return;
    }

    await proceedPlaceOrder();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* WebView modal */}
      <Modal
        visible={!!webViewUrl}
        animationType="slide"
        onRequestClose={() => setWebViewUrl(null)}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: COLORS.background }}
          edges={["top", "bottom"]}
        >
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Cancel Payment",
                  "Are you sure you want to cancel?",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes, Cancel",
                      style: "destructive",
                      onPress: () => {
                        setWebViewUrl(null);
                        setPaymentStarted(false);
                      },
                    },
                  ],
                )
              }
            >
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
            <Typography variant="h3">Secure Checkout</Typography>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={COLORS.espresso[500]}
            />
          </View>
          <WebView
            source={{ uri: webViewUrl! }}
            style={{ flex: 1 }}
            onShouldStartLoadWithRequest={(request) => {
              const url = request.url;
              if (
                url.startsWith("myzo://") ||
                url.startsWith("anilsweets://") ||
                url.includes("checkout/success") ||
                url.includes("/return") ||
                url.includes("order-success") ||
                url.includes("error=")
              ) {
                handlePaymentReturn(url);
                return false;
              }
              return true;
            }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color={COLORS.espresso[500]} />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>

      

      {/* Header */}
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: COLORS.background }}
      >
        <ScreenHeader title="Checkout" subtitle="Review & complete your order" onBack={handleBack} />
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* ── Inline error banner ── */}
        {inlineError && (
          <View style={styles.errorBanner}>
            <View style={styles.errorBannerRow}>
              <Ionicons name="alert-circle" size={18} color="#c0392b" />
              <Text style={styles.errorBannerText}>{inlineError}</Text>
            </View>
            <View style={styles.errorBannerActions}>
              <TouchableOpacity
                style={styles.errorBannerBtnOutline}
                onPress={() => {
                  setInlineError(null);
                  setShowingError(false);
                  router.back();
                }}
              >
                <Text style={styles.errorBannerBtnOutlineText}>
                  ← Go Back to Bag
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Delivery Address */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Delivery Address
          </Typography>
          {addressesLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.espresso[500]}
              style={{ paddingVertical: theme.spacing.lg }}
            />
          ) : addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddress?.id === address.id}
                onPress={() => setSelectedAddress(address)}
              />
            ))
          ) : (
            <Typography
              variant="caption"
              style={{ color: COLORS.text.muted, marginBottom: theme.spacing.md }}
            >
              No saved addresses yet
            </Typography>
          )}
          <Button
            variant="secondary"
            style={{ marginTop: theme.spacing.sm }}
            onPress={() => router.push("/address/add" as any)}
          >
            Add New Address
          </Button>
        </Card>

        {/* Order Summary */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Order Summary
          </Typography>
          {displayItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={{ flex: 1 }}>
                <Typography variant="body">{item.name}</Typography>
                <Typography variant="caption" color={COLORS.text.muted}>
                  Qty: {item.quantity}
                </Typography>
              </View>
              <Typography variant="body">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </View>
          ))}
          <View style={styles.divider} />
          {[
            ["Subtotal", formatCurrency(subtotal)],
            ["Shipping", shipping === 0 ? "FREE" : formatCurrency(shipping)],
            ["Tax", formatCurrency(tax)],
          ].map(([label, value]) => (
            <View key={label} style={styles.summaryRow}>
              <Typography variant="body">{label}</Typography>
              <Typography variant="body">{value}</Typography>
            </View>
          ))}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Typography variant="h3">Total</Typography>
            <Typography variant="h3" color={COLORS.espresso[500]}>
              {formatCurrency(total)}
            </Typography>
          </View>
        </Card>

        {/* Payment */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Payment Method
          </Typography>
          <View style={styles.paymentInfo}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={COLORS.espresso[500]}
            />
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Typography variant="body">Secure Payment with Dodo</Typography>
              <Typography variant="caption" color={COLORS.text.muted}>
                You'll be redirected to complete your payment securely
              </Typography>
            </View>
          </View>
        </Card>

        <View style={{ height: theme.spacing.md }} />
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) },
        ]}
      >
        <Button
          onPress={handlePlaceOrder}
          size="lg"
          fullWidth
          loading={isLoading || paymentStarted}
          disabled={isLoading || addressesLoading || paymentStarted}
        >
          {paymentStarted ? 'Redirecting...' : buttonText}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },

  errorBanner: {
    margin: theme.spacing.lg,
    marginBottom: 0,
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  errorBannerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  errorBannerText: { flex: 1, fontSize: 13, color: "#c0392b", lineHeight: 18 },
  errorBannerActions: { flexDirection: "row" },
  errorBannerBtnOutline: {
    borderWidth: 1,
    borderColor: "#c0392b",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  errorBannerBtnOutlineText: {
    fontSize: 12,
    color: "#c0392b",
    fontWeight: "600",
  },

  section: { margin: theme.spacing.lg, padding: theme.spacing.lg },
  sectionTitle: { marginBottom: theme.spacing.md },
  orderItem: { flexDirection: "row", paddingVertical: theme.spacing.sm },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
  },
  totalRow: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: COLORS.cream[100],
    borderRadius: 8,
  },

  footer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  webViewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  webViewLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
