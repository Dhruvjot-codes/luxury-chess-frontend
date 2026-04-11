import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Cards from "./pages/cards/Cards";
import ProductPage from "./pages/cards/ProductPage";
import AdminDashboard from "./pages/auth/AdminDashboard";
import Offers from "./pages/offers/Offers";
import Orders from "./pages/orders/Orders";
import OrderHistory from "./pages/order-history/OrderHistory";
import Forgot from "./pages/auth/Forgot";
import ResetPassword from "./pages/auth/ResetPassword";
import Wishlist from "./components/wishlist/Wishlist";
import ProductSearch from "./components/search/ProductSearch";
import WhatsAppButton from "./components/whatsapp/WhatsAppButton";

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Pages where sidebar should be hidden
  const authRoutes = ["/login", "/register", "/verify", "/forgot-password"];
  const isAuthPage = authRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 || isAuthPage) {
        setIsSidebarOpen(false);
      } else {
        // Only reopen if NOT an auth page
        if (!isAuthPage) setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAuthPage]);

  return (
    <>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      {!isAuthPage && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      
      <div className={`content-with-sidebar ${isSidebarOpen && !isAuthPage ? '' : 'full-width'} ${isAuthPage ? 'auth-layout' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/products" element={<Cards />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<ProductSearch />} />
        </Routes>
      </div>

      <WhatsAppButton />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;