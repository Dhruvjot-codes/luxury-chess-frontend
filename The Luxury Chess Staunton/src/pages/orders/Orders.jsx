import React, { useEffect, useState } from "react";
import { orderService, paymentService, getStoredUser } from "../../services/api";
import RazorpayPayment from "../../components/payment/RazorpayPayment";
import "./orders.css";

const Orders = () => {
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminPending, setAdminPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  const user = getStoredUser();
  const isAdmin = user && user.role === 'admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (user) {
        // Fetch in parallel for better performance
        const [myReqs, myOrders] = await Promise.all([
          orderService.getMyRequests(),
          orderService.getMyOrders()
        ]);
        
        setRequests(Array.isArray(myReqs) ? myReqs : []);
        setOrders(Array.isArray(myOrders) ? myOrders : []);

        if (isAdmin) {
          const pendingData = await orderService.getPendingAdmin();
          setAdminPending(Array.isArray(pendingData) ? pendingData : []);
        }
      }
    } catch (err) {
      console.error("fetchData error:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = async (id) => {
    try {
      await orderService.acceptAdmin(id);
      alert("Order accepted successfully!");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to accept order");
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to reject this order?")) return;
    try {
      await orderService.rejectAdmin(id);
      alert("Order rejected.");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to reject order");
    }
  };

  const handlePaymentSuccess = (result) => {
    setPaymentMessage("Payment successful! Your order is now being processed.");
    fetchData(); // Refresh the orders
  };

  const handlePaymentError = (error) => {
    setPaymentMessage(`Payment failed: ${error}`);
  };

  if (!user) {
    return <div className="orders-page"><div className="orders-error">Please log in to view your orders.</div></div>;
  }

  if (loading) {
    return <div className="orders-page"><div className="orders-loading">Loading orders...</div></div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Your Order Cart</h1>
        <p className="order-message-banner">
          Thank you for waiting and your precious time! Orders take up to 24 hours to approve. We will meet as soon as possible.
        </p>
      </div>

      {error && <div className="orders-error">{error}</div>}
      {paymentMessage && <div className="orders-success">{paymentMessage}</div>}

      <div className="orders-container">
        <h2>My Submitted Requests</h2>
        {requests.length === 0 ? (
          <p className="no-orders">You have not submitted any orders yet.</p>
        ) : (
          <div className="orders-list">
            {requests.map(req => (
              <div key={req._id} className="order-card">
                <div className="order-info">
                  <h3>{req.card?.title || 'Unknown Product'}</h3>
                  <p><strong>Quantity:</strong> {req.quantity}</p>
                  <p><strong>Status:</strong> <span className={`status-badge status-${req.status}`}>{req.status}</span></p>
                  <p><strong>Ordered On:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2>My Approved Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">You have no approved orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <h3>{order.items?.[0]?.card?.title || 'Unknown Product'}</h3>
                  <p><strong>Quantity:</strong> {order.items?.[0]?.quantity || 1}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status}</span></p>
                  <p><strong>Created On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-actions">
                  {(order.status === 'pending' || order.status === 'created') && (
                    <RazorpayPayment 
                      order={order} 
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                    />
                  )}
                  {order.status === 'paid' && (
                    <div className="payment-complete">
                      <span className="status-badge status-paid">Paid</span>
                      {order.paymentInfo?.invoiceUrl && (
                        <a href={order.paymentInfo.invoiceUrl} target="_blank" rel="noopener noreferrer" className="invoice-link">
                          Download Invoice
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="admin-pending-section" style={{ marginTop: '50px' }}>
            <h2>Admin Action Required: Pending Orders</h2>
            {adminPending.length === 0 ? (
              <p className="no-orders">No pending orders to approve.</p>
            ) : (
              <div className="orders-list">
                {adminPending.map(req => (
                  <div key={req._id} className="order-card admin-order-card">
                    <div className="order-info">
                      <h3>{req.card?.title}</h3>
                      <p><strong>Requested By:</strong> {req.user?.username} ({req.user?.email})</p>
                      <p><strong>Quantity:</strong> {req.quantity}</p>
                      <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="order-actions">
                      <button className="btn-accept" onClick={() => handleAccept(req._id)}>Accept</button>
                      <button className="btn-reject" onClick={() => handleReject(req._id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
