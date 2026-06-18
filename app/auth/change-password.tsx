import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { theme } from '../../constants/theme';
import { getUserFriendlyErrorMessage } from '../../constants/utils';

export default function ChangePasswordRoute() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert('Error', 'Unable to update password at this time. Please sign in again.');
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Your password has been updated successfully.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (err: any) {
      console.error('Change password error:', err);
      const errorText = String(err?.code ?? err?.message ?? err).toLowerCase();
      const message =
        errorText.includes('invalid-credential') ||
        errorText.includes('wrong-password')
          ? 'Your current password is incorrect. Please try again.'
          : getUserFriendlyErrorMessage(
              err,
              'Unable to update your password. Please try again.',
            );
      Alert.alert('Unable to Update Password', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter current password"
            placeholderTextColor={theme.colors.muted}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter new password"
            placeholderTextColor={theme.colors.muted}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Confirm new password"
            placeholderTextColor={theme.colors.muted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
