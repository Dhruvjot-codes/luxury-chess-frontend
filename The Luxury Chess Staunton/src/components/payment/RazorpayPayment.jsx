import React, { useState } from 'react';
import { paymentService } from '../../services/api';
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
      const data = await paymentService.createOrder(order._id);

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
            const verifyData = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id
            });

            onPaymentSuccess && onPaymentSuccess(verifyData);
          } catch (error) {
            onPaymentError && onPaymentError(error.message || 'Payment verification failed');
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

  const totalAmount = order.totalAmount || 0;
  const itemPrice = order.items?.[0]?.pricePerPiece || 0;
  const quantity = order.items?.[0]?.quantity || 1;
  const originalPrice = itemPrice * quantity;
  const discountAmount = originalPrice > totalAmount ? originalPrice - totalAmount : 0;

  return (
    <div className="razorpay-payment">
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="payment-details">
          <p><strong>Order ID:</strong> {order._id.slice(-8)}</p>
          <p><strong>Tracking:</strong> {order.trackingNumber || 'N/A'}</p>
          {discountAmount > 0 && (
            <>
              <p><strong>Original Price:</strong> <span style={{textDecoration: 'line-through'}}>₹{originalPrice}</span></p>
              <p style={{color: '#10b981'}}><strong>You Save:</strong> ₹{discountAmount}</p>
            </>
          )}
          <p><strong>Final Amount:</strong> ₹{totalAmount}</p>
          <p><strong>Items:</strong> {order.items?.length || 0}</p>
        </div>
      </div>
      
      <button 
        className="pay-button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
      </button>
      
      <div className="payment-info">
        <p>✓ Secure payment powered by Razorpay</p>
        <p>✓ Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default RazorpayPayment;
