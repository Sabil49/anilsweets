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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { theme } from '../../constants/theme';
import { getUserFriendlyErrorMessage } from '../../constants/utils';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Success', 'Password reset email sent. Check your inbox.', [
        { text: 'OK', onPress: () => router.replace('/auth/login') },
      ]);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      Alert.alert(
        'Unable to Send Email',
        getUserFriendlyErrorMessage(
          err,
          'Unable to send the password reset email. Please try again.',
        ),
      );
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
          <Text style={styles.title}>Forgot Password</Text>
        </View>

        <Text style={styles.subtitle}>Enter your email and we’ll send instructions to reset your password.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor={theme.colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <Text style={styles.buttonText}>Send Reset Email</Text>
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
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
