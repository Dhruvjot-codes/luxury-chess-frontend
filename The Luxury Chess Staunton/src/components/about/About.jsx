import React, { useState, useEffect } from "react";
import "./About.css";
import horseImage from "../../assets/horse 2.jpeg";
import horseImage2 from "../../assets/horse.jpeg";
import { getImageUrl, settingsService } from "../../services/api";

const About = () => {
  const [images, setImages] = useState([horseImage, horseImage2]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await settingsService.getSection('about');
        if (data && data.value && data.value.length > 0) {
          setImages(data.value);
        }
      } catch (err) {
        console.log("Using static about images");
      }
    };
    fetchImages();
  }, []);

  return (
    <section id="about" className="about">

      <div className="about-container">

        {/* LEFT IMAGE STACK */}
        <div className="about-image luxury-shape-stack">
           <div className="shape-blur-glow"></div>
           <div className="image-stack">
              <img src={getImageUrl(images[0]) || horseImage} alt="Handcrafted Chess Piece 1" className="stack-img top" />
              <img src={getImageUrl(images[1]) || horseImage2} alt="Handcrafted Chess Piece 2" className="stack-img bottom" />
           </div>
        </div>

        {/* RIGHT TEXT */}
        <div className="about-text">

          <h2>About Luxury Chess Staunton</h2>

          <p>
            At Luxury Chess Staunton, we believe chess is more than a game —
            it is a symbol of strategy, patience, and timeless elegance.
            Our handcrafted chess sets are created by skilled artisans of India
            who dedicate countless hours to perfect every single piece.
          </p>

          <p>
            Each chess set represents tradition, precision craftsmanship,
            and the passion of generations of master carvers. When you buy
            from us, you are not just purchasing a chess board — you are
            owning a piece of art.
          </p>

          <p className="about-highlight">
            ♟ Trusted by players worldwide. Crafted with passion in India.
          </p>

          {/* SOCIAL LINKS */}
          <div className="about-socials">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">YouTube</a>
            <a href="#">Twitter</a>
          </div>

          {/* CONTACT INFO */}
          <div id="contact" style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eaeaea" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "1.4em", color: "#333" }}>Contact Us</h3>
            <p style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
              <span style={{ fontSize: "1.1em", fontWeight: "600" }}>+91 81468 69295</span>
              <a 
                href="https://wa.me/918146869295" 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  background: "#25D366", 
                  color: "white", 
                  padding: "8px 16px", 
                  borderRadius: "24px", 
                  textDecoration: "none", 
                  fontWeight: "bold",
                  fontSize: "0.95em",
                  transition: "transform 0.2s"
                }}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                  alt="WhatsApp" 
                  style={{ width: "20px", marginRight: "8px", filter: "brightness(0) invert(1)" }} 
                />
                Chat on WhatsApp
              </a>
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default About;