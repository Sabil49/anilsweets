import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, theme } from '../constants/theme';
import PrimaryButton from '../components/PrimaryButton';
import { useCart } from '../constants/CartContext';
import { reviews, type Product } from '../data/mockData';

const { width } = Dimensions.get('window');

interface ReviewItemProps {
  review: typeof reviews[0];
}

function ReviewItem({ review }: ReviewItemProps) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{review.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewName}>{review.name}</Text>
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name="star"
                size={10}
                color={i < review.rating ? '#FBBF24' : '#e0e0e0'}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{review.date}</Text>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );
}

type ProductDetailScreenRouteParams = {
  product?: string;
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ProductDetailScreenRouteParams>();
  const product = params.product ? JSON.parse(params.product as string) : null;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const totalPrice = product.price * quantity;
  const savings = product.originalPrice ? (product.originalPrice - product.price) * quantity : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on Anil Sweets Corner. Price: ₹${product.price}. ${product.description}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.spacing.xl * 5 }}>
        {/* Hero Image */}
        <View style={styles.imageWrap}>
          <Image
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishBtn}
            onPress={() => setIsWishlisted(!isWishlisted)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? '#EF4444' : Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
          {product.badge && (
            <View style={styles.heroBadge}>
              <Ionicons name="star" size={10} color="#fff" />
              <Text style={styles.heroBadgeText}> {product.badge}</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productMeta}>Anil Sweets Corner · Made Fresh Daily</Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.productPrice}>₹{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              )}
            </View>
          </View>

          {/* Rating & sold */}
          <View style={styles.metaRow}>
            <View style={styles.ratingChip}>
              <Ionicons name="star" size={13} color="#FBBF24" />
              <Text style={styles.ratingText}>
                {product.rating} ({product.reviewCount} reviews)
              </Text>
            </View>
            <View style={styles.soldChip}>
              <Text style={styles.soldEmoji}>🔥</Text>
              <Text style={styles.soldText}>{product.soldToday}+ sold today</Text>
            </View>
          </View>

          {/* About */}
          <Text style={styles.sectionLabel}>About this sweet</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {(product.tags || []).map((tag: string) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>🥬 {tag}</Text>
              </View>
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionLabel}>Select Quantity</Text>
          <View style={styles.qtySection}>
            <View style={styles.totalWrap}>
              <Text style={styles.totalLabel}>Total price</Text>
              <View style={styles.totalPriceRow}>
                <Text style={styles.totalPrice}>₹{totalPrice}</Text>
                {savings > 0 && (
                  <Text style={styles.savingText}>Save ₹{savings}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Qty Stepper */}
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepNum}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={[styles.stepBtn, styles.stepBtnActive]}
            >
              <Text style={[styles.stepBtnText, { color: '#fff' }]}>+</Text>
            </TouchableOpacity>
            <Text style={styles.stepLabel}>pack(s) · {product.pack} each</Text>
          </View>

          {/* Special Instructions */}
          <Text style={styles.sectionLabel}>Special Instructions</Text>
          <Text style={styles.instrSubLabel}>Let us know your preferences</Text>
          <TextInput
            style={styles.instrInput}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="e.g. Less sweet, extra syrup..."
            placeholderTextColor={Colors.muted}
            multiline
            numberOfLines={3}
          />

          {/* Reviews */}
          <Text style={styles.reviewsLabel}>REVIEWS</Text>
          {reviews.map((r) => (
            <ReviewItem key={r.id} review={r} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={`Add to Cart · ₹${totalPrice}`}
          onPress={handleAddToCart}
          icon={<Ionicons name="bag-outline" size={18} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageWrap: {
    position: 'relative',
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: theme.spacing.md,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishBtn: {
    position: 'absolute',
    top: 52,
    right: 52,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    position: 'absolute',
    top: 52,
    right: theme.spacing.md,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: theme.spacing.sm - 2,
    paddingVertical: theme.spacing.xs - 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: theme.spacing.xxs,
  },
  productMeta: {
    fontSize: 12,
    color: Colors.muted,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: theme.spacing.sm - 2,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: 8,
    gap: theme.spacing.xxs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  soldChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: theme.spacing.sm - 2,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: 8,
    gap: theme.spacing.xxs,
  },
  soldEmoji: {
    fontSize: 14,
  },
  soldText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tagChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: theme.spacing.sm - 2,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  qtySection: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  totalWrap: {
    marginBottom: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  totalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  savingText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnActive: {
    backgroundColor: Colors.primary,
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  stepNum: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.muted,
    marginLeft: theme.spacing.xs,
  },
  instrSubLabel: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: theme.spacing.xs,
  },
  instrInput: {
    backgroundColor: Colors.card,
    borderRadius: Radius.input,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  reviewsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  reviewTop: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xxs / 2,
    marginTop: theme.spacing.xxs,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.muted,
  },
  reviewComment: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
