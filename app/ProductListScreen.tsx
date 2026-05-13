import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing } from '../constants/theme';
import { ScreenHeader } from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductListItem from '../components/ProductListItem';
import BottomTabBar from '../components/BottomTabBar';
import { products, type Product, categories } from '../data/mockData';
import { useCart } from '../constants/CartContext';

const filterTabs = ['All', 'Popular', 'New', 'Offers'];

export default function ProductListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = typeof params.category === 'string' ? params.category : 'all';
  const title = typeof params.title === 'string' ? params.title : 'Bengali Sweets';
  const initialFilter = typeof params.filter === 'string' ? params.filter : 'All';
  const initialSearch = typeof params.search === 'string' ? params.search : '';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState('categories');

  const displayProducts = useMemo(() => {
    let list = category === 'all' ? products : products.filter((p) => p.category === category);
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.tags.join(' ').toLowerCase().includes(query)
      );
    }
    if (activeFilter === 'Popular') list = list.filter((p) => p.isBestseller);
    if (activeFilter === 'New') list = list.filter((p) => p.isNew);
    if (activeFilter === 'Offers') list = list.filter((p) => p.originalPrice);
    return list;
  }, [category, search, activeFilter]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') router.push('/');
    else if (tab === 'cart') router.push('/cart');
    else if (tab === 'orders') router.push('/order-tracking');
    else if (tab === 'profile') router.push('/profile');
  };

  const handleSearch = () => {
    // Search is already applied locally,
    // this keeps the button interactive and updated.
    setSearch(search.trim());
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={title === 'all' ? 'All Sweets' : title}
        subtitle="Anil Sweets Corner"
        onBack={() => router.back()}
        rightIcon="search-outline"
        onRightPress={handleSearch}
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
        onSearchPress={handleSearch}
        onFilterPress={() => setActiveFilter('Offers')}
        placeholder="Search sweets..."
        filterLabel="Filter"
      />

      {/* Filter tabs */}
      <View style={styles.filterWrap}>
        {filterTabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterButton,
              activeFilter === tab && styles.filterButtonActive,
              index !== filterTabs.length - 1 && styles.filterButtonSpacing,
            ]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterLabel, activeFilter === tab && styles.filterLabelActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {displayProducts.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            onPress={() => router.push({ pathname: '/product-detail', params: { product: JSON.stringify(product) } })}
          />
        ))}
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
  filterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F0EF',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonSpacing: {
    marginRight: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  filterLabelActive: {
    color: '#fff',
  },
});
