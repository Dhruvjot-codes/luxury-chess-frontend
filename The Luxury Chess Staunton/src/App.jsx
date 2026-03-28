import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Cards from "./pages/cards/Cards";
import AdminDashboard from "./pages/auth/AdminDashboard";
import Offers from "./pages/offers/Offers";
import Orders from "./pages/orders/Orders";
import OrderHistory from "./pages/order-history/OrderHistory";
import Forgot from "./pages/auth/Forgot";
import ResetPassword from "./pages/auth/ResetPassword";
import Wishlist from "./components/wishlist/Wishlist";
import ProductSearch from "./components/search/ProductSearch";
import WhatsAppButton from "./components/whatsapp/WhatsAppButton";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/products" element={<Cards />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<ProductSearch />} />
      </Routes>
      <WhatsAppButton />
    </BrowserRouter>
  );
};

export default App;