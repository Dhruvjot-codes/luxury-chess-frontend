import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cardService, getImageUrl, getStoredUser, orderService } from "../../services/api";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [recommendations, setRecommendations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const user = getStoredUser();

  const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images.filter(Boolean);
    return [images];
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await cardService.getById(id);
        setProduct(data);
        setQuantity(1);
        setCurrentImageIndex(0);
      } catch (err) {
        setError(err.message || "Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    const loadRecommendations = async () => {
      try {
        const cards = await cardService.getAll();
        const filtered = Array.isArray(cards)
          ? cards.filter((item) => item._id !== id).slice(0, 4)
          : [];
        setRecommendations(filtered);
      } catch (err) {
        setRecommendations([]);
      }
    };

    if (id) {
      loadProduct();
      loadRecommendations();
    }
  }, [id]);

  const productImages = normalizeImages(product?.images);

  const nextImage = () => {
    if (!productImages.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    if (!productImages.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextImage();
    if (touchStart - touchEnd < -75) prevImage();
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(product?.pieceCount || 1, prev + delta)));
  };

  const handleOrderNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product) return;
    setStatus("loading");

    try {
      await orderService.createRequest(product._id, quantity, "Order placed from product page");
      setStatus("success");
    } catch (err) {
      setError(err.message || "Unable to place order.");
      setStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="product-loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="product-error">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-error">Product not found.</div>
      </div>
    );
  }

  const discountedPrice = Math.floor(product.pricePerPiece * (1 - (product.discountPercentage || 0) / 100));
  const savingAmount = Math.floor(product.pricePerPiece - discountedPrice);

  return (
    <div className="product-page">
      <div className="product-top-bar">
        <button className="back-button" onClick={() => navigate("/products")}>← Back to Collection</button>
        <span className="product-id">SKU: {product._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="product-hero-grid">
        <div className="product-hero-image">
          {productImages.length > 0 ? (
            <div
              className="image-slider-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={getImageUrl(productImages[currentImageIndex])}
                alt={product.title}
                className="full-display-img"
              />
              {productImages.length > 1 && (
                <>
                  <button className="slider-arrow prev" onClick={prevImage}>‹</button>
                  <button className="slider-arrow next" onClick={nextImage}>›</button>
                  <div className="slider-dots">
                    {productImages.map((_, index) => (
                      <span
                        key={index}
                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                  <div className="thumbnail-row">
                    {productImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={getImageUrl(image)} alt={`${product.title} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="image-placeholder">No image available</div>
          )}
        </div>

        <div className="product-hero-details">
          <div className="product-badge">Luxury Chess Set</div>
          <h1>{product.title}</h1>
          <p className="product-intro">{product.description}</p>

          <div className="product-price-block">
            <div className="price-current">₹{discountedPrice}</div>
            {product.discountPercentage > 0 && (
              <div className="price-original">MRP ₹{product.pricePerPiece}</div>
            )}
          </div>

          {product.discountPercentage > 0 && (
            <div className="product-savings">Save ₹{savingAmount} ({product.discountPercentage}% off)</div>
          )}

          <div className="product-meta-row">
            <div className="stock-pill">Stock available: {product.pieceCount}</div>
            {product.woodType && <div className="wood-pill">{product.woodType}</div>}
          </div>

          <div className="product-order-actions">
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.pieceCount}>+</button>
            </div>

            <button className="order-now-button" onClick={handleOrderNow} disabled={status === 'loading'}>
              {status === 'loading' ? 'Placing Order...' : 'Order Now'}
            </button>
          </div>

          {status === 'success' && <div className="order-success-banner">Your request has been submitted successfully. Admin will confirm shortly.</div>}
          {status === 'error' && <div className="order-error-banner">{error}</div>}

          <div className="product-quick-info">
            <div>
              <span>Price per piece</span>
              <strong>₹{product.pricePerPiece}</strong>
            </div>
            <div>
              <span>Order total</span>
              <strong>₹{discountedPrice * quantity}</strong>
            </div>
          </div>
        </div>
      </div>

      <section className="product-detail-section">
        <div className="product-detail-card">
          <h2>Product Details</h2>
          <p>{product.note || 'Premium craftsmanship, hand-selected woods, and elegant finish make this chess set a collector’s choice.'}</p>
          <div className="detail-items">
            {product.material && (
              <div><strong>Material:</strong> {product.material}</div>
            )}
            {product.dimensions && (
              <div><strong>Dimensions:</strong> {product.dimensions}</div>
            )}
            {product.inTheBox && (
              <div><strong>In the box:</strong> {product.inTheBox}</div>
            )}
            {product.weight && (
              <div><strong>Weight:</strong> {product.weight}</div>
            )}
            {product.suitableFor && (
              <div><strong>Suitable for:</strong> {product.suitableFor}</div>
            )}
          </div>
        </div>

        <div className="product-detail-card">
          <h2>Shipping & Payment</h2>
          <p>{product.shippingInfo || 'Worldwide shipping available. Local courier delivery within 5-10 days.'}</p>
          <p>{product.warrantyInfo || '1-year warranty on craftsmanship and finish.'}</p>
          <p>{product.securePaymentInfo || '100% secure payment with Razorpay and trusted checkout.'}</p>
        </div>
      </section>

      {recommendations.length > 0 && (
        <section className="recommendation-section">
          <div className="recommendation-header">
            <h2>You might also like</h2>
            <p>Handpicked alternatives from our premium collection.</p>
          </div>
          <div className="recommendations-grid">
            {recommendations.map((item) => {
              const itemPrice = Math.floor(item.pricePerPiece * (1 - (item.discountPercentage || 0) / 100));
              return (
                <button
                  type="button"
                  key={item._id}
                  className="recommendation-card"
                  onClick={() => navigate(`/products/${item._id}`)}
                >
                  <img src={getImageUrl(item.images?.[0])} alt={item.title} />
                  <div className="recommendation-copy">
                    <span className="recommendation-title">{item.title}</span>
                    <span className="recommendation-price">₹{itemPrice}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
