import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius, theme } from '../constants/theme';
import { useCart } from '../constants/CartContext';
import type { Product } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: any;
}

export default function ProductCard({ product, onPress, style }: ProductCardProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const imageSource = typeof product.image === 'string' ? { uri: product.image } : product.image;

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrap}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {product.badge && product.badge !== 'BESTSELLER' && (
          <View
            style={[
              styles.badge,
              { backgroundColor: product.badgeColor === '#22C55E' ? '#22C55E' : Colors.primary },
            ]}
          >
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {product.subtitle || product.pack}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(product)}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, qty - 1)}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(product.id, qty + 1)}
                style={[styles.qtyBtn, styles.qtyBtnActive]}
              >
                <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrap: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: Radius.image,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  info: {
    gap: theme.spacing.xs,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    height: 20,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.button,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnActive: {
    backgroundColor: Colors.primary,
  },
  qtyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  qtyNum: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
});
