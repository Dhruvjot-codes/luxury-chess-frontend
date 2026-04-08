import React, { useState, useEffect } from "react";
import "./header.css";
const logo = "/logo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthToken, getStoredUser } from "../../services/api";
import ProfileDropdown from "../profile/ProfileDropdown";
import Sidebar from "../sidebar/Sidebar";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
  }, [location]);

  const authRoutes = ["/login", "/register", "/verify", "/forgot-password"];
  const isAuthPage = authRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  return (
    <>
      <header className="apple-header">
        <div className="header-inner">
          {!isAuthPage && (
            <button
              className={`menu-button ${isSidebarOpen ? "active" : ""}`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}

          <Link to="/" className="logo-container">
            <img src={logo} alt="The Luxury Chess Staunton" className="header-logo" />
            <div className="logo-text">
              <span>THE LUXURY CHESS</span>
              <span className="logo-subtext">STAUNTON</span>
            </div>
          </Link>

          <nav className="desktop-nav">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            <span className="nav-separator">|</span>
            <div className="nav-dropdown">
              <Link to="/products" className={location.pathname === "/products" ? "active" : ""}>
                Products
                <svg className="dropdown-chevron" width="10" height="10" viewBox="0 0 10 10">
                  <path d="M1 3.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="dropdown-content">
                <Link to="/products?category=Chess Pieces">Chess Pieces</Link>
                <Link to="/products?category=Chess Boards">Chess Boards</Link>
                <Link to="/products?category=Box">Chess Box</Link>
                <Link to="/products?category=Set">Chess Set</Link>
              </div>
            </div>
            <span className="nav-separator">|</span>
            <a href="/#about">About Us</a>
            <span className="nav-separator">|</span>
            <a href="/#contact">Contact Us</a>
          </nav>

          <div className="header-actions">
            {user ? (
              <ProfileDropdown />
            ) : (
              <div className="auth-links">
                <Link to="/login" className="login-link">Login</Link>
                <Link to="/register" className="register-button">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;