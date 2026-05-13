import React, { createContext, useContext, useState, useCallback } from 'react';
import { collection, doc, addDoc, getDocs } from '@react-native-firebase/firestore';
import { db } from '../config/firebase';
import { Order, OrderItem } from '../app/order-tracking';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  createOrder: (
    items: OrderItem[],
    total: number,
    paymentMethod: string,
    deliveryAddress: string | null,
    userId: string
  ) => Promise<Order>;
  fetchUserOrders: (userId: string) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const createOrder = useCallback(
    async (
      items: OrderItem[],
      total: number,
      paymentMethod: string,
      deliveryAddress: string | null,
      userId: string
    ): Promise<Order> => {
      try {
        setLoading(true);

        const newOrder: Omit<Order, 'id'> = {
          orderId: `ASC-${Date.now()}`,
          date: Date.now(),
          total,
          paymentMethod,
          status: 'confirmed',
          items,
          deliveryAddress: deliveryAddress || undefined,
          estimatedDelivery: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
        };

        // Save to Firestore
        const ordersRef = collection(doc(db, 'users', userId), 'orders');
        const docRef = await addDoc(ordersRef, newOrder);

        const orderWithId: Order = {
          ...newOrder,
          id: docRef.id,
        };

        setOrders((prev) => [orderWithId, ...prev]);
        setCurrentOrder(orderWithId);

        // Simulate status updates
        simulateOrderProgresssion(orderWithId.id, userId);

        return orderWithId;
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchUserOrders = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const ordersRef = collection(doc(db, 'users', userId), 'orders');
      const querySnapshot = await getDocs(ordersRef);
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Order, 'id'>),
        id: doc.id,
      }));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const simulateOrderProgresssion = (orderId: string, userId: string) => {
    // Simulate order status progression
    const statuses: Array<'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered'> = [
      'preparing',
      'out_for_delivery',
      'delivered',
    ];

    statuses.forEach((status, index) => {
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );

        if (currentOrder?.id === orderId) {
          setCurrentOrder((prev) => (prev ? { ...prev, status } : null));
        }
      }, (index + 1) * 30000); // Update every 30 seconds for demo
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        createOrder,
        fetchUserOrders,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
