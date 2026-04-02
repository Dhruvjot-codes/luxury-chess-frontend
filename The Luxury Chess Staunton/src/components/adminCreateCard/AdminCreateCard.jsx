import React, { useState } from "react";
import "./adminCreateCard.css";
import { cardService } from "../../services/api";

const AdminCreateCard = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerPiece: "",
    pieceCount: "",
    woodType: "",
    discountPercentage: "",
    material: "",
    dimensions: "",
    inTheBox: "",
    weight: "",
    suitableFor: "",
    note: "",
    disclaimer: "",
    shippingInfo: "",
    deliveryPrice: "",
    warrantyInfo: "",
    securePaymentInfo: "",
    image: null,
    images: []
  });

  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      alert("You can only upload up to 10 images");
      e.target.value = null;
      return;
    }
    setFormData({
      ...formData,
      images: selectedFiles
    });

    // Generate previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("pricePerPiece", formData.pricePerPiece);
      data.append("pieceCount", formData.pieceCount);
      data.append("woodType", formData.woodType || "");
      data.append("discountPercentage", formData.discountPercentage || 0);
      data.append("material", formData.material || "");
      data.append("dimensions", formData.dimensions || "");
      data.append("inTheBox", formData.inTheBox || "");
      data.append("weight", formData.weight || "");
      data.append("suitableFor", formData.suitableFor || "");
      data.append("note", formData.note || "");
      data.append("disclaimer", formData.disclaimer || "");
      data.append("shippingInfo", formData.shippingInfo || "");
      data.append("deliveryPrice", formData.deliveryPrice || "");
      data.append("warrantyInfo", formData.warrantyInfo || "");
      data.append("securePaymentInfo", formData.securePaymentInfo || "");
      
      // Append multiple files to "files" field
      formData.images.forEach(file => {
        data.append("files", file);
      });

      const res = await cardService.create(data);
      alert("Product Created Successfully with " + formData.images.length + " images!");
      setFormData({
        title: "",
        description: "",
        pricePerPiece: "",
        pieceCount: "",
        woodType: "",
        discountPercentage: "",
        material: "",
        dimensions: "",
        inTheBox: "",
        weight: "",
        suitableFor: "",
        note: "",
        disclaimer: "",
        shippingInfo: "",
        deliveryPrice: "",
        warrantyInfo: "",
        securePaymentInfo: "",
        image: null,
        images: []
      });
      setPreviews([]);

    } catch (error) {
      console.log(error);
      alert("Error creating product: " + (error.message || "Unknown error"));
    }
  };

  return (

    <section className="admin-card">

      <h2>Create New Chess Product</h2>

      <form onSubmit={handleSubmit} className="admin-form">

        <input
          type="text"
          name="title"
          placeholder="Chess Set Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pricePerPiece"
          placeholder="Price"
          value={formData.pricePerPiece}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pieceCount"
          placeholder="Total Pieces"
          value={formData.pieceCount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="woodType"
          placeholder="Wood Type"
          value={formData.woodType}
          onChange={handleChange}
        />

        <input
          type="number"
          name="discountPercentage"
          placeholder="Discount Percentage (e.g., 20)"
          value={formData.discountPercentage}
          onChange={handleChange}
          min="0"
          max="100"
        />

        <div className="form-section-title">Specifications & Information</div>
        <input name="material" value={formData.material} placeholder="Material (e.g., Boxwood & Ebony)" onChange={handleChange} />
        <input name="dimensions" value={formData.dimensions} placeholder='Dimensions (e.g., 4.5" King)' onChange={handleChange} />
        <input name="inTheBox" value={formData.inTheBox} placeholder="What's in the box? (Include all items)" onChange={handleChange} />
        <input name="weight" value={formData.weight} placeholder="Total Weight" onChange={handleChange} />
        <input name="suitableFor" value={formData.suitableFor} placeholder='Suitable for (e.g., 18" board)' onChange={handleChange} />
        
        <div className="form-section-title">Detailed Descriptions</div>
        <textarea name="note" value={formData.note} placeholder="Note (Important information)" onChange={handleChange} />
        <textarea name="disclaimer" value={formData.disclaimer} placeholder="Disclaimer" onChange={handleChange} />
        <textarea name="shippingInfo" value={formData.shippingInfo} placeholder="Shipping Information" onChange={handleChange} />
        
        <div className="form-section-title">Warranty & Secure Payment</div>
        <input name="deliveryPrice" value={formData.deliveryPrice} placeholder="Delivery Price (or Free Shipping)" onChange={handleChange} />
        <textarea name="warrantyInfo" value={formData.warrantyInfo} placeholder="Warranty Information" onChange={handleChange} />
        <textarea name="securePaymentInfo" value={formData.securePaymentInfo} placeholder="Secure Payment Details" onChange={handleChange} />

        <div style={{ margin: "10px 0", textAlign: "left" }}>
          <label style={{ fontSize: "14px", color: "#666" }}>Select images (Max 10)</label>
          <input
            type="file"
            onChange={handleFiles}
            multiple
            accept="image/*"
            required
          />
        </div>

        {previews.length > 0 && (
          <div className="image-previews" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {previews.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`Preview ${index}`} 
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} 
              />
            ))}
          </div>
        )}

        <button type="submit">
          Create Product Card
        </button>

      </form>

    </section>
  );
};

export default AdminCreateCard;