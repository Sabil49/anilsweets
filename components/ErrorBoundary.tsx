import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('[ErrorBoundary] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error details:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>⚠️ Something went wrong</Text>
            <Text style={styles.message}>
              The app encountered an error. This has been logged and our team will fix it.
            </Text>
            {__DEV__ && (
              <View style={styles.debugBox}>
                <Text style={styles.debugTitle}>Error Details (Dev Only):</Text>
                <Text style={styles.debugText}>{this.state.error?.message}</Text>
                <Text style={styles.debugStack}>{this.state.error?.stack}</Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  debugBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    maxHeight: 300,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    marginBottom: theme.spacing.sm,
  },
  debugText: {
    fontSize: 12,
    color: '#d32f2f',
    fontFamily: 'Courier New',
    marginBottom: theme.spacing.sm,
  },
  debugStack: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'Courier New',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.lg,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
