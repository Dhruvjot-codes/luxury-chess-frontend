import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { orderService, getStoredUser } from '../../services/api';
import OrderReview from '../../components/review/OrderReview';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const user = getStoredUser();
  const isFetched = React.useRef(false);

  const fetchOrders = useCallback(async (forceLoading = false) => {
    if (!user) return;
    
    try {
      if (forceLoading) setLoading(true);
      setError('');
      
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      if (forceLoading) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !isFetched.current) {
      fetchOrders(true);
      isFetched.current = true;
    }
  }, [user, fetchOrders]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const data = await orderService.getOrderDetails(orderId);
      setSelectedOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      shipped: '📦',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);

  if (!user) {
    return (
      <div className="order-history-page">
        <div className="error-message">Please log in to view your order history.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <h1>Order History</h1>
        <p>Track your orders and view status updates</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="orders-grid">
            {sortedOrders.map((order) => (
              <div key={order._id} className="order-card" onClick={() => fetchOrderDetails(order._id)}>
                <div className="order-header">
                  <div className="order-info">
                    <h3>{order.items?.[0]?.card?.title || 'Product'}</h3>
                    <p className="order-id">Order #{order._id.slice(-8)}</p>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(order.status),
                      color: 'white'
                    }}
                  >
                    <span className="status-icon">{getStatusIcon(order.status)}</span>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-row">
                    <span>Quantity:</span>
                    <span>{order.items?.[0]?.quantity || 1}</span>
                  </div>
                  <div className="order-row">
                    <span>Total:</span>
                    <span className="amount">₹{order.totalAmount}</span>
                  </div>
                  <div className="order-row">
                    <span>Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="order-row">
                      <span>Tracking:</span>
                      <span className="tracking-number">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <button className="view-details-btn">
                    View Details
                  </button>
                </div>

                {/* Review component for delivered orders */}
                <OrderReview 
                  order={order} 
                  onReviewSubmitted={() => {
                    // Refresh orders to show review status
                    setRefreshKey(prev => prev + 1);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div className="modal-content">
              <div className="order-summary">
                <h3>Order #{selectedOrder._id.slice(-8)}</h3>
                <div 
                  className="status-badge large"
                  style={{ 
                    backgroundColor: getStatusColor(selectedOrder.status),
                    color: 'white'
                  }}
                >
                  <span className="status-icon">{getStatusIcon(selectedOrder.status)}</span>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </div>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h5>{item.card?.title || 'Product'}</h5>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.pricePerPiece} each</p>
                    </div>
                    <div className="item-total">
                      ₹{item.pricePerPiece * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-timeline">
                <h4>Order Timeline</h4>
                <div className="timeline">
                  {selectedOrder.orderHistory?.map((history, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-status">
                          {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                        </div>
                        <div className="timeline-note">{history.note}</div>
                        <div className="timeline-date">
                          {new Date(history.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="tracking-info">
                  <h4>Tracking Information</h4>
                  <p>Tracking Number: <strong>{selectedOrder.trackingNumber}</strong></p>
                </div>
              )}

              <div className="order-total">
                <h3>Total Amount: ₹{selectedOrder.totalAmount}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
