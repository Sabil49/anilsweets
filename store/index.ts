// store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartSlice from './slices/cartSlice';
import { addressesApi } from './services/addressesApi';
import { ordersApi } from './services/ordersApi';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    [addressesApi.reducerPath]: addressesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(addressesApi.middleware, ordersApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;