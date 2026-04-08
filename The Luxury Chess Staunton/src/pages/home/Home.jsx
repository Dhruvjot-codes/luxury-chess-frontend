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
      <HeroSlideshow />
      {featuredProducts.length > 0 && (
        <section id="products" className="home-collection-section" style={{ padding: "80px 0", textAlign: "center", width: "100%" }}>
          <div className="section-head" style={{ marginBottom: "50px", padding: "0 20px" }}>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 8vw, 4rem)", marginBottom: "15px", fontWeight: "900", color: "#2563eb", letterSpacing: "4px" }}>THE ENTIRE COLLECTION</h2>
            <div className="section-line" style={{ width: "120px", height: "6px", background: "#2563eb", margin: "0 auto", borderRadius: "3px" }}></div>
            <p className="section-sub" style={{ marginTop: "25px", fontSize: "1.3rem", fontWeight: "600", opacity: "0.9", maxWidth: "800px", margin: "25px auto 0" }}>Handpicked masterpieces for the true connoisseur. Discover excellence in every piece.</p>
          </div>
          
          <div className="product-grid section-full-width" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "0", width: "100%" }}>
            {featuredProducts.map(card => (
              <div 
                key={card._id} 
                className="luxury-card"
                style={{ 
                  background: "var(--bg-color)", 
                  border: orderStatus[card._id] === 'success' ? "2px solid #10b981" : "1px solid rgba(37, 99, 235, 0.1)", 
                  borderRadius: "20px", 
                  overflow: "hidden", 
                  transition: "all 0.4s cubic-bezier(0.1, 0, 0.2, 1)",
                  position: "relative",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                }} 
              >
                {/* SUCCESS OVERLAY */}
                {orderStatus[card._id] === 'success' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✓</div>
                    <h3 style={{ margin: 0 }}>ORDER PLACED!</h3>
                    <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Check your profile for status</p>
                  </div>
                )}

                {/* TOUCH-READY IMAGE CAROUSEL */}
                {card.images && card.images.length > 0 && (
                  <div className="card-image-wrap" style={{ position: 'relative', overflow: 'hidden', height: "300px" }}>
                    <div 
                      className="image-carousel-container" 
                      style={{ 
                        display: 'flex', 
                        overflowX: 'auto', 
                        scrollSnapType: 'x mandatory', 
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        width: '100%',
                        height: '100%',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {card.images.map((img, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            flex: '0 0 100%', 
                            width: '100%', 
                            height: '100%', 
                            scrollSnapAlign: 'center' 
                          }}
                        >
                          <img 
                            src={getImageUrl(img)} 
                            alt={`${card.title} - ${index + 1}`} 
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover", 
                              pointerEvents: 'none' /* Prevents ghosting while swiping */
                            }} 
                            onClick={() => navigate('/products')}
                          />
                        </div>
                      ))}
                    </div>

                    {/* LUXURY BADGE */}
                    <div className="luxury-badge" style={{ position: 'absolute', top: '15px', left: '15px', background: '#2563eb', color: '#ffffff', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', zIndex: 10 }}>
                      PREMIUM
                    </div>

                    {/* INDICATOR DOTS FOR MULTI-IMAGE */}
                    {card.images.length > 1 && (
                      <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10, background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '10px', backdropFilter: 'blur(4px)' }}>
                         {card.images.map((_, i) => (
                           <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white', opacity: i === 0 ? 1 : 0.4 }}></div>
                         ))}
                      </div>
                    )}

                    {/* SWIPE HINT */}
                    {card.images.length > 1 && (
                       <div className="swipe-hint" style={{ position: 'absolute', top: '15px', right: '15px', color: 'white', background: 'rgba(37, 99, 235, 0.8)', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px' }}>
                         SWIPE
                       </div>
                    )}
                  </div>
                )}
                
                <div className="card-content" style={{ padding: "24px", textAlign: "left" }}>
                  <span className="card-tag" style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Fine Craftsmanship</span>
                  <h3 style={{ margin: "5px 0 12px 0", fontSize: "1.4rem", fontWeight: "700" }}>{card.title}</h3>
                  <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>{card.description.substring(0, 100)}...</p>
                  <div className="card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p className="price" style={{ fontWeight: "800", fontSize: "1.3rem", color: "#2563eb", margin: 0 }}>₹{card.pricePerPiece}</p>
                    <button className="details-btn" onClick={() => navigate('/products')} style={{ background: "transparent", border: "1px solid #2563eb", color: "#2563eb", padding: "8px 16px", borderRadius: "6px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", transition: "0.3s" }}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="explore-collection-section" style={{ padding: "40px 20px" }}>
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