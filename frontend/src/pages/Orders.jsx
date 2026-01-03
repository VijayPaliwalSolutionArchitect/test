import React, { useEffect, useState } from 'react';
import { formatPrice, formatDate } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Orders Page Component
 * Displays user's order history
 */
function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(order.createdAt)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.productId?.title || 'Product'} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span className="text-primary-600">{formatPrice(order.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
