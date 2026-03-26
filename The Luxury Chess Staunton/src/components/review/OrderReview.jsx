import React, { useState } from 'react';
import { orderService } from '../../services/api';
import './OrderReview.css';

const OrderReview = ({ order, onReviewSubmitted }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      
      const reviewData = {
        orderId: order._id,
        cardId: order.items[0].card._id,
        rating,
        comment: comment.trim(),
      };

      // This would need a review service - for now we'll simulate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Review submitted successfully!');
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${interactive && i <= rating ? 'active' : ''}`}
          onClick={interactive ? () => setRating(i) : undefined}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (order.status !== 'delivered') {
    return null;
  }

  return (
    <div className="order-review">
      {!showReviewForm ? (
        <div className="review-prompt">
          <h4>Rate Your Experience</h4>
          <p>How was your experience with this order?</p>
          <button 
            className="review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="review-form">
          <h4>Write a Review</h4>
          <p>Share your experience with {order.items[0].card.title}</p>
          
          <form onSubmit={handleSubmitReview}>
            <div className="rating-section">
              <label>Rating *</label>
              <div className="stars-container">
                {renderStars(true)}
              </div>
            </div>

            <div className="comment-section">
              <label htmlFor="comment">Your Review</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                maxLength={500}
              />
              <small>{comment.length}/500 characters</small>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setComment('');
                  setError('');
                  setSuccess('');
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrderReview;
