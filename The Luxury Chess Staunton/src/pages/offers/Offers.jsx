import React, { useEffect, useState } from "react";
import { offerService, getStoredUser, getImageUrl } from "../../services/api";
import "./offers.css";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const user = getStoredUser();
  const isAdmin = user && user.role === 'admin';

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    images: []
  });

  const [previews, setPreviews] = useState([]);

  const fetchOffers = async () => {
    try {
      const data = isAdmin ? await offerService.getAll() : await offerService.getActive();
      setOffers(data);
    } catch (err) {
      setError(err.message || "Failed to load offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [isAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({ ...formData, images: selectedFiles });
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("discountPercentage", formData.discountPercentage);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      
      formData.images.forEach(file => {
        data.append("files", file);
      });

      await offerService.create(data);
      alert("Offer created successfully!");
      setFormData({
        title: "",
        description: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
        images: []
      });
      setPreviews([]);
      fetchOffers();
    } catch (err) {
      alert(err.message || "Failed to create offer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await offerService.delete(id);
      setOffers(offers.filter(o => o._id !== id));
      alert("Offer deleted successfully.");
    } catch (err) {
      alert(err.message || "Failed to delete offer");
    }
  };

  if (loading) return <div className="offers-page"><div className="offers-loading">Loading amazing offers...</div></div>;

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h1>Exclusive Offers</h1>
        <p>Discover our latest discounts on handcrafted luxury chess sets.</p>
      </div>

      {isAdmin && (
        <div className="admin-offer-creation">
          <h2>Create New Offer</h2>
          <form onSubmit={handleCreate} className="admin-offer-form">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Offer Title" required />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Offer Description" required />
            <div className="form-row">
              <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} placeholder="Discount % (e.g., 20)" min="1" max="100" required />
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Start Date" required />
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="End Date" required />
            </div>
            <div style={{ margin: "10px 0", textAlign: "left" }}>
              <label style={{ fontSize: "14px", color: "#666" }}>Select Offer Images (Optional)</label>
              <input type="file" onChange={handleFiles} multiple accept="image/*" />
            </div>
            {previews.length > 0 && (
              <div className="preview-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {previews.map((src, i) => <img key={i} src={src} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />)}
              </div>
            )}
            <button type="submit" className="btn-create-offer">Publish Offer</button>
          </form>
        </div>
      )}

      {error && <div className="offers-error">{error}</div>}

      <div className="offers-grid">
        {offers.length === 0 ? (
          <p className="no-offers">There are currently no active offers. Check back soon!</p>
        ) : (
          offers.map(offer => {
            const isExpired = new Date(offer.endDate) < new Date();
            const isActive = offer.isActive && !isExpired;
            
            return (
              <div key={offer._id} className={`offer-card ${!isActive ? 'expired' : ''}`}>
                <div className="offer-discount">
                  <span>{offer.discountPercentage}% OFF</span>
                </div>
                {offer.images && offer.images.length > 0 && (
                  <div className="offer-image-container" style={{ margin: '15px' }}>
                    <img src={getImageUrl(offer.images[0])} alt={offer.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
                <div className="offer-content">
                  <h3>{offer.title}</h3>
                  <p className="offer-desc">{offer.description}</p>
                  
                  <div className="offer-dates">
                    <small>
                      <strong>Valid:</strong> {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </small>
                  </div>
                  
                  {isAdmin && (
                    <div className="admin-offer-actions">
                      <span className="offer-status-badge">
                        {isActive ? 'Active' : 'Expired/Inactive'}
                      </span>
                      <button onClick={() => handleDelete(offer._id)} className="btn-delete-offer">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Offers;
