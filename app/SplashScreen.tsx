import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/theme';

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Decorative blobs */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
      {/* Cookie decoration */}
      <View style={styles.cookieDot}>
        <Text style={{ fontSize: 18 }}>🍪</Text>
      </View>

      <Animated.View
        style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.logoCircle} />
        <View style={styles.starDot}>
          <Text style={{ fontSize: 16 }}>⭐</Text>
        </View>
        <Text style={styles.title}>Anil Sweets</Text>
        <Text style={styles.titleOrange}>Corner</Text>
        <Text style={styles.tagline}>FRESH & TRADITIONAL SWEETS</Text>

        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>LOADING DELIGHTS...</Text>
        </View>

        {/* candy decoration */}
        <Text style={styles.candy}>🍬</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFE4CC',
    opacity: 0.5,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFD9B3',
    opacity: 0.4,
  },
  cookieDot: {
    position: 'absolute',
    top: '28%',
    left: '10%',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE0C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '78%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 28,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  starDot: {
    position: 'absolute',
    top: 110,
    left: '38%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  titleOrange: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 28,
  },
  loaderWrap: {
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.muted,
    letterSpacing: 1.5,
  },
  candy: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    fontSize: 22,
    opacity: 0.6,
  },
});
