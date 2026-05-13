import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { COLORS } from '../../constants/theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

interface TypographyProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}) => {
  const textStyle: StyleProp<TextStyle> = [
    styles[variant],
    color ? { color } : undefined,
    style,
  ];

  return (
    <Text style={textStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
});