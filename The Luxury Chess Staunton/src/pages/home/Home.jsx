import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import heroImage from "../../assets/horse.jpeg";
import heroImage2 from "../../assets/horse 2.jpeg";
import Testimonials from "../../components/testimonials/testimonials";
import AdminCreateCard from "../../components/adminCreateCard/AdminCreateCard";
import About from "../../components/about/About";
import Footer from "../../components/footer/footer";
import HeroSlideshow from "../../components/slideshow/HeroSlideshow";
import { getAuthToken, getStoredUser, cardService, getImageUrl, orderService, settingsService } from "../../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [sectionImages, setSectionImages] = useState({ explore: [heroImage, heroImage2] });
  
  // New States for Direct Ordering
  const [quantities, setQuantities] = useState({});
  const [orderStatus, setOrderStatus] = useState({}); // { cardId: 'idle' | 'loading' | 'success' }
  const [expandedDesc, setExpandedDesc] = useState({}); // { cardId: boolean }

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }

    // Load featured products with proper error handling
    const loadFeaturedProducts = async () => {
      try {
        const data = await cardService.getAll();
        setFeaturedProducts(data);
        
        // Initialize quantities to 1
        const initialQuants = {};
        data.forEach(p => initialQuants[p._id] = 1);
        setQuantities(initialQuants);
      } catch (err) {
        console.log("Failed to load featured products", err);
      }
    };

    loadFeaturedProducts();

    // Load Section Images
    const loadSectionImages = async () => {
      try {
        const data = await settingsService.getSection('explore');
        if (data && data.value && data.value.length > 0) {
          setSectionImages(prev => ({ ...prev, explore: data.value }));
        }
      } catch (err) {
        console.log("Using static explore images");
      }
    };
    loadSectionImages();
  }, []);

  const handleUpdateQuantity = (cardId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [cardId]: Math.max(1, (prev[cardId] || 1) + delta)
    }));
  };

  const handlePlaceOrder = async (cardId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setOrderStatus(prev => ({ ...prev, [cardId]: 'loading' }));

    try {
      const quantity = quantities[cardId] || 1;
      await orderService.createRequest(cardId, quantity, "Direct order from home page");
      
      setOrderStatus(prev => ({ ...prev, [cardId]: 'success' }));
      
      // Reset after 3 seconds
      setTimeout(() => {
        setOrderStatus(prev => ({ ...prev, [cardId]: 'idle' }));
      }, 3000);

    } catch (err) {
      alert("Failed to place order: " + err.message);
      setOrderStatus(prev => ({ ...prev, [cardId]: 'idle' }));
    }
  };

  const toggleDescription = (cardId) => {
    setExpandedDesc(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="home-page">
      {/* HERO SLIDESHOW - Hidden on mobile for better UX */}
      <div className="desktop-only">
        <HeroSlideshow />
      </div>
      
      {/* PRODUCTS CARDS SECTION - Now first on mobile */}
      {featuredProducts.length > 0 && (
        <section id="products" className="home-collection-section" style={{ padding: "clamp(10px, 2vw, 30px) 0", textAlign: "center", width: "100%" }}>
          <div className="section-head" style={{ marginBottom: "clamp(15px, 3vw, 30px)", padding: "0 20px" }}>
            <h2 className="section-title" style={{ fontSize: "clamp(1.5rem, 6vw, 3rem)", marginBottom: "15px", fontWeight: "900", color: "#2563eb", letterSpacing: "2px" }}>THE ENTIRE COLLECTION</h2>
            <div className="section-line" style={{ width: "60px", height: "3px", background: "#2563eb", margin: "0 auto", borderRadius: "2px" }}></div>
            <p className="section-sub" style={{ marginTop: "15px", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", fontWeight: "600", opacity: "0.9", maxWidth: "600px", margin: "15px auto 0" }}>Handpicked masterpieces for the true connoisseur. Discover excellence in every piece.</p>
          </div>
          
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", width: "100%", padding: "0 20px" }}>
            {featuredProducts.map(card => {
              const discountedPrice = Math.floor(card.pricePerPiece * (1 - (card.discountPercentage || 0) / 100));
              return (
                <div 
                  key={card._id} 
                  className="home-product-card"
                  onClick={() => navigate(`/products/${card._id}`)}
                  style={{ 
                    background: "#ffffff", 
                    border: orderStatus[card._id] === 'success' ? "2px solid #10b981" : "1px solid rgba(37, 99, 235, 0.12)", 
                    borderRadius: "22px", 
                    overflow: "hidden", 
                    transition: "all 0.35s ease", 
                    position: "relative", 
                    boxShadow: "0 12px 35px rgba(37, 99, 235, 0.12)",
                    cursor: "pointer",
                    minHeight: "520px"
                  }}
                >
                  {orderStatus[card._id] === 'success' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.92)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>✓</div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem' }}>ORDER PLACED</h3>
                      <p style={{ fontSize: '0.95rem', marginTop: '8px' }}>Your request was submitted successfully.</p>
                    </div>
                  )}

                  <div style={{ position: 'relative', overflow: 'hidden', height: '320px' }}>
                    {card.images && card.images.length > 0 ? (
                      <img
                        src={getImageUrl(card.images[0])}
                        alt={card.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        Image not available
                      </div>
                    )}

                    <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#ffffffcc', color: '#1f2937', padding: '6px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700', boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)' }}>
                      Stock: {card.pieceCount}
                    </div>
                  </div>

                  <div style={{ padding: '22px 20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ color: '#2563eb', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Luxury Chess Set</span>
                      {card.discountPercentage > 0 && (
                        <span style={{ color: '#dc2626', fontWeight: '800', fontSize: '0.8rem' }}>{card.discountPercentage}% OFF</span>
                      )}
                    </div>

                    <h3 style={{ margin: '0 0 14px', fontSize: '1.35rem', lineHeight: '1.2', color: '#0f172a' }}>{card.title}</h3>

                    <p style={{ margin: '0 0 18px', color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', minHeight: '68px' }}>{card.description?.substring(0, 110)}{card.description?.length > 110 ? '...' : ''}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#111827' }}>₹{discountedPrice}</div>
                        {card.discountPercentage > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', color: '#6b7280' }}>
                            <span style={{ textDecoration: 'line-through' }}>₹{card.pricePerPiece}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Save ₹{Math.floor(card.pricePerPiece - discountedPrice)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
                      <div style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '700' }}>Stock available: {card.pieceCount}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleUpdateQuantity(card._id, -1);
                          }}
                          style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'white', cursor: 'pointer', color: '#0f172a' }}
                        >-</button>
                        <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '700' }}>{quantities[card._id] || 1}</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(card._id, 1); }}
                          style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.12)', background: 'white', cursor: 'pointer', color: '#0f172a' }}
                        >+</button>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handlePlaceOrder(card._id); }}
                      style={{ width: '100%', border: 'none', borderRadius: '14px', background: '#2563eb', color: 'white', fontWeight: '800', padding: '16px', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 14px 30px rgba(37, 99, 235, 0.18)' }}
                    >
                      Order Now
                    </button>

                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); navigate(`/products/${card._id}`); }}
                      style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '14px', background: 'white', color: '#111827', fontWeight: '700', padding: '14px', fontSize: '0.9rem', marginTop: '12px', cursor: 'pointer' }}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EXCLUSIVE COLLECTION SECTION */}
      <section className="explore-collection-section" style={{ padding: "20px 20px" }}>
        <div className="hero-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* LEFT TEXT SECTION */}
          <div className="hero-text glass-card">
            <h1>
              Crafted for Kings. <br/> Played by Legends.
            </h1>

            <p>
              Discover the beauty of handcrafted chess sets made by skilled
              artisans of India. Every piece reflects dedication, precision,
              and timeless tradition. Elevate your game with luxury chess
              crafted for champions.
            </p>

            <button className="hero-btn" onClick={() => navigate('/products')}>
              Explore Collection
            </button>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="hero-image luxury-shape-stack">
            <div className="shape-blur-glow"></div>
            <div className="image-stack">
                <img src={getImageUrl(sectionImages.explore[0]) || heroImage} alt="Luxury Chess Piece 1" className="stack-img top" />
                <img src={getImageUrl(sectionImages.explore[1]) || heroImage2} alt="Luxury Chess Piece 2" className="stack-img bottom" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <About />  

      {/* TESTIMONIAL SECTION */}
      <Testimonials />

      {user && user.role === 'admin' && <AdminCreateCard />}  

      {/* FOOTER */}      
      <Footer />
       
    </div>
  );
};

export default Home;