import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import heroImage from "../../assets/horse.jpeg";
import Testimonials from "../../components/testimonials/testimonials";
import AdminCreateCard from "../../components/adminCreateCard/AdminCreateCard";
import About from "../../components/about/About";
import Footer from "../../components/footer/footer";
import { getAuthToken, getStoredUser, cardService, getImageUrl } from "../../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

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
        setFeaturedProducts(data.slice(0, 3)); // Display top 3 products
      } catch (err) {
        console.log("Failed to load featured products", err);
        // Don't show error to user, just log it
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-container">
          {/* LEFT TEXT SECTION */}
          <div className="hero-text">
            <h1>
              Crafted for Kings. Played by Legends.
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
          <div className="hero-image">
            <img src={heroImage} alt="Luxury Chess Piece" />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: "60px 20px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "40px", fontWeight: "bold" }}>Our Showcase Sets</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
            {featuredProducts.map(card => (
              <div key={card._id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "15px", overflow: "hidden", cursor: "pointer", transition: "transform 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"} onClick={() => navigate('/products')}>
                {card.images && card.images.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    <img src={getImageUrl(card.images[0])} alt={card.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderBottom: "3px solid #4542f5" }} />
                    {card.images.length > 1 && (
                      <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '11px' }}>
                        {card.images.length} Photos
                      </div>
                    )}
                  </div>
                )}
                <div style={{ padding: "20px", textAlign: "left" }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.3rem" }}>{card.title}</h3>
                  <p style={{ margin: "0 0 15px 0", opacity: "0.8", fontSize: "0.95rem" }}>{card.description.substring(0, 80)}...</p>
                  <p style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#4542f5", margin: 0 }}>₹{card.pricePerPiece}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/products')} 
            style={{ marginTop: "40px", padding: "12px 30px", background: "transparent", border: "2px solid #4542f5", color: "#4542f5", borderRadius: "30px", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold", transition: "0.3s" }}
            onMouseOver={(e) => { e.target.style.background = "#4542f5"; e.target.style.color = "white"; }}
            onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#4542f5"; }}
          >
            View Entire Collection
          </button>
        </section>
      )}

      {/* ABOUT US SECTION */}
      <About />  

      {/* TESTIMONIAL SECTION */}
      <Testimonials />

      {user && user.role === 'admin' && <AdminCreateCard />}  

      {/* FOOTER */}      
      <Footer />
       
    </>
  );
};

export default Home;