import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { COLORS, theme } from '../../constants/theme';
import type { Address } from '../../constants/AuthContext';

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onPress: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={[styles.card, isSelected && styles.selectedCard]}>
        <View style={styles.content}>
          <View style={styles.radio}>
            <Ionicons
              name={isSelected ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={isSelected ? COLORS.espresso[500] : COLORS.text.muted}
            />
          </View>
          <View style={styles.addressInfo}>
            <Typography variant="body" style={styles.type}>
              {address.fullName}
            </Typography>
            <Typography variant="body">
              {address.address}
            </Typography>
            <Typography variant="caption" color={COLORS.text.muted}>
              {address.city}, {address.state} {address.pincode}
            </Typography>
            <Typography variant="caption" color={COLORS.text.muted}>
              {address.phone}
            </Typography>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    padding: theme.spacing.md,
  },
  selectedCard: {
    borderColor: COLORS.espresso[500],
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radio: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  addressInfo: {
    flex: 1,
  },
  type: {
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
});