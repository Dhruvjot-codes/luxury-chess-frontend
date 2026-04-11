import React from 'react';
import './OrderProgressTracker.css';
import { FaCheckCircle, FaClock, FaCreditCard, FaBox, FaTruck, FaHome, FaPhone } from 'react-icons/fa';

const OrderProgressTracker = ({ order, whatsappNumber }) => {
  const stages = [
    { key: 'pending', label: 'Order Placed', icon: <FaClock /> },
    { key: 'accepted', label: 'Order Confirmed', icon: <FaCheckCircle /> },
    { key: 'payment', label: 'Advance Payment', icon: <FaCreditCard /> },
    { key: 'processing', label: 'Processing', icon: <FaBox /> },
    { key: 'shipped', label: 'Shipped', icon: <FaTruck /> },
    { key: 'delivered', label: 'Delivered', icon: <FaHome /> }
  ];

  const getStageIndex = () => {
    const stageMap = {
      pending: 0,
      accepted: 1,
      payment: 2,
      processing: 3,
      shipped: 4,
      delivered: 5
    };
    return stageMap[order?.status] || 0;
  };

  const currentStageIndex = getStageIndex();

  const handleWhatsAppContact = () => {
    if (!whatsappNumber) return;
    const message = `Hi! I'm contacting about order #${order._id?.slice(-8)}. Can you help me with this order?`;
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="order-progress-tracker">
      <div className="tracker-header">
        <h3>Order Tracking</h3>
        <button className="whatsapp-contact-btn" onClick={handleWhatsAppContact} title="Contact Now on WhatsApp">
          <FaPhone size={14} /> Contact Support
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentStageIndex) / (stages.length - 1)) * 100}%` }}></div>
      </div>

      <div className="stages-container">
        {stages.map((stage, index) => (
          <div
            key={stage.key}
            className={`stage ${index <= currentStageIndex ? 'active' : 'inactive'} ${
              index === currentStageIndex ? 'current' : ''
            }`}
          >
            <div className="stage-icon">
              {index <= currentStageIndex ? <FaCheckCircle size={24} /> : stage.icon}
            </div>
            <div className="stage-label">{stage.label}</div>
            {index === currentStageIndex && <div className="stage-current">Current</div>}
          </div>
        ))}
      </div>

      <div className="stage-details">
        {order?.createdAt && (
          <p>
            <strong>Order Placed:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
        )}
        {order?.trackingNumber && (
          <p>
            <strong>Tracking Number:</strong> {order.trackingNumber}
          </p>
        )}
        {order?.status === 'payment' && (
          <p className="payment-info">
            ⚠️ <strong>Advance Payment Required:</strong> Pay 50% upfront for security. Balance due on delivery.
          </p>
        )}
        {order?.status === 'shipped' && (
          <p className="shipped-info">
            📦 <strong>Your order is on the way!</strong> Use the tracking number to monitor delivery.
          </p>
        )}
        {order?.status === 'delivered' && (
          <p className="delivered-info">
            ✅ <strong>Order delivered!</strong> Thank you for your purchase.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderProgressTracker;
