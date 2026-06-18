import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Switch,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/Header';
import { useAuth } from '../constants/AuthContext';
import { deleteUser } from "firebase/auth";
import { auth } from '../config/firebase';
import { useOrder } from '../constants/OrderContext';
import { useGetAddressesQuery } from '../store/services/addressesApi';
import { theme } from '../constants/theme';
import { getUserFriendlyErrorMessage } from '../constants/utils';

interface ProfileScreenProps {
  onLogout: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, onBack }) => {
  const router = useRouter();
  const { userProfile, logout, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, clearOrders } = useOrder();
  const { data: addressData } = useGetAddressesQuery(userProfile?.id ?? '', {
    skip: !userProfile?.id,
  });
  const backendAddresses = addressData?.addresses ?? [];
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            setLoading(true);
            await logout();
            clearOrders();
            onLogout();
          } catch (err) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              const currentUser = auth.currentUser;
              if (!currentUser) {
                throw new Error('No authenticated user found.');
              }

              await deleteUser(currentUser);
              await logout();
              onLogout();

              Alert.alert('Account Deleted', 'Your account has been deleted.');
            } catch (err: any) {
              console.error('Error deleting account:', err);
              Alert.alert(
                'Unable to Delete Account',
                getUserFriendlyErrorMessage(
                  err,
                  'Unable to delete your account. Please try again.',
                ),
              );
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  if (!userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.warning;
      case 'preparing':
        return theme.colors.primary;
      case 'out_for_delivery':
        return theme.colors.primary;
      case 'delivered':
        return theme.colors.success;
      default:
        return theme.colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenHeader title="My Account" onBack={onBack} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.lg }}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <MaterialCommunityIcons
              name="account-circle"
              size={64}
              color={theme.colors.primary}
            />
          </View>
          <View style={{ flex: 1, marginLeft: theme.spacing.lg }}>
            <Text style={styles.userName}>{userProfile.displayName || 'User'}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            {userProfile.phoneNumber && (
              <Text style={styles.userPhone}>+91 {userProfile.phoneNumber}</Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {orders.filter((o) => o.status === 'delivered').length}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        {/* Addresses */}
        {backendAddresses.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            {backendAddresses.map((address) => (
              <View key={address.id} style={styles.addressItem}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                  <Text style={styles.addressTitle}>
                    {address.fullName}
                    {address.isDefault && (
                      <Text style={styles.defaultBadge}> (Default)</Text>
                    )}
                  </Text>
                  <Text style={styles.addressText}>
                    {address.address}, {address.city}, {address.state} {address.zipCode ?? address.pincode}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Order Notifications</Text>
            <Text style={styles.settingSubtitle}>Get updates on your orders</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.muted}
          />
        </View>

<TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.8}
          onPress={() => router.push('/auth/change-password')}
        >
          <MaterialCommunityIcons
            name="lock-reset"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={[styles.settingTitle, { marginLeft: theme.spacing.md, flex: 1 }]}>Change Password</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          activeOpacity={0.8}
          onPress={() => {
            const supportUrl = 'mailto:support@anilsweetscorner.com?subject=Need%20Help%20with%20Anil%20Sweets';
            Linking.openURL(supportUrl).catch(() => {
              Alert.alert('Support', 'Unable to open email client. Please contact support@anilsweetscorner.com');
            });
          }}
        >
          <MaterialCommunityIcons
            name="help-circle"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={[styles.settingTitle, { marginLeft: theme.spacing.md, flex: 1 }]}>Help & Support</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.muted} />
        </TouchableOpacity>

        {/* Recent Orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>

        {ordersLoading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : orders.length > 0 ? (
          <FlatList
            data={orders.slice(0, 5)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderId}>{item.orderId}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' as const }}>
                  <Text style={styles.orderTotal}>₹{item.total.toFixed(2)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(item.status) },
                      ]}
                    >
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No orders yet</Text>
        )}

        {/* Delete Account Button */}
        <TouchableOpacity
          style={[styles.deleteButton, loading && { opacity: 0.6 }]}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="delete-forever" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, loading && { opacity: 0.6 }]}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <>
              <MaterialCommunityIcons name="logout" size={20} color={theme.colors.card} />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ProfileRoute() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  if (loading || !user) {
    return null;
  }

  return <ProfileScreen onLogout={handleLogout} onBack={() => router.back()} />;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  userCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  userEmail: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  userPhone: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  addressItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  defaultBadge: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  addressText: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  settingItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  orderItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  orderId: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.chip,
    marginTop: theme.spacing.xs,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: 'center' as const,
    paddingVertical: theme.spacing.lg,
  },
  logoutButton: {
    backgroundColor: '#FF6B63',
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  logoutButtonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  deleteButton: {
    backgroundColor: '#C41E3A',
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});
