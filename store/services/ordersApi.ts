import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../constants/config';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  addressId: string;
  items: OrderItem[];
  paymentMethod: string;
}

export interface CreateOrderResponse {
  order: {
    id: string;
    [key: string]: any;
  };
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Add auth token
      const token = '';
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: '/api/orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = ordersApi;