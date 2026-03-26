import React, { useState } from "react";
import "./adminCreateCard.css";
import axios from "axios";

const AdminCreateCard = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerPiece: "",
    pieceCount: "",
    woodType: "",
    image: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
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
      data.append("file", formData.image);

      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "http://localhost:5000/api/cards",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      alert("Card Created Successfully");

      console.log(res.data);

    } catch (error) {

      console.log(error);
      alert("Error creating card");

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

        <input
          type="file"
          onChange={handleFile}
          required
        />

        <button type="submit">
          Create Card
        </button>

      </form>

    </section>
  );
};

export default AdminCreateCard;