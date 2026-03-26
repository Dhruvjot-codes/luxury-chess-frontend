import React, { useState, useEffect, useCallback } from 'react';
import { cardService, getStoredUser } from '../../services/api';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();

  const loadWishlist = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      
      const savedWishlist = localStorage.getItem('wishlist');
      if (!savedWishlist) {
        setWishlist([]);
        return;
      }

      const wishlistIds = JSON.parse(savedWishlist);
      if (wishlistIds.length === 0) {
        setWishlist([]);
        return;
      }

      const cards = await cardService.getAll();
      const wishlistCards = cards.filter(card => wishlistIds.includes(card._id));
      setWishlist(wishlistCards);
    } catch (err) {
      console.error('Error loading wishlist:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadWishlist(true);
    }
  }, [user?.id, loadWishlist]);

  const removeFromWishlist = useCallback((cardId) => {
    setWishlist(prev => {
      const updated = prev.filter(item => item._id !== cardId);
      // Synchronize with localStorage
      const wishlistIds = updated.map(item => item._id);
      localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
      return updated;
    });
  }, []);

  const addToOrder = (cardId) => {
    // Navigate to order page with this card pre-selected
    window.location.href = `/orders?card=${cardId}`;
  };

  if (!user) {
    return (
      <div className="wishlist-page">
        <div className="auth-required">
          <h3>Please log in to view your wishlist</h3>
          <p>Login to save your favorite chess sets and accessories</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="loading">Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">💝</div>
          <h3>Your wishlist is empty</h3>
          <p>Browse our products and add your favorites to your wishlist</p>
          <button 
            className="browse-btn"
            onClick={() => window.location.href = '/products'}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item._id} className="wishlist-item">
              <div className="item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} />
                ) : (
                  <div className="placeholder-image">
                    <span>♟️</span>
                  </div>
                )}
              </div>
              
              <div className="item-details">
                <h3>{item.title}</h3>
                <p className="item-description">{item.description || 'Premium chess set'}</p>
                <div className="item-price">₹{item.pricePerPiece}</div>
              </div>

              <div className="item-actions">
                <button 
                  className="order-btn"
                  onClick={() => addToOrder(item._id)}
                >
                  Order Now
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
