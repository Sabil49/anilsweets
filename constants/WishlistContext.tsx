import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// @ts-ignore: optional native dependency types may be missing in this environment
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishlistContextType {
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
}

const STORAGE_KEY = '@anilsweet_wishlist';
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const loadWishlist = AsyncStorage?.getItem;
      if (typeof loadWishlist !== 'function') {
        console.warn('AsyncStorage is unavailable, wishlist will not persist.');
        return;
      }

      const result = AsyncStorage.getItem(STORAGE_KEY);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        (result as Promise<string | null>)
          .then((value) => {
            if (value) {
              setFavoriteIds(JSON.parse(value));
            }
          })
          .catch((err: unknown) => {
            console.error('Failed to load wishlist:', err);
          });
      }
    } catch (err) {
      console.warn('AsyncStorage is unavailable or failed to initialize; wishlist will not persist.', err);
    }
  }, []);

  const persistFavorites = useCallback(async (ids: string[]) => {
    try {
      const saveWishlist = AsyncStorage?.setItem;
      if (typeof saveWishlist !== 'function') {
        console.warn('AsyncStorage is unavailable, wishlist changes will not persist.');
        return;
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn('Failed to save wishlist; continuing without persistence.', err);
    }
  }, []);

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavoriteIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites],
  );

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds],
  );

  return (
    <WishlistContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
