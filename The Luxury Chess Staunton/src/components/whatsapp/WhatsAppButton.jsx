import React, { useState, useEffect } from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+919876543210'); // Default number
  const [message, setMessage] = useState('Hello! I am interested in your chess products.');

  useEffect(() => {
    // Load WhatsApp number from environment or use default
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+918146869295';
    setPhoneNumber(whatsappNumber);

    // Show button after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="whatsapp-button-container">
      <button 
        className="whatsapp-button"
        onClick={handleWhatsAppClick}
        aria-label="Contact us on WhatsApp"
      >
        <svg 
          className="whatsapp-icon" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.078-.458-.122-.162-.697-1.612-.96-2.185-.263-.572-.528-.495-.67-.504-.142-.009-.304-.009-.466 0-.163.009-.425.149-.647.398-.223.249-.852.832-.852 2.032 0 1.2.876 2.357 1 2.482.122.124 1.718 2.621 4.165 3.678 2.447 1.056 2.447.707 2.933.662.486-.045 1.612-.662 1.839-1.301.223-.639.223-1.186.154-1.301-.069-.115-.266-.199-.56-.348z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
        </svg>
      </button>
      
      <div className="whatsapp-tooltip">
        Chat with us on WhatsApp!
      </div>
    </div>
  );
};

export default WhatsAppButton;
