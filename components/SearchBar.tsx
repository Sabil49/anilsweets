import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, theme } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  filterLabel?: string;
  onSearchPress?: () => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFilterPress, 
  filterLabel = 'Filter',
  onSearchPress,
  onSubmitEditing,
  placeholder = 'Search sweets...' 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TouchableOpacity
          onPress={onSearchPress}
          activeOpacity={0.7}
          style={styles.searchIconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="search-outline" size={18} color={Colors.muted} style={styles.searchIcon} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSubmitEditing?.()}
          returnKeyType="search"
          placeholder={placeholder}
          placeholderTextColor={Colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          style={styles.filterBtn}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="options-outline" size={18} color="#fff" style={styles.filterIcon} />
          <Text style={styles.filterBtnText}>{filterLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.input,
    paddingHorizontal: theme.spacing.sm,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIconButton: {
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 0,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
    height: 48,
    borderRadius: Radius.input,
    backgroundColor: Colors.primary,
    paddingHorizontal: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
