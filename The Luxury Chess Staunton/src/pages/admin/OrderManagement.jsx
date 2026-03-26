import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/api';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getPendingAdmin();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, trackingNumber = '', note = '') => {
    try {
      setUpdatingStatus(true);
      await orderService.updateOrderStatus(orderId, newStatus, trackingNumber, note);
      
      // Refresh orders list
      await fetchOrders();
      
      // Clear selected order if it was updated
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
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

  if (loading) {
    return (
      <div className="order-management-page">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="order-management-page">
      <div className="management-header">
        <h1>Order Management</h1>
        <p>Manage and track all customer orders</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-container">
        <div className="orders-grid">
          {orders.length === 0 ? (
            <div className="no-orders">
              <h3>No orders to manage</h3>
              <p>All orders are up to date!</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>{order.items?.[0]?.card?.title || 'Product'}</h3>
                    <p className="order-id">Order #{order._id.slice(-8)}</p>
                    <p className="customer-info">
                      Customer: {order.user?.username || 'Unknown'}
                    </p>
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

                <div className="order-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                  
                  {order.status === 'pending' && (
                    <button 
                      className="status-btn processing"
                      onClick={() => handleStatusUpdate(order._id, 'processing', '', 'Order is being processed')}
                      disabled={updatingStatus}
                    >
                      Process Order
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button 
                      className="status-btn shipped"
                      onClick={() => {
                        const trackingNumber = prompt('Enter tracking number:');
                        if (trackingNumber) {
                          handleStatusUpdate(order._id, 'shipped', trackingNumber, 'Order has been shipped');
                        }
                      }}
                      disabled={updatingStatus}
                    >
                      Mark as Shipped
                    </button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <button 
                      className="status-btn delivered"
                      onClick={() => handleStatusUpdate(order._id, 'delivered', '', 'Order has been delivered')}
                      disabled={updatingStatus}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
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

              <div className="customer-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.user?.username || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
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

              <div className="order-total">
                <h3>Total Amount: ₹{selectedOrder.totalAmount}</h3>
              </div>

              <div className="modal-actions">
                {selectedOrder.status === 'pending' && (
                  <button 
                    className="status-btn processing"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder._id, 'processing', '', 'Order is being processed');
                      setSelectedOrder(null);
                    }}
                    disabled={updatingStatus}
                  >
                    Process Order
                  </button>
                )}
                
                {selectedOrder.status === 'processing' && (
                  <button 
                    className="status-btn shipped"
                    onClick={() => {
                      const trackingNumber = prompt('Enter tracking number:');
                      if (trackingNumber) {
                        handleStatusUpdate(selectedOrder._id, 'shipped', trackingNumber, 'Order has been shipped');
                        setSelectedOrder(null);
                      }
                    }}
                    disabled={updatingStatus}
                  >
                    Mark as Shipped
                  </button>
                )}
                
                {selectedOrder.status === 'shipped' && (
                  <button 
                    className="status-btn delivered"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder._id, 'delivered', '', 'Order has been delivered');
                      setSelectedOrder(null);
                    }}
                    disabled={updatingStatus}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
