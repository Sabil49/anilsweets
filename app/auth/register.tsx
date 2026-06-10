import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../constants/AuthContext';
import { theme } from '../../constants/theme';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp, error, clearError } = useAuth();

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (phone.length < 10) {
      Alert.alert('Error', 'Phone number must be at least 10 digits');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      setLoading(true);
      await signUp(email.trim(), password, fullName.trim(), phone.trim());
      onRegisterSuccess();
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.lg }}
      >
        {/* Header */}
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={styles.brandTitle}>Create Account</Text>
          <Text style={styles.subtitle}>Join us for Sweet Delights</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="account" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={theme.colors.muted}
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor={theme.colors.muted}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' as const }}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="9876543210"
              placeholderTextColor={theme.colors.muted}
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.muted}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock-check" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={theme.colors.muted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialCommunityIcons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreeTerms(!agreeTerms)}
          disabled={loading}
        >
          <View
            style={[
              styles.checkbox,
              agreeTerms && { backgroundColor: theme.colors.primary },
            ]}
          >
            {agreeTerms && (
              <MaterialCommunityIcons name="check" size={16} color={theme.colors.card} />
            )}
          </View>
          <Text style={{ color: theme.colors.text, flex: 1, marginLeft: theme.spacing.sm }}>
            I agree to the Terms & Conditions and Privacy Policy
          </Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerButton, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} size="small" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={{ color: theme.colors.text }}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin} disabled={loading}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <RegisterScreen
        onNavigateToLogin={() => router.push('/auth/login')}
        onRegisterSuccess={() => router.replace('/')}
      />
    </SafeAreaView>
  );
}

const styles = {
  brandTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: theme.spacing.sm,
  },
  errorContainer: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 13,
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
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
    fontSize: 15,
    color: theme.colors.text,
  },
  checkboxContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: theme.spacing.lg,
  },
  registerButtonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  loginContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.lg,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
};
