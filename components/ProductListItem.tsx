import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, theme } from '../constants/theme';
import { useCart } from '../constants/CartContext';
import type { Product } from '../data/mockData';

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
}

export default function ProductListItem({ product, onPress }: ProductListItemProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const imageSource = typeof product.image === 'string' ? { uri: product.image } : product.image;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrap}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {product.badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  product.badgeColor === '#22C55E' ? '#22C55E' : Colors.primary,
              },
            ]}
          >
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.subtitle}>{product.subtitle || product.pack}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FBBF24" />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>
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
                <Text style={styles.qtyBtnText}>−</Text>
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
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: Radius.image,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
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
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 11,
    color: Colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.button,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 11,
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
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  qtyNum: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
});
