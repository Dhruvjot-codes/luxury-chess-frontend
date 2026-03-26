import React, { useState } from 'react';
import './RazorpayPayment.css';

const RazorpayPayment = ({ order, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ orderId: order._id })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      await loadRazorpayScript();

      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'Luxury Chess Staunton',
        description: `Payment for order ${order._id}`,
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyResponse.ok) {
              onPaymentSuccess && onPaymentSuccess(verifyData);
            } else {
              onPaymentError && onPaymentError(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            onPaymentError && onPaymentError('Payment verification failed');
          }
        },
        prefill: {
          name: order.user?.username || '',
          email: order.user?.email || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            onPaymentError && onPaymentError('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setLoading(false);
      onPaymentError && onPaymentError(error.message || 'Payment failed');
    }
  };

  return (
    <div className="razorpay-payment">
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="payment-details">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Items:</strong> {order.items?.length || 0}</p>
        </div>
      </div>
      
      <button 
        className="pay-button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Pay ₹${order.totalAmount}`}
      </button>
      
      <div className="payment-info">
        <p>Secure payment powered by Razorpay</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default RazorpayPayment;
