import React, { useEffect, useState } from "react";
import { cardService, orderService, getStoredUser } from "../../services/api";
import "./cards.css";
import axios from "axios";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCard, setEditingCard] = useState(null);
  const [orderingCard, setOrderingCard] = useState(null);
  const [orderForm, setOrderForm] = useState({ quantity: 1, notes: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  
  const user = getStoredUser();
  const isAdmin = user && user.role === 'admin';

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
      alert("Added to an order! It will take 24 hours to approve. We will meet as soon as possible, thanks for waiting and your precious time!");
      setOrderingCard(null);
      setOrderForm({ quantity: 1, notes: "" });
    } catch (err) {
      alert(err.message || "Failed to order. Make sure you are logged in.");
    }
  };

  const openOrderModal = (card) => {
    setOrderingCard(card);
    setOrderForm({ quantity: 1, notes: "" });
  };

  const startEditing = (card) => {
    setEditingCard({ ...card, newImage: null });
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
      if (editingCard.newImage) {
        formData.append("file", editingCard.newImage);
      }

      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:5000/api/cards/${editingCard._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      alert("Product updated successfully");
      setEditingCard(null);
      fetchCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update product");
    }
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
          filteredCards.map(card => (
            <div key={card._id} className="card-item">
              {card.image && (
                <img src={`http://localhost:5000${card.image}`} alt={card.title} className="card-img" />
              )}
              <div className="card-content">
                <div className="card-header">
                  <h3>{card.title}</h3>
                  <button 
                    className="wishlist-btn"
                    onClick={() => toggleWishlist(card._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    {isInWishlist(card._id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <p>{card.description}</p>
                <div className="card-details">
                  <span>Price: ₹{card.pricePerPiece}</span>
                  <span>Pieces: {card.pieceCount}</span>
                  {card.woodType && <span>Wood: {card.woodType}</span>}
                </div>

                <div style={{ marginTop: "15px" }}>
                  <button 
                    onClick={() => openOrderModal(card)} 
                    style={{ background: "#2ecc71", color: "white", padding: "10px", width: "100%", borderRadius: "5px", border: "none", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}
                    onMouseOver={(e) => e.target.style.background = "#27ae60"}
                    onMouseOut={(e) => e.target.style.background = "#2ecc71"}
                  >
                    Order This
                  </button>
                </div>
                
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => startEditing(card)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(card._id)} className="btn-delete">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
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
                type="file"
                onChange={e => setEditingCard({...editingCard, newImage: e.target.files[0]})}
              />
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
                <button type="submit" className="btn-save" style={{ background: "#2ecc71", transition: "0.2s" }} onMouseOver={(e) => e.target.style.background = "#27ae60"} onMouseOut={(e) => e.target.style.background = "#2ecc71"}>
                  Confirm Request
                </button>
                <button type="button" onClick={() => setOrderingCard(null)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
