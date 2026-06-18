import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../constants/AuthContext';
import { ScreenHeader } from '../../components/Header';
import { theme } from '../../constants/theme';
import { useCreateAddressMutation } from '../../store/services/addressesApi';
import { API_URL } from '../../constants/config';
import { getUserFriendlyErrorMessage } from '../../constants/utils';

export default function AddAddressScreen() {
  const router = useRouter();
  const { user, error: authError } = useAuth();
  const [createAddressBackend] = useCreateAddressMutation();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Please enter full name.');
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Validation', 'Please enter a valid phone number.');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation', 'Please enter address details.');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Validation', 'Please enter city.');
      return false;
    }
    if (!state.trim()) {
      Alert.alert('Validation', 'Please enter state.');
      return false;
    }
    if (!pincode.trim()) {
      Alert.alert('Validation', 'Please enter pincode.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to add an address.');
      router.replace('/auth/login');
      return;
    }

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // First, sync address to backend
      console.log('[AddAddress] Syncing to backend with userId:', user.uid);
      console.log('[AddAddress] API_URL:', API_URL);
      
      const backendResponse = await createAddressBackend({
        userId: user.uid,
        userEmail: user.email ?? undefined,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: pincode.trim(),
        country: 'India',
        isDefault: false,
      }).unwrap();

      console.log('[AddAddress] Backend response:', backendResponse);
      Alert.alert('Address Added', 'Your address has been saved.');
      router.back();
    } catch (err: any) {
      const message = getUserFriendlyErrorMessage(
        err?.data?.error ?? err,
        'Unable to save your address. Please try again.',
      );
      Alert.alert('Unable to Save Address', message);
      console.error('[AddAddress] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Add New Address" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholder="Enter full name"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor={theme.colors.muted}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={[styles.input, styles.textArea]}
          placeholder="House number, street, landmark"
          placeholderTextColor={theme.colors.muted}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          style={styles.input}
          placeholder="Enter city"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          value={state}
          onChangeText={setState}
          style={styles.input}
          placeholder="Enter state"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={styles.label}>Pincode</Text>
        <TextInput
          value={pincode}
          onChangeText={setPincode}
          style={styles.input}
          placeholder="Enter pincode"
          placeholderTextColor={theme.colors.muted}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <Text style={styles.buttonText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
});
