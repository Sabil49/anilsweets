import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
});
