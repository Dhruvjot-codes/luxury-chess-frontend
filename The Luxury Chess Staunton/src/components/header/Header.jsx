import React, { useState, useEffect } from "react";
import "./header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthToken, getStoredUser, authService } from "../../services/api";
import ProfileDropdown from "../profile/ProfileDropdown";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load user from localStorage when component mounts or location changes
    const token = getAuthToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    closeMenu();
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <div className="header-inner">
        <div className="logo">The Luxury Chess Staunton</div>

        <button
          className={`menu-toggle ${isOpen ? "menu-toggle--open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`link ${isOpen ? "link--open" : ""}`}>
          <Link to={"/"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home
          </Link>
          <Link to={"/products"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Our Products
          </Link>
          <Link to={"/offers"} onClick={closeMenu} style={{ color: "#ef4444", fontWeight: "bold", display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            Special Offers
          </Link>
          <a href="/#about" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            About Us
          </a>
          <a href="/#contact" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Contact Us
          </a>
          <Link to={"/orders"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Your Order
          </Link>
          <Link to={"/order-history"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline><path d="M5.12 5.12L12 12m0 0l6.88-6.88"></path></svg>
            Order History
          </Link>
          <Link to={"/wishlist"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Wishlist
          </Link>
          <Link to={"/search"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
            Search
          </Link>
          
          {user && user.role === 'admin' && (
            <Link to={"/admin"} onClick={closeMenu} style={{ color: "#38bdf8", fontWeight: "bold", display: 'flex', alignItems: 'center' }}>
              <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Admin Panel
            </Link>
          )}
          
          {/* Auth Links */}
          {user ? (
            <>
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to={"/login"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
                <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Login
              </Link>
              <Link to={"/register"} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
                <svg style={{width:'18px', marginRight:'6px', fill:'none', stroke:'currentColor', strokeWidth:'2', strokeLinecap:'round', strokeLinejoin:'round'}} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;