import React, { useEffect, useState } from "react";
import { cardService, getImageUrl } from "../../services/api";
import AdminCreateCard from "../../components/adminCreateCard/AdminCreateCard";

const ProductManagement = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await cardService.getAll();
      setCards(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await cardService.delete(id);
      setCards(cards.filter((c) => c._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
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

      formData.append("existingImages", JSON.stringify(editingCard.images || []));

      if (editingCard.newImages && editingCard.newImages.length > 0) {
        editingCard.newImages.forEach((file) => {
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

  const removeImage = (img) => {
    setEditingCard({
      ...editingCard,
      images: editingCard.images.filter((i) => i !== img),
    });
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="product-management">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Product Management</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "800" }}
        >
          {showCreateForm ? "Close Form" : "+ Add New Product"}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ marginBottom: "40px", padding: "20px", background: "#f8fafc", borderRadius: "10px" }}>
          <AdminCreateCard onSuccess={() => { setShowCreateForm(false); fetchCards(); }} />
        </div>
      )}

      <div className="product-list-table" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "12px" }}>Image</th>
              <th style={{ padding: "12px" }}>Title</th>
              <th style={{ padding: "12px" }}>Price</th>
              <th style={{ padding: "12px" }}>Discount</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>
                  <img src={getImageUrl(card.images[0])} alt="" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} />
                </td>
                <td style={{ padding: "12px" }}>{card.title}</td>
                <td style={{ padding: "12px" }}>₹{card.pricePerPiece}</td>
                <td style={{ padding: "12px" }}>{card.discountPercentage}%</td>
                <td style={{ padding: "12px" }}>
                  <button 
                    onClick={() => setEditingCard({ ...card, newImages: [] })}
                    style={{ marginRight: "10px", padding: "5px 10px", background: "#f39c12", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(card._id)}
                    style={{ padding: "5px 10px", background: "#e74c3c", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCard && (
        <div className="edit-modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000, overflowY: "auto", padding: "20px" }}>
          <div className="edit-modal" style={{ background: "white", padding: "30px", borderRadius: "15px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "20px", color: "#4542f5" }}>Edit {editingCard.title}</h2>
            <form onSubmit={handleUpdate} style={{ display: "grid", gap: "15px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Title</label>
                  <input style={{ width: "100%", padding: "10px" }} value={editingCard.title} onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })} required />
                </div>
                <div>
                  <label>Price</label>
                  <input type="number" style={{ width: "100%", padding: "10px" }} value={editingCard.pricePerPiece} onChange={(e) => setEditingCard({ ...editingCard, pricePerPiece: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Discount %</label>
                  <input type="number" style={{ width: "100%", padding: "10px" }} value={editingCard.discountPercentage} onChange={(e) => setEditingCard({ ...editingCard, discountPercentage: e.target.value })} />
                </div>
                <div>
                  <label>Piece Count</label>
                  <input type="number" style={{ width: "100%", padding: "10px" }} value={editingCard.pieceCount} onChange={(e) => setEditingCard({ ...editingCard, pieceCount: e.target.value })} required />
                </div>
              </div>

              <label>Description</label>
              <textarea style={{ width: "100%", padding: "10px", minHeight: "100px" }} value={editingCard.description} onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })} required />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Material</label>
                  <input style={{ width: "100%", padding: "10px" }} value={editingCard.material} onChange={(e) => setEditingCard({ ...editingCard, material: e.target.value })} />
                </div>
                <div>
                  <label>Dimensions</label>
                  <input style={{ width: "100%", padding: "10px" }} value={editingCard.dimensions} onChange={(e) => setEditingCard({ ...editingCard, dimensions: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label>Weight</label>
                  <input style={{ width: "100%", padding: "10px" }} value={editingCard.weight} onChange={(e) => setEditingCard({ ...editingCard, weight: e.target.value })} />
                </div>
                <div>
                  <label>Suitable For</label>
                  <input style={{ width: "100%", padding: "10px" }} value={editingCard.suitableFor} onChange={(e) => setEditingCard({ ...editingCard, suitableFor: e.target.value })} />
                </div>
              </div>

              <label>In The Box</label>
              <input style={{ width: "100%", padding: "10px" }} value={editingCard.inTheBox} onChange={(e) => setEditingCard({ ...editingCard, inTheBox: e.target.value })} />

              <div>
                <label>Manage Images</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "10px 0" }}>
                  {editingCard.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={getImageUrl(img)} alt="" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                      <button type="button" onClick={() => removeImage(img)} style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple onChange={(e) => setEditingCard({ ...editingCard, newImages: Array.from(e.target.files) })} />
              </div>

              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "#2ecc71", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Save Changes</button>
                <button type="button" onClick={() => setEditingCard(null)} style={{ flex: 1, padding: "12px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
