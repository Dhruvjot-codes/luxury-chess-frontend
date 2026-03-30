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
    image: null,
    images: []
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("pricePerPiece", formData.pricePerPiece);
      data.append("pieceCount", formData.pieceCount);
      data.append("woodType", formData.woodType);
      
      // Append multiple files to "files" field
      formData.images.forEach(file => {
        data.append("files", file);
      });

      const res = await cardService.create(data);
      alert("Product Created Successfully with " + formData.images.length + " images!");
      console.log(res);
      // Reset form or redirect? 
      e.target.reset();
      setFormData({ ...formData, images: [] });

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
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pricePerPiece"
          placeholder="Price Per Piece"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pieceCount"
          placeholder="Total Pieces"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="woodType"
          placeholder="Wood Type"
          onChange={handleChange}
        />

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

        <button type="submit">
          Create Card
        </button>

      </form>

    </section>
  );
};

export default AdminCreateCard;