import React, { useEffect, useState } from "react";
import { cardService, orderService, getStoredUser, getImageUrl } from "../../services/api";
import "./cards.css";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCard, setEditingCard] = useState(null);
  const [orderingCard, setOrderingCard] = useState(null);
  const [orderForm, setOrderForm] = useState({ cardId: null, quantity: 1, notes: "" });
  const [orderSuccess, setOrderSuccess] = useState(null); // cardId of successfull order
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [activePopupProduct, setActivePopupProduct] = useState(null);
  const [popupOrderSuccess, setPopupOrderSuccess] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const user = getStoredUser();
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDirectOrder = async (card, quantity) => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
    try {
      await orderService.createRequest(card._id, quantity, "Quick order from products page");
      setOrderSuccess(card._id);
      setTimeout(() => {
        setOrderSuccess(null);
        setOrderForm({ cardId: null, quantity: 1, notes: "" });
      }, 3000);
    } catch (err) {
      alert(err.message || "Failed to place order.");
    }
  };

  useEffect(() => {
    if (activePopupProduct) {
      setCartQuantity(1);
    }
  }, [activePopupProduct]);

  useEffect(() => {
    fetchCards();
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        }
      }
    } catch (error) {
      setWishlist([]);
    }
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await cardService.getAll();
      
      // The apiCall function returns data directly, not response.data
      const cardsData = response;
      
      // Ensure we have an array before setting state
      if (Array.isArray(cardsData)) {
        setCards(cardsData);
        setError("");
      } else {
        setCards([]);
        setError("Unable to load products. Please try again later.");
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError("Failed to load products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (cardId) => {
    setWishlist(prevWishlist => {
      const newWishlist = [...prevWishlist];
      const index = newWishlist.indexOf(cardId);
      
      if (index > -1) {
        newWishlist.splice(index, 1);
      } else {
        newWishlist.push(cardId);
      }
      
      // Update localStorage with the new wishlist
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (cardId) => {
    return wishlist.includes(cardId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await cardService.delete(id);
      setCards(cards.filter(c => c._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderingCard) return;
    try {
      await orderService.createRequest(orderingCard._id, orderForm.quantity, orderForm.notes);
      
      setOrderSuccess(orderingCard._id);
      
      // Keep it open for 3 seconds then clear
      setTimeout(() => {
        setOrderSuccess(null);
        setOrderingCard(null);
        setOrderForm({ quantity: 1, notes: "" });
      }, 3000);

    } catch (err) {
      alert(err.message || "Failed to order. Make sure you are logged in.");
    }
  };

  const handlePopupOrder = async () => {
    if (!activePopupProduct) return;
    try {
      await orderService.createRequest(activePopupProduct._id, cartQuantity, "Order from product detail popup");
      setPopupOrderSuccess(true);
      setTimeout(() => setPopupOrderSuccess(false), 4000);
    } catch (err) {
      alert("Please log in to place an order.");
    }
  };

  const openOrderModal = (card) => {
    setOrderingCard(card);
    setOrderForm({ quantity: 1, notes: "" });
  };

  const startEditing = (card) => {
    setEditingCard({ 
      ...card, 
      newImages: [],
      discountPercentage: card.discountPercentage || 0,
      material: card.material || "",
      dimensions: card.dimensions || "",
      inTheBox: card.inTheBox || "",
      weight: card.weight || "",
      suitableFor: card.suitableFor || "",
      note: card.note || "",
      disclaimer: card.disclaimer || "",
      shippingInfo: card.shippingInfo || "",
      deliveryPrice: card.deliveryPrice || "",
      warrantyInfo: card.warrantyInfo || "",
      securePaymentInfo: card.securePaymentInfo || ""
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editingCard.title);
      formData.append("description", editingCard.description);
      formData.append("pricePerPiece", editingCard.pricePerPiece);
      formData.append("pieceCount", editingCard.pieceCount);
      formData.append("woodType", editingCard.woodType || "");
      formData.append("discountPercentage", editingCard.discountPercentage || 0);
      formData.append("material", editingCard.material || "");
      formData.append("dimensions", editingCard.dimensions || "");
      formData.append("inTheBox", editingCard.inTheBox || "");
      formData.append("weight", editingCard.weight || "");
      formData.append("suitableFor", editingCard.suitableFor || "");
      formData.append("note", editingCard.note || "");
      formData.append("disclaimer", editingCard.disclaimer || "");
      formData.append("shippingInfo", editingCard.shippingInfo || "");
      formData.append("deliveryPrice", editingCard.deliveryPrice || "");
      formData.append("warrantyInfo", editingCard.warrantyInfo || "");
      formData.append("securePaymentInfo", editingCard.securePaymentInfo || "");
      
      // Send existing images that were not removed
      formData.append("existingImages", JSON.stringify(editingCard.images || []));
      
      if (editingCard.newImages && editingCard.newImages.length > 0) {
        editingCard.newImages.forEach(file => {
          formData.append("files", file);
        });
      }

      await cardService.update(editingCard._id, formData);

      alert("Product updated successfully");
      setEditingCard(null);
      fetchCards();
    } catch (err) {
      alert(err.message || "Failed to update product");
    }
  };

  const removeExistingImage = (imageUrl) => {
    setEditingCard({
      ...editingCard,
      images: editingCard.images.filter(img => img !== imageUrl)
    });
  };

  if (loading) return <div className="cards-loading">Loading products...</div>;
  if (error) return <div className="cards-error">{error}</div>;

  // Enhanced search with better performance
  const filteredCards = cards.filter(card => {
    const matchesSearch = !searchTerm || 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.woodType && card.woodType.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Limit number of items on mobile as requested
  const displayedCards = (isMobile && !searchTerm) 
    ? filteredCards.slice(0, Math.ceil(filteredCards.length / 2)) 
    : filteredCards;

  return (
    <div className="cards-page">
      <h1>Our Products</h1>
      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input 
          type="text" 
          placeholder="Search products by title, description, or wood type..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "12px", width: "80%", maxWidth: "500px", borderRadius: "25px", border: "1px solid #cbd5e1", fontSize: "16px", outline: "none" }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            style={{ 
              marginLeft: "10px", 
              padding: "12px 20px", 
              borderRadius: "25px", 
              border: "1px solid #ef4444", 
              background: "#ef4444", 
              color: "white", 
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="cards-grid">
        {cards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h3>No products available at the moment.</h3>
            <p>Please check back later or contact us for more information.</p>
          </div>
        ) : filteredCards.length === 0 && searchTerm ? (
          <p>No products available matching your search.</p>
        ) : filteredCards.length === 0 ? (
          <p>No products available.</p>
        ) : (
          displayedCards.map(card => {
            const discountedPrice = card.pricePerPiece * (1 - (card.discountPercentage || 0) / 100);
            const cardId = card._id;
            const currentQty = orderForm.cardId === cardId ? orderForm.quantity : 1;

            return (
              <div 
                key={card._id} 
                className={`card-item ${orderSuccess === cardId ? 'order-success' : ''}`}
              >
                {/* SUCCESS OVERLAY */}
                {orderSuccess === cardId && (
                  <div className="order-success-card-overlay">
                    <div className="success-icon">✓</div>
                    <h3>CONFIRMED!</h3>
                    <p>Successfully added</p>
                  </div>
                )}

                {card.images && card.images.length > 0 && (
                  <div className="card-img-container" onClick={() => setActivePopupProduct(card)}>
                    <div className="main-img-wrapper" style={{ position: 'relative', height: '100%' }}>
                      <img src={getImageUrl(card.images[0])} alt={card.title} className="card-img" />
                      <div className="view-details-overlay">View Details</div>
                      {(card.discountPercentage || 0) > 0 && (
                        <div className="discount-badge-grid">
                          {card.discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="card-content">
                  <div className="card-header">
                    <h3 onClick={() => setActivePopupProduct(card)} style={{ cursor: 'pointer' }}>{card.title}</h3>
                    <button 
                      className="wishlist-btn"
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(card._id); }}
                    >
                      {isInWishlist(card._id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  <div className="card-price-info">
                    {card.discountPercentage > 0 ? (
                      <>
                        <span className="price-current">₹{Math.floor(discountedPrice)}</span>
                        <span className="price-original">₹{card.pricePerPiece}</span>
                      </>
                    ) : (
                      <span className="price-current">₹{card.pricePerPiece}</span>
                    )}
                  </div>

                  <div className="card-details">
                    <span>Pieces: {card.pieceCount}</span>
                    {card.woodType && <span>Wood: {card.woodType}</span>}
                  </div>

                  {/* DIRECT ORDER ACTION */}
                  <div className="card-action-bar" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                     <div className="qty-selector-small" style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                        <button 
                          style={{ border: 'none', background: 'white', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                          onClick={(e) => { e.stopPropagation(); setOrderForm({ cardId: card._id, quantity: Math.max(1, currentQty - 1) }) }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 12px', fontWeight: 'bold', fontSize: '0.9rem' }}>{currentQty}</span>
                        <button 
                          style={{ border: 'none', background: 'white', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                          onClick={(e) => { e.stopPropagation(); setOrderForm({ cardId: card._id, quantity: currentQty + 1 }) }}
                        >
                          +
                        </button>
                     </div>
                     <button 
                       className="btn-direct-order"
                       style={{ 
                         flex: 1, 
                         background: '#2563eb', 
                         color: 'white', 
                         border: 'none', 
                         borderRadius: '10px', 
                         fontWeight: '800', 
                         fontSize: '0.85rem',
                         cursor: 'pointer',
                         transition: '0.3s'
                       }}
                       onClick={(e) => {
                         e.stopPropagation();
                         const finalQty = currentQty;
                         setOrderingCard(card);
                         // Trigger actual order logic
                         const mockEvent = { preventDefault: () => {} };
                         // We need to ensure handleOrderSubmit uses the right data
                         // I'll update handleOrderSubmit to take parameters optionally
                         handleDirectOrder(card, finalQty);
                       }}
                       onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
                       onMouseOut={(e) => e.target.style.background = '#2563eb'}
                     >
                       Confirm Order
                     </button>
                  </div>

                  {isAdmin && (
                    <div className="admin-actions" style={{ marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <button onClick={(e) => { e.stopPropagation(); startEditing(card); }} className="btn-edit">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(card._id); }} className="btn-delete">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingCard && (
        <div className="edit-modal-backdrop">
          <div className="edit-modal">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate} className="edit-form">
              <input
                type="text"
                value={editingCard.title}
                onChange={e => setEditingCard({...editingCard, title: e.target.value})}
                placeholder="Title"
                required
              />
              <textarea
                value={editingCard.description}
                onChange={e => setEditingCard({...editingCard, description: e.target.value})}
                placeholder="Description"
                required
              />
              <input
                type="number"
                value={editingCard.pricePerPiece}
                onChange={e => setEditingCard({...editingCard, pricePerPiece: e.target.value})}
                placeholder="Price"
                required
              />
              <input
                type="number"
                value={editingCard.pieceCount}
                onChange={e => setEditingCard({...editingCard, pieceCount: e.target.value})}
                placeholder="Piece Count"
                required
              />
              <input
                type="text"
                value={editingCard.woodType}
                onChange={e => setEditingCard({...editingCard, woodType: e.target.value})}
                placeholder="Wood Type"
              />
              <input
                type="number"
                value={editingCard.discountPercentage}
                onChange={e => setEditingCard({...editingCard, discountPercentage: e.target.value})}
                placeholder="Discount % (e.g., 20)"
                min="0"
                max="100"
              />
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Specifications</label>
              <input value={editingCard.material} onChange={e => setEditingCard({...editingCard, material: e.target.value})} placeholder="Material" />
              <input value={editingCard.dimensions} onChange={e => setEditingCard({...editingCard, dimensions: e.target.value})} placeholder="Dimensions" />
              <input value={editingCard.inTheBox} onChange={e => setEditingCard({...editingCard, inTheBox: e.target.value})} placeholder="In the box" />
              <input value={editingCard.weight} onChange={e => setEditingCard({...editingCard, weight: e.target.value})} placeholder="Weight" />
              <input value={editingCard.suitableFor} onChange={e => setEditingCard({...editingCard, suitableFor: e.target.value})} placeholder="Suitable for" />
              
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Detailed Descriptions</label>
              <textarea value={editingCard.note} onChange={e => setEditingCard({...editingCard, note: e.target.value})} placeholder="Note" />
              <textarea value={editingCard.disclaimer} onChange={e => setEditingCard({...editingCard, disclaimer: e.target.value})} placeholder="Disclaimer" />
              <textarea value={editingCard.shippingInfo} onChange={e => setEditingCard({...editingCard, shippingInfo: e.target.value})} placeholder="Shipping info" />
              
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Warranty & Delivery</label>
              <input value={editingCard.deliveryPrice} onChange={e => setEditingCard({...editingCard, deliveryPrice: e.target.value})} placeholder="Delivery Price" />
              <textarea value={editingCard.warrantyInfo} onChange={e => setEditingCard({...editingCard, warrantyInfo: e.target.value})} placeholder="Warranty" />
              <textarea value={editingCard.securePaymentInfo} onChange={e => setEditingCard({...editingCard, securePaymentInfo: e.target.value})} placeholder="Secure payment" />
              <div className="image-management" style={{ margin: '10px 0' }}>
                <p style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>Current Images:</p>
                <div className="existing-images" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  {editingCard.images && editingCard.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={getImageUrl(img)} alt={`Current ${idx}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(img)}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>Add New Images:</label>
                <input
                  type="file"
                  multiple
                  onChange={e => setEditingCard({...editingCard, newImages: Array.from(e.target.files)})}
                />
              </div>
              <div className="edit-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" onClick={() => setEditingCard(null)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orderingCard && (
        <div className="edit-modal-backdrop">
          <div className="edit-modal">
            <h2 style={{ marginBottom: "20px" }}>Order {orderingCard.title}</h2>
            
            {orderSuccess === orderingCard._id ? (
              <div className="order-success-overlay-inline">
                <div className="success-icon">✓</div>
                <h3>CONfIRMED!</h3>
                <p>Order request placed successfully.</p>
                <p className="sub-hint">We'll review it within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="edit-form">
                <label style={{ fontWeight: "bold", color: "#333" }}>Quantity Required</label>
                <input
                  type="number"
                  value={orderForm.quantity}
                  onChange={e => setOrderForm({...orderForm, quantity: Math.max(1, parseInt(e.target.value) || 1)})}
                  min="1"
                  style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "15px" }}
                  required
                />
                
                <label style={{ fontWeight: "bold", color: "#333" }}>Any other preferred product / Special Instructions (Optional)</label>
                <textarea
                  value={orderForm.notes}
                  onChange={e => setOrderForm({...orderForm, notes: e.target.value})}
                  placeholder="Tell us any specific requirements or distinct products you'd prefer..."
                  rows="4"
                  style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
                
                <div className="edit-actions" style={{ marginTop: "20px" }}>
                  <button type="submit" className="btn-save" style={{ background: "#2563eb", transition: "0.2s" }} onMouseOver={(e) => e.target.style.background = "#1d4ed8"} onMouseOut={(e) => e.target.style.background = "#2563eb"}>
                    Confirm Request
                  </button>
                  <button type="button" onClick={() => setOrderingCard(null)} className="btn-cancel">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {activePopupProduct && (
        <div className="product-popup-overlay" onClick={() => setActivePopupProduct(null)}>
          <div className="product-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={() => setActivePopupProduct(null)}>×</button>
            
            <div className="popup-main-grid">
              <div className="popup-image-gallery">
                <ImageSlider images={activePopupProduct.images} getImageUrl={getImageUrl} title={activePopupProduct.title} />
              </div>
              
              <div className="popup-details">
                <h1 className="popup-title">{activePopupProduct.title}</h1>
                
                <div className="popup-price-box">
                  {activePopupProduct.discountPercentage > 0 ? (
                    <>
                      <div className="price-primary">
                        <span className="current">₹{Math.floor(activePopupProduct.pricePerPiece * (1 - activePopupProduct.discountPercentage / 100))}</span>
                        <span className="original">₹{activePopupProduct.pricePerPiece}</span>
                        <span className="discount-tag">{activePopupProduct.discountPercentage}% OFF</span>
                      </div>
                      <div className="savings-msg">You Save: ₹{Math.floor(activePopupProduct.pricePerPiece * activePopupProduct.discountPercentage / 100)}</div>
                    </>
                  ) : (
                    <div className="price-primary">
                      <span className="current">₹{activePopupProduct.pricePerPiece}</span>
                    </div>
                  )}
                </div>

                <div className="quantity-control">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-btns">
                    <button onClick={() => setCartQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span>{cartQuantity}</span>
                    <button onClick={() => setCartQuantity(q => q + 1)}>+</button>
                  </div>
                </div>

                {popupOrderSuccess ? (
                  <div className="order-success-overlay-inline" style={{ margin: "20px 0" }}>
                    <div className="success-icon" style={{ fontSize: "2rem" }}>✓</div>
                    <h3>CONFIRMED!</h3>
                    <p style={{ fontSize: "0.9rem" }}>Successfully added to your orders.</p>
                  </div>
                ) : (
                  <button 
                    className="popup-order-btn" 
                    onClick={handlePopupOrder}
                  >
                    Add To Order / Inquire
                  </button>
                )}

                <div className="popup-accordions">
                  <Accordion title="Product Detail" isOpenDefault={true}>
                    <div className="accordion-content">
                      <p><strong>Material:</strong> {activePopupProduct.material}</p>
                      <p><strong>Dimensions:</strong> {activePopupProduct.dimensions}</p>
                      <p><strong>Inside The Box:</strong> {activePopupProduct.inTheBox}</p>
                      <p><strong>Weight:</strong> {activePopupProduct.weight}</p>
                      <p><strong>Suitable For:</strong> {activePopupProduct.suitableFor}</p>
                    </div>
                  </Accordion>
                  <Accordion title="Detailed Description">
                    <div className="accordion-content">
                      <p><strong>Description:</strong> {activePopupProduct.description}</p>
                      {activePopupProduct.note && <p><strong>Note:</strong> {activePopupProduct.note}</p>}
                      {activePopupProduct.disclaimer && <p><strong>Disclaimer:</strong> {activePopupProduct.disclaimer}</p>}
                    </div>
                  </Accordion>
                  <Accordion title="Shipping">
                    <div className="accordion-content">
                      <p>{activePopupProduct.shippingInfo || "Contact us for worldwide shipping details."}</p>
                    </div>
                  </Accordion>
                  <Accordion title="Warranty & Payments">
                    <div className="accordion-content">
                      <p><strong>Delivery Price:</strong> {activePopupProduct.deliveryPrice || "Standard shipping rates apply."}</p>
                      <p><strong>Warranty:</strong> {activePopupProduct.warrantyInfo}</p>
                      <p><strong>Secure Payment:</strong> {activePopupProduct.securePaymentInfo || "100% secure payment gateway."}</p>
                    </div>
                  </Accordion>
                </div>
              </div>
            </div>

            <div className="popup-recommendations">
              <h3>You May Also Like</h3>
              <div className="recommendations-grid">
                {cards.filter(c => c._id !== activePopupProduct._id).slice(0, 4).map(prod => (
                  <div key={prod._id} className="rec-item" onClick={() => setActivePopupProduct(prod)}>
                    <img src={getImageUrl(prod.images[0])} alt={prod.title} />
                    <p>{prod.title}</p>
                    <span>₹{prod.pricePerPiece}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const ImageSlider = ({ images, getImageUrl, title }) => {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) next();
    if (touchStart - touchEnd < -75) prev();
  };

  if (!images || images.length === 0) return null;
  return (
    <div 
      className="image-slider-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img src={getImageUrl(images[index])} alt={title} className="full-display-img" />
      {images.length > 1 && (
        <>
          <button className="slider-arrow prev" onClick={prev}>‹</button>
          <button className="slider-arrow next" onClick={next}>›</button>
          <div className="slider-dots">
            {images.map((_, i) => (
              <span key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Accordion = ({ title, children, isOpenDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};

export default Cards;
