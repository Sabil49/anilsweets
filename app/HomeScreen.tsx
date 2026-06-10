import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, theme } from '../constants/theme';
import { HomeHeader } from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import BottomTabBar from '../components/BottomTabBar';
import { categories, products, todaySpecial, popularSweets, type Product } from '../data/mockData';
import { useCart } from '../constants/CartContext';

const { width } = Dimensions.get('window');

interface Banner {
  id: string;
  tag: string;
  title: string;
  highlight: string;
  cta: string;
  image: string | number;
  category: string;
}

const banners: Banner[] = [
  {
    id: '1',
    tag: 'FESTIVAL SPECIAL',
    title: 'Festive Sweets',
    highlight: 'Box 30% OFF',
    cta: 'Order Now',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
    category: 'barfi',
  },
  {
    id: '2',
    tag: 'LIMITED OFFER',
    title: 'Bengali Special',
    highlight: 'Combo 20% OFF',
    cta: 'Order Now',
    image: products[2].image,
    category: 'bengali',
  },
];

interface BannerProps {
  item: Banner;
  onPress: () => void;
}

function Banner({ item, onPress }: BannerProps) {
  const bannerSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <View style={[styles.banner, { width: width - 32 }]}>
      <Image source={bannerSource} style={styles.bannerImage} resizeMode="cover" />
      <View style={styles.bannerOverlay} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTag}>{item.tag}</Text>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerHighlight}>{item.highlight}</Text>
        <TouchableOpacity style={styles.bannerBtn} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.bannerBtnText}>{item.cta}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface TodaySpecialCardProps {
  product: Product;
  onPress: () => void;
}

function TodaySpecialCard({ product, onPress }: TodaySpecialCardProps) {
  const { addToCart, cartItems } = useCart();
  const cartItem = cartItems.find((i) => i.id === product.id);

  return (
    <TouchableOpacity style={styles.specialCard} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={typeof product.image === 'string' ? { uri: product.image } : product.image}
        style={styles.specialImage}
        resizeMode="cover"
      />
      <View style={styles.specialInfo}>
        <View style={styles.chefBadge}>
          <Text style={styles.chefBadgeText}>CHEF'S PICK</Text>
        </View>
        <Text style={styles.specialName}>{product.name}</Text>
        <Text style={styles.specialSubtitle}>{product.subtitle}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#FBBF24" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        <View style={styles.specialBottom}>
          <View>
            <Text style={styles.specialPrice}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addToCart(product)}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'cart') router.push('/cart');
    else if (tab === 'categories') router.push('/product-list');
    else if (tab === 'orders') router.push('/order-tracking');
    else if (tab === 'profile') router.push('/profile');
    else if (tab === 'home') router.push('/');
  };

  const handleSearch = () => {
    const trimmed = search.trim();
    router.push({
      pathname: '/product-list',
      params: {
        category: 'all',
        title: trimmed ? 'Search results' : 'All Sweets',
        search: trimmed,
      },
    });
  };

  const handleFilterPress = () => {
    router.push({
      pathname: '/product-list',
      params: {
        category: 'all',
        title: 'Offers',
        filter: 'Offers',
      },
    });
  };

  const snackProducts: Product[] = [ 
    {
      id: 'sk1',
      name: 'Aloo Bhujia',
      category: 'snacks',
      subtitle: '200g Pack',
      price: 80,
      originalPrice: null,
      rating: 4.5,
      reviewCount: 33,
      image: require('../assets/images/aloo-bhujia.jpg'),
      pack: '200g Pack',
      badge: null,
      badgeColor: null,
      description: '',
      tags: ['Veg'],
      isBestseller: false,
      isNew: false,
      soldToday: 120,
    },
    {
      id: 'sk2',
      name: 'Moong Dal',
      category: 'snacks',
      subtitle: '200g Pack',
      price: 100,
      originalPrice: null,
      rating: 4.3,
      reviewCount: 28,
      image: require('../assets/images/moong-dal.jpg'),
      pack: '200g Pack',
      badge: null,
      badgeColor: null,
      description: '',
      tags: ['Veg', 'Gluten Free'],
      isBestseller: false,
      isNew: false,
      soldToday: 85,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <HomeHeader onCartPress={() => router.push('/cart')} />

        {/* Greeting */}
        {/* <View style={styles.greeting}>
          <Text style={styles.greetSub}>Good Morning, Rahul 👋</Text>
          <Text style={styles.greetMain}>What sweet would you{'\n'}like today?</Text>
        </View> */}

        {/* Search */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSearchPress={handleSearch}
          onSubmitEditing={handleSearch}
          onFilterPress={handleFilterPress}
        />

        {/* Banner */}
        <FlatList
          data={banners}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm }}
          renderItem={({ item }) => (
            <Banner
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/product-list',
                  params: { category: item.category, title: item.title },
                })
              }
            />
          )}
          style={{ marginBottom: theme.spacing.md }}
          scrollEnabled={false}
        />

        {/* Today's Special */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Special ✨</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <TodaySpecialCard
          product={todaySpecial}
          onPress={() => router.push({ pathname: '/product-detail', params: { product: JSON.stringify(todaySpecial) } })}
        />

        {/* Popular Sweets */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Sweets 🍬</Text>
          <TouchableOpacity onPress={() => router.push('/product-list')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridWrap}>
          {popularSweets.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              style={styles.gridCard}
              onPress={() => router.push({ pathname: '/product-detail', params: { product: JSON.stringify(product) } })}
            />
          ))}
        </View>

        {/* Snacks & Namkeen */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Snacks & Namkeen 🥨</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/product-list', params: { category: 'snacks', title: 'Snacks' } })}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridWrap}>
          {snackProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              style={styles.gridCard}
              onPress={() => router.push({ pathname: '/product-detail', params: { product: JSON.stringify(p) } })}
            />
          ))}
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  greeting: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  greetSub: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  greetMain: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 30,
  },
  banner: {
    height: 160,
    borderRadius: Radius.card,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  bannerContent: {
    padding: theme.spacing.md,
    flex: 1,
    justifyContent: 'flex-end',
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: theme.spacing.xxs,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  bannerHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: theme.spacing.sm - 2,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: Radius.chip,
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: theme.spacing.xs,
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  specialCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  specialImage: {
    width: 110,
    height: '100%',
    minHeight: 130,
  },
  specialInfo: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  chefBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs / 2,
    marginBottom: theme.spacing.xs - 2,
  },
  chefBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  specialName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  specialSubtitle: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
    marginBottom: theme.spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.muted,
  },
  specialBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specialPrice: {
    fontSize: 18,
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
    borderRadius: Radius.button,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  gridCard: {
    width: (width - 32 - 12) / 2,
  },
});
