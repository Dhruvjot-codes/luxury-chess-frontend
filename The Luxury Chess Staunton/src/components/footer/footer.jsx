import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section">
          <h2>Luxury Chess Staunton</h2>
          <p>
            Premium handcrafted chess sets made by skilled artisans of India.
            Designed for collectors, champions, and true lovers of the game.
          </p>
        </div>

        {/* Customer Support & Policies */}
        <div className="footer-section" style={{ gridColumn: "span 2" }}>
          <h3 style={{ marginBottom: "15px", color: "var(--header-link)" }}>Customer Support & Policies</h3>

          <details style={{ marginBottom: "10px", cursor: "pointer", background: "rgba(0,0,0,0.05)", padding: "10px", borderRadius: "8px" }}>
            <summary style={{ fontWeight: "bold", fontSize: "1.05rem" }}>❓ Frequently Asked Questions</summary>
            <div style={{ padding: "10px", marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "0.9rem", color: "var(--text-color)" }}>
              <p><strong>Why this platform?</strong><br />We connect you directly to authentic, premium artisans of India, ensuring flawless craftsmanship and the lowest prices without middlemen.</p>
              <p style={{ marginTop: "10px" }}><strong>Are chess boards available or not?</strong><br />Yes, for now, high quality boards are fully available with your pieces!</p>
              <p style={{ marginTop: "10px" }}><strong>What materials are you using?</strong><br />We strictly use Grade-A ethically sourced Boxwood, Ebony, Rosewood, and Padauk woods natively imported.</p>
            </div>
          </details>

          <details style={{ marginBottom: "10px", cursor: "pointer", background: "rgba(0,0,0,0.05)", padding: "10px", borderRadius: "8px" }}>
            <summary style={{ fontWeight: "bold", fontSize: "1.05rem" }}>📦 Shipping Policy</summary>
            <div style={{ padding: "10px", marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "0.9rem", color: "var(--text-color)" }}>
              Fast and highly secure global shipping via DHL/FedEx. Dispatches are made instantly after the 24-hour approval span. Transit usually takes 1-2 weeks internationally. Tracking tags are supplied via email natively.
            </div>
          </details>

          <details style={{ marginBottom: "10px", cursor: "pointer", background: "rgba(0,0,0,0.05)", padding: "10px", borderRadius: "8px" }}>
            <summary style={{ fontWeight: "bold", fontSize: "1.05rem" }}>↩️ Return Policy</summary>
            <div style={{ padding: "10px", marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "0.9rem", color: "var(--text-color)" }}>
              We enforce a strict and guaranteed 7-day return policy specifically for transit damages or manufacturing defects. Items must inherently maintain their original boxing elements for a successful dispute.
            </div>
          </details>

          <details style={{ marginBottom: "10px", cursor: "pointer", background: "rgba(0,0,0,0.05)", padding: "10px", borderRadius: "8px" }}>
            <summary style={{ fontWeight: "bold", fontSize: "1.05rem" }}>🔒 Privacy Policy</summary>
            <div style={{ padding: "10px", marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "0.9rem", color: "var(--text-color)" }}>
              Your integrity is pristine. None of your data is silently harvested to third parties. We preserve emails only for direct communication, and all payments traverse safely heavily encrypted backbones smoothly.
            </div>
          </details>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: luxurychessstaunton@gmail.com</p>
          <p>Phone: +91 81468 69295</p>
          <p className="whatsapp-contact">
            <strong>WhatsApp:</strong> +91 81468 69295
            <a 
              href="https://wa.me/918146869295?text=Hello!%20I%20am%20interested%20in%20your%20chess%20products." 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.078-.458-.122-.162-.697-1.612-.96-2.185-.263-.572-.528-.495-.67-.504-.142-.009-.304-.009-.466 0-.163.009-.425.149-.647.398-.223.249-.852.832-.852 2.032 0 1.2.876 2.357 1 2.482.122.124 1.718 2.621 4.165 3.678 2.447 1.056 2.447.707 2.933.662.486-.045 1.612-.662 1.839-1.301.223-.639.223-1.186.154-1.301-.069-.115-.266-.199-.56-.348z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </p>
          <p>India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p> 2026 Luxury Chess Staunton. All Rights Reserved.</p>
      </div>

    </footer >
  );
};

export default Footer;