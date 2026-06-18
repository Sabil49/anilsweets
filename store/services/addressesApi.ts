import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../constants/config';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
  createdAt?: string;
  pincode?: string; // compatibility alias for existing UI
}

export interface CreateAddressRequest extends Omit<Address, 'id' | 'createdAt'> {
  userEmail?: string;
}

export const addressesApi = createApi({
  reducerPath: 'addressesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = ''; // get from auth context or storage
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Address'],
  endpoints: (builder) => ({
    getAddresses: builder.query<{ addresses: Address[] }, string>({
      query: (userId) => ({
        url: '/api/addresses',
        headers: { 'x-user-id': userId },
      }),
      transformResponse: (response: { addresses: Address[] }) => ({
        addresses: response.addresses.map((address) => ({
          ...address,
          address: address.address || address.addressLine1 || '',
          pincode: address.pincode || address.zipCode,
        })),
      }),
      providesTags: ['Address'],
    }),
    createAddress: builder.mutation<{ address: Address }, CreateAddressRequest>({
      query: (data) => ({
        url: '/api/addresses',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { address: Address }) => ({
        address: {
          ...response.address,
          address:
            response.address.address ||
            response.address.addressLine1 ||
            '',
          pincode:
            response.address.pincode ||
            response.address.zipCode,
        },
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const { useGetAddressesQuery, useCreateAddressMutation } = addressesApi;
